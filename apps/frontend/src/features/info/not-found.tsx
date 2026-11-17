import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function InfoNotFound() {
  return (
    <>
      <h1 className="text-2xl font-bold">Nicht gefunden</h1>
      <p>Diese Seite gibt es nicht</p>
      <Button asChild size="lg" className="self-start">
        <Link to="/info">Zum Infomaterial</Link>
      </Button>
    </>
  );
}
