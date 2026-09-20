"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { submitLead } from "@/lib/lead";
import { AssistantDialog } from "./AssistantDialog";
import { emptyLead, type ChatMessage, type LeadForm } from "./types";

// Keeps the floating launcher clear of the footer (links, legal text, the
// Companies House link) by parking it fully above it as soon as any part of
// the footer enters view, rather than tracking scroll continuously.
function useFooterDockOffset(): number {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const gap = 24;
    const computeOffset = () => {
      const height = footer.getBoundingClientRect().height;
      const maxOffset = Math.max(window.innerHeight - 160, 120);
      return Math.min(height + gap, maxOffset);
    };
    const io = new IntersectionObserver(
      ([entry]) => setOffset(entry.isIntersecting ? computeOffset() : 0),
      { threshold: 0 },
    );
    io.observe(footer);
    const ro = new ResizeObserver(() => {
      setOffset((prev) => (prev > 0 ? computeOffset() : 0));
    });
    ro.observe(footer);
    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, []);
  return offset;
}

function makeSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

type ServerResponse = {
  message?: string;
  suggestions?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
  leadAction?: { status: string; missingFields?: string[] };
  requestId?: string;
};

export function AIProjectAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  // A ref (not state) because the id is only ever read inside the send/reset
  // handlers, and lazily generated there so the client-only crypto value is
  // never computed during server rendering.
  const sessionIdRef = useRef<string>("");
  const launcherRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const dockOffset = useFooterDockOffset();
  const dockTransition = reduce ? undefined : "bottom 0.35s cubic-bezier(0.22, 1, 0.36, 1)";

  // Lets other pages open the assistant without prop-drilling — e.g. an
  // "Ask Sage Six" link on the Work page. Purely additive: nothing dispatches
  // this event today outside that one call site.
  useEffect(() => {
    const openFromEvent = () => setOpen(true);
    window.addEventListener("sagesix:open-assistant", openFromEvent);
    return () => window.removeEventListener("sagesix:open-assistant", openFromEvent);
  }, []);

  function pushMessage(msg: ChatMessage) {
    setMessages((m) => [...m, msg]);
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    if (trimmed.length < 2) {
      pushMessage({
        role: "assistant",
        content: "It looks like your message may be incomplete. What would you like Sage Six to help you build?",
      });
      return;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      pushMessage({ role: "assistant", content: "You appear to be offline. Your message has not been sent.", error: true });
      return;
    }

    setInput("");
    pushMessage({ role: "user", content: trimmed });
    if (!sessionIdRef.current) sessionIdRef.current = makeSessionId();

    const history = messages
      .filter((m) => m.content)
      .slice(-10)
      .map((m) => ({ role: m.role === "user" ? ("user" as const) : ("model" as const), content: m.content.slice(0, 1500) }));

    setTyping(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history, sessionId: sessionIdRef.current }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      const data = (await res.json().catch(() => null)) as ServerResponse | null;

      if (!res.ok) {
        const code = (data as { code?: string } | null)?.code;
        const fallback = data?.message ?? "";
        if (code === "rate_limited") {
          pushMessage({ role: "assistant", content: "You&apos;ve sent several messages in a short time. Please wait a moment and try again.", error: true });
        } else if (code === "empty") {
          pushMessage({ role: "assistant", content: "Write a question or tell us briefly what you would like to build.", error: true });
        } else {
          pushMessage({
            role: "assistant",
            content:
              fallback ||
              "The Sage Six assistant is temporarily unavailable. You can still describe your project through our contact page or email hello@sagesix.co.uk.",
            error: true,
          });
        }
        return;
      }

      pushMessage({
        role: "assistant",
        content: data?.message ?? "I can help with that — could you share a little more about what you need?",
        links: data?.links ?? [],
        suggestions: data?.suggestions ?? [],
        showLead: data?.leadAction && data.leadAction.status !== "none" ? true : false,
      });
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      pushMessage({
        role: "assistant",
        content: aborted
          ? "The Sage Six assistant is temporarily unavailable. You can still describe your project through our contact page or email hello@sagesix.co.uk."
          : "You appear to be offline. Your message has not been sent.",
        error: true,
      });
    } finally {
      setTyping(false);
    }
  }

  function newConversation() {
    setMessages([]);
    setInput("");
    sessionIdRef.current = makeSessionId();
    setLead(emptyLead);
    setLeadStep("form");
    setLeadError("");
    setLeadSubmissionId(makeSessionId());
  }

  // --- Lead flow ---
  const [lead, setLead] = useState<LeadForm>(emptyLead);
  const [leadStep, setLeadStep] = useState<"form" | "review" | "done">("form");
  const [leadError, setLeadError] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  // Reused across retries of the same enquiry so the server can de-duplicate
  // via an idempotency key; a fresh id is generated once it actually sends.
  const [leadSubmissionId, setLeadSubmissionId] = useState(() => makeSessionId());

  function setLeadField<K extends keyof LeadForm>(key: K, value: string) {
    setLead((l) => ({ ...l, [key]: value }));
  }

  function validateLead(): string {
    if (lead.name.trim().length < 2) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return "Please enter a valid email address.";
    if (lead.message.trim().length < 10) return "Please add a short description of what you need.";
    return "";
  }

  async function confirmLead() {
    const error = validateLead();
    if (error) {
      setLeadError(error);
      return;
    }
    setLeadSubmitting(true);
    const result = await submitLead({
      name: lead.name.trim(),
      email: lead.email.trim().toLowerCase(),
      company: lead.company.trim(),
      enquiryType: lead.enquiryType,
      service: lead.service,
      message: lead.message.trim(),
      websiteLink: lead.websiteLink.trim(),
      timing: lead.timing.trim(),
      budget: lead.budget.trim(),
      submissionId: leadSubmissionId,
    });
    setLeadSubmitting(false);
    if (result.ok) {
      setLeadStep("done");
      setLeadSubmissionId(makeSessionId());
      pushMessage({
        role: "assistant",
        content: "Thank you — your enquiry has been submitted. We'll review the details and respond using the email address you provided.",
      });
    } else {
      setLeadError(
        result.message ||
          "We couldn't submit your enquiry just now. Your details are still here, so you can try again or email hello@sagesix.co.uk.",
      );
    }
  }

  function reviewLead() {
    setLeadError("");
    setLeadStep("review");
  }

  function clearLead() {
    setLead(emptyLead);
    setLeadError("");
    setLeadStep("form");
  }

  return (
    <>
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: open ? 0 : 1, scale: 1 }}
        transition={{ delay: open ? 0 : 1.6, duration: open ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          bottom: `calc(20px + env(safe-area-inset-bottom, 0px) + ${dockOffset}px)`,
          transition: dockTransition,
          pointerEvents: open ? "none" : "auto",
        }}
        className="fixed right-5 z-[95] flex h-13 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#17184a] via-[#273990] to-[#0f75bd] px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white shadow-[0_8px_30px_rgba(39,57,144,0.35)] border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(39,57,144,0.45)] active:scale-95"
        data-cursor="hover"
      >
        <Sparkles className="h-4 w-4 text-cyan-300" />
        <span className="hidden font-medium sm:inline">Ask Sage Six</span>
      </motion.button>

      <AssistantDialog
        open={open}
        onClose={() => setOpen(false)}
        launcherRef={launcherRef}
        dockOffset={dockOffset}
        messages={messages}
        typing={typing}
        input={input}
        setInput={setInput}
        onSend={send}
        onNewConversation={newConversation}
        lead={lead}
        setLeadField={setLeadField}
        leadStep={leadStep}
        leadError={leadError}
        leadSubmitting={leadSubmitting}
        onConfirmLead={confirmLead}
        onEditLead={() => setLeadStep("form")}
        onReviewLead={reviewLead}
        onClearLead={clearLead}
      />
    </>
  );
}
