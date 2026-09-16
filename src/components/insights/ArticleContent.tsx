import type { ContentBlock } from "@/types";

export function ArticleContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="s6-article-prose">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} id={slugify(block.text)} className="s6-article-h2">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="s6-article-h3">
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="s6-article-list">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="s6-article-list s6-article-list-ordered">
                {block.items.map((item, n) => (
                  <li key={item}>
                    <span className="s6-article-list-index">{String(n + 1).padStart(2, "0")}</span>
                    {item}
                  </li>
                ))}
              </ol>
            );
          case "links":
            return (
              <ul key={i} className="s6-article-links">
                {block.items.map((item) => (
                  <li key={item.href + item.text}>
                    <a
                      href={item.href}
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="s6-article-link"
                    >
                      {item.text}
                      <span aria-hidden="true">→</span>
                    </a>
                    {item.note && <span className="s6-article-link-note">{item.note}</span>}
                  </li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={i} className="s6-article-p">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getArticleHeadings(blocks: ContentBlock[]): string[] {
  return blocks.filter((b) => b.type === "h2").map((b) => (b as { text: string }).text);
}
