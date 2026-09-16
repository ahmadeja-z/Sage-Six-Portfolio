export type AssistantRole = "user" | "model";

export type AssistantHistoryItem = {
  role: AssistantRole;
  content: string;
};

export type AssistantRequest = {
  message: string;
  history?: AssistantHistoryItem[];
  sessionId?: string;
};

export type LeadAction = {
  status: "none" | "collecting" | "review_required";
  missingFields?: string[];
};

export type AssistantResponse = {
  message: string;
  suggestedPrompts?: { label: string; value: string }[];
  linkIds?: AssistantLinkId[];
  leadAction?: LeadAction;
};

export type AssistantLinkId =
  | "services"
  | "work"
  | "contact"
  | "leicester-medical-society"
  | "speezu"
  | "durafoam";

export type AssistantErrorCode =
  | "empty"
  | "incomplete"
  | "unavailable"
  | "rate_limited"
  | "offline"
  | "invalid"
  | "oversized"
  | "timeout"
  | "unsupported";

export type AssistantResult =
  | { ok: true; data: AssistantResponse; requestId: string }
  | { ok: false; code: AssistantErrorCode; message: string };

export const LIMITS = {
  maxMessageChars: 2000,
  maxHistoryTurns: 20,
  maxHistoryChars: 12000,
  maxResponseTokens: 512,
  providerTimeoutMs: 30000,
} as const;

export const LINK_ROUTES: Record<AssistantLinkId, string> = {
  services: "/expertise",
  work: "/work",
  contact: "/contact",
  "leicester-medical-society": "/work/leicester-medical-society",
  speezu: "/work/speezu",
  durafoam: "/work/durafoam-3d-foam-configurator-shopify",
};