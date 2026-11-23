import { redirect } from "@tanstack/react-router";

export const onboardingSteps = [
  "welcome",
  "usage-selection",
  "information",
  "tutorial",
  "thank-you",
] as const;

export type OnboardingStep = (typeof onboardingSteps)[number];

const STORAGE_KEY = "helthtw:onboarding-complete";

function hasCompletedOnboarding() {
  return localStorage.getItem(STORAGE_KEY) === "true";
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
  localStorage.setItem(STORAGE_KEY, "true");
}
