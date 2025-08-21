import fs from "fs";
import path from "path";
import matter from "gray-matter";
import SeoArticle from "@/Components/SeoArticle";

export default async function Page({ params }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), "src/app/posts", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return <div>Post not found</div>;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  // Use file mtime as modified date
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
