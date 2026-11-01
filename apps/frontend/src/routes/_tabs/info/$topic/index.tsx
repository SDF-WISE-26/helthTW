import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_tabs/info/$topic/")({
  component: Topic,
});

function Topic() {
  const { topic } = Route.useParams();

  return (
    <>
      <h1 className="text-2xl font-bold">Thema</h1>
      <Button asChild variant="outline" size="lg">
        <Link to="/info/$topic/$article" params={{ topic, article: "schlaf1" }}>
          Artikel
        </Link>
      </Button>
    </>
  );
}
