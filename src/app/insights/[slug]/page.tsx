import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsight, getPublishedInsights, AUTHOR } from "@/data/insights";
import { siteConfig } from "@/lib/site";
import { ArticleMeta } from "@/components/insights/ArticleMeta";
import { ArticleContent, getArticleHeadings } from "@/components/insights/ArticleContent";
import { ArticleTOC } from "@/components/insights/ArticleTOC";
import { RelatedContent } from "@/components/insights/RelatedContent";
import { ArticleCTA } from "@/components/insights/ArticleCTA";

type PageProps = { params: Promise<{ slug: string }> };

function BreadcrumbNav({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="container-x pt-28 md:pt-36">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
        <li className="flex items-center gap-2">
          <Link href="/" className="transition-colors hover:text-sage">
            Home
          </Link>
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true">/</span>
          <Link href="/insights" className="transition-colors hover:text-sage">
            Insights
          </Link>
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="max-w-[220px] truncate text-fog">
            {title}
          </span>
        </li>
      </ol>
    </nav>
  );
}

export function generateStaticParams() {
  return getPublishedInsights().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article || !article.published) return { title: "Article not found" };

  const url = `${siteConfig.url}/insights/${article.slug}`;
  return {
    title: { absolute: article.seoTitle },
    description: article.seoDescription,
    authors: [{ name: article.author }],
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      url,
      type: "article",
      authors: [article.author],
      publishedTime: article.publishedAt || undefined,
      ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle,
      description: article.seoDescription,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article || !article.published) notFound();

  const headings = getArticleHeadings(article.content);
  const url = `${siteConfig.url}/insights/${article.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
        { "@type": "ListItem", position: 2, name: "Insights", item: `${siteConfig.url}/insights` },
        { "@type": "ListItem", position: 3, name: article.title },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.seoDescription,
      url,
      mainEntityOfPage: url,
      datePublished: article.publishedAt || undefined,
      ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
      articleSection: article.category,
      author: {
        "@type": "Person",
        name: article.author,
        description: AUTHOR.description,
      },
      publisher: {
        "@type": "Organization",
        name: "SageSix",
        url: siteConfig.url,
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BreadcrumbNav title={article.title} />

      <header className="container-x pb-10 pt-10 md:pb-14">
        <div className="max-w-4xl">
          <Link
            href="/insights"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage transition-colors hover:text-sage-bright"
          >
            {article.category}
          </Link>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-bone md:text-6xl">
            {article.title}
          </h1>
          <p className="body-lg mt-7 max-w-3xl text-fog">{article.excerpt}</p>
          <div className="mt-8">
            <ArticleMeta article={article} />
          </div>
        </div>
      </header>

      <div className="container-x grid gap-14 pb-16 md:pb-24 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <div className="border-t border-line pt-10">
            <ArticleContent blocks={article.content} />
          </div>
        </div>
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <ArticleTOC headings={headings} />
          </div>
        </aside>
      </div>

      <RelatedContent article={article} />
      <ArticleCTA />
    </>
  );
}