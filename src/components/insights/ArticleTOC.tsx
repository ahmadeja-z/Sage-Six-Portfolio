import { slugify } from "@/components/insights/ArticleContent";

export function ArticleTOC({ headings }: { headings: string[] }) {
  if (headings.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="border-l border-line pl-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist">
        On this page
      </p>
      <ul className="mt-4 space-y-2.5">
        {headings.map((heading) => (
          <li key={heading}>
            <a
              href={`#${slugify(heading)}`}
              className="text-sm leading-snug text-fog transition-colors duration-300 hover:text-sage"
            >
              {heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}