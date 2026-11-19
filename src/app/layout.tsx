import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SECOND THOUGHT — Kiberxavfsizlik madaniyati",
  description:
    "SECOND THOUGHT — an offline, interactive cybersecurity culture experience for students. Understand, experience and prove safer judgment online.",
};

export const viewport: Viewport = {
  themeColor: "#f7f8f4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
