import { motion } from "framer-motion";
import { MessageSquare, PenTool, Code2, Rocket } from "lucide-react";
import ScrambleText from "./ScrambleText";
import SectionHeading from "./SectionHeading";
import SpotlightCard from "./SpotlightCard";
import VelocityMarquee from "./VelocityMarquee";

const steps = [
  {
    icon: MessageSquare,
    title: "Konzultace",
    text: "Probereme cíle, cílovku a čísla. Z toho vznikne jasné zadání — žádné dohady.",
  },
  {
    icon: PenTool,
    title: "Návrh",
    text: "Wireframe a vizuální koncept. Uvidíte směr dřív, než padne jediná řádka kódu.",
  },
  {
    icon: Code2,
    title: "Vývoj",
    text: "Stavíme web i automatizace. Rychle, čistě a s důrazem na konverzi.",
  },
  {
    icon: Rocket,
    title: "Spuštění",
    text: "Nasadíme, změříme a ladíme. Předáváme stroj, který reálně přivádí zákazníky.",
  },
];

export default function ProcessSection() {
  return (
    <section id="proces" className="relative overflow-hidden py-28 md:py-40 px-6">
      <div className="section-glow-line max-w-6xl mx-auto mb-20" />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeading eyebrow="Jak to probíhá" className="max-w-2xl">
          <ScrambleText text="Od nápadu" />{" "}
          <span className="instrument italic accent-gradient-text">
            <ScrambleText text="ke spuštění." />
          </span>
        </SectionHeading>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connective line behind the cards on desktop */}
          <div className="hidden lg:block absolute top-[58px] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative"
              >
                <SpotlightCard className="liquid-glass rounded-3xl p-6 h-full">
                  {/* Step number badge */}
                  <div className="liquid-glass rounded-2xl w-14 h-14 flex items-center justify-center mb-6 relative z-10">
                    <Icon className="w-5 h-5 text-indigo-300" />
                    <span className="absolute -top-2 -right-2 text-[10px] font-medium text-white/70 liquid-glass rounded-full w-6 h-6 flex items-center justify-center">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl text-white mb-3 tracking-tight">{step.title}</h3>
                  <p className="body-text text-sm">{step.text}</p>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-20 border-y border-white/5 py-6 text-4xl md:text-6xl text-white/[0.16]">
        <VelocityMarquee text="JAK TO PROBÍHÁ —" baseVelocity={2.4} />
      </div>
    </section>
  );
}
