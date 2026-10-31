import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_tabs/contacts")({
  component: Contacts,
});

function Contacts() {
  return <h1 className="text-2xl font-bold">Kontakte</h1>;
}
