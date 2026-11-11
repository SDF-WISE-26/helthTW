import { createFileRoute } from "@tanstack/react-router";
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";
import {
  beforeOnboardingLoad,
  validateOnboardingSearch,
} from "@/features/onboarding/onboarding-navigation";

export const Route = createFileRoute("/onboarding")({
  validateSearch: validateOnboardingSearch,
  beforeLoad: beforeOnboardingLoad,
  component: OnboardingFlow,
});
