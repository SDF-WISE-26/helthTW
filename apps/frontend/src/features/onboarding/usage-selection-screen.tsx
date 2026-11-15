import { useState } from "react";
import { cn } from "cn";
import { FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onboardingContent as content } from "@/content/onboarding";
import { OnboardingActions, OnboardingCard, OnboardingScreen } from "./onboarding-layout";

export type UsageMode = "explore" | "professional";

type Props = {
  usageMode: UsageMode | undefined;
  profession: string;
  onUsageModeChange: (mode: UsageMode) => void;
  onProfessionChange: (profession: string) => void;
  onExplore: () => void;
  onContinue: () => void;
};

const selectedCardClassName =
  "border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-950/40";

export function UsageSelectionScreen({
  usageMode,
  profession,
  onUsageModeChange,
  onProfessionChange,
  onExplore,
  onContinue,
}: Props) {
  // TODO (#95): Use React Hook Form and a shared Zod schema once the profile fields are defined.
  const [hasError, setHasError] = useState(false);

  function handleContinue() {
    if (!usageMode) return;
    if (usageMode === "professional" && !profession) {
      setHasError(true);
      return;
    }

    if (usageMode === "explore") {
      onExplore();
    } else {
      onContinue();
    }
  }

  return (
    <OnboardingScreen
      title={content.title}
      actions={<OnboardingActions onContinue={handleContinue} disabled={!usageMode} />}
    >
      <fieldset className="space-y-4">
        <legend className="mb-4 text-muted-foreground">
          Wähle aus, wie du helthTW nutzen möchtest.
        </legend>
        <OnboardingCard
          className={usageMode === "explore" ? selectedCardClassName : undefined}
          contentClassName="p-0"
        >
          <label className="flex cursor-pointer items-start gap-3 p-5">
            <input
              type="radio"
              name="usage-mode"
              value="explore"
              checked={usageMode === "explore"}
              onChange={() => {
                onUsageModeChange("explore");
                setHasError(false);
              }}
              className="mt-1 size-4 shrink-0 accent-green-600 dark:accent-green-500"
            />
            <span>{content.explore}</span>
          </label>
        </OnboardingCard>
        {/* TODO (#95): Define the purpose and required/optional status of profile fields before adding age or gender from the mockup. */}
        <OnboardingCard
          className={cn(
            usageMode === "professional" && profession !== "" && selectedCardClassName,
            hasError && "border-destructive",
          )}
          contentClassName="space-y-0 p-0"
        >
          <label className="flex cursor-pointer items-start gap-3 p-5">
            <input
              type="radio"
              name="usage-mode"
              value="professional"
              checked={usageMode === "professional"}
              onChange={() => onUsageModeChange("professional")}
              className="mt-1 size-4 shrink-0 accent-current"
            />
            <span>{content.professional}</span>
          </label>

          {usageMode === "professional" && (
            <div className="px-5 pb-5">
              <Select
                value={profession}
                onValueChange={(value) => {
                  onProfessionChange(value);
                  setHasError(false);
                }}
              >
                <SelectTrigger
                  className="w-full text-base data-[size=default]:h-12"
                  aria-label={content.professionPlaceholder}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? "onboarding-profession-error" : undefined}
                >
                  <SelectValue placeholder={content.professionPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {content.professions.map((role) => (
                    <SelectItem
                      key={role}
                      value={role}
                      className="min-h-11 py-2 text-base leading-6"
                    >
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError && (
                <FieldError id="onboarding-profession-error" className="mt-3">
                  {content.professionError}
                </FieldError>
              )}
            </div>
          )}
        </OnboardingCard>
      </fieldset>
    </OnboardingScreen>
  );
}
