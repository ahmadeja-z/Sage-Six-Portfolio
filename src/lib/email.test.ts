import { describe, expect, it } from "vitest";
import { buildEnquiryEmail, buildEnquirySubject } from "@/lib/email";

describe("buildEnquirySubject", () => {
  it("contains the visitor's name and enquiry type", () => {
    expect(buildEnquirySubject("Jane Doe", "", "new-project")).toBe(
      "New Sage Six Enquiry from Jane Doe — New project",
    );
  });

  it("prefers the company name alongside the visitor when provided", () => {
    expect(buildEnquirySubject("Jane Doe", "Acme Ltd", "existing-support")).toBe(
      "New Sage Six Enquiry from Jane Doe (Acme Ltd) — Existing product support",
    );
  });

  it("falls back to general enquiry for an unrecognised type", () => {
    expect(buildEnquirySubject("Jane Doe", "", "bogus")).toBe(
      "New Sage Six Enquiry from Jane Doe — General Enquiry",
    );
  });
});

describe("buildEnquiryEmail", () => {
  const lead = {
    name: "Jane <script>alert(1)</script>",
    email: "jane@example.com",
    company: "",
    enquiryType: "new-project",
    service: "",
    message: "We need a mobile app.\nFor food delivery.",
    websiteLink: "",
    budget: "",
    timing: "",
  };

  it("escapes HTML in user content and preserves paragraphs", () => {
    const { html } = buildEnquiryEmail(lead, "2026-09-10T09:00:00.000Z", "SS-TEST");
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("For food delivery.");
  });

  it("labels missing optional fields as Not provided", () => {
    const { html } = buildEnquiryEmail(lead, "2026-09-10T09:00:00.000Z");
    expect(html).toContain("Not provided");
  });

  it("includes the reference and timestamp", () => {
    const { html } = buildEnquiryEmail(lead, "2026-09-10T09:00:00.000Z", "SS-TEST");
    expect(html).toContain("SS-TEST");
    expect(html).toContain("2026-09-10T09:00:00.000Z");
  });

  it("produces a plain-text alternative containing the message", () => {
    const { text } = buildEnquiryEmail(lead, "2026-09-10T09:00:00.000Z");
    expect(text).toContain("We need a mobile app.");
    expect(text).toContain("For food delivery.");
  });

  it("keeps the recipient out of the visitor-controlled body", () => {
    const { text } = buildEnquiryEmail(lead, "2026-09-10T09:00:00.000Z");
    expect(text.toLowerCase()).not.toContain("to: hello@sagesix.co.uk");
  });

  it("includes the source page when provided, and a fallback otherwise", () => {
    const { text: withPage } = buildEnquiryEmail(
      { ...lead, page: "/contact" },
      "2026-09-10T09:00:00.000Z",
    );
    expect(withPage).toContain("Source page: /contact");

    const { text: withoutPage } = buildEnquiryEmail(lead, "2026-09-10T09:00:00.000Z");
    expect(withoutPage).toContain("Source page: Not recorded");
  });

  it("tells the reader they can reply directly to reach the visitor", () => {
    const { html, text } = buildEnquiryEmail(lead, "2026-09-10T09:00:00.000Z");
    expect(text).toContain("Reply directly to this email");
    expect(html).toContain("Reply directly to this email");
  });

  it("never renders undefined as literal text for an absent optional field", () => {
    const { html, text } = buildEnquiryEmail(lead, "2026-09-10T09:00:00.000Z");
    expect(html).not.toContain("undefined");
    expect(text).not.toContain("undefined");
  });
});