// src/app/[slug]/page.jsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import SeoArticle from "@/Components/SeoArticle";

const POSTS_DIR = path.join(process.cwd(), "src", "app", "posts");
const SITE_URL = "https://todaywrittenupdate.blog";

export async function generateStaticParams() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

export const dynamicParams = false;

function stripFaqFromMarkdown(markdown) {
  // remove a markdown "## FAQ" section (if present)
  markdown = markdown.replace(/(^|\n)##\s*FAQ[\s\S]*?(?=\n##\s|\n#\s|$)/i, "\n");
  // remove any raw <details>...</details> blocks (safety / avoid duplication)
  markdown = markdown.replace(/<details[\s\S]*?<\/details>/gi, "");
  return markdown.trim();
}

export default function Page({ params }) {
  const { slug } = params;
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return notFound();

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data = {}, content = "" } = matter(raw);

  const stats = fs.statSync(filePath);
  const modifiedDate = stats.mtime.toISOString();
  const publishDate =
    data.publishDate && !Number.isNaN(new Date(data.publishDate).getTime())
      ? new Date(data.publishDate).toISOString()
      : stats.ctime.toISOString();

  const tags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];

  // Build absolute ogImage (ogImage is the thumbnail)
  const ogImage =
    data.ogImage && String(data.ogImage).startsWith("http")
      ? data.ogImage
      : data.ogImage
      ? `${SITE_URL}${data.ogImage.startsWith("/") ? "" : "/"}${data.ogImage}`
      : `${SITE_URL}/images/default-og.jpg`;

  // Related posts (match on tags)
  const allFiles = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md")) : [];
  const related = allFiles
    .filter((f) => f !== `${slug}.md`)
    .map((f) => {
      const md = matter(fs.readFileSync(path.join(POSTS_DIR, f), "utf-8"));
      const d = md.data || {};
      const t = Array.isArray(d.tags) ? d.tags : d.tags ? [d.tags] : [];
      const image =
        d.ogImage && String(d.ogImage).startsWith("http")
          ? d.ogImage
          : d.ogImage
          ? `${SITE_URL}${d.ogImage.startsWith("/") ? "" : "/"}${d.ogImage}`
          : `${SITE_URL}/images/default-og.jpg`;
      return {
        slug: f.replace(/\.md$/, ""),
        title: d.title || "",
        description: d.description || "",
        tags: t,
        ogImage: image,
        publishDate: d.publishDate || "",
      };
    })
    .filter((p) => p.tags.some((tag) => tags.includes(tag)))
    .slice(0, 6);

  // If frontmatter has faqs, strip any FAQ HTML/markdown from body to avoid double display
  const cleanedMarkdown = Array.isArray(data.faqs) && data.faqs.length > 0 ? stripFaqFromMarkdown(content) : content;

  const seoProps = {
    title: data.title || slug,
    description: data.description || "",
    publishDate,
    modifiedDate,
    tags,
    canonical: data.canonical || `${SITE_URL}/${slug}`,
    ogImage,
    markdown: cleanedMarkdown,
    faqs: Array.isArray(data.faqs) ? data.faqs : data.faqs ? [data.faqs] : [],
    relatedPosts: related,
    author: data.author || { name: "todaywrittenupdate team" },
  };

  return <SeoArticle {...seoProps} />;
         }
      
