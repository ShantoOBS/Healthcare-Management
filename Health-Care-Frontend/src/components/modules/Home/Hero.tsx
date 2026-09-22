"use client";

import { useEffect, useRef } from "react";


const CHIPS = ["Verified Doctors", "Easy Appointments", "Secure"];

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
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
  [30, 92, 70],
  [66, 132, 67],
  [126, 174, 83],
  [191, 216, 121],
];

function mixColor(t: number): [number, number, number] {
  const p = Math.min(Math.max(t, 0), 0.999) * (PALETTE.length - 1);
  const i = Math.floor(p);
  const f = p - i;
  const a = PALETTE[i];
  const b = PALETTE[i + 1];

  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

const rand = () => Math.random();

const gauss = () =>
  (rand() + rand() + rand() + rand() - 2) / 2;

interface Droplet {
  x: number;
  y: number;
  z: number;
  r: number;
  ph: number;
}

/*
 * IMPORTANT:
 * Keep the radius constant. The previous radiusAt() changed the radius
 * along the helix and made the DNA look like a heart / ribbon.
 */
const HELIX_RADIUS = 0.42;
const HELIX_LENGTH = 2;
const TURNS = 2.15;

const angleAt = (t: number, strand: number) =>
  t * TURNS * Math.PI * 2 + strand * Math.PI;

function randomDir(): [number, number, number] {
  const x = gauss();
  const y = gauss();
  const z = gauss();
  const n = Math.hypot(x, y, z) || 1;

  return [x / n, y / n, z / n];
}

function buildHelix() {
  const pts: Particle[] = [];

  const add = (
    x: number,
    y: number,
    z: number,
    size: number,
    alpha: number,
    tone: number
  ) => {
    pts.push({
      x,
      y,
      z,
      size,
      alpha,
      tone,
      ox: 0,
      oy: 0,
      ph: rand() * Math.PI * 2,
    });
  };

  // Two continuous particle strands.
  for (let strand = 0; strand < 2; strand++) {
    for (let i = 0; i < 3300; i++) {
      const t = rand() * 2 - 1;
      const a = angleAt(t, strand);
      const [dx, dy, dz] = randomDir();

      // Very thin tube around the mathematical helix.
      const tube = 0.028 * Math.sqrt(rand());

      add(
        t * HELIX_LENGTH + dx * tube,
        Math.cos(a) * HELIX_RADIUS + dy * tube,
        Math.sin(a) * HELIX_RADIUS + dz * tube,
        0.65 + rand() * 1.45,
        0.48 + rand() * 0.42,
        0.08 + rand() * 0.88
      );
    }
  }

  // Base-pair rungs. These make the DNA structure immediately recognizable.
  const RUNGS = 28;

  for (let k = 0; k < RUNGS; k++) {
    const t = -0.94 + (1.88 * k) / (RUNGS - 1);
    const a = angleAt(t, 0);

    const y = Math.cos(a) * HELIX_RADIUS;
    const z = Math.sin(a) * HELIX_RADIUS;

    for (let j = 0; j < 85; j++) {
      const m = rand() * 2 - 1;
      const [dx, dy, dz] = randomDir();
      const noise = 0.006;

      add(
        t * HELIX_LENGTH + dx * noise,
        y * m + dy * noise,
        z * m + dz * noise,
        0.55 + rand() * 1.1,
        0.38 + rand() * 0.35,
        0.2 + rand() * 0.55
      );
    }
  }

  // A small amount of ambient dust, mostly around the molecule.
  for (let i = 0; i < 260; i++) {
    const t = rand() * 2.35 - 1.175;

    add(
      t * HELIX_LENGTH,
      gauss() * 0.72,
      gauss() * 0.72,
      0.4 + rand() * 0.8,
      0.08 + rand() * 0.18,
      rand()
    );
  }

  const drops: Droplet[] = [];

  for (let i = 0; i < 12; i++) {
    const t = rand() * 2.15 - 1.075;
    const a = rand() * Math.PI * 2;
    const radius = HELIX_RADIUS + 0.1 + rand() * 0.35;

    drops.push({
      x: t * HELIX_LENGTH,
      y: Math.cos(a) * radius,
      z: Math.sin(a) * radius,
      r: 1.8 + Math.pow(rand(), 2) * 5,
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

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    // Stronger diagonal camera tilt so the helix sits in a clear diagonal composition.
    const tilt = -0.72;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);

    const frame = (time: number) => {
      const animationTime = time * 0.000045;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const narrow = W < 820;

      // Keep the DNA diagonally placed on the right side while leaving the left side for the headline.
      const cx = W * (narrow ? 0.72 : 0.79);
      const cy = H * (narrow ? 0.52 : 0.47);

      const L = narrow
        ? Math.min(W * 0.48, H * 0.34)
        : Math.min(W * 0.3, H * 0.42);

      const spin = animationTime * 1.8;
      const cs = Math.cos(spin);
      const sn = Math.sin(spin);

      const reach = 95;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Rotate around the DNA axis.
        const y1 = p.y * cs - p.z * sn;
        const z1 = p.y * sn + p.z * cs;

        const x1 =
          p.x +
          Math.sin(animationTime * 5 + p.ph) * 0.0025;

        const y2 =
          y1 +
          Math.cos(animationTime * 4 + p.ph * 1.3) * 0.002;

        // Mild perspective gives depth without distorting the helix.
        const persp = 1 / (1 - z1 * 0.72);

        const px =
          cx +
          (x1 * ct - y2 * st) * persp * L +
          p.ox;

        const py =
          cy +
          (x1 * st + y2 * ct) * persp * L +
          p.oy;

        const mx = px - mouse.x;
        const my = py - mouse.y;
        const d2 = mx * mx + my * my;

        if (d2 < reach * reach && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / reach) * 1.7;

          p.ox += (mx / d) * f;
          p.oy += (my / d) * f;
        }

        p.ox *= 0.94;
        p.oy *= 0.94;

        if (
          px < -10 ||
          px > W + 10 ||
          py < -10 ||
          py > H + 10
        ) {
          continue;
        }

        const depth = Math.max(0, Math.min(1, (z1 + 0.55) / 1.1));

        const c = mixColor(
          0.08 +
            p.tone * 0.62 +
            (1 - depth) * 0.22
        );

        const s =
          p.size *
          (0.72 + depth * 0.72) *
          persp;

        const alpha =
          p.alpha *
          (0.48 + depth * 0.52);

        ctx.fillStyle = `rgba(
          ${c[0] | 0},
          ${c[1] | 0},
          ${c[2] | 0},
          ${alpha.toFixed(3)}
        )`;

        if (s < 1.15) {
          ctx.fillRect(
            px - s,
            py - s,
            s * 2,
            s * 2
          );
        } else {
          ctx.beginPath();
          ctx.arc(px, py, s, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Larger floating particles.
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        const y1 = d.y * cs - d.z * sn;
        const z1 = d.y * sn + d.z * cs;

        const x1 =
          d.x + Math.sin(animationTime * 4 + d.ph) * 0.008;

        const persp = 1 / (1 - z1 * 0.72);

        const px =
          cx +
          (x1 * ct - y1 * st) *
            persp *
            L;

        const py =
          cy +
          (x1 * st + y1 * ct) *
            persp *
            L;

        const depth = Math.max(
          0,
          Math.min(1, (z1 + 0.55) / 1.1)
        );

        const r =
          d.r *
          (0.7 + depth * 0.45) *
          (narrow ? 0.8 : 1);

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(206, 229, 132, 0.3)";
        ctx.fill();

        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(
          58,
          120,
          48,
          ${(0.18 + depth * 0.25).toFixed(3)}
        )`;
        ctx.stroke();
      }

      if (!reduce) {
        raf = requestAnimationFrame(frame);
      }
    };

    if (reduce) {
      frame(9000);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();

      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="
        pointer-events-none absolute inset-0
        z-0 h-full w-full opacity-[0.92]
      "
      aria-hidden="true"
    />
  );
}

export function Hero() {
  return (
    <section
      className="
        relative min-h-screen overflow-hidden
        bg-[#e8eeeb] text-[#0e1e19]
        antialiased
      "
      style={{
        fontFamily:
          '"Outfit", "Google Sans", "Segoe UI", sans-serif',
      }}
    >
      {/* Background Animation */}
      <div className="absolute inset-0">
        <HelixCanvas />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
      

        {/* Hero Content */}
        <main
          className="
            mx-auto flex w-full max-w-[1280px]
            flex-1 items-center
            px-5 pb-8 pt-10
            sm:px-6 lg:px-8
          "
        >
          <div className="max-w-[620px]">
            <p
              className="
                mb-6 text-xs font-medium uppercase
                tracking-[0.12em] text-[#1f5c4b]
              "
            >
              Your health, connected
            </p>

            <h1
              className="
                text-[clamp(2.8rem,7vw,5.2rem)]
                font-light leading-[0.95]
                tracking-[-0.06em]
                text-[#0e1e19]
              "
            >
              Connect with the right doctor, anytime.
            </h1>

            <p
              className="
                mt-8 max-w-[44ch]
                text-base leading-7
                text-[#37534d]
                sm:text-lg
              "
            >
              DocLink makes healthcare simple. Find trusted
              doctors, book appointments and consult with
              healthcare professionals through one secure
              platform.
            </p>
          </div>
        </main>

        {/* Hero Footer / CTA */}
        <footer
          className="
            mx-auto w-full max-w-[1280px]
            px-5 pb-8
            sm:px-6 lg:px-8
          "
        >
          <div className="h-px w-full bg-[#1f5c4b]/20" />

          <div
            className="
              mt-6 flex flex-col
              items-start justify-between gap-6
              md:flex-row md:items-end
            "
          >
            <div>
              <p
                className="
                  mb-5 flex items-center gap-4
                  text-sm text-[#1f5c4b]
                  before:h-px before:w-14
                  before:bg-[#1f5c4b]/80
                  before:content-['']
                "
              >
                Doctors, appointments and consults in one place
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  className="
                    group inline-flex items-center gap-3
                    rounded-full bg-[#1f5c4b]
                    px-5 py-3 text-base font-medium
                    text-white
                    shadow-[0_12px_25px_rgba(31,92,75,0.2)]
                    transition hover:bg-[#194b3f]
                  "
                >
                  <span>Find a Doctor</span>

                  <span
                    className="
                      flex h-8 w-8 items-center
                      justify-center rounded-full
                      bg-[#f3fa9b] text-[#1c3a2e]
                      transition-transform
                      group-hover:rotate-45
                    "
                  >
                    <ArrowIcon />
                  </span>
                </a>

                <a
                  href="#"
                  className="
                    inline-flex items-center
                    rounded-full bg-[#f3fa9b]
                    px-5 py-3 text-base
                    font-medium text-[#1c3a2e]
                    transition hover:brightness-95
                  "
                >
                  Book an Appointment
                </a>
              </div>
            </div>

            {/* Feature Chips */}
            <ul
              className="flex flex-wrap gap-2.5"
              aria-label="Why DocLink"
            >
              {CHIPS.map((chip) => (
                <li
                  key={chip}
                  className="
                    inline-flex items-center gap-2
                    rounded-full
                    border border-white/50
                    bg-white/60 px-4 py-2
                    text-sm text-[#1a2d29]
                    shadow-[0_12px_20px_rgba(17,27,26,0.04)]
                    backdrop-blur-sm
                  "
                >
                  <CheckIcon />
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </footer>
        
      </div>
    </section>
  );
}

export default Hero;