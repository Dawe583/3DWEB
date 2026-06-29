import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HlsVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

// Plays both plain mp4 and adaptive .m3u8 (Mux) streams through one <video>
// element, so VideoManager's viewport-based autoplay (which just queries
// every <video> in the DOM) keeps working unchanged for either source type.
//
// Note: there's no reliable cross-browser way to force a specific HLS
// rendition — Safari's native HLS engine doesn't expose manual level
// selection on <video>, so ABR always picks its own starting quality. Reserve
// .m3u8 sources for small displays (cards) where any rendition looks sharp;
// use plain mp4 wherever the video is shown large.
export default function HlsVideo({ src, ...props }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!src.endsWith(".m3u8")) {
      video.src = src;
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [src]);

  return <video ref={videoRef} {...props} />;
}
