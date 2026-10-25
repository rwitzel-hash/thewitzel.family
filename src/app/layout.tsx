import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Witzel Family",
  description:
    "The Witzel family home — live weather in Draper, games, rides, and each person's corner of the web.",
  openGraph: {
    title: "The Witzel Family",
    description: "Live. Together. Always.",
    url: "https://thewitzel.family",
    siteName: "The Witzel Family",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
