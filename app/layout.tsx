export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Banking App",
  description: "Banking app for managing your transactions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />
        {children}
        </body>
    </html>
  );
}
