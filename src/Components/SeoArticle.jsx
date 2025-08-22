// src/components/SeoArticle.jsx
"use client";
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer"; // keep your renderer

function formatHuman(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function Accordion({ qa, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        className="w-full text-left flex justify-between items-center font-medium"
      >
        <span>{qa.q}</span>
        <span className="ml-2 text-xl">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="mt-2 text-gray-700">{qa.a}</div>}
    </div>
  );
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
  faqs = [],
  relatedPosts = [],
}) {
  const siteName = "Today Written Update";
  const logo = "https://todaywrittenupdate.blog/logo.png"; // change if needed

  // JSON-LD: Article
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline: title,
    description,
    image: [ogImage],
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: { "@type": "Organization", name: siteName },
    publisher: { "@type": "Organization", name: siteName, logo: { "@type": "ImageObject", url: logo } },
    keywords: Array.isArray(tags) ? tags.join(", ") : tags,
    articleSection: "TV Recap",
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://todaywrittenupdate.blog/" },
      { "@type": "ListItem", position: 2, name: "Written Updates", item: "https://todaywrittenupdate.blog/written-updates" },
      { "@type": "ListItem", position: 3, name: title, item: canonical },
    ],
  };

  const faqLd =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }
      : null;

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{title} | Today Written Update</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={Array.isArray(tags) ? tags.join(", ") : tags} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:site_name" content={siteName} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:modified_time" content={modifiedDate} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      </Head>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Thumbnail */}
        <div className="mb-6">
          <img src={ogImage} alt={title} className="w-full h-auto rounded-lg shadow-md object-cover max-h-[520px]" />
        </div>

        {/* Article header */}
        <article className="prose prose-lg max-w-none">
          <header className="not-prose">
            <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
            <div className="mt-2 text-sm text-gray-600">
              Published: {formatHuman(publishDate)} • Updated: {formatHuman(modifiedDate)}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-full">{t}</span>
              ))}
            </div>
          </header>

          <section className="mt-6">
            <MarkdownRenderer content={markdown} />
          </section>
        </article>

        {/* FAQ (click-to-open answers) */}
        {faqs && faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              {faqs.map((f, idx) => (
                <Accordion key={idx} qa={f} idx={idx} />
              ))}
            </div>
          </section>
        )}

        {/* Related posts — simple grid, OG thumbnails shown */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} className="block border rounded-lg overflow-hidden hover:shadow-lg transition">
                  <div className="w-full h-40 bg-gray-100 relative">
                    <img src={p.ogImage} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-lg">{p.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
