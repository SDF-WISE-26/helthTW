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

export function beforeOnboardingLoad() {
  let completed = completedInSession;

  try {
    completed ||= localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    // Browser storage may be unavailable; session completion still applies.
  }

  if (completed) {
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
