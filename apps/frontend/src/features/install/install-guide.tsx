import { useState } from "react";
import { Button } from "@/components/ui/button";
import { installContent as content } from "@/content/install";
import { requestInstallation } from "./install-status";
import type { InstallOutcome } from "./install-status";
import { useInstallStatus } from "./use-install-status";

export function InstallGuide() {
  const { platform, isInstalled, canInstall } = useInstallStatus();
  const [isInstalling, setIsInstalling] = useState(false);
  const [outcome, setOutcome] = useState<InstallOutcome | null>(null);
  const [hasError, setHasError] = useState(false);

  // TODO (#96): Test the native prompt on a real Android device over HTTPS
  // (accept, dismiss, and check that installation hints stay hidden in app mode).
  async function installApp() {
    setIsInstalling(true);
    setHasError(false);
    setOutcome(null);

    try {
      setOutcome(await requestInstallation());
    } catch {
      setHasError(true);
    } finally {
      setIsInstalling(false);
    }
  }

  if (isInstalled) return <p>{content.alreadyInstalled}</p>;

  return (
    <div className="space-y-5 text-base leading-relaxed">
      {platform === "android" && (
        <>
          <p>{content.android.description}</p>
          {(canInstall || isInstalling) && (
            <Button
              type="button"
              className="min-h-12 w-full text-base"
              disabled={isInstalling}
              onClick={() => void installApp()}
            >
              {isInstalling ? content.actions.installing : content.actions.install}
            </Button>
          )}
          {!canInstall && !isInstalling && outcome !== "accepted" && (
            <p>{content.android.manualInstall}</p>
          )}
          {outcome === "accepted" && <p role="status">{content.android.accepted}</p>}
          {outcome === "dismissed" && <p role="status">{content.android.dismissed}</p>}
          {hasError && <p role="alert">{content.android.error}</p>}
        </>
      )}

      {platform === "ios" && (
        <>
          <p>{content.ios.description}</p>
          <ol className="list-decimal space-y-3 pl-5">
            {content.ios.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="rounded-lg border border-border bg-muted p-4 text-sm leading-relaxed">
            {content.ios.pushHint}
          </p>
        </>
      )}

      {platform === "other" && <p>{content.unsupportedPlatform}</p>}
    </div>
  );
}
