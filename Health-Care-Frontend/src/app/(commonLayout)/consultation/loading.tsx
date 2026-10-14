"use client";

import Image from "next/image";
import logo from "@/assets/Home/logo.png";

export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading DocLink"
      className="flex min-h-screen items-center justify-center overflow-hidden bg-[#e8eeeb] "
    >
      <div className="relative flex size-48 items-center justify-center" aria-hidden="true">
        <div className="loader-ring absolute inset-0 rounded-full" />
        <Image src={logo} alt="" width={100} height={100} priority className="size-30
         object-contain" />
      </div>

      <style jsx>{`
        .loader-ring {
          background: conic-gradient(
            from 0deg,
            #21ad78 0deg,
            #159c68 84deg,
            rgba(67, 160, 119, 0.12) 84deg,
            rgba(67, 160, 119, 0.12) 360deg
          );
          -webkit-mask: radial-gradient(
            farthest-side,
            transparent calc(100% - 7px),
            #000 calc(100% - 6px)
          );
          mask: radial-gradient(
            farthest-side,
            transparent calc(100% - 7px),
            #000 calc(100% - 6px)
          );
          animation: loader-spin 1.8s linear infinite;
        }

        @keyframes loader-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader-ring {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
