import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "@/features/onboarding/onboarding-page";
import {
  beforeOnboardingLoad,
  validateOnboardingSearch,
} from "@/features/onboarding/onboarding-navigation";

export const Route = createFileRoute("/onboarding")({
  validateSearch: validateOnboardingSearch,
  beforeLoad: beforeOnboardingLoad,
  component: OnboardingPage,
});
