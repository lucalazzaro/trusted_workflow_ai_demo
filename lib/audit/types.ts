export type Actor = "system" | "human";

export type AuditEventType =
  | "REQUEST_CREATED"
  | "INPUT_CHECK_DONE"
  | "RULES_APPLIED"
  | "HELPER_SUGGESTED"
  | "HUMAN_DECISION";

export type AuditEvent = {
  id: string;
  ts: string; // ISO
  actor: Actor;
  type: AuditEventType;
  title: string;
  message: string;
  detail?: Record<string, unknown>;
};
