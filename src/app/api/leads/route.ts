import { NextResponse } from "next/server";
import type { EnquiryType, LeadPayload } from "@/types";
import { enquiryTypes } from "@/lib/site";
import { services } from "@/data/content";
import { sendEnquiryMail } from "@/lib/mail";
import { buildEnquiryEmail, buildEnquirySubject } from "@/lib/email";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 120, email: 254, company: 160, message: 6000, link: 500, budget: 80, timing: 80 };

const SERVICE_IDS = new Set<string>(services.map((s) => s.anchor));
const ENQUIRY_IDS = new Set<string>(enquiryTypes.map((e) => e.id));

// Simple in-memory rate limit: 5 submissions per IP per 10 minutes.
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

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ code: "rate_limited" }, { status: 429 });
  }

  let body: Partial<LeadPayload>;
  try {
    body = (await request.json()) as Partial<LeadPayload>;
  } catch {
    return NextResponse.json({ code: "invalid", message: "Unable to process request." }, { status: 400 });
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

  if (name.length < 2) {
    return NextResponse.json({ code: "validation", field: "name", message: "Please enter your name." }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ code: "validation", field: "email", message: "Please enter a valid email address." }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ code: "validation", field: "message", message: "Please add a short description of what you need." }, { status: 400 });
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
  };

  const submittedAt = new Date().toISOString();
  const reference = `SS-${Date.now().toString(36).toUpperCase()}`;
  const subject = buildEnquirySubject(lead.enquiryType, lead.service);
  const { html, text } = buildEnquiryEmail(lead, submittedAt, reference);

  const mail = await sendEnquiryMail({ replyTo: lead.email, subject, html, text });

  if (!mail.ok) {
    if (mail.code === "not_configured") {
      return NextResponse.json(
        { code: "not_configured", message: "Enquiry email is not configured on the server." },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { code: "provider_error", message: "We couldn't submit your enquiry. Your details are still here — please try again or email hello@sagesix.co.uk." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { ok: true, reference, message: "Your enquiry has been submitted." },
    { status: 200 },
  );
}