import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle() {
  const [soundOn, setSoundOn] = useState(false);

  return (
    <button
      onClick={() => setSoundOn((prev) => !prev)}
      data-cursor-hover
      aria-label={soundOn ? "Vypnout zvuk" : "Zapnout zvuk"}
      className="fixed bottom-6 right-6 z-50 liquid-glass rounded-full p-3 hover:bg-white/5 transition-colors"
    >
      {soundOn ? (
        <Volume2 className="w-4 h-4 text-indigo-300" />
      ) : (
        <VolumeX className="w-4 h-4 text-white/50" />
      )}
    </button>
  );
}
