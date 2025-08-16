import { Metadata } from 'next';
import HomeLatestPosts from '@/components/HomeLatestPosts';
import CreatePage from "@/components/CreatePage";
import SearchGo from "@/components/SearchGo";
import OnlyFeed from "@/components/OnlyFeed";
import Upload from "@/components/Upload";
import Village from "@/components/Village";
 

export const metadata = {
  title: "Fond Peace",
  description:
    "Fondpeace.com is a free and modern all-in-one social platform that combines powerful web search and community features in one place. Whether you're looking to connect with friends, explore trending news, or search the internet like you would with Google or Bing, Fondpeace offers a seamless experience. Stay updated with what's happening around you, watch and share videos, chat with others, create posts, join communities, and explore the web—all from one easy-to-use platform. Built for speed, simplicity, and social engagement, Fondpeace.com is designed to be your go-to digital hub for information and interaction.",
  keywords:
    "free social media platform, trending news and videos, all-in-one search and social platform, Online Chatting, Xhamster, blacked.com, jav.guru, jav guru, perplexity ai, macrumors, today written update, instagram, youtube, brazzer, angela white, alyx star, how to, Fond Peace AI, free AI tools, AI search engine, AI assistant, AI automation, AI content generator, AI-powered search, AI chatbot, AI-driven solutions, AI-powered research, AI discovery, AI-powered learning, AI innovation, AI productivity, AI-powered applications, AI-powered insights, AI-powered recommendations, AI for everyone, next-gen AI, best free AI tools, AI-powered knowledge base, AI-driven search engine, AI-powered decision-making, AI-powered problem-solving, AI assistant for work and study, AI-powered writing tools, AI-powered creative solutions, chatgpt, openai, Claude AI, Grok AI, Elon Musk AI, search engine alternatives, written updates, Telly updates, Anupama, YRKKH, Bhagya Lakshmi, Dhruv Rathee, MacRumors, 9to5Mac, Apple Insider, Apple rumors, iPhone news, AI SEO optimization, 2025 Google SEO, AI-powered blogging, real-time AI answers, best AI tools 2025, AI automation for business, SEO AI tools, AI-driven marketing, Google core update 2025, AI-enhanced productivity, AI-generated content, machine learning trends 2025, AI-powered analytics, AI for digital marketing, AI SEO ranking strategies, how to rank on Google with AI, best AI-powered research tools,youtube thumbnail tester, thumbnail preview, youtube seo, preview thumbnail youtube,Google-like search engine,chat and connect online,post, share, explore content,modern social network,discover local and global news,video sharing platform,free community platform",
  openGraph: {
    title: "Fond Peace",
    description:
      "Fondpeace.com is a free social platform where you can search the web, share posts and videos, discover trending news, chat, and stay connected—all in one place.",
    url: "https://fondpeace.com",
    images: [
      {
        url: "https://www.fondpeace.com/Fondpeace.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fond Peace",
    description:
      "Fondpeace.com is a free social platform where you can search the web, share posts and videos, discover trending news, chat, and stay connected—all in one place.",
    images: ["https://www.fondpeace.com/Fondpeace.jpg"],
    site: "@Gayatrisingho",
  },
  alternates: {
    canonical: "https://fondpeace.com",
  },
};

export default function Page() {
  
  return (
    <div className="flex flex-col items-center p-4">
      {/* Title */}
      <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6">
        FondPeace.com
      </h1>

      {/* Village Component */}
      <div className="w-full max-w-6xl">
        <Village />
      </div>
    </div>
  )

};
