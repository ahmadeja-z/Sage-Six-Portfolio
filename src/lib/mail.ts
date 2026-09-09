import nodemailer from "nodemailer";

export const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "hello@sagesix.co.uk";

export type MailResult =
  | { ok: true; messageId?: string }
  | { ok: false; code: "not_configured" | "provider_error"; error?: string };

/**
 * Sends the enquiry notification to the Sage Six team.
 *
 * SMTP is configured through server-side environment variables only.
 * The recipient is always CONTACT_TO_EMAIL — never taken from the visitor.
 * Reply-To is set to the validated visitor email so a reply opens a
 * conversation with the submitter.
 */
export async function sendEnquiryMail({
  replyTo,
  subject,
  html,
  text,
}: {
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}): Promise<MailResult> {
  const host = process.env.SMTP_HOST;
  if (!host) {
    return { ok: false, code: "not_configured" };
  }

  try {
    const transport = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" }
        : undefined,
    });

    const info = await transport.sendMail({
      from: {
        name: "Sage Six Website",
        address: process.env.SMTP_FROM ?? CONTACT_TO_EMAIL,
      },
      to: CONTACT_TO_EMAIL,
      replyTo,
      subject,
      html,
      text,
    });

    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return {
      ok: false,
      code: "provider_error",
      error: err instanceof Error ? err.message : "Unknown mail error",
    };
  }
}