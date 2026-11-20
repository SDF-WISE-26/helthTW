import { redirect } from "@tanstack/react-router";
import { ensureAccount } from "@/features/account/account";

export const onboardingSteps = [
  "welcome",
  "usage-selection",
  "information",
  "tutorial",
  "thank-you",
] as const;

export type OnboardingStep = (typeof onboardingSteps)[number];

export function validateOnboardingSearch(search: Record<string, unknown>) {
  return { step: onboardingSteps.find((step) => step === search.step) ?? onboardingSteps[0] };
}

const STORAGE_KEY = "helthtw:onboarding-complete";
let completedInSession = false;

function hasCompletedOnboarding() {
  if (completedInSession) return true;

  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function beforeHomeLoad() {
  if (!hasCompletedOnboarding()) {
    throw redirect({ to: "/onboarding", search: { step: onboardingSteps[0] }, replace: true });
  }
}

export function beforeOnboardingLoad() {
  if (hasCompletedOnboarding()) {
    throw redirect({ to: "/", replace: true });
  }
}

export function completeOnboarding() {
  void ensureAccount().catch(() => {});
  completedInSession = true;

  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Keep completion for this session when browser storage is unavailable.
  }
}
