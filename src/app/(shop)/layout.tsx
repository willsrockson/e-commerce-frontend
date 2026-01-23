import type { Metadata } from "next";
import "../globals.css";
import React from "react";
import { ToastContainer } from 'react-toastify';
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";
import AuthInitializer from "@/lib/providers/AuthInitializer";
import FloatingSellButton from "@/components/sharedUi/FloatingSellButton";



export const metadata: Metadata = {
  title: {
    default: "Tonmame Market Hub | Buy & Sell in Ghana",
    template: "%s | Tonmame Market Hub",
  },
  
  description: "The safest marketplace to buy and sell mobile phones, laptops, cars, and property in Ghana. Join thousands of verified sellers today.",
  
  keywords: ["Ghana", "Marketplace", "Buy and Sell", "Phones", "Laptops", "Accra", "Kumasi", "Online Shopping"],

  openGraph: {
    title: "Tonmame Market Hub",
    description: "Buy and sell safely in your local community.",
    url: "https://tonmame.store",
    siteName: "Tonmame",
    images: [
      {
        url: "/org.avif",
        width: 1200,
        height: 630,
        alt: "Tonmame Market Hub Preview",
      },
    ],
    locale: "en_GH",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tonmame Market Hub",
    description: "The safest marketplace in Ghana.",
    images: ["/org.avif"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body>
        <Navbar />
          <AuthInitializer>{children}</AuthInitializer>
        <Toaster closeButton position="bottom-center"/>  
        <ToastContainer position="bottom-right"/>
        <FloatingSellButton />
      </body>

    </html>
  );
}
