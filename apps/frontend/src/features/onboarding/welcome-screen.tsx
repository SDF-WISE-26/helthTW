import { Button } from "@/components/ui/button";
import { onboardingContent as content } from "@/content/onboarding";

type WelcomeScreenProps = {
  onContinue: () => void;
  onSkip: () => void;
};

export function WelcomeScreen({ onContinue, onSkip }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between gap-8 px-6 py-10">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          {/* TODO (#171): Replace placeholder with the final app logo. */}
          <img src="/favicon.svg" alt="" className="size-20" />

          <h1 className="text-3xl font-bold">{content.welcome.title}</h1>
          <p className="text-muted-foreground">{content.welcome.description}</p>
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
