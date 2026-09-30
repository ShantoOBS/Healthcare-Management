"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "What is DocLink?",
    answer:
      "DocLink is a healthcare management platform that connects patients, doctors, and administrators in one secure system. Patients can find doctors, book appointments, and manage their healthcare journey online.",
  },
  {
    question: "How can I book an appointment with a doctor?",
    answer:
      "After creating your account, you can browse available doctors, view their profiles and specialties, choose an available time slot, and confirm your appointment directly from the platform.",
  },
  {
    question: "Can doctors manage their appointments?",
    answer:
      "Yes. Doctors have their own dashboard where they can view upcoming appointments, manage their availability, review patient information, and keep track of their consultations.",
  },
  {
    question: "Is my health information secure?",
    answer:
      "DocLink is designed with security in mind. Authentication, role-based access control, protected APIs, and secure data handling help ensure that healthcare information is accessible only to authorized users.",
  },
  {
    question: "What can administrators manage?",
    answer:
      "Administrators can manage doctors, patients, appointments, specialties, users, and other healthcare operations through a centralized administration dashboard.",
  },
  {
    question: "Can I access DocLink from my mobile device?",
    answer:
      "Yes. The platform uses a responsive interface that allows patients, doctors, and administrators to access important features from desktops, tablets, and mobile devices.",
  },
];

function FAQItem({
  faq,
  index,
  isOpen,
  onClick,
}: {
  faq: (typeof faqs)[number];
  index: number;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`home-info-card group overflow-hidden rounded-lg border ${
        isOpen
          ? "border-[#b9d2c0] bg-[#f3f7f4] shadow-sm"
            : "border-[#dce7df] bg-white hover:border-[#b9d2c0] hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
            className="flex w-full cursor-pointer items-center justify-between gap-6 px-5 py-5 text-left sm:px-6"
      >
        <div className="flex items-center gap-4">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
              isOpen
                ? "bg-[#174c3b] text-white"
                : "bg-[#e8f1e8] text-[#174c3b]"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="text-sm font-semibold leading-6 text-slate-800 sm:text-base">
            {faq.question}
          </span>
        </div>

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? "rotate-180 border-[#174c3b] bg-[#174c3b] text-white"
              : "border-[#dce7df] bg-white text-[#61736b] group-hover:border-[#174c3b] group-hover:text-[#174c3b]"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-label={faq.question}
        className={`grid transition-all duration-300 ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#dce7df] px-5 pb-6 pt-4 pl-[4.5rem] sm:px-6 sm:pl-[4.75rem]">
            <p className="max-w-3xl text-sm leading-7 text-[#61736b]">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Fqa() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#f3f7f4] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-8 lg:mb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[#61736b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#174c3b]" />
              Helpful answers
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-[#17372d] sm:text-5xl">
              Questions? Start here.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between lg:justify-self-end lg:gap-8">
            <p className="max-w-sm text-sm leading-6 text-[#61736b]">
              Learn about appointments, doctor profiles, and keeping your health information secure.
            </p>
            <a href="mailto:info@CuraMedhospital.com" className="home-secondary-button shrink-0">
              Contact support
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-4xl space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}