import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
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
