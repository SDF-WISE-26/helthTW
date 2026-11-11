import { redirect } from "@tanstack/react-router";

const steps = [
  "splash",
  "welcome",
  "usage-selection",
  "information",
  "tutorial",
  "thank-you",
] as const;

export type OnboardingStep = (typeof steps)[number];

export function validateOnboardingSearch(search: Record<string, unknown>) {
  return { step: steps.find((step) => step === search.step) ?? "splash" };
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
    throw redirect({ to: "/onboarding", search: { step: "splash" }, replace: true });
  }
}

export function beforeOnboardingLoad() {
  if (hasCompletedOnboarding()) {
    throw redirect({ to: "/", replace: true });
  }
}

export function completeOnboarding() {
  completedInSession = true;

  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Keep completion for this session when browser storage is unavailable.
  }
}
