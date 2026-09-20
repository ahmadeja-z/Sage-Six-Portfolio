import Link from "next/link";
import { enquiryTypes, enquiryMessageHelpers } from "@/lib/site";
import { services } from "@/data/content";
import { cn } from "@/lib/utils";
import type { LeadForm } from "./types";

const serviceOptions = [
  { value: "", label: "Not sure yet" },
  ...services.map((s) => ({ value: s.anchor, label: s.title })),
];

const labelClass = "mb-1.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500";
const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0f75bd] focus:outline-none focus:ring-2 focus:ring-[#0f75bd]/20";

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">{k}</dt>
      <dd className="text-slate-700">{v}</dd>
    </div>
  );
}

export function LeadPanel({
  lead,
  setLeadField,
  leadStep,
  onEdit,
  onReview,
  leadError,
  leadSubmitting,
  onConfirm,
  onClear,
}: {
  lead: LeadForm;
  setLeadField: <K extends keyof LeadForm>(key: K, value: string) => void;
  leadStep: "form" | "review" | "done";
  onEdit: () => void;
  onReview: () => void;
  leadError: string;
  leadSubmitting: boolean;
  onConfirm: () => void;
  onClear: () => void;
}) {
  if (leadStep === "done") {
    return (
      <div className="mt-3 rounded-xl border border-[#0f75bd]/25 bg-[#f0f7fd] p-4">
        <p className="text-sm text-slate-700">
          Your enquiry has been sent. You can also email hello@sagesix.co.uk or{" "}
          <Link href="/contact" className="font-medium text-[#0f75bd] underline-offset-4 hover:underline">
            use the contact form
          </Link>
          .
        </p>
      </div>
    );
  }

  if (leadStep === "review") {
    return (
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f75bd]">Review your enquiry</p>
        <dl className="mt-3 space-y-1.5 text-sm">
          <Row k="Name" v={lead.name} />
          <Row k="Email" v={lead.email} />
          {lead.company && <Row k="Company" v={lead.company} />}
          <Row k="Enquiry type" v={enquiryTypes.find((t) => t.id === lead.enquiryType)?.label ?? lead.enquiryType} />
          <Row k="Service" v={serviceOptions.find((s) => s.value === lead.service)?.label ?? "Not sure yet"} />
          <Row k="Summary" v={lead.message} />
          {lead.websiteLink && <Row k="Website or app" v={lead.websiteLink} />}
          {lead.timing && <Row k="Timing" v={lead.timing} />}
          {lead.budget && <Row k="Budget" v={lead.budget} />}
        </dl>
        {leadError && <p className="mt-3 text-xs text-red-600">{leadError}</p>}
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          By submitting, you agree that Sage Six may use these details to respond to your enquiry.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={leadSubmitting}
            onClick={onConfirm}
            className="min-h-11 rounded-lg bg-gradient-to-r from-[#273990] to-[#0f75bd] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white shadow-sm transition-colors hover:brightness-110 disabled:opacity-60"
          >
            {leadSubmitting ? "Sending…" : "Confirm & send"}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="min-h-11 rounded-lg border border-slate-200 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-600 transition-colors hover:border-[#0f75bd] hover:text-[#0f75bd]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onClear}
            className="min-h-11 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 hover:text-slate-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f75bd]">Prepare an enquiry</p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
        A short outline is enough to start. We&apos;ll review the details before anything is sent.
      </p>
      {leadError && <p className="mt-2 text-xs text-red-600">{leadError}</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={labelClass}>
            Full name *
          </label>
          <input id="lead-name" value={lead.name} onChange={(e) => setLeadField("name", e.target.value)} className={inputClass} placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="lead-email" className={labelClass}>
            Email *
          </label>
          <input id="lead-email" type="email" value={lead.email} onChange={(e) => setLeadField("email", e.target.value)} className={inputClass} placeholder="jane@company.com" />
        </div>
        <div>
          <label htmlFor="lead-company" className={labelClass}>
            Company (optional)
          </label>
          <input id="lead-company" value={lead.company} onChange={(e) => setLeadField("company", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="lead-service" className={labelClass}>
            Service of interest
          </label>
          <select id="lead-service" value={lead.service} onChange={(e) => setLeadField("service", e.target.value)} className={inputClass}>
            {serviceOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-message" className={labelClass}>
            What do you need? *
          </label>
          <textarea
            id="lead-message"
            rows={3}
            value={lead.message}
            onChange={(e) => setLeadField("message", e.target.value)}
            className={cn(inputClass, "resize-none")}
            placeholder={enquiryMessageHelpers[lead.enquiryType] ?? enquiryMessageHelpers["new-project"]}
          />
        </div>
        <div>
          <label htmlFor="lead-link" className={labelClass}>
            Existing website or app (optional)
          </label>
          <input id="lead-link" value={lead.websiteLink} onChange={(e) => setLeadField("websiteLink", e.target.value)} className={inputClass} placeholder="https://…" />
        </div>
        <div>
          <label htmlFor="lead-timing" className={labelClass}>
            Timing (optional)
          </label>
          <input id="lead-timing" value={lead.timing} onChange={(e) => setLeadField("timing", e.target.value)} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-budget" className={labelClass}>
            Budget range (optional)
          </label>
          <input id="lead-budget" value={lead.budget} onChange={(e) => setLeadField("budget", e.target.value)} className={inputClass} placeholder="e.g. £10k–£25k" />
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Please leave passwords, API keys and other sensitive information out of this form.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReview}
          className="min-h-11 rounded-lg bg-gradient-to-r from-[#273990] to-[#0f75bd] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white shadow-sm transition-colors hover:brightness-110"
        >
          Review enquiry
        </button>
        <button
          type="button"
          onClick={onClear}
          className="min-h-11 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 hover:text-slate-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
