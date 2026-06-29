import { useEffect } from "react";

// Browsers cap how many <video autoPlay> elements can actually decode at
// once. With this many video sections on the page, autoplaying all of them
// on load makes most silently fail to start. Instead, only play videos that
// are actually on screen and pause the rest.
//
// A single play() call on enter-viewport isn't enough: if the video hasn't
// buffered enough data yet, the browser rejects that call and nothing
// retries it, leaving the video frozen on its first frame ("looks like a
// static image"). So every video that's currently meant to be playing is
// retried on 'canplay'/'loadeddata', and again whenever the tab regains
// visibility (backgrounding a tab can silently drop playback).
export default function VideoManager() {
  useEffect(() => {
    const shouldPlay = new WeakSet<HTMLVideoElement>();

    const tryPlay = (video: HTMLVideoElement) => {
      if (shouldPlay.has(video) && video.paused) {
        video.play().catch(() => {});
      }
    };

    const onCanPlay = (e: Event) => tryPlay(e.target as HTMLVideoElement);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            shouldPlay.add(video);
            tryPlay(video);
          } else {
            shouldPlay.delete(video);
            video.pause();
          }
        }
      },
      { threshold: 0.1, rootMargin: "200px 0px" },
    );

    const watched = new WeakSet<HTMLVideoElement>();
    const observeAll = () => {
      document.querySelectorAll("video").forEach((video) => {
        if (watched.has(video as HTMLVideoElement)) return;
        watched.add(video as HTMLVideoElement);
        observer.observe(video);
        video.addEventListener("canplay", onCanPlay);
        video.addEventListener("loadeddata", onCanPlay);
      });
    };

    observeAll();

    // New videos can mount later (route changes, lazy sections), so keep
    // watching the DOM for additions.
    const mutationObserver = new MutationObserver(observeAll);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // A backgrounded tab can pause/drop video decoding outside our control —
    // re-assert playback for everything currently flagged as on-screen.
    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      document.querySelectorAll("video").forEach((video) => tryPlay(video as HTMLVideoElement));
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.querySelectorAll("video").forEach((video) => {
        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("loadeddata", onCanPlay);
      });
    };
  }, []);

  return null;
}
