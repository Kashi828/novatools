# NovaTools

Free online tools that save you time. No installation needed — most tools require no account at all.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then add your Clerk keys — see "Setting up login & Premium subscriptions" below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** this version requires Clerk API keys to run at all (the app won't start without them). Free to get in about 2
> minutes — see the "Setting up login & Premium subscriptions" section below before your first `npm run dev`.

## Promo mode (everything free, no sign-in, for a limited time)

`lib/promo.ts` has a single flag: `PROMO_MODE`. While `true`:

- The navbar hides Sign In, the user menu, and the Pricing link
- Every Premium tool (Batch Image Processor, QR Code Batch Generator, and the PDF Merge file-count limit) unlocks for everyone automatically
- A dismissible banner announces the promo across the whole site

This does **not** delete or disable your Clerk auth/billing setup — it's all still there, wired up and working underneath.
Flip `PROMO_MODE` back to `false` in `lib/promo.ts`, commit, and redeploy whenever you're ready to re-enable sign-in and the
Premium paywall. No other code changes needed anywhere.

## What's included

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS**
- Original "nova burst" logo mark (no generic icon-in-a-box) used consistently across navbar, footer, favicon, and PWA icon
- Landing page: animated hero, search, trending/featured/new-release tool rows, categories, stats, testimonials, FAQ, newsletter
- **All 67 registered tools are fully functional** (client-side, no backend required except the 2 Premium tools' gating and the
  comments feature). **2 tools are Premium-only**:
  - **Security**: Password Generator, Hash Generator (SHA-1/256/384/512), Passphrase Generator, Password Strength Checker
  - **Calculators**: BMI, Age, EMI, GST, Percentage, Scientific, Tip Calculator
  - **Converters**: Unit Converter, Currency Converter (live rates), Timezone Converter
  - **Developer**: JSON Formatter, JSON Validator, Base64 Encoder/Decoder, URL Encoder/Decoder, UUID Generator, Regex Tester,
    Timestamp Converter, CSS Minifier, JavaScript Minifier, Markdown Preview, HTML Preview, Number Base Converter, Text Diff
    Checker, CSV to JSON Converter, Markdown Table Generator
  - **Text**: Word Counter, Case Converter, Remove Duplicate Lines, Lorem Ipsum Generator
  - **Color**: Color Picker, Gradient Generator, Color Palette Generator, Color Contrast Checker
  - **Image**: Compressor, Converter, Resizer, Favicon Generator, **Batch Image Processor (Premium)**
  - **PDF**: Merge (3-file limit on Free, unlimited on Premium), Split, Compress, PDF to Image, Image to PDF
  - **Web**: QR Code Generator, Barcode Generator, Slug Generator, Meta Tag Generator, **QR Code Batch Generator (Premium)**
  - **AI**: Text to Speech, Speech to Text (both via the browser's built-in APIs — no external AI service)
  - **Device** (uses your phone/laptop's sensors — see caveats below): Sound Meter, Compass, Bubble Level, Device Info, My
    Location, Vibration Tester
  - **Games/Utility**: Spin the Wheel, Dice Roller, Coin Flip, Countdown Timer, Stopwatch, Random Number Generator, My IP
    Address
- All Tools page with instant search + category filters
- Category index and detail pages
- Individual tool page template (title, description, FAQ, related tools, SEO metadata)
- Dark/light mode, Ctrl+K command palette, responsive navbar, PWA manifest
- **Login/signup and Premium subscriptions** via Clerk (see Promo mode above for temporarily disabling this)
- **Public comments** on `/feedback` — anyone can post, only you can delete (see "Public comments" section below)
- Custom-built dropdown component everywhere (see "Dropdowns" below) instead of native `<select>`
- Dynamic `sitemap.xml` and `robots.txt` generated from the tools registry

## Setting up login & Premium subscriptions (Clerk)

This project uses [Clerk](https://clerk.com) for authentication and subscription billing. All core tools stay fully usable
without an account — login only unlocks Premium. You can run everything below completely free, with no credit card.

### 1. Create a free Clerk account

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) and sign up (free, no card required)
2. Create a new application
3. On the **API Keys** page, copy your **Publishable key** and **Secret key**

### 2. Add your keys locally

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste in the two keys from step 1. Restart `npm run dev` after saving.

### 3. Enable Billing and create a Premium plan

1. In the Clerk dashboard, go to **Configure → Billing** and enable it (works immediately in test/dev mode — no Stripe account
   needed yet)
2. Go to **Subscription plans → Plans for Users → Add Plan**
3. Create a plan with the slug **`premium`** (must match exactly — the code checks for `plan="premium"`)
4. **To make Premium free** (an account-gate rather than a paywall): set the Monthly/Annually price to **0**. Everything in
   the code keeps working the same either way.
5. Visit `/pricing` — you should see Free and Premium side by side

### Removing sign-up options you don't want

The prebuilt `<SignIn>`/`<SignUp>` components read their available methods (email, phone, username, social) from your Clerk
dashboard, not from code. To remove phone number: **Configure → Email, Phone, Username** → toggle **Phone number** off.

### 4. Going live with real payments (whenever you're ready)

1. Clerk dashboard → **Configure → Billing → Settings** → connect a real Stripe account
2. Switch your Clerk application from **Development** to **Production** and swap in production API keys
3. No code changes needed — `<Protect>`/`<PremiumGate>`, `<PricingTable />`, `SignedIn`/`SignedOut` all work the same in both
   test and live mode.

### Adding more Premium-gated features

```tsx
import { PremiumGate } from '@/components/premium-gate';

<PremiumGate fallback={<UpgradePrompt />}>
  <UnlimitedFeature />
</PremiumGate>
```

Use `PremiumGate` (not `Protect` directly) for any new gated feature — it automatically respects `PROMO_MODE`.

## Public comments (Feedback page)

`/feedback` is an open guestbook — anyone can post a comment, no account required. Only you can delete comments, enforced
server-side. This needs a small free key-value database.

### 1. Create a free Upstash Redis database

1. Go to [console.upstash.com](https://console.upstash.com) and sign up (free, no card required)
2. Create a new Redis database
3. On the database's page, find **REST API** and copy **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN**

### 2. Add them to `.env.local`

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
ADMIN_EMAIL=you@example.com
```

`ADMIN_EMAIL` must match a verified email on the Clerk account you personally sign in with — that's what unlocks delete
buttons on `/feedback`. It's server-only (no `NEXT_PUBLIC_` prefix), never exposed to visitors.

### 3. Try it

Restart `npm run dev`, visit `/feedback`, post a comment (works even signed out), then sign in with your admin account and
refresh — you should see delete icons on every comment.

When deploying, add these same three variables in **Vercel → Project → Settings → Environment Variables**, same as Clerk.

## The "New" badge system

Any tool with `isNew: true` in `data/tools.ts` gets a green "New" badge and shows up in the homepage "New releases" row
automatically. Remove the flag once a tool isn't new anymore.

## Dropdowns

Every dropdown uses `components/ui/select.tsx`, a custom-built listbox — not the native HTML `<select>`. Native `<select>`
popups are drawn by the OS/browser, not by our CSS, and some Windows Chromium builds ignore `color-scheme: dark` for the
option list, rendering white-on-white in dark mode. Owning the full render avoids that class of bug completely. When adding a
new tool with a dropdown, use `<Select value={...} onChange={...} options={[...]} />`.

## Browser API caveats

- **Speech to Text** only works in Chromium-based browsers (Chrome, Edge) — Firefox and Safari don't implement the Web Speech
  recognition API. The tool detects this and shows a clear message instead of failing silently. It also auto-restarts if the
  browser silently stops listening after a pause (a known Chrome quirk), and surfaces real errors (mic blocked, no mic found,
  network issue) instead of failing silently.
- **Text to Speech** works broadly (Chrome, Edge, Safari, Firefox) but available voices differ by OS/browser.
- **Device sensor tools** (Compass, Bubble Level, Sound Meter, My Location, Vibration Tester) mostly need a **phone**, not a
  laptop — most laptops lack magnetometers/vibration motors. iOS requires an explicit permission prompt for motion/orientation
  sensors (the tools handle this with a button tap). Sound Meter's dB reading is an uncalibrated approximation for relative
  loudness comparison, not a certified measurement.

## Adding a new tool

1. **Build the component** in `components/tools/your-tool.tsx`. Wrap it in `<ToolShell>` for Copy / Download / Reset / Share.
   Use `<Select>` for any dropdowns, and `<PremiumGate>` if it should be Premium-only.
2. **Register it** in `data/tools.ts` — import your component and add an entry with `component: YourTool`.
3. That's it. The tool page, sitemap, search, category pages, and related-tools links all pick it up automatically.

```ts
// data/tools.ts
import { YourTool } from '@/components/tools/your-tool';

{
  slug: 'your-tool',
  name: 'Your Tool',
  shortDescription: '...',
  description: '...',
  category: 'utility',
  icon: SomeLucideIcon,
  keywords: ['...'],
  component: YourTool,
}
```

## Project structure

```
app/                  Routes (App Router) — pages only, no business logic
  tools/[slug]/       Individual tool page template
  categories/[slug]/  Category detail page
  sign-in/, sign-up/  Clerk auth pages
  pricing/            Plan comparison (<PricingTable />)
  feedback/           Public comments guestbook
  api/comments/       Comment list/create/delete API routes
components/
  tools/              One file per tool's interactive UI
  ui/                 Button, Card, Select — shared primitives
  home/               Landing page sections
  logo.tsx            The nova burst logo mark
  premium-gate.tsx    Drop-in Premium gate that respects PROMO_MODE
  promo-banner.tsx    Site-wide promo banner
data/
  tools.ts            The tool registry — single source of truth
  categories.ts        Category registry
  types.ts            Shared TypeScript types
lib/
  utils.ts            cn(), clipboard, download helpers
  promo.ts            PROMO_MODE flag
  redis.ts, comments.ts, admin.ts   Public comments backend
middleware.ts          Clerk middleware (runs on every request; blocks nothing by default)
```

## Notes on specific tools

- **Currency Converter** uses [open.er-api.com](https://www.exchangerate-api.com/docs/free), a free, keyless live exchange
  rate endpoint.
- **Hash Generator** covers SHA-1/256/384/512 via the native Web Crypto API. MD5 isn't included since browsers no longer
  expose it natively.
- **JavaScript Minifier** is a safe, string/comment-aware minifier (strips comments + whitespace only) — not a bundler-grade
  minifier like Terser or esbuild.
- **PDF Compress** cleans up a PDF's internal structure via `pdf-lib`; it doesn't re-encode embedded images.
- **PDF to Image** uses `pdfjs-dist` with its worker loaded from a CDN (unpkg) — no bundler configuration needed.

## Tech stack

Next.js 15, React 18, TypeScript, Tailwind CSS (+ typography plugin), Framer Motion, Lucide Icons, React Hook Form + Zod, cmdk
(command palette), qrcode, jsbarcode, marked + DOMPurify, pdf-lib, pdfjs-dist, Clerk (auth + billing), Upstash Redis (comments),
JSZip (batch downloads).
