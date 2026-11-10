import { createFileRoute } from "@tanstack/react-router";
import { ThemeSwitch } from "@/features/settings/theme-switch";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <>
      <h1 className="text-2xl font-bold">Einstellungen</h1>
      <ThemeSwitch />
    </>
  );
}
