"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    id: "01",
    title: "Health Screening",
    description:
      "Comprehensive health screening designed to identify potential health concerns early.",
    accent:
      "from-[#dcebe5] via-[#d3e3dd] to-[#c4d9d0]",
    imageClass:
      "bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.85),transparent_28%),radial-gradient(circle_at_85%_75%,rgba(113,154,139,0.16),transparent_32%)]",
  },
  {
    id: "02",
    title: "Advanced Imaging",
    description:
      "Modern diagnostic imaging that helps doctors understand your condition with greater clarity.",
    accent:
      "from-[#e1ebe7] via-[#d6e3de] to-[#c5d8d0]",
    imageClass:
      "bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.8),transparent_26%),radial-gradient(circle_at_80%_70%,rgba(92,137,123,0.15),transparent_34%)]",
  },
  {
    id: "03",
    title: "Genetic Testing",
    description:
      "Advanced genetic testing to understand inherited risks and support personalized healthcare.",
    accent:
      "from-[#dcece6] via-[#d0e1da] to-[#bfd6cc]",
    imageClass:
      "bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.85),transparent_28%),radial-gradient(circle_at_25%_80%,rgba(89,140,123,0.14),transparent_35%)]",
  },
  {
    id: "04",
    title: "Laboratory",
    description:
      "Reliable laboratory testing with accurate results to support confident medical decisions.",
    accent:
      "from-[#e3ece8] via-[#d6e3de] to-[#c6d9d1]",
    imageClass:
      "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(95,143,128,0.15),transparent_32%)]",
  },
  {
    id: "05",
    title: "Specialist Care",
    description:
      "Connect with experienced specialists for focused diagnosis, treatment and guidance.",
    accent:
      "from-[#dcebe6] via-[#d1e1db] to-[#c1d6cd]",
    imageClass:
      "bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.82),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(86,137,121,0.15),transparent_34%)]",
  },
  {
    id: "06",
    title: "Neurology",
    description:
      "Specialized neurological care focused on accurate diagnosis and personalized treatment.",
    accent:
      "from-[#e2ece8] via-[#d4e2dc] to-[#c3d7ce]",
    imageClass:
      "bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.85),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(91,139,124,0.16),transparent_35%)]",
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

      /*
       * How far the user has travelled vertically
       * inside this section.
       */
      const sectionTop = window.scrollY + rect.top;
      const currentScroll = window.scrollY - sectionTop;

      /*
       * Calculate the maximum horizontal distance.
       *
       * The track contains all 6 cards while the viewport
       * only shows a portion of them.
       */
      const maxTranslate =
        track.scrollWidth - window.innerWidth;

      if (maxTranslate <= 0) {
        track.style.transform = "translate3d(0, 0, 0)";
        return;
      }

      /*
       * The section height is based on the amount of
       * horizontal movement required.
       *
       * This means the user cannot leave this section
       * before reaching the last card.
       */
      const scrollableDistance =
        section.offsetHeight - window.innerHeight;

      const progress = Math.min(
        Math.max(currentScroll / scrollableDistance, 0),
        1
      );

      const translateX = progress * maxTranslate;

      track.style.transform = `translate3d(-${translateX}px, 0, 0)`;

      /*
       * Calculate the closest card.
       */
      const cardWidth =
        track.children[0]?.getBoundingClientRect().width ?? 1;

      const gap = 20;

      const currentCard = Math.round(
        translateX / (cardWidth + gap)
      );

      setActiveIndex(
        Math.min(Math.max(currentCard, 0), services.length - 1)
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

  /*
   * Jump directly to a particular card.
   */
  const goToCard = (index: number) => {
    const section = sectionRef.current;

    if (!section) return;

    const scrollableDistance =
      section.offsetHeight - window.innerHeight;

    const progress =
      index / (services.length - 1);

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

  /*
   * Number of horizontal movements required.
   *
   * Desktop:
   * 3 cards are visible → 3 horizontal movements.
   *
   * Mobile:
   * 1 card is visible → 5 horizontal movements.
   */
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
    <main className="bg-[#e8eeeb] text-[#0e1d1b]">
      {/* =====================================================
          HORIZONTAL SCROLL SECTION
      ====================================================== */}

      <section
        ref={sectionRef}
        className="relative"
        style={{
          height: getSectionHeight(),
        }}
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
          <div className="w-full">
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mx-auto mb-8 max-w-[1280px] px-5 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-[1.45fr_0.55fr]">
                {/* Main heading */}
                <h1 className="max-w-[850px] text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-[64px]">
                  Everything your diagnosis needs, under one roof
                </h1>

                {/* Description */}
                <div className="lg:pt-2">
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#668078]">
                    Our Services
                  </p>

                  <p className="max-w-[430px] text-sm leading-6 text-[#61736e] sm:text-[15px]">
                    From preventive screening to specialized care,
                    access trusted diagnostic services designed to
                    give you clarity and confidence at every step.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                CARD TRACK
            ================================================= */}

            <div className="w-full overflow-visible">
              <div
                ref={trackRef}
                className="
                  flex
                  w-max
                  gap-5
                  pl-5
                  transition-transform
                  duration-100
                  ease-out
                  sm:pl-6
                  lg:pl-[max(2rem,calc((100vw-1280px)/2))]
                "
              >
                {services.map((service) => (
                  <article
                    key={service.id}
                    className={`
                      group
                      relative
                      min-h-[430px]
                      w-[calc(100vw-40px)]
                      shrink-0
                      overflow-hidden
                      rounded-[30px]
                      border
                      border-white/70
                      bg-gradient-to-br
                      ${service.accent}
                      p-6
                      shadow-[0_18px_60px_rgba(26,55,47,0.06)]
                      sm:min-h-[470px]
                      sm:w-[430px]
                      sm:p-7
                      lg:min-h-[520px]
                      lg:w-[calc((100vw-140px)/3)]
                      xl:w-[calc((1280px-40px)/3)]
                    `}
                  >
                    {/* Background visual */}
                    <div
                      className={`
                        pointer-events-none
                        absolute
                        inset-0
                        ${service.imageClass}
                      `}
                    />

                    {/* Subtle decorative circle */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full border border-white/40" />

                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-white/30" />

                    {/* =================================================
                        CARD CONTENT
                    ================================================= */}

                    <div className="relative flex h-full flex-col justify-between">
                      {/* Top */}
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-medium tracking-[0.12em] text-[#607970]">
                          {service.id}
                        </span>

                        <div className="rounded-full border border-white/60 bg-white/25 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#557169] backdrop-blur-sm">
                          Healthcare
                        </div>
                      </div>

                      {/* Bottom */}
                      <div>
                        <h2 className="max-w-[360px] text-[32px] font-medium leading-[1.04] tracking-[-0.035em] sm:text-[36px]">
                          {service.title}
                        </h2>

                        <p className="mt-4 max-w-[380px] text-sm leading-6 text-[#5c7069]">
                          {service.description}
                        </p>

                        <div className="mt-6 flex items-center justify-between">
                          <span className="text-sm font-medium text-[#203b34]">
                            Discover
                          </span>

                          <button
                            type="button"
                            aria-label={`Discover ${service.title}`}
                            className="
                              flex
                              h-11
                              w-11
                              items-center
                              justify-center
                              rounded-full
                              bg-[#102d26]
                              text-white
                              transition-all
                              duration-300
                              group-hover:rotate-45
                              group-hover:bg-[#173e34]
                            "
                          >
                            <ArrowUpRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                {/* Right breathing space */}
                <div className="w-5 shrink-0 lg:w-[max(2rem,calc((100vw-1280px)/2))]" />
              </div>
            </div>

            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="mx-auto mt-7 flex max-w-[1280px] items-center justify-between px-5 sm:px-6 lg:px-8">
              {/* Counter */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-medium text-[#526d65]">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>

                <div className="relative h-[2px] w-24 overflow-hidden bg-[#c1d0ca] sm:w-40">
                  <div
                    className="absolute left-0 top-0 h-full bg-[#183d34] transition-all duration-150"
                    style={{
                      width: `${
                        ((activeIndex + 1) /
                          services.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <span className="font-mono text-xs text-[#82938e]">
                  {String(services.length).padStart(2, "0")}
                </span>
              </div>

              {/* Dots */}
              <div className="hidden items-center gap-1.5 sm:flex">
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
                          ? "w-8 bg-[#183d34]"
                          : "w-1.5 bg-[#aebfba] hover:bg-[#728b83]"
                      }
                    `}
                  />
                ))}
              </div>

              <span className="hidden text-[10px] uppercase tracking-[0.2em] text-[#72847e] sm:block">
                Scroll to explore
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          NEXT SECTION

          This cannot be reached until the horizontal
          animation has completed.
      ====================================================== */}

      <section className="bg-[#102d26] px-5 py-28 text-white sm:px-8">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Continue exploring
          </p>

          <h2 className="mt-5 max-w-[800px] text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-6xl">
            Healthcare that keeps you connected to the care you need.
          </h2>
        </div>
      </section>
    </main>
  );
};

export default DiagnosticsPage;