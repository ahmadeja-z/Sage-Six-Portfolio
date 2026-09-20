"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useSyncExternalStore, type CSSProperties, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Send, Loader2, X, Eraser, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageContent } from "./MessageContent";
import { LeadPanel } from "./LeadPanel";
import type { ChatMessage, LeadForm } from "./types";

type Viewport = "mobile" | "tablet" | "desktop";

// Matches the useSyncExternalStore media-query pattern already used by
// PixelCursorTrail, so breakpoint state never requires a setState-in-effect.
function subscribeMedia(query: string) {
  return (notify: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", notify);
    return () => media.removeEventListener("change", notify);
  };
}

function useMediaQuery(query: string, serverFallback: boolean) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

function useAssistantViewport(): Viewport {
  const isMobile = useMediaQuery("(max-width: 639px)", false);
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);
  if (isMobile) return "mobile";
  if (isDesktop) return "desktop";
  return "tablet";
}

// SSR/first paint assumes the portal target is unavailable so there is no
// server/client markup mismatch; resolves to true as soon as the client mounts.
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const EMPTY_SUGGESTIONS = [
  "I need a mobile application",
  "I want to improve my website",
  "I need a custom business system",
];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function AssistantDialog({
  open,
  onClose,
  launcherRef,
  dockOffset,
  messages,
  typing,
  input,
  setInput,
  onSend,
  onNewConversation,
  lead,
  setLeadField,
  leadStep,
  leadError,
  leadSubmitting,
  onConfirmLead,
  onEditLead,
  onReviewLead,
  onClearLead,
}: {
  open: boolean;
  onClose: () => void;
  launcherRef: RefObject<HTMLButtonElement | null>;
  dockOffset: number;
  messages: ChatMessage[];
  typing: boolean;
  input: string;
  setInput: (value: string) => void;
  onSend: (text: string) => void;
  onNewConversation: () => void;
  lead: LeadForm;
  setLeadField: <K extends keyof LeadForm>(key: K, value: string) => void;
  leadStep: "form" | "review" | "done";
  leadError: string;
  leadSubmitting: boolean;
  onConfirmLead: () => void;
  onEditLead: () => void;
  onReviewLead: () => void;
  onClearLead: () => void;
}) {
  const mounted = useMounted();
  const viewport = useAssistantViewport();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const titleId = "sagesix-assistant-title";

  // Focus the composer on open and return focus to the launcher on close, so
  // keyboard/screen-reader users land inside the dialog and back out cleanly.
  useEffect(() => {
    if (!open) return;
    const launcher = launcherRef.current;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      launcher?.focus();
    };
  }, [open, launcherRef]);

  // Escape-to-close and a manual focus trap (no dialog primitive is installed
  // in this project) so Tab/Shift+Tab cannot leave the panel while it is open.
  useEffect(() => {
    if (!open) return;
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [open, onClose]);

  // Lock background scroll only for the mobile/tablet dialog — the desktop
  // floating panel leaves the page scrollable and interactive by design.
  useEffect(() => {
    if (!open || viewport === "desktop") return;
    const scrollY = window.scrollY;
    const { body } = document;
    const prev = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open, viewport]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 160;
    if (nearBottom) list.scrollTo({ top: list.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, typing, open, reduce]);

  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  if (!mounted) return null;

  const panelTransition = reduce ? { duration: 0.12 } : { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const };
  const panelVariants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 12, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.98 },
      };

  const panelClass =
    viewport === "mobile"
      ? "fixed inset-0 z-[151] flex h-[100dvh] min-h-0 w-full flex-col overflow-hidden bg-white"
      : viewport === "tablet"
        ? "relative flex h-[min(680px,calc(100dvh-4rem))] min-h-0 w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_-15px_rgba(15,23,42,0.35)]"
        : "fixed right-5 z-[151] flex h-[min(700px,calc(100dvh-7rem))] min-h-0 w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_-15px_rgba(15,23,42,0.35)]";

  const panelStyle: CSSProperties =
    viewport === "desktop"
      ? { bottom: `calc(90px + env(safe-area-inset-bottom, 0px) + ${dockOffset}px)` }
      : {};

  const panelElement = (
    <motion.div
      key="assistant-panel"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={panelTransition}
      style={panelStyle}
      className={panelClass}
    >
      {/* Header */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.05, duration: reduce ? 0.1 : 0.2 }}
        className="flex shrink-0 items-center justify-between gap-3 bg-gradient-to-r from-[#0f172a] via-[#17184a] to-[#273990] px-5 py-4 text-white"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10">
            <Image src="/images/sagesix-icon.svg" alt="" width={18} height={21} aria-hidden="true" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#24aae3] opacity-70" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#0f172a] bg-[#24aae3]" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p id={titleId} className="truncate font-display text-sm font-semibold tracking-tight text-white">
                Ask Sage Six
              </p>
              <span className="shrink-0 rounded-full border border-[#24aae3]/30 bg-[#24aae3]/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#a9e4f7]">
                AI Online
              </span>
            </div>
            <p className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-200/70">
              Sage Six Digital Assistant
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onNewConversation}
            aria-label="Clear conversation"
            title="Clear conversation"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <Eraser className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            title="Close assistant"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Conversation viewport — the only internally scrolling region */}
      <div
        ref={listRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50 px-5 py-5"
        data-lenis-prevent
      >
        <div aria-live="polite" className="sr-only">
          {typing ? "Sage Six assistant is typing" : messages.length > 0 ? messages[messages.length - 1]?.content : ""}
        </div>

        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center px-2 py-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image src="/images/sagesix-icon.svg" alt="" width={22} height={26} aria-hidden="true" />
            </div>
            <p className="font-display text-base font-semibold text-slate-900">Ask Sage Six</p>
            <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-slate-500">
              Tell us what you are planning, and we&apos;ll help you explore the right digital approach.
            </p>
            <div className="mt-5 flex w-full max-w-[320px] flex-col gap-2">
              {EMPTY_SUGGESTIONS.map((label) => (
                <motion.button
                  key={label}
                  type="button"
                  onClick={() => onSend(label)}
                  whileHover={reduce ? undefined : { y: -2 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-sm font-medium text-slate-700 shadow-xs transition-colors hover:border-[#0f75bd] hover:text-[#0f75bd]"
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0.12 : 0.22 }}
              className={cn(
                "max-w-[85%] rounded-[18px] border px-4 py-3 text-[13px] font-normal leading-relaxed shadow-sm",
                msg.role === "user"
                  ? "ml-auto rounded-tr-[4px] border-transparent bg-gradient-to-r from-[#17184a] via-[#273990] to-[#0f75bd] text-white"
                  : "rounded-tl-[4px] border-slate-200 bg-white text-slate-800",
                msg.error && "border-red-300 bg-red-50 text-red-900",
              )}
            >
              <MessageContent content={msg.content} />
              {msg.links && msg.links.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {msg.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0f75bd] hover:text-[#273990]"
                      >
                        {link.label}
                        <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {msg.showLead && (
                <LeadPanel
                  lead={lead}
                  setLeadField={setLeadField}
                  leadStep={leadStep}
                  leadError={leadError}
                  leadSubmitting={leadSubmitting}
                  onConfirm={onConfirmLead}
                  onEdit={onEditLead}
                  onReview={onReviewLead}
                  onClear={onClearLead}
                />
              )}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {msg.suggestions.map((s) => (
                    <motion.button
                      key={s.value}
                      type="button"
                      onClick={() => onSend(s.value)}
                      whileHover={reduce ? undefined : { y: -2 }}
                      whileTap={reduce ? undefined : { scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="min-h-11 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-xs transition-colors hover:border-[#0f75bd] hover:bg-[#273990] hover:text-white"
                    >
                      {s.label}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {typing && (
            <div
              className="flex w-fit items-center gap-1.5 rounded-[18px] rounded-tl-[4px] border border-slate-200 bg-white px-4 py-3.5 shadow-xs"
              aria-label="Assistant is typing"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-[#0f75bd]"
                  animate={reduce ? { opacity: [0.4, 1, 0.4] } : { opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Composer — final flex child, never positioned against the viewport */}
      <motion.form
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.08, duration: reduce ? 0.1 : 0.2 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSend(input);
        }}
        className="shrink-0 border-t border-slate-200 bg-white p-3.5"
        style={{ paddingBottom: "max(0.875rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 shadow-xs transition-colors focus-within:border-[#0f75bd] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0f75bd]/20">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoGrow(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend(input);
              }
            }}
            placeholder="Ask about your project…"
            aria-label="Ask the assistant about your project"
            className="max-h-[120px] min-w-0 flex-1 resize-none overflow-y-auto bg-transparent py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            aria-label={typing ? "Sending message" : "Send message"}
            disabled={!input.trim() || typing}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#273990] to-[#0f75bd] text-white shadow-md transition-transform hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
          >
            {typing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-2 px-2 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">
          Enter to send · Shift+Enter for a new line
        </p>
      </motion.form>
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>
      {open &&
        [
          viewport !== "desktop" && (
            <motion.div
              key="assistant-backdrop"
              aria-hidden="true"
              onClick={onClose}
              className="fixed inset-0 z-[150] bg-slate-900/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.1 : 0.2 }}
            />
          ),
          viewport === "tablet" ? (
            <div key="assistant-stage" className="fixed inset-0 z-[151] flex items-center justify-center p-4">
              {panelElement}
            </div>
          ) : (
            panelElement
          ),
        ].filter(Boolean)}
    </AnimatePresence>,
    document.body,
  );
}
