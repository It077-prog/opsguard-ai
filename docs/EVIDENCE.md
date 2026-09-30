# OpsGuard V0.1 Portfolio Evidence

This file tracks the final visual evidence to add to the repository and presentation.

## Screenshot checklist

Add final screenshots from the published V0.1 application for:

1. **Operations Overview / Home**
2. **OP-101 — Why this needs attention**
3. **OP-101 — Case Details**
4. **OP-101 — AI Summary**
5. **OP-101 — Your Decision**
6. **Evaluation Results**
7. **Decision History**
8. **Optional mobile view**

## Recommended repository structure

```text
docs/
├── ARCHITECTURE.md
├── EVALUATION.md
├── EVIDENCE.md
└── images/
    ├── 01-operations-overview.png
    ├── 02-op101-review.png
    ├── 03-op101-details.png
    ├── 04-op101-ai-summary.png
    ├── 05-op101-decision.png
    ├── 06-evaluation.png
    ├── 07-decision-history.png
    └── 08-mobile-view.png   # optional
```

## Evidence rules

Use only real screenshots from the final published application.

Do not:

- generate fake UI screenshots;
- recreate the UI manually for evidence;
- use old screenshots when the final interface is available;
- crop away information needed to understand the screen;
- present roadmap capabilities as implemented functionality.

## README placement

Once images are added, the README should ideally display:

### 1. Operations Overview
Use this near the top of the README after the problem statement or live-demo link.

### 2. OP-101 review flow
Use 2–4 screenshots to demonstrate:

```text
Why flagged → Details → AI Summary → Human Decision
```

### 3. Evaluation
Show the final controlled benchmark screenshot next to or below the evaluation table.

### 4. History
Show the plain-language Decision History screen to demonstrate traceability.

## Presentation alignment

The same final screenshot set should be used in the portfolio presentation so the repository, live app, and deck all show the same V0.1 interface.

## Final consistency checks

Before freezing V0.1, confirm:

- live application uses the final simplified employee workflow;
- README numbers match the 30-record controlled benchmark;
- presentation uses the same final UI;
- no documentation claims production accuracy;
- no immutable / tamper-proof audit claim remains;
- roadmap items are clearly labelled as future;
- AI is described as advisory;
- human decision authority is clear.
