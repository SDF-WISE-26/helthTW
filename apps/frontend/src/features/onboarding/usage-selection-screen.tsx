import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onboardingContent as content } from "@/content/onboarding";
import { OnboardingCard, OnboardingScreen } from "./onboarding-layout";

type Props = {
  onExplore: () => void;
  onContinue: () => void;
};

export function UsageSelectionScreen({ onExplore, onContinue }: Props) {
  // TODO (#95): Use React Hook Form and a shared Zod schema once the profile fields are defined.
  const [profession, setProfession] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleContinue() {
    if (!profession) {
      setHasError(true);
      return;
    }

    // TODO (#95): Pass profession and usage mode to the flow and retain the draft on Back.
    // TODO (#95): Define profile API and offline persistence before saving these values.
    onContinue();
  }

  return (
    <OnboardingScreen title={content.title}>
      <OnboardingCard contentClassName="p-0">
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-h-12 w-full justify-start rounded-xl p-5 text-left text-base leading-relaxed font-normal whitespace-normal"
          onClick={onExplore}
        >
          {content.explore}
        </Button>
      </OnboardingCard>
      {/* TODO (#95): Define the purpose and required/optional status of profile fields before adding age or gender from the mockup. */}
      <OnboardingCard className="relative transition-colors hover:bg-accent/40">
        <p>{content.professional}</p>

        <button
          type="button"
          className="absolute inset-0 rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
          aria-label="Mit ausgewählter Berufsgruppe fortfahren"
          onClick={handleContinue}
        />

        <div className="relative z-10">
          <Select
            value={profession}
            onValueChange={(value) => {
              setProfession(value);
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
                <SelectItem key={role} value={role} className="min-h-11 py-2 text-base leading-6">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasError && (
          <FieldError id="onboarding-profession-error">{content.professionError}</FieldError>
        )}
      </OnboardingCard>
    </OnboardingScreen>
  );
}
