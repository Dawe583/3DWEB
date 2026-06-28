import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, riseIn, drawLine, inViewOnce } from "../lib/motion";

interface SectionHeadingProps {
  /** Small uppercase label above the title (e.g. "Case studies"). */
  eyebrow: string;
  /** The heading content — usually a couple of ScrambleText spans. */
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Override the title size class (defaults to the shared `h-section`). */
  titleClassName?: string;
  /** Optional supporting line under the title. */
  subtitle?: ReactNode;
}

/**
 * Unified section header used by every titled section so each one enters with
 * the exact same choreography: the eyebrow breathes in, the title rises out of
 * place, an accent underline draws itself, and the subtitle follows — all on
 * the shared motion tokens. One component = one rhythm across the whole site.
 */
export default function SectionHeading({
  eyebrow,
  children,
  align = "left",
  className = "",
  titleClassName = "h-section",
  subtitle,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      className={`${isCenter ? "text-center mx-auto" : ""} ${className}`}
    >
      <motion.p variants={riseIn} className="eyebrow">
        {eyebrow}
      </motion.p>

      <motion.h2 variants={riseIn} className={`mt-5 ${titleClassName}`}>
        {children}
      </motion.h2>

      <motion.div
        variants={drawLine}
        className={`mt-7 h-px w-24 bg-gradient-to-r from-indigo-400/70 to-purple-400/40 ${
          isCenter ? "mx-auto" : ""
        } ${isCenter ? "origin-center" : "origin-left"}`}
      />

      {subtitle && (
        <motion.p
          variants={riseIn}
          className={`mt-6 body-text text-lg ${isCenter ? "max-w-xl mx-auto" : "max-w-xl"}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
