export default function HipaaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-6 text-center">
        {/* soft accent glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[760px] h-[420px] bg-accent-subtle blur-3xl opacity-60 rounded-full" />
        </div>
        <div className="relative">
          <span className="text-xs bg-accent-subtle border border-accent rounded-full px-4 py-1.5 text-accent">
            Compliance
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.02em] text-default mt-4">HIPAA Notice of Privacy Practices</h1>
          <p className="text-subtle text-sm mt-3">Effective Date: May 24, 2026</p>
        </div>
      </section>

      {/* Required HIPAA banner */}
      <div className="bg-accent-subtle border-l-4 border-accent px-6 py-5 max-w-3xl mx-auto mt-0 -mb-8 relative z-10 rounded-r-2xl shadow-sm">
        <p className="text-default font-semibold text-sm uppercase tracking-wide">
          THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN
          GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.
        </p>
      </div>

      {/* Content */}
      <section className="bg-surface-alt border-default border-t py-16">
        <div className="max-w-3xl mx-auto px-6 pt-8">

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3">1. Who We Are</h2>
          <p className="text-muted leading-relaxed text-base">
            FC Nexo LLC, doing business as Nexo Access, is a covered entity under HIPAA. We are a non-emergency
            medical transportation (NEMT) coordinator enrolled with Medicaid in DC and Maryland.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">2. Your Protected Health Information (PHI)</h2>
          <p className="text-muted leading-relaxed text-base">
            We create and maintain records of your name, Medicaid ID, date of birth, address, health plan
            information, appointment reasons, and trip history. This information is your Protected Health
            Information (PHI).
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">3. How We May Use and Disclose Your PHI</h2>
          <div className="text-muted leading-relaxed text-base space-y-4">
            <p>
              <span className="font-semibold text-default">For Treatment:</span> We share your PHI with
              transportation providers to coordinate your rides to medical appointments.
            </p>
            <p>
              <span className="font-semibold text-default">For Payment:</span> We share your PHI with your
              MCO/health plan to verify eligibility and process claims for transportation services.
            </p>
            <p>
              <span className="font-semibold text-default">For Healthcare Operations:</span> We may use your
              PHI to evaluate service quality and train staff.
            </p>
            <p>
              <span className="font-semibold text-default">Required by Law:</span> We will disclose your PHI
              when required by federal or state law.
            </p>
            <p>
              We will not use or disclose your PHI for any other purpose without your written authorization.
            </p>
          </div>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">4. Your Rights Regarding Your PHI</h2>
          <p className="text-muted leading-relaxed text-base mb-3">You have the right to:</p>
          <ul className="text-muted leading-relaxed text-base space-y-2 ml-4">
            <li>• Request access to your PHI</li>
            <li>• Request corrections to your PHI</li>
            <li>• Request restrictions on how we use your PHI</li>
            <li>• Receive an accounting of disclosures</li>
            <li>• Receive a paper copy of this notice</li>
            <li>• File a complaint if you believe your rights have been violated</li>
          </ul>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">5. Our Duties</h2>
          <p className="text-muted leading-relaxed text-base">
            We are required by law to maintain the privacy of your PHI, provide you with this notice, and follow
            the terms of this notice.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">6. How to Exercise Your Rights</h2>
          <p className="text-muted leading-relaxed text-base">
            Submit written requests to:{' '}
            <a href="mailto:privacy@nexoaccess.com" className="text-accent hover:underline">privacy@nexoaccess.com</a>
            <br />
            We will respond within 30 days.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">7. Filing a Complaint</h2>
          <p className="text-muted leading-relaxed text-base">
            If you believe your privacy rights have been violated, you may file a complaint with us at{' '}
            <a href="mailto:privacy@nexoaccess.com" className="text-accent hover:underline">privacy@nexoaccess.com</a>{' '}
            or with the U.S. Department of Health and Human Services Office for Civil Rights at{' '}
            <a href="https://www.hhs.gov/ocr/privacy/hipaa/complaints" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              hhs.gov/ocr/privacy/hipaa/complaints
            </a>.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display text-xl font-bold tracking-tight text-default mb-3 mt-10">8. Changes to This Notice</h2>
          <p className="text-muted leading-relaxed text-base">
            We reserve the right to change this notice. Changes will apply to PHI we already have. The current
            notice is always available at{' '}
            <a href="/hipaa" className="text-accent hover:underline">nexoaccess.com/hipaa</a>.
          </p>

        </div>
      </section>
    </>
  )
}
