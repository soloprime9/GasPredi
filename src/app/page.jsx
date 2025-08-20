// app/page.jsx
export const metadata = {
  title: "Today Written Update",
  description:
    "Stay updated with daily written updates, spoilers, and upcoming twists from popular Indian TV serials including Yeh Rishta Kya Kehlata Hai, Anupamaa, BhagyaLakshmi, Ghum Hai Kisikey Pyaar Mein, and more.",
  keywords:
    "Indian TV serials, written updates, daily episode updates, spoilers, twists, Yeh Rishta Kya Kehlata Hai, Anupamaa, BhagyaLakshmi, Ghum Hai Kisikey Pyaar Mein, TV news, TV gossip",
  authors: [{ name: "Today Written Update" }],
  robots: "index, follow",
  openGraph: {
    title: "Today Written Update",
    description:
      "Daily written updates, episode summaries, spoilers, and twists from your favorite Indian TV serials.",
    url: "https://todaywrittenupdate.blog",
    siteName: "Today Written Update",
    type: "website",
    images: [
      {
        url: "https://todaywrittenupdate.blog/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Today Written Update - Indian TV Serials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Today Written Update",
    description:
      "Get daily written updates, spoilers, and twists from top Indian TV serials.",
    images: ["https://todaywrittenupdate.blog/images/og-image.jpg"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Today Written Update",
    "url": "https://todaywrittenupdate.blog",
    "description":
      "Stay updated with daily written updates, spoilers, and upcoming twists from popular Indian TV serials.",
    "publisher": {
      "@type": "Organization",
      "name": "Today Written Update",
      "logo": {
        "@type": "ImageObject",
        "url": "https://todaywrittenupdate.blog/images/logo.png"
      }
    },
    "author": {
      "@type": "Person",
      "name": "Today Written Update"
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-4">
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* H1 */}
      <h1 className="text-3xl font-bold text-center mb-6">Today Written Update</h1>
      <p className="text-center mb-8">
        Your trusted source for daily written updates, spoilers, and upcoming twists from popular Indian TV serials.
      </p>

      {/* Categories */}
      <nav className="flex gap-6 justify-center mb-10">
        <a href="/category/written-updates" className="text-blue-600 hover:underline">
          Written Updates
        </a>
        <a href="/category/spoilers" className="text-blue-600 hover:underline">
          Spoilers
        </a>
        <a href="/category/upcoming-twists" className="text-blue-600 hover:underline">
          Upcoming Twists
        </a>
      </nav>

      {/* Latest Posts */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
        <ul className="grid gap-6 md:grid-cols-2">
          <li className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <img src="/images/post1.jpg" alt="Yeh Rishta Update" className="rounded-lg mb-3" />
            <h3 className="text-lg font-bold mb-2">Yeh Rishta Kya Kehlata Hai - Today's Episode Summary</h3>
            <p className="text-gray-700 text-sm mb-3">
              Full written update with latest twists and highlights of today's episode.
            </p>
            <a href="/posts/yeh-rishta-today-update" className="text-blue-500 hover:underline">Read More →</a>
          </li>
          <li className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <img src="/images/post2.jpg" alt="Anupamaa Update" className="rounded-lg mb-3" />
            <h3 className="text-lg font-bold mb-2">Anupamaa - Today's Episode Written Update</h3>
            <p className="text-gray-700 text-sm mb-3">Complete episode summary with spoilers and upcoming twists.</p>
            <a href="/posts/anupamaa-latest-update" className="text-blue-500 hover:underline">Read More →</a>
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Today Written Update. All Rights Reserved.
      </footer>
    </main>
  );
}
    </main>
  );
}
