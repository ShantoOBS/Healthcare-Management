import { ArrowUpRight } from "lucide-react";

const services = [
  {
    id: "03",
    title: "Genetic Testing",
    theme: "teal",
    accent: "from-[#0b4f49] via-[#0e6361] to-[#0a544f]",
    imageClass: "bg-[radial-gradient(circle_at_center,_rgba(16,85,88,0.8),_rgba(8,30,36,0.9))]",
    buttonText: "Discover",
  },
  {
    id: "04",
    title: "Laboratory",
    theme: "slate",
    accent: "from-[#2b3d4d] via-[#1a2d3d] to-[#0b1725]",
    imageClass: "bg-[radial-gradient(circle_at_center,_rgba(122,138,150,0.35),_rgba(10,14,18,0.92))]",
    buttonText: "Discover",
  },
  {
    id: "05",
    title: "Specialist Care",
    theme: "blue",
    accent: "from-[#404e6d] via-[#2d3f5e] to-[#1d2b46]",
    imageClass: "bg-[radial-gradient(circle_at_center,_rgba(104,119,142,0.35),_rgba(17,23,34,0.92))]",
    buttonText: "Discover",
  },
];

const DiagnosticsPage = () => {
  return (
    <main className="min-h-screen bg-[#e8eeeb]   py-8 text-[#0e1d1b] ">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-8 
        lg:grid-cols-[1.45fr_0.55fr] ">
          <h1 className="max-w-[700px] text-5xl md:text-6xl
          font-medium leading-[0.95] tracking-[-0.06em] text-[#1a1e1d]">
            Everything your diagnosis needs, under one roof
          </h1>

          <div className="lg:pl-8">
            <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#1e2e2d]/70">
              Our Services
            </p>
            <p className="max-w-[420px] text-lg leading-relaxed text-[#1e2e2d]/90">
              From a routine check-up to a full genomic panel — five directions that cover prevention,
              diagnosis and long-term care.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className={`group relative min-h-[520px] overflow-hidden rounded-[30px] border border-[#dfe7e1] bg-gradient-to-br ${service.accent} shadow-[0_18px_40px_rgba(15,27,31,0.12)]`}
            >
              <div className={`absolute inset-0 ${service.imageClass}`} />

              <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-2xl font-medium text-white/90">{service.id}</span>
                </div>

                <div className="mt-auto space-y-6">
                  <h2 className="max-w-[220px] text-4xl font-medium leading-[1.1] tracking-[-0.05em] text-white">
                    {service.title}
                  </h2>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-medium text-white/90">Discover</span>

                    <button
                      type="button"
                      aria-label={`Discover ${service.title}`}
                      className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/8 text-white backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:bg-white/12"
                    >
                      <ArrowUpRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default DiagnosticsPage;