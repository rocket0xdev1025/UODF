/* =====================================================================
   $UODF — United Oil Dividend Fund · The Annual Report
   ---------------------------------------------------------------------
   CONFIG — edit these values only.
     CA    : contract address on Base. Keep 'TBA' until launch. Must match
             /^0x[a-fA-F0-9]{40}$/ to activate Buy / Chart / copy / embed.
     X     : full URL of the X (Twitter) account, e.g. 'https://x.com/uodf'.
             Leave '' to show "Soon" (disabled).
     TG    : full URL of the Telegram group, e.g. 'https://t.me/uodf'.
             Leave '' to show "Soon" (disabled).
     CHAIN : DexScreener / Uniswap chain slug. Base = 'base'.
   ===================================================================== */
const CONFIG = {
  CA: 'TBA',
  X: '',
  TG: '',
  CHAIN: 'base'
};

(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isNarrow = () => innerWidth < 1024;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const CA_RE = /^0x[a-fA-F0-9]{40}$/;
  const caValid = CA_RE.test(CONFIG.CA);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  if (hasGSAP && !reduced) root.classList.add('anim'); else root.classList.add('static-ok');

  /* ---------- links ---------- */
  const buyURL = `https://app.uniswap.org/swap?chain=${CONFIG.CHAIN}&outputCurrency=${caValid ? CONFIG.CA : 'TBA'}`;
  const chartURL = `https://dexscreener.com/${CONFIG.CHAIN}/${caValid ? CONFIG.CA : 'TBA'}`;
  $$('[data-link]').forEach(a => {
    const k = a.dataset.link;
    if (k === 'buy') a.href = buyURL;
    else if (k === 'chart') a.href = chartURL;
    else if (k === 'x' || k === 'tg') {
      const url = k === 'x' ? CONFIG.X : CONFIG.TG;
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.removeAttribute('aria-disabled'); }
      else {
        a.setAttribute('aria-disabled', 'true'); a.removeAttribute('href'); a.setAttribute('role', 'link');
        a.title = (k === 'x' ? 'X' : 'Telegram') + ' — coming soon';
        a.addEventListener('click', e => { e.preventDefault(); toast((k === 'x' ? 'X' : 'Telegram') + ' link coming soon.'); });
      }
    }
  });
  $$('[data-ca]').forEach(el => el.textContent = caValid ? CONFIG.CA : 'TBA — announced at launch');

  /* ---------- toast + copy ---------- */
  const toastEl = $('#toast'); let tT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(tT); tT = setTimeout(() => toastEl.classList.remove('show'), 2600); }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'; document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); return ok;
  }
  async function copyCA() {
    if (!caValid) { toast('Contract address is TBA — only trust the CA posted here.'); return; }
    let ok = false;
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(CONFIG.CA); ok = true; } } catch (e) {}
    if (!ok) ok = fallbackCopy(CONFIG.CA);
    toast(ok ? 'CA copied. Always verify before you swap.' : 'Copy failed — select the address manually.');
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', copyCA));

  /* ---------- DexScreener ---------- */
  if (caValid) {
    const f = document.createElement('iframe');
    f.src = `https://dexscreener.com/${CONFIG.CHAIN}/${CONFIG.CA}?embed=1&theme=dark&trades=0&info=0`;
    f.title = '$UODF chart on DexScreener'; f.loading = 'lazy'; f.allow = 'clipboard-write';
    $('#chartFrame').appendChild(f); $('#chartOverlay').remove();
  }

  /* ---------- guilloche generators ---------- */
  function hypo(cx, cy, R, r, d, steps, sx = 1, sy = 1) {
    const g = (a, b) => b ? g(b, a % b) : a; const n = r / g(R, r); const N = steps || n * 80; let s = '';
    for (let i = 0; i <= N; i++) { const t = i / N * Math.PI * 2 * n;
      const x = (R - r) * Math.cos(t) + d * Math.cos((R - r) / r * t), y = (R - r) * Math.sin(t) - d * Math.sin((R - r) / r * t);
      s += (i ? 'L' : 'M') + (cx + x * sx).toFixed(1) + ',' + (cy + y * sy).toFixed(1); }
    return s;
  }
  const NS = 'http://www.w3.org/2000/svg';
  const ir = $('#introRosette');
  [[260, 10, 70], [236, 9, 56], [206, 8, 50], [176, 12, 44], [146, 7, 32], [116, 5, 26]].forEach(([R, r, d], i) => {
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', hypo(300, 300, R, r, d)); ir.appendChild(p);
    const L = p.getTotalLength ? p.getTotalLength() : 4000; p.style.setProperty('--len', L); p.style.animationDelay = (i * .08) + 's';
  });
  const cb = $('#certBorder');
  for (let j = 0; j < 7; j++) { // wavy border bands top+bottom
    let top = '', bot = '';
    for (let x = 0; x <= 1000; x += 5) { const y = 14 + 7 * Math.sin(x / 14 + j * .9); top += (x ? 'L' : 'M') + x + ',' + y.toFixed(1); bot += (x ? 'L' : 'M') + x + ',' + (600 - y).toFixed(1); }
    [top, bot].forEach(d => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); cb.appendChild(p); });
  }
  [[880, 300, 1.6], [120, 300, 1.6]].forEach(([cx, cy]) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', hypo(cx, cy, 110, 10, 40)); p.setAttribute('opacity', '.35'); cb.appendChild(p); });

  /* ---------- intro ---------- */
  const intro = $('#intro');
  function endIntro() { if (!intro || intro.dataset.done) return; intro.dataset.done = 1; intro.classList.add('out'); setTimeout(() => intro.remove(), 850); document.dispatchEvent(new Event('intro:done')); }
  if (reduced || !intro) { intro && intro.remove(); }
  else {
    document.body.style.overflow = 'hidden';
    setTimeout(() => intro.classList.add('shake'), 1300);
    setTimeout(() => { document.body.style.overflow = ''; endIntro(); }, 2500);
    intro.addEventListener('click', () => { document.body.style.overflow = ''; endIntro(); });
    setTimeout(() => { document.body.style.overflow = ''; intro.isConnected && intro.remove(); }, 5000); // failsafe
  }

  /* ---------- serial number ---------- */
  const serial = $('#serial'); let sn = 1776;
  if (!reduced) setInterval(() => { if (document.hidden) return; sn += Math.floor(Math.random() * 7) + 1; serial.textContent = 'UODF-' + String(sn).padStart(6, '0'); }, 1400);

  /* ---------- certificate tilt + foil ---------- */
  const cert = $('#cert');
  if (finePointer && !reduced) {
    const stage = $('.cert-stage');
    stage.addEventListener('pointermove', e => {
      const r = cert.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      cert.style.transform = `rotateY(${(px - .5) * 14}deg) rotateX(${(.5 - py) * 10}deg)`;
      cert.style.setProperty('--mx', (px * 100) + '%'); cert.style.setProperty('--my', (py * 100) + '%');
    });
    stage.addEventListener('pointerleave', () => { cert.style.transform = ''; });
  }

  /* ---------- Lenis (desktop only) ---------- */
  let lenis = null;
  if (window.Lenis && !reduced && finePointer && !isNarrow()) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    if (hasGSAP) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  const scrollToEl = el => { if (lenis) lenis.scrollTo(el, { offset: 0 }); else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return; const el = $(id); if (!el) return;
    e.preventDefault(); scrollToEl(el); closeDrawer(); history.replaceState(null, '', id);
  }));

  /* ---------- spine progress, folio, mobile index, keyboard paging ---------- */
  const chapters = $$('main .chapter');
  const spineLinks = $$('.spine-list a');
  const drawer = $('#indexDrawer'), idxBtn = $('#indexBtn'), fbChapter = $('#fbChapter'), folio = $('#folioNow');
  drawer.querySelector('ol').innerHTML = spineLinks.map(a => `<li><a href="${a.getAttribute('href')}"><span class="num">${a.querySelector('.num').textContent}</span>${a.querySelector('.lbl').textContent}</a></li>`).join('');
  $$('#indexDrawer a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); const el = $(a.getAttribute('href')); closeDrawer(); el && scrollToEl(el); }));
  function closeDrawer() { if (!drawer.hidden) { drawer.hidden = true; idxBtn.setAttribute('aria-expanded', 'false'); } }
  idxBtn.addEventListener('click', () => { drawer.hidden = !drawer.hidden; idxBtn.setAttribute('aria-expanded', String(!drawer.hidden)); });
  let curCh = 0;
  function onScrollChrome() {
    const vh = innerHeight, mid = scrollY + vh * .4;
    chapters.forEach((c, i) => {
      const top = c.offsetTop, h = c.offsetHeight; const p = clamp((scrollY + vh - top) / (h + vh * .0 + 1), 0, 1);
      spineLinks[i] && spineLinks[i].style.setProperty('--p', clamp((mid - top) / h, 0, 1).toFixed(3));
      if (mid >= top && mid < top + h && curCh !== i) {
        curCh = i; spineLinks.forEach((l, j) => l.classList.toggle('on', j === i));
        folio.textContent = 'p. ' + String(i + 1).padStart(2, '0');
        fbChapter.textContent = spineLinks[i].querySelector('.num').textContent + ' · ' + c.dataset.title;
      }
    });
  }
  spineLinks[0].classList.add('on');
  addEventListener('scroll', onScrollChrome, { passive: true }); onScrollChrome();
  addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select') || !$('#lightbox').hidden) return;
    const k = e.key.toLowerCase(); let d = 0;
    if (k === 'j' || (k === 'arrowright' && !e.altKey)) d = 1; if (k === 'k' || (k === 'arrowleft' && !e.altKey)) d = -1;
    if (d) { const n = clamp(curCh + d, 0, chapters.length - 1); scrollToEl(chapters[n]); }
  });

  /* ---------- split text + reveals ---------- */
  $$('.split').forEach(el => {
    if (el.classList.contains('cert-title')) { // keep line groups intact
      $$(':scope > span', el).forEach(s => { s.innerHTML = `<span class="w"><span>${s.textContent}</span></span>`; }); return; }
    el.innerHTML = el.innerHTML.replace(/<em>(.*?)<\/em>/g, '§$1§').split(' ').map(w => {
      const it = /§/.test(w); w = w.replace(/§/g, ''); return `<span class="w"><span>${it ? '<em>' + w + '</em>' : w}</span></span>`; }).join(' ');
  });
  if (hasGSAP && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    const startAnims = () => {
      gsap.from('.cert', { y: 60, rotateX: 18, opacity: 0, duration: 1.2, ease: 'power3.out' });
      gsap.from('.cert-title .w>span', { yPercent: 110, duration: 1, stagger: .12, ease: 'power4.out', delay: .2 });
      gsap.from('.cert-seal', { scale: .6, rotate: -20, opacity: 0, duration: 1.1, ease: 'back.out(1.7)', delay: .3 });
      gsap.to('.kicker', { opacity: 1, y: 0, duration: .6 });
    };
    if ($('#intro')) document.addEventListener('intro:done', startAnims, { once: true }); else startAnims();
    $$('.split:not(.cert-title)').forEach(el => gsap.from($$('.w>span', el), { yPercent: 110, duration: .9, stagger: .06, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));
    $$('.reveal:not(.kicker)').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
    gsap.set('.kicker', { opacity: 0, y: 20 });
    $$('.sig path').forEach(p => { const L = p.getTotalLength(); gsap.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: p.closest('div,figure,section'), start: 'top 85%' } }); });
    gsap.utils.toArray('.dir').forEach((d, i) => gsap.fromTo(d, { y: 60, rotate: i % 2 ? 4 : -4 }, { y: 0, rotate: 0, scrollTrigger: { trigger: '.board', start: 'top 85%', end: 'bottom 60%', scrub: 1 } }));
    gsap.fromTo('.clause', { x: -30, opacity: 0 }, { x: 0, opacity: 1, stagger: .15, duration: .7, scrollTrigger: { trigger: '.clauses', start: 'top 80%' } });
    gsap.from('.ledger tr', { opacity: 0, y: 12, stagger: .06, scrollTrigger: { trigger: '.ledger', start: 'top 85%' } });
    gsap.to('.h-xl .w>span, .h-lg .w>span', { backgroundPosition: '100% 0', duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  /* ---------- visibility helper ---------- */
  function watch(el, cb, margin = '100px') { if (!('IntersectionObserver' in window)) { cb(true); return; } new IntersectionObserver(es => es.forEach(e => cb(e.isIntersecting)), { rootMargin: margin }).observe(el); }

  /* ---------- freedom-unit clock (joke) ---------- */
  const fu = $('#fuClock'); const t0 = performance.now(); let fuOn = false;
  watch(fu, v => fuOn = v);
  setInterval(() => { if (fuOn && !document.hidden) fu.textContent = ((performance.now() - t0) / 1000 * 17.76).toFixed(6); }, reduced ? 1000 : 60);

  /* ---------- count-ups ---------- */
  $$('[data-count]').forEach(el => { let done = false; watch(el, v => { if (!v || done) return; done = true; const to = +el.dataset.count; if (reduced || !to) { el.textContent = to.toLocaleString(); return; }
    const s = performance.now(); const step = n => { const k = clamp((n - s) / 1400, 0, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString(); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }, '0px'); });

  /* ---------- pump jack + gusher ---------- */
  const rig = $('#rig'), beam = $('#beam'), crank = $('#crank'), rod = $('#rod'), polish = $('#polish'), dropsG = $('#drops');
  const gc = $('#gusher'), gx = gc.getContext('2d'); let rigOn = false, parts = [], lastT = 0, phase = 0, lastScroll = scrollY;
  const coinsMax = isNarrow() ? 40 : 110;
  function sizeG() { const r = gc.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2); gc.width = r.width * dpr; gc.height = r.height * dpr; gx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  sizeG(); addEventListener('resize', sizeG);
  const drops = []; for (let i = 0; i < 4; i++) { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 9); c.setAttribute('cx', 118); dropsG.appendChild(c); drops.push(c); }
  function drawRig(ph) {
    const a = Math.sin(ph) * .26; const deg = a * 180 / Math.PI;
    beam.setAttribute('transform', `rotate(${-deg} 300 171)`);
    crank.setAttribute('transform', `rotate(${ph * 180 / Math.PI} 480 400)`);
    const ex = 480 + 40 * Math.sin(ph), ey = 400 - 40 * Math.cos(ph);
    const tx = 300 + 160 * Math.cos(a), ty = 171 - 160 * Math.sin(a); rod.setAttribute('x1', ex); rod.setAttribute('y1', ey); rod.setAttribute('x2', tx); rod.setAttribute('y2', ty);
    const hy = 210 + 182 * Math.sin(a); polish.setAttribute('y1', hy);
    drops.forEach((c, i) => { const k = ((ph / (Math.PI * 2)) + i / 4) % 1; const y = 420 - k * 300; c.setAttribute('cy', y); c.setAttribute('cx', 118 + Math.sin(k * 9 + i) * 14);
      const gold = k > .45; c.setAttribute('fill', gold ? '#f3d68b' : '#07070a'); c.setAttribute('stroke', gold ? '#8a6420' : '#d4a64a'); c.setAttribute('stroke-width', 2); c.setAttribute('r', gold ? 11 : 8); c.setAttribute('opacity', 1 - Math.max(0, k - .8) * 5); });
  }
  drawRig(0);
  function rigLoop(t) {
    if (!rigOn) return; const dt = Math.min(50, t - (lastT || t)); lastT = t;
    const ds = Math.abs(scrollY - lastScroll); lastScroll = scrollY;
    phase += dt * .0022 + ds * .012; drawRig(phase);
    const r = gc.getBoundingClientRect(), W = r.width, H = r.height;
    const sr = $('#pumpjack').getBoundingClientRect(); const sx = sr.left - r.left + sr.width * 118 / 600, sy = sr.top - r.top + sr.height * 300 / 500;
    const burst = 1 + ds * .2;
    for (let i = 0; i < 2 * burst && parts.length < coinsMax; i++) parts.push({ x: sx, y: sy, vx: (Math.random() - .5) * 3.4, vy: -7 - Math.random() * 5, r: 3 + Math.random() * 5, s: Math.random() * 6, life: 0, oil: Math.random() < .35 });
    gx.clearRect(0, 0, W, H);
    parts = parts.filter(p => { p.vy += .22; p.x += p.vx; p.y += p.vy; p.s += .2; p.life++; if (p.life > 25) p.oil = false;
      const w = Math.abs(Math.cos(p.s)) * p.r + .8; gx.beginPath(); gx.ellipse(p.x, p.y, w, p.r, 0, 0, Math.PI * 2);
      gx.fillStyle = p.oil ? '#0b0b0e' : (Math.cos(p.s) > 0 ? '#f3d68b' : '#c8973a'); gx.fill(); gx.strokeStyle = p.oil ? 'rgba(212,166,74,.5)' : '#8a6420'; gx.lineWidth = 1; gx.stroke();
      return p.y < H + 20; });
    requestAnimationFrame(rigLoop);
  }
  if (!reduced) watch(rig, v => { rigOn = v; if (v) { lastT = 0; requestAnimationFrame(rigLoop); } });

  /* ---------- joke calculator ---------- */
  const bar = $('#barrels'), out = $('#barrelsOut');
  function calc() { const b = +bar.value; out.textContent = b; $('#outFU').textContent = (b * 1776).toLocaleString(); $('#outBurg').textContent = (b * 4).toLocaleString(); $('#outFire').textContent = (b * 13).toLocaleString(); $('#outScreech').textContent = (b * 50).toLocaleString(); }
  bar.addEventListener('input', calc); calc();

  /* ---------- subscription clauses ---------- */
  $$('.clause .tick').forEach(t => t.addEventListener('change', () => t.closest('.clause').classList.toggle('done', t.checked)));

  /* ---------- 3D drag coin ---------- */
  const coin = $('#coin3d'); let ry = -20, vel = reduced ? 0 : .35, drag = false, lx = 0, coinOn = false;
  coin.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; coin.setPointerCapture(e.pointerId); });
  coin.addEventListener('pointermove', e => { if (!drag) return; const d = e.clientX - lx; lx = e.clientX; ry += d * .8; vel = d * .5; coin.style.transform = `rotateY(${ry}deg)`; });
  coin.addEventListener('pointerup', () => drag = false); coin.addEventListener('pointercancel', () => drag = false);
  coin.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.stopPropagation(); ry += e.key === 'ArrowLeft' ? -30 : 30; coin.style.transform = `rotateY(${ry}deg)`; } });
  function coinLoop() { if (!coinOn) return; if (!drag) { vel += ((reduced ? 0 : .35) - vel) * .03; ry += vel; coin.style.transform = `rotateY(${ry}deg) rotateX(${Math.sin(ry / 40) * 8}deg)`; } requestAnimationFrame(coinLoop); }
  coin.style.transform = `rotateY(${ry}deg)`;
  watch(coin, v => { coinOn = v; if (v) requestAnimationFrame(coinLoop); });

  /* ---------- MONEY RAIN gallery ---------- */
  const vault = $('#vault'), stage = $('#vaultStage'), items = $$('#rainList li'), rc = $('#rainCanvas'), rx = rc.getContext('2d');
  let mode = reduced ? 'static' : (isNarrow() || !finePointer && innerWidth < 1200 ? 'mobile' : 'desktop');
  root.classList.add(mode === 'desktop' ? 'rain-desktop' : mode === 'mobile' ? 'rain-mobile' : 'rain-static');
  let layout = [], override = null, vaultOn = false, bills = [], burstQ = 0;
  const rnd = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
  function computeLayout() {
    const W = stage.clientWidth, H = stage.clientHeight; const cw = clamp(W * .145, 150, 250); const ch = cw * .75 + 30;
    stage.style.setProperty('--cw', cw + 'px');
    const cols = 5, span = W * .8, x0 = W * .1;
    layout = items.map((li, i) => { const row = i < 5 ? 0 : 1; const c = row ? (i - 5) : i;
      const fx = x0 + (c + .5) * span / cols - cw / 2 + (rnd(i, 1) - .5) * cw * .3 + (row ? span / cols * .35 : 0) * (c % 2 ? 1 : -1) * .5;
      const fy = H - ch - 26 - row * ch * .55 - rnd(i, 2) * 18;
      return { fx, fy, rz: (rnd(i, 3) - .5) * 26, sy: -ch - 60 - rnd(i, 4) * H * .4, amp: 60 + rnd(i, 5) * 120, f: 2 + rnd(i, 6) * 2.5, ph: rnd(i, 7) * 6 }; });
  }
  function vaultProgress() { const r = vault.getBoundingClientRect(); return clamp(-r.top / (vault.offsetHeight - innerHeight), 0, 1); }
  function placeCards(p) {
    items.forEach((li, i) => { const L = layout[i]; if (!L) return; const t = clamp((p - i * .062) / .33, 0, 1); const u = 1 - t;
      const e = 1 - Math.pow(u, 2.2); const y = L.sy + (L.fy - L.sy) * e - (t > .9 ? Math.sin((t - .9) / .1 * Math.PI) * 10 : 0);
      const x = L.fx + Math.sin(t * Math.PI * L.f + L.ph) * L.amp * u;
      const rX = Math.sin(t * Math.PI * 5 + L.ph) * 60 * u, rY = Math.cos(t * Math.PI * 4 + L.ph) * 50 * u, rZ = L.rz + Math.sin(t * Math.PI * 3 + L.ph) * 45 * u;
      li.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotateX(${rX.toFixed(1)}deg) rotateY(${rY.toFixed(1)}deg) rotateZ(${rZ.toFixed(1)}deg)`;
      li.style.zIndex = String(10 + i); li.style.visibility = t <= 0 ? 'hidden' : 'visible';
      if (t > 0 && t < 1 && !li._fall) { li._fall = 1; burstQ += 6; } if (t <= 0) li._fall = 0; });
  }
  function sizeRain() { const dpr = Math.min(devicePixelRatio || 1, 2); rc.width = stage.clientWidth * dpr; rc.height = stage.clientHeight * dpr; rx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  const maxBills = mode === 'desktop' ? 90 : 26;
  function spawn(n) { const W = stage.clientWidth; for (let i = 0; i < n && bills.length < maxBills * 1.6; i++) bills.push({ x: Math.random() * W, y: -40 - Math.random() * 200, vy: 1.2 + Math.random() * 2.2, sway: Math.random() * 6, sp: .02 + Math.random() * .03, rot: Math.random() * 6, vr: (Math.random() - .5) * .08, coin: Math.random() < .4, s: .7 + Math.random() * .6, flip: Math.random() * 6 }); }
  function drawRain() {
    const W = stage.clientWidth, H = stage.clientHeight; rx.clearRect(0, 0, W, H);
    if (bills.length < maxBills * .5) spawn(1); if (burstQ > 0) { spawn(Math.min(burstQ, 8)); burstQ -= 8; }
    bills = bills.filter(b => { b.y += b.vy; b.sway += b.sp; b.rot += b.vr; b.flip += .08; const x = b.x + Math.sin(b.sway) * 30;
      rx.save(); rx.translate(x, b.y); rx.rotate(b.rot);
      if (b.coin) { const w = Math.abs(Math.cos(b.flip)) * 9 * b.s + 1; rx.beginPath(); rx.ellipse(0, 0, w, 9 * b.s, 0, 0, 7); rx.fillStyle = Math.cos(b.flip) > 0 ? '#f3d68b' : '#c8973a'; rx.fill(); rx.strokeStyle = '#8a6420'; rx.stroke(); }
      else { const sy = Math.max(.15, Math.abs(Math.cos(b.flip))); rx.scale(b.s, b.s * sy); rx.fillStyle = '#cfe0b8'; rx.fillRect(-24, -11, 48, 22); rx.strokeStyle = '#3f6b3f'; rx.lineWidth = 2; rx.strokeRect(-21, -8, 42, 16); rx.beginPath(); rx.arc(0, 0, 5, 0, 7); rx.stroke(); }
      rx.restore(); return b.y < H + 40; });
  }
  function rainLoop() { if (!vaultOn) return; if (mode === 'desktop') placeCards(override != null ? override.p : vaultProgress()); drawRain(); requestAnimationFrame(rainLoop); }
  function replay() {
    if (mode === 'desktop') {
      const s = performance.now(); override = { p: 0 }; items.forEach(li => li._fall = 0); burstQ += 60;
      const st = vault.getBoundingClientRect(); if (st.top > 10 || st.bottom < innerHeight) scrollToEl(stage);
      const step = n => { override.p = clamp((n - s) / 4200, 0, 1); if (override.p < 1) requestAnimationFrame(step); else setTimeout(() => { if (vaultProgress() < 1) override = { p: 1 }; else override = null; }, 50); };
      requestAnimationFrame(step);
    } else if (mode === 'mobile') {
      burstQ += 30; items.forEach((li, i) => { li.classList.remove('flutter'); void li.offsetWidth; li.style.animationDelay = (i * .12) + 's'; li.classList.add('flutter'); });
    } else toast('Reduced motion is on — the vault stays still.');
  }
  $('#rainBtn').addEventListener('click', replay);
  addEventListener('scroll', () => { if (override && override.p >= 1 && vaultProgress() <= .01) override = null; }, { passive: true });
  if (mode === 'desktop') {
    computeLayout(); placeCards(0); sizeRain();
    addEventListener('resize', () => { computeLayout(); sizeRain(); });
  } else if (mode === 'mobile') {
    sizeRain(); addEventListener('resize', sizeRain);
    items.forEach((li, i) => { li.style.setProperty('--rz', (i % 2 ? 2 : -2) + 'deg'); li.classList.add('pending');
      watch(li, v => { if (v && li.classList.contains('pending')) { li.classList.remove('pending'); li.style.animationDelay = ((i % 2) * .15) + 's'; li.classList.add('flutter'); burstQ += 4; } }, '0px 0px -10% 0px'); });
  }
  if (mode !== 'static') watch(stage, v => { const was = vaultOn; vaultOn = v; if (v && !was) requestAnimationFrame(rainLoop); }, '0px');
  else rc.remove();

  /* ---------- lightbox ---------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'); let lbI = 0, lastFocus = null;
  const bills$ = $$('.bill');
  function openLB(i) { lbI = (i + bills$.length) % bills$.length; const im = bills$[lbI].querySelector('img'); lbImg.src = im.dataset.full; lbImg.alt = im.alt; lbCap.textContent = bills$[lbI].querySelector('span').textContent + ' — ' + im.alt;
    if (lb.hidden) { lastFocus = document.activeElement; lb.hidden = false; lenis && lenis.stop(); $('.lb-close').focus(); } }
  function closeLB() { lb.hidden = true; lenis && lenis.start(); lastFocus && lastFocus.focus({ preventScroll: true }); }
  bills$.forEach((b, i) => b.addEventListener('click', () => openLB(i)));
  $('.lb-close').addEventListener('click', closeLB); $('.lb-prev').addEventListener('click', () => openLB(lbI - 1)); $('.lb-next').addEventListener('click', () => openLB(lbI + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') closeLB(); else if (e.key === 'ArrowRight') openLB(lbI + 1); else if (e.key === 'ArrowLeft') openLB(lbI - 1);
    else if (e.key === 'Tab') { const f = $$('#lightbox button'); const k = f.indexOf(document.activeElement); e.preventDefault(); f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); } });

  /* ---------- coin cursor ---------- */
  if (finePointer && !reduced) {
    const cur = $('#cursor'); let cx = -100, cy = -100, x = -100, y = -100, on = false;
    addEventListener('pointermove', e => { cx = e.clientX; cy = e.clientY; if (!on) { on = true; root.classList.add('has-cursor'); } }, { passive: true });
    document.addEventListener('pointerleave', () => { on = false; root.classList.remove('has-cursor'); });
    document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a,button,.coin3d,input')));
    (function cl() { x += (cx - x) * .25; y += (cy - y) * .25; cur.style.transform = `translate3d(${x}px,${y}px,0)`; requestAnimationFrame(cl); })();
  }

  if (hasGSAP) addEventListener('load', () => ScrollTrigger.refresh());
})();
