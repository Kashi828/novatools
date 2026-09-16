'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Eye, EyeOff } from 'lucide-react';

function analyze(password: string) {
  const checks = {
    length12: password.length >= 12,
    length8: password.length >= 8,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
    noCommon: !['password', '123456', 'qwerty', 'letmein', 'admin'].includes(password.toLowerCase()),
  };

  let poolSize = 0;
  if (checks.lower) poolSize += 26;
  if (checks.upper) poolSize += 26;
  if (checks.number) poolSize += 10;
  if (checks.symbol) poolSize += 32;
  const entropy = password.length && poolSize ? Math.round(password.length * Math.log2(poolSize)) : 0;

  const score = [checks.length8, checks.length12, checks.lower && checks.upper, checks.number, checks.symbol, checks.noCommon].filter(Boolean).length;

  let label = 'Very weak';
  let color = 'bg-danger';
  if (score >= 5) {
    label = 'Very strong';
    color = 'bg-success';
  } else if (score >= 4) {
    label = 'Strong';
    color = 'bg-success';
  } else if (score >= 3) {
    label = 'Moderate';
    color = 'bg-warning';
  } else if (score >= 2) {
    label = 'Weak';
    color = 'bg-warning';
  }

  return { checks, entropy, score, label, color };
}

export function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const result = useMemo(() => analyze(password), [password]);

  const items = [
    { key: 'length12', label: 'At least 12 characters' },
    { key: 'lower', label: 'Contains lowercase letters' },
    { key: 'upper', label: 'Contains uppercase letters' },
    { key: 'number', label: 'Contains numbers' },
    { key: 'symbol', label: 'Contains symbols' },
    { key: 'noCommon', label: 'Not a commonly used password' },
  ] as const;

  return (
    <ToolShell onReset={() => setPassword('')} shareSlug="password-strength-checker">
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a password to check its strength"
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 pr-11 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
        <button
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"
          aria-label="Toggle visibility"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {password && (
        <>
          <div>
            <div className="mb-1 flex justify-between text-sm"><span>{result.label}</span><span>{result.entropy} bits of entropy</span></div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div className={`h-full rounded-full transition-all ${result.color}`} style={{ width: `${Math.min(100, (result.score / 6) * 100)}%` }} />
            </div>
          </div>

          <ul className="space-y-1 text-sm">
            {items.map((item) => (
              <li key={item.key} className={`flex items-center gap-2 ${result.checks[item.key] ? 'text-success' : 'text-black/40 dark:text-white/40'}`}>
                <span>{result.checks[item.key] ? '✓' : '○'}</span> {item.label}
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="text-xs text-black/40 dark:text-white/40">
        Checked entirely in your browser — this password is never sent anywhere.
      </p>
    </ToolShell>
  );
}
