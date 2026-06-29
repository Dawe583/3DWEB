import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, Bot, Target, Megaphone } from "lucide-react";
import { DUR } from "../lib/motion";
import ScrambleText from "./ScrambleText";
import SectionHeading from "./SectionHeading";
import { useMagnetic } from "../hooks/useMagnetic";
import { useTilt } from "../hooks/useTilt";

const services = [
  {
    tag: "Webdesign",
    icon: Globe,
    title: "Weby které konvertují",
    description:
      "Navrhujeme a stavíme weby na míru — od landing pages po komplexní platformy. Každý pixel slouží jednomu cíli: proměnit návštěvníka v zákazníka.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
    href: "#contact",
  },
  {
    tag: "AI Automatizace",
    icon: Bot,
    title: "Procesy na autopilotu",
    description:
      "Zapojíme AI do vašeho workflows — od automatického zpracování dotazů přes personalizované e-maily až po inteligentní CRM integrace. Ušetříte hodiny denně.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4",
    href: "/automatizace",
  },
  {
    tag: "Marketing & Růst",
    icon: Megaphone,
    title: "Zákazníci, kteří kupují",
    description:
      "Placené kampaně, obsah a SEO spojené do jednoho systému, který přivádí kvalifikované zákazníky — měřitelně a opakovaně.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_055001_8e16d972-3b2b-441c-86ad-2901a54682f9.mp4",
    href: "/marketing",
  },
  {
    tag: "Lead Generation",
    icon: Target,
    title: "Leady které kupují",
    description:
      "Systémy pro cílené získávání kvalifikovaných kontaktů. Kombinujeme SEO, placené kampaně a AI scoring tak, aby k vám přicházeli lidé připravení nakoupit.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4",
    href: "#contact",
  },
];

function ServiceCard({
  service,
  active,
}: {
  service: (typeof services)[number];
  active: boolean;
}) {
  const Icon = service.icon;
  const magnetic = useMagnetic(0.2);
  const tilt = useTilt(5);

  return (
    <div ref={tilt} className="shrink-0 w-[85vw] md:w-[60vw] lg:w-[50vw]">
      <motion.div
        animate={{ opacity: active ? 1 : 0.4, scale: active ? 1 : 0.92 }}
        transition={{ duration: DUR.fast }}
        className="liquid-glass overflow-hidden rounded-3xl md:grid md:grid-cols-2"
      >
        <div className="relative aspect-video md:aspect-auto md:h-[58vh] overflow-hidden">
          <video
            className="h-full w-full object-cover"
            muted autoPlay loop playsInline preload="none"
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
            <p className="body-text">{service.description}</p>
          </div>
          {service.href.startsWith("/") ? (
            <Link
              ref={magnetic as React.RefObject<HTMLAnchorElement>}
              to={service.href}
              data-cursor-hover
              className="mt-8 liquid-glass rounded-full px-6 py-3 text-sm w-fit flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              Zjistit více <ArrowUpRight className="w-4 h-4" />
            </Link>
          ) : (
            <a
              ref={magnetic as React.RefObject<HTMLAnchorElement>}
              href={service.href}
              data-cursor-hover
              className="mt-8 liquid-glass rounded-full px-6 py-3 text-sm w-fit flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              Zjistit více <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ctaMagnetic = useMagnetic(0.3);
  const prevMagnetic = useMagnetic(0.3);
  const nextMagnetic = useMagnetic(0.3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // The section is pinned while you scroll past it and the cards translate
  // horizontally in lock-step — so plain vertical scrolling walks through every
  // service, no arrow clicking required.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Measure how far the track must travel (full width minus one viewport).
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setMaxScroll(Math.max(0, track.scrollWidth - track.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);
  const x = useSpring(rawX, { stiffness: 120, damping: 30, mass: 0.5 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActiveIndex(Math.round(p * (services.length - 1)));
  });

  // Arrow / dot navigation drives the page scroll to the matching pin offset.
  const scrollToIndex = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const travel = section.offsetHeight - window.innerHeight;
    const target = section.offsetTop + (i / (services.length - 1)) * travel;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative"
      style={{ height: `${services.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

        {/* Header */}
        <div className="relative max-w-6xl mx-auto w-full px-6 pb-10 md:pb-14">
          <div className="flex items-end justify-between">
            <SectionHeading eyebrow="Služby">
              <ScrambleText text="Co pro vás" />{" "}
              <span className="instrument italic text-white/40">
                <ScrambleText text="děláme" />
              </span>
            </SectionHeading>
            <a
              ref={ctaMagnetic as React.RefObject<HTMLAnchorElement>}
              href="#contact"
              data-cursor-hover
              className="hidden md:flex liquid-glass rounded-full px-6 py-3 text-sm items-center gap-2 hover:bg-white/5 transition-colors"
            >
              Začít projekt <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Horizontal track driven by scroll */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-6 px-[7.5vw] md:px-[20vw] lg:px-[25vw]"
        >
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} active={activeIndex === i} />
          ))}
        </motion.div>

        {/* Controls */}
        <div className="relative max-w-6xl mx-auto w-full px-6 mt-10 flex items-center justify-center gap-6">
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
      </div>
    </section>
  );
}
