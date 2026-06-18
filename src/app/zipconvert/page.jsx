import React from 'react';
import ZipExporter from '@/Components/ZipExporter';
 
// 1. Highly Optimized Dynamic Next.js Metadata (Avoiding pipe symbols)
export const metadata = {
  title: "Online Folder to ZIP Converter - Free Client-Side File Compressor",
  description: "Convert folders to ZIP format securely inside your browser. Exclude node_modules, build caches, or specific files before generating your local compressed archive.",
  alternates: {
    canonical: "https://todaywrittenupdate.blog/zipconvert",
  },
  openGraph: {
    title: "Online Folder to ZIP Converter - Free Client-Side File Compressor",
    description: "Convert folders to ZIP format securely inside your browser. Fast, local file compression utility.",
    url: "https://todaywrittenupdate.blog/zipconvert",
    siteName: "Today Written Update",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Folder to ZIP Converter",
    description: "Secure, local client-side folder-to-zip browser utility tool.",
  },
};

export default function ZipConvertPage() {
  // 2. Strong structural JSON-LD structured data to trigger Google rich results
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Online Folder to ZIP Converter Utility",
    "url": "https://todaywrittenupdate.blog/zipconvert",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "A 100% client-side web application tool designed to compress project folder trees into clean ZIP bundles directly in-browser, offering exclusions for heavy files like node_modules.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the online folder to ZIP converter work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The tool reads selected local directory trees using browser API pipelines, filters files against your input ignore parameters (like node_modules or build folders), and builds an architecture archive inside a secure client sandbox using compressed binaries."
          }
        },
        {
          "@type": "Question",
          "name": "Is it safe to compress private project code repositories here?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, absolutely. Processing routines execute strictly offline in-browser. No source file bytes or media asset packages are uploaded to external network cloud servers."
          }
        },
        {
          "@type": "Question",
          "name": "Why should I filter out node_modules before downloading?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Excluding massive dependency directories avoids pushing browser memory buffers to structural limits and keeps final archive file sizes lightweight for distribution."
          }
        }
      ]
    }
  };

  return (
    <>
      {/* Injecting Structured Schema Data directly into the Document Head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <main className="flex min-h-screen flex-col items-center justify-start bg-slate-950 text-slate-100 p-6 sm:p-12 md:p-24 font-sans">
        
        {/* SEO Header Hierarchy Content Wrapper */}
        <section className="text-center max-w-3xl mx-auto mb-10 mt-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent mb-4">
            Online Folder to ZIP Converter
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Compress your local directory structures cleanly and securely inside your browser window. 
            Perfect for packaging source projects without uploading sensitive files to external servers.
          </p>
        </section>

        {/* Client-side Component Rendering Container */}
        <div className="w-full max-w-5xl mb-16">
          <ZipExporter />
        </div>

        {/* --- Semantic Semantic SEO FAQ Section Content --- */}
        <section className="w-full max-w-4xl mx-auto border-t border-slate-900 pt-12 pb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-200 mb-8 tracking-tight">
            Frequently Asked Questions & Usage Guides
          </h2>
          
          <div className="space-y-4">
            
            <details className="group border border-slate-900 bg-slate-900/20 rounded-xl p-5 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:bg-slate-900/40">
              <summary className="flex items-center justify-between font-semibold text-slate-200 cursor-pointer text-sm sm:text-base selection:bg-transparent">
                <h3>How does this browser-based folder conversion process work?</h3>
                <span className="ml-1.5 shrink-0 rounded-full p-1.5 text-slate-500 bg-slate-900 group-open:rotate-180 transition-transform duration-300">
                  ↓
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed pl-1">
                Our application implements high-speed native client compilation engines via JavaScript. When you select a local folder, files are parsed within a local sandbox container. The script applies keyword-matching logic to drop blocked directory chains before packaging a final file stream.
              </p>
            </details>

            <details className="group border border-slate-900 bg-slate-900/20 rounded-xl p-5 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:bg-slate-900/40">
              <summary className="flex items-center justify-between font-semibold text-slate-200 cursor-pointer text-sm sm:text-base selection:bg-transparent">
                <h3>Are my project source codes or private assets saved on servers?</h3>
                <span className="ml-1.5 shrink-0 rounded-full p-1.5 text-slate-500 bg-slate-900 group-open:rotate-180 transition-transform duration-300">
                  ↓
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed pl-1">
                No data bytes ever traverse corporate cloud nodes or hosting databases. Everything runs instantly inside your active workspace browser session tab. This provides localized data protection parameters for modern web developers.
              </p>
            </details>

            <details className="group border border-slate-900 bg-slate-900/20 rounded-xl p-5 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:bg-slate-900/40">
              <summary className="flex items-center justify-between font-semibold text-slate-200 cursor-pointer text-sm sm:text-base selection:bg-transparent">
                <h3>What is the benefit of filtering out directories like node_modules?</h3>
                <span className="ml-1.5 shrink-0 rounded-full p-1.5 text-slate-500 bg-slate-900 group-open:rotate-180 transition-transform duration-300">
                  ↓
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed pl-1">
                Dependency layers usually store thousands of small nested source files that can crash web app runtimes or overload memory buffers. Dropping them yields extremely rapid download loops and tidy workspace backups.
              </p>
            </details>

          </div>
        </section>

      </main>
    </>
  );
}










// // src/app/zipconvet/page.jsx
// import React from 'react';
// import ZipExporter from '@/Components/ZipExporter'; // '@/' points to your 'src/' directory

// export default function ZipConvertPage() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24">
//       <h1 className="text-2xl font-bold mb-4">Zip File Converter</h1>
//       {/* Rendering your custom component here */}
//       <ZipExporter />
//     </main>
//   );
// }
