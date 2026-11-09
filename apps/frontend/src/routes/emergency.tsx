import { createFileRoute } from "@tanstack/react-router";
import { EmergencyScreen } from "@/features/emergency/emergency-screen";

export const Route = createFileRoute("/emergency")({
  component: EmergencyScreen,
});
