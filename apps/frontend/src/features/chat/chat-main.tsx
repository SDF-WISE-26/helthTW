import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatEmpty } from "./chat-empty";
import { ChatThread } from "./chat-thread";
import { ChatInput } from "./chat-input";
import { ChatError } from "@/features/chat/chat-error.tsx";
import { ChatAiNotice } from "@/features/chat/chat-ai-notice.tsx";

const transport = new DefaultChatTransport({
  api: "/api/v1/chat",
});

export function ChatMain() {
  const { messages, sendMessage, status, error, regenerate, clearError, setMessages } = useChat({
    transport,
  });
  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="-m-4 flex min-h-0 flex-1 flex-col">
      <ChatAiNotice />

      {messages.length === 0 ? <ChatEmpty /> : <ChatThread messages={messages} status={status} />}

      <div className="p-4">
        {error && (
          <ChatError
            error={error}
            onRetry={() => {
              clearError();
              regenerate();
            }}
            onNewChat={() => {
              clearError();
              setMessages([]);
            }}
            onDismiss={clearError}
          />
        )}
        <ChatInput disabled={busy} onSend={(text) => sendMessage({ text })} />
      </div>
    </div>
  );
}
