import type { ContentBlock } from "@/types";

export function ArticleContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                id={slugify(block.text)}
                className="scroll-mt-28 pt-8 font-display text-2xl font-medium tracking-tight text-bone md:text-3xl"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="pt-2 font-display text-xl font-medium tracking-tight text-bone"
              >
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-2.5">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-fog md:text-base">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-sage/70" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-2.5">
                {block.items.map((item, n) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-fog md:text-base">
                    <span className="w-6 shrink-0 font-mono text-[11px] tracking-[0.2em] text-sage/70">
                      {String(n + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            );
          case "links":
            return (
              <ul key={i} className="space-y-2.5">
                {block.items.map((item) => (
                  <li key={item.href + item.text} className="flex flex-col gap-1">
                    <a
                      href={item.href}
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-sage transition-colors duration-300 hover:text-sage-bright"
                    >
                      {item.text}
                      <span aria-hidden="true">→</span>
                    </a>
                    {item.note && (
                      <span className="text-sm leading-relaxed text-mist">{item.note}</span>
                    )}
                  </li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={i} className="text-[16px] leading-[1.8] text-fog md:text-[17px]">
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