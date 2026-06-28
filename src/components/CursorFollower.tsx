import { useEffect, useRef } from "react";

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("custom-cursor");

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Reduced motion disables the trailing-spring + velocity-stretch effect,
    // but the custom cursor itself keeps working — it just snaps to the
    // pointer 1:1 instead of easing, so nothing here reads as "motion".
    let reduced = reduceMotionQuery.matches;

    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let mouseX = ringX;
    let mouseY = ringY;
    let prevX = mouseX;
    let prevY = mouseY;

    // Place both immediately so there's never a frame where they sit at the
    // unstyled top-left CSS default before the first animation tick runs.
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    let hovering = false;
    let pendingMove = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hovering = Boolean((e.target as HTMLElement).closest("[data-cursor-hover]"));

      if (pendingMove) return;
      pendingMove = true;
      requestAnimationFrame(() => {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        pendingMove = false;
      });
    };

    const onMouseDown = () => ring.classList.add("cursor-pressed");
    const onMouseUp = () => ring.classList.remove("cursor-pressed");
    const onMouseLeaveWindow = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };
    const onMouseEnterWindow = () => {
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    let raf = 0;
    const animate = () => {
      const baseScale = hovering ? 1.8 : 1;

      if (reduced) {
        // Direct 1:1 follow — no easing, no stretch, no rotation.
        ringX = mouseX;
        ringY = mouseY;
        ring.style.transform =
          `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${baseScale})`;
      } else {
        // Trailing follow — the ring eases toward the raw mouse position.
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;

        // Velocity-driven stretch: faster movement elongates the ring slightly
        // along its direction of travel, like a comet trail — subtle, never wild.
        const vx = mouseX - prevX;
        const vy = mouseY - prevY;
        prevX = mouseX;
        prevY = mouseY;
        const speed = Math.min(Math.hypot(vx, vy), 60);
        const stretch = 1 + speed / 220;
        const angle = speed > 1 ? Math.atan2(vy, vx) * (180 / Math.PI) : 0;

        ring.style.transform =
          `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) ` +
          `rotate(${angle}deg) scale(${baseScale * stretch}, ${baseScale})`;
      }

      raf = requestAnimationFrame(animate);
    };

    const handleReduceMotionChange = (e: MediaQueryListEvent) => {
      reduced = e.matches;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseLeaveWindow);
    window.addEventListener("mouseenter", onMouseEnterWindow);
    raf = requestAnimationFrame(animate);
    reduceMotionQuery.addEventListener("change", handleReduceMotionChange);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseLeaveWindow);
      window.removeEventListener("mouseenter", onMouseEnterWindow);
      cancelAnimationFrame(raf);
      reduceMotionQuery.removeEventListener("change", handleReduceMotionChange);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <div className="hidden [@media(pointer:fine)]:block">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-50 w-1.5 h-1.5 rounded-full bg-white pointer-events-none transition-opacity duration-150"
        style={{ willChange: "transform, opacity", mixBlendMode: "difference" }}
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 z-50 w-8 h-8 rounded-full border border-white pointer-events-none"
        style={{ willChange: "transform, opacity", mixBlendMode: "difference" }}
      />
    </div>
  );
}
