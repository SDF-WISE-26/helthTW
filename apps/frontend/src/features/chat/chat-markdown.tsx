import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ChatMarkdown({ children }: { children: string }) {
  return (
    <div
      className="prose max-w-none text-[length:inherit]! leading-[inherit]!
    [--tw-prose-body:currentColor] [--tw-prose-headings:currentColor]
    [--tw-prose-bold:currentColor] [--tw-prose-links:currentColor]
    [--tw-prose-bullets:currentColor] [--tw-prose-counters:currentColor]
    [--tw-prose-code:currentColor]"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
