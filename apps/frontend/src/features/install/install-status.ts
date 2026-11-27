export type InstallPlatform = "android" | "ios" | "other";

const STANDALONE_QUERY = "(display-mode: standalone)";
// Only remember installs until reload, saved flags could outlive an uninstall.
let installedInThisPage = false;

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

export function subscribeToInstallStatus(onChange: () => void) {
  const displayMode = window.matchMedia(STANDALONE_QUERY);
  const onInstalled = () => {
    installedInThisPage = true;
    onChange();
  };

  displayMode.addEventListener("change", onChange);
  window.addEventListener("appinstalled", onInstalled);
  window.addEventListener("pageshow", onChange);

  // React calls this cleanup when the subscription ends.
  return () => {
    displayMode.removeEventListener("change", onChange);
    window.removeEventListener("appinstalled", onInstalled);
    window.removeEventListener("pageshow", onChange);
  };
}
