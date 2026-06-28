import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide smooth scrolling powered by Lenis. Replaces the old CSS
 * `scroll-behavior: smooth` (which only affected anchor jumps, not the wheel)
 * with inertial, interpolated wheel/touch scrolling — the foundation every
 * scroll-linked effect on the page now rides on.
 *
 * Lenis drives the *real* document scroll, so `window.scrollY`, native `scroll`
 * events and Framer Motion's `useScroll` all keep working unchanged — they just
 * move with eased inertia instead of snapping frame-to-frame.
 *
 * `autoRaf` lets Lenis run its own internal rAF loop (robust against React
 * StrictMode's mount/cleanup double-invoke, which can strand a hand-rolled one),
 * and `anchors` makes in-page links (#about, #services …) animate through the
 * same eased motion instead of jumping instantly.
 *
 * Kept on regardless of reduced-motion: this calm, non-flashing inertial scroll
 * is the same class of motion the site already exempts (see .allow-motion in
 * index.css) and is core to the intended feel. Tune via `lerp` if it ever needs
 * to be gentler.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      autoRaf: true,
      anchors: { offset: 0, duration: 1.2 },
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
