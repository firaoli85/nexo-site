import Link from 'next/link'
import { CheckCircle2, ArrowRight, Shield, Clock, BarChart3, FileCheck } from 'lucide-react'
import MedicalVan from '@/components/public/MedicalVan'
import Reveal from '@/components/motion/Reveal'

// Navbar/Footer come from (public)/layout.tsx (persistent across navigation);
// the entrance transition comes from (public)/template.tsx. This page renders
// only the landing content, so route changes never remount the chrome.

const FEATURES = [
  {
    icon: Clock,
    title: 'Real-Time Dispatch',
    body: 'Drag-and-drop board with live driver load tracking. Assign trips in seconds, not minutes.',
  },
  {
    icon: FileCheck,
    title: 'Claims Automation',
    body: 'Auto-build 837 EDI files, submit to clearinghouse, and reconcile ERAs without manual entry.',
  },
  {
    icon: Shield,
    title: 'Compliance Engine',
    body: 'Credential expiry tracking, driver health scores, and HIPAA-compliant document storage.',
  },
  {
    icon: BarChart3,
    title: 'Margin Visibility',
    body: 'See your MCO rate vs provider cost on every trip. Know your margin before you submit.',
  },
]

const STATS = [
  { value: '98%',   label: 'Claim acceptance rate'        },
  { value: '<2min', label: 'Average dispatch time'        },
  { value: '6',     label: 'MCOs supported out of the box' },
  { value: '100%',  label: 'HIPAA compliant'              },
]

const STEPS = [
  { step: '01', title: 'Apply online',    body: 'Fill out the provider application. We verify credentials and set up your organization.' },
  { step: '02', title: 'Onboarding call', body: 'A 30-minute call to configure your MCOs, zones, drivers, and rate schedules.' },
  { step: '03', title: 'Go live',         body: 'Start dispatching, submitting claims, and tracking compliance from day one.' },
]

const TRUST = ['No setup fees', 'HIPAA compliant', 'Medicaid enrolled · DC & Maryland']

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-24 px-6">
        {/* Layered, token-based backdrop — faint grid + soft accent glow, all fading into --bg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
              backgroundSize: '46px 46px',
            }}
          />
          {/* fade the grid out toward the edges using the bg token (no hardcoded color) */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(75% 70% at 50% 0%, transparent, var(--bg) 72%)' }}
          />
          {/* soft accent glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[760px] h-[420px] bg-accent-subtle blur-3xl opacity-60 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <Reveal inView={false} delay={0}>
              <div className="inline-flex items-center gap-2 bg-accent-subtle border border-accent rounded-full px-4 py-1.5 mb-7">
                <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-accent font-medium tracking-wide">Now serving Maryland &amp; DC</span>
              </div>
            </Reveal>

            <Reveal inView={false} delay={0.08}>
              <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[0.98] tracking-[-0.03em] text-balance mb-6">
                <span className="block text-default">Care, delivered</span>
                <span className="block text-accent">on time. every time.</span>
              </h1>
            </Reveal>

            <Reveal inView={false} delay={0.16}>
              <p className="text-muted text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                Nexo Access is the all-in-one platform for Medicaid transportation providers —
                dispatch, claims, compliance, and billing in one place.
              </p>
            </Reveal>

            <Reveal inView={false} delay={0.24}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/apply"
                  className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-text font-semibold rounded-xl px-6 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  Apply as Provider
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/services"
                  className="flex items-center gap-2 bg-surface border border-default hover:border-strong text-default rounded-xl px-6 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  See How It Works
                </Link>
              </div>
            </Reveal>

            <Reveal inView={false} delay={0.32}>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {TRUST.map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-subtle">
                    <CheckCircle2 className="size-3.5 text-accent" />
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Van illustration */}
          <Reveal inView={false} delay={0.2} y={20} className="flex justify-center">
            <MedicalVan variant="light" className="w-full max-w-[460px]" />
          </Reveal>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────────── */}
      <section className="border-y border-default bg-surface-alt">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-accent mb-1">{s.value}</p>
              <p className="text-xs text-subtle">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-[-0.02em] mb-3 text-balance">
              Everything a NEMT provider needs
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Built specifically for Medicaid transportation — not a generic software with NEMT bolted on.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <Reveal key={f.title} delay={i * 0.08}>
                  <div className="h-full bg-surface border border-default rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-strong hover:-translate-y-1 active:-translate-y-0.5 transition-all duration-200">
                    <div className="size-10 bg-accent-subtle rounded-xl flex items-center justify-center mb-4">
                      <Icon className="size-5 text-accent" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-default mb-2">{f.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{f.body}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-surface-alt border-t border-default">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-[-0.02em] mb-3 text-balance">
              Up and running in 48 hours
            </h2>
            <p className="text-muted text-lg mb-14">We handle the setup. You focus on trips.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {STEPS.map((item, i) => (
              <Reveal key={item.step} delay={i * 0.1}>
                <div className="relative pl-6 border-l border-border-strong">
                  <span className="font-display text-sm font-bold text-accent mb-2 block">{item.step}</span>
                  <h3 className="font-display font-semibold text-lg text-default mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <Reveal className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-accent rounded-3xl px-8 py-16 text-center shadow-lg">
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-accent-text mb-4 text-balance">
              Ready to streamline your operation?
            </h2>
            <p className="text-accent-text max-w-xl mx-auto mb-8">
              Join providers in the DMV region already using Nexo Access to simplify their
              Medicaid transportation business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/apply"
                className="flex items-center gap-2 bg-surface hover:bg-surface-hover text-accent font-semibold rounded-xl px-8 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Apply Now
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="border border-accent-text text-accent-text rounded-xl px-8 py-3 hover:bg-accent-hover transition-colors duration-200"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
