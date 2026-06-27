import { ArrowRight, Globe, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import AboutSection from "../components/AboutSection";
import PhilosophySection from "../components/PhilosophySection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import ScrollZoomSection from "../components/ScrollZoomSection";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4";

const SHOWREEL_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4";

const PHILOSOPHY_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4";

const NAV_LINKS = [
  { label: "O nás", href: "#about" },
  { label: "Služby", href: "#services" },
  { label: "Filosofie", href: "#philosophy" },
  { label: "Kontakt", href: "#contact" },
];

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fading = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");

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
    const handleCanPlay = () => { video.play(); fade(0, 1, 500); };
    const handleTime = () => {
      if (fading.current) return;
      const remain = video.duration - video.currentTime;
      if (remain <= 0.55) { fading.current = true; fade(Number(video.style.opacity || 1), 0, 500); }
    };
    const handleEnd = () => {
      video.style.opacity = "0";
      setTimeout(() => { video.currentTime = 0; video.play(); fade(0, 1, 500); fading.current = false; }, 100);
    };
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("timeupdate", handleTime);
    video.addEventListener("ended", handleEnd);
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("timeupdate", handleTime);
      video.removeEventListener("ended", handleEnd);
    };
  }, []);

  return (
    <main className="bg-black">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          muted autoPlay playsInline preload="auto"
          style={{ opacity: 0 }}
        >
          <source src={HERO_VIDEO} />
        </video>

        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.12)_0%,_transparent_60%)] pointer-events-none" />

        {/* NAV */}
        <nav className="relative z-20 px-6 py-6">
          <div className={`max-w-5xl mx-auto liquid-glass rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 ${scrolled ? "bg-black/20" : ""}`}>

            <div className="flex items-center">
              <Globe className="w-5 h-5 text-indigo-400" />
              <span className="ml-2 font-semibold tracking-wide">SiteSpot</span>

              <div className="hidden md:flex gap-8 ml-10">
                {NAV_LINKS.map(link => (
                  <a key={link.label} href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href="#contact"
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
                  <a key={link.label} href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-white/70 hover:text-white text-lg transition-colors">
                    {link.label}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 -translate-y-[10%]">

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
            Váš byznys,{" "}
            <em className="italic accent-gradient-text">online.</em>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 w-full max-w-xl"
          >
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Váš email"
                className="flex-1 bg-transparent outline-none placeholder:text-white/40 text-white"
              />
              <a href="#contact"
                className="bg-white rounded-full p-3 text-black hover:bg-indigo-100 transition-colors">
                <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 flex items-center gap-6"
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
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="liquid-glass rounded-full px-4 py-2 text-xs text-white/30 tracking-widest uppercase"
          >
            scroll
          </motion.div>
        </motion.div>
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