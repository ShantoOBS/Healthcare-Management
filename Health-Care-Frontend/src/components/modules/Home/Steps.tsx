import {
  Search,
  UserRound,
  CalendarCheck,
  Video,
  ArrowUpRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const processSteps = [
  {
    number: "01",
    icon: Search,
    title: "Find Your Doctor",
    description:
      "Search and discover doctors by specialty, experience, availability, and other important information.",
  },
  {
    number: "02",
    icon: UserRound,
    title: "Explore Doctor Profile",
    description:
      "View doctor profiles, qualifications, specialties, consultation details, and available appointment slots.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Book an Appointment",
    description:
      "Select a convenient date and time, provide the required information, and confirm your appointment securely.",
  },
  {
    number: "04",
    icon: Video,
    title: "Consult & Get Your Solution",
    description:
      "Connect with your doctor through consultation, receive medical guidance, and access your prescription digitally.",
  },
];

const Steps = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-8 lg:mb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[#61736b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#174c3b]" />
              How it works
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-[#17372d] sm:text-5xl">
              Better care, one clear step at a time.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between lg:justify-self-end lg:gap-8">
            <p className="max-w-sm text-sm leading-6 text-[#61736b]">
              Find a doctor, book a time, and manage your care in one simple place.
            </p>
            <a href="/consultation" className="home-secondary-button shrink-0">
              Explore doctors
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {processSteps.map(({ number, icon: Icon, title, description }, index) => (
            <Card
              key={number}
              className={`home-info-card flex min-h-[270px] flex-col justify-between rounded-lg border-[#dce7df] p-6 shadow-none sm:p-7 ${
                index === 1 ? "bg-[#e8f1e8]" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f7f4] text-[#174c3b]">
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <span className="text-sm font-medium text-[#9ba9a2]">{number}</span>
              </div>
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-[#17372d]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#61736b]">{description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;