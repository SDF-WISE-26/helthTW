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
import { Progress } from "@/components/ui/progress";

// TODO (#95): Replace the fixed splash duration with actual app initialization logic.
const SPLASH_DURATION_MS = 1500;

const progressSteps = {
  welcome: 1,
  "usage-selection": 2,
  information: 3,
  tutorial: 4,
  "thank-you": 5,
} as const;

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

  const progress = progressSteps[step];

  return (
    <>
      {step === "welcome" && (
        <WelcomeScreen onContinue={() => goToStep("usage-selection")} onSkip={finishOnboarding} />
      )}

      {step === "usage-selection" && (
        <UsageSelectionScreen
          onExplore={() => goToStep("information")}
          onContinue={() => goToStep("tutorial")}
        />
      )}

      {step === "information" && (
        <InformationScreen onContinue={() => goToStep("tutorial")} onSkip={finishOnboarding} />
      )}

      {step === "tutorial" && (
        <TutorialScreen onContinue={() => goToStep("thank-you")} onSkip={finishOnboarding} />
      )}

      {step === "thank-you" && <ThankYouScreen onFinish={finishOnboarding} />}

      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] mx-auto w-full max-w-md px-6">
        <p className="mb-2 text-right text-sm text-muted-foreground">Schritt {progress} von 5</p>
        <Progress value={progress * 20} />
      </div>
    </>
  );
}
