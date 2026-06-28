import { motion } from "framer-motion";
import { EASE_OUT, inViewOnce } from "../lib/motion";

/**
 * Connective tissue between sections that don't get a full ScrollZoomSection.
 * As the seam scrolls in: a vertical light beam grows down from above, a soft
 * radial bloom pulses behind it, and a horizontal accent line draws itself —
 * so no two sections ever meet as a hard black cut. Shares the global easing
 * token so its rhythm matches every other entrance on the site.
 */
export default function SectionBridge() {
  return (
    <div className="relative h-28 md:h-40 flex items-center justify-center overflow-hidden">
      {/* Radial bloom */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={inViewOnce}
        transition={{ duration: 1.4, ease: EASE_OUT }}
        className="absolute w-48 h-48 md:w-72 md:h-72 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.20)_0%,transparent_70%)] blur-xl pointer-events-none"
      />

      {/* Vertical beam descending into the next section */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={inViewOnce}
        transition={{ duration: 1.1, ease: EASE_OUT }}
        style={{ originY: 0 }}
        className="absolute top-0 h-1/2 w-px bg-gradient-to-b from-transparent via-indigo-400/40 to-indigo-400/70 pointer-events-none"
      />

      {/* Horizontal accent line + a travelling glint */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={inViewOnce}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}
        className="relative h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent overflow-visible"
      >
        <motion.span
          initial={{ x: "-50%", opacity: 0 }}
          whileInView={{ x: "150%", opacity: [0, 1, 0] }}
          viewport={inViewOnce}
          transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.3 }}
          className="absolute top-1/2 -translate-y-1/2 left-0 w-24 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
        />
      </motion.div>
    </div>
  );
}
