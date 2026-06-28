const clients = ["NOVADESK", "Lumio", "FORMA", "Vertiqo", "Studio Kŕb", "NEXA"];

/**
 * Quiet trust bar — placeholder client wordmarks. The list is duplicated so the
 * marquee can scroll seamlessly; swap the strings for real logos later.
 */
export default function ClientLogos() {
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      <p className="eyebrow text-center mb-10">Důvěřují nám</p>

      <div className="relative max-w-6xl mx-auto overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="allow-motion flex w-max gap-16 animate-[marquee_28s_linear_infinite]">
          {[...clients, ...clients].map((name, i) => (
            <span
              key={i}
              className="instrument italic text-2xl md:text-3xl text-white/25 whitespace-nowrap select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
