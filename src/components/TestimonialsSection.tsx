import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTilt } from "../hooks/useTilt";
import ScrambleText from "./ScrambleText";
import SectionHeading from "./SectionHeading";
import SpotlightCard from "./SpotlightCard";
import VelocityMarquee from "./VelocityMarquee";
import TextReveal from "./TextReveal";

const testimonials = [
  {
    quote:
      "Za tři týdny jsme měli nový web i automatizaci dotazů. Poptávky vzrostly tak, že jsme museli přibrat člověka.",
    name: "Markéta Dvořáková",
    role: "majitelka, Forma Studio",
  },
  {
    quote:
      "Konečně tým, který nemluví o pixelech, ale o číslech. Návratnost investice byla vidět už první měsíc.",
    name: "Tomáš Beneš",
    role: "CEO, Nova Shop",
  },
];

function TestimonialCard({
  t,
  index,
}: {
  t: (typeof testimonials)[number];
  index: number;
}) {
  const tilt = useTilt(6);

  return (
    <motion.div
      ref={tilt}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
    >
      <SpotlightCard className="liquid-glass rounded-3xl p-8 md:p-10 flex flex-col h-full">
        <Quote className="w-8 h-8 text-indigo-300/60 mb-6" />
        <p className="text-lg md:text-xl text-white/80 leading-relaxed flex-1">
          „<TextReveal text={t.quote} stagger={14} />"
        </p>
        <div className="mt-8 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400/40 to-purple-400/40 flex items-center justify-center text-sm font-medium text-white/80">
            {t.name.split(" ").map((w) => w[0]).join("")}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{t.name}</p>
            <p className="text-white/40 text-xs">{t.role}</p>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="reference" className="relative overflow-hidden py-28 md:py-40 px-6">
      <div className="relative max-w-6xl mx-auto">
        <SectionHeading eyebrow="Reference" className="max-w-2xl">
          <ScrambleText text="Co říkají" />{" "}
          <span className="instrument italic accent-gradient-text">
            <ScrambleText text="klienti." />
          </span>
        </SectionHeading>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>

      <div className="mt-20 border-y border-white/5 py-6 text-4xl md:text-6xl text-white/[0.16]">
        <VelocityMarquee text="REFERENCE —" baseVelocity={-2.4} />
      </div>
    </section>
  );
}
