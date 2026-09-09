import { NextResponse } from "next/server";
import { runAssistant } from "@/lib/assistant";
import { LINK_ROUTES, type AssistantLinkId } from "@/lib/assistant/types";

const LINK_LABELS: Record<AssistantLinkId, string> = {
  services: "Explore services",
  work: "Explore our work",
  contact: "Contact Sage Six",
  "leicester-medical-society": "Leicester Medical Society case study",
  speezu: "Speezu case study",
  durafoam: "Durafoam case study",
};

const RATE_LIMIT = { burst: 6, windowMs: 60_000 };
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.burst) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ code: "invalid", message: "Unable to process request." }, { status: 400 });
  }

  const sessionId =
    body && typeof body === "object" && typeof (body as { sessionId?: unknown }).sessionId === "string"
      ? (body as { sessionId: string }).sessionId.slice(0, 64)
      : "";

  if (rateLimited(`${ip}:${sessionId}`)) {
    return NextResponse.json(
      { code: "rate_limited", message: "You've sent several messages in a short time. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  const result = await runAssistant(body);

  if (!result.ok) {
    switch (result.code) {
      case "empty":
      case "incomplete":
      case "invalid":
      case "oversized":
        return NextResponse.json({ code: result.code, message: result.message }, { status: 400 });
      case "rate_limited":
        return NextResponse.json({ code: "rate_limited", message: result.message }, { status: 429 });
      default:
        return NextResponse.json({ code: "unavailable", message: result.message }, { status: 503 });
    }
  }

  const links = (result.data.linkIds ?? []).map((id) => ({
    label: LINK_LABELS[id],
    href: LINK_ROUTES[id],
  }));

  return NextResponse.json(
    {
      message: result.data.message,
      suggestions: result.data.suggestedPrompts ?? [],
      links,
      leadAction: result.data.leadAction,
      requestId: result.requestId,
    },
    { status: 200 },
  );
}