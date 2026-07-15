import type { LucideIcon } from "lucide-react";
import {
  Route,
  ReceiptText,
  ShieldCheck,
  ClipboardCheck,
  Landmark,
  Truck,
  Hospital,
  Users,
  UserRound,
} from "lucide-react";
import { SITE } from "@/lib/site";

// Single source of truth for the site's information architecture. Navbar and
// Footer both read from here so a route never appears in one place but not the
// other, and so every href is defined exactly once. Descriptions are plain
// statements of what the task/audience gets — not marketing copy.

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
};

export type NavColumn = {
  title: string;
  links: NavItem[];
};

// "Platform" menu — deep-links into the /platform section anchors.
export const PLATFORM_ITEMS: NavItem[] = [
  {
    label: "Dispatch",
    href: "/platform#dispatch",
    description: "Assign and route every trip from one queue.",
    icon: Route,
  },
  {
    label: "Claims & billing",
    href: "/platform#claims-billing",
    description: "Turn completed trips into clean, submittable claims.",
    icon: ReceiptText,
  },
  {
    label: "Compliance",
    href: "/platform#compliance",
    description: "Keep credentials, signatures, and audit trails in order.",
    icon: ShieldCheck,
  },
  {
    label: "Oversight & reporting",
    href: "/platform#oversight",
    description: "Exception review, pattern reports, and CSV/Excel exports.",
    icon: ClipboardCheck,
  },
];

// "Solutions" menu — audience landing pages.
export const SOLUTIONS_ITEMS: NavItem[] = [
  {
    label: "MCOs & payers",
    href: "/solutions/mcos",
    description: "Run a transportation benefit and keep cost in view.",
    icon: Landmark,
  },
  {
    label: "Transport providers",
    href: "/solutions/providers",
    description: "Clear credentialing and clean claims, end to end.",
    icon: Truck,
  },
  {
    label: "Facilities & case managers",
    href: "/solutions/facilities",
    description: "Book and confirm rides for the people in your care.",
    icon: Hospital,
  },
  {
    label: "Members",
    href: "/solutions/members",
    description: "Get a reliable ride to your appointment.",
    icon: Users,
  },
];

// "Company" menu — no icons/descriptions; a short list.
export const COMPANY_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// "Sign in" menu (Stage 15) — the three CUSTOMER-facing portal doors, in the nav item grammar
// (icon + title + one-line desc). hrefs come ONLY from SITE.portalLogin (single source; the `?portal=`
// hint the platform honors later). Admin is DELIBERATELY absent from every public surface (law §7.4).
// Icons reuse the established audience vocabulary so a reader recognizes their own door at a glance:
// Truck = provider world, Hospital = facilities/case-manager world; UserRound (a single account figure,
// distinct from the Users audience glyph) = the individual member. Descriptions are gate-clean — they
// describe portal contents (upcoming/past rides, claims/credentials/scheduling), never live "tracking".
export const SIGNIN_ITEMS: NavItem[] = [
  {
    label: "Member",
    href: SITE.portalLogin("member"),
    description: "See your upcoming and past rides.",
    icon: UserRound,
  },
  {
    label: "Provider",
    href: SITE.portalLogin("provider"),
    description: "Claims, credentials & scheduling.",
    icon: Truck,
  },
  {
    label: "Care portal",
    href: SITE.portalLogin("care"),
    description: "For case managers & facilities — schedule rides for the people in your care.",
    icon: Hospital,
  },
];

// Footer columns. Platform reuses the four anchors; Solutions reuses the four
// audience pages; Company adds Apply; Legal is footer-only.
export const FOOTER_COLUMNS: NavColumn[] = [
  {
    title: "Platform",
    links: PLATFORM_ITEMS.map(({ label, href }) => ({ label, href })),
  },
  {
    title: "Solutions",
    links: SOLUTIONS_ITEMS.map(({ label, href }) => ({ label, href })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Apply", href: "/apply" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "HIPAA notice", href: "/hipaa" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];
