"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { submitLead } from "@/app/actions/leads";
import { type LeadKind, type LeadState, TIMESTAMP_FIELD } from "@/lib/leads";

// Owns the submit lifecycle + focus management shared by both lead forms.
// - captures the form-render time on mount (min-elapsed-time trap)
// - disables the submit while pending
// - on success: caller shows the panel; we move focus to it (aria-live announces)
// - on field errors: focus the FIRST errored field in visual order
// - on a form-level error: focus the alert banner
export function useLeadForm(kind: LeadKind, fieldOrder: readonly string[]) {
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<LeadState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const loadedAt = useRef<number>(0);
  const justReset = useRef(false);

  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);

  // "Send another": clear the result so the empty form re-renders in place, stamp a FRESH form-render
  // time (the min-elapsed-time trap applies per submission), and move focus back to the form heading.
  const reset = useCallback(() => {
    loadedAt.current = Date.now();
    justReset.current = true;
    setState(null);
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (pending) return;
      const fd = new FormData(e.currentTarget);
      fd.set(TIMESTAMP_FIELD, String(loadedAt.current));
      setPending(true);
      try {
        const res = await submitLead(kind, fd);
        setState(res);
      } catch {
        // A thrown action (network/runtime) must never leave the form stuck — show a friendly banner.
        setState({ ok: false, formError: "Something went wrong sending your message. Please try again." });
      } finally {
        setPending(false);
      }
    },
    [kind, pending],
  );

  useEffect(() => {
    if (!state) {
      // after a reset, the empty form is back — move focus to its heading (announces the fresh form)
      if (justReset.current) {
        justReset.current = false;
        headingRef.current?.focus();
      }
      return;
    }
    if (state.ok) {
      successRef.current?.focus();
      return;
    }
    if (state.fieldErrors) {
      const firstKey = fieldOrder.find((k) => state.fieldErrors?.[k]);
      if (firstKey && formRef.current) {
        formRef.current.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      }
      return;
    }
    if (state.formError) alertRef.current?.focus();
  }, [state, fieldOrder]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const formError = state && !state.ok ? state.formError : undefined;
  const succeeded = !!state?.ok;

  return { pending, succeeded, fieldErrors, formError, onSubmit, reset, formRef, alertRef, successRef, headingRef };
}
