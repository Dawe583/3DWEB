import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Width: 32vw → 100vw
  const rawWidth = useTransform(scrollYProgress, [0, 1], ["32vw", "100vw"]);
  // Height: 16vh → 100vh
  const rawHeight = useTransform(scrollYProgress, [0, 1], ["16vh", "100vh"]);
  // Border radius: 32px → 0px
  const rawRadius = useTransform(scrollYProgress, [0, 1], [32, 0]);

  const springConfig = { stiffness: 90, damping: 25, mass: 0.6 };

  const width = useSpring(rawWidth, springConfig);
  const height = useSpring(rawHeight, springConfig);
  const borderRadius = useSpring(rawRadius, { stiffness: 90, damping: 25 });

  // Side text fades out as video expands
  const sideOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const sideX_left = useTransform(scrollYProgress, [0, 0.4], [0, -40]);
  const sideX_right = useTransform(scrollYProgress, [0, 0.4], [0, 40]);

  // CTA fades in when fully expanded
  const ctaOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.45, 0.65], [30, 0]);

  return (
    <section
      ref={ref}
      style={{ height: "250vh", position: "relative" }}
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
          background: "black",
        }}
      >
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

        {/* EXPANDING MEDIA */}
        <motion.div
          style={{
            width,
            height,
            borderRadius,
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {mediaType === "video" ? (
            <video
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "100vw",
                height: "100vh",
                objectFit: "cover",
                transform: "translate(-50%, -50%)",
              }}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
            >
              <source src={mediaSrc} />
            </video>
          ) : (
            <img
              src={mediaSrc}
              alt=""
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "100vw",
                height: "100vh",
                objectFit: "cover",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
            }}
          />

          {/* CTA / overlay content */}
          {(ctaText || overlay) && (
            <motion.div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                translateX: "-50%",
                translateY: "-50%",
                opacity: ctaOpacity,
                y: ctaY,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                pointerEvents: "none",
              }}
            >
              {overlay}
              {ctaText && (
                <a
                  href={ctaHref}
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