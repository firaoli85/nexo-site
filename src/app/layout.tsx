import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/chrome/Navbar";
import { Footer } from "@/components/chrome/Footer";
import { RouteOverlay } from "@/components/home/RouteOverlay";
import { MapObserver } from "@/components/home/MapObserver";
import { SITE } from "@/lib/site";
import { HOME_TITLE, HOME_DESCRIPTION, OG_IMAGE } from "@/lib/seo";
import { organizationSchema, schemaJson } from "@/lib/schema";

// Distinctive, characterful pairing on a CONTRAST AXIS — Bricolage Grotesque (a display
// grotesque with real personality) for headings, Hanken Grotesk (a warm humanist grotesque:
// soft open counters, healthcare-credible, comfortable at 17px) for body (chosen in the lab,
// Stage 4.7 Section T). Exposed as CSS vars consumed by tailwind fontFamily (font-display /
// font-sans) and globals.css body{}.
const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const fontBody = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Site-wide metadata (Stage 11). metadataBase makes every per-page relative canonical / og:url / image
// resolve to an absolute APEX URL. Per-page metadata (via pageMeta in @/lib/seo) overrides title,
// description, canonical, and the OG/Twitter title+description; these values are the homepage defaults +
// the fallback for any route without its own.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { default: HOME_TITLE, template: "%s" },
  description: HOME_DESCRIPTION,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    url: SITE.domain,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="flex min-h-svh flex-col antialiased">
        {/* Organization JSON-LD (one MedicalBusiness, site-wide). Safely serialized (escapes </script>). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJson(organizationSchema()) }}
        />
        {/* Keyboard/screen-reader escape hatch: first focusable element, jumps
            past the sticky chrome straight to the page content. */}
        <a
          href="#main-content"
          className="sr-only rounded-md focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-default focus:shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Skip to main content
        </a>
        <Navbar />
        {/* Route host — the offset parent for the page-level RouteOverlay, spanning the page content
            AND the footer so the drawn line can arrive at the footer's terminus motif. */}
        <div className="relative flex flex-1 flex-col">
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <RouteOverlay />
        </div>
        <MapObserver />
      </body>
    </html>
  );
}
