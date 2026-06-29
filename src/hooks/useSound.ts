import { useEffect, useRef, useState } from "react";

let sharedCtx: AudioContext | null = null;
const getCtx = () => {
  if (!sharedCtx) sharedCtx = new AudioContext();
  return sharedCtx;
};

function blip(freq: number, duration: number, gainPeak: number) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  gain.gain.linearRampToValueAtTime(gainPeak, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

/** Subtle opt-in UI sounds on hover/click of [data-cursor-hover] elements. */
export function useSoundFx() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem("ss_sound") === "1");
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    localStorage.setItem("ss_sound", enabled ? "1" : "0");
  }, [enabled]);

  useEffect(() => {
    const onOver = (e: Event) => {
      if (!enabledRef.current) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor-hover]")) blip(740, 0.08, 0.03);
    };
    const onDown = (e: Event) => {
      if (!enabledRef.current) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor-hover]")) blip(420, 0.1, 0.05);
    };
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
    };
  }, []);

  return { enabled, setEnabled };
}
