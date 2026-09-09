import {
  LIMITS,
  LINK_ROUTES,
  type AssistantHistoryItem,
  type AssistantLinkId,
  type AssistantResponse,
  type AssistantRole,
} from "@/lib/assistant/types";

const ALLOWED_ROLES = new Set<AssistantRole>(["user", "model"]);

export type ValidationResult =
  | { ok: true; message: string; history: AssistantHistoryItem[] }
  | { ok: false; code: "empty" | "incomplete" | "invalid" | "oversized"; message: string };

export function validateAssistantRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, code: "invalid", message: "Invalid request." };
  }
  const b = body as Record<string, unknown>;

  const rawMessage = b.message;
  if (typeof rawMessage !== "string") {
    return { ok: false, code: "empty", message: "Write a question or tell us briefly what you would like to build." };
  }

  const message = rawMessage.trim();
  if (message.length === 0) {
    return { ok: false, code: "empty", message: "Write a question or tell us briefly what you would like to build." };
  }
  if (message.length > LIMITS.maxMessageChars) {
    return { ok: false, code: "oversized", message: "That message is too long. Please shorten it and try again." };
  }
  // Incomplete input like "let" — ask for clarification rather than treating it as an API failure.
  if (message.length < 4) {
    return { ok: false, code: "incomplete", message: "It looks like your message may be incomplete. What would you like Sage Six to help you build?" };
  }

  const history: AssistantHistoryItem[] = [];
  if (b.history !== undefined) {
    if (!Array.isArray(b.history)) {
      return { ok: false, code: "invalid", message: "Invalid history." };
    }
    if (b.history.length > LIMITS.maxHistoryTurns) {
      return { ok: false, code: "oversized", message: "Conversation history is too long." };
    }
    let totalChars = 0;
    for (const item of b.history) {
      if (!item || typeof item !== "object") {
        return { ok: false, code: "invalid", message: "Invalid history item." };
      }
      const role = (item as { role?: unknown }).role;
      const content = (item as { content?: unknown }).content;
      if (typeof role !== "string" || !ALLOWED_ROLES.has(role as AssistantRole)) {
        return { ok: false, code: "invalid", message: "Unsupported history role." };
      }
      if (typeof content !== "string") {
        return { ok: false, code: "invalid", message: "Invalid history content." };
      }
      totalChars += content.length;
      history.push({ role: role as AssistantRole, content: content.slice(0, LIMITS.maxMessageChars) });
    }
    if (totalChars > LIMITS.maxHistoryChars) {
      return { ok: false, code: "oversized", message: "Conversation history is too long." };
    }
  }

  return { ok: true, message, history };
}

const LINK_IDS = new Set<AssistantLinkId>(Object.keys(LINK_ROUTES) as AssistantLinkId[]);

function sanitizeLinkIds(value: unknown): AssistantLinkId[] {
  if (!Array.isArray(value)) return [];
  const out: AssistantLinkId[] = [];
  for (const id of value) {
    if (typeof id === "string" && LINK_IDS.has(id as AssistantLinkId) && !out.includes(id as AssistantLinkId)) {
      out.push(id as AssistantLinkId);
    }
  }
  return out.slice(0, 3);
}

function sanitizePrompts(value: unknown): { label: string; value: string }[] {
  if (!Array.isArray(value)) return [];
  const out: { label: string; value: string }[] = [];
  for (const item of value) {
    if (item && typeof item === "object") {
      const label = (item as { label?: unknown }).label;
      const v = (item as { value?: unknown }).value;
      if (typeof label === "string" && typeof v === "string") {
        out.push({ label: label.slice(0, 80), value: v.slice(0, 160) });
      }
    }
    if (out.length >= 3) break;
  }
  return out;
}

/**
 * Parses and validates the model's structured JSON output.
 * The model may wrap JSON in prose or code fences, so we extract the first
 * balanced JSON object before parsing. One controlled repair attempt is allowed.
 */
export function parseAssistantResponse(raw: string): AssistantResponse | null {
  const attempt = (text: string): AssistantResponse | null => {
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const candidate = extractJsonObject(cleaned) ?? cleaned;

    let parsed: unknown;
    try {
      parsed = JSON.parse(candidate);
    } catch {
      return null;
    }
    if (!parsed || typeof parsed !== "object") return null;
    const p = parsed as Record<string, unknown>;
    if (typeof p.message !== "string" || p.message.trim().length === 0) return null;

    const leadAction = p.leadAction as { status?: unknown; missingFields?: unknown } | undefined;
    return {
      message: p.message.trim().slice(0, 2400),
      suggestedPrompts: sanitizePrompts(p.suggestedPrompts),
      linkIds: sanitizeLinkIds(p.linkIds),
      leadAction:
        leadAction && typeof leadAction === "object" && ["none", "collecting", "review_required"].includes(String(leadAction.status))
          ? {
              status: leadAction.status as "none" | "collecting" | "review_required",
              missingFields: Array.isArray(leadAction.missingFields)
                ? leadAction.missingFields.map((f) => String(f)).slice(0, 8)
                : undefined,
            }
          : undefined,
    };
  };

  const first = attempt(raw);
  if (first) return first;
  // One repair attempt: if the response is a single JSON object missing a
  // closing brace, close it and retry.
  const asString = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
  if (asString.startsWith("{") && !asString.endsWith("}")) {
    return attempt(`${asString}}`);
  }
  return null;
}

function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

export function linkIdToRoute(id: AssistantLinkId): string {
  return LINK_ROUTES[id];
}