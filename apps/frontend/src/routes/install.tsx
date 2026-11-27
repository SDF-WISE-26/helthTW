import { createFileRoute } from "@tanstack/react-router";
import { InstallGuide } from "@/features/install/install-guide";

// TODO (#96): Clarify whether the pre-existing /install route can be removed.
// Home and settings use the drawer.
export const Route = createFileRoute("/install")({
  component: InstallGuide,
});
