import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity } from "framer-motion";
import { useMagnetic } from "../hooks/useMagnetic";
import HlsVideo from "./HlsVideo";

interface ScrollZoomSectionProps {
  /** video or image src */
  mediaSrc: string;
  mediaType?: "video" | "image";
  leftText?: string;
  rightText?: string;
  ctaText?: string;
  ctaHref?: string;
  /** extra content overlaid at center when fully expanded */
  overlay?: React.ReactNode;
}

export default function ScrollZoomSection({
  mediaSrc,
  mediaType = "video",
  leftText,
  rightText,
  ctaText,
  ctaHref = "#contact",
  overlay,
}: ScrollZoomSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const ctaMagnetic = useMagnetic(0.35);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The media grows into a CONTAINED card — never full-bleed. Capping the final
  // size keeps each (relatively low-res) source video sharp: the fewer screen
  // pixels we stretch it across, the less upscaling blur is visible.
  const rawWidth = useTransform(scrollYProgress, [0, 1], ["32vw", "72vw"]);
  const rawHeight = useTransform(scrollYProgress, [0, 1], ["16vh", "78vh"]);
  // Stays a rounded card the whole time — reinforces that it's a framed panel,
  // not a full-screen background.
  const rawRadius = useTransform(scrollYProgress, [0, 1], [28, 24]);

  const springConfig = { stiffness: 90, damping: 25, mass: 0.6 };

  const width = useSpring(rawWidth, springConfig);
  const height = useSpring(rawHeight, springConfig);
  const borderRadius = useSpring(rawRadius, { stiffness: 90, damping: 25 });

  // Scroll-velocity kick: a fast flick skews the card briefly, settling back to
  // flat as the scroll slows — reads as "this thing has mass" without a new
  // dependency (useVelocity is built into Framer Motion).
  // ponytail: input range [-3, 3] is a tuned-by-feel guess at "fast scroll" in
  // progress-units/sec for a 250vh section; revisit if section height changes.
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollVelocity = useVelocity(scrollYProgress);
  const rawSkew = useTransform(
    scrollVelocity,
    [-3, 0, 3],
    prefersReducedMotion ? [0, 0, 0] : [5, 0, -5]
  );
  const skewY = useSpring(rawSkew, { stiffness: 120, damping: 20, mass: 0.3 });

  // Side text fades out as video expands — clears out before the overlay
  // arrives, so the two never visually overlap mid-transition.
  const sideOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const sideX_left = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const sideX_right = useTransform(scrollYProgress, [0, 0.3], [0, 40]);

  // Foreground title + CTA fade in over the video once it's expanded
  const overlayOpacity = useTransform(scrollYProgress, [0.45, 0.62], [0, 1]);
  const overlayY = useTransform(scrollYProgress, [0.45, 0.62], [30, 0]);

  return (
    <section
      ref={ref}
      className="h-[180vh] md:h-[250vh]"
      style={{ position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          overflow: "hidden",
        }}
      >
        {/* Soft glow halo behind the card so the black margins don't read as empty */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "80vw",
            height: "80vh",
            transform: "translate(-50%, -50%)",
            borderRadius: "9999px",
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.14) 0%, rgba(168,85,247,0.06) 40%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        {/* LEFT TEXT */}
        {leftText && (
          <motion.div
            style={{
              opacity: sideOpacity,
              x: sideX_left,
              whiteSpace: "nowrap",
              width: "220px",
              textAlign: "right",
              color: "white",
              fontSize: "clamp(28px, 3vw, 48px)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              flexShrink: 0,
              pointerEvents: "none",
            }}
          >
            {leftText}
          </motion.div>
        )}

        {/* EXPANDING MEDIA — contained card */}
        <motion.div
          style={{
            width,
            height,
            borderRadius,
            skewY,
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
            boxShadow: "0 40px 120px -20px rgba(0,0,0,0.8)",
          }}
        >
          {mediaType === "video" ? (
            <HlsVideo
              src={mediaSrc}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              muted
              autoPlay
              loop
              playsInline
              preload="none"
            />
          ) : (
            <img
              src={mediaSrc}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}

          {/* Dark gradient for text legibility */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)",
              pointerEvents: "none",
            }}
          />

          {/* FOREGROUND TITLE + CTA — sits in front of the video */}
          {(leftText || rightText || ctaText || overlay) && (
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                opacity: overlayOpacity,
                y: overlayY,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                textAlign: "center",
                padding: "0 6vw",
                pointerEvents: "none",
              }}
            >
              {(leftText || rightText) && (
                <h2
                  className="instrument"
                  style={{
                    color: "white",
                    fontSize: "clamp(40px, 6vw, 96px)",
                    fontWeight: 300,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    margin: 0,
                  }}
                >
                  {leftText}{" "}
                  {rightText && (
                    <em className="italic accent-gradient-text">{rightText}</em>
                  )}
                </h2>
              )}

              {overlay}

              {ctaText && (
                <a
                  ref={ctaMagnetic as React.RefObject<HTMLAnchorElement>}
                  href={ctaHref}
                  data-cursor-hover
                  style={{ pointerEvents: "auto" }}
                  className="liquid-glass rounded-full px-10 py-4 text-white text-lg font-light tracking-wide hover:bg-white/10 transition-colors flex items-center gap-3"
                >
                  {ctaText}
                  <span className="accent-gradient-text text-xl">→</span>
                </a>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT TEXT */}
        {rightText && (
          <motion.div
            style={{
              opacity: sideOpacity,
              x: sideX_right,
              whiteSpace: "nowrap",
              width: "220px",
              textAlign: "left",
              color: "white",
              fontSize: "clamp(28px, 3vw, 48px)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              flexShrink: 0,
              pointerEvents: "none",
            }}
          >
            {rightText}
          </motion.div>
        )}
      </div>
    </section>
  );
}
