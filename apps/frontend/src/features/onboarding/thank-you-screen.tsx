import { onboardingContent as content } from "@/content/onboarding";
import { OnboardingActions, OnboardingScreen } from "./onboarding-layout";

type Props = {
  onContinue: () => void;
};

export function ThankYouScreen({ onContinue }: Props) {
  return (
    <OnboardingScreen
      title={content.thankYou.title}
      description={content.thankYou.description}
      actions={<OnboardingActions onContinue={onContinue} continueLabel={content.actions.start} />}
    />
  );
}
