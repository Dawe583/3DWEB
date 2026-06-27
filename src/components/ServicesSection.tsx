import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Bot, Target } from "lucide-react";

const services = [
  {
    tag: "Webdesign",
    icon: Globe,
    title: "Weby které konvertují",
    description:
      "Navrhujeme a stavíme weby na míru — od landing pages po komplexní platformy. Každý pixel slouží jednomu cíli: proměnit návštěvníka v zákazníka.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
    accent: "from-indigo-500/20 to-purple-500/5",
  },
  {
    tag: "AI Automatizace",
    icon: Bot,
    title: "Procesy na autopilotu",
    description:
      "Zapojíme AI do vašeho workflows — od automatického zpracování dotazů přes personalizované e-maily až po inteligentní CRM integrace. Ušetříte hodiny denně.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4",
    accent: "from-purple-500/20 to-pink-500/5",
  },
  {
    tag: "Lead Generation",
    icon: Target,
    title: "Leady které kupují",
    description:
      "Systémy pro cílené získávání kvalifikovaných kontaktů. Kombinujeme SEO, placené kampaně a AI scoring tak, aby k vám přicházeli lidé připravení nakoupit.",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4",
    accent: "from-blue-500/20 to-indigo-500/5",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-black py-28 md:py-40 px-6">

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.04)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-16 md:mb-20"
        >
          <div>
            <p className="uppercase tracking-[0.25em] text-sm text-white/40 mb-4">
              Služby
            </p>
            <h2 className="text-4xl md:text-6xl tracking-tight text-white">
              Co pro vás{" "}
              <span className="instrument italic text-white/40">děláme</span>
            </h2>
          </div>
          <a
            href="#contact"
            className="hidden md:flex liquid-glass rounded-full px-6 py-3 text-sm items-center gap-2 hover:bg-white/5 transition-colors"
          >
            Začít projekt <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Cards — 1 wide + 2 narrow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* First card — full width */}
          <motion.article
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="group liquid-glass overflow-hidden rounded-3xl md:col-span-2"
          >
            <div className="md:grid md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto overflow-hidden">
                <video
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  muted autoPlay loop playsInline preload="auto"
                >
                  <source src={services[0].video} />
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="liquid-glass rounded-full p-2">
                      <Globe className="h-4 w-4 text-indigo-300" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                      {services[0].tag}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl tracking-tight text-white mb-4">
                    {services[0].title}
                  </h3>
                  <p className="text-white/50 leading-relaxed">
                    {services[0].description}
                  </p>
                </div>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 liquid-glass rounded-full px-6 py-3 text-sm w-fit flex items-center gap-2 hover:bg-white/5 transition-colors"
                >
                  Zjistit více <ArrowUpRight className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </motion.article>

          {/* Remaining 2 cards */}
          {services.slice(1).map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="group liquid-glass overflow-hidden rounded-3xl"
              >
                <div className="relative aspect-video overflow-hidden">
                  <video
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    muted autoPlay loop playsInline preload="auto"
                  >
                    <source src={service.video} />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="p-6 md:p-8">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="liquid-glass rounded-full p-2">
                        <Icon className="h-4 w-4 text-indigo-300" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                        {service.tag}
                      </span>
                    </div>
                    <div className="liquid-glass rounded-full p-2">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl md:text-2xl tracking-tight text-white">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    {service.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}