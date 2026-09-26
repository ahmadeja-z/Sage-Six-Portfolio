import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEnquiryMail, sendClientConfirmationMail } from "@/lib/mail";

const mockSendMail = vi.fn();
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn().mockImplementation(() => ({
      sendMail: mockSendMail,
    })),
  },
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
    mockSendMail.mockReset();
    process.env = {
      ...ORIGINAL_ENV,
      SMTP_USER: "hello@sagesix.co.uk",
      SMTP_PASS: "qa1hTbpngcr6",
      CONTACT_FROM_EMAIL: '"Sage Six" <hello@sagesix.co.uk>',
      CONTACT_TO_EMAIL: "hello@sagesix.co.uk",
    };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("returns not_configured and never calls SMTP when SMTP_USER is missing", async () => {
    delete process.env.SMTP_USER;
    const result = await sendEnquiryMail(baseArgs);
    expect(result).toEqual({ ok: false, code: "not_configured" });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("returns the SMTP message id on success", async () => {
    mockSendMail.mockResolvedValue({ messageId: "smtp-msg-123" });
    const result = await sendEnquiryMail(baseArgs);
    expect(result).toEqual({ ok: true, id: "smtp-msg-123" });
  });

  it("sends from CONTACT_FROM_EMAIL and to CONTACT_TO_EMAIL with replyTo set to visitor's address", async () => {
    mockSendMail.mockResolvedValue({ messageId: "smtp-msg-123" });
    await sendEnquiryMail(baseArgs);
    const [payload] = mockSendMail.mock.calls[0];
    expect(payload.from).toBe('"Sage Six" <hello@sagesix.co.uk>');
    expect(payload.to).toBe("hello@sagesix.co.uk");
    expect(payload.replyTo).toBe("visitor@example.com");
  });

  it("returns provider_error if SMTP throws an error", async () => {
    mockSendMail.mockRejectedValue(new Error("network down"));
    const result = await sendEnquiryMail(baseArgs);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("provider_error");
    }
  });
});

describe("sendClientConfirmationMail", () => {
  beforeEach(() => {
    mockSendMail.mockReset();
    process.env = {
      ...ORIGINAL_ENV,
      SMTP_USER: "hello@sagesix.co.uk",
      SMTP_PASS: "qa1hTbpngcr6",
    };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("sends confirmation email to client email address", async () => {
    mockSendMail.mockResolvedValue({ messageId: "smtp-client-msg-456" });
    const result = await sendClientConfirmationMail({
      to: "visitor@example.com",
      subject: "Thank you for your enquiry",
      html: "<p>Confirmation</p>",
      text: "Confirmation",
    });

    expect(result).toEqual({ ok: true, id: "smtp-client-msg-456" });
    const [payload] = mockSendMail.mock.calls[0];
    expect(payload.to).toBe("visitor@example.com");
    expect(payload.replyTo).toBe("hello@sagesix.co.uk");
  });
});
