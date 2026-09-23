import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import cardioDoc from "../../../assets/doctor-cardiologist.jpg";
import neurolDoc from "../../../assets/doctor-neurologist.jpg";
import orthoDoc from "../../../assets/doctor-orthopedic.jpg";

const doctors = [
  {
    name: "Dr. Cameron Williamson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 23,
    image: cardioDoc,
  },
  {
    name: "Dr. Leslie Alexander",
    specialty: "Neurologist",
    rating: 4.8,
    reviews: 45,
    image: neurolDoc,
  },
  {
    name: "Dr. Robert Fox",
    specialty: "Orthopedic",
    rating: 4.9,
    reviews: 32,
    image: orthoDoc,
  },
];

const socialLinks = [Facebook, Instagram, Linkedin, Twitter];

const TopRatedDoctors = () => {
  return (
    <section className="bg-[#dfeae1]  py-5 md:py-10">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.25fr_1.25fr_1.25fr]">
          <div className="flex min-h-[420px] flex-col justify-between rounded-[28px] bg-[#0d4a3d] p-7 text-white shadow-[0_18px_42px_rgba(13,74,61,0.18)] sm:p-8">
            <div>
              <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#dcefe2]">
                Our Team
              </p>

              <h2 className="max-w-[9ch] 
              text-4xl font-medium leading-[0.96] tracking-[-0.06em] text-white">
                The doctors you&apos;ll actually see, every visit.
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {socialLinks.map((Icon, index) => (
                <span
                  key={index}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          {doctors.map((doctor, index) => (
            <div
              key={doctor.name}
              className="group relative overflow-hidden rounded-[28px] border border-[#dfe7e1] bg-[#e7e5e1] shadow-[0_18px_30px_rgba(17,27,26,0.06)]"
            >
              <div className="relative h-[420px] overflow-hidden">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
              </div>

              <div className="absolute inset-x-4 bottom-3 rounded-[18px] border border-[#dfe6e2] bg-white/75 px-4 py-3 shadow-[0_10px_28px_rgba(17,27,26,0.06)] backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-[#18362d]">
                      {doctor.name.split(" ").slice(0, 2).join(" ")}
                    </p>
                    <p className="text-sm text-[#4d6c64]">{doctor.specialty}</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf6eb] text-[#0f4a3f]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedDoctors;
