import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import logo from '../../assets/Home/logo.png';



interface LogoProps {
  href?: string;
  className?: string;
}

export default function Logo({ href = "/", className }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="DocLink home"
      className={
        className ||
        "flex items-center gap-1 rounded-sm border border-white/60 bg-white/80 px-2.5 py-1.5 shadow-[0_12px_30px_rgba(18,49,42,0.08)] backdrop-blur-md transition hover:bg-white/90"
      }
    >
      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm">
        <Image
          src={logo}
          alt="DocLink logo"
          width={32}
          height={32}
          className="h-8 w-8 object-cover"
        />
      </span>

      <span className="text-sm font-medium tracking-[-0.04em] text-[#0e1e19]">
        DocLink
      </span>
    </Link>
  );
}