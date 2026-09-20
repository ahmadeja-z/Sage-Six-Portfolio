"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Send, Sparkles, X, Eraser, ChevronDown } from "lucide-react";
import Link from "next/link";
import { enquiryTypes, enquiryMessageHelpers } from "@/lib/site";
import { services } from "@/data/content";
import { submitLead } from "@/lib/lead";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  links?: { label: string; href: string }[];
  suggestions?: { label: string; value: string }[];
  showLead?: boolean;
  error?: boolean;
};

type LeadForm = {
  name: string;
  email: string;
  company: string;
  enquiryType: string;
  service: string;
  message: string;
  websiteLink: string;
  timing: string;
  budget: string;
};

const emptyLead: LeadForm = {
  name: "",
  email: "",
  company: "",
  enquiryType: "new-project",
  service: "",
  message: "",
  websiteLink: "",
  timing: "",
  budget: "",
};

const serviceOptions = [
  { value: "", label: "Not sure yet" },
  ...services.map((s) => ({ value: s.anchor, label: s.title })),
];

const intro: ChatMessage = {
  role: "assistant",
  content:
    "Tell us what you're planning. I can explain our services, recommend relevant work and help you prepare a project enquiry.",
  suggestions: [
    { label: "What services do you provide?", value: "What services do you provide?" },
    { label: "Show me a relevant project.", value: "Show me a relevant project." },
    { label: "Help me plan an app.", value: "Help me plan an app." },
    { label: "I need technical support.", value: "I need technical support." },
    { label: "Start a project.", value: "Start a project." },
  ],
};

// Keeps the floating launcher/panel clear of the footer (links, legal text,
// the Companies House link) by parking them fully above it as soon as any
// part of the footer enters view, rather than tracking scroll continuously.
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
  const [messages, setMessages] = useState<ChatMessage[]>([intro]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reduce = useReducedMotion();
  const dockOffset = useFooterDockOffset();
  const dockTransition = reduce ? undefined : "bottom 0.35s cubic-bezier(0.22, 1, 0.36, 1)";

  useEffect(() => {
    setSessionId(makeSessionId());
  }, []);

  // Lets other pages open the assistant without prop-drilling — e.g. an
  // "Ask Sage Six" link on the Work page. Purely additive: nothing dispatches
  // this event today outside that one call site.
  useEffect(() => {
    const openFromEvent = () => setOpen(true);
    window.addEventListener("sagesix:open-assistant", openFromEvent);
    return () => window.removeEventListener("sagesix:open-assistant", openFromEvent);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 160;
    if (nearBottom) {
      list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
    }
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [open]);

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
        body: JSON.stringify({ message: trimmed, history, sessionId }),
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
    setMessages([intro]);
    setInput("");
    setSessionId(makeSessionId());
    setLead(emptyLead);
    setLeadStep("form");
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

  function LeadPanel() {
    const labelClass = "mb-1.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-mist";
    const inputClass =
      "w-full border border-line bg-ink-3 px-3 py-2.5 text-sm text-bone placeholder:text-mist focus:border-sage focus:outline-none";

    if (leadStep === "done") {
      return (
        <div className="mt-3 border border-sage/40 bg-ink-3 p-4">
          <p className="text-sm text-fog">
            Your enquiry has been sent. You can also email hello@sagesix.co.uk or{" "}
            <Link href="/contact" className="text-sage underline-offset-4 hover:underline">
              use the contact form
            </Link>
            .
          </p>
        </div>
      );
    }

    if (leadStep === "review") {
      return (
        <div className="mt-3 border border-line bg-ink-3 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage">Review your enquiry</p>
          <dl className="mt-3 space-y-1.5 text-sm">
            <Row k="Name" v={lead.name} />
            <Row k="Email" v={lead.email} />
            {lead.company && <Row k="Company" v={lead.company} />}
            <Row k="Enquiry type" v={enquiryTypes.find((t) => t.id === lead.enquiryType)?.label ?? lead.enquiryType} />
            <Row k="Service" v={serviceOptions.find((s) => s.value === lead.service)?.label ?? "Not sure yet"} />
            <Row k="Summary" v={lead.message} />
            {lead.websiteLink && <Row k="Website or app" v={lead.websiteLink} />}
            {lead.timing && <Row k="Timing" v={lead.timing} />}
            {lead.budget && <Row k="Budget" v={lead.budget} />}
          </dl>
          {leadError && <p className="mt-3 text-xs text-red-300">{leadError}</p>}
          <p className="mt-4 text-xs leading-relaxed text-mist">
            By submitting, you agree that Sage Six may use these details to respond to your enquiry.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={leadSubmitting}
              onClick={confirmLead}
              className="bg-bone px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-sage-bright disabled:opacity-60"
            >
              {leadSubmitting ? "Sending…" : "Confirm & send"}
            </button>
            <button
              type="button"
              onClick={() => setLeadStep("form")}
              className="border border-line px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fog transition-colors hover:border-sage hover:text-sage"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setLead(emptyLead);
                setLeadStep("form");
                setLeadError("");
              }}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist hover:text-fog"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-3 border border-line bg-ink-3 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage">Prepare an enquiry</p>
        <p className="mt-1.5 text-xs leading-relaxed text-mist">
          A short outline is enough to start. We&apos;ll review the details before anything is sent.
        </p>
        {leadError && <p className="mt-2 text-xs text-red-300">{leadError}</p>}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="lead-name" className={labelClass}>
              Full name *
            </label>
            <input id="lead-name" value={lead.name} onChange={(e) => setLeadField("name", e.target.value)} className={inputClass} placeholder="Jane Doe" />
          </div>
          <div>
            <label htmlFor="lead-email" className={labelClass}>
              Email *
            </label>
            <input id="lead-email" type="email" value={lead.email} onChange={(e) => setLeadField("email", e.target.value)} className={inputClass} placeholder="jane@company.com" />
          </div>
          <div>
            <label htmlFor="lead-company" className={labelClass}>
              Company (optional)
            </label>
            <input id="lead-company" value={lead.company} onChange={(e) => setLeadField("company", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="lead-service" className={labelClass}>
              Service of interest
            </label>
            <select id="lead-service" value={lead.service} onChange={(e) => setLeadField("service", e.target.value)} className={inputClass}>
              {serviceOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="lead-message" className={labelClass}>
              What do you need? *
            </label>
            <textarea
              id="lead-message"
              rows={3}
              value={lead.message}
              onChange={(e) => setLeadField("message", e.target.value)}
              className={cn(inputClass, "resize-none")}
              placeholder={enquiryMessageHelpers[lead.enquiryType] ?? enquiryMessageHelpers["new-project"]}
            />
          </div>
          <div>
            <label htmlFor="lead-link" className={labelClass}>
              Existing website or app (optional)
            </label>
            <input id="lead-link" value={lead.websiteLink} onChange={(e) => setLeadField("websiteLink", e.target.value)} className={inputClass} placeholder="https://…" />
          </div>
          <div>
            <label htmlFor="lead-timing" className={labelClass}>
              Timing (optional)
            </label>
            <input id="lead-timing" value={lead.timing} onChange={(e) => setLeadField("timing", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="lead-budget" className={labelClass}>
              Budget range (optional)
            </label>
            <input id="lead-budget" value={lead.budget} onChange={(e) => setLeadField("budget", e.target.value)} className={inputClass} placeholder="e.g. £10k–£25k" />
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-mist">
          Please leave passwords, API keys and other sensitive information out of this form.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setLeadError("");
              setLeadStep("review");
            }}
            className="bg-bone px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-sage-bright"
          >
            Review enquiry
          </button>
          <button
            type="button"
            onClick={() => {
              setLead(emptyLead);
              setLeadError("");
            }}
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist hover:text-fog"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }

  function Row({ k, v }: { k: string; v: string }) {
    return (
      <div className="flex gap-2">
        <dt className="w-28 shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-mist">{k}</dt>
        <dd className="text-fog">{v}</dd>
      </div>
    );
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          bottom: `calc(20px + env(safe-area-inset-bottom, 0px) + ${dockOffset}px)`,
          transition: dockTransition,
        }}
        className="fixed right-5 z-[95] flex h-13 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#17184a] via-[#273990] to-[#0f75bd] px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white shadow-[0_8px_30px_rgba(39,57,144,0.35)] border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(39,57,144,0.45)] active:scale-95"
        data-cursor="hover"
      >
        {open ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-cyan-300" />}
        <span className="hidden font-medium sm:inline">{open ? "Close" : "Ask Sage Six"}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ask Sage Six assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              bottom: `calc(90px + env(safe-area-inset-bottom, 0px) + ${dockOffset}px)`,
              transition: dockTransition,
            }}
            className="fixed right-5 z-[94] flex h-[min(620px,calc(100svh-7rem))] w-[min(430px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_25px_70px_-15px_rgba(15,23,42,0.3)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-[#0f172a] via-[#17184a] to-[#273990] px-5 py-4 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-cyan-300 backdrop-blur-md border border-white/15">
                  <Sparkles className="h-4 w-4" />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0f172a]" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold tracking-tight text-white">Ask Sage Six</p>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-medium tracking-wider text-emerald-300 border border-emerald-500/30 uppercase">
                      AI Online
                    </span>
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-200/70">Sage Six Digital Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={newConversation}
                  aria-label="New conversation"
                  title="New conversation"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Eraser className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close assistant"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-4 overflow-y-auto bg-slate-50/50 px-5 py-5"
              data-lenis-prevent
              aria-live="polite"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "max-w-[85%] px-4 py-3 text-[13px] leading-relaxed font-normal shadow-sm transition-all",
                    msg.role === "user"
                      ? "s6-user-bubble ml-auto bg-gradient-to-r from-[#17184a] via-[#273990] to-[#0f75bd] text-white rounded-[18px] rounded-tr-[4px]"
                      : "s6-bot-bubble border border-slate-200/80 bg-white text-slate-800 rounded-[18px] rounded-tl-[4px]",
                    msg.error && "border-red-400/50 bg-red-50/80 text-red-900",
                  )}
                >
                  <p className={msg.role === "user" ? "text-white" : "text-slate-800"}>{msg.content}</p>
                  {msg.links && msg.links.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {msg.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link href={link.href} className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0f75bd] hover:text-[#273990]">
                            {link.label}
                            <ChevronDown className="h-3 w-3 -rotate-90" strokeWidth={1.75} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {msg.showLead && <LeadPanel />}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => send(s.value)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#0f75bd] hover:bg-[#273990] hover:text-white hover:shadow-md active:translate-y-0"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {typing && (
                <div className="flex items-center gap-1.5 rounded-[18px] rounded-tl-[4px] border border-slate-200/80 bg-white px-4 py-3.5 w-fit shadow-xs" aria-label="Assistant is thinking">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-2 w-2 rounded-full bg-[#0f75bd]"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-slate-200/80 bg-white p-3.5"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 shadow-xs transition-all focus-within:border-[#0f75bd] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0f75bd]/20">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask a question..."
                  aria-label="Ask the assistant a question"
                  className="max-h-24 min-w-0 flex-1 resize-none bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!input.trim() || typing}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#273990] to-[#0f75bd] text-white shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-30 disabled:hover:scale-100"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 px-2 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">
                Enter to send · Shift+Enter for a new line
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}