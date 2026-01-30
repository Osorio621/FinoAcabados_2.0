import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fino Acabados | Pinturas, Herramientas y Complementos Premium",
  description: "Tu tienda integral de acabados finos, herramientas profesionales y accesorios de construcción.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-accent selection:text-white`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-24">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
