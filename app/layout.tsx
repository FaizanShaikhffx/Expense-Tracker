import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
  
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Spendlyze",
  description: "Generated by create next app",
  icons: {
    icon: '/metadata.jpg', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${outfit.className}`}
        >
          <Toaster/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
