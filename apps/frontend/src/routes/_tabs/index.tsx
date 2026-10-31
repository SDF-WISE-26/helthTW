import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_tabs/")({
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
