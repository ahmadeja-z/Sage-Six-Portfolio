import type { Insight } from "@/types";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function ArticleMeta({ article, showAuthor = true }: { article: Insight; showAuthor?: boolean }) {
  return (
    <div className="s6-article-meta">
      {showAuthor && <span className="s6-article-meta-author">{article.author}</span>}
      {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
      {article.updatedAt && <span>Updated {formatDate(article.updatedAt)}</span>}
      <span>{article.readingTime}</span>
    </div>
  );
}
