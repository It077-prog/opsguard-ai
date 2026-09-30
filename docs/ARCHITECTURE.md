# OpsGuard V0.1 Architecture

## Purpose

OpsGuard is designed to check whether an operational record's status agrees with the available supporting evidence and downstream outcome.

The architecture intentionally separates objective logic, AI interpretation, and human authority.

## High-level flow

```text
Operational Record
      ↓
Deterministic Rules
      ↓
Exception?
   ↙       ↘
  No       Yes
  ↓         ↓
Normal   Gemini Context Analysis
            ↓
       Human Decision
            ↓
       Decision History
```

## Layer 1 — Deterministic checks

V0.1 implements three explicit exception conditions:

- Past due
- Missing information
- Status conflict

These rules operate on structured record fields and do not require LLM reasoning.

## Layer 2 — AI contextual interpretation

Gemini is invoked only after a deterministic exception exists.

The AI layer is intended to help summarize:

- relevant contextual notes;
- conflicting information;
- missing supporting evidence;
- a suggested next action;
- why human review is still required.

The AI output is advisory and should not be treated as an authoritative operational fact.

## Layer 3 — Human decision

The reviewer remains the final authority.

User-facing decisions are:

- **Approve Completion**
- **Keep Case Open**

The model cannot approve its own recommendation or directly alter the source record.

## Layer 4 — History

The application records review-related events so the sequence of actions can be inspected later.

V0.1 uses prototype-level in-memory state. This should not be described as immutable, permanent, or production-grade persistence.

## Server responsibilities

`server.ts` provides the application API and is responsible for functions including:

- configuration / health information;
- retrieving operational records;
- invoking Gemini for flagged cases;
- recording human decisions;
- exposing decision-history data;
- running the evaluation suite.

## Front-end responsibilities

The React application provides the employee-facing workflow:

```text
Home → Case Review → Case Details → AI Summary → Decision → History
```

The final UI deliberately hides architecture, raw model metadata, rule IDs, and validation detail from daily users.

## Failure behaviour

### AI unavailable
The deterministic exception remains active and the user should receive:

> AI analysis unavailable — manual review required.

### Incorrect model recommendation
The output is advisory. Human review remains mandatory.

### Application restart
Because V0.1 uses in-memory state, transient decisions / runtime state may not persist after restart.

## Production-oriented next steps

A production-oriented version would prioritise:

1. persistent relational storage;
2. authentication and reviewer identity;
3. role-based permissions where required;
4. durable audit / decision history;
5. real source-system integrations;
6. monitoring, model-call logging, and cost tracking;
7. larger-scale evaluation.

## Technology alternatives

The project concept is not tied to one vendor or framework.

- Gemini could be replaced by OpenAI, Claude, or a suitable local model.
- Express could be replaced by FastAPI, Flask, or another backend framework.
- In-memory state could be replaced with PostgreSQL, MySQL, Supabase, or another durable store.
- React/Vite could be replaced by another front-end stack if product requirements changed.

The key architectural principle remains the same: **objective rules first, AI context second, human decision last.**
