import { usageSelectionSchema } from "@helthtw/shared/accounts";
import type { UsageSelection } from "@helthtw/shared/accounts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { OnboardingStep } from "./onboarding-navigation";
import { WelcomeScreen } from "./welcome-screen";
import { UsageSelectionScreen } from "./usage-selection-screen";
import { InformationScreen } from "./information-screen";
import { TutorialScreen } from "./tutorial-screen";
import { ThankYouScreen } from "./thank-you-screen";
import { OnboardingLayout } from "./onboarding-layout";

const progressSteps = {
  welcome: 1,
  "usage-selection": 2,
  information: 3,
  tutorial: 4,
  "thank-you": 5,
} as const;

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
  const usageForm = useForm<UsageSelection>({
    resolver: zodResolver(usageSelectionSchema),
    defaultValues: { profession: null },
  });

  const progress = progressSteps[step];

  return (
    <OnboardingLayout progress={progress} onSkip={onFinish} embedded={embedded}>
      {step === "welcome" && <WelcomeScreen onContinue={() => onStepChange("usage-selection")} />}

      {step === "usage-selection" && (
        <UsageSelectionScreen
          form={usageForm}
          onExplore={() => onStepChange("information")}
          onContinue={() => onStepChange("information")}
        />
      )}

      {step === "information" && <InformationScreen onContinue={() => onStepChange("tutorial")} />}

      {step === "tutorial" && <TutorialScreen onContinue={() => onStepChange("thank-you")} />}

      {step === "thank-you" && <ThankYouScreen onFinish={onFinish} />}
    </OnboardingLayout>
  );
}
