import type { ChatStatus, UIDataTypes, UIMessage } from "ai";
import type { ChatTools } from "@helthtw/shared/chat";
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
import { ChatMaterial } from "./chat-material";
import { textOf } from "./chat-text";

export type ChatUIMessage = UIMessage<unknown, UIDataTypes, ChatTools>;
type Part = ChatUIMessage["parts"][number];

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

function ToolResult({ part }: { part: Part }) {
  if (part.type === "tool-show_material" && part.state === "output-available") {
    return <ChatMaterial selection={part.output} />;
  }
  return null;
}

export function ChatThread({
  messages,
  status,
}: {
  messages: ChatUIMessage[];
  status: ChatStatus;
}) {
  const last = messages.at(-1);
  const lastHasContent = !!last && (textOf(last).length > 0 || last.parts.some(isShown));

  // "submitted": request sent, nothing back yet.
  // "streaming" with an empty assistant message: stream opened, first token or tool result not here yet.
  const thinking =
    status === "submitted" ||
    (status === "streaming" && last?.role === "assistant" && !lastHasContent);

  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller className="min-h-0 flex-1">
        <MessageScrollerViewport className="scrollbar-none [&::-webkit-scrollbar]:hidden">
          <MessageScrollerContent className="p-4">
            {messages.map((m) => {
              const isUser = m.role === "user";
              const text = textOf(m);
              const tools = isUser ? [] : m.parts.filter(isShown);
              if (!isUser && !text && !tools.length) return null; // stream to AI is open, but no response from AI loaded yet -> the thinking indicator covers this case

              const align = isUser ? "end" : "start";
              return (
                <MessageScrollerItem key={m.id} messageId={m.id} scrollAnchor={isUser}>
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
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
