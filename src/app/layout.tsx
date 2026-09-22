import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Workspace Explorer",
  description: "A browser-based file manager built with Next.js, TypeScript and Zustand.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">{children}</body>
    </html>
  );
}