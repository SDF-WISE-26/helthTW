import type { ReactElement } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { installContent as content } from "@/content/install";
import { InstallGuide } from "./install-guide";
import { useInstallStatus } from "./use-install-status";

export function InstallDrawer({ children }: { children?: ReactElement }) {
  const [open, setOpen] = useState(false);
  const { isInstalled, platform } = useInstallStatus();

  if (isInstalled || platform === "other") return null;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children ?? (
          <Button type="button" variant="outline" className="min-h-12 text-base">
            {content.actions.openGuide}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-5 text-left">
          <DrawerTitle>{content.title}</DrawerTitle>
          <DrawerDescription>{content.description}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>{open && <InstallGuide />}</DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="min-h-12 text-base">
              {content.actions.close}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
