import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { MobileNav, Sidebar } from "@/components/app-nav";
import { Providers } from "@/components/providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumina — Media tracker",
  description: "Track the books you read and the movies you watch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen lg:flex">
            <Sidebar />
            <div className="min-h-screen flex-1 pb-28 lg:pb-0">
              <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">{children}</main>
            </div>
            <MobileNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
