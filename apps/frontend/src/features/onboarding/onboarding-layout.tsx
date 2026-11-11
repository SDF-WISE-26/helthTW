import type { ComponentProps, ReactNode } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { onboardingContent as content } from "@/content/onboarding";

export function OnboardingLayout({
  progress,
  children,
}: {
  progress: number;
  children: ReactNode;
}) {
  const progressLabel = `Schritt ${progress} von 5`;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col gap-8 px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="shrink-0 space-y-2">
          <p className="text-right text-sm leading-5 text-muted-foreground tabular-nums">
            {progressLabel}
          </p>
          <Progress value={progress * 20} aria-label={progressLabel} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

export function OnboardingScreen({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <section className="space-y-6 pb-1 text-base leading-relaxed">
          <header className="top-0 z-20 space-y-3 bg-background [@media(min-height:32rem)]:sticky">
            <h1 className="text-3xl leading-tight font-bold tracking-tight text-balance">
              {title}
            </h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </header>
          {children}
        </section>
      </div>
      {actions && <div className="shrink-0 pt-6">{actions}</div>}
    </>
  );
}

export function OnboardingCard({
  className,
  contentClassName,
  children,
  ...props
}: ComponentProps<typeof Card> & { contentClassName?: string }) {
  return (
    <Card
      className={cn("gap-0 border border-border p-0 text-base leading-relaxed ring-0", className)}
      {...props}
    >
      <CardContent className={cn("space-y-4 p-5", contentClassName)}>{children}</CardContent>
    </Card>
  );
}

export function OnboardingActions({
  onContinue,
  onSkip,
  continueLabel = content.actions.continue,
}: {
  onContinue: () => void;
  onSkip: () => void;
  continueLabel?: string;
}) {
  const buttonClassName = "h-auto min-h-12 w-full px-4 py-3 text-base leading-6 whitespace-normal";

  return (
    <div className="flex flex-col gap-3">
      <Button type="button" className={buttonClassName} onClick={onContinue}>
        {continueLabel}
      </Button>
      <Button type="button" variant="ghost" className={buttonClassName} onClick={onSkip}>
        {content.actions.skip}
      </Button>
    </div>
  );
}
