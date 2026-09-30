"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Baby, Bone, Brain, HeartPulse } from "lucide-react";
import { Card } from "@/components/ui/card";

const specialists = [
  {
    name: 'Cardiology',
    icon: HeartPulse,
    description: "Heart and circulation care, from prevention to ongoing treatment.",
    iconColor: "text-[#174c3b]",
  },
  {
    name: 'Neurology',
    icon: Brain,
    description: "Care for the brain, spine, nerves, and nervous system.",
    iconColor: "text-[#174c3b]",
  },
  {
    name: 'Orthopedic',
    icon: Bone,
    description: "Support for bones, joints, muscles, and movement.",
    iconColor: "text-[#174c3b]",
  },
  {
    name: 'Pediatric',
    icon: Baby,
    description: "Medical care for infants, children, and adolescents.",
    iconColor: "text-[#174c3b]",
  }
];

const Specialities = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleSpecialists = Array.from({ length: 3 }, (_, index) =>
    specialists[(activeIndex + index) % specialists.length],
  );

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + specialists.length) % specialists.length);
  };

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % specialists.length);
  };

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-8 lg:mb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[#61736b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#174c3b]" />
              Explore specialties
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-[#17372d] sm:text-5xl">
              Meet the specialists behind better care.
            </h2>
          </div>

          <div className="flex items-end justify-between gap-6 lg:justify-self-end lg:gap-10">
            <div className="max-w-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#17372d]">
                <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                <span className="text-[#9ba9a2]">/</span>
                <span className="text-[#9ba9a2]">{String(specialists.length).padStart(2, "0")}</span>
              </div>
              <p className="text-sm leading-6 text-[#61736b]">
                Explore trusted specialists, understand the care they provide, and find a doctor for your needs.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Previous specialty"
                onClick={showPrevious}
                className="home-secondary-button home-icon-button group"
              >
                <ArrowLeft className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:-translate-x-0.5" />
              </button>
              <button
                type="button"
                aria-label="Next specialty"
                onClick={showNext}
                className="home-primary-button home-icon-button group"
              >
                <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleSpecialists.map((specialist, index) => (
            <a
              key={specialist.name}
              href={`/consultation?specialties.specialty.title=${encodeURIComponent(specialist.name)}`}
              className={`home-card-link group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c3b] ${
                index === 1 ? "hidden md:block" : index === 2 ? "hidden xl:block" : ""
              }`}
            >
              <Card className={`flex min-h-[300px] h-full flex-col justify-between rounded-lg border-[#dce7df] p-6 shadow-none transition-colors sm:p-7 ${
                index === 1
                  ? "bg-[#e8f1e8] group-hover:bg-[#dcebdd]"
                  : "bg-[#f7f8f7] group-hover:bg-[#f0f5f1]"
              }`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#17372d]">
                  <specialist.icon className={specialist.iconColor} size={23} strokeWidth={1.8} />
                </div>
                <div className="mt-12">
                  <h3 className="max-w-[15ch] text-2xl font-medium leading-tight text-[#17372d] sm:text-[1.75rem]">
                    {specialist.name}
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-[#61736b]">
                    {specialist.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#174c3b]">
                    Find a specialist
                    <ArrowUpRight className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialities;
