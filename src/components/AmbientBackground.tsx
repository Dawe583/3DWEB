import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * A single page-wide ambient layer that lives behind every transparent content
 * section, so the whole site shares one continuous light field instead of each
 * section carrying its own disconnected radial glow. Two large indigo/purple
 * blooms drift slowly to keep the dark space alive without distracting.
 */
export default function AmbientBackground() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#000" }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "60vw",
          height: "60vw",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
        animate={reducedMotion ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "65vw",
          height: "65vw",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(168,85,247,0.09) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
        animate={reducedMotion ? undefined : { x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Faint vertical spine keeping the centre of long sections from going flat-black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(99,102,241,0.035) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
