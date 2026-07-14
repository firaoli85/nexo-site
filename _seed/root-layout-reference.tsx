import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";

// Distinctive, characterful pairing — Bricolage Grotesque (a contemporary display
// grotesque with real personality: condensed proportions, expressive terminals)
// for headings, Manrope (clean, highly readable) for body. Exposed as CSS vars
// consumed by tailwind fontFamily (font-display / font-sans) and globals.css body{}.
const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const fontBody = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexo Access — NEMT operations platform",
  description:
    "The all-in-one platform for Medicaid transportation providers — dispatch, claims, compliance, and billing in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
