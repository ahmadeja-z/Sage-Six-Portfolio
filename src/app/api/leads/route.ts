import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { EnquiryType, LeadPayload } from "@/types";
import { enquiryTypes } from "@/lib/site";
import { services } from "@/data/content";
import { sendEnquiryMail } from "@/lib/mail";
import { buildEnquiryEmail, buildEnquirySubject } from "@/lib/email";

// This route serves both the full Contact form (src/components/forms/ContactForm.tsx)
// and the Ask Sage Six assistant's quick-lead panel (src/components/assistant/AIProjectAssistant.tsx).
// Keep it the single enquiry endpoint — do not add a second one.
export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = {
  name: 120,
  email: 254,
  company: 160,
  message: 6000,
  link: 500,
  budget: 80,
  timing: 80,
  submissionId: 120,
  page: 200,
};
// Generous ceiling for the raw JSON body — comfortably above every field's
// max length combined, so legitimate submissions never trip it.
const MAX_BODY_BYTES = 30_000;
const SUBMISSION_ID_PATTERN = /^[a-zA-Z0-9_-]{1,120}$/;

const SERVICE_IDS = new Set<string>(services.map((s) => s.anchor));
const ENQUIRY_IDS = new Set<string>(enquiryTypes.map((e) => e.id));

// Best-effort only: this counter lives in one serverless function instance's
// memory, so it does not share state across Vercel invocations or regions
// and resets on every cold start. It stops casual retry storms from a single
// warm instance but is not a real distributed rate limiter. See
// docs/contact-form-setup.md for an optional upgrade path (e.g. Upstash
// Redis) if abuse becomes a real problem.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function fail(status: number, code: string, message: string, field?: string) {
  return NextResponse.json({ success: false, code, message, ...(field ? { field } : {}) }, { status });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return fail(429, "rate_limited", "Please wait a moment before trying again.");
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return fail(400, "invalid", "That request was too large to process.");
  }

  let body: Partial<LeadPayload>;
  try {
    body = JSON.parse(raw) as Partial<LeadPayload>;
  } catch {
    return fail(400, "invalid", "Unable to process request.");
  }
  if (!body || typeof body !== "object") {
    return fail(400, "invalid", "Unable to process request.");
  }

  // Honeypot: a real visitor never sees or fills this field. A bot posting
  // directly to the API with it filled gets an indistinguishable success
  // response — no signal that it was caught — but no email is ever sent.
  const honeypot = clean(body.honeypot, 200);
  if (honeypot) {
    return NextResponse.json({ success: true, id: randomUUID() }, { status: 200 });
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email).toLowerCase();
  const company = clean(body.company, MAX.company);
  const enquiryType = clean(body.enquiryType, 40);
  const service = clean(body.service, 60);
  const message = clean(body.message, MAX.message);
  const websiteLink = clean(body.websiteLink, MAX.link);
  const budget = clean(body.budget, MAX.budget);
  const timing = clean(body.timing, MAX.timing);
  const page = clean(body.page, MAX.page);
  const rawSubmissionId = clean(body.submissionId, MAX.submissionId);

  if (name.length < 2) {
    return fail(400, "validation", "Please enter your name.", "name");
  }
  if (!EMAIL_REGEX.test(email)) {
    return fail(400, "validation", "Please enter a valid email address.", "email");
  }
  if (message.trim().length < 10) {
    return fail(400, "validation", "Please add a short description of what you need.", "message");
  }

  const lead: LeadPayload = {
    name,
    email,
    company,
    enquiryType: (ENQUIRY_IDS.has(enquiryType) ? enquiryType : "general") as EnquiryType,
    service: SERVICE_IDS.has(service) ? service : "",
    message,
    websiteLink,
    budget,
    timing,
    page,
  };

  const submittedAt = new Date().toISOString();
  const reference = `SS-${Date.now().toString(36).toUpperCase()}`;
  const subject = buildEnquirySubject(lead.name, lead.company, lead.enquiryType);
  const { html, text } = buildEnquiryEmail(lead, submittedAt, reference);

  // Reuse a client-provided id so a double-click or an uncertain network
  // retry of the *same* enquiry reuses the same Idempotency-Key instead of
  // sending a second email. Anything that doesn't look like a safe id
  // (or is missing, e.g. from older callers) gets a fresh server-generated
  // one — safe, just without cross-retry de-duplication.
  const safeSubmissionId = SUBMISSION_ID_PATTERN.test(rawSubmissionId) ? rawSubmissionId : randomUUID();
  const idempotencyKey = `contact-enquiry/${safeSubmissionId}`.slice(0, 200);

  const mail = await sendEnquiryMail({
    replyTo: lead.email,
    subject,
    html,
    text,
    idempotencyKey,
    tags: [
      { name: "source", value: "contact-form" },
      { name: "enquiry_type", value: lead.enquiryType },
    ],
  });

  if (!mail.ok) {
    if (mail.code === "rate_limited") {
      return fail(429, "rate_limited", "Please wait a moment before trying again.");
    }
    if (mail.code === "not_configured") {
      return fail(500, "not_configured", "Enquiry email is not configured on the server.");
    }
    return fail(
      500,
      "provider_error",
      "We couldn't submit your enquiry. Your details are still here — please try again or email hello@sagesix.co.uk.",
    );
  }

  return NextResponse.json({ success: true, id: mail.id, reference }, { status: 200 });
}
