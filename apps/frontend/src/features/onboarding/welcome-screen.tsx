import { onboardingContent as content } from "@/content/onboarding";
import { OnboardingActions, OnboardingScreen } from "./onboarding-layout";

type WelcomeScreenProps = {
  onContinue: () => void;
  onSkip: () => void;
};

export function WelcomeScreen({ onContinue, onSkip }: WelcomeScreenProps) {
  return (
    <OnboardingScreen
      title={content.welcome.title}
      description={content.welcome.description}
      actions={<OnboardingActions onContinue={onContinue} onSkip={onSkip} />}
    >
      <div className="flex justify-center py-8">
        {/* TODO (#171): Replace placeholder with the final app logo. */}
        <img src="/favicon.svg" alt="" className="size-20" />
      </div>
    </OnboardingScreen>
  );
}
