import { useRef, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Glass card with a radial "spotlight" that tracks the cursor — a soft glow
 * that brightens the edge nearest the pointer. Pure CSS var + mousemove, no
 * layout writes, so it stays cheap even with several cards on screen.
 */
export default function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`spotlight-card ${className}`}
    >
      <div className="spotlight-card-glow" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
