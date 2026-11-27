import { useSyncExternalStore } from "react";
import { getInstallPlatform, getIsInstalled, subscribeToInstallStatus } from "./install-status";

export function useInstallStatus() {
  const isInstalled = useSyncExternalStore(subscribeToInstallStatus, getIsInstalled);

  return { platform: getInstallPlatform(), isInstalled };
}
