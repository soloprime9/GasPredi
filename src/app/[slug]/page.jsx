// src/app/[slug]/page.jsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import SeoArticle from "@/Components/SeoArticle";

const postsDir = path.join(process.cwd(), "src", "app", "posts");

// Build-time: generate all slugs
export async function generateStaticParams() {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  return files.map((file) => ({ slug: file.replace(/\.md$/, "") }));
}

// don't try to dynamically render slugs that aren't pre-built
export const dynamicParams = false;

export default function Page({ params }) {
  const { slug } = params;
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data = {}, content = "" } = matter(fileContent);
  const stats = fs.statSync(filePath);
  const modifiedDate = stats.mtime.toISOString();

  // Ensure tags array exists
  const tags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];

  // Build absolute OG image URL (ogImage is the thumbnail)
  const siteUrl = "https://todaywrittenupdate.blog";
  const ogImage =
    data.ogImage && String(data.ogImage).startsWith("http")
      ? data.ogImage
      : data.ogImage
      ? `${siteUrl}${data.ogImage.startsWith("/") ? "" : "/"}${data.ogImage}`
      : `${siteUrl}/images/default-og.jpg`;

  // Related posts: find other markdown files with overlapping tags
  const allFiles = fs.existsSync(postsDir) ? fs.readdirSync(postsDir) : [];
  const relatedPosts = allFiles
    .filter((f) => f.endsWith(".md") && f !== `${slug}.md`)
    .map((f) => {
      const md = matter(fs.readFileSync(path.join(postsDir, f), "utf-8"));
      const d = md.data || {};
      const t = Array.isArray(d.tags) ? d.tags : d.tags ? [d.tags] : [];
      const og = d.ogImage
        ? (String(d.ogImage).startsWith("http") ? d.ogImage : `${siteUrl}${d.ogImage.startsWith("/") ? "" : "/"}${d.ogImage}`)
        : `${siteUrl}/images/default-og.jpg`;
      return {
        slug: f.replace(/\.md$/, ""),
        title: d.title || f.replace(/\.md$/, ""),
        description: d.description || "",
        tags: t,
        ogImage: og,
      };
    })
    .filter((p) => p.tags.some((tag) => tags.includes(tag))) // matching tags
    .slice(0, 6); // limit

  const seoData = {
    title: data.title || slug,
    description: data.description || "",
    publishDate:
      data.publishDate && !Number.isNaN(new Date(data.publishDate).getTime())
        ? new Date(data.publishDate).toISOString()
        : stats.ctime.toISOString(),
    modifiedDate,
    tags,
    canonical: data.canonical || `${siteUrl}/${slug}`,
    ogImage,
    markdown: content,
    faqs: data.faqs || [], // optional: allow frontmatter faqs: [{q:"",a:""}]
    relatedPosts,
  };

  return <SeoArticle {...seoData} />;
}
