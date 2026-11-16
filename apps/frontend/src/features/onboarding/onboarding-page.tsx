import { useBlocker, useNavigate, useSearch } from "@tanstack/react-router";
import { OnboardingFlow } from "./onboarding-flow";
import { completeOnboarding } from "./onboarding-navigation";
import type { OnboardingStep } from "./onboarding-navigation";

export function OnboardingPage() {
  const navigate = useNavigate({ from: "/onboarding" });
  // TODO (#95): URL-based onboarding steps (?step=...) or local component state (useState).
  const { step } = useSearch({ from: "/onboarding" });

  useBlocker({
    enableBeforeUnload: false,
    shouldBlockFn: ({ action, next }) =>
      (action === "BACK" || action === "GO") &&
      (step === "welcome" || next.pathname !== "/onboarding"),
  });

  function goToStep(nextStep: OnboardingStep) {
    void navigate({ to: "/onboarding", search: { step: nextStep } });
  }

  function finishOnboarding() {
    completeOnboarding();
    void navigate({ to: "/", replace: true });
  }

  return <OnboardingFlow step={step} onStepChange={goToStep} onFinish={finishOnboarding} />;
}
