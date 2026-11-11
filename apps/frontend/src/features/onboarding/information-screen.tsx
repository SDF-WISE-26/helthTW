import { Button } from "@/components/ui/button";
import { onboardingContent as content } from "@/content/onboarding";
import { OnboardingActions, OnboardingCard, OnboardingScreen } from "./onboarding-layout";

type Props = {
  onContinue: () => void;
  onSkip: () => void;
};

export function InformationScreen({ onContinue, onSkip }: Props) {
  return (
    <OnboardingScreen
      title={content.information.title}
      actions={<OnboardingActions onContinue={onContinue} onSkip={onSkip} />}
    >
      <OnboardingCard>
        <p>{content.information.description}</p>
        <p>{content.information.purpose}</p>
        <p>{content.information.disclaimer}</p>
        <p>{content.information.emergency}</p>

        {/* TODO (#95): Link to research material. */}
        <Button
          variant="outline"
          className="h-auto min-h-12 px-4 py-3 text-base leading-6 whitespace-normal"
          disabled
        >
          {content.information.research}
        </Button>
      </OnboardingCard>
    </OnboardingScreen>
  );
}
