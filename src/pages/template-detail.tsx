import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Layout, Smartphone, Gauge, Plug } from "lucide-react";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import SpotlightCard from "../components/SpotlightCard";
import VelocityMarquee from "../components/VelocityMarquee";
import { useMagnetic } from "../hooks/useMagnetic";
import { useReveal } from "../hooks/useReveal";
import { useTilt } from "../hooks/useTilt";
import { getTemplate } from "../lib/templates";

const FEATURES = [
  { icon: Layout, title: "Plně přizpůsobitelné", text: "Obsah, barvy i sekce upravíme přesně podle vašeho brandu." },
  { icon: Smartphone, title: "Responzivní design", text: "Bezchybné zobrazení na mobilu, tabletu i desktopu." },
  { icon: Gauge, title: "Rychlé načítání", text: "Optimalizováno pro Core Web Vitals a SEO základ." },
  { icon: Plug, title: "Napojení na nástroje", text: "Formuláře, CRM, platby a analytika připravené k zapojení." },
];

const STATS = [
  { value: "48h", label: "do prvního návrhu" },
  { value: "100%", label: "na míru upravené" },
  { value: "7", label: "sekcí v balíčku" },
];

function FeatureCard({ feature, index }: { feature: (typeof FEATURES)[number]; index: number }) {
  const Icon = feature.icon;
  const tilt = useTilt(6);
  return (
    <div ref={tilt} className="reveal-scale" style={{ transitionDelay: `${index * 90}ms` }}>
      <SpotlightCard className="liquid-glass rounded-3xl p-7 h-full">
        <div className="liquid-glass rounded-full p-3 w-fit mb-5">
          <Icon className="h-5 w-5 text-indigo-300" />
        </div>
        <h3 className="text-lg tracking-tight text-white mb-2">{feature.title}</h3>
        <p className="body-text text-sm">{feature.text}</p>
      </SpotlightCard>
    </div>
  );
}

function titleFromSlug(slug: string | undefined) {
  if (!slug) return "Šablona";
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function TemplateDetail() {
  const { slug } = useParams<{ slug: string }>();
  const template = getTemplate(slug);
  const title = template?.title ?? titleFromSlug(slug);
  const tag = template?.tag ?? "Šablona";
  const description =
    template?.description ??
    "Tato šablona je plně přizpůsobitelná vašemu brandu, obsahu a cílům. Stačí nám napsat a do 48 hodin uvidíte první návrh.";

  const ctaMagnetic = useMagnetic(0.25);
  const revealRef = useReveal();
  const statsRef = useReveal();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.25]), { stiffness: 100, damping: 30 });
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [0.45, 0.9]);

  return (
    <main className="bg-black min-h-screen">
      {/* ── NAV ── */}
      <nav className="px-6 py-6 relative z-20">
        <div className="max-w-5xl mx-auto liquid-glass rounded-full px-6 py-3 flex items-center justify-between">
          <Link to="/" data-cursor-hover className="flex items-center" aria-label="Domů">
            <span className="font-semibold tracking-wide">SiteSpot</span>
          </Link>
          <Link
            to="/weby"
            data-cursor-hover
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Zpět na šablony
          </Link>
        </div>
      </nav>

      {/* ── VIDEO HERO ── */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
        {template && (
          <motion.div className="absolute inset-0" style={{ scale: heroScale, opacity: heroFade }}>
            <video
              src={template.video}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.18)_0%,_transparent_60%)]" />

        <div className="relative z-10 px-6 pb-12 md:pb-16 w-full">
          <div className="max-w-5xl mx-auto">
            <SectionHeading eyebrow={tag} subtitle={description}>
              {title}
            </SectionHeading>
            <a
              ref={ctaMagnetic as React.RefObject<HTMLAnchorElement>}
              href="/#contact"
              data-cursor-hover
              className="mt-8 liquid-glass rounded-full px-8 py-3 text-sm inline-flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              Chci tuto šablonu <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <div className="border-y border-white/5 py-6 text-4xl md:text-6xl text-white/[0.16]">
        <VelocityMarquee text={`${title.toUpperCase()} —`} baseVelocity={-2.4} />
      </div>

      {/* ── STATS ── */}
      <section ref={statsRef as React.RefObject<HTMLElement>} className="px-6 pt-20 md:pt-28">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="reveal-scale liquid-glass rounded-2xl p-6 text-center"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-4xl md:text-5xl font-light accent-gradient-text block">{stat.value}</span>
              <p className="mt-2 text-xs text-white/40 uppercase tracking-[0.15em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={revealRef as React.RefObject<HTMLElement>} className="px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="relative max-w-4xl mx-auto liquid-glass rounded-3xl p-10 md:p-16 text-center overflow-hidden">
          <div className="pointer-events-none absolute -inset-32 bg-[radial-gradient(circle,_rgba(168,85,247,0.18)_0%,_transparent_60%)] animate-[spin_18s_linear_infinite]" />
          <div className="relative">
            <h2 className="h-section">
              Líbí se vám <span className="instrument italic text-white/40">{title}?</span>
            </h2>
            <p className="mt-4 body-text max-w-md mx-auto">
              Napište nám a do 48 hodin uvidíte první návrh upravený na váš byznys.
            </p>
            <a
              href="/#contact"
              data-cursor-hover
              className="mt-8 liquid-glass rounded-full px-8 py-3 text-sm inline-flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              Začít projekt <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
