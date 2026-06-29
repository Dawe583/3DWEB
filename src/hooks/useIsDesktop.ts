import { useEffect, useState } from "react";

/**
 * Tracks the `md` breakpoint (768px) as a live boolean — the same threshold
 * Tailwind's `md:` prefix uses, so JS-driven sizing/gating stays in sync with
 * CSS-driven responsive classes elsewhere in the app.
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}
