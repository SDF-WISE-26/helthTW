import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onboardingContent as content } from "@/content/onboarding";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6">
      <div className="flex w-full max-w-md flex-col gap-6">
        <h1 className="text-3xl font-bold">{content.title}</h1>

        <Card className="overflow-hidden p-0">
          <Button
            variant="ghost"
            className="h-auto w-full justify-start whitespace-normal p-5 text-left text-base font-normal"
            onClick={onExplore}
          >
            {content.explore}
          </Button>
        </Card>
        {/* TODO (#95): Define the purpose and required/optional status of profile fields before adding age or gender from the mockup. */}
        <Card className="relative p-0 hover:bg-accent/40">
          <CardContent className="space-y-4 p-5">
            <p className="text-base font-normal">{content.professional}</p>

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
                <SelectTrigger className="w-full text-base" aria-invalid={hasError}>
                  <SelectValue placeholder={content.professionPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {content.professions.map((role) => (
                    <SelectItem key={role} value={role} className="text-base">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasError && <FieldError>{content.professionError}</FieldError>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
