import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const MODES = { text: "Text", voice: "Stimme", avatar: "Avatar" } as const;

export const Route = createFileRoute("/_tabs/chat")({
  validateSearch: z.object({
    mode: z.enum(["text", "voice", "avatar"]).default("text").catch("text"),
  }),
  component: Chat,
});

function Chat() {
  const { mode } = Route.useSearch();

  return (
    <>
      <h1 className="text-2xl font-bold">Chat</h1>
      <div className="flex gap-2">
        {Object.entries(MODES).map(([key, label]) => (
          <Button key={key} asChild variant={key === mode ? "default" : "outline"}>
            <Link to="/chat" search={{ mode: key as keyof typeof MODES }}>
              {label}
            </Link>
          </Button>
        ))}
      </div>
    </>
  );
}
