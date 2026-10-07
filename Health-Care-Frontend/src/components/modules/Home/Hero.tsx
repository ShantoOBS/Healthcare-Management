"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Video,
  ShieldCheck,
  FileText,
  Users,
  Building2,
  Star,
  Play,
  Check,
  GraduationCap,
  Briefcase,
  X,
} from "lucide-react";

import heroDoctor from "@/assets/Home/hero-doctor.png";
import doctorJohn from "@/assets/doctor-orthopedic.jpg";
import doctorWilliam from "@/assets/doctor-cardiologist.jpg";

const LOCATIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "All Locations",
];

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Hero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Dhaka");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
    if (selectedLocation && selectedLocation !== "All Locations") {
      params.set("location", selectedLocation);
    }
    router.push(`/consultation?${params.toString()}`);
  };

  return (
    <section className="relative 
   
     bg-[#e8eeeb] text-[#0d2a20] ">
      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}
      <div className="relative z-10 mx-auto flex  
      flex-col justify-between max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 md:pb-25">
        <div className="grid flex-1 items-start
         gap-5 pt-4 pb-6 lg:grid-cols-12 lg:gap-8 lg:pt-8">

          {/* =================================================
              LEFT CONTENT (Column 1 - 7 cols)
          ================================================== */}
          <div className="relative z-20 flex flex-col 
          items-start lg:col-span-7 xl:col-span-7 max-w-[680px]">
            {/* Tag / Badge */}

            <div className=" w-full flex flex-col-reverse md:flex-col">

              <form
                onSubmit={handleSearch}
                className="mt-6 sm:mt-8 w-full max-w-[590px] rounded-md
                border border-[#dfebe4] bg-white/95 p-2 sm:p-2.5 shadow-[0_15px_40px_rgba(20,55,42,0.08)] backdrop-blur-xl transition-shadow focus-within:shadow-[0_20px_50px_rgba(45,164,111,0.15)]"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {/* Search Term Input */}
                  <div className="flex flex-1 items-center gap-2.5 rounded-md
                px-3 py-3 bg-[#e8eeeb]">
                    <Search className="h-5 w-5 shrink-0 text-[#71877f]" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Doctor name or specialty"
                      aria-label="Search doctor or specialty"
                      className="w-full  text-sm 
                    sm:text-[15px] font-medium text-[#0d2a20] outline-none placeholder:text-[#8ba098]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="group flex items-center justify-center
                     gap-3 rounded-md cursor-pointer bg-[#1f5c4b] px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-medium text-white shadow-[0_12px_25px_rgba(31,92,75,0.2)] transition hover:bg-[#194b3f] active:scale-[0.98] shrink-0 w-full sm:w-auto"
                  >
                    <span>Find a Doctor</span>

                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3fa9b] text-[#1c3a2e] transition-transform group-hover:rotate-45"
                    >
                      <ArrowIcon />
                    </span>
                  </button>

                </div>
              </form>

              <div>
                <div className="inline-flex items-center gap-2 mt-10
             rounded-full border border-[#bce4cc] 
             bg-[#e1f4e8]/90 px-3.5 py-1.5 shadow-[0_2px_10px_rgba(45,164,111,0.08)] backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#2da46f]" />
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#1c543f]">
                    YOUR HEALTH, CONNECTED
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="mt-5 text-[40px] 
                font-extrabold leading-[1.05] tracking-[-0.03em]
                 text-[#0d2a20] sm:text-[56px] md:text-[64px] xl:text-[75px]">
                  Find The Right
                  <br />
                  <span className="text-[#329a6e]">Doctor</span> For You.
                </h1>
              </div>


            </div>



            {/* Subtitle Description */}
            <p className="mt-4 sm:mt-5 max-w-[540px] text-sm 
            sm:text-base md:text-[17px] font-normal
            leading-relaxed text-[#556e66]">
              Discover trusted specialists, check availability, and book your
              appointment in just a few simple steps.
            </p>





          </div>

          {/* =================================================
              RIGHT VISUAL (Column 2 - 5 cols)
          ================================================== */}
          <div className="relative mx-auto mt-10
           w-full max-w-[520px] lg:col-span-5 lg:mt-10
            lg:max-w-none flex justify-center">

            {/* Central Doctor Frame Container */}
            <div className="relative h-[480px] w-full 
            sm:h-[530px] ">

              {/* Doctor Main Image Card */}
              <div className="relative h-full w-full overflow-hidden rounded-md border-2 border-white bg-[#dbeae0] shadow-[0_25px_60px_rgba(20,55,42,0.14)]">
                <Image
                  src={heroDoctor}
                  alt="Specialist female doctor with stethoscope"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 450px"
                  className="object-cover object-top"
                />

                {/* Available Today Badge on Doctor Photo */}
                <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-3.5 py-1.5 text-[11px] font-bold text-[#1c543f] shadow-md backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#2da46f]" />
                  <span>Available today</span>
                </div>

                {/* Dark Consultation Overlay Bar inside photo at bottom */}
                <div className="absolute inset-x-3 bottom-3 z-20 w-[80%]
                sm:inset-x-4 sm:bottom-4">
                  <div className="flex items-center justify-between gap-3
                   rounded-md border border-white/15 bg-[#0c372b]/85
                    p-3.5 sm:p-4 text-white shadow-xl backdrop-blur-full ">
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-[#8ae0b8]">
                        ONLINE CONSULTATION
                      </p>
                      <h3 className="mt-0.5 text-sm sm:text-base font-bold text-white">
                        Talk to a doctor online
                      </h3>
                      <p className="mt-0.5 text-[11px] text-white/75 truncate">
                        Secure virtual healthcare from anywhere
                      </p>
                    </div>

                    {/* Interactive Play Video Button */}
                    <button
                      type="button"
                      onClick={() => setIsVideoModalOpen(true)}
                      aria-label="Play consultation video preview"
                      className="group flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0c372b] shadow-md transition-transform duration-200 hover:scale-110 active:scale-95"
                    >
                      <Play className="ml-0.5 h-4 w-4 sm:h-5 sm:w-5 fill-[#0c372b] text-[#0c372b]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FLOATING CARD 1: Specialist Doctors (Left)
              ================================================== */}
              <div className="absolute sm:-left-12 hidden 
              md:inline
              lg:-left-35 top-[24%] sm:top-[22%] z-30 w-[205px]            
              sm:w-[225px] rounded-md  border border-white 
              bg-white/95 p-3.5 sm:p-4 shadow-[0_20px_45px_rgba(20,55,42,0.12)] 
              backdrop-blur-xl transition-transform hover:-translate-y-1 
              duration-300">
                {/* Header with Arrow */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#71877f]">
                      SPECIALIST
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#0d2a20]">
                      Doctors
                    </p>
                  </div>
                  <Link
                    href="/consultation"
                    aria-label="View specialists"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e6f4eb] text-[#2da46f] transition-colors hover:bg-[#d6ecdd]"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Doctor Avatar + Name */}
                <div className="mt-2.5 flex items-center gap-2.5">
                  <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-full border border-[#d2ead9] shrink-0">
                    <Image
                      src={doctorJohn}
                      alt="Dr. John Bennett"
                      fill
                      sizes="40px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-bold text-[#0d2a20] truncate">
                      Dr. John Bennett
                    </p>
                    <p className="text-[10px] text-[#71877f]">Neurologist</p>
                  </div>
                </div>

                {/* Doctor Credentials & Info */}
                <div className="mt-3 space-y-1.5 border-t border-[#edf3ef] pt-2.5 text-[10px] text-[#4d665e]">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 fill-[#e8b923] text-[#e8b923] shrink-0" />
                    <span className="font-semibold text-[#0d2a20]">4.8</span>
                    <span className="text-[#71877f]">(124 reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-3 w-3 text-[#329a6e] shrink-0" />
                    <span className="truncate">MBBS, MD (Neurology)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3 text-[#329a6e] shrink-0" />
                    <span>10+ years experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 text-[#329a6e] shrink-0" />
                    <span className="truncate">Dhaka Medical College</span>
                  </div>
                </div>

                {/* View Profile Button */}
                <Link
                  href="/consultation"
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-[#e0f1e7] py-1.5 px-3 text-[11px] font-bold text-[#1c5e44] transition-colors hover:bg-[#d0ebd9]"
                >
                  <span>View Profile</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* =================================================
                  FLOATING CARD 2: Recently Visited (Top Right)
              ================================================== */}
              <div className="absolute -right-2
               sm:-right-8 
               -top-12 sm:-top-10 z-30 w-[190px] 
                sm:w-[210px] rounded-md
                 border border-white
                  bg-white/95 p-2.5 sm:p-3 
                  shadow-[0_15px_40px_rgba(20,55,42,0.12)] 
                  backdrop-blur-xl transition-transform
                   hover:-translate-y-1 duration-300">
                <p className="text-[8px] sm:text-[9px] 
                font-bold uppercase tracking-wider text-[#71877f] mb-1.5">
                  RECENTLY VISITED
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-full border border-[#d2ead9] shrink-0">
                    <Image
                      src={doctorWilliam}
                      alt="Dr. William Martinez"
                      fill
                      sizes="40px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0d2a20] truncate">
                      Dr. William Martinez
                    </p>
                    <p className="text-[10px] text-[#71877f] truncate">
                      General Physician
                    </p>
                    <p className="text-[9px] font-semibold text-[#2da46f]">
                      Viewed recently
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FLOATING CARD 3: 12K+ Consultations (Bottom Right)
              ================================================== */}
              <div className="absolute -right-2 sm:-right-6 lg:-right-10
               bottom-30
                z-30 flex items-center gap-2.5 sm:gap-3 rounded-md
                 border border-white bg-white/95 p-2 sm:p-2.5 px-3 sm:px-4 shadow-[0_15px_40px_rgba(20,55,42,0.12)] backdrop-blur-xl transition-transform hover:-translate-y-1 duration-300">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#dcf3e4] text-[#2da46f]">
                  <Check className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-extrabold text-[#0d2a20] leading-none">
                    120
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-[#71877f] mt-0.5">
                    Consultations
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>


      </div>

      {/* =====================================================
          INTERACTIVE VIDEO CONSULTATION MODAL
      ====================================================== */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-[#0e3b2e] px-6 py-4 text-white">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-[#8ae0b8]" />
                <h4 className="font-bold text-sm sm:text-base">
                  Online Doctor Consultation Demo
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="rounded-full bg-white/10 p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                className="h-full w-full object-cover"
                autoPlay
                controls
                playsInline
                poster="/dashboard/doctor_video_call.png"
              >
                <source
                  src="/videos/doctor-online-consultation.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#f6faf7] px-6 py-4 border-t border-[#e2ece5]">
              <p className="text-xs text-[#556e66]">
                Talk to certified specialists directly through instant HD video call.
              </p>
              <Link
                href="/consultation"
                onClick={() => setIsVideoModalOpen(false)}
                className="rounded-full bg-[#0e3b2e] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#154e3d] transition-colors"
              >
                Book a Consultation Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;