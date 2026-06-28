import { useEffect, useRef } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  /** ms delay between each word's reveal */
  stagger?: number;
}

/**
 * Splits text into words and reveals them word-by-word as the block scrolls
 * into view — each word slides up out of a clipped mask rather than just
 * fading, which reads as much more deliberate on a hero-weight headline.
 */
export default function TextReveal({ text, className = "", stagger = 45 }: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { rootMargin: "-80px", threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <span ref={ref} className={`word-reveal-group ${className}`}>
      {words.map((word, i) => (
        <span className="word-mask" key={`${word}-${i}`}>
          <span style={{ transitionDelay: `${i * stagger}ms` }}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
