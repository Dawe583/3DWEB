import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "../hooks/useReveal";

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4";

export default function FeaturedVideoSection() {
  const sectionRef = useReveal("-40px") as React.RefObject<HTMLElement>;

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">

        <div className="reveal-scale overflow-hidden rounded-3xl aspect-video relative">
          <video
            className="w-full h-full object-cover"
            muted autoPlay loop playsInline preload="metadata"
          >
            <source src={VIDEO} />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08)_0%,_transparent_70%)] pointer-events-none" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between gap-6 md:items-end">

              <div className="reveal liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
                <p className="uppercase tracking-[0.25em] text-xs text-white/50 mb-3">
                  Jak to děláme
                </p>
                <p className="text-white text-sm md:text-base leading-relaxed">
                  Každý projekt začíná analýzou vašeho byznysu.
                  Pak navrhneme řešení přesně na míru — žádné šablony,
                  žádné zkopírované vzory. Jen to, co funguje pro vás.
                </p>
              </div>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="liquid-glass rounded-full px-8 py-3 text-sm font-medium text-white w-fit flex items-center gap-2 hover:bg-white/5 transition-colors"
              >
                Spustit projekt <ArrowUpRight className="w-4 h-4" />
              </motion.a>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}