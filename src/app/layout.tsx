import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { ToastContainer } from 'react-toastify';
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";
import AuthInitializer from "@/lib/providers/AuthInitializer";



export const metadata: Metadata = {
  title: "Tonmame",
  description: "Buy & Sell",
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
        <Toaster/>  
        <ToastContainer />
      </body>

    </html>
  );
}
