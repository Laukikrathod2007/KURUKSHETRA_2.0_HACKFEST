# Demo Script
## Project Kurukshetra — Agentic Guardian

Companion to [`08-data-and-scenarios.md`](./08-data-and-scenarios.md)
(the nine scenarios referenced throughout) and
[`00-overview.md`](./00-overview.md) §2 (the Core Lever, which this
script is built to make visible, not just assert).

---

## 1. The 2-Minute Story (What to Say Before Touching the Keyboard)

> "This is a fake payment app. I'm going to try to send money four
> different ways, and I want you to watch how differently it responds
> each time — not based on a score, but based on what it actually
> figures out about each payment.
>
> First, a normal payment I make every month — watch it go straight
> through, no friction.
>
> Second, a payment to someone I've never paid before, for something
> ordinary — it flags it, gently, but doesn't stop me.
>
> Third — this is the one I actually built this project around — a
> payment note that says it's for an 'account verification fee,' sent to
> what looks like a normal personal account. The system checks: does the
> *actual registered identity* of this recipient match what the note
> claims? It doesn't — and that mismatch alone is enough to stop it,
> before the AI even reads a single suspicious word.
>
> Fourth, a payment with urgency and secrecy language — 'send now, don't
> tell anyone' — the system reads that, explains in plain English exactly
> why it's dangerous, and pauses it. Notice it *pauses* — I can still
> override it if I insist.
>
> Now watch the difference: this fifth one is going to a recipient
> that's on a confirmed blocklist. This isn't a score-based guess — it's
> a hard rule. And there's no 'proceed anyway' button here at all. Pause
> and block are two different things in this system, on purpose.
>
> Then I'll show you two more things most teams won't show you: what
> happens when the AI itself is unavailable, and what happens when I try
> to trick the AI directly with a prompt-injection attack hidden in the
> payment note."

This narration deliberately never says "pre-flight window," "tiered
hot/warm path," "entity–purpose semantic clash," or any other
research-derived jargon — see [`00-overview.md`](./00-overview.md) §3
for why that language is confined to internal documentation, not the
demo voice.

---

## 2. Minute-by-Minute Plan

| Time | Beat | Scenario |
|---|---|---|
| 0:00–0:25 | The 2-minute story (§1), delivered while the app is already open | — |
| 0:25–0:50 | Normal payment — instant, no friction | Scenario 1 |
| 0:50–1:15 | New recipient — advisory banner, proceeds normally | Scenario 2 |
| 1:15–2:00 | Suspicious request — purpose–identity mismatch catches it; show the plain-language evidence report | Scenario 3 |
| 2:00–2:40 | High-risk — urgency/secrecy language, full PAUSE, evidence report walkthrough, show the agent's reasoning trace in the judge/operator view, click "proceed anyway" to show the override is real and logged | Scenario 4 |
| 2:40–3:00 | **Contrast beat** — same flow, but a confirmed-blocklisted recipient: BLOCK fires instead, no "proceed anyway" control exists at all. Say this out loud: "pause and block are different actions in this system." | Scenario 8 |
| 3:00–3:25 | Fail-open — kill the AI connection live, show the system still protects the user via the deterministic layer alone, then show the audit log recording the degradation | Scenario 5 |
| 3:25–4:05 | **Live red-team moment** — hand the note field to a judge, or use the pre-written injection payload, show the attempted manipulation fail to change the outcome | Scenario 7 |
| 4:05–4:35 | Audit history walkthrough — open the hash-chained log, show tamper-evidence, show the PAUSE-override and the BLOCK record side by side (one shows `proceeded_after_override`, the other only ever shows `cancelled`) | Audit view |
| 4:35–5:00 | One-sentence close: what this project chose not to build, and why (a 10-second nod to `00-overview.md` §5.3, not a detour) | — |

Scenario 6 (uncertainty/false-positive-avoidance) and Scenario 9
(slow-burn multi-tranche scam, D10/D11/D12) are both included in the
scenario selector for judge-driven exploration and Q&A, but are not on
the critical path of the scripted five-minute walkthrough above. Scenario
6 is the answer to "what if I ask it to try a big legitimate payment."
Scenario 9 is the answer to "what if the scam happens across several
transactions, not one" — and is the single best follow-up demo to run if
a judge asks "what does the multi-specialist reasoning actually add over
a single risk score," since it's the one case where velocity and
historical-pattern matching catch something no single-transaction signal
would have.

---

## 3. What Intelligence Is Visible at Each Beat

- **Scenario 1–2:** the deterministic hot path alone — visibly instant,
  visibly proportionate (advisory, not alarm, for mere novelty).
- **Scenario 3:** the purpose–identity check firing on its own — this
  should be shown *before* the LLM's involvement is even mentioned, to
  make the point that the strongest signal in this system is not "AI
  magic," it's a hard-to-fake structural comparison (D1). This is a
  deliberate narrative choice: it pre-empts the judge's likely
  skepticism about LLM-only detection.
- **Scenario 4:** the agent's actual multi-specialist reasoning trace,
  shown in the judge/operator view (`01-srs.md` FR-EXP-03) — which of the
  four specialists returned, what each one found, `specialist_agreement`,
  and which tool calls fired in what order and why (tie directly to
  [`03-agent-and-tools.md`](./03-agent-and-tools.md) §4's conditional
  logic if the target design was achieved; if the fallback pipeline was
  used instead, this is the moment to say so honestly rather than imply
  otherwise). This is also where a strong judge question — "isn't this
  just one model talking to itself four times?" — gets answered directly:
  each specialist has a different, narrower question and a different
  input slice (§2 of that document), not a repeated identical prompt.
- **Scenario 8:** the BLOCK action firing from a rule, not a score — the
  agent is visibly never invoked (the operator view shows zero agent
  calls for this transaction), and no override control renders anywhere,
  which is the clearest possible evidence that "pause" and "block" are
  not the same mechanism wearing two labels.
- **Scenario 5:** the fail-open path — the single clearest piece of
  evidence that this is engineered, not vibes-coded.
- **Scenario 7:** the injection attempt visibly failing to move the
  final decision — the single clearest piece of evidence for "safe
  autonomous decision-making."

---

## 4. Where Humans Intervene

Every ADVISE/CHALLENGE/PAUSE scenario ends with an explicit human
decision point (Cancel / Proceed anyway), and the demo should show at
least one deliberate "Proceed anyway" click to demonstrate that this
system advises and delays rather than dictates
(`04-risk-and-policy.md` §6) — and then immediately show that choice
recorded distinctly in the audit log (`01-srs.md` FR-INT-03). This is a
good moment to explicitly say: "the system never silently decides for
you — it makes sure you can't miss what it found, and then it's your
call," directly evidencing the human-in-the-loop requirement from ps.md.

**BLOCK (Scenario 8) is the deliberate exception** — say so explicitly
rather than letting a judge discover it and wonder if it's an
inconsistency: this is the one action with no human override, because it
represents a hard rule fact (a confirmed-bad recipient), not a
probabilistic judgment the user might reasonably disagree with
(`01-srs.md` FR-POL-05, `05-threat-model-and-safety.md` §4).

---

## 5. Red-Team Payload for the Live Moment

A short, pre-written list (see
[`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §2.6 for
the full suite used in testing) of which 1–2 payloads are safe and
effective to demo live, e.g. a note containing an embedded fake
"system message" instructing the model to report zero risk. The demo
should show: (a) what the agent itself said in response to the
manipulation attempt (which may indeed be partially fooled — that's
honest and fine to show), and (b) that the final action was unaffected,
proving the point is the architecture, not the model's individual
robustness (`05-threat-model-and-safety.md` §2).

---

## 6. Demo-Reliability Fallback (Distinct From Product Fail-Open)

The live LLM dependency is the one part of this system's behavior this
project does not fully control on stage. In addition to the product's own
fail-open design (`01-srs.md` NFR-REL-01, demoed as Scenario 5), the demo
itself should have:

- A **cached/recorded response** for each scripted scenario's agent call,
  usable as an instant substitute if the live API is slow or unavailable
  during the actual presentation — clearly distinguishable in the
  build/config as a demo-safety measure, never silently substituted in a
  way that could be mistaken for the product's real-time behavior outside
  of a presentation context.
- A rehearsed line for if this substitution is needed: acknowledge it
  plainly ("the live call is being slow, here's a captured response from
  the same pipeline running seconds ago") rather than pretending nothing
  happened — consistent with this project's overall honesty commitment
  (`01-srs.md` NFR-HON-01).

---

## 7. What Makes This Memorable

Not the number of features, but three specific, rare moments — (1)
watching the purpose–identity mismatch catch a scam *before* any language
reasoning is even invoked, which reframes "recipient verification" from a
checkbox into the strongest signal in the system, (2) watching a live
prompt-injection attempt fail to change the outcome, which is the most
direct, visceral proof of "safe autonomous decision-making" a judge is
likely to see from any team that day, and (3) the PAUSE-vs-BLOCK contrast
(Scenario 4 vs. Scenario 8) — seeing the same risky-payment flow behave
completely differently depending on whether the system is *guessing*
(overridable) or *certain* (not), which most teams collapse into one
generic "blocked" dialog without ever making that distinction real.
