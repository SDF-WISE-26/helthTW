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
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between gap-6 px-6 py-10">
        <div className="flex flex-1 flex-col justify-center gap-6">
          <h1 className="text-3xl font-bold">{content.information.title}</h1>

          <Card>
            <CardContent className="space-y-4 p-5 text-base">
              <p>{content.information.description}</p>
              <p>{content.information.purpose}</p>
              <p>{content.information.disclaimer}</p>
              <p>{content.information.emergency}</p>

              {/* TODO (#95): Link to research material. */}
              <Button variant="outline" className="text-base" disabled>
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
