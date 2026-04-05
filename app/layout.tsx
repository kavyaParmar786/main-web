// FILE: /app/layout.tsx

import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "KAVYA.SYS // Portfolio Interface v2.0",
  description: "Kavya Parmar — Teen Developer | Futuristic Portfolio Experience",
  keywords: ["developer", "portfolio", "web development", "teen coder"],
  openGraph: {
    title: "KAVYA.SYS // Portfolio Interface v2.0",
    description: "Enter the system. Explore the portfolio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="scanlines">
        {children}
      </body>
    </html>
  );
}
