import { createFileRoute } from "@tanstack/react-router";
import { ChatMain } from "@/features/chat";

export const Route = createFileRoute("/_tabs/chat")({
  component: Chat,
});

function Chat() {
  return <ChatMain />;
}
