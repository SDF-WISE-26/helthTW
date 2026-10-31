import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_tabs/info/")({
  component: Info,
});

function Info() {
  return (
    <>
      <h1 className="text-2xl font-bold">Info</h1>
      <Button asChild variant="outline" size="lg">
        <Link to="/info/$topic" params={{ topic: "schlaf" }}>
          Thema
        </Link>
      </Button>
    </>
  );
}
