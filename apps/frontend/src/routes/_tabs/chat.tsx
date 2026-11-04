import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_tabs/chat")({
  component: Chat,
});

function Chat() {
  return <h1 className="text-2xl font-bold">Chat</h1>;
}
