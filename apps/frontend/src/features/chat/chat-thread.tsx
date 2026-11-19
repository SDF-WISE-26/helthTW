import type { ChatStatus, UIMessage } from "ai";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import { Message, MessageContent } from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { ChatMarkdown } from "@/features/chat/chat-markdown.tsx";

function textOf(message: UIMessage) {
  return message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function Thinking() {
  return (
    <MessageScrollerItem messageId="thinking">
      <Message align="start">
        <MessageContent>
          <Bubble align="start" variant="default">
            <BubbleContent role="status" aria-label="The assistant is thinking">
              <span className="flex items-center gap-1 py-1">
                <span className="size-1.5 animate-bounce rounded-full bg-current opacity-60 [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-current opacity-60 [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-current opacity-60" />
              </span>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  );
}

export function ChatThread({ messages, status }: { messages: UIMessage[]; status: ChatStatus }) {
  const last = messages.at(-1);
  const lastHasText = !!last && textOf(last).length > 0;

  // "submitted": request sent, nothing back yet.
  // "streaming" with an empty assistant message: stream opened, first token not here yet.
  const thinking =
    status === "submitted" ||
    (status === "streaming" && last?.role === "assistant" && !lastHasText);

  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller className="min-h-0 flex-1">
        <MessageScrollerViewport className="scrollbar-none [&::-webkit-scrollbar]:hidden">
          <MessageScrollerContent className="p-4">
            {messages.map((m) => {
              const isUser = m.role === "user";
              const text = textOf(m);
              if (!isUser && !text) return null; // stream to AI is open, but no response from AI loaded yet -> the thinking indicator covers this case

              const align = isUser ? "end" : "start";
              return (
                <MessageScrollerItem key={m.id} messageId={m.id} scrollAnchor={isUser}>
                  <Message align={align}>
                    <MessageContent>
                      <Bubble align={align} variant={isUser ? "muted" : "default"}>
                        {isUser ? (
                          <BubbleContent className="whitespace-pre-wrap">{text}</BubbleContent>
                        ) : (
                          <BubbleContent>
                            <ChatMarkdown>{text}</ChatMarkdown>
                          </BubbleContent>
                        )}
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              );
            })}
            {thinking && <Thinking />}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
