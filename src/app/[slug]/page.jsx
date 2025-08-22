import fs from "fs";
import path from "path";
import matter from "gray-matter";
import SeoArticle from "@/Components/SeoArticle";
import { notFound } from "next/navigation";

const postsDir = path.join(process.cwd(), "src/app/posts");

// Build time: Generate all slugs for static pages
export async function generateStaticParams() {
  const files = fs.readdirSync(postsDir);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(".md", ""),
    }));
}

export default function Page({ params }) {
  const { slug } = params;
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const stats = fs.statSync(filePath);
  const modifiedDate = stats.mtime.toISOString();

  return (
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
  );
}
