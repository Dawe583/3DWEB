import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUpRight, type LucideIcon } from "lucide-react";
import ScrambleText from "./ScrambleText";
import TextReveal from "./TextReveal";
import SpotlightCard from "./SpotlightCard";
import VelocityMarquee from "./VelocityMarquee";
import Counter from "./Counter";
import Footer from "./Footer";
import { useMagnetic } from "../hooks/useMagnetic";
import { useReveal } from "../hooks/useReveal";
import { useTilt } from "../hooks/useTilt";

export type ServiceFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type ServiceStat = {
  value: string;
  label: string;
};

type ServiceLandingPageProps = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  tagline: string;
  heroVideo: string;
  features: ServiceFeature[];
  stats: ServiceStat[];
  ctaLabel: string;
};

function FeatureCard({ feature, index }: { feature: ServiceFeature; index: number }) {
  const Icon = feature.icon;
  const tilt = useTilt(6);

  return (
    <div
      ref={tilt}
      className="reveal-scale"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <SpotlightCard className="liquid-glass rounded-3xl p-8 h-full">
        <div className="flex items-start justify-between mb-6">
          <div className="liquid-glass rounded-full p-3 w-fit">
            <Icon className="h-5 w-5 text-indigo-300" />
          </div>
          <span className="instrument italic text-3xl text-white/10 leading-none">
            0{index + 1}
          </span>
        </div>
        <h3 className="text-xl tracking-tight text-white mb-3">{feature.title}</h3>
        <p className="body-text">
          <TextReveal text={feature.description} stagger={18} />
        </p>
      </SpotlightCard>
    </div>
  );
}

export default function ServiceLandingPage({
  eyebrow,
  title,
  titleAccent,
  tagline,
  heroVideo,
  features,
  stats,
  ctaLabel,
}: ServiceLandingPageProps) {
  const heroCta = useMagnetic(0.25);
  const navCta = useMagnetic(0.25);
  const ctaGlow = useMagnetic(0.15);
  const revealRef = useReveal();
  const statsRevealRef = useReveal();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useSpring(useTransform(heroProgress, [0, 1], [1, 1.25]), {
    stiffness: 100,
    damping: 30,
  });
  const heroFade = useTransform(heroProgress, [0, 0.8], [0.55, 1]);

  return (
    <main className="min-h-screen">
      {/* ── NAV ── */}
      <nav className="px-6 py-6 relative z-20">
        <div className="max-w-5xl mx-auto liquid-glass rounded-full px-6 py-3 flex items-center justify-between">
          <Link to="/" data-cursor-hover className="flex items-center" aria-label="Domů">
            <span className="font-semibold tracking-wide">SiteSpot</span>
          </Link>
          <Link
            to="/"
            data-cursor-hover
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Zpět domů
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative h-[85vh] min-h-[560px] flex items-center justify-center overflow-hidden"
      >
        <motion.div className="absolute inset-0" style={{ scale: heroScale, opacity: heroFade }}>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            muted
            autoPlay
            loop
            playsInline
            preload="none"
          >
            <source src={heroVideo} />
          </video>
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.18)_0%,_transparent_65%)]" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <p className="eyebrow mb-6 glitch-in" data-text={eyebrow}>
            {eyebrow}
          </p>
          <h1 className="instrument text-5xl md:text-7xl lg:text-8xl tracking-tight">
            <ScrambleText text={title} duration={1400} />{" "}
            <em className="italic accent-shimmer">
              <ScrambleText text={titleAccent} duration={1400} />
            </em>
          </h1>
          <p className="mt-6 body-text max-w-xl mx-auto text-lg">{tagline}</p>
          <a
            ref={navCta as React.RefObject<HTMLAnchorElement>}
            href="/#contact"
            data-cursor-hover
            className="mt-10 liquid-glass rounded-full px-8 py-3 text-sm inline-flex items-center gap-2 hover:bg-white/5 transition-colors"
          >
            {ctaLabel} <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── VELOCITY MARQUEE — speeds up/reverses with scroll, the page feels alive ── */}
      <div className="border-y border-white/5 py-6 text-4xl md:text-6xl text-white/[0.16]">
        <VelocityMarquee text={`${eyebrow.toUpperCase()} —`} baseVelocity={2.4} />
      </div>

      {/* ── STATS ── */}
      <section ref={statsRevealRef as React.RefObject<HTMLElement>} className="px-6 pt-20 md:pt-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="reveal-scale liquid-glass rounded-2xl p-6 text-center"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Counter
                value={stat.value}
                className="text-4xl md:text-5xl font-light accent-gradient-text block"
              />
              <p className="mt-2 text-xs text-white/40 uppercase tracking-[0.15em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={revealRef as React.RefObject<HTMLElement>} className="px-6 py-24 md:py-32">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="px-6 pb-24 md:pb-32">
        <div
          ref={ctaGlow as React.RefObject<HTMLDivElement>}
          className="relative max-w-4xl mx-auto liquid-glass rounded-3xl p-10 md:p-16 text-center overflow-hidden"
        >
          <div className="pointer-events-none absolute -inset-32 bg-[radial-gradient(circle,_rgba(168,85,247,0.18)_0%,_transparent_60%)] animate-[spin_18s_linear_infinite]" />
          <div className="relative">
            <h2 className="h-section">
              Pojďme na to <span className="instrument italic text-white/40">spolu</span>
            </h2>
            <p className="mt-4 body-text max-w-md mx-auto">
              Napište nám a do 48 hodin se ozveme s prvním návrhem řešení.
            </p>
            <a
              ref={heroCta as React.RefObject<HTMLAnchorElement>}
              href="/#contact"
              data-cursor-hover
              className="mt-8 liquid-glass rounded-full px-8 py-3 text-sm inline-flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              Kontaktovat nás <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
