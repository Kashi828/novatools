'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

function evaluate(expr: string): number {
  const tokens = tokenize(expr);
  let pos = 0;

  function peek() {
    return tokens[pos];
  }
  function next() {
    return tokens[pos++];
  }

  function parseExpression(): number {
    let value = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = next();
      const rhs = parseTerm();
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  }

  function parseTerm(): number {
    let value = parsePower();
    while (peek() === '*' || peek() === '/') {
      const op = next();
      const rhs = parsePower();
      value = op === '*' ? value * rhs : value / rhs;
    }
    return value;
  }

  function parsePower(): number {
    const base = parseUnary();
    if (peek() === '^') {
      next();
      const exponent = parsePower();
      return Math.pow(base, exponent);
    }
    return base;
  }

  function parseUnary(): number {
    if (peek() === '-') {
      next();
      return -parseUnary();
    }
    return parseAtom();
  }

  const FUNCS: Record<string, (n: number) => number> = {
    sin: (n) => Math.sin(n),
    cos: (n) => Math.cos(n),
    tan: (n) => Math.tan(n),
    log: (n) => Math.log10(n),
    ln: (n) => Math.log(n),
    sqrt: (n) => Math.sqrt(n),
  };

  function parseAtom(): number {
    const tok = next();
    if (tok === undefined) throw new Error('Unexpected end of expression');
    if (tok === '(') {
      const value = parseExpression();
      if (next() !== ')') throw new Error('Expected )');
      return value;
    }
    if (tok in FUNCS) {
      if (next() !== '(') throw new Error(`Expected ( after ${tok}`);
      const arg = parseExpression();
      if (next() !== ')') throw new Error('Expected )');
      return FUNCS[tok](arg);
    }
    if (tok === 'pi') return Math.PI;
    if (tok === 'e') return Math.E;
    const num = Number(tok);
    if (Number.isNaN(num)) throw new Error(`Unexpected token: ${tok}`);
    return num;
  }

  const result = parseExpression();
  if (pos !== tokens.length) throw new Error('Unexpected trailing input');
  return result;
}

function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
    } else if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) num += expr[i++];
      tokens.push(num);
    } else if (/[a-zA-Z]/.test(ch)) {
      let word = '';
      while (i < expr.length && /[a-zA-Z]/.test(expr[i])) word += expr[i++];
      tokens.push(word);
    } else if ('+-*/^()'.includes(ch)) {
      tokens.push(ch);
      i++;
    } else {
      throw new Error(`Unsupported character: ${ch}`);
    }
  }
  return tokens;
}

const BUTTONS = [
  ['sin(', 'cos(', 'tan(', 'sqrt('],
  ['log(', 'ln(', 'pi', 'e'],
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '(', ')'],
];

export function ScientificCalculator() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function press(token: string) {
    setExpr((e) => e + token);
  }

  function calculate() {
    try {
      const value = evaluate(expr);
      setResult(String(Math.round(value * 1e10) / 1e10));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid expression');
      setResult(null);
    }
  }

  function reset() {
    setExpr('');
    setResult(null);
    setError(null);
  }

  return (
    <ToolShell outputValue={result ?? undefined} onReset={reset} shareSlug="scientific-calculator">
      <input
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && calculate()}
        placeholder="e.g. sin(pi/2) + sqrt(16)"
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-lg outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      {result !== null && (
        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-center font-heading text-3xl font-bold dark:border-white/10 dark:bg-white/5">
          {result}
        </div>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-4 gap-2">
        {BUTTONS.flat().map((b) => (
          <Button key={b} variant="outline" size="sm" onClick={() => press(b)}>
            {b.replace('(', '')}
          </Button>
        ))}
      </div>
      <Button className="w-full" onClick={calculate}>
        Calculate
      </Button>
    </ToolShell>
  );
}
