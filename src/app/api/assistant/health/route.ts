import { NextResponse } from "next/server";
import { geminiConfigured, GEMINI_MODEL } from "@/lib/assistant/provider";
import { knowledgeBase } from "@/lib/assistant/knowledge";
import { CONTACT_TO_EMAIL } from "@/lib/mail";

// Non-sensitive health check. Never exposes keys, credentials or provider bodies.
export async function GET() {
  return NextResponse.json({
    ok: true,
    gemini: geminiConfigured() ? "configured" : "not_configured",
    model: GEMINI_MODEL,
    email: { configured: Boolean(process.env.SMTP_HOST), to: CONTACT_TO_EMAIL },
    knowledge: knowledgeBase.length > 0 ? "loaded" : "missing",
  });
}