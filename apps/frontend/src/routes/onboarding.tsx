import { createFileRoute } from "@tanstack/react-router";
import { SplashScreen } from "@/features/onboarding/splash-screen";

export const Route = createFileRoute("/onboarding")({
  component: SplashScreen,
});
