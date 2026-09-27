import Image from "next/image";
import { Check } from "lucide-react";

import helpPeopleImage from "@/assets/whyChooseUs/help-people.jpg";

const reasons = [
  "Patient-first approach with personalized treatment plans",
  "Internationally accredited medical specialists",
  "State-of-the-art diagnostic and treatment facilities",
];

const stats = [
  { value: "50+", label: "Expert Doctors" },
  { value: "10k+", label: "Happy Patients" },
  { value: "15+", label: "Years Experience" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto max-w-[1280px]
       px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative mx-auto w-full max-w-[760px]">
            <div className="relative overflow-hidden rounded-[30px] bg-[#eef4f2] p-3 shadow-[0_14px_35px_rgba(15,23,42,0.08)] ring-1 ring-[#dfeae5] lg:p-4">
              <div className="relative h-[560px] overflow-hidden rounded-[26px] bg-[#eef3f1]">
                <Image
                  src={helpPeopleImage}
                  alt="Doctor helping a patient" 
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 52vw"
                />
              </div>
            </div>

            <div className="absolute bottom-5 left-6 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    "AL",
                    "SJ",
                    "MK",
                  ].map((initials, index) => (
                    <div
                      key={initials}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-slate-700 ${
                        index === 0 ? "bg-[#d8f5e5]" : index === 1 ? "bg-[#fce7f3]" : "bg-[#e0f2fe]"
                      }`}
                    >
                      {initials}
                    </div>
                  ))}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#1e9b75] text-[10px] font-semibold text-white">
                    +47
                  </div>
                </div>

                <div className="text-sm text-slate-600">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#1f9e75]" />
                    more
                  </div>
                </div>
              </div>

              <p className="mt-3 max-w-[200px] text-sm leading-5 text-slate-600">
                Joined our care program this month
              </p>
            </div>
          </div>

          <div className="max-w-[640px] lg:ml-auto">
            <div className="mb-5 inline-flex items-center rounded-full bg-[#dff6eb] px-4 py-2 text-sm font-medium text-[#1f8b67] ring-1 ring-[#cfe9dc]">
              Why Choose Us
            </div>

            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-[4rem]">
              Trusted healthcare for <span className="text-[#1aa777]">every</span> patient
            </h2>

            <p className="mt-6 max-w-[620px] text-lg leading-8 text-slate-600">
              For over 15 years, Medilane has set the standard for compassionate, high-quality care. Our experienced team blends modern medicine with genuine human connection — because healing is more than treatment.
            </p>

            <ul className="mt-8 space-y-5">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-4 text-lg text-slate-700">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dff6eb] text-[#1a9a72] shadow-sm ring-1 ring-[#c7eadc]">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#dfeae5] bg-white px-5 py-6 text-center shadow-[0_12px_24px_rgba(15,23,42,0.03)]"
                >
                  <div className="text-4xl font-semibold tracking-[-0.04em] text-[#1aa777]">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-lg text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
