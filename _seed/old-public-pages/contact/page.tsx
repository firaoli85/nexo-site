import { Mail, MapPin, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-20 pb-14 px-6 border-b border-default text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-4 tracking-tight">Get in touch</h1>
          <p className="text-muted text-lg">
            Questions about the platform, pricing, or your application? We respond within one business day.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-xl font-display font-semibold mb-6 tracking-tight">Contact details</h2>
            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="size-9 bg-accent-subtle rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="size-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-default">Email</p>
                  <p className="text-sm text-subtle mt-0.5">hello@nexoaccess.com</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="size-9 bg-accent-subtle rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="size-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-default">Region</p>
                  <p className="text-sm text-subtle mt-0.5">Maryland &amp; Washington, DC</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="size-9 bg-accent-subtle rounded-lg flex items-center justify-center shrink-0">
                  <MessageSquare className="size-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-default">Response time</p>
                  <p className="text-sm text-subtle mt-0.5">Within 1 business day</p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-5 bg-accent-subtle border border-default rounded-2xl shadow-sm">
              <p className="text-sm font-medium text-accent mb-1">Already applied?</p>
              <p className="text-sm text-muted">
                Check your email for onboarding instructions. If you haven&apos;t heard from us within 2 business days, reach out here.
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-xl font-display font-semibold mb-6 tracking-tight">Send us a message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-subtle">First name</label>
                  <input
                    type="text"
                    className="w-full bg-input-bg border border-default rounded-xl px-4 py-2.5 text-sm text-default placeholder:text-subtle focus:border-accent focus:outline-none transition-colors"
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-subtle">Last name</label>
                  <input
                    type="text"
                    className="w-full bg-input-bg border border-default rounded-xl px-4 py-2.5 text-sm text-default placeholder:text-subtle focus:border-accent focus:outline-none transition-colors"
                    placeholder="Smith"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-subtle">Email</label>
                <input
                  type="email"
                  className="w-full bg-input-bg border border-default rounded-xl px-4 py-2.5 text-sm text-default placeholder:text-subtle focus:border-accent focus:outline-none transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-subtle">Company / organization</label>
                <input
                  type="text"
                  className="w-full bg-input-bg border border-default rounded-xl px-4 py-2.5 text-sm text-default placeholder:text-subtle focus:border-accent focus:outline-none transition-colors"
                  placeholder="Sunrise Medical Transport"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-subtle">Message</label>
                <textarea
                  rows={5}
                  className="w-full bg-input-bg border border-default rounded-xl px-4 py-2.5 text-sm text-default placeholder:text-subtle focus:border-accent focus:outline-none transition-colors resize-none"
                  placeholder="Tell us what you'd like to know..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-accent-text font-medium rounded-xl py-3 text-sm transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
