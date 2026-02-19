export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="border-b bg-white">
  <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-lg border border-slate-200 bg-slate-50" />

      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight text-slate-900">
          Trusted Workflow AI
        </span>
        <span className="text-xs text-slate-500">
          Decision support • Human-in-the-loop • Audit log
        </span>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <a
        href="/demo"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Open demo
      </a>
    </div>
  </div>
</header>


      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Hero */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              Human-in-the-loop • Audit-ready • Enterprise workflow
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              AI in the workflow — with control.
            </h1>

            <p className="mt-3 text-base leading-relaxed text-slate-600">
              A small interactive demo showing how AI can support enterprise
              decisions without taking over: strong intake checks, routing rules,
              bounded AI suggestions, mandatory human approval, and a full audit log.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/demo"
                className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Start the walkthrough
              </a>

              <div className="text-sm text-slate-600">
                2 minutes • no technical knowledge needed
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <KPI label="Gate" value="Intake quality" />
              <KPI label="Control" value="Human decision" />
              <KPI label="Proof" value="Audit log" />
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Scenario
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                Request approval workflow
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Think: discounts, refunds, access requests, policy exceptions,
                procurement approvals.
              </div>
            </div>
          </div>

          {/* Right “image” (no external assets) */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  What the demo shows
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  A controlled path from input → decision → audit
                </div>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                Workflow view
              </div>
            </div>

            {/* Flow illustration */}
            <div className="mt-6 space-y-3">
              <FlowCard
                tone="sky"
                title="Intake quality gate"
                text="Catch missing or inconsistent input before it reaches approvals."
              />
              <FlowCard
                tone="indigo"
                title="Policy & routing"
                text="Rules select the safe route: standard review, request info, or escalation."
              />
              <FlowCard
                tone="violet"
                title="AI suggestion (bounded)"
                text="AI suggests and explains — it cannot finalize the outcome."
              />
              <FlowCard
                tone="emerald"
                title="Human decision"
                text="A person decides and records a short reason."
              />
              <FlowCard
                tone="amber"
                title="Audit log"
                text="Every step is recorded with timestamps and actors (system vs human)."
              />
            </div>

            {/* Subtle background decoration */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-slate-50" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-slate-50" />
          </div>
        </section>

        {/* Value props */}
        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Feature
            title="Decision support (not automation)"
            text="The system supports decisions and forces a human control point. This reduces risk and improves adoption."
          />
          <Feature
            title="Governance by design"
            text="Quality gates and routing rules make the workflow predictable, explainable, and consistent."
          />
          <Feature
            title="Auditability that scales"
            text="Events are recorded with timestamps and actors so audits and reviews are straightforward."
          />
        </section>

        {/* CTA */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">
                Ready to see it in action?
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Open the walkthrough and follow the workflow step by step.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/demo"
                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Open demo
              </a>
              <div className="text-sm text-slate-600">
                Tip: toggle “Messy intake” to see gates + routing react.
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 text-xs text-slate-500">
          trusted_workflow_ai_demo • Focus: workflow design, human control, auditability
        </footer>
      </div>
    </main>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-600">{text}</div>
    </div>
  );
}

function FlowCard({
  tone,
  title,
  text,
}: {
  tone: "sky" | "indigo" | "violet" | "emerald" | "amber";
  title: string;
  text: string;
}) {
  const toneMap: Record<string, { dot: string; border: string; bg: string }> = {
    sky: { dot: "bg-sky-200", border: "border-sky-200", bg: "bg-sky-50" },
    indigo: { dot: "bg-indigo-200", border: "border-indigo-200", bg: "bg-indigo-50" },
    violet: { dot: "bg-violet-200", border: "border-violet-200", bg: "bg-violet-50" },
    emerald: { dot: "bg-emerald-200", border: "border-emerald-200", bg: "bg-emerald-50" },
    amber: { dot: "bg-amber-200", border: "border-amber-200", bg: "bg-amber-50" },
  };

  const t = toneMap[tone];

  return (
    <div className={["rounded-xl border p-4", t.border, t.bg].join(" ")}>
      <div className="flex items-start gap-3">
        <div className={["mt-1 h-3 w-3 rounded-full border border-slate-300", t.dot].join(" ")} />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{text}</div>
        </div>
      </div>
    </div>
  );
}
