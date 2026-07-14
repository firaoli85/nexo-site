export default function AccessibilityPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 text-center">
        <span className="text-xs bg-accent-subtle border border-default rounded-full px-4 py-1.5 text-accent">
          Accessibility
        </span>
        <h1 className="font-display tracking-[-0.02em] text-4xl md:text-5xl font-bold text-default mt-4">Accessibility Statement</h1>
        <p className="text-subtle text-sm mt-3">Last updated: May 24, 2026</p>
      </section>

      {/* Content */}
      <section className="bg-surface-alt border-y border-default py-16">
        <div className="max-w-3xl mx-auto px-6">

          <h2 className="font-display tracking-tight text-xl font-bold text-default mb-3">1. Our Commitment</h2>
          <p className="text-muted leading-relaxed text-base">
            Nexo Access is committed to ensuring our platform is accessible to all users, including those with
            disabilities. We strive to meet WCAG 2.1 Level AA standards.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display tracking-tight text-xl font-bold text-default mb-3 mt-10">2. Features</h2>
          <p className="text-muted leading-relaxed text-base">
            Our platform includes: high contrast color schemes, keyboard navigation support, screen reader
            compatible markup, large touch targets for mobile users, and plain language throughout.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display tracking-tight text-xl font-bold text-default mb-3 mt-10">3. Member Portal Accessibility</h2>
          <p className="text-muted leading-relaxed text-base">
            The member portal is designed with accessibility as a priority — large text, simple navigation, and
            minimal steps to complete any action. Members who need assistance can always contact dispatch directly.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display tracking-tight text-xl font-bold text-default mb-3 mt-10">4. Known Limitations</h2>
          <p className="text-muted leading-relaxed text-base">
            We are continuously working to improve. If you encounter accessibility barriers, please contact us
            immediately and we will provide the information in an alternative format.
          </p>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display tracking-tight text-xl font-bold text-default mb-3 mt-10">5. Alternative Access Methods</h2>
          <p className="text-muted leading-relaxed text-base mb-3">
            Members who cannot use the digital platform may schedule trips by:
          </p>
          <ul className="text-muted leading-relaxed text-base space-y-2 ml-4">
            <li>• Calling our dispatch line directly</li>
            <li>• Working through their case worker</li>
            <li>• Having a caregiver manage their account</li>
          </ul>

          <div className="border-t border-default mt-10" />

          <h2 className="font-display tracking-tight text-xl font-bold text-default mb-3 mt-10">6. Contact</h2>
          <p className="text-muted leading-relaxed text-base">
            For accessibility concerns or to request accommodations:
            <br />
            Email:{' '}
            <a href="mailto:accessibility@nexoaccess.com" className="text-accent hover:underline">
              accessibility@nexoaccess.com
            </a>
            <br />
            We respond within 2 business days.
          </p>

        </div>
      </section>
    </>
  )
}
