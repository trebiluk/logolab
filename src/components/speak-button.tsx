import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function pickVoice(lang: string) {
  const voices = window.speechSynthesis.getVoices();
  const prefix = lang.slice(0, 2).toLowerCase();
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase())) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ??
    null
  );
}

export function SpeakButton({
  text,
  lang = "en-US",
  label = "Read aloud",
}: {
  text: string;
  lang?: string;
  label?: string;
}) {
  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const go = () => {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.92;
      const voice = pickVoice(lang);
      if (voice) u.voice = voice;
      window.speechSynthesis.speak(u);
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", go, { once: true });
      window.setTimeout(go, 300);
    } else {
      go();
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-11 shrink-0 text-muted"
      onClick={speak}
      aria-label={label}
    >
      <Volume2 />
    </Button>
  );
}
