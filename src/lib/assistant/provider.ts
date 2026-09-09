import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, INJECTION_GUARD } from "@/lib/assistant/system";
import { knowledgeBase } from "@/lib/assistant/knowledge";
import { LIMITS, type AssistantHistoryItem } from "@/lib/assistant/types";

export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";

export type ProviderResult =
  | { ok: true; text: string }
  | { ok: false; code: "not_configured" | "invalid_key" | "model_unavailable" | "quota" | "safety" | "provider_error"; error?: string };

export function geminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Calls Gemini with the verified knowledge base and bounded history.
 * Server-only — the key is read from the environment and never exposed.
 */
export async function generateAssistantReply(
  history: AssistantHistoryItem[],
  message: string,
  signal?: AbortSignal,
): Promise<ProviderResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, code: "not_configured" };
  }

  const ai = new GoogleGenAI({ apiKey });

  const contents = history.map((h) => ({
    role: h.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: h.content }],
  }));
  contents.push({ role: "user" as const, parts: [{ text: message }] });

  const systemInstruction = `${SYSTEM_INSTRUCTION}\n\n${INJECTION_GUARD}\n\n${knowledgeBase}\n\nYou must respond with a single valid JSON object only matching this exact schema:
{
  "message": string,
  "suggestedPrompts": [{"label": string, "value": string}],
  "linkIds": ["services" | "work" | "contact" | "leicester-medical-society" | "speezu" | "durafoam"],
  "leadAction": {"status": "none" | "collecting" | "review_required", "missingFields": [string]}
}
Always include the "message" field. Never include any markdown outside the JSON.`;

  const modelsToTry = [GEMINI_MODEL, "gemini-3.1-flash-lite", "gemini-3.5-flash-lite"].filter(
    (m, idx, arr) => arr.indexOf(m) === idx
  );

  let lastError: unknown;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.3,
          topP: 0.95,
          maxOutputTokens: LIMITS.maxResponseTokens,
          responseMimeType: "application/json",
        },
        ...(signal ? { httpOptions: { signal } } : {}),
      });

      const text = response.text ?? "";
      if (text.trim()) {
        return { ok: true, text };
      }
    } catch (err) {
      lastError = err;
      if (signal?.aborted) {
        break;
      }
    }
  }

  return mapProviderError(lastError ?? new Error("Empty provider response"));
}

function mapProviderError(err: unknown): ProviderResult {
  const message = err instanceof Error ? err.message : "Unknown provider error";
  const code =
    err && typeof err === "object" && "status" in err
      ? (err as { status: number }).status
      : undefined;

  // Detect request timeouts / aborts
  if (
    (err instanceof Error && err.name === "AbortError") ||
    /abort|timeout|timed out/i.test(message)
  ) {
    return { ok: false, code: "provider_error", error: `Request timed out: ${message}` };
  }
  if (code === 429 || /quota|rate limit|resource exhausted/i.test(message)) {
    return { ok: false, code: "quota", error: message };
  }
  if (code === 400 || code === 403) {
    return { ok: false, code: "invalid_key", error: message };
  }
  if (code === 404 || /model.*not found|not found/i.test(message)) {
    return { ok: false, code: "model_unavailable", error: message };
  }
  if (/safety|blocked/i.test(message)) {
    return { ok: false, code: "safety", error: message };
  }
  return { ok: false, code: "provider_error", error: message };
}