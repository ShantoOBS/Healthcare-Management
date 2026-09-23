"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Quote,
  Star,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

import customer1 from "@/assets/testimonials/customer-1.jpg";
import customer2 from "@/assets/testimonials/customer-2.jpg";
import customer3 from "@/assets/testimonials/customer-3.jpg";

const testimonials = [
  {
    name: "Michael Setiawan",
    role: "Founder, Baku Hantam",
    image: customer1,
    quote:
      "Working with Clandestine was a pleasure. Their team was professional and our project was delivered right on time.",
    rating: 5,
  },
  {
    name: "Robert Fox",
    role: "Patient",
    image: customer2,
    quote:
      "The care and professionalism I received were outstanding. The doctors were knowledgeable and the staff was incredibly supportive throughout my treatment.",
    rating: 5,
  },
  {
    name: "Jane Cooper",
    role: "Patient",
    image: customer3,
    quote:
      "A seamless experience from booking an appointment to the consultation. Technology makes prescriptions and follow-ups incredibly convenient.",
    rating: 5,
  },
];

const textVariants = {
  initial: {
    opacity: 0,
    y: 18,
    filter: "blur(5px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(4px)",
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const imageVariants = {
  initial: {
    opacity: 0,
    scale: 1.06,
    x: 25,
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.03,
    x: -20,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const activeTestimonial = testimonials[currentIndex];

  const handlePrev = () => {
    setDirection(-1);

    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const handleNext = () => {
    setDirection(1);

    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="relative overflow-hidden bg-[#f5f6f3]  
     py-5 md:py-10">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#d9eadf]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#dce8e0]/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex items-center gap-3 text-sm font-medium text-slate-500"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>

              Patient Stories
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.65,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-4xl font-medium leading-[0.98] tracking-[-0.06em] text-slate-950 sm:text-5xl md:text-6xl lg:text-[5rem]"
            >
              Trusted By Patients
              <br />
              <span className="text-slate-400">Who Value Better Care.</span>
            </motion.h2>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 lg:pb-1">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={handlePrev}
              className="group flex h-12 w-12 cursor-pointer
               items-center justify-center rounded-full border
                border-slate-200 bg-white text-slate-800
                 shadow-sm transition-all duration-300
                  hover:-translate-x-1 hover:border-slate-300
                   hover:bg-slate-50 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>

            <div className="flex h-12 min-w-[100px] items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-medium text-white shadow-sm">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {String(currentIndex + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>

              <span className="mx-1 text-white/40">/</span>

              <span className="text-white/60">
                {String(testimonials.length).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              aria-label="Next testimonial"
              onClick={handleNext}
              className="group flex h-12 w-12 cursor-pointer
               items-center justify-center rounded-full bg-slate-950 text-white shadow-sm transition-all duration-300 hover:translate-x-1 hover:bg-slate-800 active:scale-95"
            >
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          {/* ================= TESTIMONIAL TEXT ================= */}
          <Card className="relative flex min-h-[500px] flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.05)] sm:p-9 lg:min-h-[620px] lg:p-12">
            {/* Decorative quote */}
            <div className="pointer-events-none absolute -right-8 -top-8">
              <Quote
                className="h-40 w-40 rotate-180 text-slate-100"
                strokeWidth={1}
              />
            </div>

            <div className="relative z-10">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e4f0e8]">
                  <Quote
                    className="h-5 w-5 text-slate-800"
                    strokeWidth={1.8}
                  />
                </div>

              
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeTestimonial.name}
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <p className="max-w-xl text-[1.75rem] font-medium leading-[1.15] tracking-[-0.045em] text-slate-950 sm:text-3xl lg:text-[2.4rem]">
                    “{activeTestimonial.quote}”
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Author */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.4,
                  delay: 0.08,
                }}
                className="relative z-10 mt-12 flex items-center justify-between gap-4 border-t border-slate-100 pt-7"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full ring-4 ring-slate-50">
                    <Image
                      src={activeTestimonial.image}
                      alt={activeTestimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>

                  <div>
                    <p className="font-semibold tracking-[-0.02em] text-slate-950">
                      {activeTestimonial.name}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {activeTestimonial.role}
                    </p>
                  </div>
                </div>

                <div className="hidden items-center gap-2 rounded-full bg-[#edf5ef] px-3 py-2 text-xs font-medium text-slate-700 sm:flex">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* ================= IMAGE ================= */}
          <Card className="relative min-h-[500px] overflow-hidden rounded-[2rem] border-0 bg-[#cfe3d5] p-2 shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-3 lg:min-h-[620px]">
            <div className="relative h-full min-h-[484px] overflow-hidden rounded-[1.6rem] lg:min-h-[594px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial.name}
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <Image
                    src={activeTestimonial.image}
                    alt={activeTestimonial.name}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />

                  {/* Image gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Top badge */}
              <div className="absolute left-5 top-5 z-20 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                Patient experience
              </div>

              {/* Bottom author card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial.name}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.12,
                  }}
                  className="absolute inset-x-5 bottom-5 z-20 sm:inset-x-7 sm:bottom-7"
                >
                  <div className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-white/30 bg-white/90 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src={activeTestimonial.image}
                          alt={activeTestimonial.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {activeTestimonial.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {activeTestimonial.role}
                        </p>
                      </div>
                    </div>

                    <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#e5f1e8] sm:flex">
                      <Quote
                        className="h-4 w-4 text-slate-700"
                        strokeWidth={1.7}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* ================= DOT INDICATORS ================= */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.name}
              type="button"
              aria-label={`View testimonial ${index + 1}`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className="group flex h-6 items-center"
            >
              <motion.span
                animate={{
                  width: currentIndex === index ? 32 : 7,
                  opacity: currentIndex === index ? 1 : 0.3,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block h-1.5 rounded-full bg-slate-900"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

