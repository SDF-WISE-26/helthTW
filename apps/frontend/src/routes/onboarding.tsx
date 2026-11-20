import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "@/features/onboarding/onboarding-page";
import { beforeOnboardingLoad } from "@/features/onboarding/onboarding-navigation";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: beforeOnboardingLoad,
  component: OnboardingPage,
});
