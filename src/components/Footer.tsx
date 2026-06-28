import { Link } from "react-router-dom";
import VelocityMarquee from "./VelocityMarquee";
import { useMagnetic } from "../hooks/useMagnetic";

const FOOTER_LINKS = [
  { label: "O nás", href: "#about" },
  { label: "Služby", href: "#services" },
  { label: "Automatizace", href: "/automatizace" },
  { label: "Marketing", href: "/marketing" },
  { label: "Šablony", href: "/weby" },
  { label: "Filosofie", href: "#philosophy" },
  { label: "Kontakt", href: "#contact" },
];

export default function Footer() {
  const ctaMagnetic = useMagnetic(0.3);

  return (
    <footer className="relative overflow-hidden border-t border-white/5 pt-20 md:pt-28 pb-10">
      <div className="section-glow-line absolute top-0 left-0 right-0" />

      <div className="border-b border-white/5 py-6 text-4xl md:text-6xl text-white/[0.16]">
        <VelocityMarquee text="SITESPOT —" baseVelocity={2.2} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 mt-16 md:mt-20">

        {/* Closing wordmark band */}
        <div className="text-center">
          <h2 className="instrument text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none">
            Site<span className="italic accent-gradient-text">Spot</span>
          </h2>
          <p className="mt-6 text-white/40 max-w-md mx-auto leading-relaxed">
            Weby, AI automatizace a lead-gen systémy, které pracují 24/7.
          </p>
          <a
            ref={ctaMagnetic as React.RefObject<HTMLAnchorElement>}
            href="#contact"
            data-cursor-hover
            className="mt-8 liquid-glass rounded-full px-8 py-3 text-sm inline-flex items-center gap-2 hover:bg-white/5 transition-colors"
          >
            Začít projekt <span className="accent-gradient-text">→</span>
          </a>
        </div>

        {/* Bottom row */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide">SiteSpot</span>
          </div>

          <nav className="flex items-center gap-8 text-sm text-white/40 flex-wrap justify-center">
            {FOOTER_LINKS.map(link => (
              link.href.startsWith("/") ? (
                <Link key={link.label} to={link.href} data-cursor-hover className="link-underline hover:text-white transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} data-cursor-hover className="link-underline hover:text-white transition-colors">
                  {link.label}
                </a>
              )
            ))}
          </nav>

          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} SiteSpot. Všechna práva vyhrazena.
          </p>
        </div>

      </div>
    </footer>
  );
}