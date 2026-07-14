// Homepage — Stage 2: hero (headline + self-playing product demo) + credential
// strip. The Stage-0 token-proof content has been removed. Later sections
// (route spine, stats, audience cards) append cleanly below the marker in Stage 3.
import { Hero } from "@/components/home/Hero";
import { CredentialStrip } from "@/components/home/CredentialStrip";
import { RouteSpine } from "@/components/home/RouteSpine";
import { ProofBand } from "@/components/home/ProofBand";
import { AudienceTriage } from "@/components/home/AudienceTriage";
import { ProviderTeaser } from "@/components/home/ProviderTeaser";
import { FinalCta } from "@/components/home/FinalCta";

// Homepage tonal map v3 (see nexo-brand): ink hero → tint strip → white/tint spine (Stop 3 =
// ink showcase) → tint proof band → white audience triage → tint provider teaser → white CTA →
// ink footer. Ink stays 3 chapters (hero, Stop 3, footer).
export default function Home() {
  return (
    <>
      <Hero />
      <CredentialStrip />
      <RouteSpine />
      <ProofBand />        {/* A — guardrail numbers (tint) */}
      <AudienceTriage />   {/* B — audience triage (white) */}
      <ProviderTeaser />   {/* C — provider partnership teaser (tint) */}
      <FinalCta />         {/* D — closing CTA (white) */}
    </>
  );
}
