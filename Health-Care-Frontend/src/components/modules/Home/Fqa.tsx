"use client";

import React, { useState } from "react";

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

function FAQItem({ faq, index, isOpen, onClick }) {
  return (
    <div
      className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-emerald-200 bg-emerald-50/40 shadow-sm"
          : "border-slate-200 bg-white hover:border-emerald-200 hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-6"
      >
        <div className="flex items-center gap-4">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
              isOpen
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-600"
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
              ? "rotate-180 border-emerald-600 bg-emerald-600 text-white"
              : "border-slate-200 bg-white text-slate-500 group-hover:border-emerald-300 group-hover:text-emerald-600"
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
        className={`grid transition-all duration-300 ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-emerald-100 px-5 pb-6 pt-4 pl-[4.5rem] sm:px-6 sm:pl-[4.75rem]">
            <p className="max-w-3xl text-sm leading-7 text-slate-600">
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
    <section className="relative overflow-hidden bg-slate-50 py-10
     sm:py-20 ">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="pointer-events-none absolute right-[8%] 
      top-20 hidden lg:block">
        <div className="grid grid-cols-5 gap-2 opacity-30">
          {Array.from({ length: 25 }).map((_, index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M9 12h6" />
                <path d="M12 9v6" />
                <rect x="3" y="3" width="18" height="18" rx="4" />
              </svg>
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Healthcare Support
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Frequently Asked
            <span className="block text-emerald-600">Questions</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
            Everything you need to know about managing appointments, doctors,
            patients, and healthcare services with DocLink.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="mx-auto grid gap-10 
        lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          {/* Left information card */}
          <div className="relative overflow-hidden rounded-3xl
           bg-emerald-600 p-7 text-white shadow-xl shadow-emerald-100 sm:p-8 lg:sticky lg:top-8">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border-[30px] border-white/10" />
            <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full border-[35px] border-white/10" />

            <div className="relative">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold leading-tight">
                Your health,
                <br />
                connected.
              </h3>

              <p className="mt-4 text-sm leading-6 text-emerald-50">
                DocLink brings patients, doctors, and healthcare management
                together in one simple and secure platform.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Easy appointment booking",
                  "Verified doctor profiles",
                  "Secure healthcare access",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    </span>

                    <span className="text-sm text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.question}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onClick={() =>
                  setOpenIndex(openIndex === index ? -1 : index)
                }
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row">
          <div>
            <h3 className="font-semibold text-slate-900">
              Still have questions?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Our support team is here to help you.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Contact Support
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}