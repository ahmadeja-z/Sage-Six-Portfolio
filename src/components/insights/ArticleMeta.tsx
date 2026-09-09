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
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
      {showAuthor && <span className="text-sage/80">{article.author}</span>}
      {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
      {article.updatedAt && <span>Updated {formatDate(article.updatedAt)}</span>}
      <span>{article.readingTime}</span>
    </div>
  );
}