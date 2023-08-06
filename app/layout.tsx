import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/contexts/Auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Platform",
  description: "Video Platform for a training course",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <Provider>
        <body className={inter.className}>{children}</body>
      </Provider>
    </html>
  );
}
