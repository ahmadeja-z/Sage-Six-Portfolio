import { Fragment } from "react";

type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string };

const URL_RE = /(https?:\/\/[^\s<]+[^\s<.,;:'")\]])/g;

function linkify(text: string, keyPrefix: string) {
  const parts = text.split(URL_RE);
  return parts
    .filter((part) => part.length > 0)
    .map((part, i) =>
      /^https?:\/\//.test(part) ? (
        <a
          key={`${keyPrefix}-a-${i}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all underline decoration-current/40 underline-offset-2 hover:decoration-current"
        >
          {part}
        </a>
      ) : (
        <Fragment key={`${keyPrefix}-t-${i}`}>{part}</Fragment>
      ),
    );
}

function parseTextBlocks(text: string): Block[] {
  return text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const isList = lines.length > 0 && lines.every((l) => /^([-*]|\d+\.)\s+/.test(l));
      if (isList) {
        return { type: "list", items: lines.map((l) => l.replace(/^([-*]|\d+\.)\s+/, "")) } satisfies Block;
      }
      return { type: "p", text: chunk } satisfies Block;
    });
}

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  const codeFence = /```\w*\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = codeFence.exec(content))) {
    if (match.index > lastIndex) {
      blocks.push(...parseTextBlocks(content.slice(lastIndex, match.index)));
    }
    blocks.push({ type: "code", text: match[1].replace(/\n$/, "") });
    lastIndex = codeFence.lastIndex;
  }
  if (lastIndex < content.length) {
    blocks.push(...parseTextBlocks(content.slice(lastIndex)));
  }
  return blocks;
}

// Renders assistant/user text as paragraphs, bullet/numbered lists and code
// fences without a markdown dependency; auto-links bare URLs and preserves
// line breaks while keeping long words/URLs from overflowing the bubble.
export function MessageContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        if (block.type === "code") {
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-lg bg-slate-900 px-3 py-2.5 text-[12px] leading-relaxed text-slate-100"
            >
              <code className="whitespace-pre-wrap break-words">{block.text}</code>
            </pre>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="list-disc space-y-1 pl-4">
              {block.items.map((item, j) => (
                <li key={j} className="break-words">
                  {linkify(item, `${i}-${j}`)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap break-words">
            {linkify(block.text, `${i}`)}
          </p>
        );
      })}
    </div>
  );
}
