import { installContent as content } from "@/content/install";
import { InstallDrawer } from "./install-drawer";
import { useInstallStatus } from "./use-install-status";

export function InstallPage() {
  const { platform, isInstalled } = useInstallStatus();

  return (
    <>
      <h1 className="text-2xl font-bold">{content.title}</h1>
      {isInstalled ? (
        <p>{content.alreadyInstalled}</p>
      ) : (
        <>
          <p>{content.description}</p>
          <InstallDrawer />
          {platform === "other" && <p>{content.unsupportedPlatform}</p>}
        </>
      )}
    </>
  );
}
