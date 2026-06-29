export interface Template {
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  video: string;
  features: string[];
}

export const TEMPLATES: Template[] = [
  {
    slug: "aurora",
    name: "Aurora",
    category: "SaaS",
    description: "Tmavý, glassmorphic landing page pro AI a tech produkty.",
    longDescription:
      "Aurora je stavěná pro produkty, které potřebují vypadat technologicky vyspěle hned od prvního scrollu. Glassmorphic karty, plynulé scroll-zoom přechody a prostor pro demo video uprostřed hero sekce.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4",
    features: ["Glassmorphic UI kit", "Dark mode nativně", "Sekce pro demo video", "Pricing tabulka"],
  },
  {
    slug: "atelier",
    name: "Atelier",
    category: "Portfolio",
    description: "Minimalistická šablona pro kreativce a fotografy.",
    longDescription:
      "Atelier staví na velkoformátové fotografii a typografii — minimum UI prvků, maximum prostoru pro vaši práci. Ideální pro fotografy, ateliéry a kreativní studia.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4",
    features: ["Fullscreen galerie", "Custom cursor", "Lightbox prohlížeč", "Minimalistická navigace"],
  },
  {
    slug: "marche",
    name: "Marché",
    category: "E-commerce",
    description: "Konverzní e-shop šablona s důrazem na produktové video.",
    longDescription:
      "Marché kombinuje produktové video, sociální důkaz a jasné CTA do jednoho konverzního flow. Stavěná na A/B testovaná data z desítek e-shopových projektů.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
    features: ["Produktové video karty", "Sticky add-to-cart", "Recenze a hodnocení", "Rychlý checkout"],
  },
  {
    slug: "lumen",
    name: "Lumen",
    category: "Služby",
    description: "Čistá one-pager šablona pro lokální služby a řemeslníky.",
    longDescription:
      "Lumen je jednostránkové řešení pro lokální podnikání — rychlé načtení, jasná nabídka a kontaktní formulář na dosah ruky odshora dolů.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4",
    features: ["One-page layout", "Rychlý kontaktní formulář", "Mapa a otevírací doba", "SEO optimalizace"],
  },
  {
    slug: "foyer",
    name: "Foyer",
    category: "Restaurace",
    description: "Atmosférická šablona pro restaurace a bary s rezervačním flow.",
    longDescription:
      "Foyer vytváří atmosféru ještě před vstupem do podniku — tmavé tóny, ambientní video pozadí a rezervační formulář integrovaný přímo do hero sekce.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4",
    features: ["Rezervační formulář", "Menu s fotografiemi", "Ambientní video", "Galerie interiéru"],
  },
  {
    slug: "vertex",
    name: "Vertex",
    category: "SaaS",
    description: "Dashboard-friendly šablona pro B2B software a startupy.",
    longDescription:
      "Vertex je navržen pro B2B SaaS produkty s komplexním dashboardem — sekce pro screenshoty produktu, integrace a enterprise-grade feature grid.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4",
    features: ["Feature grid", "Integrace logos", "Dashboard mockupy", "Enterprise CTA"],
  },
];

export const TEMPLATE_CATEGORIES = ["Vše", "E-commerce", "Služby", "Portfolio", "SaaS", "Restaurace"];
