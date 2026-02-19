export type RequestInput = {
  type: "Exception" | "Discount" | "Access" | "Refund";
  amount: number;
  justification: string;
  attachmentsProvided: boolean;
};

export type InputCheckResult = {
  status: "PASS" | "FIX" | "BLOCK";
  checks: { label: string; result: "OK" | "WARN" | "FAIL"; note: string }[];
};

export type RulesResult = {
  route: "Standard review" | "Escalation required" | "Request info first";
  notes: string[];
  triggeredRules?: string[]; // <— per le regole dimostrative
};

export type AISuggestion = {
  shown: boolean;
  suggestion: "Approve" | "Request info" | "Reject" | "Escalate";
  why: string[];
  confidence: "Low" | "Medium" | "High";
  watchOut: string[]; // <— UNA SOLA key: watchOut
};
