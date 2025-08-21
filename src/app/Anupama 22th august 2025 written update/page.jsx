"use client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import MarkdownRenderer from "@/Components/MarkdownRenderer";

// ✅ CONFIG — Update these per post
const POST = {
  title: "Anupama 10 April 2025 Written Update: Will Khyati Reveal the Truth?",
  slug: "anupama-10-april-2025-written-update",
  description:
    "Full written update of Anupama (10 April 2025): Khyati wrestles with guilt as Anupama encourages her to reveal the truth. Big twists, emotions, and a shocking dream!",
  author: {
    name: "Fondpeace Editorial Team",
    url: "https://www.fondpeace.com/about",
  },
  tags: [
    "Anupama written update",
    "Anupamaa 10 April 2025",
    "Star Plus",
    "Hindi serial updates",
    "TV episode recap",
  ],
  // ISO strings for SEO
  datePublished: "2025-04-10T19:30:00+05:30",
  dateModified: "2025-04-10T20:15:00+05:30",
  // OpenGraph/Twitter images (1200x630 recommended)
  ogImage: {
    url: "https://fondpeace.com/images/anupama-10-april-2025.jpg",
    width: 1200,
    height: 630,
    alt: "Anupama 10 April 2025 Written Update",
  },
  canonical: "https://www.fondpeace.com/blog/anupama-10-april-2025-written-update",
  primaryLang: "en-IN",
  alternates: [
    {
      hrefLang: "x-default",
      href: "https://www.fondpeace.com/blog/anupama-10-april-2025-written-update",
    },
    {
      hrefLang: "en-IN",
      href: "https://www.fondpeace.com/blog/anupama-10-april-2025-written-update",
    },
    // Example if you also serve Hindi: add a /hi/ page
    // { hrefLang: "hi-IN", href: "https://www.fondpeace.com/hi/blog/anupama-10-april-2025-written-update" },
  ],
};

export default function Home() {
  const [markdown, setMarkdown] = useState(`# ${POST.title}

Hello friends! In today's episode of **Anupama**, we see Anupama and Khyati sharing an intense conversation. Khyati feels guilty for her actions, and Anupama gently encourages her to reveal the truth to the family.

Later, Rahi takes Khyati to meet Aryan. Overwhelmed by guilt, Khyati confesses in her heart—but hesitates to speak out loud. Anupama reminds her that truth is the only way to heal and find peace.

Khyati then tells Anupama that **Parag** won’t allow someone to enter the house and will question her. When Parag notices Khyati’s tears, he asks what’s wrong. Khyati hides the truth and lies that she got hurt by the table.

Meanwhile, **Raghav** meets Anupama and declares he will reopen his case to prove himself innocent. Anupama is encouraged by his confidence. Prem tries to assure Rahi to stay hopeful.

Aryan returns home in a furious mood, vowing revenge. Khyati worries for her son—only to wake up and realize it was a dream.

After all of this, Khyati meets Anupama and finally decides to tell her everything, asking for guidance on how to fix the situation.

Elsewhere, Khyati’s brother meets Aryan and admits he failed to help. Aryan is hurt that Khyati didn’t support him. **Prem** later manages to get Aryan out of jail, frustrating Parag and others. Rahi calls everyone to meet Aryan. 

*For more updates, drop your thoughts in the comments below!* 

**Sources**: <a href="https://www.hotstar.com/in" rel="nofollow noopener" target="_blank">Disney+ Hotstar (India)</a>, <a href="https://www.iwmbuzz.com/television/written-updates" rel="nofollow noopener" target="_blank">IWMBuzz</a>
`);

  // Derived helpers
  const wordCount = useMemo(() => markdown.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length, [markdown]);
  const readingTime = useMemo(() => Math.max(1, Math.round(wordCount / 200)), [wordCount]);

  // Structured Data (JSON-LD)
  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Fondpeace',
    url: 'https://www.fondpeace.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.fondpeace.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.fondpeace.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.fondpeace.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: POST.title,
        item: POST.canonical,
      },
    ],
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': POST.canonical,
    },
    headline: POST.title,
    description: POST.description,
    image: [POST.ogImage.url],
    datePublished: POST.datePublished,
    dateModified: POST.dateModified,
    author: {
      '@type': 'Organization',
      name: POST.author.name,
      url: POST.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Fondpeace',
      logo: {
        '@type': 'ImageObject',
        url: 'https://fondpeace.com/logo.jpg',
      },
    },
    articleSection: 'TV Recap',
    keywords: POST.tags.join(", "),
  };

  const tvEpisodeLd = {
    '@context': 'https://schema.org',
    '@type': 'TVEpisode',
    name: POST.title,
    datePublished: POST.datePublished,
    episodeNumber: '1234',
    partOfSeason: {
      '@type': 'TVSeason',
      seasonNumber: '2025',
    },
    partOfSeries: {
      '@type': 'TVSeries',
      name: 'Anupama',
      sameAs: 'https://www.hotstar.com/in/tv/anupama/1260022011',
    },
    description: POST.description,
    mainEntityOfPage: POST.canonical,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What happened in Anupama on 10 April 2025?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Khyati struggles with guilt while Anupama urges her to tell the truth. Aryan’s revenge dream shocks viewers, and Prem helps Aryan get released.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who confronted Anupama in this episode?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Raghav meets Anupama and vows to reopen his case to prove his innocence, which encourages Anupama.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this a spoiler-free update?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'This is a concise written update with essential plot points and minimal spoilers to help you follow the episode.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 🔎 SEO HEAD — 2025-ready */}
      <Head>
        {/* Primary Meta */}
        <title>{POST.title}</title>
        <meta name="description" content={POST.description} />
        <meta name="keywords" content={POST.tags.join(", ")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="author" content={POST.author.name} />
        <meta httpEquiv="content-language" content={POST.primaryLang} />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light" />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Fondpeace" />
        <meta property="og:title" content={POST.title} />
        <meta property="og:description" content={POST.description} />
        <meta property="og:url" content={POST.canonical} />
        <meta property="og:image" content={POST.ogImage.url} />
        <meta property="og:image:width" content={String(POST.ogImage.width)} />
        <meta property="og:image:height" content={String(POST.ogImage.height)} />
        <meta property="og:locale" content={POST.primaryLang} />
        {POST.tags.map((t) => (
          <meta key={t} property="article:tag" content={t} />
        ))}
        <meta property="article:published_time" content={POST.datePublished} />
        <meta property="article:modified_time" content={POST.dateModified} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={POST.title} />
        <meta name="twitter:description" content={POST.description} />
        <meta name="twitter:image" content={POST.ogImage.url} />
        <meta name="twitter:site" content="@fondpeace" />

        {/* Canonical & Hreflang */}
        <link rel="canonical" href={POST.canonical} />
        {POST.alternates.map((alt) => (
          <link key={alt.hrefLang} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
        ))}

        {/* Preconnects for perf (example: image CDN / fonts) */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tvEpisodeLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      </Head>

      {/* 🧭 Top Bar / Breadcrumbs */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-gray-900" aria-label="Fondpeace Home">
            Fondpeace
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
            Blog
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-900" aria-current="page">
            {POST.title}
          </span>
        </nav>
      </header>

      {/* 📄 Article */}
      <main className="mx-auto max-w-5xl px-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 py-8">
        <article className="prose prose-gray max-w-none">
          <header className="not-prose">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {POST.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Image src="/favicon-96x96.png" width={24} height={24} alt="Fondpeace" className="rounded-full" />
                <span>{POST.author.name}</span>
              </div>
              <span>•</span>
              <time dateTime={POST.datePublished}>{new Date(POST.datePublished).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span>•</span>
              <span>{readingTime} min read</span>
              <span className="sr-only">Last updated</span>
              <span aria-label="Last updated">• Updated {new Date(POST.dateModified).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            {/* Hero Image (lazy) */}
            <div className="mt-6">
              <Image
                src={POST.ogImage.url}
                alt={POST.ogImage.alt}
                width={POST.ogImage.width}
                height={POST.ogImage.height}
                className="w-full h-auto rounded-2xl shadow-sm"
                priority={false}
              />
            </div>
            {/* Tags */}
            <ul className="mt-4 flex flex-wrap gap-2">
              {POST.tags.map((tag) => (
                <li key={tag}>
                  <Link href={`/tags/${encodeURIComponent(tag.replace(/\s+/g, '-').toLowerCase())}`} className="px-3 py-1 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Table of Contents (simple anchors generated from headings inside markdown) */}
            <nav className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-sm font-semibold mb-2">Quick navigation</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li><a href="#summary" className="hover:underline">Episode Summary</a></li>
                <li><a href="#highlights" className="hover:underline">Highlights & Twists</a></li>
                <li><a href="#faq" className="hover:underline">FAQ</a></li>
                <li><a href="#sources" className="hover:underline">Sources</a></li>
              </ul>
            </nav>
          </header>

          {/* Content Sections (the markdown itself + anchors) */}
          <section id="summary" className="mt-8">
            <h2 className="text-xl md:text-2xl font-bold">Episode Summary</h2>
            <div className="mt-4">
              <MarkdownRenderer content={markdown} />
            </div>
          </section>

          <section id="highlights" className="mt-10">
            <h2 className="text-xl md:text-2xl font-bold">Highlights & Twists</h2>
            <ul className="mt-4 grid gap-3">
              <li className="p-4 rounded-xl bg-gray-50 border border-gray-100">Khyati’s guilt vs. truth — the central conflict of the episode.</li>
              <li className="p-4 rounded-xl bg-gray-50 border border-gray-100">Raghav’s resolve to reopen his case injects fresh momentum.</li>
              <li className="p-4 rounded-xl bg-gray-50 border border-gray-100">Aryan’s revenge sequence is revealed to be a dream twist.</li>
              <li className="p-4 rounded-xl bg-gray-50 border border-gray-100">Prem’s role in Aryan’s release raises new tensions with Parag.</li>
            </ul>
          </section>

          <section id="faq" className="mt-10">
            <h2 className="text-xl md:text-2xl font-bold">Frequently Asked Questions</h2>
            <details className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <summary className="font-semibold">Is this a spoiler-heavy update?</summary>
              <p className="mt-2 text-gray-700">No, it focuses on key plot beats so you can follow along without ruining the viewing experience.</p>
            </details>
            <details className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <summary className="font-semibold">Where can I watch the episode?</summary>
              <p className="mt-2 text-gray-700">
                Watch legally on{' '}
                <a href="https://www.hotstar.com/in" target="_blank" rel="nofollow noopener" className="underline">
                  Disney+ Hotstar (India)
                </a>
                .
              </p>
            </details>
          </section>

          <section id="sources" className="mt-10">
            <h2 className="text-xl md:text-2xl font-bold">Sources</h2>
            <ul className="mt-4 list-disc list-inside">
              <li>
                <a href="https://www.hotstar.com/in" rel="nofollow noopener" target="_blank" className="underline">
                  Disney+ Hotstar (India)
                </a>
              </li>
              <li>
                <a href="https://www.iwmbuzz.com/television/written-updates" rel="nofollow noopener" target="_blank" className="underline">
                  IWMBuzz — Written Updates
                </a>
              </li>
            </ul>
          </section>

          {/* Internal links for topical authority */}
          <section className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold">You might also like</h2>
            <ul className="mt-4 grid sm:grid-cols-2 gap-4">
              <li className="p-4 rounded-xl border border-gray-100 hover:shadow-sm transition">
                <Link href="/blog/ghum-hai-kisikey-pyaar-mein-10-april-2025-written-update" className="font-semibold hover:underline">
                  Ghum Hai Kisikey Pyaar Mein — 10 April 2025 Written Update
                </Link>
                <p className="text-sm text-gray-600 mt-1">Today’s highlights, twists, and full recap.</p>
              </li>
              <li className="p-4 rounded-xl border border-gray-100 hover:shadow-sm transition">
                <Link href="/blog/yeh-rishta-kya-kehlata-hai-10-april-2025-written-update" className="font-semibold hover:underline">
                  Yeh Rishta Kya Kehlata Hai — 10 April 2025 Written Update
                </Link>
                <p className="text-sm text-gray-600 mt-1">All key moments from today’s episode.</p>
              </li>
            </ul>
          </section>

          {/* Comments CTA */}
          <section className="mt-10 p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold">Join the discussion</h2>
            <p className="text-gray-700 mt-2">Have thoughts about today’s episode? Share your opinions below!</p>
            <Link href="#comments" className="inline-block mt-4 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100">Write a comment</Link>
          </section>
        </article>

        {/* 📎 Right Sidebar (sticky) */}
        <aside className="lg:sticky lg:top-20 h-max space-y-6">
          {/* Search box (improves UX + site search signals) */}
          <form action="/search" method="GET" className="p-4 rounded-xl border border-gray-200">
            <label htmlFor="q" className="block text-sm font-semibold text-gray-800">Search updates</label>
            <input
              id="q"
              name="q"
              type="search"
              placeholder="Search serials, episodes..."
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Search site"
            />
            <button type="submit" className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50">Search</button>
          </form>

          {/* Mini about card */}
          <div className="p-4 rounded-xl border border-gray-200">
            <h3 className="font-semibold">About Fondpeace</h3>
            <p className="mt-2 text-sm text-gray-700">
              Daily, reliable written updates for Indian TV serials. Clean, fast, and verified summaries.
            </p>
            <Link href="/about" className="mt-2 inline-block text-sm underline">Know more</Link>
          </div>

          {/* Contact / tips */}
          <div className="p-4 rounded-xl border border-gray-200">
            <h3 className="font-semibold">Corrections?</h3>
            <p className="mt-2 text-sm text-gray-700">Spotted an error? <Link href="/contact" className="underline">Contact us</Link> and we’ll update this page quickly.</p>
          </div>
        </aside>
      </main>

      {/* Footer meta — license & breadcrumbs for crawlers */}
      <footer className="mx-auto max-w-5xl px-4 pb-10">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} Fondpeace. All rights reserved.</p>
      </footer>
    </div>
  );
        }
    
