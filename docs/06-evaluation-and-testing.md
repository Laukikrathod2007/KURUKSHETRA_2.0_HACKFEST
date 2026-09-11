# Evaluation & Testing Specification
## Project Kurukshetra — Agentic Guardian

Companion to [`04-risk-and-policy.md`](./04-risk-and-policy.md) and
[`08-data-and-scenarios.md`](./08-data-and-scenarios.md). Defines what
this project actually measures, how, and — just as importantly — what it
explicitly refuses to claim.

---

## 1. Honest-Evaluation Policy (Read This First)

This project does not report precision/recall or dollar-value figures as
if they were externally validated benchmarks. Any such number can only
reflect performance on this project's own small, hand-authored synthetic
scenario suite — treating that as equivalent to a real-world measurement
would be a direct, checkable misrepresentation the moment someone asks
"how was this measured."

**Evaluation policy:**

1. Every number reported is **measured by this project's own evaluation
   harness, on this project's own synthetic scenario suite**, and is
   labeled as exactly that — never presented as a real-world benchmark,
   an industry comparison, or a claim about production performance.
2. Thresholds are calibrated against a subset of scenarios and then
   **verified against a held-out subset they were not tuned against**
   (§3), specifically to avoid the self-grading trap where the same team
   writes the scenarios, the model, and the scoring rubric and then
   reports a flattering number that only proves the code runs.
3. False-positive/over-blocking behavior is reported with the same
   prominence as detection success — a system that blocks everything
   would trivially "detect" every scam and is not what this project is
   trying to build or claim.
4. Where a claim cannot be honestly measured with the tools this project
   has (e.g., real-world scam prevalence, real victim psychology, real
   financial value protected), the documentation says so explicitly
   rather than inventing a number.

---

## 2. What Gets Measured

### 2.1 Safety Invariant (the single most important test)

**Test:** across every scenario in the suite, and across a generated set
of adversarial/edge-case inputs, verify that `final_tier` is never lower
than `hot_tier` would have produced alone (`04-risk-and-policy.md` §4).

**Target:** zero violations, always. This is not a statistical target —
any single violation is a defect, because it falsifies the project's core
safety claim (D5). This test is run, not just asserted, and its pass/fail
result is the headline safety metric for this project — more important
than any detection-rate number.

### 2.2 Outcome Breakdown (not raw "accuracy")

For each scenario in the suite, report the actual `(hot_tier, agent
verdict if invoked, final_tier, action)` tuple against the scenario's
intended ground-truth label (benign / scam, and if scam, which typology).
Presented as a confusion-style breakdown per tier, not a single blended
accuracy number, since the tiers have different real-world costs (a
missed CRITICAL is far worse than a missed ADVISE).

### 2.3 False-Positive / Over-Blocking Behavior

Reported as prominently as detection success: how many benign,
merely-unusual scenarios (large one-off legitimate payments, first-time
but legitimate recipients) were escalated further than necessary, and
whether the uncertainty-dampening logic (`04-risk-and-policy.md` §3)
correctly reduced their severity relative to a naive score-only policy.
This is the project's answer to "does it just block everything to look
safe."

### 2.4 Latency (Measured, Not Claimed)

Hot-path and warm-path timings are measured locally during test runs and
reported as observed distributions (e.g., min/median/max over N runs on
the development machine), explicitly labeled as local measurements, not
a production SLA claim (`02-architecture.md` §6).

### 2.5 Fail-Open Verification

A dedicated test forces the agent call to fail (simulated timeout/error)
and verifies: (a) the pipeline still produces a valid decision based on
the hot path alone, (b) the degradation is logged, (c) no exception
propagates to the user-facing UI. This directly proves D7.

### 2.6 Adversarial Containment (Red-Team Suite)

A fixed list of adversarial payment notes (prompt-injection attempts,
e.g. text instructing the model to output a low-risk verdict, or
impersonating a system message) is run through the full pipeline. Metric:
**for every payload, does `final_tier` still equal or exceed what the
hot path alone determined?** (Same invariant as §2.1, specifically
exercised with adversarial inputs.) This is the concrete evidence behind
D9 and the live-demo red-team moment
(`07-demo-script.md` §5).

### 2.7 Audit Integrity

A test that mutates a historical audit record and verifies the hash
chain detects the tampering (proves D6 is more than a plain log file).

### 2.8 Override Logging

A test that simulates a user proceeding past a CHALLENGE/PAUSE warning
and verifies the audit record correctly tags it as
`user_override_after_warning`, distinct from an uncontested ALLOW
(`04-risk-and-policy.md` §6).

---

## 3. Threshold Calibration Method

1. Author the full scenario suite (`08-data-and-scenarios.md`) with
   explicit ground-truth labels, including deliberately ambiguous and
   deliberately benign-but-unusual cases.
2. Split into a **calibration set** and a **held-out set**.
3. Tune the hot-path tier thresholds (`04-risk-and-policy.md` §2) and the
   uncertainty-dampening rule (§3) against the calibration set only.
4. Report §2.2–§2.3 results computed on the held-out set, not the
   calibration set, and state this split explicitly in any results
   summary — this is the concrete mechanism that prevents the
   self-grading trap named in §1.

Given the small scale of a hackathon-built synthetic suite, this is
presented as **illustrative validation appropriate to a prototype**, not
a statistically powered benchmark — stated as such rather than implied
otherwise.

---

## 4. Test Suite Structure (for the future build phase)

| Suite | Contents | Proves |
|---|---|---|
| `test_invariants` | §2.1 (never-lower-than-hot-tier), across normal + adversarial inputs | D5 |
| `test_scenarios` | The full scenario set (`08-data-and-scenarios.md`), run end-to-end, outcome breakdown per §2.2/§2.3 | D1, D2, D8 |
| `test_fail_open` | §2.5 | D7 |
| `test_red_team` | §2.6, the adversarial payload list | D9 |
| `test_audit_integrity` | §2.7 | D6 |
| `test_override_logging` | §2.8 | D3 (override handling) |
| `test_latency` | §2.4, local timing distributions | Supports architecture claims in `02-architecture.md` §6, not a standalone product claim |

---

## 5. Metrics Explicitly Not Reported (and Why)

| Would-be metric | Why it's not reported |
|---|---|
| "X% real-world scam detection rate" | No real-world scam data exists in this project; any such number would be fabricated |
| "$X prevented annually" | Requires real transaction volume and real scam prevalence figures this project does not have and cannot honestly estimate |
| Comparison against named commercial products' published figures | Those figures are third-party claims this project cannot verify or reproduce; comparing against them would lend false authority to both sides |
| Single blended "accuracy" number | Collapses tier-specific costs (missing a CRITICAL vs. missing an ADVISE are not equally bad) into a misleading single figure — §2.2's breakdown is used instead |
