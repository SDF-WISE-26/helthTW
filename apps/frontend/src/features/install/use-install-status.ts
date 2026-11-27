import { useSyncExternalStore } from "react";
import {
  getCanInstall,
  getInstallPlatform,
  getIsInstalled,
  subscribeToInstallStatus,
} from "./install-status";

export function useInstallStatus() {
  const isInstalled = useSyncExternalStore(subscribeToInstallStatus, getIsInstalled);
  const canInstall = useSyncExternalStore(subscribeToInstallStatus, getCanInstall);

  return { platform: getInstallPlatform(), isInstalled, canInstall };
}
