// Send any named email variant to admin@nexoaccess.com through the SAME SES transport the site uses,
// so real-client rendering (Gmail, Apple Mail, Outlook, dark mode) can be checked in one command:
//
//   npx tsx scripts/send-test-email.ts <variant>
//
// where <variant> is one of: visitorAck | staffNotification | notificationShell | securityCode | invitationAction
//
// Reads AWS_SES_REGION / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY from .env.local. If the env is not
// configured it prints why and exits non-zero (never a crash, never a faked success). This is a dev
// tool; it is not part of the build or the runtime bundle.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sendEmail } from "@/lib/mail";
import {
  visitorAck,
  staffNotification,
  notificationShell,
  securityCode,
  invitationAction,
  type EmailContent,
} from "@/lib/email/templates";

// Minimal .env.local loader (no dependency). KEY=VALUE lines, optional surrounding quotes, # comments
// skipped, ambient env wins (never overwrites an already-set variable).
function loadEnvLocal(): void {
  let raw = "";
  try {
    raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  } catch {
    console.warn("[send-test-email] no .env.local found; relying on the ambient environment.");
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = v;
  }
}

const RECIPIENT = "admin@nexoaccess.com";

// Obviously-fake sample data only. No PHI, no real institution names.
const VARIANTS: Record<string, () => EmailContent> = {
  visitorAck: () => visitorAck("J. Sample", "contact"),
  staffNotification: () =>
    staffNotification("contact", [
      { label: "Name", value: "J. Sample" },
      { label: "Organization", value: "Sample County Health Plan" },
      { label: "Email", value: "j.sample@example.com" },
      { label: "I am a", value: "MCO / payer" },
      { label: "Message", value: "Placeholder sample text for a real-client render test only." },
    ]),
  notificationShell: () =>
    notificationShell(
      "A neutral system notification",
      "This is a neutral one line message with no member or health information.",
      "View in portal",
      "https://app.nexoaccess.com/login",
    ),
  securityCode: () => securityCode("482913", 10),
  invitationAction: () =>
    invitationAction(
      "You have been invited to collaborate on Nexo Access. Set up your access to get started.",
      "Accept invitation",
      "https://app.nexoaccess.com/login?portal=care",
      "This invitation expires in 7 days.",
    ),
};

async function main(): Promise<void> {
  loadEnvLocal();
  const name = process.argv[2];
  if (!name || !(name in VARIANTS)) {
    console.error(
      `Usage: npx tsx scripts/send-test-email.ts <variant>\n  variants: ${Object.keys(VARIANTS).join(", ")}`,
    );
    process.exit(1);
  }
  const { subject, html, text } = VARIANTS[name]();
  console.log(`[send-test-email] sending "${name}" to ${RECIPIENT} ...`);
  const res = await sendEmail({ to: RECIPIENT, subject: `[TEST] ${subject}`, html, text });
  if (res.ok) {
    console.log("[send-test-email] sent.");
  } else {
    console.error(
      `[send-test-email] not sent (${res.reason}). Check AWS_SES_* in .env.local, and that ${RECIPIENT} is verified if SES is still in sandbox.`,
    );
    process.exit(1);
  }
}

void main();
