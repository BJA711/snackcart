import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConfigBanner } from "@/components/layout/ConfigBanner";

export const metadata: Metadata = {
  title: "SnackCart | Authentic Homemade Indian Snacks & Sweets",
  description:
    "Order authentic homemade namkeen, roasted khakhra, pure ghee ladoos, and savory Indian snacks. Freshly prepared in small artisanal batches with Cash on Delivery across India.",
  keywords: [
    "homemade snacks",
    "Indian snacks online",
    "namkeen",
    "khakhra",
    "besan ladoo",
    "chakli",
    "cash on delivery snacks",
  ],
  authors: [{ name: "SnackCart Homemade Delights" }],
  openGraph: {
    title: "SnackCart | Authentic Homemade Indian Snacks & Sweets",
    description:
      "Handcrafted regional savory namkeen, roasted flatbreads, and festive sweets with Cash on Delivery across India.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-stone-50 text-stone-900 antialiased selection:bg-brand-100 selection:text-brand-900">
        <AuthProvider>
          <CartProvider>
            <ConfigBanner />
            <AnnouncementBar />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
