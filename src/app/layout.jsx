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

export const metadata = {
  title: "Today Written Update",
  description: "Welcome to my Today Written Update platform, Stay updated with daily written updates, spoilers, and upcoming twists from popular Indian TV serials including Yeh Rishta Kya Kehlata Hai, Anupamaa, BhagyaLakshmi, Ghum Hai Kisikey Pyaar Mein, Written Update,Yeh Rishta Kya Kehlata Hai, Tum Se Tumm Tak, Vashudha, Saru, Kumkum Bhagya, Kundali Bhagya, Today Written Update and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >


        {/* H1 */}
      <h1 className="text-3xl font-bold text-center mb-6">Today Written Update</h1>
      

      {/* Categories */}
      <nav className="flex gap-6 justify-center mb-10">
        <a href="/category/written-updates" className="text-blue-600 hover:underline">
          Written Updates
        </a>
        
      </nav>

        
        {children}


        {/* Footer */}
      <footer className="mt-12 border-t pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Today Written Update. All Rights Reserved.
      </footer>
        
      </body>
    </html>
  );
}
