'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const WORDS = (
  'apple brave cloud delta ember forest galaxy harbor island jungle kite lemon meadow ' +
  'nectar orbit pepper quartz river sable tiger umbrella violet willow xenon yellow zephyr ' +
  'anchor breeze canyon desert echo falcon glacier horizon indigo jasper koala lantern ' +
  'marble nimbus opal prairie quill ridge summit thunder unity valley whisper xylophone ' +
  'yonder zenith amber blossom coral dawn ember flame granite honey ivory jade knight'
).split(' ');

function randomWord() {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return WORDS[bytes[0] % WORDS.length];
}

function generate(wordCount: number, separator: string, capitalize: boolean, includeNumber: boolean) {
  const words = Array.from({ length: wordCount }, () => {
    const w = randomWord();
    return capitalize ? w.charAt(0).toUpperCase() + w.slice(1) : w;
  });
  if (includeNumber) {
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    words.push(String(bytes[0] % 100));
  }
  return words.join(separator);
}

export function PassphraseGenerator() {
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [passphrase, setPassphrase] = useState(() => generate(4, '-', true, true));

  function regenerate() {
    setPassphrase(generate(wordCount, separator, capitalize, includeNumber));
  }

  return (
    <ToolShell outputValue={passphrase} onReset={regenerate} shareSlug="passphrase-generator">
      <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 text-center font-mono text-xl tracking-wide dark:border-white/10 dark:bg-white/5 break-all">
        {passphrase}
      </div>

      <Button size="sm" variant="secondary" onClick={regenerate}>
        <RefreshCw className="h-4 w-4" /> Regenerate
      </Button>

      <div>
        <div className="mb-1 flex justify-between text-sm"><span>Number of words</span><span>{wordCount}</span></div>
        <input
          type="range"
          min={3}
          max={8}
          value={wordCount}
          onChange={(e) => {
            const v = Number(e.target.value);
            setWordCount(v);
            setPassphrase(generate(v, separator, capitalize, includeNumber));
          }}
          className="w-full accent-primary-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {['-', '_', ' ', '.'].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={separator === s ? 'primary' : 'outline'}
              onClick={() => {
                setSeparator(s);
                setPassphrase(generate(wordCount, s, capitalize, includeNumber));
              }}
            >
              {s === ' ' ? 'space' : s}
            </Button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={capitalize}
            onChange={(e) => {
              setCapitalize(e.target.checked);
              setPassphrase(generate(wordCount, separator, e.target.checked, includeNumber));
            }}
            className="accent-primary-500"
          />
          Capitalize
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includeNumber}
            onChange={(e) => {
              setIncludeNumber(e.target.checked);
              setPassphrase(generate(wordCount, separator, capitalize, e.target.checked));
            }}
            className="accent-primary-500"
          />
          Add a number
        </label>
      </div>
    </ToolShell>
  );
}
