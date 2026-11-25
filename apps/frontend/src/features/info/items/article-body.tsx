import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Links leave the app in a new tab, like the sheet's buttons for pdf and link items.
const components: Components = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (öffnet in neuem Tab)</span>
    </a>
  ),
};

// The Markdown body of an article item, in the app's text styles.
export function ArticleBody({ markdown }: { markdown: string }) {
  return (
    <div
      className="prose max-w-none text-body! text-foreground
    prose-h2:mt-8 prose-h2:mb-2 prose-h2:text-heading
    [--tw-prose-body:currentColor] [--tw-prose-headings:currentColor]
    [--tw-prose-bold:currentColor] [--tw-prose-links:currentColor]
    [--tw-prose-bullets:currentColor] [--tw-prose-counters:currentColor]"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
