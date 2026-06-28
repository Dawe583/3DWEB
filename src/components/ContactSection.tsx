import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useMagnetic } from "../hooks/useMagnetic";
import ScrambleText from "./ScrambleText";

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
    <section id="contact" className="relative overflow-hidden bg-black py-28 md:py-40 px-6">

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.08)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="uppercase tracking-[0.25em] text-sm text-white/40 mb-6"
        >
          Kontakt
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl tracking-tight text-white mb-6"
        >
          <ScrambleText text="Začněme" />{" "}
          <span className="instrument italic accent-gradient-text">
            <ScrambleText text="společně" />
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/50 text-lg leading-relaxed mb-12"
        >
          Pošlete nám email nebo nám nechte kontakt — ozveme se do 24 hodin
          s konkrétním návrhem pro váš byznys.
        </motion.p>

        {!sent ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-4 max-w-lg mx-auto"
          >
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
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="liquid-glass rounded-3xl p-10 max-w-lg mx-auto"
          >
            <p className="text-2xl text-white mb-3">✓ Odesláno</p>
            <p className="text-white/50">
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