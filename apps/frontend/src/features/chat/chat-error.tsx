import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type ChatErrorProps = {
  error: Error;
  onRetry: () => void;
  onNewChat: () => void;
  onDismiss: () => void;
};

// backend responds with { error: { code, message } }, and useChat puts that body into error.message
// if response isn't parseable, the request never got a proper response from the server (network issue).
function hasApiCode(error: Error): boolean {
  try {
    return !!JSON.parse(error.message)?.error?.code;
  } catch {
    return false;
  }
}

export function ChatError({ error, onRetry, onNewChat, onDismiss }: ChatErrorProps) {
  const description = hasApiCode(error)
    ? "Dein Helfer ist leider zur Zeit nicht verfügbar. Bitte versuche es später erneut."
    : "Der Server konnte nicht erreicht werden. Überprüfe deine Verbindung und versuche es erneut.";

  return (
    <Alert variant="destructive" className="mb-3">
      <AlertCircleIcon />
      <AlertTitle>Etwas ist falsch...</AlertTitle>
      <AlertDescription>
        <p>{description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
          <Button size="sm" variant="outline" onClick={onNewChat}>
            New chat
          </Button>
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
