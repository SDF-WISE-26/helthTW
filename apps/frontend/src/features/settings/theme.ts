// Light by default, dark only when chosen in the settings.
// index.html applies a saved choice before the first paint, keep the key, class and colours in sync.
export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
// Browser bar colour: the page background of each theme (chalk-50, night-900).
const THEME_COLOR: Record<Theme, string> = { light: "#f3f5f1", dark: "#121713" };

export function getTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function setTheme(theme: Theme) {
  try {
    if (theme === "dark") localStorage.setItem(STORAGE_KEY, "dark");
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: the choice still applies until the page is reloaded.
  }
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}
