"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

import customer2 from "@/assets/testimonials/customer-2.jpg";
import customer3 from "@/assets/testimonials/customer-3.jpg";

const testimonials = [
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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(4px)",
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1] as const,
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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.03,
    x: -20,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

const reducedTextVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const reducedImageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();

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
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <div className="mb-5 flex flex-col 
        md:flex-row items-end md:items-center justify-between">
          <div className="max-w-5xl">
           
         

          <div className="mb-10 grid gap-8 lg:mb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[#61736b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#174c3b]" />
              Patient Stories
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-[#17372d] sm:text-5xl">
              Trusted By Patients
               <br />
              <span className="text-[#174c3b]">Who Value Better Care.</span>
            </h2>
          </div>

          </div>


          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 lg:pb-1">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={handlePrev}
              className="home-secondary-button home-icon-button group"
            >
              <ArrowLeft className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-x-0.5" />
            </button>

            <div className="flex h-12 min-w-[100px] items-center justify-center rounded-full bg-[#174c3b] px-4 text-sm font-medium text-white">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
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
              className="home-primary-button home-icon-button group"
            >
              <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-0.5" />
            </button>
          </div>

        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          {/* ================= TESTIMONIAL TEXT ================= */}
          <Card className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-lg border border-[#dce7df] bg-white p-6 shadow-sm sm:p-9 lg:min-h-[540px] lg:p-12">
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
                <div
                  className="flex items-center gap-1 text-[#a88530]"
                  aria-label={`${activeTestimonial.rating} out of 5 stars`}
                >
                  {Array.from({ length: activeTestimonial.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="ml-1 text-xs font-semibold text-[#61736b]">
                    {activeTestimonial.rating}.0
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeTestimonial.name}
                  variants={shouldReduceMotion ? reducedTextVariants : textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <p className="max-w-xl text-[1.75rem] font-medium leading-[1.15] text-[#17372d] sm:text-3xl lg:text-[2.4rem]">
                    “{activeTestimonial.quote}”
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Author */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.name}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: 0.08,
                }}
                className="relative z-10 mt-12 flex items-center justify-between gap-4 border-t border-[#dce7df] pt-7"
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
                    <p className="font-semibold text-[#17372d]">
                      {activeTestimonial.name}
                    </p>
                    <p className="mt-0.5 text-sm text-[#61736b]">
                      {activeTestimonial.role}
                    </p>
                  </div>
                </div>

                <div className="hidden items-center gap-2 rounded-full bg-[#e8f1e8] px-3 py-2 text-xs font-medium text-[#174c3b] sm:flex">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* ================= IMAGE ================= */}
          <Card className="relative min-h-[420px] overflow-hidden rounded-lg border border-[#dce7df] bg-[#e8f1e8] p-1 shadow-sm sm:p-2 lg:min-h-[540px]">
            <div className="relative h-full min-h-[404px] overflow-hidden rounded-md lg:min-h-[524px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial.name}
                  variants={shouldReduceMotion ? reducedImageVariants : imageVariants}
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
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.45,
                    delay: shouldReduceMotion ? 0 : 0.12,
                  }}
                  className="absolute inset-x-5 bottom-5 z-20 sm:inset-x-7 sm:bottom-7"
                >
                  <div className="flex items-center justify-between gap-4 rounded-md border border-white/70 bg-white/95 p-4 shadow-sm sm:p-5">
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
              className="group flex h-6 cursor-pointer items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c3b]"
            >
              <motion.span
                animate={{
                  width: currentIndex === index ? 32 : 7,
                  opacity: currentIndex === index ? 1 : 0.3,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block h-1.5 rounded-full bg-[#174c3b]"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

