import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { installContent as content } from "@/content/install";
import { InstallDrawer } from "./install-drawer";
import { useInstallStatus } from "./use-install-status";

const STORAGE_KEY = "helthtw:install-card-dismissed";

function getIsDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function InstallCard() {
  const { platform, isInstalled } = useInstallStatus();
  const [isDismissed, setIsDismissed] = useState(getIsDismissed);

  function dismissCard() {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Storage blocked: the card still hides for this visit.
    }
  }

  if (isDismissed || isInstalled || platform === "other") return null;

  return (
    <Card className="relative shrink-0 rounded-[12px] py-0">
      <InstallDrawer>
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-h-16 justify-start rounded-none py-4 pr-16 pl-4 text-left text-base whitespace-normal focus-visible:ring-inset"
        >
          {content.card.label}
        </Button>
      </InstallDrawer>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 size-tap-min"
        aria-label={content.card.dismissLabel}
        onClick={dismissCard}
      >
        <X aria-hidden="true" />
      </Button>
    </Card>
  );
}
