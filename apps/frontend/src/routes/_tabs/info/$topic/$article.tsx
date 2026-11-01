import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_tabs/info/$topic/$article")({
  component: Article,
});

function Article() {
  return (
    <>
      <h1 className="text-2xl font-bold">Artikel</h1>
      <p>Zusammenfassung</p>
      <Button asChild variant="outline" size="lg">
        <Link to="/questionnaires/$questionnaireId" params={{ questionnaireId: "schlaf" }}>
          Selbsttest
        </Link>
      </Button>
    </>
  );
}
