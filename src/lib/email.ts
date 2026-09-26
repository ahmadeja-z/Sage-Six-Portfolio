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

export function buildEnquirySubject(name: string, company: string, enquiryType: string): string {
  const typeLabel = labelOf(enquiryType, ENQUIRY_LABELS, "General Enquiry");
  const who = company ? `${name} (${company})` : name;
  return `New Sage Six Enquiry from ${who} — ${typeLabel}`;
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
  const sourcePage = lead.page || "Not recorded";

  const rows = [
    ["Full name", lead.name],
    ["Reply email", lead.email],
    ["Company or organisation", company],
    ["Enquiry type", typeLabel],
    ["Service of interest", serviceLabel],
    ["Website or app link", websiteLink],
    ["Budget", budget],
    ["Preferred timing", timing],
    ["Source page", sourcePage],
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
          <tr><td style="padding:0 28px 24px;border-top:1px solid #26262a;">
            <p style="margin:16px 0 0;color:#7c7c74;font-size:12px;">Reply directly to this email to respond to ${escapeHtml(
              lead.name,
            )}.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;

  const text = `SAGE SIX — NEW WEBSITE ENQUIRY\n\nEnquiry summary\n${textRows}\n\nFull message\n${lead.message}\n\nReply directly to this email to respond to ${lead.name}.`;

  return { html, text };
}

export function buildClientConfirmationSubject(reference: string): string {
  return `Thank you for your enquiry — Sage Six [Ref: ${reference}]`;
}

export function buildClientConfirmationEmail(lead: LeadPayload, submittedAt: string, reference: string) {
  const typeLabel = labelOf(lead.enquiryType, ENQUIRY_LABELS, "General Enquiry");
  const serviceLabel = labelOf(lead.service, SERVICE_LABELS, "Not specified");

  const rows = [
    ["Reference Number", reference],
    ["Enquiry Type", typeLabel],
    ["Service", serviceLabel],
    ...(lead.company ? [["Company", lead.company]] : []),
    ...(lead.budget ? [["Budget Range", lead.budget]] : []),
    ...(lead.timing ? [["Timing", lead.timing]] : []),
    ["Submitted On", submittedAt],
  ] as const;

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;vertical-align:top;color:#64748b;font-size:13px;white-space:nowrap;">${escapeHtml(
          label,
        )}:</td><td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const textRows = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;">
      <tr><td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(15,23,42,0.05);">
          <tr><td style="padding:32px 36px;background:linear-gradient(135deg, #0f172a 0%, #17184a 50%, #273990 100%);">
            <p style="margin:0;color:#24aae3;font-size:11px;letter-spacing:2.5px;font-weight:bold;text-transform:uppercase;">SAGE SIX</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:-0.02em;">We&apos;ve received your enquiry</h1>
          </td></tr>
          <tr><td style="padding:32px 36px;color:#334155;font-size:15px;line-height:1.6;">
            <p style="margin:0 0 16px;color:#0f172a;font-size:16px;font-weight:600;">Hello ${escapeHtml(lead.name)},</p>
            <p style="margin:0 0 16px;">Thank you for getting in touch with Sage Six. We have successfully received your project enquiry and our team is currently reviewing your details.</p>
            <p style="margin:0 0 24px;">We aim to respond to all enquiries within <strong>24 business hours</strong> with initial recommendations and next steps.</p>

            <div style="background:#f1f5f9;border-radius:10px;padding:20px 24px;margin-bottom:24px;border:1px solid #e2e8f0;">
              <p style="margin:0 0 12px;color:#0f172a;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Summary of Your Enquiry</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">${htmlRows}</table>
              <div style="margin-top:14px;padding-top:14px;border-top:1px solid #cbd5e1;">
                <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:bold;text-transform:uppercase;">Your Message:</p>
                <p style="margin:0;color:#1e293b;font-size:13px;line-height:1.5;">${paragraph(lead.message)}</p>
              </div>
            </div>

            <p style="margin:0 0 16px;">If you have any additional details or files to share in the meantime, feel free to reply directly to this email or reach us at <a href="mailto:hello@sagesix.co.uk" style="color:#0f75bd;text-decoration:none;font-weight:600;">hello@sagesix.co.uk</a>.</p>
            
            <p style="margin:24px 0 0;color:#0f172a;font-weight:600;">Warm regards,<br/><span style="color:#64748b;font-weight:normal;">The Sage Six Team</span></p>
          </td></tr>
          <tr><td style="padding:20px 36px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:12px;line-height:1.5;">
            <p style="margin:0 0 4px;"><strong>Sage Six Ltd</strong> · Registered in England and Wales · Company No. 17315871</p>
            <p style="margin:0;">Clear thinking. Thoughtful design. Software built to move you forward.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;

  const text = `Hello ${lead.name},\n\nThank you for getting in touch with Sage Six. We have successfully received your project enquiry (Reference: ${reference}) and our team is reviewing your details.\n\nWe aim to respond within 24 business hours.\n\nSummary of your enquiry:\n${textRows}\n\nYour message:\n${lead.message}\n\nReply directly to this email if you have any additional questions.\n\nWarm regards,\nThe Sage Six Team\nhello@sagesix.co.uk`;

  return { html, text };
}