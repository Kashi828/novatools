'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Select } from '@/components/ui/select';
import { X } from 'lucide-react';

const GRADE_POINTS: Record<string, number> = { 'A+': 4.0, A: 4.0, 'A-': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7, 'C+': 2.3, C: 2.0, 'C-': 1.7, D: 1.0, F: 0.0 };

interface Course {
  name: string;
  credits: string;
  grade: string;
}

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { name: 'Course 1', credits: '3', grade: 'A' },
    { name: 'Course 2', credits: '4', grade: 'B+' },
    { name: 'Course 3', credits: '3', grade: 'A-' },
  ]);

  function update(i: number, field: keyof Course, val: string) {
    setCourses((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)));
  }
  function addCourse() {
    setCourses((prev) => [...prev, { name: `Course ${prev.length + 1}`, credits: '3', grade: 'A' }]);
  }
  function removeCourse(i: number) {
    setCourses((prev) => prev.filter((_, idx) => idx !== i));
  }

  const gpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const c of courses) {
      const credits = parseFloat(c.credits);
      if (!credits || !(c.grade in GRADE_POINTS)) continue;
      totalPoints += credits * GRADE_POINTS[c.grade];
      totalCredits += credits;
    }
    return totalCredits ? totalPoints / totalCredits : null;
  }, [courses]);

  return (
    <ToolShell outputValue={gpa !== null ? `GPA: ${gpa.toFixed(2)}` : undefined} shareSlug="gpa-calculator">
      <div className="space-y-2">
        {courses.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_100px_auto] items-center gap-2">
            <input value={c.name} onChange={(e) => update(i, 'name', e.target.value)} className="rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
            <input type="number" value={c.credits} onChange={(e) => update(i, 'credits', e.target.value)} placeholder="Credits" className="rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
            <Select value={c.grade} onChange={(v) => update(i, 'grade', v)} options={Object.keys(GRADE_POINTS)} />
            <button onClick={() => removeCourse(i)} className="text-black/30 hover:text-danger dark:text-white/30"><X className="h-4 w-4" /></button>
          </div>
        ))}
        <button onClick={addCourse} className="text-sm text-primary-500 hover:underline">+ Add course</button>
      </div>

      {gpa !== null && (
        <div className="rounded-xl2 border border-primary-400/30 bg-primary-50 p-6 text-center dark:bg-primary-500/10">
          <div className="font-heading text-4xl font-bold text-primary-600 dark:text-primary-400">{gpa.toFixed(2)}</div>
          <div className="mt-1 text-sm text-black/50 dark:text-white/50">Cumulative GPA (4.0 scale)</div>
        </div>
      )}
    </ToolShell>
  );
}
