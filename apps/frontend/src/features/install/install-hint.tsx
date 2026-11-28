import { ChevronRight, Smartphone, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { installContent as content } from "@/content/install";
import { InstallDrawer } from "./install-drawer";
import { useInstallStatus } from "./use-install-status";

const STORAGE_KEY = "helthtw:install-card-dismissed";

type InstallHintProps = {
  iosOnly?: boolean;
  dismissible?: boolean;
};

function getIsDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function InstallHint({ iosOnly = false, dismissible = false }: InstallHintProps) {
  const { platform, isInstalled } = useInstallStatus();
  const [isDismissed, setIsDismissed] = useState(getIsDismissed);

  function dismissHint() {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Storage blocked: the hint still hides for this visit.
    }
  }

  if (
    platform === "other" ||
    isInstalled ||
    (iosOnly && platform !== "ios") ||
    (dismissible && isDismissed)
  ) {
    return null;
  }

  return (
    <aside className="relative mt-auto shrink-0">
      <InstallDrawer>
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-h-20 w-full justify-start gap-3 rounded-2xl bg-card p-4 text-left text-card-foreground ring-1 ring-foreground/5 whitespace-normal"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Smartphone aria-hidden="true" className="size-5" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-base font-semibold">{content.actions.install}</span>
            <span className="text-sm leading-relaxed font-normal text-muted-foreground">
              {content.card.description}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="flex size-5 shrink-0 items-center justify-center text-muted-foreground"
          >
            {!dismissible && <ChevronRight className="size-5" />}
          </span>
        </Button>
      </InstallDrawer>
      {dismissible && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-1 my-auto size-tap-min translate-none! text-muted-foreground"
          aria-label={content.card.dismissLabel}
          onClick={dismissHint}
        >
          <X aria-hidden="true" className="size-5" />
        </Button>
      )}
    </aside>
  );
}
