import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport } from "ai";
import { ChatEmpty } from "./chat-empty";
import { ChatThread, type ChatUIMessage } from "./chat-thread";
import { ChatInput } from "./chat-input";
import { ChatError } from "@/features/chat/chat-error.tsx";
import { ChatAiNotice } from "@/features/chat/chat-ai-notice.tsx";
import { api } from "@/api";
import { getAccountId } from "@/features/account/account-id";
import { chatCatalog } from "./chat-catalog";
import { chatHistoryQuery } from "./chat-history";

const transport = new DefaultChatTransport<ChatUIMessage>({
  api: api.api.v1.chat.$path(),
  headers: () => ({ "X-Account-Id": getAccountId() }),
  prepareSendMessagesRequest: ({ messages }) => ({
    // only send latest message + catalog to backend
    body: { message: messages.at(-1), catalog: chatCatalog },
  }),
});

export function ChatMain() {
  const history = useQuery(chatHistoryQuery);

  return (
    <div className="-m-4 flex min-h-0 flex-1 flex-col">
      <ChatAiNotice />
      {history.data ? (
        <ChatSession initialMessages={history.data} />
      ) : (
        <>
          <div className="flex-1" />
          <div className="p-4">
            {history.isError && (
              <ChatError error={history.error} onRetry={() => void history.refetch()} />
            )}
            <ChatInput disabled onSend={() => {}} />
          </div>
        </>
      )}
    </div>
  );
}

function ChatSession({ initialMessages }: { initialMessages: ChatUIMessage[] }) {
  const queryClient = useQueryClient();
  const { messages, sendMessage, status, error, regenerate, clearError } = useChat<ChatUIMessage>({
    transport,
    messages: initialMessages,
    onFinish: ({ messages, isError, isAbort }) => {
      if (isError || isAbort) return;
      queryClient.setQueryData(chatHistoryQuery.queryKey, messages);
    },
  });
  const busy = status === "submitted" || status === "streaming";

  return (
    <>
      {messages.length === 0 ? (
        <ChatEmpty />
      ) : (
        <ChatThread messages={messages} status={status} onRetry={() => regenerate()} />
      )}

      <div className="p-4">
        {error && (
          <ChatError
            error={error}
            onRetry={() => {
              clearError();
              regenerate();
            }}
            onDismiss={clearError}
          />
        )}
        <ChatInput disabled={busy} onSend={(text) => sendMessage({ text })} />
      </div>
    </>
  );
}
