'use client';

import { useEffect, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Play, Square } from 'lucide-react';

export function TextToSpeech() {
  const [text, setText] = useState('Welcome to NovaTools. This is your browser reading text out loud, for free.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    function loadVoices() {
      const list = window.speechSynthesis.getVoices();
      if (list.length) setVoices(list);
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  function speak() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[voiceIndex]) utterance.voice = voices[voiceIndex];
    utterance.rate = rate;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  if (!supported) {
    return (
      <ToolShell shareSlug="text-to-speech">
        <p className="text-sm text-danger">Your browser doesn&rsquo;t support speech synthesis. Try Chrome, Edge, or Safari.</p>
      </ToolShell>
    );
  }

  return (
    <ToolShell onReset={() => setText('')} shareSlug="text-to-speech">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Voice</label>
          <Select
            value={String(voiceIndex)}
            onChange={(v) => setVoiceIndex(Number(v))}
            options={voices.map((v, i) => ({ value: String(i), label: `${v.name} (${v.lang})` }))}
          />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm"><span>Speed</span><span>{rate.toFixed(1)}x</span></div>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-3 w-full accent-primary-500" />
        </div>
      </div>

      <div className="flex gap-2">
        {!speaking ? (
          <Button onClick={speak} disabled={!text.trim()}>
            <Play className="h-4 w-4" /> Speak
          </Button>
        ) : (
          <Button variant="danger" onClick={stop}>
            <Square className="h-4 w-4" /> Stop
          </Button>
        )}
      </div>
    </ToolShell>
  );
}
