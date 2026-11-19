import { SparklesIcon } from "lucide-react";

export function ChatAiNotice() {
  return (
    <div className="text-muted-foreground flex shrink-0 items-center justify-center gap-1.5 px-4 py-2 text-caption">
      <SparklesIcon className="size-3.5" aria-hidden />
      <span>Du chattest mit einer KI, nicht mit einem Menschen.</span>
    </div>
  );
}
