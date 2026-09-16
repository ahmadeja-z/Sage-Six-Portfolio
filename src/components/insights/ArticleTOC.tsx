import { slugify } from "@/components/insights/ArticleContent";

export function ArticleTOC({ headings }: { headings: string[] }) {
  if (headings.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="s6-article-toc">
      <p className="s6-eyebrow">On this page</p>
      <ul>
        {headings.map((heading) => (
          <li key={heading}>
            <a href={`#${slugify(heading)}`}>{heading}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
