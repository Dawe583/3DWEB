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
import ScrollZoomSection from "./ScrollZoomSection";
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

export type ServiceChart = {
  title: string;
  unit: string;
  bars: { label: string; value: number }[];
  ring: { percent: number; label: string };
};

export type ServiceProcessStep = {
  title: string;
  text: string;
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
  chart?: ServiceChart;
  process?: ServiceProcessStep[];
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

/** Horizontal bars — pure CSS, no chart library. Each bar is sized to its
 *  share of the largest value. Rendered statically so it's always visible;
 *  the entrance fade is handled by the `.reveal` wrapper around the card,
 *  which is reduced-motion-safe (see index.css). The fill keeps a CSS
 *  transition so it still eases in for users who allow motion. */
function BarChart({ chart }: { chart: ServiceChart }) {
  const max = Math.max(...chart.bars.map((b) => b.value));
  return (
    <div>
      <h3 className="text-xl tracking-tight text-white mb-6">{chart.title}</h3>
      <div className="flex flex-col gap-4">
        {chart.bars.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-white/70">{b.label}</span>
              <span className="text-white/40 tabular-nums">
                {b.value} {chart.unit}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(b.value / max) * 100}%`,
                  background: "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** SVG ring filled to a percentage. Static (always visible); revealed by the
 *  `.reveal` wrapper around the card. */
function StatRing({ percent, label }: { percent: number; label: string }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <svg viewBox="0 0 120 120" className="w-40 h-40 -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - percent / 100)}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent-1)" />
              <stop offset="100%" stopColor="var(--accent-2)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-light accent-gradient-text">{percent}%</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-white/50 max-w-[12rem]">{label}</p>
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
  chart,
  process,
}: ServiceLandingPageProps) {
  const heroCta = useMagnetic(0.25);
  const navCta = useMagnetic(0.25);
  const ctaGlow = useMagnetic(0.15);
  const revealRef = useReveal();
  const statsRevealRef = useReveal();
  const resultsRef = useReveal();
  const processRef = useReveal();

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
            preload="metadata"
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

      {/* ── SCROLL-ZOOM EFFECT — same signature transition as the homepage ── */}
      <ScrollZoomSection
        mediaSrc={heroVideo}
        leftText={title}
        rightText={titleAccent}
        ctaText={ctaLabel}
        ctaHref="/#contact"
      />

      {/* ── RESULTS — lightweight static charts (no chart library), faded in
          via the reduced-motion-safe .reveal mechanism ── */}
      {chart && (
        <section ref={resultsRef as React.RefObject<HTMLElement>} className="px-6 py-24 md:py-28">
          <div className="max-w-6xl mx-auto">
            <p className="eyebrow mb-10">Výsledky</p>
            <div className="reveal liquid-glass rounded-3xl p-8 md:p-12 grid md:grid-cols-[1.5fr_1fr] gap-12 md:gap-16 items-center">
              <BarChart chart={chart} />
              <StatRing percent={chart.ring.percent} label={chart.ring.label} />
            </div>
            <p className="mt-6 text-xs text-white/30 text-center md:text-right">
              Ilustrativní hodnoty na základě typických projektů.
            </p>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      {process && (
        <section ref={processRef as React.RefObject<HTMLElement>} className="px-6 pb-24 md:pb-32">
          <div className="max-w-6xl mx-auto">
            <p className="eyebrow mb-10">Jak to funguje</p>
            <div className="grid md:grid-cols-3 gap-6">
              {process.map((step, i) => (
                <div
                  key={step.title}
                  className="reveal-scale liquid-glass rounded-3xl p-8"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <span className="instrument italic text-3xl accent-gradient-text leading-none">
                    0{i + 1}
                  </span>
                  <h3 className="text-xl tracking-tight text-white mt-4 mb-3">{step.title}</h3>
                  <p className="body-text text-sm">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
