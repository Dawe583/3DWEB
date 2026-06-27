import { useEffect, useRef } from "react";

/**
 * Adds .visible to elements with .reveal / .reveal-left / .reveal-right / .reveal-scale
 * inside the given container ref when they enter the viewport.
 */
export function useReveal(rootMargin = "-80px") {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const targets = container.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold: 0.05 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rootMargin]);

  return ref;
}

/**
 * Simple parallax on scroll — moves element by factor of scroll position.
 * factor: positive = moves up slower, negative = moves down slower
 */
export function useParallax(factor = 0.15) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${centerY * factor}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor]);

  return ref;
}