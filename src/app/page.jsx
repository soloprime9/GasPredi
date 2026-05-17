import JobsPageView from "@/Job/JobsPageView";
import JobAuthGate from "@/Job/JobAuthGate";
import { cookies } from "next/headers"; 
import { redirect } from "next/navigation";

 
/* ============================
   SEO METADATA (ENHANCED)
============================ */
export async function generateMetadata() {
  const title =
    "Latest Jobs in India | IT, Fresher, Remote & MNC Jobs – Job Tension";
  const description =
    "Find verified latest jobs in India including IT jobs, fresher hiring, remote jobs, internships, and MNC openings. Updated daily on Job Tension by FondPeace.";

  return {
    title,
    description,
    alternates: {
      canonical: "https://todaywrittenupdate.blog",
    },
    openGraph: {
      title,
      description,
      url: "https://todaywrittenupdate.blog",
      siteName: "Job Tension",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ============================
   PAGE (SERVER AUTH PROTECTED)
============================ */
export default async function JobsPage() {
 

  /* ---------- FETCH JOBS ---------- */
  const res = await fetch("https://list-back-nine.vercel.app/job/all", {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Job Tension</h1>
        <p className="text-red-600">
          Failed to load jobs. Please try again later.
        </p>
      </div>
    );
  }

  const { jobs } = await res.json();

  /* ============================
     STRUCTURED DATA (GOOGLE SAFE)
  ============================ */

  // 1️⃣ WebPage + SearchAction
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Latest Jobs in India – Job Tension",
    description:
      "Browse verified job openings including IT, fresher, remote, internship and MNC jobs in India.",
    url: "https://todaywrittenupdate.blog",
    isPartOf: {
      "@type": "WebSite",
      name: "Job Tension",
      url: "https://todaywrittenupdate.blog",
      potentialAction: {
        "@type": "SearchAction",
        target:
          "https://todaywrittenupdate.blog?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  };

  // 2️⃣ FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Job Tension free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Job Tension is completely free for job seekers.",
        },
      },
      {
        "@type": "Question",
        name: "What type of jobs are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can find IT jobs, fresher jobs, internships, remote jobs, and MNC openings across India.",
        },
      },
      {
        "@type": "Question",
        name: "How often are jobs updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "New job listings are added and updated daily.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need an account to apply?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, you must be logged in to view and apply for jobs on Job Tension.",
        },
      },
    ],
  };

  // 3️⃣ Job List (Lightweight – NOT spam)
  const jobListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest Job Openings in India",
    itemListElement: jobs.slice(0, 10).map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://todaywrittenupdate.blog/job/${job._id}`,
      name: `${job.jobTitle} at ${job.companyName}`,
    })),
  };

  return (
    <>
      {/* ===== STRUCTURED DATA ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobListSchema),
        }}
      />
      
      <JobsPageView jobs={jobs} />
     
    </>
  );
}











// // app/JobTension/page.js
// import JobsPageView from "@/Job/JobsPageView";

// /* ============================
//    SEO METADATA (SAFE & CLEAN)
// ============================ */
// export async function generateMetadata() {
//   const title = "Latest Jobs in India | IT, Fresher, Remote & MNC Jobs – FondPeace.com";
//   const description =
//     "Browse latest job openings across India including IT jobs, fresher jobs, remote jobs, internships and MNC hiring. Updated daily on FondPeace.com by FondPeace.";

//   return {
//     title,
//     description,
//     alternates: {
//       canonical: "https://todaywrittenupdate.blog",
//     },
//     openGraph: {
//       title,
//       description,
//       url: "https://todaywrittenupdate.blog",
//       siteName: "FondPeace.com",
//       type: "website",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//     },
//   };
// }

// /* ============================
//    PAGE
// ============================ */
// export default async function JobsPage() {
//   const res = await fetch("https://list-back-nine.vercel.app/job/all", {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-3xl font-bold mb-6">FondPeace.com</h1>
//         <p className="text-red-600">
//           Failed to load jobs. Please try again later.
//         </p>
//       </div>
//     );
//   }

//   const { jobs } = await res.json();

//   /* ============================
//      JOB LIST STRUCTURED DATA
//      (Google Safe – NOT spam)
//   ============================ */
//   const jobListSchema = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name: "Latest Job Openings in India",
//     itemListElement: jobs.slice(0, 20).map((job, index) => ({
//       "@type": "ListItem",
//       position: index + 1,
//       url: `https://todaywrittenupdate.blog/${job._id}`,
//       name: `${job.jobTitle} at ${job.companyName}`,
//     })),
//   };

//   return (
//     <>
//       {/* STRUCTURED DATA FOR GOOGLE */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(jobListSchema),
//         }}
//       />

//       <JobsPageView jobs={jobs} />
//     </>
//   );
// }











// // app/jobs/page.js
// import JobsPageView from "@/Job/JobsPageView";

// export default async function JobsPage() {
//   const res = await fetch("https://list-back-nine.vercel.app/job/all", {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-3xl font-bold mb-6">FondPeace.com</h1>
//         <p className="text-red-600">Failed to load jobs. Please try again later.</p>
//       </div>
//     );
//   }

//   const { jobs } = await res.json();

//   return <JobsPageView jobs={jobs} />;
// }






// // app/page.jsx
// import fs from "fs";
// import path from "path";
// import matter from "gray-matter";
// import Link from "next/link";

// // 📂 Path to posts folder
// const POSTS_DIR = path.join(process.cwd(), "src", "app", "posts");
// const SITE_URL = "https://todaywrittenupdate.blog";

// // ✅ SEO & Social Metadata
// export const metadata = {
//   title: "Today Written Update",
//   description:
//     "Welcome to my Today Written Update platform, Stay updated with daily written updates, spoilers, and upcoming twists from popular Indian TV serials including Yeh Rishta Kya Kehlata Hai, Anupamaa, BhagyaLakshmi, Ghum Hai Kisikey Pyaar Mein, Written Update,Yeh Rishta Kya Kehlata Hai, Tum Se Tumm Tak, Vashudha, Saru, Kumkum Bhagya, Kundali Bhagya, Today Written Update and more.",
//   keywords:
//     "Indian TV serials, written updates, daily episode updates, spoilers, twists, Yeh Rishta Kya Kehlata Hai, Anupamaa, BhagyaLakshmi, Ghum Hai Kisikey Pyaar Mein, TV news, TV gossip, Anupama written update, Yeh Rishta Kya Kehlata Hai Dailymotion, Dailymotion, today full episode, Tum se Tum Tak, Vashudha, Saru, Mangal Lakshmi, Bhagya Lakshmi Today Written Update, Written Update, Tellyexpres, Telly update, Disney Jiohotstar",
//   authors: [{ name: "Today Written Update" }],
//   robots: "index, follow",
//   openGraph: {
//     title: "Today Written Update",
//     description:
//       "Daily written updates, episode summaries, spoilers, Anupama , Yeh Rishta Kya Kehlata Hai, Ghum Hai Kiskey Pyar Mein, Tum Se Tumm Tak, Vashudha, Saru, Kundali Bhagya, Kumkum Bhagya, Bhagya Lakshmi,and twists from your favorite Indian TV serials.",
//     url: SITE_URL,
//     siteName: "Today Written Update",
//     type: "website",
//     images: [
//       {
//         url: `${SITE_URL}/Today.jpg`,
//         width: 1200,
//         height: 630,
//         alt: "Today Written Update - Indian TV Serials",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Today Written Update",
//     description:
//       "Get daily written updates, spoilers, anupama, Yeh Rishta Kya Kehlata Hai, Tum Se Tumm Tak, Vashudha, Saru,and twists from top Indian TV serials.",
//     images: [`${SITE_URL}/Today.jpg`],
//   },
// };

// export default function Home() {
//   // 📌 Structured Data (JSON-LD) for SEO
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "Blog",
//     name: "Today Written Update",
//     url: SITE_URL,
//     description:
//       "Get daily written updates, spoilers, anupama, Yeh Rishta Kya Kehlata Hai, Tum Se Tumm Tak, Vashudha, Saru,and twists from top Indian TV serials.",
//     publisher: {
//       "@type": "Organization",
//       name: "Today Written Update",
//       logo: {
//         "@type": "ImageObject",
//         url: `${SITE_URL}/Today.png`,
//       },
//     },
//     author: {
//       "@type": "Person",
//       name: "Today Written Update",
//     },
//   };

//   // ✅ Get latest posts
//   let posts = [];
//   if (fs.existsSync(POSTS_DIR)) {
//     posts = fs
//       .readdirSync(POSTS_DIR)
//       .filter((f) => f.endsWith(".md"))
//       .map((f) => {
//         const raw = fs.readFileSync(path.join(POSTS_DIR, f), "utf-8");
//         const { data } = matter(raw);
//         const stats = fs.statSync(path.join(POSTS_DIR, f));
//         const publishDate =
//           data.publishDate && !Number.isNaN(new Date(data.publishDate).getTime())
//             ? new Date(data.publishDate)
//             : stats.ctime;

//         const ogImage =
//           data.ogImage && String(data.ogImage).startsWith("http")
//             ? data.ogImage
//             : data.ogImage
//             ? `${SITE_URL}${data.ogImage.startsWith("/") ? "" : "/"}${data.ogImage}`
//             : `${SITE_URL}/images/default-og.jpg`;

//         return {
//           slug: f.replace(/\.md$/, ""),
//           title: data.title || f.replace(/\.md$/, ""),
//           description: data.description || "",
//           publishDate,
//           ogImage,
//         };
//       })
//       .sort((a, b) => b.publishDate - a.publishDate) // latest first
//       .slice(0, 10); // only latest 10
//   }

//   return (
//     <main className="max-w-7xl mx-auto p-4">
//       {/* JSON-LD Structured Data */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

      

//       {/* Latest Posts */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
//         {posts.length === 0 ? (
//           <p className="text-center text-gray-500">No posts found.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {posts.map((post) => (
//               <Link
//                 key={post.slug}
//                 href={`/${post.slug}`}
//                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
//               >
//                 <img
//                   src={post.ogImage}
//                   alt={post.title}
//                   className="w-full h-48 object-cover"
//                   loading="lazy"
//                 />
//                 <div className="p-4">
//                   <h3 className="text-lg font-bold">{post.title}</h3>
//                   <p className="text-gray-700 text-sm mt-2 line-clamp-2">
//                     {post.description}
//                   </p>
//                   <p className="text-gray-400 text-xs mt-3">
//                     {post.publishDate.toLocaleDateString()}
//                   </p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </section>

      
//     </main>
//   );
// }
