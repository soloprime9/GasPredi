"use client";
import React from "react";
import Head from "next/head";
import MarkdownRenderer from "@/Components/MarkdownRenderer";

function formatHuman(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SeoArticle({
  title,
  description,
  publishDate,
  modifiedDate,
  tags = [],
  canonical,
  ogImage,
  markdown,
}) {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline: title,
    description: description,
    image: [ogImage],
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: { "@type": "Organization", name: "Fondpeace Editorial Team" },
    publisher: {
      "@type": "Organization",
      name: "Fondpeace",
      logo: { "@type": "ImageObject", url: "https://fondpeace.com/logo.jpg" },
    },
    keywords: tags.join(", "),
    articleSection: "TV Recap",
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={tags.join(", ")} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Fondpeace" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:modified_time" content={modifiedDate} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
      </Head>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <article className="prose prose-gray max-w-none">
          <header className="not-prose">
            <h1 className="text-2xl md:text-4xl font-extrabold">{title}</h1>
            <div className="mt-2 text-sm text-gray-600">
              Published: {formatHuman(publishDate)} • Last updated:{" "}
              {formatHuman(modifiedDate)} • By Fondpeace Editorial Team
            </div>
          </header>

          <section className="mt-6">
            <MarkdownRenderer content={markdown} />
          </section>
        </article>
      </main>
    </div>
  );
}
