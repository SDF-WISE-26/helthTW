import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { onboardingContent as content } from "@/content/onboarding";

type Props = {
  onContinue: () => void;
  onSkip: () => void;
};

export function InformationScreen({ onContinue, onSkip }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col gap-8 px-6 pb-10 pt-24">
        <div className="flex min-h-0 flex-1 flex-col justify-start gap-6 overflow-y-auto">
          <h1 className="text-3xl font-bold">{content.information.title}</h1>

          <Card className="border p-0">
            <CardContent className="space-y-4 p-5">
              <p>{content.information.description}</p>
              <p>{content.information.purpose}</p>
              <p>{content.information.disclaimer}</p>
              <p>{content.information.emergency}</p>

              {/* TODO (#95): Link to research material. */}
              <Button variant="outline" disabled>
                {content.information.research}
              </Button>
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
