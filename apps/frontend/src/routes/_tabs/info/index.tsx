import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/features/info/info-page";

export const Route = createFileRoute("/_tabs/info/")({
  component: InfoPage,
});
