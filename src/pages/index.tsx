import { ArrowRight, Globe, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";

import AboutSection from "../components/AboutSection";
import PhilosophySection from "../components/PhilosophySection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import ScrollZoomSection from "../components/ScrollZoomSection";
import ScrambleText from "../components/ScrambleText";
import HeroParticles from "../components/HeroParticles";
import ShowcaseSection from "../components/ShowcaseSection";
import { useMagnetic } from "../hooks/useMagnetic";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4";

const SHOWREEL_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4";

const PHILOSOPHY_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4";

const NAV_LINKS = [
  { label: "O nás", href: "#about" },
  { label: "Služby", href: "#services" },
  { label: "Šablony", href: "/weby" },
  { label: "Filosofie", href: "#philosophy" },
  { label: "Kontakt", href: "#contact" },
];

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ctaMagnetic = useMagnetic(0.3);
  const scrollMagnetic = useMagnetic(0.4);

  // Same zoom mechanics as ScrollZoomSection, mirrored — the hero video shrinks
  // down into a small rounded box exactly where the next ScrollZoomSection
  // picks it back up, so the whole page reads as one continuous zoom motion.
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const rawHeroWidth = useTransform(heroProgress, [0, 1], ["100vw", "32vw"]);
  const rawHeroHeight = useTransform(heroProgress, [0, 1], ["100vh", "16vh"]);
  const rawHeroRadius = useTransform(heroProgress, [0, 1], [0, 32]);

  const heroSpring = { stiffness: 90, damping: 25, mass: 0.6 };
  const heroWidth = useSpring(rawHeroWidth, heroSpring);
  const heroHeight = useSpring(rawHeroHeight, heroSpring);
  const heroRadius = useSpring(rawHeroRadius, { stiffness: 90, damping: 25 });

  const rawHeroContentOpacity = useTransform(heroProgress, [0, 0.35], [1, 0]);
  const heroContentOpacity = useSpring(rawHeroContentOpacity, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fade = (from: number, to: number, duration: number) => {
    const video = videoRef.current;
    if (!video) return;
    const start = performance.now();
    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      video!.style.opacity = String(from + (to - from) * progress);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.style.opacity = "0";
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      fade(0, 1, 500);
    };
    // The video loops natively (loop attr) — we only fade it in once it starts.
    const handleCanPlay = () => { video.play().catch(() => {}); reveal(); };
    const handlePlaying = () => reveal();
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    // The browser may have already buffered/started playback before this
    // listener was attached (e.g. cached video) — catch that case too.
    if (video.readyState >= 3 || !video.paused) { video.play().catch(() => {}); reveal(); }
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
    };
  }, []);

  return (
    <main className="bg-black">

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ height: "250vh", position: "relative" }} className="bg-black">
        <div
          style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
          className="flex flex-col"
        >

        {/* Shrinking video — same width/height/radius spring used by every ScrollZoomSection */}
        <motion.div
          style={{
            width: heroWidth,
            height: heroHeight,
            borderRadius: heroRadius,
            position: "absolute",
            top: "50%",
            left: "50%",
            translateX: "-50%",
            translateY: "-50%",
            overflow: "hidden",
          }}
        >
          <video
            ref={videoRef}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              transform: "translate(-50%, -50%)",
            }}
            muted autoPlay loop playsInline preload="auto"
          >
            <source src={HERO_VIDEO} />
          </video>

          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.12)_0%,_transparent_60%)] pointer-events-none" />
        </motion.div>

        {/* NAV + CONTENT — fades out as the video begins shrinking */}
        <motion.div style={{ opacity: heroContentOpacity }} className="relative z-10 flex flex-col flex-1">
        <HeroParticles />

        {/* NAV */}
        <nav className="relative z-20 px-6 py-6">
          <div className={`max-w-5xl mx-auto liquid-glass rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 ${scrolled ? "bg-black/20" : ""}`}>

            <div className="flex items-center">
              <Globe className="w-5 h-5 text-indigo-400" />
              <span className="ml-2 font-semibold tracking-wide">SiteSpot</span>

              <div className="hidden md:flex gap-8 ml-10">
                {NAV_LINKS.map(link => (
                  link.href.startsWith("/") ? (
                    <Link key={link.label} to={link.href}
                      className="text-white/70 hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.label} href={link.href}
                      className="text-white/70 hover:text-white text-sm transition-colors">
                      {link.label}
                    </a>
                  )
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a ref={ctaMagnetic as React.RefObject<HTMLAnchorElement>} href="#contact" data-cursor-hover
                className="hidden md:block liquid-glass rounded-full px-6 py-2 text-sm hover:bg-white/5 transition-colors">
                Začít projekt
              </a>
              <button className="md:hidden liquid-glass rounded-full p-2" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="md:hidden mt-3 max-w-5xl mx-auto liquid-glass rounded-3xl p-6 flex flex-col gap-4"
              >
                {NAV_LINKS.map(link => (
                  link.href.startsWith("/") ? (
                    <Link key={link.label} to={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-white/70 hover:text-white text-lg transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.label} href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-white/70 hover:text-white text-lg transition-colors">
                      {link.label}
                    </a>
                  )
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="liquid-glass rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em] text-indigo-300 mb-8"
          >
            Weby · AI · Leady
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="instrument text-6xl md:text-8xl lg:text-9xl tracking-tight"
          >
            <ScrambleText text="Váš byznys," duration={1600} />{" "}
            <em className="italic accent-gradient-text">
              <ScrambleText text="online." duration={1600} />
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-white/60 max-w-xl text-lg leading-relaxed"
          >
            Stavíme weby, AI automatizace a lead-gen systémy
            které pracují 24/7 — i když vy spíte.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex items-center gap-6"
          >
            <a href="#services"
              className="liquid-glass rounded-full px-8 py-3 text-sm hover:bg-white/5 transition-colors">
              Co děláme
            </a>
            <a href="#contact"
              className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2">
              Kontakt <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="relative z-10 flex justify-center pb-10"
        >
          <motion.div
            ref={scrollMagnetic as React.RefObject<HTMLDivElement>}
            data-cursor-hover
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="liquid-glass rounded-full px-4 py-2 text-xs text-white/30 tracking-widest uppercase"
          >
            scroll
          </motion.div>
        </motion.div>
        </motion.div>
        </div>
      </section>

      {/* ── SCROLL ZOOM 1 — přechod do About ── */}
      <ScrollZoomSection
        mediaSrc={SHOWREEL_VIDEO}
        leftText="Kdo jsme"
        rightText="SiteSpot"
        ctaText="Poznejte nás"
        ctaHref="#about"
      />

      {/* ── ABOUT ── */}
      <div id="about">
        <AboutSection />
      </div>

      {/* ── SCROLL ZOOM 2 — přechod do Services ── */}
      <ScrollZoomSection
        mediaSrc={HERO_VIDEO}
        leftText="Naše"
        rightText="Služby"
        ctaText="Zobrazit služby"
        ctaHref="#services"
      />

      {/* ── SERVICES ── */}
      <div id="services">
        <ServicesSection />
      </div>

      {/* ── SHOWCASE / CASE STUDY ── */}
      <ShowcaseSection />

      {/* ── SCROLL ZOOM 3 — přechod do Philosophy ── */}
      <ScrollZoomSection
        mediaSrc={PHILOSOPHY_VIDEO}
        leftText="Technologie"
        rightText="× Výsledky"
        ctaText="Naše filosofie"
        ctaHref="#philosophy"
      />

      {/* ── PHILOSOPHY ── */}
      <div id="philosophy">
        <PhilosophySection />
      </div>

      {/* ── CONTACT ── */}
      <ContactSection />
      <Footer />

    </main>
  );
}