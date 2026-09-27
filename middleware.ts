import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { clerkMiddleware } from '@clerk/nextjs/server';

let maintenanceRedis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  maintenanceRedis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const MAINTENANCE_KEY = 'novatools:maintenance';

export default clerkMiddleware(async (_auth, request) => {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin') || pathname === '/api/maintenance') return;
  if (!maintenanceRedis) return;

  try {
    const settings = await maintenanceRedis.get<{ enabled?: boolean; startAt?: string | null; endAt?: string | null; message?: string }>(MAINTENANCE_KEY);
    if (!settings?.enabled) return;
    const now = Date.now();
    const start = settings.startAt ? Date.parse(settings.startAt) : null;
    const end = settings.endAt ? Date.parse(settings.endAt) : null;
    const active = (start == null || (!Number.isNaN(start) && now >= start)) && (end == null || (!Number.isNaN(end) && now < end));
    if (!active) return;

    const message = typeof settings.message === 'string' && settings.message.trim()
      ? settings.message.trim().slice(0, 240)
      : 'NovaTools is temporarily offline while we upgrade the engines.';

    return new NextResponse(buildMaintenanceHtml(message, typeof settings.endAt === 'string' ? settings.endAt : ''), {
      status: 503,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store, max-age=0, must-revalidate',
        'x-robots-tag': 'noindex, nofollow',
        'retry-after': '60',
      },
    });
  } catch {
    return;
  }
});

function escapeHtml(value: string) {
  return value.replace(/[&<>\"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
}

function buildMaintenanceHtml(message: string, endAt: string) {
  const safeMessage = escapeHtml(message);
  const safeEndAt = JSON.stringify(endAt);
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#05060a"><title>NovaTools — Maintenance</title>
<style>
*{box-sizing:border-box}html,body{margin:0;min-height:100%;background:#05060a;color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}body{overflow:hidden}.page{min-height:100vh;display:grid;place-items:center;padding:18px;background:radial-gradient(circle at 15% 10%,rgba(34,211,238,.12),transparent 32%),radial-gradient(circle at 85% 85%,rgba(139,92,246,.12),transparent 32%)}.panel{width:min(980px,100%);padding:20px;border:1px solid rgba(148,163,184,.14);border-radius:28px;background:rgba(7,10,17,.94);box-shadow:0 30px 90px rgba(0,0,0,.55);animation:in .55s cubic-bezier(.22,1,.36,1)}@keyframes in{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}.top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.08)}.brand{display:flex;align-items:center;gap:12px}.logo{width:42px;height:42px;display:grid;place-items:center;border-radius:13px;border:1px solid rgba(103,232,249,.18);background:rgba(34,211,238,.08);color:#67e8f9;font-size:19px}.eyebrow{font:700 9px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.26em;color:rgba(103,232,249,.7);text-transform:uppercase}.name{margin-top:4px;font-size:16px;font-weight:800}.status{font-size:10px;font-weight:800;color:#fde68a;border:1px solid rgba(251,191,36,.18);background:rgba(251,191,36,.07);padding:8px 10px;border-radius:999px}.content{display:grid;grid-template-columns:.9fr 1.1fr;gap:22px;align-items:center;padding:24px 0 8px}.title{margin:0;font-size:clamp(38px,6vw,66px);line-height:.94;letter-spacing:-.045em}.copy{margin:14px 0 0;max-width:470px;color:rgba(226,232,240,.58);font-size:14px;line-height:1.7}.count{margin-top:18px;display:inline-flex;gap:10px;align-items:center;padding:10px 12px;border:1px solid rgba(103,232,249,.15);border-radius:14px;background:rgba(34,211,238,.04)}.count small{display:block;color:rgba(255,255,255,.35);font-size:9px;text-transform:uppercase;letter-spacing:.12em}.count strong{display:block;margin-top:2px;font:800 18px ui-monospace,SFMono-Regular,Menlo,monospace;color:#a5f3fc}.game{border:1px solid rgba(255,255,255,.09);background:rgba(0,0,0,.2);border-radius:22px;padding:13px}.gamehead{display:flex;justify-content:space-between;align-items:center;padding:3px 3px 11px}.score{font:800 12px ui-monospace,SFMono-Regular,Menlo,monospace;color:#a5f3fc}.arena{height:280px;position:relative;overflow:hidden;border-radius:16px;border:1px solid rgba(34,211,238,.1);background:linear-gradient(180deg,#080c16,#05070d)}.stars{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.7) 1px,transparent 1px);background-size:90px 84px;opacity:.22}.ground{position:absolute;left:0;right:0;bottom:40px;height:2px;background:linear-gradient(90deg,transparent,#67e8f9,#8b5cf6,transparent);box-shadow:0 0 20px rgba(34,211,238,.2)}.runner{position:absolute;left:80px;bottom:46px;width:42px;height:54px;z-index:4}.head{position:absolute;left:9px;top:0;width:27px;height:24px;border-radius:11px;background:#a5f3fc;border:1px solid rgba(255,255,255,.25)}.eye{position:absolute;right:5px;top:7px;width:4px;height:4px;border-radius:50%;background:#071018}.body{position:absolute;left:7px;top:15px;width:28px;height:29px;border-radius:12px 12px 8px 8px;background:linear-gradient(180deg,#67e8f9,#8b5cf6);box-shadow:0 0 22px rgba(34,211,238,.2)}.leg{position:absolute;bottom:0;width:8px;height:15px;border-radius:6px;background:#67e8f9}.l1{left:7px}.l2{right:3px}.jump{transform:translateY(-90px) rotate(-3deg)}.obj{position:absolute;bottom:42px;z-index:3;will-change:left}.rock{width:30px;height:38px;border-radius:10px 12px 4px 4px;background:linear-gradient(145deg,#f472b6,#7c3aed);box-shadow:0 0 20px rgba(244,114,182,.15)}.beam{width:58px;height:13px;border-radius:8px;background:linear-gradient(90deg,#fb7185,#f59e0b);box-shadow:0 0 18px rgba(251,113,133,.16)}.orb,.shield{border-radius:50%}.orb{width:16px;height:16px;bottom:112px;background:#67e8f9;box-shadow:0 0 22px rgba(34,211,238,.7)}.shield{width:18px;height:18px;bottom:132px;background:#c4b5fd;box-shadow:0 0 22px rgba(139,92,246,.7)}.message{position:absolute;inset:0;display:none;place-items:center;background:rgba(2,4,8,.66);backdrop-filter:blur(4px);z-index:8}.message.show{display:grid}.messagebox{text-align:center}.messagebox b{display:block;font-size:10px;letter-spacing:.2em;color:#fda4af;text-transform:uppercase}.messagebox strong{display:block;margin-top:7px;font-size:23px}.btn{margin-top:13px;border:0;border-radius:11px;padding:10px 14px;font-size:11px;font-weight:800;cursor:pointer;background:linear-gradient(90deg,#67e8f9,#a78bfa);color:#061019}.hint{margin-top:10px;color:rgba(226,232,240,.3);font-size:9px}.foot{padding-top:14px;text-align:center;color:rgba(226,232,240,.2);font-size:9px}@media(max-width:780px){body{overflow:auto}.content{grid-template-columns:1fr}.panel{padding:14px}.arena{height:230px}.top{align-items:flex-start}.status{font-size:9px;padding:7px 8px}}
</style></head><body>
<div class="page"><section class="panel"><div class="top"><div class="brand"><div class="logo">✦</div><div><div class="eyebrow">NOVATOOLS // OFFLINE</div><div class="name">Maintenance Control</div></div></div><div class="status">● MAINTENANCE ACTIVE</div></div>
<div class="content"><div><div class="eyebrow">TEMPORARY DOWNTIME</div><h1 class="title">We’re tuning<br>the engines.</h1><p class="copy">${safeMessage}</p><div id="count" class="count" style="display:none"><div>◷</div><div><small>Back online in</small><strong id="timer">--:--:--</strong></div></div></div>
<div class="game"><div class="gamehead"><div><div class="eyebrow">MAINTENANCE MINI-GAME</div><div style="margin-top:4px;font-size:14px;font-weight:800">Nova Runner // Firewall Escape</div></div><div class="score">SCORE <span id="score">0000</span></div></div><div id="arena" class="arena"><div class="stars"></div><div class="ground"></div><div id="runner" class="runner"><div class="head"><span class="eye"></span></div><div class="body"></div><div class="leg l1"></div><div class="leg l2"></div></div><div id="message" class="message"><div class="messagebox"><b>connection blocked</b><strong>Firewall hit.</strong><button id="restart" class="btn">Restart run</button></div></div></div><div class="hint">SPACE / ↑ / TAP to jump · CYAN = energy · VIOLET = shield</div></div></div><div class="foot">Thanks for waiting while NovaTools gets faster, safer and better.</div></section></div>
<script>
(()=>{
const endAt=${safeEndAt};const count=document.getElementById('count');const timer=document.getElementById('timer');
function countdown(){if(!endAt){count.style.display='none';return}const ms=new Date(endAt).getTime()-Date.now();if(ms<=0){location.reload();return}count.style.display='inline-flex';let s=Math.ceil(ms/1000);const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);s%=60;timer.textContent=[h,m,s].map(v=>String(v).padStart(2,'0')).join(':')}countdown();setInterval(countdown,1000);
const arena=document.getElementById('arena'),runner=document.getElementById('runner'),scoreEl=document.getElementById('score'),message=document.getElementById('message');let running=true,jumping=false,shielded=false,score=0,speed=1.0,last=performance.now(),spawn=1500,items=[];
function jump(){if(!running||jumping)return;jumping=true;runner.classList.add('jump');setTimeout(()=>{jumping=false;runner.classList.remove('jump')},700)}
function add(kind){const el=document.createElement('div');el.className='obj '+kind;const item={el,x:arena.clientWidth+50,kind};el.style.left=item.x+'px';arena.appendChild(el);items.push(item)}
function restart(){items.forEach(i=>i.el.remove());items=[];running=true;jumping=false;shielded=false;score=0;speed=1.0;spawn=1800;message.classList.remove('show');runner.classList.remove('jump');last=performance.now()}
function loop(t){const dt=Math.min(34,t-last);last=t;if(running){spawn-=dt;speed=Math.min(2.0,speed+dt*.00004);score+=dt*.016;scoreEl.textContent=String(Math.floor(score)).padStart(4,'0');if(spawn<=0){const r=Math.random();add(r<.56?'rock':r<.8?'beam':r<.93?'orb':'shield');spawn=1800+Math.random()*1300-speed*10}for(let i=items.length-1;i>=0;i--){const item=items[i];item.x-=speed*dt;item.el.style.left=item.x+'px';const near=Math.abs(item.x+14-101)<30;if(near){if(item.kind==='orb'&&jumping){score+=60;item.el.remove();items.splice(i,1);continue}if(item.kind==='shield'&&jumping){shielded=true;item.el.remove();items.splice(i,1);setTimeout(()=>{shielded=false},5500);continue}if((item.kind==='rock'||item.kind==='beam')&&!jumping){if(shielded){shielded=false;item.el.remove();items.splice(i,1);continue}running=false;message.classList.add('show')}}if(item.x<-100){item.el.remove();items.splice(i,1)}}}requestAnimationFrame(loop)}requestAnimationFrame(loop);
document.getElementById('restart').onclick=restart;window.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();jump()}if(e.code==='KeyR'&&!running)restart()});arena.addEventListener('pointerdown',jump);
})();
</script></body></html>`;
}

export const config={matcher:['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)','/(api|trpc)(.*)']};
