import { useEffect, useRef, useState } from "react";
import { useReveal } from "../hooks/useReveal";

interface CounterProps {
  value: string;
  className?: string;
  duration?: number;
}

/**
 * Animates a numeric prefix of `value` (e.g. "120+", "3×", "48h") counting up
 * from 0 once it scrolls into view, keeping any non-numeric suffix static.
 */
export default function Counter({ value, className, duration = 1400 }: CounterProps) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : value;

  const [display, setDisplay] = useState(target === null ? value : `0${suffix}`);
  const containerRef = useRef<HTMLSpanElement>(null);
  const revealRef = useReveal("-80px") as React.RefObject<HTMLElement>;
  const started = useRef(false);

  useEffect(() => {
    if (target === null) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const animate = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const current = target * progress;
              const formatted = target % 1 === 0 ? Math.round(current) : current.toFixed(1);
              setDisplay(`${formatted}${suffix}`);
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, duration]);

  void revealRef;

  return (
    <span ref={containerRef} className={className}>
      {display}
    </span>
  );
}
