"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FIELDS, LABELS, LIMITS, SERVICE_LEVELS, HONEYPOT_FIELD } from "@/lib/leads";
import { useLeadForm } from "@/components/leads/useLeadForm";
import { TextInput, TextArea, CheckboxGroup, Honeypot } from "@/components/leads/fields";

const ORDER = [FIELDS.name, FIELDS.company, FIELDS.email, FIELDS.phone, FIELDS.city, FIELDS.notes] as const;

export function ApplyForm() {
  const { pending, succeeded, fieldErrors, formError, onSubmit, reset, formRef, alertRef, successRef, headingRef } =
    useLeadForm("provider", ORDER);

  if (succeeded) {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="rounded-2xl border border-surface-tint-border bg-surface-tint p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:p-8"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-default sm:text-2xl">
          Thanks, your application is in.
        </h2>
        <p className="mt-2 text-base leading-relaxed text-muted">
          We’ve got your details and we’ll follow up about running trips with us. If you need to add
          anything, just reply to the confirmation email.
        </p>
        <Button type="button" variant="secondary" size="md" onClick={reset} className="mt-6">
          Submit another application
        </Button>
      </div>
    );
  }

  return (
    <>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="rounded-sm font-display text-xl font-bold tracking-tight text-default outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:text-2xl"
      >
        Tell us about your operation
      </h2>
      <p className="mt-2 text-base leading-relaxed text-muted">
        A few details to get started. Fields marked * are required.
      </p>
      <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-6 space-y-6">
      {formError ? (
        <div
          ref={alertRef}
          role="alert"
          tabIndex={-1}
          className="rounded-lg border border-danger bg-danger-subtle px-4 py-3 text-sm font-medium text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          {formError}
        </div>
      ) : null}

      <TextInput
        name={FIELDS.name}
        label={LABELS.contactName}
        required
        autoComplete="name"
        maxLength={LIMITS.name}
        error={fieldErrors?.[FIELDS.name]}
      />
      <TextInput
        name={FIELDS.company}
        label={LABELS.company}
        required
        autoComplete="organization"
        maxLength={LIMITS.company}
        error={fieldErrors?.[FIELDS.company]}
      />
      <TextInput
        name={FIELDS.email}
        label={LABELS.email}
        type="email"
        inputMode="email"
        required
        autoComplete="email"
        maxLength={LIMITS.email}
        error={fieldErrors?.[FIELDS.email]}
      />
      <TextInput
        name={FIELDS.phone}
        label={LABELS.phone}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={LIMITS.phone}
        error={fieldErrors?.[FIELDS.phone]}
      />
      <TextInput
        name={FIELDS.city}
        label={LABELS.city}
        required
        autoComplete="address-level2"
        maxLength={LIMITS.city}
        hint="Where you’re based (e.g. Silver Spring, MD)."
        error={fieldErrors?.[FIELDS.city]}
      />
      <CheckboxGroup
        name={FIELDS.serviceLevels}
        legend="Service levels you run"
        hint="Select any that apply. Bariatric / two-person assist is an add-on, not a separate level."
        options={SERVICE_LEVELS}
      />
      <TextArea
        name={FIELDS.notes}
        label={LABELS.notes}
        rows={4}
        maxLength={LIMITS.notes}
        hint="Anything you’d like us to know. Please don’t include member or health information."
        error={fieldErrors?.[FIELDS.notes]}
      />

      <p className="text-sm text-muted">
        Please don’t include any member or health information in this form. See our{" "}
        <Link
          href="/privacy"
          className="rounded-sm font-medium text-accent underline underline-offset-2 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <Honeypot name={HONEYPOT_FIELD} />

      <Button type="submit" variant="primary" size="md" disabled={pending}>
        {pending ? "Sending…" : "Submit application"}
      </Button>
      </form>
    </>
  );
}
