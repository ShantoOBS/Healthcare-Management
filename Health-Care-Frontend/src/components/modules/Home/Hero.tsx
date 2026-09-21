"use client";

import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Find a doctor", href: "#" },
  { label: "How it works", href: "#" },
  { label: "About", href: "#" },
];

const CHIPS = ["Verified Doctors", "Easy Appointments", "Secure"];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function LogoMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f3fa9b" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M12 6v12M6 12h12" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="12" cy="4.4" r="1.2" fill="#f3fa9b" stroke="none" />
      <circle cx="12" cy="19.6" r="1.2" fill="#f3fa9b" stroke="none" />
      <circle cx="4.4" cy="12" r="1.2" fill="#f3fa9b" stroke="none" />
      <circle cx="19.6" cy="12" r="1.2" fill="#f3fa9b" stroke="none" />
    </svg>
  );
}

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  tone: number;
  ox: number;
  oy: number;
  ph: number;
}

const PALETTE: [number, number, number][] = [
  [24, 78, 56],
  [58, 120, 48],
  [128, 172, 52],
  [214, 236, 96],
];

function mixColor(t: number): [number, number, number] {
  const p = Math.min(Math.max(t, 0), 0.999) * (PALETTE.length - 1);
  const i = Math.floor(p);
  const f = p - i;
  const a = PALETTE[i];
  const b = PALETTE[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

const rand = () => Math.random();
const gauss = () => (rand() + rand() + rand() + rand() - 2) / 2;

interface Droplet {
  x: number;
  y: number;
  z: number;
  r: number;
  ph: number;
}

const TURNS = 1.7;
const radiusAt = (t: number) => 0.4 * (0.55 + 0.45 * Math.cos(t * 1.3));
const angleAt = (t: number, strand: number) => t * TURNS * Math.PI * 2 + strand * Math.PI;

function randomDir(): [number, number, number] {
  const x = gauss();
  const y = gauss();
  const z = gauss();
  const n = Math.hypot(x, y, z) || 1;
  return [x / n, y / n, z / n];
}

function buildHelix() {
  const pts: Particle[] = [];
  const add = (x: number, y: number, z: number, size: number, alpha: number, tone: number) => {
    pts.push({ x, y, z, size, alpha, tone, ox: 0, oy: 0, ph: rand() * Math.PI * 2 });
  };

  for (let s = 0; s < 2; s++) {
    for (let i = 0; i < 4200; i++) {
      const t = rand() * 2 - 1;
      const a = angleAt(t, s);
      const R = radiusAt(t);
      const [dx, dy, dz] = randomDir();
      const tube = 0.036 * Math.sqrt(rand());
      add(
        t + dx * tube,
        Math.cos(a) * R + dy * tube,
        Math.sin(a) * R + dz * tube,
        0.7 + rand() * 1.4,
        0.45 + rand() * 0.45,
        rand()
      );
    }
  }

  const RUNGS = 20;
  for (let k = 0; k < RUNGS; k++) {
    const t = -0.94 + (1.88 * (k + 0.5)) / RUNGS;
    const a = angleAt(t, 0);
    const R = radiusAt(t);
    const cy = Math.cos(a) * R;
    const cz = Math.sin(a) * R;

    for (let j = 0; j < 70; j++) {
      const m = rand() * 2 - 1;
      add(t + gauss() * 0.004, cy * m + gauss() * 0.006, cz * m + gauss() * 0.006, 0.8 + rand() * 0.7, 0.5 + rand() * 0.3, 0.35 + rand() * 0.5);
    }
    for (const m of [-0.42, 0.42]) {
      for (let j = 0; j < 18; j++) {
        add(t + gauss() * 0.012, cy * m + gauss() * 0.012, cz * m + gauss() * 0.012, 1 + rand() * 1.1, 0.55 + rand() * 0.35, 0.5 + rand() * 0.5);
      }
    }
  }

  for (let i = 0; i < 400; i++) {
    add(rand() * 2.3 - 1.15, gauss() * 0.6, gauss() * 0.6, 0.5 + rand() * 0.9, 0.15 + rand() * 0.25, rand());
  }

  const drops: Droplet[] = [];
  for (let i = 0; i < 14; i++) {
    const t = rand() * 2.1 - 1.05;
    const a = rand() * Math.PI * 2;
    const R = radiusAt(t) + 0.12 + rand() * 0.4;
    drops.push({
      x: t + gauss() * 0.08,
      y: Math.cos(a) * R,
      z: Math.sin(a) * R,
      r: 2 + Math.pow(rand(), 2) * 7,
      ph: rand() * Math.PI * 2,
    });
  }

  return { pts, drops };
}

function HelixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { pts, drops } = buildHelix();

    let W = 0;
    let H = 0;
    let DPR = 1;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const r = host.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    const tilt = -0.95;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);

    const frame = (time: number) => {
      const t = time * 0.00006;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const narrow = W < 820;
      const cx = W * (narrow ? 0.6 : 0.66);
      const cy = H * (narrow ? 0.52 : 0.5);
      const L = narrow ? Math.min(W * 0.62, (H * 0.36) / Math.abs(st)) : Math.min(W * 0.33, (H * 0.35) / Math.abs(st));

      const spin = t * 2.2;
      const cs = Math.cos(spin);
      const sn = Math.sin(spin);
      const reach = 110;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        const y1 = p.y * cs - p.z * sn;
        const z1 = p.y * sn + p.z * cs;
        const x1 = p.x + Math.sin(t * 6 + p.ph) * 0.004;
        const y2 = y1 + Math.cos(t * 5 + p.ph * 1.3) * 0.004;

        const persp = 1 / (1 - z1 * 0.9);
        const px = cx + (x1 * ct - y2 * st) * persp * L + p.ox;
        const py = cy + (x1 * st + y2 * ct) * persp * L + p.oy;

        const mx = px - mouse.x;
        const my = py - mouse.y;
        const d2 = mx * mx + my * my;
        if (d2 < reach * reach && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / reach) * 2.4;
          p.ox += (mx / d) * f;
          p.oy += (my / d) * f;
        }
        p.ox *= 0.94;
        p.oy *= 0.94;

        if (px < -10 || px > W + 10 || py < -10 || py > H + 10) continue;

        const depth = (z1 + 0.6) / 1.2;
        const c = mixColor(0.15 + p.tone * 0.55 + (1 - depth) * 0.3);
        const s = p.size * (0.7 + depth * 0.8) * persp;
        const a = p.alpha * (0.45 + depth * 0.55);

        ctx.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a.toFixed(3)})`;
        if (s < 1.2) {
          ctx.fillRect(px - s, py - s, s * 2, s * 2);
        } else {
          ctx.beginPath();
          ctx.arc(px, py, s, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        const y1 = d.y * cs - d.z * sn;
        const z1 = d.y * sn + d.z * cs;
        const x1 = d.x + Math.sin(t * 5 + d.ph) * 0.01;
        const y2 = y1 + Math.cos(t * 4 + d.ph) * 0.01;
        const persp = 1 / (1 - z1 * 0.9);
        const px = cx + (x1 * ct - y2 * st) * persp * L;
        const py = cy + (x1 * st + y2 * ct) * persp * L;
        const depth = (z1 + 0.6) / 1.2;
        const r = d.r * (0.7 + depth * 0.5) * (narrow ? 0.8 : 1);

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(243,250,155,0.28)";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(58,120,48,${(0.25 + depth * 0.3).toFixed(3)})`;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px - r * 0.35, py - r * 0.35, Math.max(r * 0.25, 0.6), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.fill();
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    if (reduce) frame(9000);
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="dl-helix" aria-hidden="true" />;
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Hero() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 821px)");
    const onMq = () => {
      if (mq.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <section className="dl-page">
      <style>{styles}</style>
      <HelixCanvas />

      <header className="dl-nav" ref={navRef}>
        <a className="dl-logo dl-glass" href="#" aria-label="DocLink home">
          <span className="dl-logo-mark">
            <LogoMark />
          </span>
          DocLink
        </a>

        <nav className="dl-links dl-glass" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a className="dl-contact" href="#">
          Contact Us
          <span className="dl-arrow">
            <ArrowIcon />
          </span>
        </a>

        <button
          type="button"
          className="dl-menu-btn dl-glass"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="dl-mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        {open && (
          <nav id="dl-mobile-menu" className="dl-mobile-menu" aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="dl-hero">
        <div className="dl-copy">
          <p className="dl-eyebrow">Your health, connected</p>
          <h1>Connect with the right doctor, anytime.</h1>
          <p className="dl-lede">
            DocLink makes healthcare simple. Find trusted doctors, book appointments and consult with
            healthcare professionals through one secure platform.
          </p>
        </div>
      </main>

      <footer className="dl-bottom">
        <div className="dl-rule" />
        <div className="dl-row">
          <div>
            <p className="dl-note">Doctors, appointments and consults in one place</p>
            <div className="dl-ctas">
              <a className="dl-btn dl-btn-primary" href="#">
                Find a Doctor
                <span className="dl-arrow">
                  <ArrowIcon />
                </span>
              </a>
              <a className="dl-btn dl-btn-accent" href="#">
                Book an Appointment
              </a>
            </div>
          </div>

          <ul className="dl-chips" aria-label="Why DocLink">
            {CHIPS.map((c) => (
              <li key={c}>
                <CheckIcon />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </section>
  );
}

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap");

.dl-page {
  --dl-bg: #e8eeeb;
  --dl-ink: #0e1e19;
  --dl-brand: #1f5c4b;
  --dl-brand-ink: #ffffff;
  --dl-accent: #f3fa9b;
  --dl-accent-ink: #1c3a2e;
  --dl-glass: rgba(255, 255, 255, 0.78);
  --dl-chip: rgba(255, 255, 255, 0.66);
  --dl-line: rgba(31, 92, 75, 0.2);

  position: relative;
  box-sizing: border-box;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  padding: max(24px, env(safe-area-inset-top)) clamp(20px, 2.8vw, 40px) max(32px, env(safe-area-inset-bottom));
  overflow: hidden;
  background: var(--dl-bg);
  color: var(--dl-ink);
  color-scheme: light;
  font-family: "Outfit", "Google Sans", "Segoe UI", system-ui, -apple-system, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.dl-page *, .dl-page *::before, .dl-page *::after { box-sizing: border-box; }
.dl-page a { color: inherit; text-decoration: none; }
.dl-page a:focus-visible { outline: 2px solid var(--dl-brand); outline-offset: 3px; }

.dl-helix {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.dl-nav {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 10px;
}
.dl-glass {
  background: var(--dl-glass);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 12px;
}
.dl-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 16px 5px 5px;
  font-size: 1.05rem;
  font-weight: 400;
}
.dl-logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--dl-brand);
  display: grid;
  place-items: center;
}
.dl-links { display: flex; padding: 0 6px; }
.dl-links a {
  padding: 15px 16px;
  font-size: 0.88rem;
  white-space: nowrap;
  opacity: 0.88;
  transition: opacity 0.15s;
}
.dl-links a:hover { opacity: 1; }

.dl-contact {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 5px 5px 5px 24px;
  border-radius: 999px;
  background: var(--dl-brand);
  color: var(--dl-brand-ink) !important;
  font-size: 1rem;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.dl-arrow {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--dl-accent);
  color: var(--dl-accent-ink);
  display: grid;
  place-items: center;
  flex: none;
  transition: transform 0.25s ease;
}
.dl-contact:hover .dl-arrow,
.dl-btn:hover .dl-arrow { transform: rotate(45deg); }

.dl-hero {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 56px 0 40px;
}
.dl-copy { max-width: 620px; }
.dl-eyebrow {
  margin: 0 0 22px;
  font-size: 0.74rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--dl-brand);
}
.dl-copy h1 {
  margin: 0;
  font-size: clamp(2.5rem, 5.6vw, 4.5rem);
  font-weight: 300;
  line-height: 1.06;
  letter-spacing: -0.025em;
  text-wrap: balance;
}
.dl-lede {
  margin: 36px 0 0;
  max-width: 44ch;
  font-size: 0.98rem;
  line-height: 1.5;
}

.dl-bottom { position: relative; z-index: 1; }
.dl-rule { height: 1px; background: var(--dl-line); margin-bottom: 26px; }
.dl-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 28px;
  flex-wrap: wrap;
}
.dl-note {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 22px;
  font-size: 0.92rem;
  color: var(--dl-brand);
}
.dl-note::after { content: ""; width: 56px; height: 1px; background: currentColor; opacity: 0.8; }
.dl-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
.dl-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 26px;
  border-radius: 999px;
  font-size: 1rem;
  transition: transform 0.15s ease;
}
.dl-btn:active { transform: scale(0.98); }
.dl-btn-primary { background: var(--dl-brand); color: var(--dl-brand-ink) !important; padding-right: 6px; }
.dl-btn-accent { background: var(--dl-accent); color: var(--dl-accent-ink) !important; }

.dl-chips {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  max-width: 480px;
}
.dl-chips li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px 0 16px;
  border-radius: 999px;
  background: var(--dl-chip);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  font-size: 0.92rem;
}
.dl-chips svg { color: var(--dl-brand); flex: none; }

@media (prefers-reduced-motion: no-preference) {
  .dl-copy > * { animation: dl-rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
  .dl-copy > :nth-child(2) { animation-delay: 0.08s; }
  .dl-copy > :nth-child(3) { animation-delay: 0.18s; }
}
@keyframes dl-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}

.dl-menu-btn,
.dl-mobile-menu { display: none; }

.dl-menu-btn {
  width: 48px;
  height: 48px;
  padding: 0;
  border: 0;
  flex: none;
  place-items: center;
  color: var(--dl-ink);
  font: inherit;
  cursor: pointer;
}
.dl-menu-btn:focus-visible { outline: 2px solid var(--dl-brand); outline-offset: 3px; }

.dl-mobile-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  z-index: 5;
  flex-direction: column;
  padding: 6px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 14px 34px rgba(14, 30, 25, 0.14);
}
.dl-mobile-menu a {
  padding: 15px 16px;
  border-radius: 10px;
  font-size: 1rem;
}
.dl-mobile-menu a:hover,
.dl-mobile-menu a:active { background: rgba(31, 92, 75, 0.08); }

@media (prefers-reduced-motion: no-preference) {
  .dl-mobile-menu { animation: dl-drop 0.2s ease both; }
}
@keyframes dl-drop {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: none; }
}

@media (max-width: 820px) {
  .dl-links { display: none; }
  .dl-menu-btn { display: grid; }
  .dl-mobile-menu { display: flex; }

  .dl-helix { opacity: 0.6; }
  .dl-hero { padding-top: 40px; }
  .dl-row { flex-direction: column; align-items: flex-start; }
  .dl-chips { justify-content: flex-start; max-width: none; }
}
@media (max-width: 420px) {
  .dl-page { padding-left: 16px; padding-right: 16px; }
  .dl-nav { gap: 8px; }
  .dl-logo { padding-right: 12px; font-size: 1rem; }
  .dl-contact { padding-left: 16px; font-size: 0.9rem; gap: 8px; }
  .dl-contact .dl-arrow { width: 32px; height: 32px; }
  .dl-menu-btn { width: 44px; height: 44px; }
  .dl-btn { padding: 0 20px; }
  .dl-btn-primary { padding-right: 6px; }
}
`;

export default Hero;
