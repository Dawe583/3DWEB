import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export type CarouselTemplate = {
  title: string;
  tag: string;
  slug: string;
  video: string;
};

interface TemplateCarouselProps {
  templates: CarouselTemplate[];
}

/**
 * 3D cylinder carousel of template preview cards, driven purely by page scroll.
 * The section is tall and the carousel pins (sticky) while you scroll through
 * it — one rotation maps to the whole template set — so scrolling up and down
 * rotates the cards forwards and backwards with zero input conflict (no wheel
 * hijack, no double motion). Below the stage sit the live active-template name
 * and a dot indicator; clicking a dot scrolls to that card.
 */
export default function TemplateCarousel({ templates }: TemplateCarouselProps) {
  const navigate = useNavigate();
  const cardCount = templates.length;

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameId = useRef<number>(0);

  const progress = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const movedDist = useRef(0);
  const downPos = useRef({ x: 0, y: 0 });

  const [metrics, setMetrics] = useState({ cardW: 336, cardH: 211 });
  const [active, setActive] = useState(0);

  // Scroll progress across the tall section (0 at top → 1 at bottom).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ── Mouse parallax target (disabled under reduced motion) ──
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ry = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      mouse.current.targetX = Math.max(-1, Math.min(1, rx));
      mouse.current.targetY = Math.max(-1, Math.min(1, ry));
    };
    const handleMouseLeave = () => {
      mouse.current.targetX = 0;
      mouse.current.targetY = 0;
    };
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // ── Responsive card sizing ──
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      let cardW = Math.round(w * 0.16 + 130);
      const heightFactor = Math.min(1.0, Math.max(0.65, h / 850));
      cardW = Math.round(cardW * heightFactor);
      cardW = Math.min(336, Math.max(150, cardW));
      const cardH = Math.round(cardW / 1.5925);
      setMetrics({ cardW, cardH });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── 60fps render loop — scroll position is the single source of truth ──
  useEffect(() => {
    let lastActive = -1;

    const renderLoop = () => {
      // Map scroll progress (0..1) onto the full card range. We let it travel a
      // touch past the last card so every card reaches dead-centre.
      const sp = scrollYProgress.get();
      const target = sp * cardCount;

      // Smooth glide toward the scroll-derived target.
      progress.current += (target - progress.current) * 0.12;

      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

      const cards = cardsRefs.current;
      const h = window.innerHeight;
      const { cardH } = metrics;

      const continuousProgress = progress.current;
      const roundedIndex = Math.round(continuousProgress);
      const nextActive = ((roundedIndex % cardCount) + cardCount) % cardCount;
      if (nextActive !== lastActive) {
        lastActive = nextActive;
        setActive(nextActive);
      }
      const diffFromRound = continuousProgress - roundedIndex;
      const easedDiff = (Math.sign(diffFromRound) * Math.pow(Math.abs(diffFromRound) * 2, 4.2)) / 2;
      const virtualActiveIndex = roundedIndex + easedDiff;

      for (let i = 0; i < cardCount; i++) {
        const card = cards[i];
        if (!card) continue;

        let offset = i - virtualActiveIndex;
        const halfCount = cardCount / 2;
        while (offset > halfCount) offset -= cardCount;
        while (offset < -halfCount) offset += cardCount;

        const absOffset = Math.abs(offset);
        const sign = Math.sign(offset);

        if (absOffset > 3.0) {
          card.style.visibility = "hidden";
          continue;
        } else {
          card.style.visibility = "visible";
        }

        const gap = 36;
        const peekAmount = -55;
        const D = 1350;

        let y = 0;
        let z = 0;
        let rot = 0;

        if (absOffset <= 1) {
          const t = absOffset;
          const easedT = t * t * (3 - 2 * t);
          const targetY = cardH + gap;
          y = -sign * (easedT * targetY);
          z = 400 + easedT * (220 - 400);
          rot = easedT * 132;
        } else if (absOffset <= 2) {
          const t = absOffset - 1;
          const easedT = t * t * (3 - 2 * t);
          const yStart = cardH + gap;
          const zStart = 220;
          const rotStart = 132;
          const zEnd = -60;
          const rotEnd = 175;
          const sEnd = D / (D - zEnd);
          const yEnd = (h / 2 - peekAmount) / sEnd - cardH / 2;
          const currentY = yStart + easedT * (yEnd - yStart);
          y = -sign * currentY;
          z = zStart + easedT * (zEnd - zStart);
          rot = rotStart + easedT * (rotEnd - rotStart);
        } else {
          const t = Math.min(absOffset - 2, 1);
          const easedT = t * t * (3 - 2 * t);
          const zStart = -60;
          const rotStart = 175;
          const zEnd3 = -250;
          const rotEnd3 = 195;
          const sEnd2 = D / (D - zStart);
          const yEnd2 = (h / 2 - peekAmount) / sEnd2 - cardH / 2;
          const sEnd3 = D / (D - zEnd3);
          const yEnd3 = (h / 2 + 100) / sEnd3 + cardH / 2;
          const currentY = yEnd2 + easedT * (yEnd3 - yEnd2);
          y = -sign * currentY;
          z = zStart + easedT * (zEnd3 - zStart);
          rot = rotStart + easedT * (rotEnd3 - rotStart);
        }

        const localCardRotation = -sign * rot;
        const centerFactor = Math.max(0, 1 - absOffset);
        const activeTiltX = -mouse.current.y * 12 * centerFactor;
        const activeTiltY = mouse.current.x * 15 * centerFactor;
        const totalRotX = localCardRotation + activeTiltX;
        const totalRotY = activeTiltY;

        card.style.zIndex = Math.round(z).toString();
        card.style.opacity = "1";
        const isCentered = absOffset < 0.15;
        card.style.pointerEvents = isCentered ? "auto" : "none";
        card.style.cursor = isCentered ? "pointer" : "default";
        card.style.transform = `translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg) rotateZ(-3deg)`;
      }
    };

    const tick = () => {
      renderLoop();
      frameId.current = requestAnimationFrame(tick);
    };
    frameId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId.current);
  }, [metrics, cardCount, scrollYProgress]);

  // Dot click → scroll the page so the section lands on that card.
  const goTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollable = section.offsetHeight - window.innerHeight;
    const targetTop = section.offsetTop + (index / cardCount) * scrollable;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  // Tap vs scroll-drag guard for navigation.
  const onCardPointerDown = (e: React.PointerEvent) => {
    downPos.current = { x: e.clientX, y: e.clientY };
    movedDist.current = 0;
  };
  const onCardClick = (slug: string, e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - downPos.current.x);
    const dy = Math.abs(e.clientY - downPos.current.y);
    if (dx + dy > 8) return;
    navigate(`/weby/${slug}`);
  };

  const thicknessLayers = [-1.47, -0.73, 0, 0.73, 1.47];
  const activeTpl = templates[active];

  return (
    <section
      ref={sectionRef}
      style={{ height: `${cardCount * 55 + 60}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center select-none">
        {/* Floor glow / stage */}
        <div className="pointer-events-none absolute bottom-[16%] left-1/2 -translate-x-1/2 w-[70vw] max-w-[680px] h-40 bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.16)_0%,transparent_70%)] blur-2xl" />

        <div
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{ perspective: "1350px" }}
        >
          <div
            className="absolute"
            style={{
              width: `${metrics.cardW}px`,
              height: `${metrics.cardH}px`,
              transformStyle: "preserve-3d",
            }}
          >
            {templates.map((tpl, i) => (
              <div
                key={tpl.slug}
                ref={(el) => { cardsRefs.current[i] = el; }}
                onPointerDown={onCardPointerDown}
                onClick={(e) => onCardClick(tpl.slug, e)}
                data-cursor-hover
                className="absolute inset-0"
                style={{
                  width: `${metrics.cardW}px`,
                  height: `${metrics.cardH}px`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                }}
              >
                {thicknessLayers.map((zOffset, layerIdx) => {
                  const isFrontFace = layerIdx === thicknessLayers.length - 1;
                  const isBackFace = layerIdx === 0;
                  const baseBgColor = "#0f0f0f";

                  if (!isFrontFace && !isBackFace) {
                    return (
                      <div
                        key={layerIdx}
                        className="absolute inset-0 rounded-[16px] border border-[#808080] pointer-events-none overflow-hidden"
                        style={{ backgroundColor: "#808080", transform: `translateZ(${zOffset}px)` }}
                      />
                    );
                  }

                  if (isFrontFace) {
                    return (
                      <div
                        key={layerIdx}
                        className="absolute inset-0 rounded-[16px] border border-white/15 pointer-events-none overflow-hidden"
                        style={{
                          backgroundColor: baseBgColor,
                          transform: `translateZ(${zOffset}px)`,
                          backfaceVisibility: "hidden",
                          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15)",
                        }}
                      >
                        <video
                          src={tpl.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="none"
                          className="absolute inset-0 w-full h-full object-cover rounded-[16px]"
                        />
                        <div className="absolute inset-0 p-5 sm:p-6 text-white h-full w-full font-sans z-10 bg-black/20">
                          <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2">
                            <svg className="w-6 h-6 sm:w-[29px] sm:h-[29px]" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M20 8H40V14C40.0016 14.5299 40.2128 15.0377 40.5875 15.4125C40.9623 15.7872 41.4701 15.9984 42 16H59V24H42C41.4701 24.0016 40.9623 24.2128 40.5875 24.5875C40.2128 24.9623 40.0016 25.4701 40 26V52H20V8ZM18 8H8.00039C4.47435 8 1.56576 10.6083 1.08 14H18V8ZM1 16V24V26V34V36V44H18V36H1V34H18V26H1V24H18V16H1ZM1.08 46C1.56576 49.3917 4.47435 52 8.00039 52H18V46H1.08ZM42 14V8H52.0004C55.5264 8 58.4342 10.6084 58.92 14H42ZM59 26H42V34H59V26ZM59 36H42V44H59V36ZM52.0004 52H42V46H58.92C58.4342 49.3916 55.5264 52 52.0004 52Z" fill={`url(#chip_grad_${i})`} />
                              <defs>
                                <linearGradient id={`chip_grad_${i}`} x1="30" y1="8" x2="30" y2="52" gradientUnits="userSpaceOnUse">
                                  <stop stopColor="white" />
                                  <stop offset="1" stopColor="#999999" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                          <div className="absolute right-5 sm:right-6 top-5 sm:top-6 text-sm font-semibold tracking-wide drop-shadow">
                            Site<span className="instrument italic">Spot</span>
                          </div>
                          <div className="absolute left-5 sm:left-6 bottom-5 sm:bottom-6 text-[10px] uppercase tracking-[0.2em] text-white/80 drop-shadow">
                            {tpl.tag}
                          </div>
                          <div className="absolute right-5 sm:right-6 bottom-5 sm:bottom-6 flex -space-x-3 items-center opacity-90">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 backdrop-blur-[1px] border border-white/10" />
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/35 backdrop-blur-[1px] border border-white/10" />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Back face
                  return (
                    <div
                      key={layerIdx}
                      className="absolute inset-0 rounded-[16px] border border-white/15 pointer-events-none overflow-hidden"
                      style={{
                        backgroundColor: baseBgColor,
                        transform: `translateZ(${zOffset}px) rotateX(180deg)`,
                        backfaceVisibility: "hidden",
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15)",
                      }}
                    >
                      <div className="absolute inset-0 pointer-events-none" style={{ filter: "blur(16px)", transform: "scale(1.15)" }}>
                        <video src={tpl.video} autoPlay loop muted playsInline preload="none" className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute left-0 right-0 top-4 sm:top-5 h-7 sm:h-9 bg-black/85 backdrop-blur-md z-10" />
                      <div
                        className="absolute left-4 sm:left-6 bottom-4 sm:bottom-5 right-4 z-20 flex flex-col gap-1 text-left"
                        style={{ fontFamily: '"JetBrains Mono", monospace' }}
                      >
                        <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.2em] text-white/60">{tpl.tag}</div>
                        <div className="text-[13px] sm:text-[15px] font-medium tracking-wide text-white">{tpl.title}</div>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-indigo-300">
                          Zobrazit <ArrowUpRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Active name + dots, pinned to the bottom of the sticky stage */}
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4 z-20 pointer-events-none">
          <div className="relative h-12 sm:h-14 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.button
                key={activeTpl?.slug}
                onClick={() => activeTpl && navigate(`/weby/${activeTpl.slug}`)}
                data-cursor-hover
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="instrument text-3xl sm:text-5xl tracking-tight text-white hover:text-indigo-200 transition-colors pointer-events-auto"
              >
                {activeTpl?.title}
              </motion.button>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2.5 pointer-events-auto">
            {templates.map((tpl, i) => (
              <button
                key={tpl.slug}
                onClick={() => goTo(i)}
                data-cursor-hover
                aria-label={`Zobrazit ${tpl.title}`}
                aria-current={active === i ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  active === i ? "w-8 bg-indigo-400" : "w-1.5 bg-white/20 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
