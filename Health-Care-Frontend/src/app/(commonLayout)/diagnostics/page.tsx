"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    id: "01",
    title: "Health Screening",
    description:
      "Comprehensive health screening designed to identify potential health concerns early.",
    accent: "from-[#f5f8f6] via-[#e8f0ec] to-[#dbe8e2]",
    imageClass:
      "bg-[radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.95),transparent_28%),radial-gradient(circle_at_90%_85%,rgba(83,125,111,0.12),transparent_35%)]",
  },
  {
    id: "02",
    title: "Advanced Imaging",
    description:
      "Modern diagnostic imaging that helps doctors understand your condition with greater clarity.",
    accent: "from-[#f7f9f8] via-[#eaf0ed] to-[#dce8e3]",
    imageClass:
      "bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.95),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(72,119,103,0.12),transparent_36%)]",
  },
  {
    id: "03",
    title: "Genetic Testing",
    description:
      "Advanced genetic testing to understand inherited risks and support personalized healthcare.",
    accent: "from-[#f4f8f5] via-[#e6efea] to-[#d8e7df]",
    imageClass:
      "bg-[radial-gradient(circle_at_72%_24%,rgba(255,255,255,0.96),transparent_30%),radial-gradient(circle_at_22%_82%,rgba(73,124,105,0.11),transparent_36%)]",
  },
  {
    id: "04",
    title: "Laboratory",
    description:
      "Reliable laboratory testing with accurate results to support confident medical decisions.",
    accent: "from-[#f8faf9] via-[#e9f0ed] to-[#dce9e3]",
    imageClass:
      "bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.95),transparent_30%),radial-gradient(circle_at_82%_82%,rgba(79,127,111,0.11),transparent_34%)]",
  },
  {
    id: "05",
    title: "Specialist Care",
    description:
      "Connect with experienced specialists for focused diagnosis, treatment and guidance.",
    accent: "from-[#f5f9f6] via-[#e7efea] to-[#d9e7df]",
    imageClass:
      "bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.96),transparent_28%),radial-gradient(circle_at_18%_82%,rgba(69,120,101,0.12),transparent_36%)]",
  },
  {
    id: "06",
    title: "Neurology",
    description:
      "Specialized neurological care focused on accurate diagnosis and personalized treatment.",
    accent: "from-[#f7faf8] via-[#e8efeb] to-[#dae8e1]",
    imageClass:
      "bg-[radial-gradient(circle_at_22%_22%,rgba(255,255,255,0.95),transparent_30%),radial-gradient(circle_at_82%_76%,rgba(77,124,108,0.12),transparent_36%)]",
  },
];

const DiagnosticsPage = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateHorizontalScroll = () => {
      const section = sectionRef.current;
      const track = trackRef.current;

      if (!section || !track) return;

      const rect = section.getBoundingClientRect();

      const sectionTop = window.scrollY + rect.top;
      const currentScroll = window.scrollY - sectionTop;

      const maxTranslate = track.scrollWidth - window.innerWidth;

      if (maxTranslate <= 0) {
        track.style.transform = "translate3d(0, 0, 0)";
        return;
      }

      const scrollableDistance =
        section.offsetHeight - window.innerHeight;

      const progress = Math.min(
        Math.max(currentScroll / scrollableDistance, 0),
        1
      );

      const translateX = progress * maxTranslate;

      track.style.transform = `translate3d(-${translateX}px, 0, 0)`;

      const cardWidth =
        track.children[0]?.getBoundingClientRect().width ?? 1;

      const gap = 20;

      const currentCard = Math.round(
        translateX / (cardWidth + gap)
      );

      setActiveIndex(
        Math.min(
          Math.max(currentCard, 0),
          services.length - 1
        )
      );
    };

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHorizontalScroll();
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", updateHorizontalScroll);

    updateHorizontalScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHorizontalScroll);
    };
  }, []);

  const goToCard = (index: number) => {
    const section = sectionRef.current;

    if (!section) return;

    const scrollableDistance =
      section.offsetHeight - window.innerHeight;

    const progress = index / (services.length - 1);

    const sectionTop =
      window.scrollY +
      section.getBoundingClientRect().top;

    const targetScroll =
      sectionTop +
      progress * scrollableDistance;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const getSectionHeight = () => {
    if (typeof window === "undefined") {
      return "600vh";
    }

    const width = window.innerWidth;

    if (width >= 1280) {
      return `${(services.length - 3 + 1) * 100}vh`;
    }

    if (width >= 768) {
      return `${(services.length - 2 + 1) * 100}vh`;
    }

    return `${services.length * 100}vh`;
  };

  return (
    <main className="bg-[#f3f6f4] text-[#172521]">
      <section
        ref={sectionRef}
        className="relative"
        style={{
          height: getSectionHeight(),
        }}
      >
        <div className="sticky top-0 flex 
         w-full items-center overflow-hidden">
          <div className="w-full py-8 sm:py-10 lg:py-10">

            {/* HEADER */}
            <div className="mx-auto mb-7 w-full max-w-[1280px] px-5 sm:px-6 lg:px-8">
              <div className="grid items-end gap-6 lg:grid-cols-[1.5fr_0.5fr] lg:gap-12">

                <div>
                  <div className="mb-4 flex items-center gap-3 sm:mb-5">
                    <span className="h-px w-8 bg-[#557a6c]" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#607970] sm:text-[11px]">
                      Our Services
                    </span>
                  </div>

                  <h1 className="max-w-[900px] text-[38px] font-medium leading-[0.98] tracking-[-0.055em] text-[#14231f] sm:text-5xl md:text-[56px] lg:text-[66px]">
                    Everything your diagnosis needs,
                    <span className="text-[#658176]">
                      {" "}under one roof.
                    </span>
                  </h1>
                </div>

                <div className="lg:pb-1">
                  <p className="max-w-[430px] text-[14px] leading-6 text-[#667871] sm:text-[15px]">
                    From preventive screening to specialized
                    care, access trusted diagnostic services
                    designed to give you clarity and confidence
                    at every step.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD TRACK */}
            <div className="w-full overflow-visible">
              <div
                ref={trackRef}
                className="
                  flex
                  w-max
                  gap-5
                  pl-5
                  pr-5
                  sm:pl-6
                  sm:pr-6
                  md:pl-8
                  md:pr-8
                  lg:pl-10
                  lg:pr-10
                  xl:pl-[max(3rem,calc((100vw-1440px)/2))]
                  xl:pr-[max(3rem,calc((100vw-1440px)/2))]
                  2xl:pl-[max(0px,calc((100vw-1440px)/2))]
                  2xl:pr-[max(0px,calc((100vw-1440px)/2))]
                  transition-transform
                  duration-100
                  ease-out
                "
              >
                {services.map((service) => (
                  <article
                    key={service.id}
                    className={`
                      group
                      relative
                      min-h-[450px]
                      w-[calc(100vw-40px)]
                      shrink-0
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-white/80
                      bg-gradient-to-br
                      ${service.accent}
                      p-6
                      shadow-[0_20px_70px_rgba(42,68,59,0.08)]
                      transition-all
                      duration-500
                      hover:-translate-y-1
                      hover:shadow-[0_28px_80px_rgba(42,68,59,0.13)]
                      sm:min-h-[480px]
                      sm:w-[420px]
                      sm:rounded-[30px]
                      sm:p-7
                      lg:min-h-[525px]
                      lg:w-[calc((100vw-220px)/3)]
                      lg:p-8
                      xl:w-[calc((1420px-96px)/3)]
                      2xl:w-[calc((1440px-96px)/3)]
                    `}
                  >
                    <div
                      className={`
                        pointer-events-none
                        absolute
                        inset-0
                        ${service.imageClass}
                      `}
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#9db8aa]/10" />

                    <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/50" />

                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/45" />

                    <div className="pointer-events-none absolute bottom-[-70px] left-[-70px] h-40 w-40 rounded-full bg-white/20 blur-2xl" />

                    <div className="relative flex h-full flex-col justify-between">

                      {/* TOP */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[12px] font-semibold tracking-[0.16em] text-[#557267]">
                            {service.id}
                          </span>

                          <span className="h-px w-5 bg-[#8fa99f]" />
                        </div>

                        <div className="rounded-full border border-white/70 bg-white/35 px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#5b756b] shadow-sm backdrop-blur-md">
                          Healthcare
                        </div>
                      </div>

                      {/* BOTTOM */}
                      <div className="mt-auto pt-10">
                        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#71867f]">
                          Diagnostic service
                        </p>

                        <h2 className="max-w-[390px] text-[34px] font-medium leading-[1] tracking-[-0.045em] text-[#182c26] sm:text-[38px]">
                          {service.title}
                        </h2>

                        <p className="mt-5 max-w-[390px] text-[14px] leading-6 text-[#60736c]">
                          {service.description}
                        </p>

                        <div className="mt-7 flex items-center justify-between border-t border-white/50 pt-5">
                          <span className="text-[13px] font-semibold text-[#29473d]">
                            Explore service
                          </span>

                          <button
                            type="button"
                            aria-label={`Discover ${service.title}`}
                            className="
                              flex
                              h-12
                              w-12
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-[#29473d]/10
                              bg-[#17382f]
                              text-white
                              shadow-[0_8px_25px_rgba(23,56,47,0.16)]
                              transition-all
                              duration-300
                              group-hover:rotate-45
                              group-hover:bg-[#234c40]
                              group-hover:shadow-[0_12px_30px_rgba(23,56,47,0.22)]
                            "
                          >
                            <ArrowUpRight
                              size={18}
                              strokeWidth={1.8}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                <div className="w-5 shrink-0 sm:w-6 md:w-8 lg:w-10 xl:w-[max(3rem,calc((100vw-1440px)/2))] 2xl:w-[max(0px,calc((100vw-1440px)/2))]" />
              </div>
            </div>

            {/* PROGRESS */}
            <div className="mx-auto mt-6 flex w-full max-w-[1440px] items-center justify-between px-5 sm:mt-7 sm:px-6 md:px-8 lg:mt-8 lg:px-10 xl:px-12 2xl:px-0">

              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-semibold tracking-wider text-[#47665c]">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>

                <div className="relative h-[2px] w-20 overflow-hidden rounded-full bg-[#ccd8d3] sm:w-32 lg:w-48">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-[#31594c] transition-all duration-150"
                    style={{
                      width: `${
                        ((activeIndex + 1) / services.length) * 100
                      }%`,
                    }}
                  />
                </div>

                <span className="font-mono text-[11px] text-[#91a19c]">
                  {String(services.length).padStart(2, "0")}
                </span>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                {services.map((service, index) => (
                  <button
                    key={service.id}
                    type="button"
                    aria-label={`Go to ${service.title}`}
                    onClick={() => goToCard(index)}
                    className={`
                      h-1.5
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        index === activeIndex
                          ? "w-9 bg-[#31594c]"
                          : "w-1.5 bg-[#b4c3bd] hover:bg-[#718a81]"
                      }
                    `}
                  />
                ))}
              </div>

              <span className="hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-[#788a84] sm:block">
                Scroll to explore
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DiagnosticsPage;

