import { RulesResult } from "./rules";
import { RequestInput, InputCheckResult } from "./inputCheck";

export type HelperSuggestion = {
  shown: boolean;
  suggestion: "Approve" | "Request info" | "Reject" | "Escalate";
  why: string[];
  confidence: "Low" | "Medium" | "High";
  watchOut: string[];
};

export function helperSuggest(
  input: RequestInput,
  check: InputCheckResult,
  rules: RulesResult
): HelperSuggestion {
  if (check.status === "BLOCK") {
    return {
      shown: false,
      suggestion: "Request info",
      why: ["Not shown: the input is not usable yet."],
      confidence: "Low",
      watchOut: ["Fix the input first, then try again."],
    };
  }

  if (check.status === "FIX" || rules.route === "Request info first") {
    return {
      shown: true,
      suggestion: "Request info",
      why: [
        "Something important is missing.",
        "Asking for it keeps the process safe.",
        "After that, a person can decide with confidence.",
      ],
      confidence: "High",
      watchOut: [
        "This is a demo suggestion, not a real model.",
        "No external systems are connected here.",
      ],
    };
  }

  if (rules.route === "Escalation required") {
    return {
      shown: true,
      suggestion: "Escalate",
      why: [
        "The request has higher impact than usual.",
        "Escalation keeps decisions consistent.",
      ],
      confidence: "Medium",
      watchOut: [
        "Escalation thresholds vary by organization.",
        "This demo has no risk system behind it.",
      ],
    };
  }

  // Standard review
  return {
    shown: true,
    suggestion: input.amount <= 1500 ? "Approve" : "Request info",
    why: [
      "Input is complete.",
      "Nothing in the rules suggests escalation.",
    ],
    confidence: "Medium",
    watchOut: [
      "Hidden risk signals may exist outside this form.",
      "This demo does not use a trained model.",
    ],
  };
}
