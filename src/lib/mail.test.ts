import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEnquiryMail } from "@/lib/mail";

// Never hit the real Resend API in automated tests — mock the SDK entirely so
// these tests are repeatable and send zero real emails. `vi.mock` factories
// are hoisted above imports, and Vitest specifically allows referencing a
// `mock`-prefixed variable from inside the factory despite that hoisting.
const mockSend = vi.fn();
vi.mock("resend", () => ({
  // A plain `function` (not an arrow function) so `new Resend()` follows
  // normal constructor-return semantics and yields this object.
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: mockSend } };
  }),
}));

const ORIGINAL_ENV = { ...process.env };
const baseArgs = {
  replyTo: "visitor@example.com",
  subject: "New Sage Six Enquiry from Jane Doe — New project",
  html: "<p>hi</p>",
  text: "hi",
  idempotencyKey: "contact-enquiry/test-id",
};

describe("sendEnquiryMail", () => {
  beforeEach(() => {
    mockSend.mockReset();
    process.env = {
      ...ORIGINAL_ENV,
      RESEND_API_KEY: "test-key",
      CONTACT_FROM_EMAIL: "Sage Six Website <enquiries@send.sagesix.co.uk>",
      CONTACT_TO_EMAIL: "hello@sagesix.co.uk",
    };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("returns not_configured and never calls Resend when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const result = await sendEnquiryMail(baseArgs);
    expect(result).toEqual({ ok: false, code: "not_configured" });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns not_configured and never calls Resend when CONTACT_FROM_EMAIL is missing", async () => {
    delete process.env.CONTACT_FROM_EMAIL;
    const result = await sendEnquiryMail(baseArgs);
    expect(result).toEqual({ ok: false, code: "not_configured" });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns not_configured and never calls Resend when CONTACT_TO_EMAIL is missing", async () => {
    delete process.env.CONTACT_TO_EMAIL;
    const result = await sendEnquiryMail(baseArgs);
    expect(result).toEqual({ ok: false, code: "not_configured" });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns the Resend message id on success and forwards the idempotency key", async () => {
    mockSend.mockResolvedValue({ data: { id: "resend-msg-123" }, error: null });
    const result = await sendEnquiryMail(baseArgs);
    expect(result).toEqual({ ok: true, id: "resend-msg-123" });
    expect(mockSend).toHaveBeenCalledWith(expect.any(Object), { idempotencyKey: "contact-enquiry/test-id" });
  });

  it("sends from CONTACT_FROM_EMAIL and to CONTACT_TO_EMAIL, never the visitor's address", async () => {
    mockSend.mockResolvedValue({ data: { id: "resend-msg-123" }, error: null });
    await sendEnquiryMail(baseArgs);
    const [payload] = mockSend.mock.calls[0];
    expect(payload.from).toBe("Sage Six Website <enquiries@send.sagesix.co.uk>");
    expect(payload.to).toEqual(["hello@sagesix.co.uk"]);
    expect(payload.replyTo).toBe("visitor@example.com");
    expect(payload.from).not.toContain("visitor@example.com");
  });

  it("maps a generic Resend error to provider_error without throwing", async () => {
    mockSend.mockResolvedValue({ data: null, error: { name: "application_error", message: "boom" } });
    const result = await sendEnquiryMail(baseArgs);
    expect(result).toEqual({ ok: false, code: "provider_error" });
  });

  it("maps a Resend rate_limit_exceeded error to rate_limited", async () => {
    mockSend.mockResolvedValue({ data: null, error: { name: "rate_limit_exceeded", message: "slow down" } });
    const result = await sendEnquiryMail(baseArgs);
    expect(result).toEqual({ ok: false, code: "rate_limited" });
  });

  it("treats a missing message id as a provider error even without an explicit error", async () => {
    mockSend.mockResolvedValue({ data: null, error: null });
    const result = await sendEnquiryMail(baseArgs);
    expect(result).toEqual({ ok: false, code: "provider_error" });
  });

  it("returns provider_error if the SDK throws instead of resolving", async () => {
    mockSend.mockRejectedValue(new Error("network down"));
    const result = await sendEnquiryMail(baseArgs);
    expect(result).toEqual({ ok: false, code: "provider_error" });
  });
});
