import type { Variants } from "framer-motion";

/**
 * Single source of truth for motion across the site so every section shares
 * the same rhythm — easing curve, durations, and the standard "rise into view"
 * entrance. Tweak it here and the whole site re-tunes together.
 */

// Expressive ease-out (matches --ease-out-expo in index.css).
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
// Snappier in/out for wipes and curtains.
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

export const DUR = {
  fast: 0.4,
  base: 0.7,
  slow: 1,
} as const;

/** Container that staggers its direct children's entrances. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

/** Standard element entrance: fades + rises into place. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

/** Underline / divider that draws itself in from the left. */
export const drawLine: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  show: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
};

/** Shared viewport config so reveal thresholds match everywhere. */
export const inViewOnce = { once: true, margin: "-80px" } as const;
