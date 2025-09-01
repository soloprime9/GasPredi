// app/page.jsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

// 📂 Path to posts folder
const POSTS_DIR = path.join(process.cwd(), "src", "app", "posts");
const SITE_URL = "https://todaywrittenupdate.blog";

// ✅ SEO & Social Metadata
export const metadata = {
  title: "Today Written Update",
  description:
    "Welcome to my Today Written Update platform, Stay updated with daily written updates, spoilers, and upcoming twists from popular Indian TV serials including Yeh Rishta Kya Kehlata Hai, Anupamaa, BhagyaLakshmi, Ghum Hai Kisikey Pyaar Mein, Written Update,Yeh Rishta Kya Kehlata Hai, Tum Se Tumm Tak, Vashudha, Saru, Kumkum Bhagya, Kundali Bhagya, Today Written Update and more.",
  keywords:
    "Indian TV serials, written updates, daily episode updates, spoilers, twists, Yeh Rishta Kya Kehlata Hai, Anupamaa, BhagyaLakshmi, Ghum Hai Kisikey Pyaar Mein, TV news, TV gossip, Anupama written update, Yeh Rishta Kya Kehlata Hai Dailymotion, Dailymotion, today full episode, Tum se Tum Tak, Vashudha, Saru, Mangal Lakshmi, Bhagya Lakshmi Today Written Update, Written Update, Tellyexpres, Telly update, Disney Jiohotstar",
  authors: [{ name: "Today Written Update" }],
  robots: "index, follow",
  openGraph: {
    title: "Today Written Update",
    description:
      "Daily written updates, episode summaries, spoilers, Anupama , Yeh Rishta Kya Kehlata Hai, Ghum Hai Kiskey Pyar Mein, Tum Se Tumm Tak, Vashudha, Saru, Kundali Bhagya, Kumkum Bhagya, Bhagya Lakshmi,and twists from your favorite Indian TV serials.",
    url: SITE_URL,
    siteName: "Today Written Update",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/Today.jpg`,
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
      "Get daily written updates, spoilers, anupama, Yeh Rishta Kya Kehlata Hai, Tum Se Tumm Tak, Vashudha, Saru,and twists from top Indian TV serials.",
    images: [`${SITE_URL}/Today.jpg`],
  },
};

export default function Home() {
  // 📌 Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Today Written Update",
    url: SITE_URL,
    description:
      "Get daily written updates, spoilers, anupama, Yeh Rishta Kya Kehlata Hai, Tum Se Tumm Tak, Vashudha, Saru,and twists from top Indian TV serials.",
    publisher: {
      "@type": "Organization",
      name: "Today Written Update",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/Today.png`,
      },
    },
    author: {
      "@type": "Person",
      name: "Today Written Update",
    },
  };

  // ✅ Get latest posts
  let posts = [];
  if (fs.existsSync(POSTS_DIR)) {
    posts = fs
      .readdirSync(POSTS_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const raw = fs.readFileSync(path.join(POSTS_DIR, f), "utf-8");
        const { data } = matter(raw);
        const stats = fs.statSync(path.join(POSTS_DIR, f));
        const publishDate =
          data.publishDate && !Number.isNaN(new Date(data.publishDate).getTime())
            ? new Date(data.publishDate)
            : stats.ctime;

        const ogImage =
          data.ogImage && String(data.ogImage).startsWith("http")
            ? data.ogImage
            : data.ogImage
            ? `${SITE_URL}${data.ogImage.startsWith("/") ? "" : "/"}${data.ogImage}`
            : `${SITE_URL}/images/default-og.jpg`;

        return {
          slug: f.replace(/\.md$/, ""),
          title: data.title || f.replace(/\.md$/, ""),
          description: data.description || "",
          publishDate,
          ogImage,
        };
      })
      .sort((a, b) => b.publishDate - a.publishDate) // latest first
      .slice(0, 10); // only latest 10
  }

  return (
    <main className="max-w-7xl mx-auto p-4">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      

      {/* Latest Posts */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={post.ogImage}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                    {post.description}
                  </p>
                  <p className="text-gray-400 text-xs mt-3">
                    {post.publishDate.toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      
    </main>
  );
}
