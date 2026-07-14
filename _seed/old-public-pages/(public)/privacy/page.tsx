export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 text-center">
        <span className="text-xs bg-accent-subtle border border-default rounded-full px-4 py-1.5 text-accent">
          Legal
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-[-0.02em] text-default mt-4">Privacy Policy</h1>
        <p className="text-subtle text-sm mt-3">Last updated: May 24, 2026</p>
      </section>

      {/* Content */}
      <section className="bg-surface-alt border-t border-default py-16">
        <div className="max-w-3xl mx-auto px-6">

          <h2 className="text-xl font-display font-bold tracking-tight text-default mb-3">1. Information We Collect</h2>
          <p className="text-muted leading-relaxed text-base">
            We collect information you provide directly: name, contact information, Medicaid ID, date of birth,
            address, and health-related information necessary to arrange medical transportation. We also collect
            usage data such as login timestamps and trip history.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="text-xl font-display font-bold tracking-tight text-default mb-3 mt-10">2. How We Use Your Information</h2>
          <p className="text-muted leading-relaxed text-base">
            We use your information to schedule and coordinate non-emergency medical transportation, verify
            Medicaid eligibility, communicate trip status, process claims with your MCO, and comply with
            legal obligations.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="text-xl font-display font-bold tracking-tight text-default mb-3 mt-10">3. How We Share Your Information</h2>
          <p className="text-muted leading-relaxed text-base">
            We share your information only with: your MCO/health plan to verify eligibility and process claims,
            transportation providers assigned to your trips, and government agencies when required by law. We
            never sell your information to third parties.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="text-xl font-display font-bold tracking-tight text-default mb-3 mt-10">4. Data Security</h2>
          <p className="text-muted leading-relaxed text-base">
            We implement industry-standard security measures including encryption in transit and at rest, access
            controls, and audit logging. All staff with data access are trained in HIPAA compliance.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="text-xl font-display font-bold tracking-tight text-default mb-3 mt-10">5. Your Rights</h2>
          <p className="text-muted leading-relaxed text-base">
            You have the right to access your personal information, request corrections, and request deletion
            subject to legal retention requirements. Contact us at{' '}
            <a href="mailto:privacy@nexoaccess.com" className="text-accent hover:underline">privacy@nexoaccess.com</a>{' '}
            to exercise these rights.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="text-xl font-display font-bold tracking-tight text-default mb-3 mt-10">6. Contact</h2>
          <p className="text-muted leading-relaxed text-base">
            FC Nexo LLC dba Nexo Access<br />
            Email:{' '}
            <a href="mailto:privacy@nexoaccess.com" className="text-accent hover:underline">privacy@nexoaccess.com</a>
            <br />
            For HIPAA-related concerns, see our{' '}
            <a href="/hipaa" className="text-accent hover:underline">HIPAA Notice</a>.
          </p>

        </div>
      </section>
    </>
  )
}
