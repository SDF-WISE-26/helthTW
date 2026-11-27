import { installContent as content } from "@/content/install";
import { InstallGuide } from "./install-guide";
import { useInstallStatus } from "./use-install-status";

export function InstallPage() {
  const { isInstalled } = useInstallStatus();

  return (
    <>
      <h1 className="text-2xl font-bold">{content.title}</h1>
      {!isInstalled && <p>{content.description}</p>}
      <InstallGuide />
    </>
  );
}
