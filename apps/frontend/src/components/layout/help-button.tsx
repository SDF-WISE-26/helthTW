import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { EmergencyScreen } from "@/features/emergency/emergency-screen";

// Opens the emergency screen from anywhere as drawer, offline and without an account.
export function HelpButton() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="lg" className="bg-destructive font-bold text-white hover:bg-destructive/90">
          Hilfe
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[90dvh]">
        <div className="min-h-0 overflow-y-auto px-4 pb-6">
          <EmergencyScreen />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
