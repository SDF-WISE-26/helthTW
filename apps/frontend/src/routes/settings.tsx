import { createFileRoute } from "@tanstack/react-router";
import { DeleteAllData } from "@/features/account/delete-all-data";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <>
      <h1 className="text-2xl font-bold">Einstellungen</h1>
      <DeleteAllData />
    </>
  );
}
