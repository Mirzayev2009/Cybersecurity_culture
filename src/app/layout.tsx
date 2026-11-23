import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SECOND THOUGHT — Kiberxavfsizlik madaniyati",
  description:
    "SECOND THOUGHT — an interactive online-safety course for students in grades 5–11. Practice checking messages, protecting accounts and asking for help.",
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
