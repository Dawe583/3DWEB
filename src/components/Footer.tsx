import { Globe } from "lucide-react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "O nás", href: "#about" },
  { label: "Služby", href: "#services" },
  { label: "Šablony", href: "/weby" },
  { label: "Filosofie", href: "#philosophy" },
  { label: "Kontakt", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold tracking-wide">SiteSpot</span>
        </div>

        <nav className="flex items-center gap-8 text-sm text-white/40 flex-wrap justify-center">
          {FOOTER_LINKS.map(link => (
            link.href.startsWith("/") ? (
              <Link key={link.label} to={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </a>
            )
          ))}
        </nav>

        <p className="text-xs text-white/20">
          © {new Date().getFullYear()} SiteSpot. Všechna práva vyhrazena.
        </p>

      </div>
    </footer>
  );
}