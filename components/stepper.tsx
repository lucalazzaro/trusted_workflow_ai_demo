type Step = {
  id: number;
  title: string;
  subtitle: string;
};

function toneDot(stepId: number) {
  // Soft, enterprise tints
  switch (stepId) {
    case 2:
      return "bg-sky-200 border-sky-300";
    case 3:
      return "bg-indigo-200 border-indigo-300";
    case 4:
      return "bg-violet-200 border-violet-300";
    case 5:
      return "bg-emerald-200 border-emerald-300";
    case 6:
      return "bg-amber-200 border-amber-300";
    default:
      return "bg-slate-200 border-slate-300";
  }
}

export function Stepper({
  steps,
  current,
  onSelect,
}: {
  steps: Step[];
  current: number;
  onSelect: (id: number) => void;
}) {
  return (
    <nav className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-sm font-semibold text-slate-900">
        Walkthrough
      </div>

      <ol className="space-y-2">
        {steps.map((s) => {
          const isActive = s.id === current;
          const isDone = s.id < current;

          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                className={[
                  "w-full rounded-lg border px-3 py-3 text-left transition",
                  isActive
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 bg-white hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex items-center gap-2">
                    <div
                      className={[
                        "h-2.5 w-2.5 rounded-full border",
                        toneDot(s.id),
                      ].join(" ")}
                      aria-hidden="true"
                    />
                    <div
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                        isActive
                          ? "border-slate-900 bg-white text-slate-900"
                          : isDone
                            ? "border-slate-300 bg-slate-100 text-slate-700"
                            : "border-slate-200 bg-white text-slate-500",
                      ].join(" ")}
                      aria-label={
                        isActive ? "Current step" : isDone ? "Completed step" : "Step"
                      }
                    >
                      {s.id}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {s.title}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-600">
                      {s.subtitle}
                    </div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        <div className="font-semibold text-slate-900">Simple rule</div>
        <div className="mt-1">
          The helper suggests. You decide. Everything is recorded.
        </div>
      </div>
    </nav>
  );
}
