import type { Metadata } from "next";
import { DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat"
});

export const metadata: Metadata = {
  title: "EcoRide - Share the ride, share the road",
  description: "Showcase-grade intercity carpooling marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${montserrat.variable} font-sans min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 w-full bg-surface-bg">
          <AuthGuard>
            {children}
          </AuthGuard>
        </main>
        <Footer />
      </body>
    </html>
  );
}
