import type { LeadPayload } from "@/types";

export type LeadResultCode =
  | "ok"
  | "validation"
  | "rate_limited"
  | "not_configured"
  | "provider_error"
  | "timeout"
  | "network";

export type LeadResult = {
  ok: boolean;
  code: LeadResultCode;
  message: string;
  field?: string;
};

const TIMEOUT_MS = 20000;

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        page: typeof window !== "undefined" ? window.location.pathname : payload.page,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const data = (await res.json().catch(() => null)) as
      | { success?: boolean; code?: string; message?: string; field?: string; id?: string }
      | null;

    if (res.ok && data?.success) {
      return { ok: true, code: "ok", message: "Your enquiry has been submitted." };
    }

    switch (data?.code) {
      case "rate_limited":
        return {
          ok: false,
          code: "rate_limited",
          message: "Please wait a moment before trying again. You can also email hello@sagesix.co.uk.",
        };
      case "not_configured":
        return {
          ok: false,
          code: "not_configured",
          message: "We couldn't submit your enquiry. Please email hello@sagesix.co.uk with the details.",
        };
      case "validation":
        return {
          ok: false,
          code: "validation",
          message: data.message ?? "Please check the highlighted fields.",
          field: data.field,
        };
      default:
        return {
          ok: false,
          code: "provider_error",
          message:
            "We couldn't submit your enquiry. Your details are still here — please try again or email hello@sagesix.co.uk.",
        };
    }
  } catch (err) {
    clearTimeout(timer);
    const aborted = err instanceof DOMException && err.name === "AbortError";
    return {
      ok: false,
      code: aborted ? "timeout" : "network",
      message: aborted
        ? "We couldn't confirm whether your enquiry was submitted. Your details are still here. You can retry, or email us if you need help."
        : "We couldn't submit your enquiry. Your details are still here — please try again or email hello@sagesix.co.uk.",
    };
  }
}
