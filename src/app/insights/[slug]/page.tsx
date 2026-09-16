import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsight, getPublishedInsights, AUTHOR } from "@/data/insights";
import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/home/motion";
import { ArticleMeta } from "@/components/insights/ArticleMeta";
import { ArticleContent, getArticleHeadings } from "@/components/insights/ArticleContent";
import { ArticleTOC } from "@/components/insights/ArticleTOC";
import { RelatedContent } from "@/components/insights/RelatedContent";
import { ArticleCTA } from "@/components/insights/ArticleCTA";

type PageProps = { params: Promise<{ slug: string }> };

function BreadcrumbNav({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="s6-container s6-article-breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <span aria-hidden="true">/</span>
          <Link href="/insights">Insights</Link>
        </li>
        <li>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
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
    <div className="s6 s6-home s6-insights">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BreadcrumbNav title={article.title} />

      <header className="s6-container s6-article-header">
        <div className="s6-article-measure">
          <Reveal entrance>
            <Link href="/insights" className="s6-article-category-link">
              {article.category}
            </Link>
          </Reveal>
          <Reveal entrance delay={0.08}>
            <h1 className="s6-article-h1">{article.title}</h1>
          </Reveal>
          <Reveal entrance delay={0.16}>
            <p className="s6-article-excerpt">{article.excerpt}</p>
          </Reveal>
          <Reveal entrance delay={0.22}>
            <div className="mt-8">
              <ArticleMeta article={article} />
            </div>
          </Reveal>
        </div>
      </header>

      <div className="s6-container s6-article-layout">
        <div className="min-w-0">
          <Reveal delay={0.1} effect="line" className="s6-drawn-divider s6-article-divider">
            <span />
          </Reveal>
          <ArticleContent blocks={article.content} />
        </div>
        <aside>
          <div className="s6-article-toc-sticky">
            <ArticleTOC headings={headings} />
          </div>
        </aside>
      </div>

      <RelatedContent article={article} />
      <ArticleCTA />
    </div>
  );
}
