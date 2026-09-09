import { describe, expect, it } from "vitest";
import { buildEnquiryEmail, buildEnquirySubject } from "@/lib/email";

describe("buildEnquirySubject", () => {
  it("uses the approved enquiry and service labels", () => {
    expect(buildEnquirySubject("new-project", "mobile-app-development")).toBe(
      "New Sage Six Enquiry — New project — Mobile App Development",
    );
  });

  it("falls back to general enquiry and not specified", () => {
    expect(buildEnquirySubject("bogus", "bogus")).toBe(
      "New Sage Six Enquiry — General Enquiry — Not specified",
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
});