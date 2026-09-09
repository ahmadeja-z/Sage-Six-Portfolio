import { validateAssistantRequest, parseAssistantResponse } from "@/lib/assistant/core";
import { generateAssistantReply } from "@/lib/assistant/provider";
import {
  LIMITS,
  type AssistantHistoryItem,
  type AssistantResult,
} from "@/lib/assistant/types";

/**
 * Server-side assistant orchestrator.
 * Validates the request, calls Gemini with bounded history, parses the
 * structured response and returns a safe, validated result.
 */
export async function runAssistant(
  body: unknown,
): Promise<AssistantResult> {
  const validation = validateAssistantRequest(body);
  if (!validation.ok) {
    return { ok: false, code: validation.code, message: validation.message };
  }

  const history: AssistantHistoryItem[] = validation.history.slice(-LIMITS.maxHistoryTurns);
  const requestId = `AS-${Date.now().toString(36).toUpperCase()}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LIMITS.providerTimeoutMs);

  let provider;
  try {
    provider = await generateAssistantReply(history, validation.message, controller.signal);
  } finally {
    clearTimeout(timer);
  }

  if (!provider.ok) {
    switch (provider.code) {
      case "not_configured":
        return {
          ok: false,
          code: "unavailable",
          message:
            "The Sage Six assistant is temporarily unavailable. You can still describe your project through our contact page or email hello@sagesix.co.uk.",
        };
      case "quota":
      case "provider_error":
      case "safety":
      case "model_unavailable":
      case "invalid_key":
        return {
          ok: false,
          code: "unavailable",
          message:
            "The Sage Six assistant is temporarily unavailable. You can still describe your project through our contact page or email hello@sagesix.co.uk.",
        };
    }
  }

  const parsed = parseAssistantResponse(provider.text);
  if (!parsed) {
    return {
      ok: false,
      code: "unavailable",
      message:
        "The Sage Six assistant is temporarily unavailable. You can still describe your project through our contact page or email hello@sagesix.co.uk.",
    };
  }

  return { ok: true, data: parsed, requestId };
}