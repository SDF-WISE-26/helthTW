import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpButton } from "./help-button";

// Top-level screens show the app name, every other screen a back button.
const TOP_LEVEL_PATHS = ["/", "/info", "/chat", "/contacts", "/onboarding"];

export function AppHeader() {
  const { pathname } = useLocation();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4">
      {TOP_LEVEL_PATHS.includes(pathname) ? (
        <span className="font-bold">helthTW</span>
      ) : (
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Zurück"
          onClick={() => router.history.back()}
        >
          <ArrowLeft />
        </Button>
      )}
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon-lg" aria-label="Einstellungen">
          <Link to="/settings">
            <Settings />
          </Link>
        </Button>
        <HelpButton />
      </div>
    </header>
  );
}
