import { Resend } from "resend";

export const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "hello@sagesix.co.uk";

export type MailResult =
  | { ok: true; id: string }
  | { ok: false; code: "not_configured" | "provider_error" | "rate_limited"; error?: string };

const REQUIRED_ENV_VARS = ["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL"] as const;

function missingEnvVars(): string[] {
  return REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
}

let client: Resend | undefined;
function getClient(): Resend {
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

/**
 * Sends the enquiry notification to the Sage Six team via Resend.
 *
 * All configuration comes from server-side environment variables only —
 * RESEND_API_KEY is never read on the client, logged, or returned in a
 * response. The recipient is always CONTACT_TO_EMAIL, never the visitor's
 * address. Reply-To is set to the validated visitor email so a normal
 * "Reply" in the team's email client opens a conversation with them.
 */
export async function sendEnquiryMail({
  replyTo,
  subject,
  html,
  text,
  idempotencyKey,
  tags,
}: {
  replyTo: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  tags?: { name: string; value: string }[];
}): Promise<MailResult> {
  const missing = missingEnvVars();
  if (missing.length > 0) {
    // Log only which variables are missing — never their values.
    console.error(`[contact] Missing required environment variable(s): ${missing.join(", ")}`);
    return { ok: false, code: "not_configured" };
  }

  try {
    const { data, error } = await getClient().emails.send(
      {
        from: process.env.CONTACT_FROM_EMAIL!,
        to: [process.env.CONTACT_TO_EMAIL!],
        replyTo,
        subject,
        html,
        text,
        tags,
      },
      { idempotencyKey },
    );

    if (error) {
      // Safe summary only: Resend's error `name` is a fixed enum and
      // `message` is a provider-authored description — never the visitor's
      // message content or any secret.
      console.error(`[contact] Resend rejected the email: ${error.name} — ${error.message}`);
      return {
        ok: false,
        code: error.name === "rate_limit_exceeded" ? "rate_limited" : "provider_error",
      };
    }

    if (!data?.id) {
      console.error("[contact] Resend returned no message id despite no error.");
      return { ok: false, code: "provider_error" };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    console.error(
      `[contact] Unexpected error while sending enquiry email: ${err instanceof Error ? err.message : "unknown error"}`,
    );
    return { ok: false, code: "provider_error" };
  }
}
