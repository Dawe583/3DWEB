import { motion } from "framer-motion";
import { MessageSquare, PenTool, Code2, Rocket } from "lucide-react";
import { DUR, EASE_OUT, inViewOnce } from "../lib/motion";
import ScrambleText from "./ScrambleText";
import SectionHeading from "./SectionHeading";
import SpotlightCard from "./SpotlightCard";
import VelocityMarquee from "./VelocityMarquee";
import HlsVideo from "./HlsVideo";
import { VIDEOS } from "../data/videos";

const steps = [
  {
    icon: MessageSquare,
    title: "Konzultace",
    text: "Probereme cíle, cílovku a čísla. Z toho vznikne jasné zadání — žádné dohady.",
    video: VIDEOS.cardA,
  },
  {
    icon: PenTool,
    title: "Návrh",
    text: "Wireframe a vizuální koncept. Uvidíte směr dřív, než padne jediná řádka kódu.",
    video: VIDEOS.cardB,
  },
  {
    icon: Code2,
    title: "Vývoj",
    text: "Stavíme web i automatizace. Rychle, čistě a s důrazem na konverzi.",
    video: VIDEOS.cardC,
  },
  {
    icon: Rocket,
    title: "Spuštění",
    text: "Nasadíme, změříme a ladíme. Předáváme stroj, který reálně přivádí zákazníky.",
    video: null,
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

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewOnce}
                transition={{ duration: DUR.base, ease: EASE_OUT, delay: i * 0.12 }}
                className="relative"
              >
                <SpotlightCard className="liquid-glass rounded-3xl overflow-hidden h-full flex flex-col">
                  {step.video ? (
                    <div className="relative aspect-video overflow-hidden">
                      <HlsVideo
                        src={step.video}
                        className="h-full w-full object-cover"
                        muted autoPlay loop playsInline preload="metadata"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute top-4 left-4 liquid-glass rounded-2xl w-11 h-11 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-indigo-300" />
                      </div>
                      <span className="absolute top-4 right-4 text-[10px] font-medium text-white/70 liquid-glass rounded-full w-6 h-6 flex items-center justify-center">
                        0{i + 1}
                      </span>
                    </div>
                  ) : (
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent flex items-center justify-center">
                      <div className="liquid-glass rounded-2xl w-14 h-14 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-indigo-300" />
                      </div>
                      <span className="absolute top-4 right-4 text-[10px] font-medium text-white/70 liquid-glass rounded-full w-6 h-6 flex items-center justify-center">
                        0{i + 1}
                      </span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl text-white mb-3 tracking-tight">{step.title}</h3>
                    <p className="body-text text-sm">{step.text}</p>
                  </div>
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
