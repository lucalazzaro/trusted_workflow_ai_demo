export type AuditActor = "system" | "human";

export type AuditEventType =
  | "REQUEST_CREATED"
  | "INPUT_CHECK_DONE"
  | "RULES_APPLIED"
  | "AI_SUGGESTED"
  | "HUMAN_DECISION"
  | "EXPORT_AUDIT";

export type AuditEvent = {
  id: string;
  ts: string;
  actor: AuditActor;
  type: AuditEventType;
  title: string;
  message: string;
  caseId: string;
  stepId?: number;
  severity?: "info" | "warn" | "risk";
};
