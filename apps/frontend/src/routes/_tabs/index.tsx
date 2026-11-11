import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { beforeHomeLoad } from "@/features/onboarding/onboarding-navigation";

export const Route = createFileRoute("/_tabs/")({
  beforeLoad: beforeHomeLoad,
  component: Start,
});

function Start() {
  return (
    <>
      <h1 className="text-2xl font-bold">Start</h1>
      <Button asChild variant="outline" size="lg">
        <Link to="/wellbeing">Wellbeing Score</Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link to="/incidents/new">Harten Einsatz loggen</Link>
      </Button>
    </>
  );
}
