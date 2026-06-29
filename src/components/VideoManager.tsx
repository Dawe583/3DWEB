import { useEffect } from "react";

// Browsers cap how many <video> elements can actually decode at once, so we
// can't just autoplay every video on the page — most would silently fail to
// start. The rule here: a video plays only while it's actually on screen, and
// is paused otherwise.
//
// This used to be driven by an IntersectionObserver, but the observer proved
// unreliable on this page — cards inside horizontally-translated / 3D-tilted
// tracks (the Services carousel) never got flagged as intersecting even when
// plainly visible, so they sat frozen on their first frame. So instead we ask
// each video where it actually is via getBoundingClientRect. One controller,
// no fragile heuristics, no fighting between two mechanisms.
//
// `sync()` runs on every scroll (rAF-throttled), when the tab becomes visible
// again (backgrounding can drop playback), and on a steady interval as a
// backstop — the interval also retries any play() that was rejected because
// the video hadn't buffered yet (the reject is swallowed and simply retried
// next tick).
export default function VideoManager() {
  useEffect(() => {
    const sync = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      document.querySelectorAll("video").forEach((el) => {
        const video = el as HTMLVideoElement;
        const r = video.getBoundingClientRect();
        const onScreen = r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
        if (onScreen) {
          if (video.paused) {
            // Re-assert muted/playsInline before playing: React sets `muted` as
            // an attribute that doesn't always sync to the DOM property, and a
            // non-muted video has its autoplay blocked by the browser.
            video.muted = true;
            video.playsInline = true;
            video.play().catch(() => {});
          }
        } else if (!video.paused) {
          video.pause();
        }
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        sync();
        ticking = false;
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") sync();
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    // Backstop for videos that mount late (route changes, lazy sections) and
    // for play() calls rejected before the video had buffered.
    const interval = window.setInterval(sync, 800);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
