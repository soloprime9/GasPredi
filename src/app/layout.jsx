import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5007774826517640"
     crossorigin="anonymous"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >


        {/* H1 */}
      <h1 className="text-3xl font-bold text-center mb-6"><a href="/category/written-updates" className="text-blue-600 ">
          Today Written Update
        </a></h1>
      

      

        
        {children}


        {/* Footer */}
      <footer className="mt-12 border-t pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Today Written Update. All Rights Reserved.
      </footer>
        
      </body>
    </html>
  );
}
