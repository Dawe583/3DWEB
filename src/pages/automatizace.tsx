import { Bot, Workflow, Mail, Database } from "lucide-react";
import ServiceLandingPage from "../components/ServiceLandingPage";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_115139_0fc6bd3d-3631-4d26-ab9b-28293887dcc9.mp4";

const FEATURES = [
  {
    icon: Workflow,
    title: "Automatizované workflows",
    description:
      "Propojíme vaše nástroje (CRM, e-mail, kalendář, formuláře) tak, aby si práci předávaly samy — bez manuálního přepisování dat.",
  },
  {
    icon: Bot,
    title: "AI agenti a chatboti",
    description:
      "Nasadíme AI, která odpovídá klientům, kvalifikuje poptávky a předává jen ty, co stojí za váš čas.",
  },
  {
    icon: Mail,
    title: "Personalizovaná komunikace",
    description:
      "E-maily a follow-upy, které se odešlou ve správný čas se správným obsahem — automaticky, podle chování klienta.",
  },
  {
    icon: Database,
    title: "Integrace a datové toky",
    description:
      "Data z webu, reklam i CRM na jednom místě, aktuální v reálném čase — žádné kopírování mezi tabulkami.",
  },
];

const STATS = [
  { value: "12h+", label: "ušetřeno týdně" },
  { value: "3×", label: "rychlejší odezva" },
  { value: "90%", label: "dotazů bez zásahu člověka" },
];

const CHART = {
  title: "Kde se čas vrací",
  unit: "h / týden",
  bars: [
    { label: "Zpracování dotazů", value: 6 },
    { label: "Reporting a přehledy", value: 3 },
    { label: "Follow-up e-maily", value: 4 },
    { label: "Přepis dat mezi nástroji", value: 5 },
  ],
  ring: { percent: 90, label: "dotazů vyřízeno bez zásahu člověka" },
};

const PROCESS = [
  {
    title: "Audit procesů",
    text: "Zmapujeme, kde se ztrácí čas a kde se data ručně přepisují mezi nástroji.",
  },
  {
    title: "Návrh automatizace",
    text: "Navrhneme workflows a AI kroky na míru vašemu CRM, e-mailu a formulářům.",
  },
  {
    title: "Nasazení a ladění",
    text: "Spustíme, měříme výsledky a postupně rozšiřujeme rozsah automatizace.",
  },
];

export default function Automatizace() {
  return (
    <ServiceLandingPage
      eyebrow="AI Automatizace"
      title="Procesy na"
      titleAccent="autopilotu."
      tagline="Zapojíme AI do vašeho byznysu tak, aby pracoval i ve chvílích, kdy vy nemůžete — a ušetříte hodiny každý týden."
      heroVideo={HERO_VIDEO}
      features={FEATURES}
      stats={STATS}
      chart={CHART}
      process={PROCESS}
      ctaLabel="Automatizovat můj byznys"
    />
  );
}
