import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";

interface VelocityMarqueeProps {
  text: string;
  baseVelocity?: number;
  className?: string;
}

/**
 * Scroll-velocity marquee — text drifts continuously, then accelerates and
 * reverses direction in response to scroll speed/direction. The classic
 * awwwards "the page itself feels alive" signature, built on framer-motion's
 * scroll-velocity primitives (no external template, just the library already
 * in this project).
 *
 * This keeps drifting even under prefers-reduced-motion — a slow constant
 * marquee isn't the kind of motion that rule is meant to suppress (no
 * flashing, no scroll-reactive acceleration), and a frozen "live" text band
 * reads as broken rather than calm.
 */
export default function VelocityMarquee({
  text,
  baseVelocity = 2,
  className = "",
}: VelocityMarqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-6, 0, 6], {
    clamp: false,
  });

  const directionRef = useRef(1);
  const [paused, setPaused] = useState(false);

  const x = useTransform(baseX, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (paused) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let moveBy = directionRef.current * baseVelocity * (delta / 1000);

    if (!reduced) {
      // Scroll-reactive acceleration/reversal — skipped under reduced motion
      // so the band stays a single calm, predictable speed.
      const vf = velocityFactor.get();
      if (vf < 0) directionRef.current = -1;
      else if (vf > 0) directionRef.current = 1;
      moveBy += directionRef.current * moveBy * Math.abs(vf);
    }

    baseX.set(baseX.get() + moveBy);
    // Wrap so the duplicated text never visibly resets.
    if (baseX.get() <= -100) baseX.set(0);
    if (baseX.get() > 0) baseX.set(-100);
  });

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div style={{ x }} className="flex w-max">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="instrument italic mr-12 select-none"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
