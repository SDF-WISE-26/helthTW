import { installContent as content } from "@/content/install";
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
          {platform === "android" && <p>{content.platforms.android}</p>}
          {platform === "ios" && <p>{content.platforms.ios}</p>}
          {platform === "other" && <p>{content.unsupportedPlatform}</p>}
        </>
      )}
    </>
  );
}
