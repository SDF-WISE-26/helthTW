import { ChevronRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { installContent as content } from "@/content/install";
import { InstallDrawer } from "./install-drawer";
import { useInstallStatus } from "./use-install-status";

export function IncidentInstallHint() {
  const { platform, isInstalled } = useInstallStatus();

  if (platform !== "ios" || isInstalled) return null;

  return (
    <aside className="mt-auto shrink-0">
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
              {content.ios.incidentHint}
            </span>
          </span>
          <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
        </Button>
      </InstallDrawer>
    </aside>
  );
}
