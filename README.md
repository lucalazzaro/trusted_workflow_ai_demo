# Trusted Workflow AI Demo

Interactive **Next.js** demo showing how AI can support **enterprise
decision workflows** without removing **human control**.

------------------------------------------------------------------------

## Overview

This project demonstrates a governed decision flow:

**Intake → Quality gate → Policy routing → Bounded AI suggestion → Human
decision → Audit log**

The focus is **decision support**, not decision automation.

------------------------------------------------------------------------

## Why this matters

Enterprise AI adoption depends on:

-   **Trust** --- bad or incomplete input is stopped early\
-   **Governance** --- deterministic routing rules ensure consistency\
-   **Human‑in‑the‑loop** --- AI cannot finalize outcomes\
-   **Auditability** --- every action is recorded with timestamps and
    actors

------------------------------------------------------------------------

## Demo preview

> Add `public/demo.gif` here after recording the walkthrough.

![Trusted Workflow AI demo](public/demo.gif)

------------------------------------------------------------------------

## Workflow in six steps

1.  **Request intake** --- capture essentials (type, impact, reason,
    evidence)\
2.  **Intake quality gate** --- detect missing or inconsistent data\
3.  **Policy & routing** --- choose safest path (standard, request info,
    escalation)\
4.  **AI suggestion (bounded)** --- explainable support that can be
    withheld\
5.  **Human decision** --- mandatory approval, rejection, escalation, or
    info request\
6.  **Audit log** --- full trace of system and human actions

------------------------------------------------------------------------

## Open

👉 **Landing:** http://localhost:3000\
👉 **Interactive demo:** http://localhost:3000/demo

------------------------------------------------------------------------

## Tech focus

**Minimal, intentional stack:**

-   **Next.js (App Router)**
-   **TypeScript**
-   **API‑route workflow engine**
-   **Append‑only audit log**

**Goal:** showcase **AI workflow architecture**, not model complexity.

------------------------------------------------------------------------

## Project structure (high level)

-   `app/` --- UI pages and API routes\
-   `lib/contracts/` --- shared types between UI and API\
-   `lib/engine/` --- workflow logic (checks, routing, AI suggestion)\
-   `lib/audit/` --- append‑only audit storage (demo‑level)

------------------------------------------------------------------------

## Run locally

``` bash
npm install
npm run dev
```

Open the browser:

-   **Landing** → http://localhost:3000\
-   **Demo** → http://localhost:3000/demo

------------------------------------------------------------------------

## Key concepts

-   **Governed AI** --- AI operates inside explicit workflow controls\
-   **Bounded suggestion** --- AI explains recommendations and limits\
-   **Human authority** --- final decision always belongs to a person\
-   **Traceability** --- audit trail supports compliance and review

------------------------------------------------------------------------

## Author

**Luca Lazzaro**\
AI workflow design · Decision support · Human‑in‑the‑loop systems

------------------------------------------------------------------------

## License
MIT (or your preferred license)
