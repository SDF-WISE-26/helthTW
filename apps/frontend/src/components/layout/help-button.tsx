import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

// Opens the emergency screen from anywhere, also offline and without an account.
export function HelpButton() {
  return (
    <Button
      asChild
      size="lg"
      className="bg-destructive font-bold text-white hover:bg-destructive/90"
    >
      <Link to="/emergency">Hilfe</Link>
    </Button>
  );
}
