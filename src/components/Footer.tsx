import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold tracking-wide">SiteSpot</span>
        </div>

        <nav className="flex items-center gap-8 text-sm text-white/40">
          {["O nás", "Služby", "Filosofie", "Kontakt"].map(item => (
            <a
              key={item}
              href={`#${item === "O nás" ? "about" : item === "Služby" ? "services" : item === "Filosofie" ? "philosophy" : "contact"}`}
              className="hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <p className="text-xs text-white/20">
          © {new Date().getFullYear()} SiteSpot. Všechna práva vyhrazena.
        </p>

      </div>
    </footer>
  );
}