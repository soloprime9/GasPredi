import fs from "fs";
import path from "path";
import matter from "gray-matter";
import SeoArticle from "@/Components/SeoArticle";
import { notFound } from "next/navigation";

export default function Page() {
  // Hardcode the filename
  const filePath = path.join(process.cwd(), "src/posts", "anupama-21-august-2025.md");

  if (!fs.existsSync(filePath)) {
    return notFound(); // Shows 404 page
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
