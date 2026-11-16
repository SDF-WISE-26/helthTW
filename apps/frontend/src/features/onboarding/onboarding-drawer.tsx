import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { onboardingContent as content } from "@/content/onboarding";
import { OnboardingFlow } from "./onboarding-flow";
import type { OnboardingStep } from "./onboarding-navigation";

export function OnboardingDrawer() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<OnboardingStep>("welcome");

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) setStep("welcome");
    setOpen(nextOpen);
  }

  return (
    <Drawer open={open} onOpenChange={changeOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">{content.actions.restart}</Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90dvh] data-[vaul-drawer-direction=bottom]:max-h-[90dvh]">
        <DrawerTitle className="sr-only">{content.welcome.title}</DrawerTitle>
        <DrawerDescription className="sr-only">{content.welcome.description}</DrawerDescription>
        {open && (
          <OnboardingFlow
            step={step}
            onStepChange={setStep}
            onFinish={() => setOpen(false)}
            embedded
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
