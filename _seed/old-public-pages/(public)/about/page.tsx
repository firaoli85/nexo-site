import { Shield, Users, MapPin, Heart } from 'lucide-react'
import MedicalVan from '@/components/public/MedicalVan'

const VALUES = [
  {
    icon: Shield,
    title: 'Built for compliance',
    body: 'HIPAA-native from day one. Every data flow, every stored document, every API call is designed with Medicaid compliance requirements in mind.',
  },
  {
    icon: Users,
    title: 'Provider-first',
    body: "We don't work for MCOs. We work for the transportation providers who keep patients moving. Our incentives are aligned with yours.",
  },
  {
    icon: MapPin,
    title: 'DMV focused',
    body: 'We know Maryland and DC Medicaid inside and out — the MCOs, the payer IDs, the authorization requirements, the quirks.',
  },
  {
    icon: Heart,
    title: 'Mission matters',
    body: "NEMT is healthcare. When a trip doesn't happen, a patient misses treatment. We take that seriously.",
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-20 pb-16 px-6 border-b border-default">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 tracking-[-0.02em]">
              We built the platform we{' '}
              <span className="text-accent">wished existed.</span>
            </h1>
            <p className="text-muted text-lg leading-relaxed mb-4">
              Nexo Access was started by people who spent years watching NEMT providers manage trips on whiteboards, submit claims on paper, and lose margin because they had no visibility into what MCOs were actually paying them.
            </p>
            <p className="text-muted leading-relaxed">
              We built the platform from scratch — no legacy code, no generic TMS retrofitted for NEMT. Every feature exists because a real provider needed it.
            </p>
          </div>
          <div className="flex justify-center">
            <MedicalVan variant="light" className="w-full max-w-[400px] opacity-80" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-10 text-center tracking-tight">What we stand for</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map(v => {
              const Icon = v.icon
              return (
                <div key={v.title} className="flex gap-5 p-6 bg-surface border border-default rounded-2xl shadow-sm">
                  <div className="size-10 bg-accent-subtle rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-default mb-1.5 tracking-tight">{v.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{v.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team note */}
      <section className="py-16 px-6 bg-surface-alt border-t border-default">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold mb-4 tracking-tight">Small team, serious software</h2>
          <p className="text-muted leading-relaxed">
            We&apos;re a small team based in the DMV. We answer our own support tickets, we join onboarding calls, and we talk to providers every week. That&apos;s how we know what to build next.
          </p>
        </div>
      </section>
    </div>
  )
}
