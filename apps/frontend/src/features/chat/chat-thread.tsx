import { useEffect } from "react";
import type { ChatStatus, UIDataTypes, UIMessage } from "ai";
import type { ChatTools } from "@helthtw/shared/chat";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
} from "@/components/ui/message-scroller";
import { Message, MessageContent } from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { ChatMarkdown } from "@/features/chat/chat-markdown.tsx";
import { Button } from "@/components/ui/button";
import { ChatMaterial } from "./chat-material";

export type ChatUIMessage = UIMessage<unknown, UIDataTypes, ChatTools>;
type Part = ChatUIMessage["parts"][number];

// Free text, or else the reply the model wrote into show_material (shown while it streams in).
function textOf(message: ChatUIMessage) {
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  if (text) return text;
  const material = message.parts.find((p) => p.type === "tool-show_material");
  return material?.input?.reply ?? "";
}

// Tool results the chat shows: the picked material. Calls still streaming show nothing yet.
const isShown = (p: Part) => p.type === "tool-show_material" && p.state === "output-available";

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

// The last question got no reply, e.g. the app was closed while it was streaming.
function NoReply({ onRetry }: { onRetry: () => void }) {
  return (
    <MessageScrollerItem messageId="no-reply">
      <Message align="start">
        <MessageContent>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Darauf habe ich keine Antwort...</span>
            <Button size="sm" variant="outline" onClick={onRetry}>
              Erneut versuchen
            </Button>
          </div>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  );
}

function ScrollToEndOnSend({ status }: { status: ChatStatus }) {
  const { scrollToEnd } = useMessageScroller();
  useEffect(() => {
    if (status === "submitted") scrollToEnd({ behavior: "smooth" });
  }, [status, scrollToEnd]);
  return null;
}

function ToolResult({ part }: { part: Part }) {
  if (part.type === "tool-show_material" && part.state === "output-available") {
    return <ChatMaterial selection={part.output} />;
  }
  return null;
}

export function ChatThread({
  messages,
  status,
  onRetry,
}: {
  messages: ChatUIMessage[];
  status: ChatStatus;
  onRetry: () => void;
}) {
  const last = messages.at(-1);
  const lastHasContent = !!last && (textOf(last).length > 0 || last.parts.some(isShown));

  const thinking =
    status === "submitted" ||
    (status === "streaming" && last?.role === "assistant" && !lastHasContent);

  const noReply = status === "ready" && last?.role === "user";

  return (
    <MessageScrollerProvider autoScroll>
      <ScrollToEndOnSend status={status} />
      <MessageScroller className="min-h-0 flex-1">
        <MessageScrollerViewport className="scrollbar-none [&::-webkit-scrollbar]:hidden">
          <MessageScrollerContent className="p-4">
            {messages.map((m) => {
              const isUser = m.role === "user";
              const text = textOf(m);
              const tools = isUser ? [] : m.parts.filter(isShown);
              if (!isUser && !text && !tools.length) return null; // the thinking indicator covers this case

              const align = isUser ? "end" : "start";
              return (
                <MessageScrollerItem key={m.id} messageId={m.id}>
                  <Message align={align}>
                    <MessageContent>
                      {text && (
                        <Bubble align={align} variant={isUser ? "muted" : "default"}>
                          {isUser ? (
                            <BubbleContent className="whitespace-pre-wrap">{text}</BubbleContent>
                          ) : (
                            <BubbleContent>
                              <ChatMarkdown>{text}</ChatMarkdown>
                            </BubbleContent>
                          )}
                        </Bubble>
                      )}
                      {tools.map((part, i) => (
                        <ToolResult key={i} part={part} />
                      ))}
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              );
            })}
            {thinking && <Thinking />}
            {noReply && <NoReply onRetry={onRetry} />}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
