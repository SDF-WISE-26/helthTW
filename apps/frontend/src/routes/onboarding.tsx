import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  return (
    <>
      <h1 className="text-2xl font-bold">Willkommen</h1>
      <p>Was die App ist</p>
      <Button asChild size="lg">
        <Link to="/">Los geht's</Link>
      </Button>
    </>
  );
}
