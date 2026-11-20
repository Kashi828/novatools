import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';
import { getFeaturedTools, getNewTools, getTrendingTools, tools } from '@/data/tools';
import '@/data/extra-tools';
import { categories } from '@/data/categories';
import { getHiddenSlugs } from '@/lib/tool-visibility';
import { HomeMotion } from '@/components/home/home-motion';
import { ToolSuites } from '@/components/tool-suites';

export const dynamic = 'force-dynamic';

const benefits = [
  { icon: ShieldCheck, code: '01 / PRIVACY', title: 'Private by default', text: 'Most tools process your data locally in the browser.' },
  { icon: Sparkles, code: '02 / ACCESS', title: 'Free to use', text: 'Useful everyday utilities without a wall of friction.' },
  { icon: WandSparkles, code: '03 / FLOW', title: 'Focused workspaces', text: 'Related functions are grouped together so you can finish tasks faster.' },
];

export default async function HomePage() {
  const hidden = new Set(await getHiddenSlugs());
  const visible = (list: typeof tools) => list.filter((tool) => !hidden.has(tool.slug));
  const trending = visible(getTrendingTools()).slice(0, 8);
  const featured = visible(getFeaturedTools()).slice(0, 8);
  const fresh = visible(getNewTools()).slice(0, 4);
  const totalTools = tools.filter((tool) => !hidden.has(tool.slug)).length;

  return (
    <HomeMotion>
      <section className="nova-hero">
        <div className="nova-hero__grid" />
        <div className="nova-hero__orbit nova-hero__orbit--one" />
        <div className="nova-hero__orbit nova-hero__orbit--two" />
        <div className="ect-wrap nova-hero__inner">
          <div className="nova-hero__main">
            <div className="nova-hero__eyebrow"><i /> YOUR DIGITAL TOOLKIT / EST. FOR EVERYDAY WORK</div>
            <h1 className="nova-hero__title">Get things<br /><em>done better.</em></h1>
            <p className="nova-hero__lede">Fast, thoughtfully designed tools for developers, creators, students, businesses, and everyday life. Open a tool. Get it done. Move forward.</p>
            <div className="nova-hero__actions">
              <Link href="/tools" className="ect-button ect-button--lime">Explore all tools <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/toolkits" className="ect-button ect-button--ghost">Explore workspaces <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
            <div className="nova-hero__metrics">
              <div><strong>{totalTools}+</strong><span>ONLINE TOOLS</span></div>
              <div><strong>01</strong><span>PLACE TO START</span></div>
              <div><strong>∞</strong><span>WAYS TO CREATE</span></div>
            </div>
          </div>
          <aside className="nova-hero__aside">
            <div className="nova-terminal">
              <div className="nova-terminal__top"><span>NOVA / QUICK START</span><span>● READY</span></div>
              <div className="nova-terminal__prompt"><span>visitor@novatools</span> ~ / workspace</div>
              <div className="nova-terminal__title">One place.<br /><em>More done.</em></div>
              <p>Pick a utility, work through a focused toolkit, or let Nova AI help you take the next step.</p>
              <div className="nova-terminal__bottom"><span>STATUS: OPERATIONAL</span><span>V. 2026.11</span></div>
            </div>
            <div className="nova-hero__aside-facts">
              <div><span>01 / SIMPLE</span><strong>No installation required</strong><small>Open tools directly in your browser</small></div>
              <div><span>02 / PRACTICAL</span><strong>Made for real tasks</strong><small>Calculators, converters, creators and more</small></div>
            </div>
          </aside>
        </div>
        <div className="ect-wrap nova-hero__foot"><span>TOOLS FOR THE WAY YOU WORK</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <div className="nova-signal-row" aria-label="NovaTools capabilities">
        <div className="nova-signal-track"><span>CALCULATE <b>✳</b></span><span>CONVERT <b>✳</b></span><span>CREATE <b>✳</b></span><span>DEVELOP <b>✳</b></span><span>ORGANIZE <b>✳</b></span><span>DISCOVER <b>✳</b></span><span>CALCULATE <b>✳</b></span><span>CONVERT <b>✳</b></span><span>CREATE <b>✳</b></span><span>DEVELOP <b>✳</b></span><span>ORGANIZE <b>✳</b></span><span>DISCOVER <b>✳</b></span></div>
      </div>

      <section className="nova-section nova-section--paper">
        <div className="ect-wrap">
          <div className="nova-section-intro">
            <div><div className="nova-section-kicker"><i /> NOVATOOLS / 001</div><h2>Less searching.<br /><em>More doing.</em></h2></div>
            <p>Whether you&apos;re solving a quick calculation, preparing a document, or building something for the web, NovaTools brings the useful essentials into one focused workspace.</p>
          </div>
          <div className="nova-feature-panels">
            <Link href="/tools" className="nova-feature-panel nova-feature-panel--large"><span className="nova-panel-code">01 / THE TOOL LIBRARY</span><div><h3>Everyday tools.<br />Ready when you are.</h3><p>Explore practical utilities for calculations, files, images, text, development, and more.</p><span className="nova-panel-link">BROWSE ALL TOOLS <ArrowUpRight className="h-4 w-4" /></span></div><span className="nova-panel-orbit" /></Link>
            <Link href="/toolkits" className="nova-feature-panel nova-feature-panel--small"><span className="nova-panel-code">02 / FOCUSED WORKSPACES</span><div><h3>Related tasks.<br />One smooth flow.</h3><p>Switch between connected functions without bouncing between separate tools.</p><span className="nova-panel-link">OPEN WORKSPACES <ArrowUpRight className="h-4 w-4" /></span></div><span className="nova-panel-orbit" /></Link>
          </div>
        </div>
      </section>

      <section className="nova-section nova-section--dark">
        <div className="ect-wrap">
          <div className="nova-section-intro nova-section-intro--dark">
            <div><div className="nova-section-kicker"><i /> NOVATOOLS / 002</div><h2>Work in your<br /><em>own rhythm.</em></h2></div>
            <p>Open a focused workspace and switch between related functions without bouncing across separate pages. Less context switching, more progress.</p>
          </div>
          <ToolSuites compact />
          <div className="nova-section-more"><Link href="/toolkits">Explore all workspaces <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="nova-section">
        <div className="ect-wrap nova-tool-sections">
          {fresh.length > 0 && <ToolSection title="New releases" number="003" tools={fresh} />}
          <ToolSection title="Trending tools" number="004" tools={trending} link="/tools" />
          <ToolSection title="Featured tools" number="005" tools={featured} />
        </div>
      </section>

      <section className="nova-section nova-section--paper">
        <div className="ect-wrap">
          <div className="nova-section-intro">
            <div><div className="nova-section-kicker"><i /> NOVATOOLS / 006</div><h2>Find your<br /><em>starting point.</em></h2></div>
            <p>Browse by what you need to do. Each category brings related tools together to keep your work moving.</p>
          </div>
          <div className="nova-category-grid">
            {categories.map((cat, index) => {
              const count = tools.filter((tool) => tool.category === cat.slug && !hidden.has(tool.slug)).length;
              return <Link key={cat.slug} href={`/categories/${cat.slug}`} className="nova-category-card"><span className="nova-category-number">{String(index + 1).padStart(2, '0')}</span><span className="nova-category-icon"><cat.icon className="h-5 w-5" /></span><span className="nova-category-name">{cat.name}</span><span className="nova-category-count">{count} TOOLS</span><ArrowUpRight className="nova-category-arrow h-4 w-4" /></Link>;
            })}
          </div>
        </div>
      </section>

      <section className="nova-section nova-benefits-section">
        <div className="ect-wrap">
          <div className="nova-section-intro nova-section-intro--dark">
            <div><div className="nova-section-kicker"><i /> THE NOVATOOLS APPROACH / 007</div><h2>Useful by<br /><em>design.</em></h2></div>
            <p>Technology should help you move forward, not get in the way. NovaTools is designed around clarity, speed, and getting the job done.</p>
          </div>
          <div className="nova-benefit-grid">{benefits.map(({ icon: Icon, code, title, text }) => <div key={title} className="nova-benefit-card"><span>{code}</span><Icon className="h-6 w-6" /><h3>{title}</h3><p>{text}</p></div>)}</div>
          <div className="nova-bottom-cta"><div><span>READY WHEN YOU ARE / 008</span><h2>What will you<br /><em>make easier?</em></h2></div><Link href="/tools" className="ect-button ect-button--lime">Find your tool <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>
    </HomeMotion>
  );
}

function ToolSection({ title, number, tools: items, link }: { title: string; number: string; tools: typeof tools; link?: string }) {
  if (!items.length) return null;
  return (
    <section className="nova-tool-section">
      <div className="nova-tool-heading"><div><span>NOVATOOLS / {number}</span><h2>{title}</h2></div>{link && <Link href={link}>VIEW ALL <ArrowRight className="h-4 w-4" /></Link>}</div>
      <div className="nova-tool-grid">{items.map((tool, index) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="nova-tool-card"><div className="nova-tool-card__top"><span>{String(index + 1).padStart(2, '0')}</span>{tool.icon && <tool.icon className="h-5 w-5" />}</div><h3>{tool.name}</h3><p>{tool.description}</p><span className="nova-tool-card__link">OPEN TOOL <ArrowUpRight className="h-3.5 w-3.5" /></span></Link>)}</div>
    </section>
  );
}
