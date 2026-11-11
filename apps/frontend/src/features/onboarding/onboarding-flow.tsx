import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SplashScreen } from "./splash-screen";
import { WelcomeScreen } from "./welcome-screen";
import { UsageSelectionScreen } from "./usage-selection-screen";
import { InformationScreen } from "./information-screen";

type OnboardingStep = "splash" | "welcome" | "usage-selection" | "information";
// TODO (#95): Replace the fixed splash duration with actual app initialization logic.
const SPLASH_DURATION_MS = 1500;
// TODO (#95): Check this key on first launch to skip onboarding for returning users.
const STORAGE_KEY = "helthtw:onboarding-complete";

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("splash");

  useEffect(() => {
    if (step !== "splash") return;

    const timer = window.setTimeout(() => {
      setStep("welcome");
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [step]);

  function finishOnboarding() {
    localStorage.setItem(STORAGE_KEY, "true");
    void navigate({ to: "/", replace: true });
  }

  if (step === "splash") {
    return <SplashScreen />;
  }

  if (step === "welcome") {
    return (
      <WelcomeScreen onContinue={() => setStep("usage-selection")} onSkip={finishOnboarding} />
    );
  }

  if (step === "usage-selection") {
    return (
      <UsageSelectionScreen
        onExplore={() => setStep("information")}
        onContinue={finishOnboarding}
      />
    );
  }

  // TODO (#95): Continue tutorial.
  return <InformationScreen onContinue={finishOnboarding} onSkip={finishOnboarding} />;
}
