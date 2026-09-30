import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
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

const TopRatedDoctors = () => {
  return (
    <section className="bg-[#f3f7f4] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-8 lg:mb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[#61736b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#174c3b]" />
              Featured doctors
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-[#17372d] sm:text-5xl">
              Meet the people behind your care.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between lg:justify-self-end lg:gap-8">
            <p className="max-w-sm text-sm leading-6 text-[#61736b]">
              Explore experienced physicians and find the right fit for your next visit.
            </p>
            <a href="/consultation" className="home-secondary-button shrink-0">
              Browse doctors
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {doctors.map((doctor, index) => (
            <a
              key={doctor.name}
              href={`/consultation?searchTerm=${encodeURIComponent(doctor.specialty)}`}
              className="home-card-link group block overflow-hidden rounded-lg border border-[#dce7df] bg-[#f7f8f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c3b]"
            >
              <div className="relative h-[280px] overflow-hidden sm:h-[340px]">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>

              <div className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-[#17372d]">
                    {doctor.name}
                  </p>
                  <p className="mt-1 text-sm text-[#61736b]">{doctor.specialty}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-sm text-[#61736b]">
                    <Star className="h-4 w-4 fill-[#c5a858] text-[#c5a858]" />
                    <span className="font-semibold text-[#17372d]">{doctor.rating}</span>
                    <span>({doctor.reviews} reviews)</span>
                  </div>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#174c3b] transition-colors group-hover:bg-[#174c3b] group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedDoctors;
