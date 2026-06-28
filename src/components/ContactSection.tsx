import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useMagnetic } from "../hooks/useMagnetic";
import ScrambleText from "./ScrambleText";
import SectionHeading from "./SectionHeading";
import SpotlightCard from "./SpotlightCard";

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const submitMagnetic = useMagnetic(0.3);

  const handleSubmit = () => {
    if (!email) return;
    setSent(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40 px-6">

      <div className="relative max-w-3xl mx-auto text-center">

        <SectionHeading
          eyebrow="Kontakt"
          align="center"
          className="mb-12"
          subtitle="Pošlete nám email nebo nám nechte kontakt — ozveme se do 24 hodin s konkrétním návrhem pro váš byznys."
        >
          <ScrambleText text="Začněme" />{" "}
          <span className="instrument italic accent-gradient-text">
            <ScrambleText text="společně" />
          </span>
        </SectionHeading>

        {!sent ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-lg mx-auto"
          >
            <SpotlightCard className="liquid-glass rounded-3xl p-6 md:p-8 flex flex-col gap-4">
              <div className="liquid-glass rounded-2xl px-6 py-4">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Vaše jméno"
                  className="w-full bg-transparent outline-none placeholder:text-white/30 text-white"
                />
              </div>
              <div className="liquid-glass rounded-2xl px-6 py-4">
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  placeholder="Váš email"
                  className="w-full bg-transparent outline-none placeholder:text-white/30 text-white"
                />
              </div>
              <motion.button
                ref={submitMagnetic as React.RefObject<HTMLButtonElement>}
                data-cursor-hover
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="liquid-glass rounded-2xl px-8 py-4 text-sm font-medium flex items-center justify-center gap-3 hover:bg-white/5 transition-colors"
              >
                Odeslat <ArrowRight className="w-4 h-4" />
              </motion.button>
            </SpotlightCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="liquid-glass rounded-3xl p-10 max-w-lg mx-auto"
          >
            <p className="text-2xl text-white mb-3">✓ Odesláno</p>
            <p className="text-white/70">
              Díky, {name || "příteli"}! Ozveme se do 24 hodin.
            </p>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-sm text-white/30"
        >
          Nebo napište přímo na{" "}
          <a
            href="mailto:hello@sitespot.cz"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            hello@sitespot.cz
          </a>
        </motion.p>

      </div>
    </section>
  );
}