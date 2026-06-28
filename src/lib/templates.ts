export type Template = {
  title: string;
  tag: string;
  slug: string;
  video: string;
  description: string;
};

const TEMPLATE_VIDEOS = [
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_030111_a9e15665-d379-4a7f-8116-695bbe452ad1.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_171347_f640c30d-ec21-426a-98bc-77e07c2c60cb.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4",
];

const RAW = [
  {
    title: "E-shop Premium",
    tag: "E-shop",
    description: "Kompletní e-commerce s košíkem, platbami a napojením na sklad — připravené prodávat od prvního dne.",
  },
  {
    title: "Bistro & Café",
    tag: "Restaurace",
    description: "Rezervační web s online menu, galerií a chatbotem pro objednávky. Stvořené pro lokální gastro.",
  },
  {
    title: "Kreativní Portfolio",
    tag: "Portfolio",
    description: "Vizuálně silné portfolio s plynulými přechody, které postaví vaši práci do centra pozornosti.",
  },
  {
    title: "Fitness Studio",
    tag: "Fitness",
    description: "Landing page s rozvrhem lekcí, ceníkem a lead formulářem — laděná na konverzi nových klientů.",
  },
  {
    title: "Právní Kancelář",
    tag: "Služby",
    description: "Důvěryhodná prezentace služeb, týmu a referencí s jasným kontaktním tokem pro nové klienty.",
  },
  {
    title: "Realitní Agentura",
    tag: "Reality",
    description: "Katalog nemovitostí s filtry, detailem nabídky a poptávkovým formulářem napojeným na CRM.",
  },
];

export function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const TEMPLATES: Template[] = RAW.map((t, i) => ({
  ...t,
  slug: slugify(t.title),
  video: TEMPLATE_VIDEOS[i % TEMPLATE_VIDEOS.length],
}));

export function getTemplate(slug: string | undefined): Template | undefined {
  if (!slug) return undefined;
  return TEMPLATES.find((t) => t.slug === slug);
}
