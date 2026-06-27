import { useReveal } from "../hooks/useReveal";

const stats = [
  { value: "120+", label: "Webů spuštěno" },
  { value: "3×",   label: "Průměrný růst leadů" },
  { value: "48h",  label: "Rychlost dodání MVP" },
];

export default function AboutSection() {
  const ref = useReveal("-60px") as React.RefObject<HTMLElement>;

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative overflow-hidden bg-black pt-32 md:pt-44 pb-20 md:pb-28 px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.06)_0%,_transparent_70%)] pointer-events-none" />
      <div className="section-glow-line absolute top-0 left-0 right-0" />

      <div className="relative max-w-6xl mx-auto">

        <p className="reveal uppercase tracking-[0.25em] text-sm text-white/40">
          O nás
        </p>

        <h2 className="reveal delay-1 mt-8 text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white">
          Stavíme digitální{" "}
          <span className="instrument italic text-white/50">přítomnost</span>
          <br className="hidden md:block" />
          která{" "}
          <span className="instrument italic accent-gradient-text">
            prodává sama.
          </span>
        </h2>

        <p className="reveal delay-2 mt-8 max-w-2xl text-white/50 text-lg leading-relaxed">
          SiteSpot kombinuje precizní webdesign, AI automatizace a cílené
          generování leadů do jednoho ekosystému. Neprodáváme jen weby —
          budujeme stroje na růst.
        </p>

        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`reveal-scale delay-${i + 2} liquid-glass rounded-2xl p-6`}
            >
              <p className="text-3xl md:text-4xl font-light accent-gradient-text">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-white/40 uppercase tracking-[0.15em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}