"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FIELDS, LABELS, LIMITS, CONTACT_ROLES, HONEYPOT_FIELD } from "@/lib/leads";
import { useLeadForm } from "@/components/leads/useLeadForm";
import { TextInput, TextArea, SelectField, Honeypot } from "@/components/leads/fields";

const ORDER = [FIELDS.name, FIELDS.organization, FIELDS.email, FIELDS.role, FIELDS.message] as const;
const PROVIDER_HINT_ID = "role-provider-hint";

export function ContactForm() {
  const { pending, succeeded, fieldErrors, formError, onSubmit, reset, formRef, alertRef, successRef, headingRef } =
    useLeadForm("contact", ORDER);
  const [role, setRole] = useState("");

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
          Thanks — we’ve got your message.
        </h2>
        <p className="mt-2 text-base leading-relaxed text-muted">
          We’ll read it and follow up about your program. If you need to add anything, just reply to
          the confirmation email.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            setRole(""); // clear the companion state too, or the provider nudge would persist on the fresh form
            reset();
          }}
          className="mt-6"
        >
          Send another message
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
        Send us a message
      </h2>
      <p className="mt-2 text-base leading-relaxed text-muted">
        Fields marked * are required. You’ll hear back from the person who built the platform.
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
        label={LABELS.name}
        required
        autoComplete="name"
        maxLength={LIMITS.name}
        error={fieldErrors?.[FIELDS.name]}
      />
      <TextInput
        name={FIELDS.organization}
        label={LABELS.organization}
        autoComplete="organization"
        maxLength={LIMITS.company}
        error={fieldErrors?.[FIELDS.organization]}
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
      <div>
        <SelectField
          name={FIELDS.role}
          label="I am a…"
          options={CONTACT_ROLES}
          placeholder="Select one"
          error={fieldErrors?.[FIELDS.role]}
          onValueChange={setRole}
          extraDescribedBy={role === "provider" ? PROVIDER_HINT_ID : undefined}
        />
        {role === "provider" ? (
          <p id={PROVIDER_HINT_ID} className="mt-2 flex flex-wrap items-center gap-x-1 text-sm text-muted">
            Applying to run trips?{" "}
            <Link
              href="/apply"
              className="group inline-flex items-center gap-1 rounded-sm font-medium text-accent underline underline-offset-2 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Use our provider application
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </p>
        ) : null}
      </div>
      <TextArea
        name={FIELDS.message}
        label={LABELS.message}
        required
        rows={5}
        maxLength={LIMITS.message}
        hint="Tell us about your program. Please don’t include member or health information."
        error={fieldErrors?.[FIELDS.message]}
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
        {pending ? "Sending…" : "Send message"}
      </Button>
      </form>
    </>
  );
}
