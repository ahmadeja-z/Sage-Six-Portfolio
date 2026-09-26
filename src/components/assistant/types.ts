export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  links?: { label: string; href: string }[];
  suggestions?: { label: string; value: string }[];
  showLead?: boolean;
  error?: boolean;
};

export type LeadForm = {
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

export const emptyLead: LeadForm = {
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
