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
    throw redirect({ to: "/onboarding", replace: true });
  }
}

export function beforeOnboardingLoad() {
  if (hasCompletedOnboarding()) {
    throw redirect({ to: "/", replace: true });
  }
}

export function completeOnboarding() {
  // TODO (#95): Clarify if the backend is unreachable and account
  // cannot be initialized when onboarding finishes or is skipped.
  void ensureAccount().catch(() => {});
  completedInSession = true;

  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Keep completion for this session when browser storage is unavailable.
  }
}
