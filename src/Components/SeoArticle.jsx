"use client";
import React, { useState } from "react";
import Head from "next/head";
import MarkdownRenderer from "@/Components/MarkdownRenderer";
import Link from "next/link";
import styles from "./SeoArticle.module.css"; // custom CSS file

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
  faqs = [],
  relatedPosts = [],
}) {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline: title,
    description,
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
  };

  return (
    <div className={styles.container}>
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

      <article className={styles.article}>
        <header className={styles.header}>
          <img src={ogImage} alt={title} className={styles.thumbnail} />
          <h1>{title}</h1>
          <div className={styles.meta}>
            Published: {formatHuman(publishDate)} • Updated:{" "}
            {formatHuman(modifiedDate)}
          </div>
        </header>

        <section className={styles.content}>
          <MarkdownRenderer content={markdown} />
        </section>

        {faqs.length > 0 && (
          <section className={styles.faq}>
            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </section>
        )}

        {relatedPosts.length > 0 && (
          <section className={styles.related}>
            <h2>Related Posts</h2>
            <div className={styles.relatedGrid}>
              {relatedPosts.map((post, idx) => (
                <Link key={idx} href={`/${post.slug}`} className={styles.card}>
                  <img src={post.ogImage} alt={post.title} />
                  <div>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button onClick={() => setOpen(!open)} className={styles.faqQuestion}>
        {question}
      </button>
      {open && <div className={styles.faqAnswer}>{answer}</div>}
    </div>
  );
}
