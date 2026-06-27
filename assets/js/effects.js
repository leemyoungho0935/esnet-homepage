/**
 * ESNET Homepage — Shared Effects Engine
 * Network Particles · UTP Cable Cursor · Scroll Reveal · Counters · Preloader
 */

/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  const el = document.getElementById('preloader');
  if (!el) return;
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 700);
  }, 1000);
});

/* ===== NETWORK PARTICLES ===== */
class NetworkParticles {
  constructor(id, opts = {}) {
    this.cvs = document.getElementById(id);
    if (!this.cvs) return;
    this.ctx = this.cvs.getContext('2d');
    this.nodes = [];
    this.mouse = { x: -9e3, y: -9e3 };
    this.o = Object.assign({
      count: window.innerWidth < 768 ? 18 : 50,
      rgb: '38,104,163', maxDist: 140, speed: 0.35, r: 2
    }, opts);
    this._resize(); this._spawn(); this._bindEvents(); this._loop();
  }
  _resize() {
    const b = this.cvs.parentElement.getBoundingClientRect();
    this.cvs.width = b.width; this.cvs.height = b.height;
  }
  _spawn() {
    this.nodes = Array.from({ length: this.o.count }, () => ({
      x: Math.random() * this.cvs.width, y: Math.random() * this.cvs.height,
      vx: (Math.random() - .5) * this.o.speed, vy: (Math.random() - .5) * this.o.speed
    }));
  }
  _bindEvents() {
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { this._resize(); this._spawn(); }, 200); });
    const t = this.cvs.closest('section') || this.cvs.parentElement;
    t.addEventListener('mousemove', e => { const r = this.cvs.getBoundingClientRect(); this.mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; });
    t.addEventListener('mouseleave', () => { this.mouse = { x: -9e3, y: -9e3 }; });
  }
  _loop() {
    const { ctx: c, nodes: N, o, mouse: m } = this;
    c.clearRect(0, 0, this.cvs.width, this.cvs.height);
    N.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > this.cvs.width) n.vx *= -1;
      if (n.y < 0 || n.y > this.cvs.height) n.vy *= -1;
      c.beginPath(); c.arc(n.x, n.y, o.r, 0, 6.3);
      c.fillStyle = `rgba(${o.rgb},.45)`; c.fill();
    });
    for (let i = 0; i < N.length; i++) {
      for (let j = i + 1; j < N.length; j++) {
        const d = Math.hypot(N[i].x - N[j].x, N[i].y - N[j].y);
        if (d < o.maxDist) {
          c.beginPath(); c.moveTo(N[i].x, N[i].y); c.lineTo(N[j].x, N[j].y);
          c.strokeStyle = `rgba(${o.rgb},${.14 * (1 - d / o.maxDist)})`; c.lineWidth = .8; c.stroke();
        }
      }
      const d = Math.hypot(N[i].x - m.x, N[i].y - m.y);
      if (d < o.maxDist * 1.6) {
        c.beginPath(); c.moveTo(N[i].x, N[i].y); c.lineTo(m.x, m.y);
        c.strokeStyle = `rgba(${o.rgb},${.25 * (1 - d / (o.maxDist * 1.6))})`; c.lineWidth = 1; c.stroke();
      }
    }
    requestAnimationFrame(() => this._loop());
  }
}

/* ===== UTP CABLE CURSOR ===== */
class CableCursor {
  constructor(opts = {}) {
    if (matchMedia('(pointer:coarse)').matches) return;
    this.rgb = opts.rgb || '38,104,163';
    this.hex = opts.hex || '#2668A3';
    this.pts = []; this.maxAge = 480;
    this.cvs = document.createElement('canvas');
    Object.assign(this.cvs.style, { position:'fixed', inset:'0', width:'100%', height:'100%', pointerEvents:'none', zIndex:'9998' });
    document.body.appendChild(this.cvs);
    this.ctx = this.cvs.getContext('2d');
    this.el = document.createElement('div');
    this.el.innerHTML = this._svg();
    Object.assign(this.el.style, { position:'fixed', top:'0', left:'0', pointerEvents:'none', zIndex:'9999', transform:'translate(-50%,-50%)', willChange:'transform', transition:'none' });
    document.body.appendChild(this.el);
    document.body.style.cursor = 'none';
    document.querySelectorAll('a,button,[role=button],input,textarea,select,label').forEach(el => { el.style.cursor = 'none'; });
    this._resize();
    window.addEventListener('resize', () => this._resize());
    document.addEventListener('mousemove', e => this._move(e));
    document.addEventListener('mouseleave', () => { this.pts = []; });
    this._draw();
  }
  _svg() {
    const c = this.hex;
    // RJ45 plug — portrait orientation, pins on top
    // viewBox: 36 wide × 52 tall (세로가 더 긴 비율)
    return `<svg width="36" height="52" viewBox="0 0 36 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Cable tail bottom -->
      <rect x="11" y="44" width="14" height="7" rx="3" fill="${c}" opacity=".5"/>
      <rect x="13.5" y="45.5" width="9" height="4" rx="1.5" fill="rgba(0,0,0,.25)"/>
      <!-- Main body -->
      <rect x="2" y="8" width="32" height="38" rx="4" fill="${c}"/>
      <!-- Top bevel highlight -->
      <rect x="2" y="8" width="32" height="5" rx="4" fill="rgba(255,255,255,.18)"/>
      <!-- Right side shadow -->
      <rect x="29" y="8" width="5" height="38" rx="2" fill="rgba(0,0,0,.18)"/>
      <!-- Locking tab on top -->
      <rect x="10" y="2" width="16" height="9" rx="3" fill="${c}" opacity=".9"/>
      <rect x="12" y="3.5" width="12" height="5" rx="2" fill="rgba(0,0,0,.18)"/>
      <!-- Pin window recess — TOP of body (pins face up) -->
      <rect x="5" y="10" width="26" height="13" rx="2" fill="rgba(0,0,0,.4)"/>
      <!-- 8 gold pins — top section -->
      <rect x="6"    y="11" width="2.5" height="10" rx="1" fill="#FFD700"/>
      <rect x="9.5"  y="11" width="2.5" height="10" rx="1" fill="#E8C000"/>
      <rect x="13"   y="11" width="2.5" height="10" rx="1" fill="#FFD700"/>
      <rect x="16.5" y="11" width="2.5" height="10" rx="1" fill="#E8C000"/>
      <rect x="20"   y="11" width="2.5" height="10" rx="1" fill="#FFD700"/>
      <rect x="23.5" y="11" width="2.5" height="10" rx="1" fill="#E8C000"/>
      <rect x="27"   y="11" width="2.5" height="10" rx="1" fill="#FFD700"/>
      <!-- Gold shine -->
      <rect x="6"    y="11" width="2.5" height="2.5" rx=".5" fill="rgba(255,255,255,.35)"/>
      <rect x="9.5"  y="11" width="2.5" height="2.5" rx=".5" fill="rgba(255,255,255,.35)"/>
      <rect x="13"   y="11" width="2.5" height="2.5" rx=".5" fill="rgba(255,255,255,.35)"/>
      <rect x="16.5" y="11" width="2.5" height="2.5" rx=".5" fill="rgba(255,255,255,.35)"/>
      <rect x="20"   y="11" width="2.5" height="2.5" rx=".5" fill="rgba(255,255,255,.35)"/>
      <rect x="23.5" y="11" width="2.5" height="2.5" rx=".5" fill="rgba(255,255,255,.35)"/>
      <rect x="27"   y="11" width="2.5" height="2.5" rx=".5" fill="rgba(255,255,255,.35)"/>
      <!-- Body label area -->
      <rect x="6" y="27" width="24" height="10" rx="2" fill="rgba(0,0,0,.12)"/>
    </svg>`;
  }
  _resize() { this.cvs.width = innerWidth; this.cvs.height = innerHeight; }
  _move(e) {
    this.el.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
    this.pts.push({ x: e.clientX, y: e.clientY, t: Date.now() });
    if (this.pts.length > 80) this.pts.shift();
  }
  _draw() {
    const { ctx: c, cvs } = this;
    c.clearRect(0, 0, cvs.width, cvs.height);
    const now = Date.now();
    this.pts = this.pts.filter(p => now - p.t < this.maxAge);
    const P = this.pts;
    if (P.length > 2) {
      // Outer cable
      c.beginPath(); c.moveTo(P[0].x, P[0].y);
      for (let i = 1; i < P.length - 1; i++) {
        c.quadraticCurveTo(P[i].x, P[i].y, (P[i].x + P[i+1].x)/2, (P[i].y + P[i+1].y)/2);
      }
      c.lineTo(P[P.length-1].x, P[P.length-1].y);
      c.strokeStyle = `rgba(${this.rgb},.5)`; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
      // Inner highlight
      c.beginPath(); c.moveTo(P[0].x, P[0].y);
      for (let i = 1; i < P.length - 1; i++) {
        c.quadraticCurveTo(P[i].x, P[i].y, (P[i].x + P[i+1].x)/2, (P[i].y + P[i+1].y)/2);
      }
      c.lineTo(P[P.length-1].x, P[P.length-1].y);
      c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = 1.5; c.stroke();
    }
    requestAnimationFrame(() => this._draw());
  }
}

/* ===== SCROLL REVEAL ===== */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('revealed'));
    return;
  }
  const ob = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.revealDelay || 0;
        setTimeout(() => e.target.classList.add('revealed'), +delay);
        ob.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '50px' });
  els.forEach((el, i) => {
    // Stagger siblings with same parent
    if (!el.dataset.revealDelay) {
      const siblings = el.parentElement.querySelectorAll(':scope > [data-reveal]');
      if (siblings.length > 1) {
        const idx = Array.from(siblings).indexOf(el);
        el.dataset.revealDelay = idx * 120;
      }
    }
    ob.observe(el);
  });
  // Fallback
  setTimeout(() => { els.forEach(el => el.classList.add('revealed')); }, 3000);
}

/* ===== COUNTER ANIMATION ===== */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const ob = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const t = +e.target.dataset.count, s = e.target.dataset.suffix || '', dur = 2000, st = performance.now();
      const step = now => {
        const p = Math.min((now - st) / dur, 1), v = 1 - Math.pow(1 - p, 3);
        e.target.textContent = Math.floor(t * v) + s;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      ob.unobserve(e.target);
    });
  }, { threshold: .5 });
  els.forEach(el => ob.observe(el));
}

/* ===== AUTO-INIT ===== */
(function autoInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initReveal(); initCounters(); });
  } else {
    initReveal(); initCounters();
  }
})();
