import { AlertCircleIcon, AudioLinesIcon, PhoneOffIcon } from "lucide-react";
import { cn } from "cn";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { VoiceState } from "./chat-voice-session";

const LABELS: Record<Exclude<VoiceState, "idle">, string> = {
  connecting: "Verbinde …",
  listening: "Ich höre dir zu",
  thinking: "Ich denke nach …",
  speaking: "Ich spreche",
};

export function ChatVoiceBar({
  state,
  onStop,
}: {
  state: Exclude<VoiceState, "idle">;
  onStop: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-input bg-background p-3">
      <AudioLinesIcon
        className={cn(
          "size-5 text-blue-600 dark:text-blue-400",
          state !== "connecting" && "animate-pulse",
        )}
      />
      <span role="status" className="flex-1 text-sm">
        {LABELS[state]}
      </span>
      <Button variant="destructive" size="sm" className="rounded-full" onClick={onStop}>
        <PhoneOffIcon />
        Beenden
      </Button>
    </div>
  );
}

export function ChatVoiceError({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <Alert variant="destructive" className="mb-3">
      <AlertCircleIcon />
      <AlertDescription className="flex items-center justify-between gap-2">
        {message}
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          OK
        </Button>
      </AlertDescription>
    </Alert>
  );
}
