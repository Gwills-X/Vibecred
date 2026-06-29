import "./globals.css";
import { Poppins } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { importMigrationFile } from "@/lib/importSql";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// =========================================================================
// PRODUCTION-READY META REGISTRATION (Optimized for Vercel & Search Engines)
// =========================================================================
export const metadata = {
  title: {
    default: "VibeCred — High-Performance Social Publishing Network",
    template: "%s | VibeCred",
  },
  description:
    "Engineering the next generation of modern micro-publishing and micro-interactions. Connect, build workflows, and share your digital future.",
  keywords: [
    "Next.js",
    "MySQL",
    "Firebase",
    "Web Development",
    "Micro-blogging",
    "VibeCred Platform",
  ],
  authors: [{ name: "GW-TECK SOLUTIONS" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://vibecred.vercel.app",
  ),

  // OpenGraph (Optimizes previews for Facebook, LinkedIn, Discord)
  openGraph: {
    title: "VibeCred — High-Performance Social Publishing Network",
    description:
      "Engineering the next generation of modern micro-publishing and micro-interactions.",
    url: "/",
    siteName: "VibeCred",
    locale: "en_US",
    type: "website",
  },

  // Twitter Cards (Optimizes rich media preview snippets on X/Twitter)
  twitter: {
    card: "summary_large_image",
    title: "VibeCred — High-Performance Social Publishing Network",
    description:
      "Engineering the next generation of modern micro-publishing and micro-interactions.",
    creator: "@vibecred",
  },

  // Viewport/Robot indexing gates
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  // importMigrationFile();
  return (
    <html lang='en' className='h-full' suppressHydrationWarning>
      <body
        className={`min-h-screen flex flex-col bg-slate-950 text-slate-100 ${poppins.variable} font-sans antialiased`}>
        {/* Sticky Header Container */}
        <div className='sticky top-0 z-50'>
          <NavBar />
        </div>

        {/* Main Content Area */}
        <main className='flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 py-8'>
          {children}
        </main>

        {/* Footer Container */}
        <Footer />
      </body>
    </html>
  );
}
