import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "@/components/ui/button";

// One route, three steps: when → reminders → tips. The step lives in the URL so back works.
export const Route = createFileRoute("/incidents/new")({
  validateSearch: z.object({
    step: z
      .union([z.literal(1), z.literal(2), z.literal(3)])
      .default(1)
      .catch(1),
  }),
  component: LogIncident,
});

function LogIncident() {
  const { step } = Route.useSearch();

  if (step === 1) {
    return (
      <>
        <h1 className="text-2xl font-bold">Wann?</h1>
        <Button asChild size="lg">
          <Link to="/incidents/new" search={{ step: 2 }}>
            Gerade eben
          </Link>
        </Button>
        <p>Anderer Zeitpunkt</p>
      </>
    );
  }

  if (step === 2) {
    return (
      <>
        <h1 className="text-2xl font-bold">Erinnerungen</h1>
        <p>Tag 1 · 3 · 7 · 28</p>
        <Button asChild size="lg">
          <Link to="/incidents/new" search={{ step: 3 }}>
            Weiter
          </Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Sofort Tipps</h1>
      <p>BLA BLA</p>
      <Button asChild variant="outline" size="lg">
        <Link to="/chat">Chat</Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link to="/contacts">Kontakte</Link>
      </Button>
      <Button asChild size="lg">
        <Link to="/">Fertig</Link>
      </Button>
    </>
  );
}
