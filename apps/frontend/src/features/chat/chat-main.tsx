import { useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  type ConversationMessage,
  VOICE_HISTORY_MAX_CHARS,
  VOICE_HISTORY_MAX_MESSAGES,
} from "@helthtw/shared/chat";
import { ChatEmpty } from "./chat-empty";
import { ChatThread, type ChatUIMessage } from "./chat-thread";
import { textOf } from "./chat-text";
import { ChatInput } from "./chat-input";
import { ChatVoiceBar, ChatVoiceError } from "./chat-voice";
import { useVoiceSession, type VoiceTranscript } from "./chat-voice-session";
import { ChatError } from "@/features/chat/chat-error.tsx";
import { ChatAiNotice } from "@/features/chat/chat-ai-notice.tsx";
import { api } from "@/api";
import { chatCatalog } from "./chat-catalog";

const transport = new DefaultChatTransport<ChatUIMessage>({
  api: api.api.v1.chat.$path(),
  body: { catalog: chatCatalog },
});

function voiceHistory(messages: ChatUIMessage[]): ConversationMessage[] {
  return messages
    .flatMap((m) => {
      const text = textOf(m).trim().slice(0, VOICE_HISTORY_MAX_CHARS);
      return (m.role === "user" || m.role === "assistant") && text ? [{ role: m.role, text }] : [];
    })
    .slice(-VOICE_HISTORY_MAX_MESSAGES);
}

export function ChatMain() {
  const { messages, sendMessage, status, error, regenerate, clearError, setMessages } =
    useChat<ChatUIMessage>({
      transport,
    });
  const busy = status === "submitted" || status === "streaming";

  const showTranscript = useCallback(
    ({ id, role, text }: VoiceTranscript) =>
      setMessages((prev) => {
        const message: ChatUIMessage = { id: `voice-${id}`, role, parts: [{ type: "text", text }] };
        const index = prev.findIndex((m) => m.id === message.id);
        return index === -1 ? [...prev, message] : prev.with(index, message);
      }),
    [setMessages],
  );
  const voice = useVoiceSession(showTranscript);

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
        {voice.error && <ChatVoiceError message={voice.error} onDismiss={voice.clearError} />}
        {voice.state === "idle" ? (
          <ChatInput
            disabled={busy}
            onSend={(text) => sendMessage({ text })}
            onVoice={() => void voice.start(voiceHistory(messages))}
          />
        ) : (
          <ChatVoiceBar state={voice.state} onStop={voice.stop} />
        )}
      </div>
    </div>
  );
}
