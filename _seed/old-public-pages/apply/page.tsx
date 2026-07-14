'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

const STEPS = ['Organization', 'Service Details', 'Credentials', 'Review & Submit']

const MCO_OPTIONS = [
  'DC Medicaid (DHCF)',
  'Aetna Better Health Maryland',
  'Priority Partners (Johns Hopkins)',
  'CareFirst BlueChoice Maryland',
  'UnitedHealthcare Community Plan Maryland',
  'Molina Healthcare Maryland',
]

const TRIP_TYPES = ['Wheelchair Van (WC)', 'Ambulatory (AMB)', 'Stretcher (STR)']

type FormData = {
  orgName: string
  dba: string
  ein: string
  npi: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  mcos: string[]
  tripTypes: string[]
  fleetSize: string
  years: string
  hasDrivers: string
  cdl: string
  insurance: string
  hipaa: string
  contact: string
  title: string
  agree: boolean
}

const INIT: FormData = {
  orgName: '', dba: '', ein: '', npi: '', phone: '', email: '',
  address: '', city: '', state: 'MD', zip: '',
  mcos: [], tripTypes: [], fleetSize: '', years: '', hasDrivers: '',
  cdl: '', insurance: '', hipaa: '', contact: '', title: '', agree: false,
}

function inputCls(extra = '') {
  return cn(
    'w-full bg-input-bg border border-default text-default placeholder:text-subtle rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:outline-none transition-colors',
    extra,
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs text-subtle block mb-1.5">{children}</label>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function CheckPill({
  label,
  checked,
  onClick,
}: {
  label: string
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-xl text-sm border transition-colors text-left',
        checked
          ? 'bg-accent-subtle border-accent text-accent'
          : 'bg-surface border-default text-muted hover:border-strong',
      )}
    >
      {label}
    </button>
  )
}

export default function ApplyPage() {
  const [step, setStep]       = useState(0)
  const [form, setForm]       = useState<FormData>(INIT)
  const [submitted, setSubmitted] = useState(false)

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function toggleArr(key: 'mcos' | 'tripTypes', val: string) {
    setForm(prev => {
      const arr = prev[key] as string[]
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val],
      }
    })
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="py-32 px-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="size-16 bg-accent-subtle border border-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-8 text-accent" />
          </div>
          <h1 className="font-display tracking-tight text-2xl font-bold mb-3 text-default">Application received!</h1>
          <p className="text-muted leading-relaxed mb-6">
            We&apos;ll review your application and reach out within 2 business days to schedule your onboarding call.
          </p>
          <p className="text-sm text-subtle">
            A confirmation has been sent to <span className="text-muted">{form.email}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display tracking-tight text-3xl font-bold mb-2 text-default">Apply as a Provider</h1>
          <p className="text-muted">Complete all four steps to submit your application.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div
                  className={cn(
                    'size-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors',
                    i < step
                      ? 'bg-accent border-accent text-accent-text'
                      : i === step
                      ? 'bg-accent-subtle border-accent text-accent'
                      : 'bg-surface border-default text-subtle',
                  )}
                >
                  {i < step ? <CheckCircle2 className="size-3.5" /> : i + 1}
                </div>
                <span className={cn('text-[10px] hidden sm:block whitespace-nowrap', i === step ? 'text-default' : 'text-subtle')}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px mx-2 mt-[-14px]', i < step ? 'bg-accent' : 'bg-default')} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-surface border border-default rounded-2xl shadow-sm p-8">
          {/* Step 0 — Organization */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-display tracking-tight font-semibold text-default text-lg mb-1">Organization Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Legal organization name *">
                  <input className={inputCls()} value={form.orgName} onChange={e => set('orgName', e.target.value)} placeholder="ABC Medical Transport LLC" />
                </Field>
                <Field label="DBA (if different)">
                  <input className={inputCls()} value={form.dba} onChange={e => set('dba', e.target.value)} placeholder="Sunrise Transport" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="EIN *">
                  <input className={inputCls()} value={form.ein} onChange={e => set('ein', e.target.value)} placeholder="12-3456789" />
                </Field>
                <Field label="NPI *">
                  <input className={inputCls()} value={form.npi} onChange={e => set('npi', e.target.value)} placeholder="1234567890" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone *">
                  <input className={inputCls()} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(301) 555-0000" />
                </Field>
                <Field label="Email *">
                  <input type="email" className={inputCls()} value={form.email} onChange={e => set('email', e.target.value)} placeholder="admin@example.com" />
                </Field>
              </div>
              <Field label="Address *">
                <input className={inputCls()} value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St" />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="City *">
                  <input className={inputCls()} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Silver Spring" />
                </Field>
                <Field label="State">
                  <select className={inputCls()} value={form.state} onChange={e => set('state', e.target.value)}>
                    <option value="MD">MD</option>
                    <option value="DC">DC</option>
                    <option value="VA">VA</option>
                  </select>
                </Field>
                <Field label="ZIP *">
                  <input className={inputCls()} value={form.zip} onChange={e => set('zip', e.target.value)} placeholder="20901" />
                </Field>
              </div>
            </div>
          )}

          {/* Step 1 — Service Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-display tracking-tight font-semibold text-default text-lg mb-1">Service Details</h2>
              <div>
                <Label>MCOs you&apos;re enrolled with (select all that apply)</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {MCO_OPTIONS.map(m => (
                    <CheckPill key={m} label={m} checked={form.mcos.includes(m)} onClick={() => toggleArr('mcos', m)} />
                  ))}
                </div>
              </div>
              <div>
                <Label>Trip types you provide</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {TRIP_TYPES.map(t => (
                    <CheckPill key={t} label={t} checked={form.tripTypes.includes(t)} onClick={() => toggleArr('tripTypes', t)} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Fleet size (# of vehicles)">
                  <input type="number" min="1" className={inputCls()} value={form.fleetSize} onChange={e => set('fleetSize', e.target.value)} placeholder="5" />
                </Field>
                <Field label="Years in operation">
                  <input type="number" min="0" className={inputCls()} value={form.years} onChange={e => set('years', e.target.value)} placeholder="3" />
                </Field>
              </div>
              <div>
                <Label>Do you currently have drivers on staff?</Label>
                <div className="flex gap-3 mt-1">
                  {['Yes', 'No', 'Will hire'].map(opt => (
                    <CheckPill key={opt} label={opt} checked={form.hasDrivers === opt} onClick={() => set('hasDrivers', opt)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Credentials */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display tracking-tight font-semibold text-default text-lg mb-1">Compliance &amp; Credentials</h2>
              <p className="text-sm text-muted mb-4">
                You&apos;ll upload actual documents after approval. Just confirm current status here.
              </p>
              {[
                { key: 'cdl' as const,       label: 'Driver CDL status' },
                { key: 'insurance' as const,  label: 'Commercial auto insurance' },
                { key: 'hipaa' as const,      label: 'HIPAA training completed for all drivers' },
              ].map(item => (
                <div key={item.key}>
                  <Label>{item.label}</Label>
                  <div className="flex gap-3 mt-1">
                    {['Compliant', 'In progress', 'Not yet'].map(opt => (
                      <CheckPill key={opt} label={opt} checked={form[item.key] === opt} onClick={() => set(item.key, opt)} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Field label="Primary contact name *">
                  <input className={inputCls()} value={form.contact} onChange={e => set('contact', e.target.value)} placeholder="Jane Smith" />
                </Field>
                <Field label="Title / Role">
                  <input className={inputCls()} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Operations Manager" />
                </Field>
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-display tracking-tight font-semibold text-default text-lg mb-1">Review &amp; Submit</h2>
              <div className="space-y-4 text-sm">
                <ReviewRow label="Organization"  value={form.orgName || '—'} />
                <ReviewRow label="EIN"           value={form.ein || '—'} />
                <ReviewRow label="NPI"           value={form.npi || '—'} />
                <ReviewRow label="Email"         value={form.email || '—'} />
                <ReviewRow label="Phone"         value={form.phone || '—'} />
                <ReviewRow label="Location"      value={[form.city, form.state, form.zip].filter(Boolean).join(', ') || '—'} />
                <ReviewRow label="MCOs"          value={form.mcos.length > 0 ? form.mcos.join(', ') : 'None selected'} />
                <ReviewRow label="Trip types"    value={form.tripTypes.length > 0 ? form.tripTypes.join(', ') : 'None selected'} />
                <ReviewRow label="Fleet size"    value={form.fleetSize || '—'} />
                <ReviewRow label="Contact"       value={[form.contact, form.title].filter(Boolean).join(' · ') || '—'} />
              </div>
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={e => set('agree', e.target.checked)}
                    className="mt-0.5 accent-accent"
                  />
                  <span className="text-sm text-muted leading-relaxed">
                    I confirm that the information provided is accurate and I agree to Nexo Access&apos;s{' '}
                    <span className="text-accent">Terms of Service</span> and{' '}
                    <span className="text-accent">Privacy Policy</span>.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-default">
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className={cn(
                'text-sm text-muted hover:text-default transition-colors px-4 py-2',
                step === 0 && 'invisible',
              )}
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-text text-sm font-medium rounded-xl px-6 py-2.5 transition-colors"
              >
                Continue
                <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!form.agree}
                className="bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-accent-text text-sm font-medium rounded-xl px-6 py-2.5 transition-colors"
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-2 border-b border-default last:border-0">
      <span className="text-subtle w-32 shrink-0">{label}</span>
      <span className="text-default flex-1">{value}</span>
    </div>
  )
}
