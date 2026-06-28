import type { Metadata } from "next";
import { Cormorant_SC, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorantSC = Cormorant_SC({
  variable: "--font-cormorant-sc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SASITRA - Menenun Kisah Sasirangan",
  description: "Website Interaktif Warisan Sasirangan khas Kalimantan Selatan. Jelajahi sejarah, ensiklopedia motif, dan coba secara virtual dengan teknologi AI.",
  keywords: ["Sasirangan", "Kalimantan Selatan", "Batik Banjar", "Sira Galuh", "Budaya Banjar", "Virtual Try-On AI", "Menenun Kisah Sasirangan"],
  authors: [{ name: "Tim Pengembangan KMIPN" }],
  openGraph: {
    title: "SASITRA - Menenun Kisah Sasirangan",
    description: "Jelajahi sejarah interaktif dan coba motif Sasirangan secara virtual dengan AI.",
    url: "https://sasitra.id",
    siteName: "SASITRA",
    locale: "id_ID",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorantSC.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-cream text-text-dark">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-text-light focus:rounded-full focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-300"
        >
          Lompat ke konten utama
        </a>
        <div id="main-content" className="flex-1 flex flex-col">
          {children}
        </div>
      </body>

    </html>
  );
}
