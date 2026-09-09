import type { LeadPayload } from "@/types";
import { enquiryTypes } from "@/lib/site";
import { services } from "@/data/content";

const SERVICE_LABELS: Record<string, string> = Object.fromEntries(
  services.map((s) => [s.anchor, s.title]),
);

const ENQUIRY_LABELS: Record<string, string> = Object.fromEntries(
  enquiryTypes.map((e) => [e.id, e.label]),
);

function labelOf(value: string, map: Record<string, string>, fallback: string): string {
  return map[value] ?? fallback;
}

export function buildEnquirySubject(enquiryType: string, service: string): string {
  const typeLabel = labelOf(enquiryType, ENQUIRY_LABELS, "General Enquiry");
  const serviceLabel = labelOf(service, SERVICE_LABELS, "Not specified");
  return `New Sage Six Enquiry — ${typeLabel} — ${serviceLabel}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraph(value: string): string {
  return escapeHtml(value)
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("<br/>");
}

export function buildEnquiryEmail(lead: LeadPayload, submittedAt: string, reference?: string) {
  const typeLabel = labelOf(lead.enquiryType, ENQUIRY_LABELS, "General Enquiry");
  const serviceLabel = labelOf(lead.service, SERVICE_LABELS, "Not specified");
  const company = lead.company || "Not provided";
  const websiteLink = lead.websiteLink || "Not provided";
  const budget = lead.budget || "Not provided";
  const timing = lead.timing || "Not provided";

  const rows = [
    ["Full name", lead.name],
    ["Reply email", lead.email],
    ["Company or organisation", company],
    ["Enquiry type", typeLabel],
    ["Service of interest", serviceLabel],
    ["Website or app link", websiteLink],
    ["Budget", budget],
    ["Preferred timing", timing],
    ["Submitted", submittedAt],
    ...(reference ? [["Reference", reference]] : []),
  ] as const;

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 16px 8px 0;vertical-align:top;color:#7c7c74;font-size:13px;white-space:nowrap;">${escapeHtml(
          label,
        )}</td><td style="padding:8px 0;color:#ecece5;font-size:14px;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const textRows = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#0a0a09;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a09;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#161615;border:1px solid #26262a;border-radius:12px;font-family:Arial,Helvetica,sans-serif;">
          <tr><td style="padding:24px 28px;border-bottom:1px solid #26262a;">
            <p style="margin:0;color:#a3b88a;font-size:12px;letter-spacing:2px;font-weight:bold;">SAGE SIX — NEW WEBSITE ENQUIRY</p>
          </td></tr>
          <tr><td style="padding:24px 28px;">
            <p style="margin:0 0 12px;color:#ecece5;font-size:16px;font-weight:bold;">Enquiry summary</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${htmlRows}</table>
          </td></tr>
          <tr><td style="padding:8px 28px 24px;">
            <p style="margin:0 0 8px;color:#ecece5;font-size:16px;font-weight:bold;">Full message</p>
            <p style="margin:0;color:#b6b6ac;font-size:14px;line-height:1.6;">${paragraph(lead.message)}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;

  const text = `SAGE SIX — NEW WEBSITE ENQUIRY\n\nEnquiry summary\n${textRows}\n\nFull message\n${lead.message}`;

  return { html, text };
}