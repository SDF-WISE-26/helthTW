import { useBlocker, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { completeOnboarding } from "./onboarding-navigation";
import type { OnboardingStep } from "./onboarding-navigation";
import { SplashScreen } from "./splash-screen";
import { WelcomeScreen } from "./welcome-screen";
import { UsageSelectionScreen } from "./usage-selection-screen";
import { InformationScreen } from "./information-screen";
import { TutorialScreen } from "./tutorial-screen";
import { ThankYouScreen } from "./thank-you-screen";

// TODO (#95): Replace the fixed splash duration with actual app initialization logic.
const SPLASH_DURATION_MS = 1500;

export function OnboardingFlow() {
  const navigate = useNavigate({ from: "/onboarding" });
  const { step } = useSearch({ from: "/onboarding" });

  useBlocker({
    enableBeforeUnload: false,
    shouldBlockFn: ({ action, next }) =>
      (action === "BACK" || action === "GO") &&
      (step === "splash" || step === "welcome" || next.pathname !== "/onboarding"),
  });

  useEffect(() => {
    if (step !== "splash") return;

    const timer = window.setTimeout(() => {
      void navigate({ to: "/onboarding", search: { step: "welcome" }, replace: true });
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [navigate, step]);

  function goToStep(nextStep: OnboardingStep) {
    void navigate({ to: "/onboarding", search: { step: nextStep } });
  }

  function finishOnboarding() {
    completeOnboarding();
    void navigate({ to: "/", replace: true });
  }

  if (step === "splash") {
    return <SplashScreen />;
  }

  if (step === "welcome") {
    return (
      <WelcomeScreen onContinue={() => goToStep("usage-selection")} onSkip={finishOnboarding} />
    );
  }

  if (step === "usage-selection") {
    return (
      <UsageSelectionScreen
        onExplore={() => goToStep("information")}
        onContinue={() => goToStep("tutorial")}
      />
    );
  }
  if (step === "information") {
    return <InformationScreen onContinue={() => goToStep("tutorial")} onSkip={finishOnboarding} />;
  }

  if (step === "tutorial") {
    return <TutorialScreen onContinue={() => goToStep("thank-you")} onSkip={finishOnboarding} />;
  }

  return <ThankYouScreen onFinish={finishOnboarding} />;
}
