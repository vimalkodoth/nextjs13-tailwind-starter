import "../globals.css";
import { dir } from "i18next";
import { languages } from "@/i18n/settings";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProviderWrapper from "@/lib/auth/sessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: "ED Project",
  description: "NextGEN ED Project",
};

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <SessionProviderWrapper>
      <html lang={lng} dir={dir(lng)}>
        <head />
        <body className={inter.className}>{children}</body>
      </html>
    </SessionProviderWrapper>
  );
}
