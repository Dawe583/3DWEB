import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { DUR, EASE_OUT, inViewOnce } from "../lib/motion";
import { useMagnetic } from "../hooks/useMagnetic";
import ScrambleText from "./ScrambleText";
import SectionHeading from "./SectionHeading";
import SpotlightCard from "./SpotlightCard";

// Create a free form at https://formspree.io, then replace this with your
// own endpoint ID (Formspree dashboard → form → "Your Form Endpoint").
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const submitMagnetic = useMagnetic(0.3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
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

        {status !== "sent" ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: DUR.base, ease: EASE_OUT, delay: 0.3 }}
            className="max-w-lg mx-auto"
          >
            <SpotlightCard className="liquid-glass rounded-3xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="liquid-glass rounded-2xl px-6 py-4">
                  <label htmlFor="contact-name" className="sr-only">Vaše jméno</label>
                  <input
                    id="contact-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Vaše jméno"
                    required
                    className="w-full bg-transparent outline-none placeholder:text-white/30 text-white"
                  />
                </div>
                <div className="liquid-glass rounded-2xl px-6 py-4">
                  <label htmlFor="contact-email" className="sr-only">Váš email</label>
                  <input
                    id="contact-email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    placeholder="Váš email"
                    required
                    className="w-full bg-transparent outline-none placeholder:text-white/30 text-white"
                  />
                </div>
                <div className="liquid-glass rounded-2xl px-6 py-4">
                  <label htmlFor="contact-message" className="sr-only">Vaše zpráva</label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="V čem vám můžeme pomoct? (nepovinné)"
                    rows={3}
                    className="w-full bg-transparent outline-none placeholder:text-white/30 text-white resize-none"
                  />
                </div>
                <motion.button
                  ref={submitMagnetic as React.RefObject<HTMLButtonElement>}
                  data-cursor-hover
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === "sending"}
                  className="liquid-glass rounded-2xl px-8 py-4 text-sm font-medium flex items-center justify-center gap-3 hover:bg-white/5 transition-colors disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>Odesílám <Loader2 className="w-4 h-4 animate-spin" /></>
                  ) : (
                    <>Odeslat <ArrowRight className="w-4 h-4" /></>
                  )}
                </motion.button>
                {status === "error" && (
                  <p className="text-sm text-red-400">
                    Něco se nepovedlo. Zkuste to znovu, nebo nám napište přímo na e-mail níže.
                  </p>
                )}
              </form>
            </SpotlightCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DUR.fast, ease: EASE_OUT }}
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
          viewport={inViewOnce}
          transition={{ duration: DUR.base, ease: EASE_OUT, delay: 0.5 }}
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
