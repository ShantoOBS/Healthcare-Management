"use client";

import { LogoMark } from '../../../components/shared/Logo';

const loadingDots = [0, 1, 2];

export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading DocLink"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f6ee] text-[#0e1e19]"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at top, rgba(143,214,166,0.25), transparent 40%), radial-gradient(circle at bottom, rgba(23,54,45,0.18), transparent 40%)',
        }}
      />
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1f5c4b]/20 bg-white/30 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-[28px] border border-white/80 bg-white/75 shadow-[0_30px_90px_rgba(18,49,42,0.12)] backdrop-blur-xl">
          <div className="absolute inset-0 rounded-[28px] border border-[#1f5c4b]/20 animate-pulse" />
          <div className="absolute inset-3 rounded-[22px] border border-[#1f5c4b]/15" />
          <div
            className="absolute h-24 w-24 rounded-full border border-[#1f5c4b]/25 border-t-[#1f5c4b]"
            style={{ animation: 'spin 2.8s linear infinite' }}
          />
          <div
            className="absolute h-20 w-20 rounded-full border border-[#b7db85]/80 border-b-transparent"
            style={{ animation: 'spin 4.8s linear infinite reverse' }}
          />

          <span className="relative flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#1f5c4b] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <LogoMark />
          </span>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <span className="text-2xl font-semibold tracking-[-0.06em] text-[#0e1e19]">
            DocLink
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2" aria-hidden="true">
          {loadingDots.map((dot) => (
            <span
              key={dot}
              className="h-2.5 w-2.5 rounded-full bg-[#1f5c4b]/65 animate-pulse"
              style={{
                animationDelay: `${dot * 180}ms`,
                animationDuration: '1.4s',
              }}
            />
          ))}
        </div>

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.28em] text-[#1f5c4b]/80">
          Preparing your care journey
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
