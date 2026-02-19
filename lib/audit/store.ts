import { AuditEvent } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __auditStore: AuditEvent[] | undefined;
}

function getStore(): AuditEvent[] {
  if (!globalThis.__auditStore) globalThis.__auditStore = [];
  return globalThis.__auditStore;
}

export function appendEvent(event: AuditEvent) {
  getStore().push(event);
}

export function listEvents(): AuditEvent[] {
  // newest last → reads naturally
  return [...getStore()].sort((a, b) => a.ts.localeCompare(b.ts));
}

export function clearEvents() {
  globalThis.__auditStore = [];
}
