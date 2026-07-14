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
} from "lucide-react";

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
