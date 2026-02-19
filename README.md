# Trusted Workflow AI Demo

An interactive, minimal Next.js demo showing how to integrate AI into enterprise workflows **with control**:
**intake quality checks → policy routing → bounded AI suggestions → mandatory human decision → audit log**.

This is **decision support**, not decision automation.

## What you’ll see (6 steps)

1. **Request intake** – capture the essentials (type, impact, reason, evidence)
2. **Intake quality gate** – catch missing or inconsistent data early
3. **Policy & routing** – route the case (standard / request info / escalate)
4. **AI suggestion (bounded)** – AI suggests and explains (can be withheld)
5. **Human decision** – a person decides and records a reason
6. **Audit log** – timestamped history of system + human actions

## Why this matters (enterprise)

- **Trust**: bad input is stopped before it reaches approvals
- **Governance**: routing rules enforce consistent behavior
- **Human-in-the-loop**: AI cannot finalize outcomes
- **Auditability**: every action is recorded (who/when/what)

## Demo controls

- **Messy intake** toggle: simulates missing evidence to show how gates and routing react
- **Next**: progresses the workflow and writes meaningful audit events
- **Export audit log**: downloads the audit timeline as JSON

## Run locally

```bash
npm install
npm run dev