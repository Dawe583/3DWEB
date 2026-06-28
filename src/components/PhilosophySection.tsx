import { motion } from "framer-motion";
import { useReveal, useParallax } from "../hooks/useReveal";
import { useMagnetic } from "../hooks/useMagnetic";
import ScrambleText from "./ScrambleText";

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4";

const pillars = [
  {
    label: "Rychlost",
    text: "MVP web do 48 hodin. Plná platforma do 2 týdnů. Protože příležitosti nečekají.",
  },
  {
    label: "Měřitelnost",
    text: "Každé rozhodnutí podložené daty. Sledujeme konverze, ne jen návštěvy.",
  },
  {
    label: "Škálovatelnost",
    text: "Systémy navrhujeme tak, aby rostly s vámi — bez přestavby od základu.",
  },
];

export default function PhilosophySection() {
  const sectionRef = useReveal("-60px") as React.RefObject<HTMLElement>;
  const videoRef = useParallax(0.08) as React.RefObject<HTMLElement>;
  const ctaMagnetic = useMagnetic(0.3);

  return (
    <section
      id="philosophy"
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="bg-black py-28 md:py-40 px-6 overflow-hidden"
    >
      <div className="section-glow-line max-w-6xl mx-auto mb-20" />
      <div className="max-w-6xl mx-auto">

        <div className="reveal mb-16 md:mb-24">
          <p className="uppercase tracking-[0.25em] text-sm text-white/40 mb-6">
            Filosofie
          </p>
          <h2 className="text-5xl md:text-7xl lg:text-8xl tracking-tight text-white">
            <ScrambleText text="Technologie" />{" "}
            <span className="instrument italic text-white/30">×</span>{" "}
            <span className="accent-gradient-text">
              <ScrambleText text="Výsledky" />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* LEFT — video with parallax */}
          <div
            ref={videoRef as React.RefObject<HTMLDivElement>}
            className="reveal-left overflow-hidden rounded-3xl aspect-[4/3] parallax-slow sticky top-24"
          >
            <video
              className="w-full h-full object-cover"
              muted autoPlay loop playsInline preload="auto"
            >
              <source src={VIDEO} />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* RIGHT — pillars */}
          <div className="flex flex-col gap-0">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.label}
                className={`reveal-right delay-${i + 1} py-8 border-b border-white/10 group cursor-default`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="uppercase tracking-[0.2em] text-xs text-white/40 mb-3">
                      0{i + 1}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-light text-white mb-3 group-hover:text-indigo-300 transition-colors duration-500">
                      {pillar.label}
                    </h3>
                    <p className="text-white/50 leading-relaxed">
                      {pillar.text}
                    </p>
                  </div>
                  <div className="liquid-glass rounded-full w-10 h-10 flex items-center justify-center shrink-0 mt-1 group-hover:bg-indigo-500/10 transition-colors duration-500">
                    <span className="text-white/60 text-lg group-hover:text-indigo-300 transition-colors duration-500">→</span>
                  </div>
                </div>
              </div>
            ))}

            <motion.a
              ref={ctaMagnetic as React.RefObject<HTMLAnchorElement>}
              data-cursor-hover
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileTap={{ scale: 0.98 }}
              className="mt-10 liquid-glass rounded-full px-8 py-4 text-sm w-fit flex items-center gap-3 hover:bg-white/5 transition-colors"
            >
              Chci to taky
              <span className="accent-gradient-text font-medium">→</span>
            </motion.a>
          </div>

        </div>
      </div>
    </section>
  );
}