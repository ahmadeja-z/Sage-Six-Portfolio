import nodemailer, { type Transporter } from "nodemailer";

export const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "hello@sagesix.co.uk";
export const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? '"Sage Six" <hello@sagesix.co.uk>';

export type MailResult =
  | { ok: true; id: string }
  | { ok: false; code: "not_configured" | "provider_error" | "rate_limited"; error?: string };

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  const host = process.env.SMTP_HOST || "smtppro.zoho.eu";
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === "false" ? false : true;
  const user = process.env.SMTP_USER || "hello@sagesix.co.uk";
  const pass = process.env.SMTP_PASS || "qa1hTbpngcr6";

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return transporter;
}

/**
 * Sends the enquiry notification to the Sage Six team (hello@sagesix.co.uk) via SMTP.
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
  idempotencyKey?: string;
  tags?: { name: string; value: string }[];
}): Promise<MailResult> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error("[contact] Missing required SMTP configuration");
    return { ok: false, code: "not_configured" };
  }

  try {
    const info = await getTransporter().sendMail({
      from: process.env.CONTACT_FROM_EMAIL ?? CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL ?? CONTACT_TO_EMAIL,
      replyTo,
      subject,
      html,
      text,
    });

    if (!info.messageId) {
      console.error("[contact] SMTP returned no message id.");
      return { ok: false, code: "provider_error" };
    }

    return { ok: true, id: info.messageId };
  } catch (err) {
    console.error(
      `[contact] Unexpected error while sending enquiry email: ${err instanceof Error ? err.message : "unknown error"}`,
    );
    return { ok: false, code: "provider_error", error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Sends an automated confirmation email to the client (lead.email) via SMTP.
 */
export async function sendClientConfirmationMail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<MailResult> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    return { ok: false, code: "not_configured" };
  }

  try {
    const info = await getTransporter().sendMail({
      from: process.env.CONTACT_FROM_EMAIL ?? CONTACT_FROM_EMAIL,
      to,
      replyTo: process.env.CONTACT_TO_EMAIL ?? CONTACT_TO_EMAIL,
      subject,
      html,
      text,
    });

    if (!info.messageId) {
      console.error("[contact-confirmation] SMTP returned no message id.");
      return { ok: false, code: "provider_error" };
    }

    return { ok: true, id: info.messageId };
  } catch (err) {
    console.error(
      `[contact-confirmation] Error sending client confirmation email: ${err instanceof Error ? err.message : "unknown error"}`,
    );
    return { ok: false, code: "provider_error", error: err instanceof Error ? err.message : String(err) };
  }
}
