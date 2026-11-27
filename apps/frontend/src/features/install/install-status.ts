export type InstallPlatform = "android" | "ios" | "other";
export type InstallOutcome = "accepted" | "dismissed";

type InstallPromptEvent = Event & {
  prompt: () => Promise<{ outcome: InstallOutcome }>;
};

const STANDALONE_QUERY = "(display-mode: standalone)";
// Only remember installs until reload, saved flags could outlive an uninstall.
let installedInThisPage = false;
let installPrompt: InstallPromptEvent | null = null;
const subscribers = new Set<() => void>();

export function getInstallPlatform(): InstallPlatform {
  const { userAgent, maxTouchPoints } = navigator;

  if (/android/i.test(userAgent)) return "android";

  const isIOSDevice = /ipad|iphone|ipod/i.test(userAgent);
  // iPadOS can report a Mac user agent, touch support may help identify it.
  const isIPadInDesktopMode = /macintosh/i.test(userAgent) && maxTouchPoints > 1;

  if (isIOSDevice || isIPadInDesktopMode) return "ios";

  return "other";
}

export function getIsInstalled(): boolean {
  // Check app mode, including Safari's standalone flag.
  return (
    installedInThisPage ||
    window.matchMedia(STANDALONE_QUERY).matches ||
    ("standalone" in navigator && navigator.standalone === true)
  );
}

export function getCanInstall(): boolean {
  return installPrompt !== null && !getIsInstalled();
}

function notifySubscribers() {
  subscribers.forEach((onChange) => onChange());
}

export function subscribeToInstallStatus(onChange: () => void) {
  subscribers.add(onChange);

  // React calls this cleanup when the subscription ends.
  return () => {
    subscribers.delete(onChange);
  };
}

// Capture the prompt at app startup, before any installation drawer is opened.
export function startInstallStatus() {
  const displayMode = window.matchMedia(STANDALONE_QUERY);

  function onBeforeInstallPrompt(event: Event) {
    if (getInstallPlatform() !== "android") return;

    event.preventDefault();
    installedInThisPage = false;
    installPrompt = event as InstallPromptEvent;
    notifySubscribers();
  }

  function onInstalled() {
    installedInThisPage = true;
    installPrompt = null;
    notifySubscribers();
  }

  displayMode.addEventListener("change", notifySubscribers);
  window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  window.addEventListener("appinstalled", onInstalled);
  window.addEventListener("pageshow", notifySubscribers);

  return () => {
    displayMode.removeEventListener("change", notifySubscribers);
    window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.removeEventListener("appinstalled", onInstalled);
    window.removeEventListener("pageshow", notifySubscribers);
  };
}

export async function requestInstallation(): Promise<InstallOutcome | null> {
  if (!installPrompt || getIsInstalled()) return null;

  const prompt = installPrompt;
  // Each browser prompt can only be used once, including when it is dismissed.
  installPrompt = null;
  notifySubscribers();

  const { outcome } = await prompt.prompt();
  return outcome;
}
