"use client";

import React from "react";
import {
  Search,
  UserRound,
  CalendarCheck,
  Stethoscope,
  Video,
  FileText,
  ArrowUpRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const processSteps = [
  {
    number: "01",
    icon: Search,
    title: "Find Your Doctor",
    description:
      "Search and discover doctors by specialty, experience, availability, and other important information.",
  },
  {
    number: "02",
    icon: UserRound,
    title: "Explore Doctor Profile",
    description:
      "View doctor profiles, qualifications, specialties, consultation details, and available appointment slots.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Book an Appointment",
    description:
      "Select a convenient date and time, provide the required information, and confirm your appointment securely.",
  },
  {
    number: "04",
    icon: Video,
    title: "Consult & Get Your Solution",
    description:
      "Connect with your doctor through consultation, receive medical guidance, and access your prescription digitally.",
  },
];

const ProcessStep = ({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <div className="group flex gap-5 border-b border-slate-200 py-6 last:border-b-0">
      {/* Icon */}
      <div className="relative shrink-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 transition-all duration-300 group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white">
          <Icon size={25} strokeWidth={1.8} />
        </div>

        {/* Number */}
        <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-slate-900 px-1 text-[10px] font-bold text-white">
          {number}
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 pt-1">
        <h3 className="text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-emerald-600 sm:text-lg">
          {title}
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

const Steps = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-50 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-cyan-50 blur-3xl" />

      {/* Dot Pattern */}
      <div className="pointer-events-none absolute right-[6%] top-16 hidden lg:block">
        <div className="grid grid-cols-5 gap-2 opacity-30">
          {Array.from({ length: 25 }).map((_, index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden rounded-[2rem] border-slate-200 bg-slate-50 shadow-none">
          <div className="grid lg:grid-cols-2">
            {/* ================= LEFT ================= */}
            <div className="relative flex flex-col justify-center overflow-hidden p-8 sm:p-10 lg:p-14 xl:p-16">
              {/* Decorative Circle */}
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full border-[45px] border-emerald-100/60" />

              <div className="relative">
                {/* Label */}
                <div className="mb-6 inline-flex items-center gap-2">
                  <span className="h-px w-8 bg-emerald-600" />

                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                    How It Works
                  </span>
                </div>

                {/* Heading */}
                <h2 className="max-w-lg text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  From Search
                  <br />
                  <span className="text-emerald-600">To Better Health</span>
                </h2>

                {/* Description */}
                <p className="mt-6 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
                  DocLink makes healthcare simple. Find the right doctor,
                  schedule your appointment, connect with your physician, and
                  manage your healthcare journey from one platform.
                </p>

                {/* CTA */}
                <div className="mt-8">
                  <button
                    type="button"
                    className="group inline-flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-600"
                  >
                    Explore Doctors

                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowUpRight size={15} />
                    </span>
                  </button>
                </div>

                {/* Small Features */}
                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Verified Doctors
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Easy Booking
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Secure Platform
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="relative border-t border-slate-200 bg-white p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              {/* Top label */}
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Your Healthcare Journey
                </span>

                <span className="text-xs font-medium text-emerald-600">
                  04 Steps
                </span>
              </div>

              {/* Process Steps */}
              <div className="mt-2">
                {processSteps.map((step) => (
                  <ProcessStep key={step.number} {...step} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400" />
        </Card>
      </div>
    </section>
  );
};

export default Steps;