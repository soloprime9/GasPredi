import fs from "fs";
import path from "path";
import matter from "gray-matter";
import SeoArticle from "@/Components/SeoArticle";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function Page({ params }) {
  const { slug } = params;

  const postsDir = path.join(process.cwd(), "src/app/posts");
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) return notFound();

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = fs.statSync(filePath);
  const modifiedDate = stats.mtime.toISOString();

  // Related posts finder
  const allFiles = fs.readdirSync(postsDir);
  const relatedPosts = allFiles
    .filter((file) => file.endsWith(".md") && file !== `${slug}.md`)
    .map((file) => {
      const fileData = matter(fs.readFileSync(path.join(postsDir, file), "utf-8")).data;
      return {
        slug: file.replace(".md", ""),
        title: fileData.title,
        ogImage: fileData.ogImage,
        tags: fileData.tags || [],
      };
    })
    .filter((post) =>
      post.tags.some((tag) => data.tags?.includes(tag))
    )
    .slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* SEO Meta */}
      <SeoArticle
        title={data.title}
        description={data.description}
        publishDate={data.publishDate}
        modifiedDate={modifiedDate}
        tags={data.tags}
        canonical={data.canonical}
        ogImage={data.ogImage}
        markdown={content}
      />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((post, index) => (
              <Link
                key={index}
                href={`/${post.slug}`}
                className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                {post.ogImage && (
                  <img
                    src={post.ogImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {data.faq && data.faq.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">FAQs</h2>
          <div className="space-y-4">
            {data.faq.map((item, i) => (
              <details
                key={i}
                className="group border rounded-lg p-4"
              >
                <summary className="cursor-pointer font-medium">
                  {item.question}
                </summary>
                <p className="mt-2 text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
