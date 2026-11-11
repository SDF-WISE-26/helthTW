import { onboardingContent as content } from "@/content/onboarding";
import { OnboardingActions, OnboardingCard, OnboardingScreen } from "./onboarding-layout";

type Props = {
  onContinue: () => void;
  onSkip: () => void;
};

export function TutorialScreen({ onContinue, onSkip }: Props) {
  const tutorial = content.tutorial;

  return (
    <OnboardingScreen
      title={tutorial.title}
      actions={<OnboardingActions onContinue={onContinue} onSkip={onSkip} />}
    >
      {/* TODO (#95): Implement an animated, interactive tutorial demonstrating how to use the chat. */}
      <OnboardingCard>
        <h2 className="text-base leading-6 font-semibold">{tutorial.chatTitle}</h2>
        <p>{tutorial.chatDescription}</p>
      </OnboardingCard>
      {/* TODO (#95): Implement an animated, interactive tutorial demonstrating how to complete questionnaires. */}
      <OnboardingCard>
        <h2 className="text-base leading-6 font-semibold">{tutorial.questionnaireTitle}</h2>
        <p>{tutorial.questionnaireDescription}</p>
      </OnboardingCard>
    </OnboardingScreen>
  );
}
