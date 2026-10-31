import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_tabs/wellbeing")({
  component: Wellbeing,
});

function Wellbeing() {
  return (
    <>
      <h1 className="text-2xl font-bold">Wellbeing</h1>
      <p>Score + Empfehlung</p>
      <p>Was eingeflossen ist</p>
      <Button asChild variant="outline" size="lg">
        <Link to="/contacts">Kontakt anrufen</Link>
      </Button>
    </>
  );
}
