import React, { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const PROJECT_TYPES = [
  { value: "consulting", label: "Technical consulting" },
  { value: "greenfield", label: "Greenfield development" },
  { value: "architecture", label: "Architecture review" },
  { value: "other", label: "Other" },
];

const BUDGETS = [
  { value: "<5k", label: "Under $5k" },
  { value: "5k-20k", label: "$5k – $20k" },
  { value: "20k-50k", label: "$20k – $50k" },
  { value: "50k+", label: "$50k+" },
  { value: "open", label: "Let's discuss" },
];

const field =
  "w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-fg)] font-sans text-sm px-4 py-3 focus:outline-none focus:border-[var(--color-accent)] transition-colors duration-150 placeholder:opacity-30";

const fieldError = "border-red-500";

const label =
  "font-mono text-xs tracking-widest uppercase text-[var(--color-fg-muted)]";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setFieldErrors({});
    setErrorMsg("");

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as {
        error?: string;
        fields?: FieldErrors;
        success?: boolean;
      };

      if (res.ok) {
        setState("success");
      } else if (res.status === 422 && json.fields) {
        setFieldErrors(json.fields);
        setState("idle");
      } else {
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        style={{ borderColor: "var(--color-accent)" }}
        className="border p-8 md:p-12"
      >
        <p
          style={{ color: "var(--color-fg-muted)" }}
          className="font-mono text-xs tracking-widest uppercase mb-4"
        >
          // Message sent
        </p>
        <p style={{ color: "var(--color-fg)" }} className="text-lg leading-relaxed">
          Thanks — I'll get back to you within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-name" className={label}>
            Name{" "}
            <span style={{ color: "var(--color-accent)" }} aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            autoComplete="name"
            aria-invalid={fieldErrors.name ? "true" : undefined}
            aria-describedby={fieldErrors.name ? "cf-name-error" : undefined}
            className={`${field} ${fieldErrors.name ? fieldError : ""}`}
          />
          {fieldErrors.name && (
            <p id="cf-name-error" className="font-mono text-xs text-red-500" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-email" className={label}>
            Email{" "}
            <span style={{ color: "var(--color-accent)" }} aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            autoComplete="email"
            aria-invalid={fieldErrors.email ? "true" : undefined}
            aria-describedby={fieldErrors.email ? "cf-email-error" : undefined}
            className={`${field} ${fieldErrors.email ? fieldError : ""}`}
          />
          {fieldErrors.email && (
            <p id="cf-email-error" className="font-mono text-xs text-red-500" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-project-type" className={label}>
            Project type
          </label>
          <select
            id="cf-project-type"
            name="projectType"
            defaultValue=""
            className={`${field} cursor-pointer`}
          >
            <option value="" disabled>
              Select type…
            </option>
            {PROJECT_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-budget" className={label}>
            Budget
          </label>
          <select
            id="cf-budget"
            name="budget"
            defaultValue=""
            className={`${field} cursor-pointer`}
          >
            <option value="" disabled>
              Select range…
            </option>
            {BUDGETS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-message" className={label}>
          Message{" "}
          <span style={{ color: "var(--color-accent)" }} aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          placeholder="Tell me about your project — what are you building, what's the challenge, what does success look like?"
          required
          rows={6}
          aria-invalid={fieldErrors.message ? "true" : undefined}
          aria-describedby={fieldErrors.message ? "cf-message-error" : undefined}
          className={`${field} resize-y ${fieldErrors.message ? fieldError : ""}`}
        />
        {fieldErrors.message && (
          <p id="cf-message-error" className="font-mono text-xs text-red-500" role="alert">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {state === "error" && (
        <p className="font-mono text-xs text-red-500" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-bg)",
        }}
        className="inline-flex items-center justify-center gap-2 font-mono text-sm tracking-wide px-8 py-4 transition-all duration-150 hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40 disabled:pointer-events-none self-start cursor-pointer"
      >
        {state === "loading" ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
