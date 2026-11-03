import { Link } from "@tanstack/react-router";
import { BookOpen, House, MessageCircle } from "lucide-react";

const TABS = [
  { to: "/", label: "Start", icon: House },
  { to: "/info", label: "Info", icon: BookOpen },
  { to: "/chat", label: "Chat", icon: MessageCircle },
] as const;

export function TabBar() {
  return (
    <nav
      aria-label="Hauptnavigation"
      className="sticky bottom-0 grid grid-cols-3 border-t bg-background"
    >
      {TABS.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          className="flex flex-col items-center gap-1 py-3 text-xs text-muted-foreground data-[status=active]:font-semibold data-[status=active]:text-foreground"
        >
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
