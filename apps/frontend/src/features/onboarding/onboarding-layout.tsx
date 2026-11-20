import type { ComponentProps, ReactNode } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { onboardingContent as content } from "@/content/onboarding";

export function OnboardingLayout({
  stepNumber,
  totalSteps,
  onSkip,
  embedded = false,
  children,
}: {
  stepNumber: number;
  totalSteps: number;
  onSkip?: () => void;
  embedded?: boolean;
  children: ReactNode;
}) {
  const progressLabel = `Schritt ${stepNumber} von ${totalSteps}`;

  return (
    <div
      className={
        embedded ? "flex min-h-0 flex-1 flex-col bg-background" : "fixed inset-0 z-50 bg-background"
      }
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-md flex-col gap-8 px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]",
          embedded ? "min-h-0 flex-1" : "h-dvh",
        )}
      >
        <div className="shrink-0 space-y-2">
          <div className="flex min-h-11 items-center justify-between gap-3">
            <p className="text-sm leading-5 text-muted-foreground tabular-nums">{progressLabel}</p>
            {onSkip && (
              <Button
                type="button"
                variant="ghost"
                className="-mr-3 h-11 px-3 text-sm font-normal text-muted-foreground"
                onClick={onSkip}
              >
                {content.actions.skip}
              </Button>
            )}
          </div>
          <Progress value={(stepNumber / totalSteps) * 100} aria-label={progressLabel} />
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
            <h1 className="text-2xl leading-tight font-bold tracking-tight text-balance">
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

export function OnboardingButton({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn("h-auto min-h-12 px-4 py-3 text-base leading-6 whitespace-normal", className)}
      {...props}
    />
  );
}

export function OnboardingActions({
  onContinue,
  form,
  disabled = false,
  continueLabel = content.actions.continue,
}: {
  onContinue?: () => void;
  form?: string;
  disabled?: boolean;
  continueLabel?: string;
}) {
  return (
    <OnboardingButton
      type={form ? "submit" : "button"}
      form={form}
      className="w-full"
      onClick={onContinue}
      disabled={disabled}
    >
      {continueLabel}
    </OnboardingButton>
  );
}
