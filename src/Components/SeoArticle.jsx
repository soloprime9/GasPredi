// src/Components/SeoArticle.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import MarkdownRenderer from "@/Components/MarkdownRenderer";
import styles from "./SeoArticle.module.css";

function formatHuman(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso || "";
  }
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
  author = { name: "todaywrittenupdate team" },
}) {
  const contentRef = useRef(null);
  const [toc, setToc] = useState([]);

  useEffect(() => {
    // Build TOC from rendered headings (h2/h3)
    if (!contentRef.current) return;
    const headings = Array.from(contentRef.current.querySelectorAll("h2, h3"));
    const items = headings.map((h) => ({
      id: h.id || h.textContent.toLowerCase().trim().replace(/[^\w\- ]+/g, "").replace(/\s+/g, "-"),
      text: h.textContent,
      level: h.tagName === "H2" ? 2 : 3,
    }));
    setToc(items);
  }, [markdown]);

  // JSON-LD (Article + Breadcrumb + FAQ if present)
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline: title,
    description,
    image: [ogImage],
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: { "@type": "Organization", name: author.name || "todaywrittenupdate team" },
    publisher: {
      "@type": "Organization",
      name: "Today Written Update",
      logo: { "@type": "ImageObject", url: "https://todaywrittenupdate.blog/logo.png" },
    },
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
    faqs && faqs.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <div className={styles.container}>
      <Head>
        <title>{title} | todaywrittenupdate</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={Array.isArray(tags) ? tags.join(", ") : tags} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="todaywrittenupdate" />
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

      <article className={styles.article}>
        <header className={styles.header}>
          {ogImage && <img src={ogImage} alt={title} className={styles.thumbnail} />}
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.meta}>
            By <strong>{author.name || "todaywrittenupdate team"}</strong> • Published: {formatHuman(publishDate)} • Updated: {formatHuman(modifiedDate)}
          </div>
        </header>

        <div className={styles.topRow}>
          {/* TOC */}
          {toc.length > 0 && (
            <nav className={styles.toc}>
              <div className={styles.tocTitle}>On this page</div>
              <ul>
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? styles.tocSub : ""}>
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Content */}
          <div className={styles.content} ref={contentRef}>
            <MarkdownRenderer content={markdown} />
          </div>
        </div>

        {/* FAQ (rendered once, accordion-style) */}
        {faqs && faqs.length > 0 && (
          <section className={styles.faqSection}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} />
              ))}
            </div>
          </section>
        )}

        {/* Related posts (small cards) */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className={styles.related}>
            <h2>Related posts</h2>
            <div className={styles.relatedGrid}>
              {relatedPosts.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} className={styles.card}>
                  <div className={styles.cardImgWrap}>
                    <img src={p.ogImage} alt={p.title} />
                  </div>
                  <div className={styles.cardBody}>
                    <h3>{p.title}</h3>
                    <p className={styles.cardDesc}>{p.description}</p>
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

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button onClick={() => setOpen((s) => !s)} className={styles.faqQuestion} aria-expanded={open}>
        {q}
        <span className={styles.faqToggle}>{open ? "−" : "+"}</span>
      </button>
      {open && <div className={styles.faqAnswer}>{a}</div>}
    </div>
  );
        }
