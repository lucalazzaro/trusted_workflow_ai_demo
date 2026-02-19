"use client";

import React, { useMemo, useState } from "react";
import { Stepper } from "@/components/stepper";

type DemoState = {
  request: {
    type: "Exception" | "Discount" | "Access" | "Refund";
    amount: number;
    justification: string;
    attachmentsProvided: boolean;
  };
  inputCheck: {
    status: "PASS" | "FIX" | "BLOCK";
    checks: { label: string; result: "OK" | "WARN" | "FAIL"; note: string }[];
  };
  rules: {
    route: "Standard review" | "Escalation required" | "Request info first";
    notes: string[];
  };
  ai: {
    shown: boolean;
    suggestion: "Approve" | "Request info" | "Reject" | "Escalate";
    why: string[];
    confidence: "Low" | "Medium" | "High";
    watchOut: string[];
  };
  decision: {
    action: "Approve" | "Request info" | "Reject" | "Escalate" | null;
    reason: string;
  };
};

type AuditEvent = {
  id: string;
  ts: string;
  actor: "system" | "human";
  type: string;
  title: string;
  message: string;
};

const STEPS = [
  { id: 1, title: "Request intake", subtitle: "Capture the essentials" },
  { id: 2, title: "Intake quality gate", subtitle: "Check completeness & consistency" },
  { id: 3, title: "Policy & routing", subtitle: "Choose the safe route" },
  { id: 4, title: "AI suggestion (bounded)", subtitle: "Support, not autonomy" },
  { id: 5, title: "Human decision", subtitle: "Approve / reject with a reason" },
  { id: 6, title: "Audit log", subtitle: "What happened, who did it, when" },
] as const;

type SectionTone = {
  ring: string;
  border: string;
  bg: string;
  title: string;
  chip: string;
};

function toneFor(stepId: number): SectionTone {
  switch (stepId) {
    case 2:
      return {
        ring: "ring-sky-200",
        border: "border-sky-200",
        bg: "bg-sky-50",
        title: "text-sky-950",
        chip: "bg-sky-100 text-sky-900 border-sky-200",
      };
    case 3:
      return {
        ring: "ring-indigo-200",
        border: "border-indigo-200",
        bg: "bg-indigo-50",
        title: "text-indigo-950",
        chip: "bg-indigo-100 text-indigo-900 border-indigo-200",
      };
    case 4:
      return {
        ring: "ring-violet-200",
        border: "border-violet-200",
        bg: "bg-violet-50",
        title: "text-violet-950",
        chip: "bg-violet-100 text-violet-900 border-violet-200",
      };
    case 5:
      return {
        ring: "ring-emerald-200",
        border: "border-emerald-200",
        bg: "bg-emerald-50",
        title: "text-emerald-950",
        chip: "bg-emerald-100 text-emerald-900 border-emerald-200",
      };
    case 6:
      return {
        ring: "ring-amber-200",
        border: "border-amber-200",
        bg: "bg-amber-50",
        title: "text-amber-950",
        chip: "bg-amber-100 text-amber-900 border-amber-200",
      };
    default:
      return {
        ring: "ring-slate-200",
        border: "border-slate-200",
        bg: "bg-slate-50",
        title: "text-slate-950",
        chip: "bg-slate-100 text-slate-900 border-slate-200",
      };
  }
}

function badgeClass(status: "PASS" | "FIX" | "BLOCK") {
  if (status === "PASS") return "bg-emerald-50 text-emerald-800 border-emerald-200";
  if (status === "FIX") return "bg-amber-50 text-amber-800 border-amber-200";
  return "bg-rose-50 text-rose-800 border-rose-200";
}

function smallPill(result: "OK" | "WARN" | "FAIL") {
  if (result === "OK") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (result === "WARN") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-rose-200 bg-rose-50 text-rose-800";
}

function stepNarration(stepId: number) {
  switch (stepId) {
    case 1:
      return [
        "Scenario: an employee submits a request that needs approval.",
        "Think: discount approvals, access requests, refunds, policy exceptions, procurement.",
        "This step captures only what’s needed to route the case safely.",
        "If the input is unclear, downstream decisions become risky.",
        "Goal: safe and explainable decisions, not speed.",
      ];
    case 2:
      return [
        "This is a quality gate for the request data (intake).",
        "PASS means the input is complete enough to proceed.",
        "FIX means something is missing → pause and ask for it.",
        "BLOCK means the input is invalid → it must be corrected first.",
        "This prevents bad data from reaching approvals.",
      ];
    case 3:
      return [
        "Rules decide what the workflow can do next.",
        "Some cases must escalate (high impact, exceptions, risk flags).",
        "Some cases must request more info before any approval.",
        "Rules keep decisions consistent across teams and time.",
        "Simple rules are easier to audit and explain.",
      ];
    case 4:
      return [
        "AI provides a bounded suggestion (it cannot finalize the case).",
        "It explains the recommendation and states its limits.",
        "If the input is not usable, the AI is withheld.",
        "This reduces over-trust and supports responsible adoption.",
      ];
    case 5:
      return [
        "A human chooses the action: approve, reject, request info, escalate.",
        "A short reason is required for accountability.",
        "This is the control point: AI cannot bypass it.",
        "The reason becomes part of the audit log.",
      ];
    case 6:
      return [
        "This is the workflow history.",
        "It records what happened, who did it (system vs human), and when.",
        "This supports audits, reviews, and improvement over time.",
        "In real systems, the log is append-only and exportable.",
      ];
    default:
      return [];
  }
}

export default function DemoPage() {
  const [current, setCurrent] = useState<number>(1);
  const [opened, setOpened] = useState<number>(1);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [caseId, setCaseId] = useState<string>(() => crypto.randomUUID());

  const [state, setState] = useState<DemoState>({
    request: {
      type: "Discount",
      amount: 1200,
      justification: "Customer retention request for a long-term account.",
      attachmentsProvided: false,
    },
    inputCheck: {
      status: "FIX",
      checks: [
        { label: "Required fields present", result: "OK", note: "Type, amount, and reason are provided." },
        { label: "Attachment included when needed", result: "WARN", note: "This request type usually needs a supporting document." },
        { label: "Amount looks reasonable", result: "OK", note: "Within typical thresholds for this kind of request." },
        { label: "Duplicate request", result: "OK", note: "No similar requests found recently (demo assumption)." },
        { label: "Conflicting information", result: "OK", note: "No obvious conflicts detected (demo assumption)." },
      ],
    },
    rules: {
      route: "Request info first",
      notes: ["A key document is missing → ask for it first.", "Once complete, continue safely."],
    },
    ai: {
      shown: true,
      suggestion: "Request info",
      why: [
        "The request makes sense, but evidence is missing.",
        "Asking for the document keeps the process compliant.",
        "After that, a human can decide with confidence.",
      ],
      confidence: "High",
      watchOut: [
        "This demo does not connect to external systems.",
        "The suggestion is supportive — it is not a final decision.",
      ],
    },
    decision: { action: null, reason: "" },
  });

  const canContinue = useMemo(() => opened < 6, [opened]);
  const currentTone = toneFor(current);
  const narration = stepNarration(current);

  async function auditClear() {
    await fetch("/api/audit", { method: "DELETE" });
    setEvents([]);
  }

  async function auditAdd(event: Omit<AuditEvent, "id" | "ts">) {
    const payload: AuditEvent = {
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      ...event,
    };

    await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await fetch("/api/audit");
    const data = (await res.json()) as { events: AuditEvent[] };
    setEvents(data.events);
  }

  async function postJSON<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`POST ${url} failed: ${res.status} ${text}`);
    }

    return (await res.json()) as T;
  }

  async function next() {
    if (opened >= 6) return;

    // Snapshot to avoid stale state during async calls
    const input = { ...state.request };

    const nextStep = Math.min(6, opened + 1);
    setOpened(nextStep);
    setCurrent(nextStep);

    const stepTitle = STEPS.find((s) => s.id === nextStep)?.title ?? `Step ${nextStep}`;
    await auditAdd({
      actor: "system",
      type: "STEP_PROGRESS",
      title: "Progressed in workflow",
      message: `Moved to: ${stepTitle}.`,
    });

    try {
      if (nextStep === 2) {
        const check = await postJSON<DemoState["inputCheck"]>("/api/check", input);
        setState((p) => ({ ...p, inputCheck: check }));

        await auditAdd({
          actor: "system",
          type: "INPUT_CHECK_DONE",
          title: "Intake quality check",
          message: `Result: ${check.status}.`,
        });
        return;
      }

      if (nextStep === 3) {
        const check = await postJSON<DemoState["inputCheck"]>("/api/check", input);
        const rules = await postJSON<DemoState["rules"]>("/api/rules", { input, check });
        setState((p) => ({ ...p, inputCheck: check, rules }));

        await auditAdd({
          actor: "system",
          type: "RULES_APPLIED",
          title: "Policy & routing",
          message: `Route selected: ${rules.route}.`,
        });
        return;
      }

      if (nextStep === 4) {
        const check = await postJSON<DemoState["inputCheck"]>("/api/check", input);
        const rules = await postJSON<DemoState["rules"]>("/api/rules", { input, check });
        const ai = await postJSON<DemoState["ai"]>("/api/helper", { input, check, rules });

        setState((p) => ({ ...p, inputCheck: check, rules, ai }));

        await auditAdd({
          actor: "system",
          type: "AI_SUGGESTION",
          title: "AI suggestion",
          message: ai.shown
            ? `Suggested: ${ai.suggestion} (confidence: ${ai.confidence}).`
            : "Withheld: input is not usable yet.",
        });
        return;
      }

      if (nextStep === 5) {
        await auditAdd({
          actor: "system",
          type: "HUMAN_DECISION_REQUIRED",
          title: "Human decision required",
          message: "Select an action and record a short reason.",
        });
        return;
      }

      if (nextStep === 6) {
        const res = await fetch("/api/audit");
        const data = (await res.json()) as { events: AuditEvent[] };
        setEvents(data.events);
        return;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      await auditAdd({
        actor: "system",
        type: "ERROR",
        title: "Workflow error",
        message: msg,
      });
    }
  }

  function reset() {
  const newId = crypto.randomUUID();
  setCaseId(newId);
  setCurrent(1);
  setOpened(1);
  setState((prev) => ({ ...prev, decision: { action: null, reason: "" } }));
  auditClear();

  auditAdd({
    actor: "system",
    type: "REQUEST_CREATED",
    title: "Request created",
    message: `Case created for ${state.request.type} request (amount: $${state.request.amount}).`,
  });
}


  function toggleMessyInput() {
    const nextWillBeProvided = !state.request.attachmentsProvided;

    setState((prev) => {
      const willBeProvided = !prev.request.attachmentsProvided;

      const status: DemoState["inputCheck"]["status"] = willBeProvided ? "PASS" : "FIX";

      const checks: DemoState["inputCheck"]["checks"] = prev.inputCheck.checks.map((c) => {
        if (c.label !== "Attachment included when needed") return c;
        return {
          ...c,
          result: (willBeProvided ? "OK" : "WARN") as "OK" | "WARN" | "FAIL",
          note: willBeProvided
            ? "Attachment is included. The request is complete."
            : "This request type usually needs a supporting document.",
        };
      });

      const route: DemoState["rules"]["route"] = willBeProvided ? "Standard review" : "Request info first";

      const notes = willBeProvided
        ? ["The request is complete → move forward.", "If something looks risky later, escalate."]
        : ["A key document is missing → ask for it first.", "Once complete, continue safely."];

      const suggestion: DemoState["ai"]["suggestion"] = willBeProvided ? "Approve" : "Request info";

      const why = willBeProvided
        ? ["The request is complete.", "No quality issues were found in intake.", "A human can approve and record why."]
        : [
            "The request makes sense, but evidence is missing.",
            "Asking for the document keeps the process compliant.",
            "After that, a human can decide with confidence.",
          ];

      const confidence: DemoState["ai"]["confidence"] = willBeProvided ? "Medium" : "High";

      return {
        ...prev,
        request: { ...prev.request, attachmentsProvided: willBeProvided },
        inputCheck: { ...prev.inputCheck, status, checks },
        rules: { ...prev.rules, route, notes },
        ai: { ...prev.ai, suggestion, why, confidence },
      };
    });

    auditAdd({
      actor: "system",
      type: "INTAKE_UPDATED",
      title: "Intake updated",
      message: `Attachment is now ${nextWillBeProvided ? "included" : "missing"}.`,
    });
  }

  function setDecision(action: DemoState["decision"]["action"]) {
    setState((p) => ({ ...p, decision: { ...p.decision, action } }));
    auditAdd({
      actor: "human",
      type: "DECISION_SELECTED",
      title: "Decision selected",
      message: `Selected: ${action}.`,
    });
  }

  function setDecisionReason(reason: string) {
    setState((p) => ({ ...p, decision: { ...p.decision, reason } }));
  }

  function recordDecision() {
    const action = state.decision.action;
    const reason = state.decision.reason.trim();
    if (!action) return;

    auditAdd({
      actor: "human",
      type: "DECISION_RECORDED",
      title: "Decision recorded",
      message: reason ? `${action}. Reason: ${reason}` : `${action}. (Reason missing)`,
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Trusted Workflow AI
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-slate-600">
                Demo scenario: a request needs approval (discount, access, refund, policy exception).
                The system checks intake quality, applies routing rules, shows a bounded AI suggestion,
                and requires a human decision — with a full audit log.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  AI: suggestion only
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  Human: required decision
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  Log: always on
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMessyInput}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Messy intake: {state.request.attachmentsProvided ? "OFF" : "ON"}
              </button>
              <button
                onClick={reset}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-12">
        <aside className="md:col-span-4">
          {/* Sticky sidebar wrapper */}
          <div className="md:sticky md:top-6 space-y-4">
            <Stepper steps={[...STEPS]} current={current} onSelect={(id: number) => setCurrent(id)} />

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-900">Explain this step</div>
                <span className={["rounded-full border px-2 py-0.5 text-xs font-semibold", currentTone.chip].join(" ")}>
                  Step {current}
                </span>
              </div>

              <div className="mt-2 space-y-2 text-sm text-slate-700">
                {narration.map((line, i) => (
                  <p key={i} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Actors</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  system
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  human
                </span>
              </div>
            </div>
          </div>
        </aside>

        <section className="relative md:col-span-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Current step
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-900">
                  {STEPS.find((s) => s.id === current)?.title}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={["rounded-full border px-3 py-1 text-xs font-semibold", currentTone.chip].join(" ")}>
                  Progress: {opened}/6
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <Panel title="1) Request intake" subtitle="Capture just what’s needed to route the case." visible={opened >= 1} tone={toneFor(1)}>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InfoField label="Request type" value={state.request.type} />
                  <InfoField label="Amount / impact" value={`$${state.request.amount}`} />
                  <InfoField label="Attachment" value={state.request.attachmentsProvided ? "Included" : "Missing"} />
                  <InfoField label="Reason" value={state.request.justification} />
                </div>
              </Panel>

              <Panel
                title="2) Intake quality gate"
                subtitle="Quick checks before the case can move forward."
                visible={opened >= 2}
                tone={toneFor(2)}
                rightBadge={
                  <span className={["inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", badgeClass(state.inputCheck.status)].join(" ")}>
                    {state.inputCheck.status}
                  </span>
                }
              >
                <div className="space-y-2">
                  {state.inputCheck.checks.map((c) => (
                    <div key={c.label} className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-slate-900">{c.label}</div>
                        <span className={["inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold", smallPill(c.result)].join(" ")}>
                          {c.result}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">{c.note}</div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="3) Policy & routing" subtitle="Rules decide the safest next step." visible={opened >= 3} tone={toneFor(3)}>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Route</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{state.rules.route}</div>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {state.rules.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </Panel>

              <Panel title="4) AI suggestion (bounded)" subtitle="AI assists with a recommendation — it does not decide." visible={opened >= 4} tone={toneFor(4)}>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Suggested action</div>
                      <div className="mt-1 text-base font-semibold text-slate-900">{state.ai.shown ? state.ai.suggestion : "Withheld"}</div>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Confidence: {state.ai.confidence}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {state.ai.why.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Limits</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {state.ai.watchOut.map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Panel>

              <Panel title="5) Human decision" subtitle="Choose an action and record a short reason." visible={opened >= 5} tone={toneFor(5)}>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <DecisionButton label="Approve" active={state.decision.action === "Approve"} onClick={() => setDecision("Approve")} />
                  <DecisionButton label="Request info" active={state.decision.action === "Request info"} onClick={() => setDecision("Request info")} />
                  <DecisionButton label="Reject" active={state.decision.action === "Reject"} onClick={() => setDecision("Reject")} />
                  <DecisionButton label="Escalate" active={state.decision.action === "Escalate"} onClick={() => setDecision("Escalate")} />
                </div>

                <div className="mt-3">
                  <label className="text-sm font-semibold text-slate-900">Reason (required)</label>
                  <textarea
                    value={state.decision.reason}
                    onChange={(e) => setDecisionReason(e.target.value)}
                    rows={3}
                    placeholder="Example: Missing attachment — requesting the document before approval."
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="text-xs text-slate-600">Tip: click “Record decision” to add it to the audit log.</div>
                  <button
                    type="button"
                    onClick={recordDecision}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Record decision
                  </button>
                </div>
              </Panel>

              <Panel title="6) Audit log" subtitle="Timestamped history (system + human actions)." visible={opened >= 6} tone={toneFor(6)}>
                <div className="space-y-2">
                  {events.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                      No events yet. Click “Next” to progress and record the workflow.
                    </div>
                  ) : (
                    events.map((e) => (
                      <div key={e.id} className="rounded-lg border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-900">{e.title}</div>
                          <div className="text-xs font-semibold text-slate-500">{new Date(e.ts).toLocaleString()}</div>
                        </div>
                        <div className="mt-1 text-sm text-slate-700">{e.message}</div>
                        <div className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600">
                          {e.actor}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Panel>
            </div>
          </div>

          <div className="pointer-events-none sticky bottom-4 mt-6 flex justify-end">
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                onClick={next}
                disabled={!canContinue}
                className={[
                  "rounded-lg px-4 py-3 text-sm font-semibold shadow-sm",
                  canContinue ? "bg-slate-900 text-white hover:bg-slate-800" : "cursor-not-allowed bg-slate-100 text-slate-400",
                ].join(" ")}
              >
                Next
              </button>
            </div>
          </div>

          <footer className="mt-4 text-xs text-slate-500">
            Focus: controlled workflow design (quality gates, routing, human decision, audit log).
          </footer>
        </section>
      </main>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  visible,
  rightBadge,
  tone,
  children,
}: {
  title: string;
  subtitle: string;
  visible: boolean;
  rightBadge?: React.ReactNode;
  tone: SectionTone;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-xl border p-4 transition",
        visible ? `${tone.border} ${tone.bg} ring-1 ${tone.ring}` : "border-slate-100 bg-slate-50 opacity-50",
      ].join(" ")}
      aria-hidden={!visible}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={["text-base font-semibold", tone.title].join(" ")}>{title}</div>
          <div className="mt-0.5 text-sm text-slate-600">{subtitle}</div>
        </div>
        {rightBadge ? <div className="shrink-0">{rightBadge}</div> : null}
      </div>

      <div className={["mt-4", visible ? "" : "pointer-events-none"].join(" ")}>{children}</div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function DecisionButton({
  label,
  active,
  onClick,
}: {
  label: "Approve" | "Request info" | "Reject" | "Escalate";
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg border px-4 py-3 text-left transition",
        active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="text-sm font-semibold">{label}</div>
      <div className={["mt-1 text-xs", active ? "text-slate-200" : "text-slate-600"].join(" ")}>
        {label === "Approve" && "Proceed within policy and record why."}
        {label === "Request info" && "Pause and ask for missing evidence."}
        {label === "Reject" && "Stop the request with a clear reason."}
        {label === "Escalate" && "Route to a higher authority."}
      </div>
    </button>
  );
}
