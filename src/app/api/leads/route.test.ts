import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the mail layer entirely — these tests exercise routing, validation,
// spam handling and status-code mapping, never a real Resend send.
const mockSendEnquiryMail = vi.fn();
const mockSendClientConfirmationMail = vi.fn();
vi.mock("@/lib/mail", () => ({
  sendEnquiryMail: (...args: unknown[]) => mockSendEnquiryMail(...args),
  sendClientConfirmationMail: (...args: unknown[]) => mockSendClientConfirmationMail(...args),
  CONTACT_TO_EMAIL: "hello@sagesix.co.uk",
}));

import { POST } from "@/app/api/leads/route";

const validBody = {
  name: "Jane Doe",
  email: "jane@example.com",
  company: "",
  enquiryType: "new-project",
  service: "",
  message: "We need a mobile app for our delivery business.",
  websiteLink: "",
  budget: "",
  timing: "",
  submissionId: "test-submission-id",
};

function makeRequest(body: unknown, ip: string, rawBody?: string): Request {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: rawBody ?? JSON.stringify(body),
  });
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    mockSendEnquiryMail.mockReset();
    mockSendEnquiryMail.mockResolvedValue({ ok: true, id: "resend-msg-1" });
    mockSendClientConfirmationMail.mockReset();
    mockSendClientConfirmationMail.mockResolvedValue({ ok: true, id: "resend-client-msg-1" });
  });

  it("accepts a valid enquiry and returns the Resend message id", async () => {
    const res = await POST(makeRequest(validBody, "10.0.0.1"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.id).toBe("resend-msg-1");
    expect(mockSendEnquiryMail).toHaveBeenCalledTimes(1);
  });

  it("rejects a missing name", async () => {
    const res = await POST(makeRequest({ ...validBody, name: "" }, "10.0.0.2"));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.field).toBe("name");
    expect(mockSendEnquiryMail).not.toHaveBeenCalled();
  });

  it("rejects an invalid email address", async () => {
    const res = await POST(makeRequest({ ...validBody, email: "not-an-email" }, "10.0.0.3"));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.field).toBe("email");
    expect(mockSendEnquiryMail).not.toHaveBeenCalled();
  });

  it("rejects a missing or too-short message", async () => {
    const res = await POST(makeRequest({ ...validBody, message: "hi" }, "10.0.0.4"));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.field).toBe("message");
    expect(mockSendEnquiryMail).not.toHaveBeenCalled();
  });

  it("rejects a whitespace-only message", async () => {
    const res = await POST(makeRequest({ ...validBody, message: "          " }, "10.0.0.5"));
    expect(res.status).toBe(400);
    expect(mockSendEnquiryMail).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON with a 400, not a crash", async () => {
    const res = await POST(makeRequest(null, "10.0.0.6", "{not valid json"));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("rejects an oversized payload before parsing it", async () => {
    const res = await POST(makeRequest({ ...validBody, message: "a".repeat(40_000) }, "10.0.0.7"));
    expect(res.status).toBe(400);
    expect(mockSendEnquiryMail).not.toHaveBeenCalled();
  });

  it("silently no-ops a filled honeypot instead of sending an email", async () => {
    const res = await POST(makeRequest({ ...validBody, honeypot: "I am a bot" }, "10.0.0.8"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockSendEnquiryMail).not.toHaveBeenCalled();
  });

  it("returns a safe 500 without leaking details when mail is not configured", async () => {
    mockSendEnquiryMail.mockResolvedValue({ ok: false, code: "not_configured" });
    const res = await POST(makeRequest(validBody, "10.0.0.9"));
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    const serialised = JSON.stringify(data);
    expect(serialised).not.toContain("RESEND_API_KEY");
    expect(serialised.toLowerCase()).not.toContain("stack");
  });

  it("returns a safe 500 on a simulated provider error", async () => {
    mockSendEnquiryMail.mockResolvedValue({ ok: false, code: "provider_error" });
    const res = await POST(makeRequest(validBody, "10.0.0.10"));
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
  });

  it("returns 429 when Resend itself reports a rate limit", async () => {
    mockSendEnquiryMail.mockResolvedValue({ ok: false, code: "rate_limited" });
    const res = await POST(makeRequest(validBody, "10.0.0.11"));
    expect(res.status).toBe(429);
  });

  it("rate limits repeated submissions from the same IP", async () => {
    const ip = "10.0.0.12";
    for (let i = 0; i < 5; i++) {
      await POST(makeRequest(validBody, ip));
    }
    const res = await POST(makeRequest(validBody, ip));
    expect(res.status).toBe(429);
  });

  it("reuses the same idempotency key for the same submission id", async () => {
    await POST(makeRequest(validBody, "10.0.0.13"));
    await POST(makeRequest(validBody, "10.0.0.13"));
    const keys = mockSendEnquiryMail.mock.calls.map((call) => call[0].idempotencyKey);
    expect(keys[0]).toBe(keys[1]);
    expect(keys[0]).toBe("contact-enquiry/test-submission-id");
  });
});
