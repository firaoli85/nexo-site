import type { LucideIcon } from "lucide-react";
import { ShieldCheck, ListChecks, Lock, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AmbientMap } from "@/components/home/AmbientMap";
import { COMPLIANCE_LINE, SERVICE_AREA_LINE } from "@/lib/launch";

// Quiet credibility strip below the hero, on a soft jade tint band — jade icons
// tie the capabilities to the brand; no animation. Every claim here is on the permitted
// list: credential-gated dispatch, the 7 adjudication checks, the compliance line, and the
// service area. The compliance + service-area strings are launch-flag-gated (see @/lib/launch):
// today they read "Built for HIPAA compliance" / "Built for DC · MD · VA".
const CHIPS: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: "Credential-gated dispatch" },
  { icon: ListChecks, label: "7-check claim adjudication" },
  { icon: Lock, label: COMPLIANCE_LINE },
  { icon: MapPin, label: SERVICE_AREA_LINE },
];

export function CredentialStrip() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface-tint">
      <AmbientMap tone="light" region="dc" />
      <Container className="relative py-5">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:gap-x-8 md:grid-cols-4">
          {CHIPS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5">
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
              <span className="text-sm font-medium text-muted">{label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
