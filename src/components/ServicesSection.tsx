import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, Bot, Target } from "lucide-react";
import ScrambleText from "./ScrambleText";
import { useMagnetic } from "../hooks/useMagnetic";

const services = [
  {
    tag: "Webdesign",
    icon: Globe,
    title: "Weby které konvertují",
    description:
      "Navrhujeme a stavíme weby na míru — od landing pages po komplexní platformy. Každý pixel slouží jednomu cíli: proměnit návštěvníka v zákazníka.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
  },
  {
    tag: "AI Automatizace",
    icon: Bot,
    title: "Procesy na autopilotu",
    description:
      "Zapojíme AI do vašeho workflows — od automatického zpracování dotazů přes personalizované e-maily až po inteligentní CRM integrace. Ušetříte hodiny denně.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4",
  },
  {
    tag: "Lead Generation",
    icon: Target,
    title: "Leady které kupují",
    description:
      "Systémy pro cílené získávání kvalifikovaných kontaktů. Kombinujeme SEO, placené kampaně a AI scoring tak, aby k vám přicházeli lidé připravení nakoupit.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4",
  },
];

function ServiceCard({
  service,
  active,
  registerRef,
}: {
  service: (typeof services)[number];
  active: boolean;
  registerRef: (el: HTMLDivElement | null) => void;
}) {
  const Icon = service.icon;
  const magnetic = useMagnetic(0.2);

  return (
    <div
      ref={registerRef}
      className="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[50vw]"
    >
      <motion.div
        animate={{ opacity: active ? 1 : 0.45, scale: active ? 1 : 0.94 }}
        transition={{ duration: 0.4 }}
        className="liquid-glass overflow-hidden rounded-3xl md:grid md:grid-cols-2"
      >
        <div className="relative aspect-video md:aspect-auto md:h-[58vh] overflow-hidden">
          <video
            className="h-full w-full object-cover"
            muted autoPlay loop playsInline preload="auto"
          >
            <source src={service.video} />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
        </div>

        <div className="p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="liquid-glass rounded-full p-2">
                <Icon className="h-4 w-4 text-indigo-300" />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                {service.tag}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl tracking-tight text-white mb-4">
              {service.title}
            </h3>
            <p className="text-white/50 leading-relaxed">{service.description}</p>
          </div>
          <a
            ref={magnetic as React.RefObject<HTMLAnchorElement>}
            href="#contact"
            data-cursor-hover
            className="mt-8 liquid-glass rounded-full px-6 py-3 text-sm w-fit flex items-center gap-2 hover:bg-white/5 transition-colors"
          >
            Zjistit více <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function ServicesSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaMagnetic = useMagnetic(0.3);
  const prevMagnetic = useMagnetic(0.3);
  const nextMagnetic = useMagnetic(0.3);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = cardRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: scroller, threshold: [0.6] }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Let vertical wheel input drive the horizontal carousel while hovering it.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = scroller.scrollLeft <= 0;
      const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
      if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) return;
      e.preventDefault();
      scroller.scrollLeft += e.deltaY;
    };
    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel);
  }, []);

  const scrollToIndex = (i: number) => {
    const card = cardRefs.current[i];
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <section id="services" className="relative overflow-hidden bg-black py-28 md:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.04)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="uppercase tracking-[0.25em] text-sm text-white/40 mb-4">
              Služby
            </p>
            <h2 className="text-4xl md:text-6xl tracking-tight text-white">
              <ScrambleText text="Co pro vás" />{" "}
              <span className="instrument italic text-white/40">
                <ScrambleText text="děláme" />
              </span>
            </h2>
          </div>
          <a
            ref={ctaMagnetic as React.RefObject<HTMLAnchorElement>}
            href="#contact"
            data-cursor-hover
            className="hidden md:flex liquid-glass rounded-full px-6 py-3 text-sm items-center gap-2 hover:bg-white/5 transition-colors"
          >
            Začít projekt <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      {/* Native horizontal scroller — every card is always reachable by scroll, drag or arrows */}
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-[7.5vw] md:px-[20vw] lg:px-[25vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {services.map((service, i) => (
          <ServiceCard
            key={service.title}
            service={service}
            active={activeIndex === i}
            registerRef={(el) => (cardRefs.current[i] = el)}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="relative max-w-6xl mx-auto px-6 mt-10 flex items-center justify-center gap-6">
        <button
          ref={prevMagnetic as React.RefObject<HTMLButtonElement>}
          data-cursor-hover
          onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="liquid-glass rounded-full p-3 disabled:opacity-30 hover:bg-white/5 transition-colors"
          aria-label="Předchozí služba"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center gap-2">
          {services.map((service, i) => (
            <button
              key={service.title}
              onClick={() => scrollToIndex(i)}
              data-cursor-hover
              aria-label={`Zobrazit ${service.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-8 bg-indigo-400" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          ref={nextMagnetic as React.RefObject<HTMLButtonElement>}
          data-cursor-hover
          onClick={() => scrollToIndex(Math.min(services.length - 1, activeIndex + 1))}
          disabled={activeIndex === services.length - 1}
          className="liquid-glass rounded-full p-3 disabled:opacity-30 hover:bg-white/5 transition-colors"
          aria-label="Další služba"
        >
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </section>
  );
}
