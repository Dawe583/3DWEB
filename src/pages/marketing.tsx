import { Target, TrendingUp, Megaphone, BarChart3 } from "lucide-react";
import ServiceLandingPage from "../components/ServiceLandingPage";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_143803_f635b644-d959-4f16-9d29-cedaeb5c6de0.mp4";

const FEATURES = [
  {
    icon: Target,
    title: "Cílené kampaně",
    description:
      "Reklamy na Google a sociálních sítích nastavené na lidi, kteří už hledají to, co nabízíte — ne na náhodný dosah.",
  },
  {
    icon: Megaphone,
    title: "Obsah, který prodává",
    description:
      "Texty, vizuály a video formáty postavené na jednom cíli: dovést návštěvníka k akci, ne jen k pozornosti.",
  },
  {
    icon: TrendingUp,
    title: "SEO a organický růst",
    description:
      "Dlouhodobá viditelnost ve vyhledávání — obsah a technické základy webu, které vám přivádí zákazníky zadarmo.",
  },
  {
    icon: BarChart3,
    title: "Data a optimalizace",
    description:
      "Sledujeme, co skutečně přináší výsledky, a kampaně podle toho každý týden ladíme — žádné rozpočty do prázdna.",
  },
];

const STATS = [
  { value: "2,4×", label: "růst kvalifikovaných leadů" },
  { value: "38%", label: "nižší cena za akvizici" },
  { value: "6", label: "týdnů do prvních výsledků" },
];

export default function Marketing() {
  return (
    <ServiceLandingPage
      eyebrow="Marketing & Růst"
      title="Zákazníci, kteří"
      titleAccent="kupují."
      tagline="Spojujeme placené kampaně, obsah a SEO do jednoho systému, který přivádí kvalifikované zákazníky — měřitelně a opakovaně."
      heroVideo={HERO_VIDEO}
      features={FEATURES}
      stats={STATS}
      ctaLabel="Nastartovat marketing"
    />
  );
}
