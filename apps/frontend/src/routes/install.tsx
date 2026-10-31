import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/install")({
  component: Install,
});

function Install() {
  return (
    <>
      <h1 className="text-2xl font-bold">Installieren</h1>
      <p>Android</p>
      <p>iOS</p>
    </>
  );
}
