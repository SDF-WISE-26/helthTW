import { usageSelectionSchema } from "./usage-selection-form";
import type { UsageSelection } from "./usage-selection-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  step,
  onStepChange,
  onFinish,
  embedded = false,
}: {
  step: OnboardingStep;
  onStepChange: (step: OnboardingStep) => void;
  onFinish: () => void;
  embedded?: boolean;
}) {
  // TODO (#95): Prefill the saved profession once the profile API exists; handle loading and errors.
  const usageForm = useForm<UsageSelection>({
    resolver: zodResolver(usageSelectionSchema),
    defaultValues: { profession: null },
  });

  const stepNumber = onboardingSteps.indexOf(step) + 1;

  function goToNextStep() {
    const nextStep = onboardingSteps[stepNumber];
    if (nextStep) {
      onStepChange(nextStep);
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
