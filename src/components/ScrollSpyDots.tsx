import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "about", label: "O nás" },
  { id: "services", label: "Služby" },
  { id: "case-studies", label: "Case studies" },
  { id: "reference", label: "Reference" },
  { id: "philosophy", label: "Filosofie" },
  { id: "proces", label: "Jak to probíhá" },
  { id: "contact", label: "Kontakt" },
];

/**
 * Right-edge section navigator — a vertical row of dots that tracks which
 * titled section is in view and lets the user jump between them. The active
 * dot stretches into a pill and reveals its label, so the page always tells
 * you where you are. Desktop-only (fine pointers); never overlaps the bottom
 * sound toggle since it's vertically centred.
 */
export default function ScrollSpyDots() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const targets = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the viewport centre that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Sekce stránky"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            data-cursor-hover
            aria-label={s.label}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center justify-end gap-3"
          >
            <span
              className={`text-[11px] uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "opacity-100 text-white translate-x-0"
                  : "opacity-0 group-hover:opacity-70 text-white/70 translate-x-1 group-hover:translate-x-0"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "w-2.5 h-2.5 bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]"
                  : "w-1.5 h-1.5 bg-white/25 group-hover:bg-white/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
