import type { Metadata } from "next";
import "../globals.css";
import React from "react";
import { ToastContainer } from 'react-toastify';
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";
import AuthInitializer from "@/lib/providers/AuthInitializer";
import FloatingSellButton from "@/components/sharedUi/FloatingSellButton";



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
        <Toaster closeButton position="bottom-center"/>  
        <ToastContainer position="bottom-right"/>
        <FloatingSellButton />
      </body>

    </html>
  );
}
