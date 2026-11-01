import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/emergency")({
  component: Emergency,
});

function Emergency() {
  return (
    <>
      <h1 className="text-2xl font-bold">Notfall</h1>
      <p>Ruhige Anweisungen + Kontakte</p>
    </>
  );
}
