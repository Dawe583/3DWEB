import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTilt } from "../hooks/useTilt";
import ScrambleText from "./ScrambleText";
import SectionHeading from "./SectionHeading";
import SpotlightCard from "./SpotlightCard";
import VelocityMarquee from "./VelocityMarquee";

const projects = [
  {
    name: "Bistro Lumen",
    tag: "Restaurace",
    description:
      "Rezervační web s online menu a AI chatbotem pro objednávky. Konverze rezervací +64 % za první měsíc.",
    metric: "+64 %",
    metricLabel: "konverze rezervací",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
  },
  {
    name: "Forma Studio",
    tag: "Fitness",
    description:
      "Landing page + lead-gen kampaň pro fitness studio. 230 nových leadů během 6 týdnů od spuštění.",
    metric: "230",
    metricLabel: "nových leadů",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4",
  },
  {
    name: "Nova Shop",
    tag: "E-shop",
    description:
      "Kompletní e-commerce platforma s AI doporučováním produktů a automatizovaným retargetingem. Tržby +2,4×.",
    metric: "2,4×",
    metricLabel: "růst tržeb",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const tilt = useTilt(7);

  return (
    <motion.div
      ref={tilt}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <SpotlightCard className="liquid-glass rounded-3xl overflow-hidden group flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <video
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
          >
            <source src={project.video} />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Headline metric overlaid on the media */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <span className="instrument italic text-2xl text-white drop-shadow-lg">
              {project.name}
            </span>
            <span className="text-right">
              <span className="block text-2xl font-light accent-gradient-text leading-none">
                {project.metric}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.15em] text-white/50 mt-1">
                {project.metricLabel}
              </span>
            </span>
          </div>
        </div>

        <div className="p-6 md:p-7 flex flex-col flex-1">
          <span className="eyebrow">{project.tag}</span>
          <p className="mt-3 body-text flex-1">{project.description}</p>
          <a
            href="#contact"
            data-cursor-hover
            className="mt-6 inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200 transition-colors link-underline w-fit"
          >
            Zobrazit <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export default function ShowcaseSection() {
  return (
    <section id="case-studies" className="relative overflow-hidden py-28 md:py-40 px-6">
      <div className="relative max-w-6xl mx-auto">
        <SectionHeading eyebrow="Case studies" className="max-w-2xl">
          <ScrambleText text="Výsledky," />{" "}
          <span className="instrument italic accent-gradient-text">
            <ScrambleText text="ne sliby." />
          </span>
        </SectionHeading>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>

      <div className="mt-20 border-y border-white/5 py-6 text-4xl md:text-6xl text-white/[0.16]">
        <VelocityMarquee text="CASE STUDIES —" baseVelocity={2.4} />
      </div>
    </section>
  );
}
