import { useNavigate } from "@tanstack/react-router";
import { OnboardingFlow } from "./onboarding-flow";
import { completeOnboarding } from "./onboarding-navigation";

export function OnboardingPage() {
  const navigate = useNavigate({ from: "/onboarding" });

  function finishOnboarding() {
    completeOnboarding();
    void navigate({ to: "/", replace: true });
  }

  return <OnboardingFlow onFinish={finishOnboarding} />;
}
