import { useMutation } from "@tanstack/react-query";
import { Controller, useWatch } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
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
import { ensureAccount, professionValues } from "@/features/account/account";
import { OnboardingActions, OnboardingCard, OnboardingScreen } from "./onboarding-layout";
import type { UsageSelection } from "./usage-selection-form";

type Props = {
  form: UseFormReturn<UsageSelection>;
  onContinue: () => void;
};

const selectedCardClassName =
  "border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-950/40";

export function UsageSelectionScreen({ form, onContinue }: Props) {
  const { control, register, handleSubmit, setValue, clearErrors, formState } = form;
  const [usageMode, profession] = useWatch({ control, name: ["usageMode", "profession"] });
  const usageModeField = register("usageMode");
  const hasError = Boolean(formState.errors.profession);
  const accountRequest = useMutation({ mutationFn: ensureAccount });

  const handleContinue = handleSubmit(() => {
    if (accountRequest.isPending) return;
    // TODO (#95): Submit the validated profession once backend profile persistence is available.
    accountRequest.mutate(undefined, { onSuccess: onContinue });
  });

  return (
    <OnboardingScreen
      title={content.title}
      actions={
        <div className="space-y-3" aria-busy={accountRequest.isPending}>
          {accountRequest.isError && <FieldError>{content.accountError}</FieldError>}
          <OnboardingActions
            form="onboarding-usage-selection"
            disabled={!usageMode || accountRequest.isPending}
          />
        </div>
      }
    >
      <form id="onboarding-usage-selection" onSubmit={handleContinue} noValidate>
        <fieldset className="space-y-4" disabled={accountRequest.isPending}>
          <legend className="mb-4 text-muted-foreground">{content.usageDescription}</legend>
          <OnboardingCard
            className={usageMode === "explore" ? selectedCardClassName : undefined}
            contentClassName="p-0"
          >
            <label className="flex cursor-pointer items-start gap-3 p-5">
              <input
                {...usageModeField}
                type="radio"
                value="explore"
                checked={usageMode === "explore"}
                onChange={(event) => {
                  void usageModeField.onChange(event);
                  setValue("profession", null);
                  clearErrors("profession");
                }}
                className="mt-1 size-4 shrink-0 accent-green-600 dark:accent-green-500"
              />
              <span>{content.explore}</span>
            </label>
          </OnboardingCard>
          {/* TODO (#95): Define the purpose and required/optional status of profile fields before adding age or gender from the mockup. */}
          <OnboardingCard
            className={cn(
              usageMode === "professional" && profession !== null && selectedCardClassName,
              hasError && "border-destructive",
            )}
            contentClassName="space-y-0 p-0"
          >
            <label className="flex cursor-pointer items-start gap-3 p-5">
              <input
                {...usageModeField}
                type="radio"
                value="professional"
                checked={usageMode === "professional"}
                className="mt-1 size-4 shrink-0 accent-current"
              />
              <span>{content.professional}</span>
            </label>

            {usageMode === "professional" && (
              <div className="px-5 pb-5">
                <Controller
                  name="profession"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger
                        ref={field.ref}
                        onBlur={field.onBlur}
                        className="w-full text-base data-[size=default]:h-12"
                        aria-label={content.professionPlaceholder}
                        aria-invalid={fieldState.invalid}
                        aria-describedby={hasError ? "onboarding-profession-error" : undefined}
                      >
                        <SelectValue placeholder={content.professionPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {professionValues.map((role) => (
                          <SelectItem
                            key={role}
                            value={role}
                            className="min-h-11 py-2 text-base leading-6"
                          >
                            {content.professions[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {hasError && (
                  <FieldError id="onboarding-profession-error" className="mt-3">
                    {content.professionError}
                  </FieldError>
                )}
              </div>
            )}
          </OnboardingCard>
        </fieldset>
      </form>
    </OnboardingScreen>
  );
}
