import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { emergencyContent } from "@/content/emergency";
import { EmergencyScreen } from "@/features/emergency/emergency-screen";

// Shown when the model calls show_crisis: only fixed, reviewed text, nothing the model wrote.
// Opens the same emergency sheet as the help button right away, the banner stays in the chat.
export function ChatCrisis() {
  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-2xl bg-destructive/10 p-4 text-foreground ring-1 ring-destructive/30"
    >
      <p className="text-label">{emergencyContent.title}</p>
      <p className="text-small">{emergencyContent.instructions}</p>
      <Drawer defaultOpen>
        <DrawerContent>
          <div className="min-h-0 overflow-y-auto px-4 pb-6">
            <EmergencyScreen />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
