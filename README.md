# OpsGuard AI V0.1

**Operational Exception Review & Evidence Reconciliation**

OpsGuard AI is a human-in-the-loop operational control prototype that checks whether the status recorded in an operational system agrees with the available supporting evidence and downstream outcome.

**Live demo:** https://opsguard-ai-v0-1.ai.studio/

> **Prototype note:** V0.1 uses controlled synthetic data and prototype-level in-memory state. It is not a production deployment.

---

## Problem

Operational systems often track a status such as `Open`, `In Progress`, or `Completed` separately from the evidence that supports the underlying work.

A case can therefore appear complete while:

- required completion proof is missing;
- mandatory information is unavailable; or
- the downstream outcome is still unresolved.

OpsGuard treats the recorded status as a claim to be checked against evidence and outcome.

---

## Core workflow

```text
Operational Record
      ↓
Deterministic Checks
      ↓
Exception?
   ↙       ↘
  No       Yes
  ↓         ↓
Normal   AI Context Summary
            ↓
       Human Decision
            ↓
           History
```

The design deliberately separates three responsibilities:

1. **Deterministic rules** identify objective exceptions.
2. **Gemini** helps interpret context only after an exception exists.
3. **A human reviewer** makes the final operational decision.

---

## Implemented V0.1 rules

### 1. Past due
A case is flagged when the due time has passed and the case is not completed.

### 2. Missing information
A case is flagged when information is required but is not present.

### 3. Status conflict
A case is flagged when the status is `Completed`, completion evidence is required, and the required evidence is unavailable.

These conditions are deterministic because they can be decided from structured fields without LLM interpretation.

---

## Representative case: OP-101

**Express Medical Consignment — Northstar Medical Centre**

| Field | Value |
|---|---|
| Recorded status | Completed |
| Completion evidence | Missing |
| Final outcome | Unresolved |
| User-facing issue | Status conflict |

OpsGuard surfaces the conflict, shows the relevant case details, generates a short AI-assisted summary, and asks the reviewer to either **Approve Completion** or **Keep Case Open**.

---

## AI boundaries / guardrails

Gemini is advisory. It does **not**:

- create the deterministic exception;
- change source operational records;
- close a case independently;
- approve its own recommendation.

If AI analysis is unavailable, the exception remains visible and the user receives the fallback:

> **AI analysis unavailable — manual review required.**

Normal cases do not require AI analysis.

---

## Evaluation

OpsGuard V0.1 was evaluated on a controlled synthetic dataset of **30 records** covering normal cases, single-rule exceptions, and multiple simultaneous exceptions.

| Metric | Result |
|---|---:|
| Total records | 30 |
| Cases needing attention | 19 |
| Normal cases | 11 |
| True positives | 19 |
| False positives | 0 |
| True negatives | 11 |
| False negatives | 0 |
| Precision | 100% |
| Recall | 100% |
| Accuracy | 100% |

**Correct interpretation:** OpsGuard V0.1 achieved 100% precision, recall, and accuracy across its 30-record synthetic validation dataset for the three implemented deterministic exception rules.

**This is not production accuracy.** Production validation would require real operational data, more edge cases, persistent infrastructure, and ongoing monitoring.

See [`docs/EVALUATION.md`](docs/EVALUATION.md) for the evaluation methodology and limitations.

---

## User experience

The first prototype exposed too much technical information inside the application. The final V0.1 separates the operational workflow from the engineering documentation.

The employee-facing flow is intentionally simple:

```text
Home → Case Review → Case Details → AI Summary → Human Decision → History
```

Design principle:

> **One screen → one question → one main action.**

---

## Tech stack

| Layer | V0.1 choice | Why |
|---|---|---|
| Front end | React + Vite | Interactive multi-step workflow and rapid UI iteration |
| Backend | Express + Node.js / TypeScript | Lightweight API layer aligned with the application stack |
| AI | Gemini via `@google/genai` | Practical integration with the Google AI Studio prototype environment |
| Rules | Application-level deterministic logic | Small set of explicit, testable conditions |
| State | In-memory prototype state | Kept V0.1 focused on workflow, controls, and evaluation |

The architecture is not tied to Gemini. OpenAI, Claude, or a local model could replace the model layer without changing the deterministic rule design.

---

## Project structure

```text
opsguard-ai/
├── server.ts              # Express API, Gemini integration, decisions, evaluation
├── src/
│   ├── App.tsx            # Main application flow
│   ├── components/        # Employee-facing screens and UI components
│   ├── config/            # Configuration
│   ├── data/              # Synthetic validation data
│   ├── rules/             # Deterministic exception logic
│   └── types/             # TypeScript types
├── docs/
│   ├── ARCHITECTURE.md
│   ├── EVALUATION.md
│   └── EVIDENCE.md
├── .env.example
├── package.json
└── README.md
```

---

## Run locally

### Prerequisites

- Node.js
- Gemini API key

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API key

Copy `.env.example` to your local environment file and set:

```text
GEMINI_API_KEY=your_key_here
```

Do not commit real API keys.

### 3. Run the application

```bash
npm run dev
```

### 4. Validate the project

```bash
npm run lint
npm run build
```

---

## Current limitations

V0.1 does not claim:

- production deployment with real enterprise data;
- production authentication or role-based access;
- durable enterprise database persistence;
- immutable or tamper-proof audit storage;
- live enterprise-system integrations;
- GPS, signature, image, or telemetry verification;
- autonomous production decisions;
- independently validated AI recommendation quality;
- measured production ROI.

Operational state is currently prototype-level and can be lost on server restart.

---

## Logical V0.2 priorities

Before adding more AI features, the next engineering priorities would be:

1. persistent database;
2. authentication and reviewer identity;
3. durable decision history;
4. real system integrations;
5. larger evaluation and monitoring;
6. only then richer evidence sources or voice assistance.

---

## Engineering lesson

The main design decision was not simply adding an LLM. It was deciding **where the LLM should not be used**.

Objective conditions remain deterministic, AI assists with ambiguous context, and the human retains operational authority.

---

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system design and component responsibilities
- [`docs/EVALUATION.md`](docs/EVALUATION.md) — controlled benchmark, metrics, and limitations
- [`docs/EVIDENCE.md`](docs/EVIDENCE.md) — screenshot checklist and portfolio evidence

---

## Development note

AI-assisted development tools were used to accelerate implementation and iteration. The project decisions around problem definition, rules, architecture, AI boundaries, synthetic evaluation, user flow, failure handling, and supported claims were explicitly designed and tested rather than treated as automatically correct because code was generated.
