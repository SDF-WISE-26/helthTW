import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/questionnaires/$questionnaireId")({
  component: Questionnaire,
});

function Questionnaire() {
  return (
    <>
      <h1 className="text-2xl font-bold">Check-in</h1>
      <p>Fragen</p>
      <Button asChild size="lg">
        <Link to="/">Absenden</Link>
      </Button>
    </>
  );
}
