import { onboardingContent as content } from "@/content/onboarding";
import {
  OnboardingActions,
  OnboardingButton,
  OnboardingCard,
  OnboardingScreen,
} from "./onboarding-layout";

type Props = {
  onContinue: () => void;
};

export function InformationScreen({ onContinue }: Props) {
  return (
    <OnboardingScreen
      title={content.information.title}
      actions={<OnboardingActions onContinue={onContinue} />}
    >
      <OnboardingCard>
        <p>{content.information.description}</p>
        <p>{content.information.purpose}</p>
        <p>{content.information.disclaimer}</p>
        <p>{content.information.emergency}</p>

        {/* TODO (#95): Set the information-material URL and replace the disabled button with a working link. */}
        <OnboardingButton variant="outline" disabled>
          {content.information.research}
        </OnboardingButton>
      </OnboardingCard>
    </OnboardingScreen>
  );
}
