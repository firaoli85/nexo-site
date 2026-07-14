export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-alt border-b border-default py-20 text-center">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[760px] h-[420px] bg-accent-subtle blur-3xl opacity-60 rounded-full pointer-events-none" aria-hidden="true" />
        <div className="relative">
          <span className="text-xs bg-accent-subtle border border-default rounded-full px-4 py-1.5 text-accent">
            Legal
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.02em] text-default mt-4">Terms of Service</h1>
          <p className="text-subtle text-sm mt-3">Last updated: May 24, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted leading-relaxed text-base">
            By using Nexo Access, you agree to these terms. If you do not agree, do not use the platform.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">2. Services</h2>
          <p className="text-muted leading-relaxed text-base">
            Nexo Access provides a platform for scheduling and coordinating non-emergency medical transportation
            (NEMT) for Medicaid-eligible members in DC and Maryland. We are not a transportation provider — we
            coordinate between members, case workers, and credentialed transportation providers.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">3. User Accounts</h2>
          <p className="text-muted leading-relaxed text-base">
            You are responsible for maintaining the confidentiality of your account credentials. You must notify
            us immediately of any unauthorized access.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">4. Provider Obligations</h2>
          <p className="text-muted leading-relaxed text-base">
            Transportation providers using this platform agree to maintain all required credentials, carry valid
            insurance, employ only credentialed drivers, and comply with all applicable Medicaid transportation
            regulations.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">5. Prohibited Uses</h2>
          <p className="text-muted leading-relaxed text-base">
            You may not use this platform to submit fraudulent claims, misrepresent trip completion, share
            account credentials, or circumvent any platform security measures.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">6. Limitation of Liability</h2>
          <p className="text-muted leading-relaxed text-base">
            Nexo Access coordinates transportation services but is not liable for delays, cancellations, or
            incidents that occur during transportation. Provider companies carry their own liability insurance.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">7. Governing Law</h2>
          <p className="text-muted leading-relaxed text-base">
            These terms are governed by the laws of the State of Maryland and the District of Columbia,
            as applicable.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">8. Contact</h2>
          <p className="text-muted leading-relaxed text-base">
            For questions about these terms:{' '}
            <a href="mailto:legal@nexoaccess.com" className="text-accent hover:underline">legal@nexoaccess.com</a>
          </p>

        </div>
      </section>
    </>
  )
}
