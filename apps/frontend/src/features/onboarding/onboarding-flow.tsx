import { usageSelectionSchema } from "./usage-selection-form";
import type { UsageSelection } from "./usage-selection-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
  const [stepIndex, setStepIndex] = useState(0);
  // TODO (#95): Prefill the saved profession once the profile API exists; handle loading and errors.
  const usageForm = useForm<UsageSelection>({
    resolver: zodResolver(usageSelectionSchema),
    defaultValues: { profession: null },
  });

  const goToNextStep = () => setStepIndex((index) => index + 1);

  const screens = [
    <WelcomeScreen key="welcome" onContinue={goToNextStep} />,
    <UsageSelectionScreen key="usage-selection" form={usageForm} onContinue={goToNextStep} />,
    <InformationScreen key="information" onContinue={goToNextStep} />,
    <TutorialScreen key="tutorial" onContinue={goToNextStep} />,
    <ThankYouScreen key="thank-you" onContinue={onFinish} />,
  ];
  const isLastStep = stepIndex === screens.length - 1;

  return (
    <OnboardingLayout
      stepNumber={stepIndex + 1}
      totalSteps={screens.length}
      onSkip={isLastStep ? undefined : onFinish}
      embedded={embedded}
    >
      {screens[stepIndex]}
    </OnboardingLayout>
  );
}
