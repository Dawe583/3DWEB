# Premium Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the three phases from `docs/superpowers/specs/2026-06-29-premium-upgrade-design.md` — font/motion consolidation, `ScrollZoomSection` polish, and mobile performance hardening — without changing the existing visual identity or adding new transition types.

**Architecture:** No new architecture. All work happens inside existing files (`index.css`, `lib/motion.ts`, the section components, `ScrollZoomSection.tsx`, `useMagnetic.ts`) plus two small new hook/file additions where the codebase currently duplicates logic.

**Tech Stack:** React 19, Framer Motion (already installed — `useVelocity` covers the scroll-velocity requirement, no Lenis API needed), Tailwind v4, Three.js / @react-three/fiber (already installed). No new dependencies.

## Global Constraints

- No new npm dependencies (spec non-goal).
- No new transition types alongside `ScrollZoomSection` (spec decision).
- Desktop visuals/behavior must not change in Phase 3 — only mobile (`<768px`, matching the existing `md` Tailwind breakpoint and the existing `useCanRender3D` convention) gets lighter treatment.
- This project has no test runner (`package.json` has no Jest/Vitest/Playwright). Verification for every task is `npx tsc --noEmit -p tsconfig.app.json` (must stay clean) plus a manual check described in the task — do not introduce a test framework to satisfy this plan's checklist format.

## Deviations from the spec (found while reading the code)

- **Spacing/type-scale tokens (Phase 1, spec item 3): dropped.** Tailwind's utility classes (`mt-16`, `py-28`, etc.) already *are* a spacing/type-scale token system. The "ad hoc" feeling the spec named is actually the motion-value drift (covered below), not a missing token layer. Adding CSS-variable tokens on top of Tailwind's existing scale would be pure duplication for no behavior change.
- **3D scene mobile gating (Phase 3, spec item 1): already done.** `Scene3DBackground.tsx` already returns `null` below `768px` via a local `useCanRender3D` hook, and is already lazy-loaded (`lazy(() => import(...))` in `app.tsx`). `HeroScene3D.tsx` does the same gating but **is dead code — nothing imports it.** Task 6 below deletes it; Task 7 dedupes the gating hook instead of writing new gating logic.
- **Video lazy-loading (Phase 3, spec item 4): already done** in this session (`preload="none"` everywhere except the hero, `VideoManager`'s `IntersectionObserver`, CDN `preconnect`). No task needed.
- Net effect: Phase 3 is smaller than the spec implied. The real remaining work is the pinned-section height on mobile.

---

## Phase 1 — Foundation

### Task 1: Fix font loading

**Files:**
- Modify: `src/index.css:1-2` (font imports), `src/index.css:65` (`body` font-family)

**Interfaces:** None — pure CSS, no component touches this.

- [ ] **Step 1: Add the Inter import and fix the fallback stack**

In `src/index.css`, current top of file:

```css
@import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap");
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap");
```

Replace with (adds Inter variable weight, same `@import` pattern already used for the other two fonts):

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap");
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap");
```

Then find (around line 65):

```css
body {
  background: black;
  color: white;
  font-family: Inter, sans-serif;
}
```

Replace with (adds a metric-compatible system fallback so there's no layout jump before Inter loads, instead of dropping straight to serif/Times defaults):

```css
body {
  background: black;
  color: white;
  font-family: Inter, -apple-system, "Segoe UI", Roboto, sans-serif;
}
```

- [ ] **Step 2: Verify it actually loads**

Run: `npm run dev`, open the site, open DevTools → Network → filter `font` or `css2`. Confirm a request to `fonts.googleapis.com/css2?family=Inter...` returns 200, and in the Elements panel, computed `font-family` on `<body>` resolves to `Inter`.

- [ ] **Step 3: Typecheck and commit**

Run: `npx tsc --noEmit -p tsconfig.app.json` — expect no output (clean).

```bash
git add src/index.css
git commit -m "fix: actually load the Inter font instead of falling back to system sans"
```

---

### Task 2: Consolidate motion values onto `lib/motion.ts`

**Files:**
- Modify: `src/components/ShowcaseSection.tsx:54-57`, `src/components/TestimonialsSection.tsx:38-41`, `src/components/ProcessSection.tsx:56-59`, `src/components/ContactSection.tsx:57-60,123-125,135-139`
- No modify: `src/components/AboutSection.tsx`, `src/components/PhilosophySection.tsx`, `src/components/FeaturedVideoSection.tsx` — these use the separate CSS-class `.reveal` system (`useReveal` hook + `index.css:269-330`), which has its own internally-consistent timing already and is a different mechanism. Leave alone.

**Interfaces:**
- Consumes: `DUR`, `EASE_OUT`, `inViewOnce` from `src/lib/motion.ts` (already exported, signatures unchanged: `DUR.base === 0.7`, `EASE_OUT` is a 4-tuple, `inViewOnce === { once: true, margin: "-80px" }`).
- Produces: nothing new — this task only changes call sites.

- [ ] **Step 1: `ShowcaseSection.tsx`**

Current (`ProjectCard`, inside the `.map`):

```tsx
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
```

Replace with:

```tsx
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inViewOnce}
        transition={{ duration: DUR.base, ease: EASE_OUT, delay: index * 0.1 }}
```

Add to the top imports:

```tsx
import { DUR, EASE_OUT, inViewOnce } from "../lib/motion";
```

- [ ] **Step 2: `TestimonialsSection.tsx`**

Current (`TestimonialCard`):

```tsx
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: index * 0.12 }}
```

Replace with:

```tsx
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inViewOnce}
        transition={{ duration: DUR.base, ease: EASE_OUT, delay: index * 0.12 }}
```

Add to the top imports:

```tsx
import { DUR, EASE_OUT, inViewOnce } from "../lib/motion";
```

- [ ] **Step 3: `ProcessSection.tsx`**

Current (inside the `steps.map`):

```tsx
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
```

Replace with:

```tsx
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewOnce}
                transition={{ duration: DUR.base, ease: EASE_OUT, delay: i * 0.12 }}
```

Add to the top imports:

```tsx
import { DUR, EASE_OUT, inViewOnce } from "../lib/motion";
```

- [ ] **Step 4: `ContactSection.tsx`**

Current (form card):

```tsx
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
```

Replace with:

```tsx
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: DUR.base, ease: EASE_OUT, delay: 0.3 }}
```

Current (success state — this one is `animate`, not `whileInView`, so it has no `viewport` to change):

```tsx
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
```

Replace with:

```tsx
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DUR.fast, ease: EASE_OUT }}
```

Current (footer email line):

```tsx
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
```

Replace with:

```tsx
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inViewOnce}
          transition={{ duration: DUR.base, ease: EASE_OUT, delay: 0.5 }}
```

Add to the top imports:

```tsx
import { DUR, EASE_OUT, inViewOnce } from "../lib/motion";
```

- [ ] **Step 5: `ServicesSection.tsx` active/inactive card transition**

Current (`ServiceCard`):

```tsx
      <motion.div
        animate={{ opacity: active ? 1 : 0.4, scale: active ? 1 : 0.92 }}
        transition={{ duration: 0.4 }}
```

Replace with:

```tsx
      <motion.div
        animate={{ opacity: active ? 1 : 0.4, scale: active ? 1 : 0.92 }}
        transition={{ duration: DUR.fast }}
```

Add to the top imports:

```tsx
import { DUR } from "../lib/motion";
```

- [ ] **Step 6: Typecheck and verify visually**

Run: `npx tsc --noEmit -p tsconfig.app.json` — expect clean.

Run: `npm run dev`, scroll through Services → Showcase → Testimonials → Process → Contact. Each card/section should still fade-and-rise into view on scroll, just with one shared duration/ease/viewport-margin instead of five slightly different ones. Nothing should look broken or suddenly snap.

- [ ] **Step 7: Commit**

```bash
git add src/components/ShowcaseSection.tsx src/components/TestimonialsSection.tsx src/components/ProcessSection.tsx src/components/ContactSection.tsx src/components/ServicesSection.tsx
git commit -m "refactor: consolidate scroll-reveal motion values onto lib/motion.ts"
```

---

## Phase 2 — `ScrollZoomSection` polish

### Task 3: Scroll-velocity reactive skew on the expanding card

**Files:**
- Modify: `src/components/ScrollZoomSection.tsx:1-2` (imports), `:43-47` (spring setup), `:114-124` (media `motion.div` style)

**Interfaces:**
- Consumes: `useVelocity` from `framer-motion` (already a dependency — no new import target).
- Produces: no exported API change; `ScrollZoomSection`'s props are unchanged.

- [ ] **Step 1: Derive and spring the velocity**

Current imports line:

```tsx
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
```

Replace with:

```tsx
import { motion, useScroll, useTransform, useSpring, useVelocity } from "framer-motion";
```

Current (around the existing spring setup):

```tsx
  const springConfig = { stiffness: 90, damping: 25, mass: 0.6 };

  const width = useSpring(rawWidth, springConfig);
  const height = useSpring(rawHeight, springConfig);
  const borderRadius = useSpring(rawRadius, { stiffness: 90, damping: 25 });
```

Add directly below it:

```tsx
  // Scroll-velocity kick: a fast flick skews the card briefly, settling back to
  // flat as the scroll slows — reads as "this thing has mass" without a new
  // dependency (useVelocity is built into Framer Motion).
  // ponytail: input range [-3, 3] is a tuned-by-feel guess at "fast scroll" in
  // progress-units/sec for a 250vh section; revisit if section height changes.
  const scrollVelocity = useVelocity(scrollYProgress);
  const rawSkew = useTransform(scrollVelocity, [-3, 0, 3], [5, 0, -5]);
  const skewY = useSpring(rawSkew, { stiffness: 120, damping: 20, mass: 0.3 });
```

- [ ] **Step 2: Apply it to the expanding media card**

Current:

```tsx
        <motion.div
          style={{
            width,
            height,
            borderRadius,
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
            boxShadow: "0 40px 120px -20px rgba(0,0,0,0.8)",
          }}
        >
```

Replace with:

```tsx
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
```

- [ ] **Step 3: Typecheck and verify**

Run: `npx tsc --noEmit -p tsconfig.app.json` — expect clean.

Run: `npm run dev`, scroll fast through any `ScrollZoomSection` (e.g. the one before Services). The expanding card should tilt slightly during the fast scroll and settle flat when you slow down or stop. Confirm it does **not** trigger under `prefers-reduced-motion: reduce` — open DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, reload, scroll: the card should still expand (existing behavior) but check it doesn't introduce new jitter; if reduced-motion users shouldn't get the skew at all, that's the next step.

- [ ] **Step 4: Respect reduced motion**

Current top of component (after the spring config from Step 1):

```tsx
  const scrollVelocity = useVelocity(scrollYProgress);
  const rawSkew = useTransform(scrollVelocity, [-3, 0, 3], [5, 0, -5]);
  const skewY = useSpring(rawSkew, { stiffness: 120, damping: 20, mass: 0.3 });
```

Replace with (zeroes the effect instead of computing it, matching the pattern other motion-heavy components in this codebase use for `prefers-reduced-motion`):

```tsx
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollVelocity = useVelocity(scrollYProgress);
  const rawSkew = useTransform(
    scrollVelocity,
    [-3, 0, 3],
    prefersReducedMotion ? [0, 0, 0] : [5, 0, -5]
  );
  const skewY = useSpring(rawSkew, { stiffness: 120, damping: 20, mass: 0.3 });
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ScrollZoomSection.tsx
git commit -m "feat: add scroll-velocity reactive skew to ScrollZoomSection"
```

---

### Task 4: Retime the text/CTA choreography

**Files:**
- Modify: `src/components/ScrollZoomSection.tsx:49-56`

**Interfaces:** None — internal `useTransform` ranges only.

- [ ] **Step 1: Tighten the fade/overlay windows**

Current:

```tsx
  // Side text fades out as video expands
  const sideOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const sideX_left = useTransform(scrollYProgress, [0, 0.4], [0, -40]);
  const sideX_right = useTransform(scrollYProgress, [0, 0.4], [0, 40]);

  // Foreground title + CTA fade in over the video once it's expanded
  const overlayOpacity = useTransform(scrollYProgress, [0.4, 0.62], [0, 1]);
  const overlayY = useTransform(scrollYProgress, [0.4, 0.62], [30, 0]);
```

Replace with (side text clears out of the way faster — by 0.28 instead of 0.35/0.4 — so there's a brief beat of "just the card" before the overlay arrives, instead of the two overlapping):

```tsx
  // Side text fades out as video expands — clears out before the overlay
  // arrives, so the two never visually overlap mid-transition.
  const sideOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const sideX_left = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const sideX_right = useTransform(scrollYProgress, [0, 0.3], [0, 40]);

  // Foreground title + CTA fade in over the video once it's expanded
  const overlayOpacity = useTransform(scrollYProgress, [0.45, 0.62], [0, 1]);
  const overlayY = useTransform(scrollYProgress, [0.45, 0.62], [30, 0]);
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, scroll slowly through any `ScrollZoomSection`. Watch for the moment the side labels ("Naše" / "Práce" etc.) finish fading before the centered title+CTA fades in — there should be a brief gap, not an overlap, and it should still all complete by the time the card reaches full size.

- [ ] **Step 3: Commit**

```bash
git add src/components/ScrollZoomSection.tsx
git commit -m "tune: retime ScrollZoomSection side-text and overlay choreography"
```

---

### Task 5: Press feedback on magnetic elements

**Files:**
- Modify: `src/hooks/useMagnetic.ts` (full rewrite of the hook body)

**Interfaces:**
- Consumes: nothing new.
- Produces: same return type (`RefObject<HTMLElement>`) — every existing call site (`ServicesSection`, `ScrollZoomSection`, `ContactSection`, `PhilosophySection`, etc.) is unaffected by signature; this is the one shared file all magnetic buttons route through, so the fix lands everywhere at once.

- [ ] **Step 1: Replace the hook body**

Current (full file body):

```tsx
export function useMagnetic(strength: number) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const offsetX = e.clientX - (rect.left + rect.width / 2);
      const offsetY = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${offsetX * strength}px, ${offsetY * strength}px)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = "translate(0px, 0px)";
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
```

Replace with:

```tsx
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
```

- [ ] **Step 2: Typecheck and verify**

Run: `npx tsc --noEmit -p tsconfig.app.json` — expect clean.

Run: `npm run dev`, hover and click any magnetic CTA (e.g. "Začít projekt" in the nav, or a `ScrollZoomSection` CTA). Confirm: the follow-the-cursor motion now eases instead of snapping, and clicking visibly shrinks the button slightly until release.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useMagnetic.ts
git commit -m "feat: add eased transitions and press feedback to useMagnetic"
```

---

## Phase 3 — Performance / mobile hardening

### Task 6: Delete dead `HeroScene3D.tsx`

**Files:**
- Delete: `src/components/HeroScene3D.tsx`

**Interfaces:** None — confirmed zero importers (`grep -rn "HeroScene3D" src` only matches the file's own declaration and `app.tsx`'s comment-free unrelated `Scene3DBackground` import; re-run the grep below before deleting to be sure nothing changed since this plan was written).

- [ ] **Step 1: Re-confirm it's unused**

Run: `grep -rn "HeroScene3D" src --include=*.tsx`

Expected: only `src/components/HeroScene3D.tsx` itself appears (its own `export default function HeroScene3D`). If any other file shows up, stop and investigate before deleting.

- [ ] **Step 2: Delete it**

```bash
git rm src/components/HeroScene3D.tsx
```

- [ ] **Step 3: Typecheck and build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — expect clean (proves nothing referenced it).
Run: `npm run build` — expect a successful Vite build.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: delete unused HeroScene3D component"
```

---

### Task 7: Dedupe the desktop-detection hook

**Files:**
- Create: `src/hooks/useIsDesktop.ts`
- Modify: `src/components/Scene3DBackground.tsx:7-22` (remove local `useCanRender3D`, import the shared hook)

**Interfaces:**
- Produces: `useIsDesktop(): boolean` — true when `window.matchMedia("(min-width: 768px)").matches`, live-updating on resize across the breakpoint. This is the exact behavior `Scene3DBackground`'s local `useCanRender3D` already had (and the deleted `HeroScene3D`'s had too) — just named for what it now also gates in Task 8 (mobile pinned-section height), not only 3D rendering.

- [ ] **Step 1: Create the shared hook**

```ts
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
```

Save as `src/hooks/useIsDesktop.ts`.

- [ ] **Step 2: Use it in `Scene3DBackground.tsx`**

Current (top of file):

```tsx
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Icosahedron } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

// Skips the WebGL canvas on small/touch screens — it's ambient decoration, not
// core content, and isn't worth the GPU/battery cost on mobile.
function useCanRender3D() {
  const [canRender, setCanRender] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setCanRender(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return canRender;
}
```

Replace with:

```tsx
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Icosahedron } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useIsDesktop } from "../hooks/useIsDesktop";
```

(`useEffect`/`useState` are dropped from the React import because `useInput`, further down in the same file, still uses `useEffect`/`useRef` — check that import line separately: it's `import { useEffect, useRef } from "react"` inside no, actually re-check — `useInput()` in this file uses `useRef` and `useEffect` too, both already covered by the React import. Since the top-level `import { Suspense, useEffect, useMemo, useRef, useState } from "react"` was shared by both the deleted hook and the rest of the file, keep `useEffect` and `useRef` in the import — only drop `useState`, which was solely for the deleted local hook.)

Final corrected import line:

```tsx
import { Suspense, useEffect, useMemo, useRef } from "react";
```

Then find the usage at the bottom of the file:

```tsx
export default function Scene3DBackground() {
  const canRender = useCanRender3D();
```

Replace with:

```tsx
export default function Scene3DBackground() {
  const canRender = useIsDesktop();
```

- [ ] **Step 3: Typecheck and verify**

Run: `npx tsc --noEmit -p tsconfig.app.json` — expect clean.

Run: `npm run dev`, resize the browser below/above 768px width. The ambient crystal field should appear above 768px and disappear below it, same as before this change.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useIsDesktop.ts src/components/Scene3DBackground.tsx
git commit -m "refactor: extract shared useIsDesktop hook from Scene3DBackground"
```

---

### Task 8: Shrink pinned-scroll heights on mobile

**Files:**
- Modify: `src/components/ScrollZoomSection.tsx:59-62`, `src/pages/index.tsx:128`, `src/components/ServicesSection.tsx:1-9,167-173`

**Interfaces:**
- Consumes: `useIsDesktop` from `src/hooks/useIsDesktop.ts` (Task 7) — only in `ServicesSection.tsx`, since its height is computed in JS, not a static Tailwind value.

- [ ] **Step 1: `ScrollZoomSection.tsx` — static height, use Tailwind responsive classes**

Current:

```tsx
    <section
      ref={ref}
      style={{ height: "250vh", position: "relative" }}
    >
```

Replace with:

```tsx
    <section
      ref={ref}
      className="h-[180vh] md:h-[250vh]"
      style={{ position: "relative" }}
    >
```

- [ ] **Step 2: `index.tsx` hero section — same fix**

Current (`Index` component, hero section):

```tsx
      <section ref={heroRef} style={{ height: "250vh", position: "relative" }}>
```

Replace with:

```tsx
      <section ref={heroRef} className="h-[180vh] md:h-[250vh]" style={{ position: "relative" }}>
```

- [ ] **Step 3: `ServicesSection.tsx` — computed height, needs the hook**

Current top imports:

```tsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, Bot, Target, Megaphone } from "lucide-react";
import ScrambleText from "./ScrambleText";
import SectionHeading from "./SectionHeading";
import { useMagnetic } from "../hooks/useMagnetic";
import { useTilt } from "../hooks/useTilt";
```

Replace with (adds the new hook import):

```tsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, Bot, Target, Megaphone } from "lucide-react";
import ScrambleText from "./ScrambleText";
import SectionHeading from "./SectionHeading";
import { useMagnetic } from "../hooks/useMagnetic";
import { useTilt } from "../hooks/useTilt";
import { useIsDesktop } from "../hooks/useIsDesktop";
```

Current (inside `ServicesSection`, near the top of the component body):

```tsx
export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ctaMagnetic = useMagnetic(0.3);
  const prevMagnetic = useMagnetic(0.3);
  const nextMagnetic = useMagnetic(0.3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
```

Replace with:

```tsx
export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ctaMagnetic = useMagnetic(0.3);
  const prevMagnetic = useMagnetic(0.3);
  const nextMagnetic = useMagnetic(0.3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const isDesktop = useIsDesktop();
```

Current (the section element using the computed height):

```tsx
    <section
      id="services"
      ref={sectionRef}
      className="relative"
      style={{ height: `${services.length * 100}vh` }}
    >
```

Replace with:

```tsx
    <section
      id="services"
      ref={sectionRef}
      className="relative"
      style={{ height: `${services.length * (isDesktop ? 100 : 70)}vh` }}
    >
```

- [ ] **Step 4: Typecheck and verify**

Run: `npx tsc --noEmit -p tsconfig.app.json` — expect clean.

Run: `npm run dev`, open DevTools device toolbar, switch to a mobile viewport (e.g. 390×844), and scroll through the hero, any `ScrollZoomSection`, and the Services section. Each should complete its pin-and-zoom/horizontal-scroll effect over noticeably less scroll distance than on desktop, but still fully complete (card reaches full size, last service card becomes reachable) before releasing the pin. Switch back to a desktop-width viewport and confirm scroll distances are unchanged from before this task.

- [ ] **Step 5: Commit**

```bash
git add src/components/ScrollZoomSection.tsx src/pages/index.tsx src/components/ServicesSection.tsx
git commit -m "perf: shorten pinned-scroll section heights on mobile"
```
