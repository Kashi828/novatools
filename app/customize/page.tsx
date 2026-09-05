'use client';

import { Check, Eye, Gauge, Monitor, Palette, RotateCcw, Sparkles, Type, WandSparkles } from 'lucide-react';
import { useTheme, type ColorTheme, type FontPairing, type RadiusStyle, type UiScale, type MotionPreference, type ContrastPreference, type SurfaceStyle, type CardDensity } from '@/components/theme-provider';

const colors: Array<{ id: ColorTheme; label: string; swatch: string }> = [
  { id: 'gold', label: 'Gold', swatch: 'rgb(201 169 97)' },
  { id: 'emerald', label: 'Emerald', swatch: 'rgb(52 168 118)' },
  { id: 'sapphire', label: 'Sapphire', swatch: 'rgb(62 111 217)' },
  { id: 'rose', label: 'Rose', swatch: 'rgb(201 122 139)' },
  { id: 'monochrome', label: 'Monochrome', swatch: 'rgb(120 120 120)' },
  { id: 'custom', label: 'Custom', swatch: 'var(--color-primary-500)' },
];

const fonts: Array<{ id: FontPairing; label: string; sample: string }> = [
  { id: 'elegant', label: 'Elegant', sample: 'Playfair + Inter' },
  { id: 'modern', label: 'Modern', sample: 'Space Grotesk + Inter' },
  { id: 'classic', label: 'Classic', sample: 'Merriweather + Inter' },
  { id: 'rounded', label: 'Rounded', sample: 'Poppins + Inter' },
];
const radii: Array<{ id: RadiusStyle; label: string }> = [
  { id: 'sharp', label: 'Sharp' }, { id: 'rounded', label: 'Rounded' }, { id: 'pill', label: 'Pill' },
];
const scales: Array<{ id: UiScale; label: string; detail: string }> = [
  { id: 'compact', label: 'Compact', detail: 'More content, tighter spacing' },
  { id: 'comfortable', label: 'Comfortable', detail: 'Balanced everyday layout' },
  { id: 'large', label: 'Large', detail: 'Larger type and controls' },
];
const motions: Array<{ id: MotionPreference; label: string; detail: string }> = [
  { id: 'full', label: 'Full motion', detail: 'Use NovaTools transitions' },
  { id: 'reduced', label: 'Reduced motion', detail: 'Minimize animation' },
];
const contrasts: Array<{ id: ContrastPreference; label: string; detail: string }> = [
  { id: 'standard', label: 'Standard', detail: 'Balanced contrast and softness' },
  { id: 'high', label: 'High contrast', detail: 'Stronger text, borders and focus states' },
];
const surfaces: Array<{ id: SurfaceStyle; label: string; detail: string }> = [
  { id: 'clean', label: 'Clean', detail: 'Flat, crisp workspace' },
  { id: 'textured', label: 'Textured', detail: 'Subtle background texture' },
];
const densities: Array<{ id: CardDensity; label: string; detail: string }> = [
  { id: 'relaxed', label: 'Relaxed', detail: 'More breathing room' },
  { id: 'dense', label: 'Dense', detail: 'Tighter cards and sections' },
];

function ChoiceCard({ selected, onClick, children, detail }: { selected: boolean; onClick: () => void; children: React.ReactNode; detail?: string }) {
  return <button type="button" onClick={onClick} className={`group relative rounded-xl border p-3 text-left transition duration-200 ${selected ? 'border-primary-500/50 bg-primary-500/[0.07] shadow-sm' : 'border-black/[0.08] bg-white/70 hover:border-primary-500/25 hover:bg-white dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:bg-white/[0.05]'}`}>
    <span className="flex items-center justify-between gap-3 text-sm font-semibold"><span>{children}</span>{selected && <Check className="h-4 w-4 text-primary-500" />}</span>
    {detail && <span className="mt-1 block text-xs leading-5 text-black/50 dark:text-white/50">{detail}</span>}
  </button>;
}

export default function CustomizePage() {
  const { theme, toggleTheme, resetPreferences, colorTheme, setColorTheme, customColors, setCustomColors, fontPairing, setFontPairing, radiusStyle, setRadiusStyle, uiScale, setUiScale, motionPreference, setMotionPreference, contrastPreference, setContrastPreference, surfaceStyle, setSurfaceStyle, cardDensity, setCardDensity } = useTheme();

  return <main className="min-h-[calc(100vh-4rem)] bg-noise">
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-10 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/[0.07] px-3 py-1.5 text-xs font-semibold text-primary-700 dark:text-primary-300"><WandSparkles className="h-3.5 w-3.5" /> Personalize NovaTools</div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Make the workspace yours.</h1>
        <p className="mt-3 text-base leading-7 text-black/55 dark:text-white/55">Choose how NovaTools looks, feels and behaves. Your preferences are saved locally and apply across the site.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_310px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-black/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-6">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400"><Monitor className="h-4 w-4" /></div><div><h2 className="font-heading text-lg font-semibold">Appearance</h2><p className="text-sm text-black/50 dark:text-white/50">Core visual mode and brand accent.</p></div></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ChoiceCard selected={theme === 'light'} onClick={() => theme === 'dark' && toggleTheme()} detail="Bright surfaces and dark text">Light mode</ChoiceCard>
              <ChoiceCard selected={theme === 'dark'} onClick={() => theme === 'light' && toggleTheme()} detail="Dark surfaces with softened contrast">Dark mode</ChoiceCard>
            </div>
            <h3 className="mb-3 mt-6 text-sm font-semibold">Accent color</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {colors.map((item) => <button key={item.id} type="button" onClick={() => setColorTheme(item.id)} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${colorTheme === item.id ? 'border-primary-500/50 bg-primary-500/[0.07]' : 'border-black/[0.08] hover:border-primary-500/25 dark:border-white/[0.09]'}`}><span className="h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white dark:ring-zinc-950" style={{ backgroundColor: item.swatch }} /><span className="font-medium">{item.label}</span>{colorTheme === item.id && <Check className="ml-auto h-4 w-4 text-primary-500" />}</button>)}
            </div>
            {colorTheme === 'custom' && <div className="mt-4 grid gap-3 sm:grid-cols-3">{(['primary','secondary','accent'] as const).map((key) => <label key={key} className="text-xs font-semibold capitalize text-black/60 dark:text-white/60">{key}<input type="color" value={customColors[key]} onChange={(e) => setCustomColors({ ...customColors, [key]: e.target.value })} className="mt-2 h-11 w-full cursor-pointer rounded-lg border border-black/10 bg-transparent p-1 dark:border-white/10" /></label>)}</div>}
          </section>

          <section className="rounded-2xl border border-black/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-6">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400"><Type className="h-4 w-4" /></div><div><h2 className="font-heading text-lg font-semibold">Typography & shape</h2><p className="text-sm text-black/50 dark:text-white/50">Tune the personality and geometry of the interface.</p></div></div>
            <h3 className="mb-3 text-sm font-semibold">Font pairing</h3><div className="grid gap-3 sm:grid-cols-2">{fonts.map(item => <ChoiceCard key={item.id} selected={fontPairing === item.id} onClick={() => setFontPairing(item.id)} detail={item.sample}>{item.label}</ChoiceCard>)}</div>
            <h3 className="mb-3 mt-6 text-sm font-semibold">Corner style</h3><div className="grid grid-cols-3 gap-3">{radii.map(item => <ChoiceCard key={item.id} selected={radiusStyle === item.id} onClick={() => setRadiusStyle(item.id)}>{item.label}</ChoiceCard>)}</div>
          </section>

          <section className="rounded-2xl border border-black/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-6">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400"><Gauge className="h-4 w-4" /></div><div><h2 className="font-heading text-lg font-semibold">Layout & interaction</h2><p className="text-sm text-black/50 dark:text-white/50">Control density, scale and motion.</p></div></div>
            <h3 className="mb-3 text-sm font-semibold">UI scale</h3><div className="grid gap-3 sm:grid-cols-3">{scales.map(item => <ChoiceCard key={item.id} selected={uiScale === item.id} onClick={() => setUiScale(item.id)} detail={item.detail}>{item.label}</ChoiceCard>)}</div>
            <h3 className="mb-3 mt-6 text-sm font-semibold">Card density</h3><div className="grid gap-3 sm:grid-cols-2">{densities.map(item => <ChoiceCard key={item.id} selected={cardDensity === item.id} onClick={() => setCardDensity(item.id)} detail={item.detail}>{item.label}</ChoiceCard>)}</div>
            <h3 className="mb-3 mt-6 text-sm font-semibold">Motion</h3><div className="grid gap-3 sm:grid-cols-2">{motions.map(item => <ChoiceCard key={item.id} selected={motionPreference === item.id} onClick={() => setMotionPreference(item.id)} detail={item.detail}>{item.label}</ChoiceCard>)}</div>
          </section>

          <section className="rounded-2xl border border-black/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-6">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400"><Eye className="h-4 w-4" /></div><div><h2 className="font-heading text-lg font-semibold">Accessibility & surfaces</h2><p className="text-sm text-black/50 dark:text-white/50">Make the interface easier to read and calmer to use.</p></div></div>
            <h3 className="mb-3 text-sm font-semibold">Contrast</h3><div className="grid gap-3 sm:grid-cols-2">{contrasts.map(item => <ChoiceCard key={item.id} selected={contrastPreference === item.id} onClick={() => setContrastPreference(item.id)} detail={item.detail}>{item.label}</ChoiceCard>)}</div>
            <h3 className="mb-3 mt-6 text-sm font-semibold">Background surface</h3><div className="grid gap-3 sm:grid-cols-2">{surfaces.map(item => <ChoiceCard key={item.id} selected={surfaceStyle === item.id} onClick={() => setSurfaceStyle(item.id)} detail={item.detail}>{item.label}</ChoiceCard>)}</div>
          </section>

          <div className="flex justify-end"><button type="button" onClick={resetPreferences} className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"><RotateCcw className="h-4 w-4" /> Reset preferences</button></div>
        </div>

        <aside className="h-fit rounded-2xl border border-black/[0.08] bg-white/80 p-5 shadow-sm dark:border-white/[0.09] dark:bg-white/[0.025] lg:sticky lg:top-24">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><Palette className="h-4 w-4 text-primary-500" /> Live preview</div>
          <div className="rounded-2xl border border-black/10 bg-bg-light p-4 dark:border-white/10 dark:bg-bg-dark">
            <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10"><Sparkles className="h-4 w-4 text-primary-500" /></span><div><div className="text-sm font-bold">NovaTools</div><div className="text-[11px] text-black/45 dark:text-white/45">Your current setup</div></div></div>
            <div className="mt-5 rounded-xl border border-primary-500/20 bg-primary-500/[0.06] p-4"><div className="text-xs font-semibold text-primary-600 dark:text-primary-400">Accent</div><div className="mt-1 text-lg font-bold">{colors.find(c => c.id === colorTheme)?.label}</div><div className="mt-2 h-2 rounded-full bg-primary-500/15"><div className="h-2 w-2/3 rounded-full bg-primary-500" /></div></div>
          </div>
          <p className="mt-4 text-xs leading-5 text-black/45 dark:text-white/45">Preferences stay on this device. System reduced-motion settings are also respected.</p>
        </aside>
      </div>
    </div>
  </main>;
}
