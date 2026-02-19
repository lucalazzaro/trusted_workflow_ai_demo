# Trusted Workflow AI Demo

Interactive Next.js demo showing how AI can support **enterprise decision workflows**  
without removing **human control**.

## What this demonstrates

A governed decision flow:

**Intake → Quality gate → Policy routing → Bounded AI suggestion → Human decision → Audit log**

This is **decision support**, not decision automation.

## Why it matters

Enterprise AI adoption depends on:

- **Trust** → bad input stopped early  
- **Governance** → consistent routing rules  
- **Human-in-the-loop** → AI cannot finalize outcomes  
- **Auditability** → full trace of actions and decisions  

## Demo preview

![Trusted Workflow AI demo](public/demo.gif)

## Key concepts

- **Intake quality gate**  
  Prevents incomplete or inconsistent data from reaching approvals.

- **Policy & routing**  
  Deterministic rules choose the safest workflow path.

- **Bounded AI suggestion**  
  AI provides explainable support and can be **withheld** when input is unsafe.

- **Mandatory human decision**  
  A person must approve, reject, request info, or escalate.

- **Audit log**  
  Timestamped history of system and human actions.

## Run locally

```bash
npm install
npm run dev

## Open

**Landing** → http://localhost:3000  
**Interactive demo** → http://localhost:3000/demo  

---

## Tech focus

**Minimal, intentional stack:**

- **Next.js (App Router)**
- **TypeScript**
- **API route workflow engine**
- **Append-only audit log**

**Goal:** showcase **AI workflow architecture**, not model complexity.

---

## Author

**Luca Lazzaro**  
AI workflow design · Decision support · Human-in-the-loop systems
