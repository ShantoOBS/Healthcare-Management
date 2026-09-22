import React from 'react'

function LogoMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f3fa9b"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 6v12M6 12h12" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="12" cy="4.4" r="1.2" fill="#f3fa9b" stroke="none" />
      <circle cx="12" cy="19.6" r="1.2" fill="#f3fa9b" stroke="none" />
      <circle cx="4.4" cy="12" r="1.2" fill="#f3fa9b" stroke="none" />
      <circle cx="19.6" cy="12" r="1.2" fill="#f3fa9b" stroke="none" />
    </svg>
  );
}

export default function Logo() {
  return (
    <div>
          <a
          href="/"
          aria-label="DocLink home"
          className="
            flex items-center gap-3 rounded-sm
            border border-white/60 bg-white/80
            px-2.5 py-1.5
            shadow-[0_12px_30px_rgba(18,49,42,0.08)]
            backdrop-blur-md transition hover:bg-white/90
          "
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#1f5c4b]">
            <LogoMark />
          </span>

          <span className="text-sm font-medium tracking-[-0.04em] text-[#0e1e19]">
            DocLink
          </span>
        </a>
      
    </div>
  )
}
