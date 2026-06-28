import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface ScrambleTextProps {
  text: string;
  duration?: number;
}

export default function ScrambleText({ text, duration = 1200 }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const length = text.length;
    const frameMs = 35;
    const totalFrames = Math.max(1, Math.round(duration / frameMs));
    let frame = 0;

    const interval = setInterval(() => {
      frame += 1;
      const revealCount = Math.floor((frame / totalFrames) * length);

      const next = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < revealCount) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplay(next);

      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(interval);
      }
    }, frameMs);

    return () => clearInterval(interval);
  }, [text, duration]);

  return <span>{display}</span>;
}
