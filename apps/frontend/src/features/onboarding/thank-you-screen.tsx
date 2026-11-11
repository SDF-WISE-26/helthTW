import { Button } from "@/components/ui/button";
import { onboardingContent as content } from "@/content/onboarding";

type Props = {
  onFinish: () => void;
};

export function ThankYouScreen({ onFinish }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col gap-8 px-6 py-10">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold">{content.thankYou.title}</h1>
          <p className="text-base text-muted-foreground">{content.thankYou.description}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={onFinish}>
            {content.actions.start}
          </Button>

          <Button variant="ghost" size="lg" onClick={onFinish}>
            {content.actions.skip}
          </Button>
        </div>
      </div>
    </div>
  );
}
