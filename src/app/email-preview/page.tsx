import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  visitorAck,
  staffNotification,
  notificationShell,
  securityCode,
  invitationAction,
} from "@/lib/email/templates";
import { PreviewClient } from "./preview-client";

// DEV-ONLY email preview. In a production build `process.env.NODE_ENV === "production"`, so this route
// statically renders a 404 (verified in the build output). It is also absent from the sitemap, which is
// derived from ROUTE_META (this route is not in it), and marked noindex. No searchParams / dynamic APIs
// are used, so the route stays STATIC; the variant switcher is client-side (preview-client.tsx).
export const metadata: Metadata = {
  title: "Email preview (dev)",
  robots: { index: false, follow: false },
};

export default function EmailPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  // Obviously-fake sample data only. No PHI, no real institution names.
  const samples = [
    { key: "visitorAck", ...visitorAck("J. Sample", "contact") },
    {
      key: "staffNotification",
      ...staffNotification("contact", [
        { label: "Name", value: "J. Sample" },
        { label: "Organization", value: "Sample County Health Plan" },
        { label: "Email", value: "j.sample@example.com" },
        { label: "I am a", value: "MCO / payer" },
        { label: "Message", value: "Placeholder sample text for the email preview only.\nA second line to show wrapping." },
      ]),
    },
    {
      key: "notificationShell",
      ...notificationShell(
        "A neutral system notification",
        "This is a neutral one line message with no member or health information.",
        "View in portal",
        "https://app.nexoaccess.com/login",
      ),
    },
    { key: "securityCode", ...securityCode("482913", 10) },
    {
      key: "invitationAction",
      ...invitationAction(
        "You have been invited to collaborate on Nexo Access. Set up your access to get started.",
        "Accept invitation",
        "https://app.nexoaccess.com/login?portal=care",
        "This invitation expires in 7 days.",
      ),
    },
  ];

  return <PreviewClient samples={samples} />;
}
