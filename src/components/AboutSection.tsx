import { useReveal } from "../hooks/useReveal";
import Counter from "./Counter";
import ScrambleText from "./ScrambleText";
import SectionHeading from "./SectionHeading";
import TextReveal from "./TextReveal";

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
      className="relative overflow-hidden pt-32 md:pt-44 pb-20 md:pb-28 px-6"
    >
      <div className="section-glow-line absolute top-0 left-0 right-0" />

      <div className="relative max-w-6xl mx-auto">

        <SectionHeading eyebrow="O nás">
          <ScrambleText text="Stavíme digitální" />{" "}
          <span className="instrument italic text-white/50">
            <ScrambleText text="přítomnost" />
          </span>
          <br className="hidden md:block" />
          <ScrambleText text="která" />{" "}
          <span className="instrument italic accent-gradient-text">
            <ScrambleText text="prodává sama." />
          </span>
        </SectionHeading>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* LEFT — narrative */}
          <div>
            <p className="body-text text-lg">
              <TextReveal text="SiteSpot kombinuje precizní webdesign, AI automatizace a cílené generování leadů do jednoho ekosystému. Neprodáváme jen weby — budujeme stroje na růst." />
            </p>
            <a
              href="#services"
              data-cursor-hover
              className="reveal delay-3 mt-8 liquid-glass rounded-full px-7 py-3 text-sm w-fit flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              Naše služby <span className="accent-gradient-text">→</span>
            </a>
          </div>

          {/* RIGHT — stats fill the column */}
          <div className="flex flex-col gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`reveal-right delay-${i + 2} liquid-glass rounded-2xl p-6 flex items-baseline justify-between gap-4`}
              >
                <Counter
                  value={stat.value}
                  className="text-4xl md:text-5xl font-light accent-gradient-text"
                />
                <p className="text-xs text-white/40 uppercase tracking-[0.15em] text-right">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}