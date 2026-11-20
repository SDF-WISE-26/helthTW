import { usageSelectionSchema } from "./usage-selection-form";
import type { UsageSelection } from "./usage-selection-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { onboardingSteps } from "./onboarding-navigation";
import type { OnboardingStep } from "./onboarding-navigation";
import { WelcomeScreen } from "./welcome-screen";
import { UsageSelectionScreen } from "./usage-selection-screen";
import { InformationScreen } from "./information-screen";
import { TutorialScreen } from "./tutorial-screen";
import { ThankYouScreen } from "./thank-you-screen";
import { OnboardingLayout } from "./onboarding-layout";

export function OnboardingFlow({
  onFinish,
  embedded = false,
}: {
  onFinish: () => void;
  embedded?: boolean;
}) {
  const [step, setStep] = useState<OnboardingStep>(onboardingSteps[0]);
  // TODO (#95): Prefill the saved profession once the profile API exists; handle loading and errors.
  const usageForm = useForm<UsageSelection>({
    resolver: zodResolver(usageSelectionSchema),
    defaultValues: { profession: null },
  });

  const stepIndex = onboardingSteps.indexOf(step);
  const stepNumber = stepIndex + 1;

  function goToNextStep() {
    const nextStep = onboardingSteps[stepIndex + 1];
    if (nextStep) {
      setStep(nextStep);
    } else {
      onFinish();
    }
  }

  const screens = {
    welcome: <WelcomeScreen onContinue={goToNextStep} />,
    "usage-selection": <UsageSelectionScreen form={usageForm} onContinue={goToNextStep} />,
    information: <InformationScreen onContinue={goToNextStep} />,
    tutorial: <TutorialScreen onContinue={goToNextStep} />,
    "thank-you": <ThankYouScreen onFinish={goToNextStep} />,
  } satisfies Record<OnboardingStep, ReactNode>;

  return (
    <OnboardingLayout
      stepNumber={stepNumber}
      totalSteps={onboardingSteps.length}
      onSkip={onFinish}
      embedded={embedded}
    >
      {screens[step]}
    </OnboardingLayout>
  );
}
