"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find a doctor", href: "/doctors" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
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

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 w-full px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center gap-3 rounded-[18px] border border-white/60 bg-white/80 px-3 py-2 shadow-[0_12px_30px_rgba(18,49,42,0.08)] backdrop-blur-md md:px-4">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-[#0e1e19]">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1f5c4b]">
              <LogoMark />
            </span>
            <span className="text-lg font-medium tracking-[-0.03em]">DocLink</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex md:ml-auto md:mr-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#1a2d29] transition hover:bg-[#edf3ee]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            className="hidden items-center gap-3 rounded-full bg-[#1f5c4b] px-2.5 py-2.5 pr-2 text-sm font-medium text-white transition hover:bg-[#194b3f] md:inline-flex"
          >
            <span>Contact Us</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3fa9b] text-[#1e3b30]">
              <ArrowIcon />
            </span>
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dfe8e3] bg-white text-[#163c35] shadow-sm md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <nav className="mt-3 flex flex-col gap-2 rounded-2xl border border-[#dfe8e3] bg-white/95 p-3 shadow-[0_14px_34px_rgba(14,30,25,0.14)] md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-xl px-3 py-2.5 text-base font-medium text-[#1a2d29] hover:bg-[#edf3ee]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#1f5c4b] px-4 py-3 text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default PublicNavbar;
