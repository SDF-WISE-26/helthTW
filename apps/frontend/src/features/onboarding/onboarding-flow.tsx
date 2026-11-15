import { useBlocker, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { completeOnboarding } from "./onboarding-navigation";
import type { OnboardingStep } from "./onboarding-navigation";
import { SplashScreen } from "./splash-screen";
import { WelcomeScreen } from "./welcome-screen";
import { UsageSelectionScreen } from "./usage-selection-screen";
import type { UsageMode } from "./usage-selection-screen";
import { InformationScreen } from "./information-screen";
import { TutorialScreen } from "./tutorial-screen";
import { ThankYouScreen } from "./thank-you-screen";
import { OnboardingLayout } from "./onboarding-layout";

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
  const [usageMode, setUsageMode] = useState<UsageMode>();
  const [profession, setProfession] = useState("");

  // TODO (#95): After integrating the account schema from main, add a shared profession enum
  // to the user model and save the professional selection via the profile API.
  // Define offline persistence before saving profile values, explore mode skips profession data.

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
    <OnboardingLayout progress={progress} onSkip={finishOnboarding}>
      {step === "welcome" && <WelcomeScreen onContinue={() => goToStep("usage-selection")} />}

      {step === "usage-selection" && (
        <UsageSelectionScreen
          usageMode={usageMode}
          profession={profession}
          onUsageModeChange={setUsageMode}
          onProfessionChange={setProfession}
          onExplore={() => goToStep("information")}
          onContinue={() => goToStep("information")}
        />
      )}

      {step === "information" && <InformationScreen onContinue={() => goToStep("tutorial")} />}

      {step === "tutorial" && <TutorialScreen onContinue={() => goToStep("thank-you")} />}

      {step === "thank-you" && <ThankYouScreen onFinish={finishOnboarding} />}
    </OnboardingLayout>
  );
}
