'use client';

import { useEffect, useRef, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: { transcript: string };
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
}

const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'Microphone access was blocked. Allow microphone access for this site and try again.',
  'no-speech': "Didn't catch that — no speech detected. Try speaking again.",
  'audio-capture': 'No microphone was found. Check that one is connected and try again.',
  network: 'A network error interrupted speech recognition — this feature needs an internet connection.',
  aborted: '',
};

export function SpeechToText() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const wantsListeningRef = useRef(false);

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript + ' ';
      }
      if (finalText) setTranscript((prev) => prev + finalText);
    };

    recognition.onerror = (event) => {
      const message = ERROR_MESSAGES[event.error] ?? `Speech recognition error: ${event.error}`;
      if (message) setError(message);
      if (event.error === 'not-allowed' || event.error === 'audio-capture') {
        wantsListeningRef.current = false;
        setListening(false);
      }
    };

    recognition.onend = () => {
      if (wantsListeningRef.current) {
        try {
          recognition.start();
        } catch {
          setListening(false);
          wantsListeningRef.current = false;
        }
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;
    return () => {
      wantsListeningRef.current = false;
      recognition.stop();
    };
  }, []);

  function start() {
    setError(null);
    wantsListeningRef.current = true;
    setListening(true);
    try {
      recognitionRef.current?.start();
    } catch {
      // Already started — ignore, this can happen from rapid double-clicks.
    }
  }

  function stop() {
    wantsListeningRef.current = false;
    recognitionRef.current?.stop();
    setListening(false);
  }

  if (!supported) {
    return (
      <ToolShell shareSlug="speech-to-text">
        <p className="text-sm text-danger">Your browser doesn&rsquo;t support speech recognition. Try Chrome or Edge.</p>
      </ToolShell>
    );
  }

  return (
    <ToolShell outputValue={transcript || undefined} onReset={() => setTranscript('')} shareSlug="speech-to-text">
      <div className="flex gap-2">
        {!listening ? (
          <Button onClick={start}>
            <Mic className="h-4 w-4" /> Start listening
          </Button>
        ) : (
          <Button variant="danger" onClick={stop}>
            <Square className="h-4 w-4" /> Stop
          </Button>
        )}
      </div>
      {listening && <p className="text-sm text-primary-500">Listening... speak now.</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        rows={8}
        placeholder="Your speech will appear here..."
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />
      <p className="text-xs text-black/40 dark:text-white/40">
        Audio is processed by your browser (via its speech recognition service) — nothing is stored by NovaTools. Needs
        microphone permission and an internet connection.
      </p>
    </ToolShell>
  );
}
