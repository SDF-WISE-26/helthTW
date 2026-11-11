import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { onboardingContent as content } from "@/content/onboarding";

type Props = {
  onContinue: () => void;
  onSkip: () => void;
};

export function TutorialScreen({ onContinue, onSkip }: Props) {
  const tutorial = content.tutorial;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col justify-between gap-8 px-6 py-10">
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-6 overflow-y-auto px-2">
          <h1 className="text-3xl font-bold">{tutorial.title}</h1>
          <p>{tutorial.description}</p>
          {/* TODO (#95): Implement an animated, interactive tutorial demonstrating how to use the chat. */}
          <Card>
            <CardContent className="space-y-2 p-5 text-base">
              <h2 className="font-semibold">{tutorial.chatTitle}</h2>
              <p>{tutorial.chatDescription}</p>
            </CardContent>
          </Card>
          {/* TODO (#95): Implement an animated, interactive tutorial demonstrating how to complete questionnaires. */}
          <Card>
            <CardContent className="space-y-2 p-5 text-base">
              <h2 className="font-semibold">{tutorial.questionnaireTitle}</h2>
              <p>{tutorial.questionnaireDescription}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={onContinue}>
            {content.actions.continue}
          </Button>

          <Button variant="ghost" size="lg" onClick={onSkip}>
            {content.actions.skip}
          </Button>
        </div>
      </div>
    </div>
  );
}
