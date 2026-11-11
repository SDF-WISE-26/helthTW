import { onboardingContent as content } from "@/content/onboarding";
import { OnboardingActions, OnboardingScreen } from "./onboarding-layout";

type Props = {
  onFinish: () => void;
};

export function ThankYouScreen({ onFinish }: Props) {
  return (
    <OnboardingScreen
      title={content.thankYou.title}
      description={content.thankYou.description}
      actions={
        <OnboardingActions
          onContinue={onFinish}
          onSkip={onFinish}
          continueLabel={content.actions.start}
        />
      }
    />
  );
}
