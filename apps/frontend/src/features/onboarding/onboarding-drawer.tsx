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

export function OnboardingDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">{content.actions.restart}</Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90dvh] bg-background data-[vaul-drawer-direction=bottom]:max-h-[90dvh]">
        <DrawerTitle className="sr-only">{content.welcome.title}</DrawerTitle>
        <DrawerDescription className="sr-only">{content.welcome.description}</DrawerDescription>
        {open && <OnboardingFlow onFinish={() => setOpen(false)} embedded />}
      </DrawerContent>
    </Drawer>
  );
}
