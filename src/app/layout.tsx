import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "@/components/Providers";
import Navbar from "@/components/navmenu/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { getAuthSession } from "@/lib/auth";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-50 px-2 pt-12 text-slate-700 sm:px-4`}
      >
        <div id="dialog-container"></div>
        <Navbar />
        <div className="container pt-12 lg:max-w-5xl">
          <Providers session={session}>{children}</Providers>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
