"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
  const clamped = Math.min(Math.max(t, 0), 0.999);
  const p = clamped * (PALETTE.length - 1);

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

  // =========================================================
  // TWO DNA STRANDS
  // =========================================================

  for (let strand = 0; strand < 2; strand++) {
    for (let i = 0; i < 3300; i++) {
      const t = rand() * 2 - 1;
      const a = angleAt(t, strand);

      const [dx, dy, dz] = randomDir();

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

  // =========================================================
  // DNA BASE PAIRS
  // =========================================================

  const RUNGS = 28;

  for (let k = 0; k < RUNGS; k++) {
    const t =
      -0.94 + (1.88 * k) / (RUNGS - 1);

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

  // =========================================================
  // AMBIENT PARTICLES
  // =========================================================

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

  // =========================================================
  // FLOATING PARTICLES
  // =========================================================

  const drops: Droplet[] = [];

  for (let i = 0; i < 12; i++) {
    const t = rand() * 2.15 - 1.075;

    const a = rand() * Math.PI * 2;

    const radius =
      HELIX_RADIUS + 0.1 + rand() * 0.35;

    drops.push({
      x: t * HELIX_LENGTH,
      y: Math.cos(a) * radius,
      z: Math.sin(a) * radius,
      r: 1.8 + Math.pow(rand(), 2) * 5,
      ph: rand() * Math.PI * 2,
    });
  }

  return {
    pts,
    drops,
  };
}

function HelixCanvas() {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const host = canvas.parentElement;

    if (!host) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const { pts, drops } = buildHelix();

    let W = 1;
    let H = 1;
    let DPR = 1;
    let raf = 0;

    const mouse = {
      x: -9999,
      y: -9999,
    };

    // =======================================================
    // RESIZE
    // =======================================================

    const resize = () => {
      const rect =
        host.getBoundingClientRect();

      DPR = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);

      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);

      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };

    resize();

    const ro = new ResizeObserver(resize);

    ro.observe(host);

    // =======================================================
    // MOUSE
    // =======================================================

    const onMove = (e: PointerEvent) => {
      const rect =
        canvas.getBoundingClientRect();

      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener(
      "pointermove",
      onMove
    );

    window.addEventListener(
      "pointerleave",
      onLeave
    );

    // =======================================================
    // CAMERA
    // =======================================================

    const tilt = -0.72;

    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);

    // =======================================================
    // FRAME
    // =======================================================

    const frame = (time: number) => {
      const animationTime =
        time * 0.000045;

      ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
      );

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.setTransform(
        DPR,
        0,
        0,
        DPR,
        0,
        0
      );

      const narrow = W < 820;

      // =====================================================
      // DNA POSITION
      // =====================================================

      const cx =
        W * (narrow ? 0.72 : 0.79);

      const cy =
        H * (narrow ? 0.32 : 0.47);

      const L = narrow
        ? Math.min(W * 0.42, H * 0.28)
        : Math.min(W * 0.3, H * 0.42);

      // =====================================================
      // DNA ROTATION
      // =====================================================

      const spin =
        animationTime * 1.8;

      const cs = Math.cos(spin);
      const sn = Math.sin(spin);

      const reach = 95;

      // =====================================================
      // PARTICLES
      // =====================================================

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Rotate DNA
        const y1 =
          p.y * cs - p.z * sn;

        const z1 =
          p.y * sn + p.z * cs;

        // Tiny movement
        const x1 =
          p.x +
          Math.sin(
            animationTime * 5 +
              p.ph
          ) *
            0.0025;

        const y2 =
          y1 +
          Math.cos(
            animationTime * 4 +
              p.ph * 1.3
          ) *
            0.002;

        // Perspective
        const persp =
          1 / (1 - z1 * 0.72);

        // Screen coordinates
        const px =
          cx +
          (x1 * ct - y2 * st) *
            persp *
            L +
          p.ox;

        const py =
          cy +
          (x1 * st + y2 * ct) *
            persp *
            L +
          p.oy;

        // ===================================================
        // MOUSE INTERACTION
        // ===================================================

        const mx = px - mouse.x;
        const my = py - mouse.y;

        const d2 =
          mx * mx +
          my * my;

        if (
          d2 <
            reach * reach &&
          d2 > 0.01
        ) {
          const d = Math.sqrt(d2);

          const f =
            (1 - d / reach) * 1.7;

          p.ox +=
            (mx / d) * f;

          p.oy +=
            (my / d) * f;
        }

        p.ox *= 0.94;
        p.oy *= 0.94;

        // Outside canvas
        if (
          px < -10 ||
          px > W + 10 ||
          py < -10 ||
          py > H + 10
        ) {
          continue;
        }

        // Depth
        const depth = Math.max(
          0,
          Math.min(
            1,
            (z1 + 0.55) / 1.1
          )
        );

        // Color
        const c = mixColor(
          0.08 +
            p.tone * 0.62 +
            (1 - depth) * 0.22
        );

        // Size
        const s =
          p.size *
          (0.72 + depth * 0.72) *
          persp;

        // Alpha
        const alpha =
          p.alpha *
          (0.48 + depth * 0.52);

        ctx.fillStyle = `rgba(
          ${c[0] | 0},
          ${c[1] | 0},
          ${c[2] | 0},
          ${alpha.toFixed(3)}
        )`;

        // Small particle
        if (s < 1.15) {
          ctx.fillRect(
            px - s,
            py - s,
            s * 2,
            s * 2
          );
        } else {
          ctx.beginPath();

          ctx.arc(
            px,
            py,
            s,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }
      }

      // =====================================================
      // FLOATING PARTICLES
      // =====================================================

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        const y1 =
          d.y * cs -
          d.z * sn;

        const z1 =
          d.y * sn +
          d.z * cs;

        const x1 =
          d.x +
          Math.sin(
            animationTime * 4 +
              d.ph
          ) *
            0.008;

        const persp =
          1 / (1 - z1 * 0.72);

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
          Math.min(
            1,
            (z1 + 0.55) / 1.1
          )
        );

        const r =
          d.r *
          (0.7 + depth * 0.45) *
          (narrow ? 0.8 : 1);

        ctx.beginPath();

        ctx.arc(
          px,
          py,
          r,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          "rgba(206, 229, 132, 0.3)";

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

      // =====================================================
      // ANIMATION
      // =====================================================

      if (!reduce) {
        raf =
          requestAnimationFrame(frame);
      }
    };

    if (reduce) {
      frame(9000);
    } else {
      raf =
        requestAnimationFrame(frame);
    }

    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {
      cancelAnimationFrame(raf);

      ro.disconnect();

      window.removeEventListener(
        "pointermove",
        onMove
      );

      window.removeEventListener(
        "pointerleave",
        onLeave
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        block
        h-full
        w-full
      "
      aria-hidden="true"
    />
  );
}

export function Hero() {
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  return (
    <section
      className="
        relative
        min-h-[760px]
        overflow-hidden
        bg-[#f1f5f2]
        text-[#0b2119]
        antialiased
        lg:min-h-screen
      "
      style={{
        backgroundImage:
          "radial-gradient(rgba(23, 76, 59, 0.09) 0.7px, transparent 0.7px)",
        backgroundSize: "18px 18px",
        fontFamily:
          '"Outfit", "Google Sans", "Segoe UI", sans-serif',
      }}
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* =================================================
            FIXED DNA BACKGROUND
        ================================================== */}

        <div
          className="
            absolute
            inset-0
            z-0
            opacity-[0.62]
          "
        >
          <HelixCanvas />
        </div>
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-7xl
          flex-col
          px-5
          py-5
          sm:px-7
          lg:px-10
        "
      >
     

        <main
          className="
            grid
            flex-1
            items-center
            gap-12
            py-12
            lg:grid-cols-[0.92fr_1.08fr]
            lg:gap-8
            lg:py-8
            xl:grid-cols-[0.9fr_1.1fr]
            xl:gap-14
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <div
            className="
              relative
              z-20
              max-w-[650px]
            "
          >
            {/* Small label */}

           <header
          className="
            flex
            items-center
            justify-between
          "
        >
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#174c3b]/10
              bg-white/70
              px-3.5
              py-2
              shadow-[0_8px_30px_rgba(20,60,45,0.04)]
              backdrop-blur-xl
            "
          >
            <span
              className="
                relative
                flex
                h-2.5
                w-2.5
              "
            >
              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  animate-ping
                  rounded-full
                  bg-[#72c982]
                  opacity-50
                "
              />

              <span
                className="
                  relative
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-[#65bc78]
                "
              />
            </span>

            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.17em]
                text-[#285848]
                sm:text-[11px]
              "
            >
              Your health, connected
            </span>
          </div>

        </header>

            {/* Main heading */}

            <h1
              className="
                max-w-[650px]
                text-[3.25rem]
                font-medium
                leading-[0.91]
                sm:text-7xl
                xl:text-[6.3rem]
                text-[#082d21]
              "
            >
              Find the right
              <br />

              <span
                className="
                  relative
                  inline-block
                "
              >
                doctor for you.

                <span
                  className="
                    absolute
                    bottom-[-5px]
                    left-1
                    h-[6px]
                    w-[88%]
                    rounded-full
                    bg-[#c4e97e]
                  "
                />
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-7
                max-w-[520px]
                text-[15px]
                leading-7
                text-[#50665f]
                sm:text-[17px]
                sm:leading-8
              "
            >
              Discover trusted specialists, check
              availability, and book your appointment
              in just a few simple steps.
            </p>

            {/* =================================================
                SEARCH BOX
            ================================================== */}

            <form
              action="/consultation"
              method="get"
              role="search"
              className="
                mt-8
                max-w-[590px]
                rounded-[22px]
                border
                border-white
                bg-white/85
                p-2
                shadow-[0_25px_60px_rgba(20,60,45,0.10)]
                backdrop-blur-xl
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                  sm:items-center
                "
              >
                {/* Search */}

                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                    gap-3
                    rounded-[16px]
                    bg-[#f3f7f4]
                    px-4
                    py-3
                  "
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="
                      shrink-0
                      text-[#668078]
                    "
                    aria-hidden="true"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                    />

                    <path d="m20 20-4-4" />
                  </svg>

                  <input
                    type="search"
                    name="searchTerm"
                    placeholder="Doctor name or specialty"
                    aria-label="Search doctor or specialty"
                    className="
                      min-w-0
                      w-full
                      bg-transparent
                      text-sm
                      text-[#173c30]
                      outline-none
                      placeholder:text-[#84928e]
                    "
                  />
                </div>

               

                {/* Search button */}

                <button
                  type="submit"
                  className="home-primary-button group"
                >
                  <span>Find a doctor</span>

                  <ArrowIcon />
                </button>
              </div>
            </form>


          </div>

          {/* =================================================
              RIGHT VISUAL
          ================================================== */}

          <div
            className="
              relative
              mx-auto
              min-h-[480px]
              w-full
              max-w-[650px]
              sm:min-h-[560px]
              lg:min-h-[610px]
            "
          >
            {/* Decorative circle */}

            <div
              className="
                absolute
                right-[4%]
                top-[5%]
                h-[390px]
                w-[390px]
                rounded-full
                border
                border-white/80
                bg-white/20
                sm:h-[510px]
                sm:w-[510px]
              "
            />

            {/* =================================================
                MAIN VIDEO
            ================================================== */}

            <div
              className="
                absolute
                right-0
                top-[9%]
                z-10
                h-[390px]
                w-[78%]
                overflow-hidden
                rounded-[32px]
                border
                border-white
                bg-white
                shadow-[0_35px_90px_rgba(25,65,50,0.17)]
                sm:h-[500px]
                lg:h-[545px]
              "
            >
              {!videoUnavailable ? (
                <video
                className="
                  h-full
                  w-full
                  object-cover
                  object-center
                "
                autoPlay
                muted
                loop
                controls
                playsInline
                preload="metadata"
                poster="/dashboard/doctor_video_call.png"
                aria-label="Female physician providing an online medical consultation"
                onError={() => setVideoUnavailable(true)}
              >
                <source
                  src="/videos/doctor-online-consultation.mp4"
                  type="video/mp4"
                />

                Your browser does not support
                the video element.
              </video>
              ) : (
                <Image
                  src="/dashboard/doctor_video_call.png"
                  alt="Doctor ready for an online consultation"
                  fill
                  sizes="(max-width: 1024px) 78vw, 40vw"
                  className="object-cover object-center"
                />
              )}

              {/* Video overlay */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#062b20]/75
                  via-transparent
                  to-transparent
                "
              />

              {/* Available status */}

              <div
                className="
                  absolute
                  left-5
                  top-5
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white/90
                  px-3
                  py-2
                  text-[10px]
                  font-semibold
                  text-[#285a47]
                  shadow-lg
                  backdrop-blur-md
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-[#65c278]
                  "
                />

                Available today
              </div>

              {/* Doctor information */}

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  p-5
                  sm:p-7
                "
              >
                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.15em]
                        text-white/65
                      "
                    >
                      Online consultation
                    </p>

                    <h2
                      className="
                        mt-1
                        text-xl
                        font-semibold
                        tracking-tight
                        text-white
                        sm:text-2xl
                      "
                    >
                      Talk to a doctor online
                    </h2>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-white/75
                      "
                    >
                      Secure virtual healthcare from
                      anywhere
                    </p>
                  </div>

                  <div
                    className="
                      hidden
                      rounded-2xl
                      bg-white/15
                      px-3
                      py-2
                      text-right
                      backdrop-blur-md
                      sm:block
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        text-white/60
                      "
                    >
                      Video consultation
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-white
                      "
                    >
                      Online
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                SPECIALIST CARD
            ================================================== */}

            <div
              className="
                absolute
                left-0
                top-[25%]
                z-20
                w-[190px]
                rounded-[24px]
                border
                border-white
                bg-white/90
                p-2.5
                shadow-[0_25px_60px_rgba(30,70,52,0.15)]
                backdrop-blur-xl
                sm:w-[215px]
                lg:left-[-2%]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-2
                  pb-2
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[#61736d]
                    "
                  >
                    Specialist
                  </p>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#17392f]
                    "
                  >
                    Doctors
                  </p>
                </div>

                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-[#edf5e9]
                    text-[#285848]
                  "
                >
                  <ArrowIcon />
                </span>
              </div>

              <div
                className="
                  relative
                  h-[155px]
                  overflow-hidden
                  rounded-[18px]
                  bg-[#e7eee8]
                  sm:h-[175px]
                "
              >
                <img
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=90"
                  alt="Specialist doctor"
                  className="
                    h-full
                    w-full
                    object-cover
                    object-top
                  "
                />
              </div>

              <div
                className="
                  px-1
                  pb-1
                  pt-3
                "
              >
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#17392f]
                  "
                >
                  Dr. John Bennett
                </p>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    text-[#73827d]
                  "
                >
                  Neurologist
                </p>

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-[#68bd78]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-medium
                      text-[#4c705f]
                    "
                  >
                    Available now
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                RECENT DOCTOR
            ================================================== */}

            <div
              className="
                absolute
                right-[-1%]
                top-[-1%]
                z-30
                w-[185px]
                rounded-[20px]
                border
                border-white
                bg-white/90
                p-2.5
                shadow-[0_20px_50px_rgba(30,70,52,0.13)]
                backdrop-blur-xl
                sm:w-[205px]
              "
            >
              <p
                className="
                  px-1
                  pb-2
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#64766f]
                "
              >
                Recently visited
              </p>

              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  rounded-[15px]
                  bg-[#edf5ee]
                  p-2
                "
              >
                <div
                  className="
                    h-14
                    w-12
                    shrink-0
                    overflow-hidden
                    rounded-xl
                  "
                >
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=90"
                    alt="Recently visited doctor"
                    className="
                      h-full
                      w-full
                      object-cover
                      object-top
                    "
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-[10px]
                      font-semibold
                      text-[#193d32]
                    "
                  >
                    Dr. William Martinez
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      text-[#71807b]
                    "
                  >
                    General Physician
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      font-medium
                      text-[#5b8a68]
                    "
                  >
                    Viewed recently
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                QUICK STATS
            ================================================== */}

            <div
              className="
                absolute
                bottom-[5%]
                right-[3%]
                z-30
                flex
                items-center
                gap-3
                rounded-[20px]
                border
                border-white
                bg-white/90
                px-4
                py-3
                shadow-[0_20px_45px_rgba(30,70,52,0.12)]
                backdrop-blur-xl
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#e6f2dc]
                  text-[#467345]
                "
              >
                ✓
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#17392f]
                  "
                >
                  12K+
                </p>

                <p
                  className="
                    text-[9px]
                    text-[#778681]
                  "
                >
                  Consultations
                </p>
              </div>
            </div>

            {/* Decorative element */}

            <div
              className="
                absolute
                bottom-[19%]
                left-[20%]
                z-20
                h-3
                w-3
                rounded-full
                bg-[#c9e77f]
                shadow-[0_0_0_8px_rgba(201,231,127,0.14)]
              "
            />
          </div>
        </main>

      
      </div>
    </section>
  );
}

export default Hero;