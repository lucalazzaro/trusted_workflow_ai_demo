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

export function runInputCheck(input: RequestInput): InputCheckResult {
  const checks: InputCheckResult["checks"] = [];

  const requiredOk =
    input.justification.trim().length >= 10 && Number.isFinite(input.amount);

  checks.push({
    label: "Required fields present",
    result: requiredOk ? "OK" : "FAIL",
    note: requiredOk
      ? "Type, amount, and reason are provided."
      : "Missing or invalid core fields (amount / reason).",
  });

  const attachmentRequired = input.type === "Discount" || input.type === "Refund";
  const attachmentOk = !attachmentRequired || input.attachmentsProvided;

  checks.push({
    label: "Attachment included when needed",
    result: attachmentOk ? "OK" : "WARN",
    note: attachmentOk
      ? "Attachment policy satisfied."
      : "This request type usually needs a supporting document.",
  });

  const amountOk = input.amount > 0 && input.amount <= 5000;
  checks.push({
    label: "Amount looks reasonable",
    result: amountOk ? "OK" : "WARN",
    note: amountOk
      ? "Within typical thresholds."
      : "Outside typical thresholds; may need escalation.",
  });

  // Lightweight placeholders (demo):
  checks.push({
    label: "Duplicate request",
    result: "OK",
    note: "No similar requests found recently (demo assumption).",
  });

  checks.push({
    label: "Conflicting information",
    result: "OK",
    note: "No obvious conflicts detected (demo assumption).",
  });

  const hasFail = checks.some((c) => c.result === "FAIL");
  const hasWarn = checks.some((c) => c.result === "WARN");

  const status: InputCheckResult["status"] = hasFail ? "BLOCK" : hasWarn ? "FIX" : "PASS";
  return { status, checks };
}
