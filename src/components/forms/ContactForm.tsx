"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { submitLead } from "@/lib/lead";
import { enquiryTypes, enquiryMessageHelpers } from "@/lib/site";
import { services } from "@/data/content";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  email: string;
  company: string;
  enquiryType: string;
  service: string;
  message: string;
  websiteLink: string;
  budget: string;
  timing: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  company: "",
  enquiryType: "new-project",
  service: "",
  message: "",
  websiteLink: "",
  budget: "",
  timing: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

function makeSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const serviceOptions = [
  { value: "", label: "Not sure yet" },
  ...services.map((s) => ({ value: s.anchor, label: s.title })),
];

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; message: string; code: string };

export function ContactForm({
  initialService = "",
  initialEnquiryType = "new-project",
}: {
  initialService?: string;
  initialEnquiryType?: string;
}) {
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    service: initialService,
    enquiryType: initialEnquiryType,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [showDetails, setShowDetails] = useState(false);
  // Honeypot: off-screen field a real visitor never sees or fills. If it
  // arrives populated, we quietly no-op instead of calling the API — bots
  // that fill every field get a fake success, not a hint they were caught.
  // The server enforces this independently for anything posted directly to
  // the API, bypassing this component entirely.
  const [honeypot, setHoneypot] = useState("");
  // Reused across retries of the same enquiry (double-click, network retry)
  // so the server can de-duplicate via an idempotency key. A fresh id is
  // generated once the enquiry is actually sent, for the next one.
  const [submissionId, setSubmissionId] = useState(() => makeSubmissionId());
  const summaryRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (status.kind === "success") successHeadingRef.current?.focus();
  }, [status.kind]);

  function setField<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (form.message.trim().length < 10) {
      next.message = "Please add a short description of what you need.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setShowValidationSummary(true);
      requestAnimationFrame(() => {
        const first = (Object.keys(next) as (keyof FormState)[])[0];
        document.getElementById(first)?.focus();
      });
    } else {
      setShowValidationSummary(false);
    }
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Belt-and-suspenders: guards against a resubmit even if the button's
    // disabled state hasn't re-rendered yet (e.g. a fast repeat Enter key).
    if (status.kind === "loading") return;
    if (honeypot) {
      setStatus({ kind: "success" });
      return;
    }
    if (!validate()) return;
    setStatus({ kind: "loading" });

    const result = await submitLead({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      company: form.company.trim(),
      enquiryType: form.enquiryType,
      service: form.service,
      message: form.message.trim(),
      websiteLink: showDetails ? form.websiteLink.trim() : "",
      budget: showDetails ? form.budget.trim() : "",
      timing: showDetails ? form.timing.trim() : "",
      honeypot,
      submissionId,
    });

    if (result.ok) {
      setStatus({ kind: "success" });
      setSubmissionId(makeSubmissionId());
    } else {
      setStatus({ kind: "error", message: result.message, code: result.code });
      if (result.field && result.field in emptyForm) {
        setErrors((e) => ({ ...e, [result.field as keyof FormState]: result.message }));
      }
      summaryRef.current?.focus();
    }
  }

  function reset() {
    setForm({ ...emptyForm, service: initialService, enquiryType: initialEnquiryType });
    setErrors({});
    setStatus({ kind: "idle" });
    setShowDetails(false);
    setHoneypot("");
  }

  if (status.kind === "success") {
    return (
      <div className="s6-contact-card flex min-h-[520px] flex-col items-center justify-center p-10 text-center">
        <motion.div
          initial={reduce ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="s6-contact-success-icon"
          aria-hidden="true"
        >
          <Check className="h-7 w-7" strokeWidth={2.5} />
        </motion.div>
        <h2 ref={successHeadingRef} tabIndex={-1} className="mt-7">
          Thank you for getting in touch.
        </h2>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[color:var(--s6-body)]">
          Your enquiry has been submitted. We&apos;ll review the details and
          respond using the email address you provided.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/work" className="s6-button s6-button-outline">
            Explore Our Work
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <button type="button" onClick={reset} className="s6-text-link">
            Send Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  const messageHelper = enquiryMessageHelpers[form.enquiryType] ?? enquiryMessageHelpers.new;
  const inputClass = (hasError?: string) =>
    cn(
      "w-full rounded-[10px] border bg-white px-4 py-3.5 text-[15px] text-[color:var(--s6-navy)] placeholder:text-[color:var(--s6-muted)] transition-colors duration-200",
      hasError
        ? "border-[#D92D20]"
        : "border-[color:var(--s6-border)] focus:border-[color:var(--s6-blue)]",
    );
  const labelClass = "mb-2 block text-[13px] font-medium text-[color:var(--s6-navy)]";

  return (
    <form onSubmit={onSubmit} noValidate className="s6-contact-card p-6 md:p-10">
      <h2 className="s6-contact-form-heading">Tell us how we can help.</h2>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--s6-body)]">
        A short outline is enough to start. Share what you want to achieve, what
        already exists and where you need help.
      </p>

      {/* Honeypot — hidden off-screen, never presented to sighted or keyboard users. */}
      <div className="s6-hp" aria-hidden="true">
        <label htmlFor="company_url">Leave this field blank</label>
        <input
          id="company_url"
          name="company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div ref={summaryRef} tabIndex={-1} aria-live="polite" className="outline-none">
        <AnimatePresence>
          {showValidationSummary && status.kind !== "error" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="s6-contact-alert mt-5"
              role="alert"
            >
              Please check the highlighted fields.
            </motion.div>
          )}
          {status.kind === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="s6-contact-alert mt-5"
              role="alert"
            >
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <fieldset className="mt-8">
        <legend className={labelClass}>Enquiry type</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Enquiry type">
          {enquiryTypes.map((type) => (
            <label
              key={type.id}
              className={cn(
                "s6-contact-pill",
                form.enquiryType === type.id && "s6-contact-pill-active",
              )}
            >
              <input
                type="radio"
                name="enquiryType"
                value={type.id}
                checked={form.enquiryType === type.id}
                onChange={(e) => setField("enquiryType", e.target.value)}
                className="sr-only"
              />
              {type.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name <span className="text-[color:var(--s6-blue)]">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Jane Doe"
            className={inputClass(errors.name)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="s6-contact-field-error">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email address <span className="text-[color:var(--s6-blue)]">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="jane@company.com"
            className={inputClass(errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="s6-contact-field-error">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Company or organisation{" "}
            <span className="text-[color:var(--s6-muted)]">(optional)</span>
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={(e) => setField("company", e.target.value)}
            placeholder="Your company"
            className={inputClass()}
          />
        </div>
        <div>
          <label htmlFor="service" className={labelClass}>
            Service of interest{" "}
            <span className="text-[color:var(--s6-muted)]">(optional)</span>
          </label>
          <select
            id="service"
            value={form.service}
            onChange={(e) => setField("service", e.target.value)}
            className={inputClass()}
          >
            {serviceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-[color:var(--s6-blue)]">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          value={form.message}
          onChange={(e) => setField("message", e.target.value)}
          placeholder={messageHelper}
          className={cn(inputClass(errors.message), "resize-none")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error message-help" : "message-help"}
        />
        <p id="message-help" className="mt-2 text-xs leading-relaxed text-[color:var(--s6-muted)]">
          {messageHelper}
        </p>
        {errors.message && (
          <p id="message-error" className="s6-contact-field-error">
            {errors.message}
          </p>
        )}
        <p className="mt-3 text-xs leading-relaxed text-[color:var(--s6-muted)]">
          Please leave passwords, API keys and other sensitive information out of
          this form.
        </p>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          aria-expanded={showDetails}
          aria-controls="optional-details"
          className="s6-text-link"
        >
          Add more details (optional)
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-300", showDetails && "rotate-180")}
            strokeWidth={1.75}
          />
        </button>
        <AnimatePresence initial={false}>
          {showDetails && (
            <motion.div
              id="optional-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 grid gap-6 sm:grid-cols-3">
                <div>
                  <label htmlFor="websiteLink" className={labelClass}>
                    Existing website or app link
                  </label>
                  <input
                    id="websiteLink"
                    type="url"
                    value={form.websiteLink}
                    onChange={(e) => setField("websiteLink", e.target.value)}
                    placeholder="https://…"
                    className={inputClass()}
                  />
                </div>
                <div>
                  <label htmlFor="budget" className={labelClass}>
                    Budget <span className="text-[color:var(--s6-muted)]">(optional)</span>
                  </label>
                  <input
                    id="budget"
                    type="text"
                    value={form.budget}
                    onChange={(e) => setField("budget", e.target.value)}
                    placeholder="e.g. £10k–£25k"
                    className={inputClass()}
                  />
                </div>
                <div>
                  <label htmlFor="timing" className={labelClass}>
                    Preferred timing{" "}
                    <span className="text-[color:var(--s6-muted)]">(optional)</span>
                  </label>
                  <input
                    id="timing"
                    type="text"
                    value={form.timing}
                    onChange={(e) => setField("timing", e.target.value)}
                    placeholder="e.g. 3–6 months, or Not decided yet"
                    className={inputClass()}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-[color:var(--s6-muted)]">
        We&apos;ll use these details to respond to your enquiry.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status.kind === "loading"}
          className="s6-button group min-w-[168px] disabled:cursor-not-allowed"
        >
          {status.kind === "loading" ? (
            <>
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden="true"
              />
              Sending…
            </>
          ) : (
            <>
              Send Enquiry
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
