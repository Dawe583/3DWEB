# SiteSpot — Premium Upgrade Design

**Date:** 2026-06-29
**Goal:** Push the visual and technical quality of the existing site to a noticeably higher level — without a rewrite, without breaking the cross-section continuity (the scroll-zoom narrative from Hero → Services → Showcase → Testimonials → Process → Contact).

## Guiding decisions (from brainstorming)

- Push on **visual polish** and **technical excellence/speed**, not new content or new conversion mechanics.
- Keep the current **glassmorphism / dark / indigo-purple** identity — refine it, don't replace it.
- **Desktop gets full power.** Mobile must work well, but isn't held to the same "wow" bar — it gets simplified, not equally elaborate, versions of the same sections.
- Keep **one** consistent transition pattern between sections (`ScrollZoomSection`) and make it excellent, rather than introducing 2–3 alternating transition types.
- No specific current complaint — this is a general-quality pass, grounded in concrete gaps found in the code (below), not invented ones.
- Single design doc, three implementation phases, each independently shippable.

## What's actually wrong today (found by reading the code, not guessing)

1. **`font-family: Inter, sans-serif` is never backed by a loaded font.** `index.css` only imports Instrument Serif and JetBrains Mono. Every paragraph and most headings render in whatever sans-serif the OS substitutes — Helvetica on macOS, Arial on Windows, Roboto on Android. This alone undercuts "premium" more than anything else, because it's invisible-but-felt: inconsistent kerning/weight across devices.
2. **A shared motion system exists and is unused.** `src/lib/motion.ts` defines `EASE_OUT`, `EASE_IN_OUT`, `DUR.{fast,base,slow}`, `riseIn`, `staggerContainer`, `inViewOnce` — but almost every section (`ProcessSection`, `ShowcaseSection`, `TestimonialsSection`, etc.) hand-rolls its own `transition={{ duration: 0.6, delay: i * 0.12 }}` and `viewport={{ margin: "-60px" }}`. The values are close but not identical (0.4 vs 0.6 vs 0.7 vs 0.9 vs 1s durations; -60px vs -80px margins) — this is the actual source of the subtle "not quite cohesive" feeling, not a styling problem.
3. **No spacing/type-scale tokens** — only two color custom properties exist (`--accent-1`, `--accent-2`). Section vertical rhythm (`mt-12`/`mt-16`/`mt-20`/`py-28`/`py-40`) is picked ad hoc per component.
4. **Heavy pinned-scroll stacking.** Hero (`250vh`) + six `ScrollZoomSection` instances (`250vh` each) + `ServicesSection` (`services.length * 100vh`) + a live `HeroScene3D`/`Scene3DBackground` Three.js canvas. Fine on desktop; this is the literal reason mobile needs a separate, lighter path, and also why the preview tooling itself struggled to screenshot the page during earlier work in this session.

## Phase 1 — Foundation (typography, tokens, motion consolidation)

**Why first:** every later visual/motion change inherits whatever baseline exists. Fixing the font and unifying motion values is the highest ratio of "looks expensive" to "lines changed."

- **Self-host/properly load fonts.** Add `Inter` (variable weight) alongside the existing `Instrument Serif` and `JetBrains Mono` Google Fonts `@import`, with `font-display: swap`. Add a metric-compatible fallback stack (`Inter, "Inter Fallback", system-ui, sans-serif`) so swap-in doesn't cause a layout jump on slow connections.
- **Type-scale tokens.** Add CSS custom properties for a small fixed scale (e.g. `--text-xs` … `--text-display`) matching the sizes already in use across the site (no new sizes invented — just named and centralized), so headings/body stop drifting component-to-component.
- **Spacing tokens.** Add a small set (`--space-section-y`, `--space-stack-sm/md/lg`) mapped to the rhythm already established by the most common Tailwind values in use (`py-28 md:py-40`, `mt-16`), and migrate sections to them so vertical rhythm is consistent without changing how any single section currently looks.
- **Motion consolidation.** Audit every `whileInView`/`transition` call outside `lib/motion.ts` and replace hand-rolled duration/delay/viewport values with `riseIn`, `staggerContainer`, `inViewOnce`, `DUR`, `EASE_OUT`/`EASE_IN_OUT`. Where a section needs a variant not yet in `motion.ts` (e.g. the horizontal card stagger in `ServicesSection`), add it to `motion.ts` rather than inlining it, so the library stays the single source of truth.

**Out of scope for Phase 1:** no new visual elements, no copy changes, no new colors. This phase is invisible-but-felt, same as the bug it's fixing.

## Phase 2 — Motion & transition polish (the `ScrollZoomSection` backbone)

**Why this, not new transition types:** the brainstorm explicitly chose consistency over variety. The lever is depth of polish on the one mechanism already carrying every section transition.

- **Scroll-velocity reactivity.** Derive scroll velocity from Lenis (already running in `SmoothScroll.tsx`) and apply a subtle `skewY`/blur-via-opacity-layering response on the expanding media card during fast scroll — reads as "this thing has mass," removed at low velocity so it never looks glitchy.
- **Asymmetric in/out timing.** Apply the exit-faster-than-enter motion guideline already named in the project's design knowledge: tighten the collapse/exit half of each `ScrollZoomSection`'s spring relative to its expand/enter half (currently symmetric `springConfig`).
- **Text choreography pass.** Tighten the `overlayOpacity`/`overlayY` and `sideOpacity`/`sideX` timing windows in `ScrollZoomSection` so the side labels, the expanding media, and the centered CTA feel like one staged sequence instead of three independent fades — likely a matter of re-spacing the `scrollYProgress` input ranges (`[0, 0.35]`, `[0.4, 0.62]`, etc.), not new logic.
- **Micro-interaction depth on `useMagnetic`/`useTilt` consumers.** Add press/release feedback (subtle scale per the existing UI guidelines) and ensure every magnetic CTA and tilted card shares one feel (same spring constants, sourced from `lib/motion.ts` once Phase 1 lands).

**No new dependency.** Everything above is achievable with Framer Motion's existing `useScroll`/`useTransform`/`useSpring`, plus the Lenis instance already mounted.

## Phase 3 — Performance & mobile hardening

**Why last:** depends on nothing from Phase 1/2, but should land after the visuals are finalized so we're tuning the real, final scene — not a moving target.

- **Conditional 3D scene cost.** On mobile (matches existing `md` breakpoint convention) or when `navigator.deviceMemory`/`hardwareConcurrency` signals a low-end device: render `HeroScene3D`/`Scene3DBackground` with `frameloop="demand"` and a capped `dpr` (e.g. `[1, 1.5]` instead of full device pixel ratio), instead of removing the 3D entirely — it still works, it just stops repainting every frame when nothing is animating.
- **Lazy-load the Three.js bundle.** Dynamic-`import()` the 3D components so their (sizeable) JS doesn't block first paint on mobile; show the existing `LoadingScreen`/a static gradient placeholder until it resolves.
- **Shorter pinned sections on mobile.** Reduce the `250vh`/`100vh-per-item` pin heights for `ScrollZoomSection` and `ServicesSection` under the `md` breakpoint (e.g. `180vh`, tuned by feel) — the scroll-jacked effect still reads, it just doesn't demand as much scroll distance on a screen where that distance is relatively more of the user's effort.
- **Extend the existing video lazy-loading work.** This session already added `preload="none"` + `preconnect` + `VideoManager`'s IntersectionObserver-gated `play()`. Phase 3 extends the same pattern: confirm every video consumer (including ones added before this spec) follows it, and skip mounting `HlsVideo`/`<video>` sources at all for sections that are many viewports below the fold until they're within `VideoManager`'s `rootMargin`.

## Testing / validation

- **Phase 1:** visual diff by eye (font now renders identically across a couple of OS/browsers if testable; type/spacing tokens applied without visual regressions) + `tsc --noEmit` clean.
- **Phase 2:** manual scroll-through on desktop preview, confirm no jank, confirm `prefers-reduced-motion` still disables the velocity-reactive effect (existing reduced-motion handling in the codebase must keep covering new motion).
- **Phase 3:** Lighthouse mobile run before/after (or manual DevTools mobile throttling) to confirm TTI/CLS improvement; manual check that desktop visuals are pixel-identical to pre-Phase-3 (mobile-only code paths shouldn't touch desktop).

## Non-goals

- No new sections, no new copy/content, no new color palette or typography *style* (serif/sans choices stay).
- No new transition types alongside `ScrollZoomSection`.
- No new npm dependencies — everything above uses Framer Motion, Lenis, Three.js, and Tailwind, all already installed.
