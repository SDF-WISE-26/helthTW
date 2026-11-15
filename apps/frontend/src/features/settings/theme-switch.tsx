import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getTheme, setTheme } from "./theme";

export function ThemeSwitch() {
  const [dark, setDark] = useState(() => getTheme() === "dark");

  function toggle() {
    setTheme(dark ? "light" : "dark");
    setDark(!dark);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <span id="theme-switch-label" className="font-semibold">
        Darstellung
      </span>
      <Button
        variant="outline"
        size="icon-lg"
        role="switch"
        aria-checked={dark}
        aria-labelledby="theme-switch-label"
        onClick={toggle}
      >
        {dark ? <Moon /> : <Sun />}
      </Button>
    </div>
  );
}
