import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";

import helpPeopleImage from "@/assets/whyChooseUs/help-people.jpg";

const reasons = [
  "Find doctors by specialty and explore their profiles",
  "Choose an appointment time that works for you",
  "Manage appointments and health information in one place",
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#f3f7f4] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl
       px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative mx-auto w-full max-w-[760px]">
            <div className="home-image-frame group relative overflow-hidden rounded-lg bg-white p-2 ring-1 ring-[#dce7df] sm:p-3">
              <div className="relative h-[380px] overflow-hidden rounded-md bg-[#e8f1e8] sm:h-[520px]">
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

          </div>

          <div className="max-w-[640px] lg:ml-auto">
            <div className="mb-5 inline-flex items-center rounded-full bg-[#e8f1e8] px-4 py-2 text-sm font-medium text-[#174c3b] ring-1 ring-[#dce7df]">
              Why Choose Us
            </div>

            <h2 className="text-3xl font-bold tracking-tight
           text-[#17372d] sm:text-4xl lg:text-5xl">
              Trusted Healthcare For <span className="text-[#174c3b]">Every</span> Patient
            </h2>

            <p className="mt-6 max-w-[620px] text-lg leading-8 text-[#61736b]">
              DocLink makes it easier to find a doctor, schedule an appointment, and keep track of your care in one place.
            </p>

            <ul className="mt-8 space-y-5">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-4 text-lg text-[#344b41]">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f1e8] text-[#174c3b] ring-1 ring-[#dce7df]">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            <a href="/consultation" className="home-primary-button mt-8">
              Browse doctors
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
