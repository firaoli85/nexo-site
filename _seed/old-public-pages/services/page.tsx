import { Car, BedDouble, Phone, CheckCircle2, Accessibility } from 'lucide-react'

const TRIP_TYPES = [
  {
    icon: Car,
    title: 'Ambulatory Transport',
    desc: 'For members who can walk and transfer independently. Sedan or standard vehicle. Available same-zone and cross-zone.',
  },
  {
    icon: Accessibility,
    title: 'Wheelchair Transport',
    desc: 'Paralift-equipped vehicles for members using manual or power wheelchairs. One wheelchair per vehicle.',
  },
  {
    icon: BedDouble,
    title: 'Stretcher Transport',
    desc: 'For members who must remain lying down during transport. Medically appropriate vehicles only. Single occupancy always.',
  },
  {
    icon: Phone,
    title: 'Will Call Return',
    desc: "Member calls when ready to return. Driver dispatched on demand — no fixed return time needed. Text 'READY' or call dispatch.",
  },
]

const DIFFERENTIATORS = [
  'Direct Medicaid enrollment in DC and Maryland',
  'Credentialed drivers and vehicles — verified before every trip',
  'Real-time case worker visibility on every trip',
  'Signature captured digitally — claim ready on completion',
  'No broker fee, no commission — full rate to the provider',
]

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 text-center px-6">
        <span className="text-xs bg-accent-subtle border border-default rounded-full px-4 py-1.5 text-accent">
          Services
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-[-0.02em] text-default mt-4">
          The right vehicle for every member.
        </h1>
        <p className="text-muted text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
          We match each trip to the right vehicle based on the member&apos;s mobility needs — confirmed at scheduling, verified at pickup.
        </p>
      </section>

      {/* Trip type cards */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          {TRIP_TYPES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-surface rounded-2xl p-8 border border-default shadow-sm">
              <Icon className="text-accent mb-4" style={{ width: 32, height: 32 }} />
              <h2 className="text-xl font-display font-bold tracking-tight text-default mb-3">{title}</h2>
              <p className="text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiators */}
      <section className="bg-surface-alt border-t border-default py-24 px-6">
        <h2 className="text-3xl font-display font-bold tracking-tight text-center text-default mb-12">
          No broker. No middleman. No cut.
        </h2>
        <ul className="max-w-2xl mx-auto space-y-5">
          {DIFFERENTIATORS.map(text => (
            <li key={text} className="flex items-start gap-3">
              <CheckCircle2 className="text-accent mt-0.5 shrink-0" style={{ width: 20, height: 20 }} />
              <span className="text-muted text-base">{text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
