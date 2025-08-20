// app/page.jsx
export const metadata = {
  title: "Indian Serials Written Updates - Latest Episodes, Spoilers & Twists",
  description:
    "Get the latest written updates, spoilers, upcoming twists, and news for popular Indian TV serials. Daily updates for Yeh Rishta Kya Kehlata Hai, Anupamaa, Ghum Hai Kisikey Pyaar Mein, and more.",
  keywords:
    "Indian serials, written updates, TV shows, spoilers, upcoming twists, Yeh Rishta Kya Kehlata Hai, Anupamaa, Ghum Hai Kisikey Pyaar Mein",
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Blog Name",
  robots: "index, follow",
  openGraph: {
    title: "Indian Serials Written Updates - Latest Episodes, Spoilers & Twists",
    description:
      "Daily written updates, spoilers, and upcoming twists for top Indian TV serials.",
    url: "https://yourwebsite.com",
    siteName: "Indian Serials Written Updates",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indian Serials Written Updates - Latest Episodes & Spoilers",
    description:
      "Get daily written updates, spoilers, and upcoming twists for top Indian serials.",
  },
};

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-4">
      {/* Main Heading */}
      <h1 className="text-3xl font-bold text-center mb-6">
        Indian Serials Written Updates, Spoilers & Upcoming Twists
      </h1>

      {/* Category Navigation */}
      <nav className="flex gap-4 justify-center mb-8">
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

      {/* Latest Posts Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest Written Updates</h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {/* Example static posts (replace with dynamic later) */}
          <li className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <img
              src="/images/post1.jpg"
              alt="Yeh Rishta Kya Kehlata Hai Written Update"
              className="rounded-lg mb-3"
            />
            <h3 className="text-lg font-bold mb-2">
              Yeh Rishta Kya Kehlata Hai - Latest Episode Written Update
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              Full written update of today's episode with all the latest twists and drama...
            </p>
            <a
              href="/posts/yeh-rishta-latest-update"
              className="text-blue-500 hover:underline"
            >
              Read More →
            </a>
          </li>
          <li className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <img
              src="/images/post2.jpg"
              alt="Anupamaa Written Update"
              className="rounded-lg mb-3"
            />
            <h3 className="text-lg font-bold mb-2">
              Anupamaa - Today’s Written Update with Latest Twist
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              Get the complete written update of Anupamaa’s latest episode...
            </p>
            <a
              href="/posts/anupamaa-latest-update"
              className="text-blue-500 hover:underline"
            >
              Read More →
            </a>
          </li>
        </ul>
      </section>

      {/* Spoilers Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Spoilers & Upcoming Twists</h2>
        <ul className="space-y-3">
          <li>
            <a href="/spoilers/yeh-rishta-big-twist" className="text-blue-500 hover:underline">
              Yeh Rishta Kya Kehlata Hai: Big Twist Ahead in Upcoming Episodes
            </a>
          </li>
          <li>
            <a href="/spoilers/anupamaa-shocking-turn" className="text-blue-500 hover:underline">
              Anupamaa: Shocking Turn to Change Storyline
            </a>
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Your Blog Name. All rights reserved.
      </footer>
    </main>
  );
}
