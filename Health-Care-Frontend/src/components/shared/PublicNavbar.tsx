"use client";
import Logo from "@/components/shared/Logo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Consultation", href: "/consultation" },
  { label: "Diagnostics", href: "/diagnostics" },
  { label: "Medicine", href: "/medicine" },
  { label: "Health Plans", href: "/health-plans" },
  { label: "NGOs", href: "/ngos" },
];

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



function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onPointer = (event: PointerEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const mediaQuery = window.matchMedia("(min-width: 821px)");

    const onMq = () => {
      if (mediaQuery.matches) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    mediaQuery.addEventListener("change", onMq);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      mediaQuery.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full pt-5">
      <div
        className="
          mx-auto flex w-full max-w-[1280px] items-center
          gap-2 px-5 sm:px-6 lg:px-8
        "
      >
        {/* Logo */}
        <Logo/>
   

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="
            mr-auto hidden items-center gap-1
            rounded-sm border border-white/60
            bg-white/80 px-1 py-1
            shadow-[0_12px_30px_rgba(18,49,42,0.08)]
            backdrop-blur-md md:flex
          "
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="
                rounded-[10px] px-4 py-2 text-sm font-medium
                text-[#1a2d29] transition hover:bg-[#e3eee5]
              "
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Login */}
        <Link
          href="/login"
          className="
            group hidden items-center gap-3
            rounded-full bg-[#1f5c4b]
            px-4 py-2 text-sm font-medium text-white
            shadow-[0_12px_25px_rgba(31,92,75,0.2)]
            transition hover:bg-[#194b3f] md:inline-flex
          "
        >
          <span>Login</span>

          <span
            className="
              flex h-7 w-7 items-center justify-center
              rounded-full bg-[#f3fa9b]
              text-[#1c3a2e]
              transition-transform group-hover:rotate-45
            "
          >
            <ArrowIcon />
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="
            ml-auto inline-flex h-11 w-11
            items-center justify-center rounded-sm
            border border-[#dfe8e3]
            bg-white/85 text-[#163c35]
            shadow-sm md:hidden
          "
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="
            absolute left-5 right-5 top-[calc(100%+0.5rem)]
            z-30 flex flex-col gap-2
            rounded-2xl border border-[#dfe8e3]
            bg-white/95 p-3
            shadow-[0_14px_34px_rgba(14,30,25,0.14)]
            backdrop-blur-md md:hidden
          "
        >
          <Link
            href="/login"
            className="
              group inline-flex items-center justify-between
              rounded-xl bg-[#1f5c4b] px-4 py-3
              text-left text-base font-medium text-white
              shadow-[0_12px_25px_rgba(31,92,75,0.2)]
            "
            onClick={() => setOpen(false)}
          >
            <span>Login</span>

            <span
              className="
                flex h-7 w-7 items-center justify-center
                rounded-full bg-[#f3fa9b]
                text-[#1c3a2e]
              "
            >
              <ArrowIcon />
            </span>
          </Link>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="
                rounded-xl px-3 py-2.5
                text-base font-medium text-[#1a2d29]
                hover:bg-[#edf3ee]
              "
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export default PublicNavbar;