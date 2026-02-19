import { RequestInput, InputCheckResult } from "./inputCheck";

export type RulesRoute =
  | "Standard review"
  | "Escalation required"
  | "Request info first";

export type RulesResult = {
  route: RulesRoute;
  notes: string[];
};

export function applyRules(input: RequestInput, check: InputCheckResult): RulesResult {
  if (check.status === "BLOCK") {
    return {
      route: "Request info first",
      notes: [
        "The input is not usable → fix it before moving on.",
        "Once fixed, re-run the input check.",
      ],
    };
  }

  if (check.status === "FIX") {
    return {
      route: "Request info first",
      notes: [
        "Something is missing → ask for it first.",
        "After that, continue safely.",
      ],
    };
  }

  if (input.amount > 2500 || input.type === "Exception") {
    return {
      route: "Escalation required",
      notes: [
        "Higher impact request → escalate.",
        "A helper can assist, but a person decides.",
      ],
    };
  }

  return {
    route: "Standard review",
    notes: [
      "Input looks good.",
      "Continue to a supported review, then a human decision.",
    ],
  };
}
