import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none prose-p:text-parchment/75 prose-headings:font-serif prose-strong:text-parchment prose-li:text-parchment/75 prose-blockquote:border-gold/35 prose-blockquote:text-parchment/70">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

