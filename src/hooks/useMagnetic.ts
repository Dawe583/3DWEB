import { useEffect, useRef } from "react";

/**
 * Magnetic hover effect — element subtly follows the cursor while hovered,
 * and springs back to rest on mouse leave.
 */
export function useMagnetic(strength: number) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // A CSS transition on transform smooths every change below (move, leave,
    // press, release) instead of snapping frame-to-frame.
    el.style.transition = "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)";

    let offsetX = 0;
    let offsetY = 0;
    let pressed = false;

    const apply = () => {
      const scale = pressed ? 0.96 : 1;
      el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      offsetX = (e.clientX - (rect.left + rect.width / 2)) * strength;
      offsetY = (e.clientY - (rect.top + rect.height / 2)) * strength;
      apply();
    };

    const handleMouseLeave = () => {
      offsetX = 0;
      offsetY = 0;
      pressed = false;
      apply();
    };

    const handleMouseDown = () => {
      pressed = true;
      apply();
    };

    const handleMouseUp = () => {
      pressed = false;
      apply();
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mouseup", handleMouseUp);
    };
  }, [strength]);

  return ref;
}
