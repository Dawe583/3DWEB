import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import ScrambleText from "../components/ScrambleText";
import TemplateCarousel from "../components/TemplateCarousel";
import { useMagnetic } from "../hooks/useMagnetic";
import { TEMPLATES } from "../lib/templates";

export default function Templates() {
  const ctaMagnetic = useMagnetic(0.25);

  return (
    <main className="bg-black min-h-screen">
      <nav className="px-6 py-6 relative z-30">
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

      <section className="px-6 pt-12 md:pt-16 text-center">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            eyebrow="Šablony"
            align="center"
            subtitle="Scrollujte a procházejte naše šablony ve 3D — kliknutím na přední kartu otevřete detail. Každou přizpůsobíme přesně vašemu byznysu."
          >
            <ScrambleText text="Hotové weby," />{" "}
            <span className="instrument italic accent-gradient-text">
              <ScrambleText text="na míru." />
            </span>
          </SectionHeading>
        </div>
      </section>

      {/* 3D template carousel — pinned, scroll-driven */}
      <TemplateCarousel templates={TEMPLATES} />

      {/* Closing CTA band (replaces the marquee) */}
      <section className="px-6 pb-24 md:pb-32 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto liquid-glass rounded-3xl p-10 md:p-16 text-center overflow-hidden"
        >
          <div className="pointer-events-none absolute -inset-32 bg-[radial-gradient(circle,_rgba(168,85,247,0.16)_0%,_transparent_60%)] animate-[spin_18s_linear_infinite]" />
          <div className="relative">
            <h2 className="h-section">
              Nenašli jste tu <span className="instrument italic text-white/40">svou?</span>
            </h2>
            <p className="mt-4 body-text max-w-md mx-auto">
              Postavíme web přesně na míru vašemu byznysu — od nuly nebo na základě
              kterékoliv šablony.
            </p>
            <a
              ref={ctaMagnetic as React.RefObject<HTMLAnchorElement>}
              href="/#contact"
              data-cursor-hover
              className="mt-8 liquid-glass rounded-full px-8 py-3 text-sm inline-flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              Začít projekt <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
