"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

// Shared, accessible field primitives for the lead forms (Stage 10S). Uncontrolled inputs (the form
// reads values via FormData on submit); errors are passed in after a submit and wired to the input
// through aria-describedby. Input EDGES use border-control (>=3:1, WCAG 1.4.11); error state swaps to
// border-danger. Focus ring is accent + offset over the white card.

const inputBase =
  "w-full rounded-lg bg-input-bg px-3.5 py-2.5 text-base text-default transition-colors " +
  "placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

function borderFor(hasError: boolean) {
  return hasError ? "border border-danger" : "border border-control";
}

function ids(name: string, hasError: boolean, hasHint: boolean) {
  const describedBy = [hasHint ? `${name}-hint` : null, hasError ? `${name}-error` : null]
    .filter(Boolean)
    .join(" ");
  return { errorId: `${name}-error`, hintId: `${name}-hint`, describedBy: describedBy || undefined };
}

function LabelRow({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-default">
      {label}
      {required ? (
        <>
          <span aria-hidden="true" className="text-danger">
            {" "}
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      ) : (
        <span className="font-normal text-subtle"> (optional)</span>
      )}
    </label>
  );
}

function Hint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1 text-sm text-muted">
      {children}
    </p>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-danger">
      {children}
    </p>
  );
}

type BaseProps = {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
};

export function TextInput({
  name,
  label,
  required,
  error,
  hint,
  type = "text",
  autoComplete,
  maxLength,
  inputMode,
}: BaseProps & {
  type?: string;
  autoComplete?: string;
  maxLength?: number;
  inputMode?: "text" | "email" | "tel";
}) {
  const { errorId, hintId, describedBy } = ids(name, !!error, !!hint);
  return (
    <div>
      <LabelRow htmlFor={name} label={label} required={required} />
      {hint ? <Hint id={hintId}>{hint}</Hint> : null}
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn("mt-1.5", inputBase, borderFor(!!error))}
      />
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </div>
  );
}

export function TextArea({
  name,
  label,
  required,
  error,
  hint,
  rows = 4,
  maxLength,
}: BaseProps & { rows?: number; maxLength?: number }) {
  const { errorId, hintId, describedBy } = ids(name, !!error, !!hint);
  return (
    <div>
      <LabelRow htmlFor={name} label={label} required={required} />
      {hint ? <Hint id={hintId}>{hint}</Hint> : null}
      <textarea
        id={name}
        name={name}
        rows={rows}
        maxLength={maxLength}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn("mt-1.5 resize-y", inputBase, borderFor(!!error))}
      />
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </div>
  );
}

export function SelectField({
  name,
  label,
  required,
  error,
  hint,
  options,
  placeholder,
  onValueChange,
  extraDescribedBy,
}: BaseProps & {
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder: string;
  onValueChange?: (value: string) => void;
  /** id of an additional element (e.g. a conditional inline hint) to associate via aria-describedby. */
  extraDescribedBy?: string;
}) {
  const { errorId, hintId, describedBy } = ids(name, !!error, !!hint);
  const allDescribedBy = [describedBy, extraDescribedBy].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <LabelRow htmlFor={name} label={label} required={required} />
      {hint ? <Hint id={hintId}>{hint}</Hint> : null}
      <select
        id={name}
        name={name}
        defaultValue=""
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={allDescribedBy}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn("mt-1.5", inputBase, borderFor(!!error))}
      >
        <option value="" disabled={required}>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </div>
  );
}

// A group of checkboxes rendered as a labeled fieldset (its legend IS the group label).
export function CheckboxGroup({
  name,
  legend,
  hint,
  options,
}: {
  name: string;
  legend: string;
  hint?: ReactNode;
  options: ReadonlyArray<{ value: string; label: string }>;
}) {
  const hintId = `${name}-hint`;
  return (
    <fieldset aria-describedby={hint ? hintId : undefined}>
      <legend className="text-sm font-medium text-default">
        {legend}
        <span className="font-normal text-subtle"> (optional)</span>
      </legend>
      {hint ? <Hint id={hintId}>{hint}</Hint> : null}
      <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-base text-default"
          >
            <input
              type="checkbox"
              name={name}
              value={o.value}
              className="h-4 w-4 shrink-0 accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// The single off-screen honeypot input. Real users never see or tab to it; a filled value flags a bot.
export function Honeypot({ name }: { name: string }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor={name}>Leave this field empty</label>
      <input id={name} name={name} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
