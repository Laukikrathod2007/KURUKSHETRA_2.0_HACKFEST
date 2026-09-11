# The Two Guardian Features — Simply Explained

---

## The Problem We're Solving First

When someone is about to get scammed, two things usually happen:

1. They are **on a call with the scammer** who is coaching them
2. The payment app shows a **text warning** they either ignore or don't understand

**Text warnings don't work.** A scammer on the phone is louder than a popup on screen.

So we built two features that fight back the same way the scammer does — **with a voice and a face.**

---

## Feature 1 — The Video Guardian (TruGen AI)

### What it is
When a suspicious payment is paused, instead of showing a boring alert box, **a real-looking AI face appears on the user's screen** and talks to them — like a video call from a fraud officer.

### How it feels to the user
```
User taps "Send ₹15,000 to Rahul Kumar"
        │
        ▼
Payment is paused instantly
        │
        ▼
A face appears on screen and says:

"Hi! I'm Aria, your payment guardian.
 I've paused your payment of ₹15,000 to Rahul Kumar.
 The note says 'urgent gift cards' — this is a 
 very common scam pattern. Can you tell me why 
 you're sending this money?"
        │
        ▼
User speaks back. Aria listens and responds.
        │
        ▼
User says "My boss asked me to buy gift cards"
        │
        ▼
Aria says:
"Real bosses never ask for gift cards over phone.
 This is called CEO fraud. I strongly recommend 
 you block this payment right now."
        │
        ▼
User: "Yes, block it."
        │
        ▼
Payment blocked. Conversation saved as audit log.
```

### Why it's powerful
- Aria already **knows everything** — the amount, recipient, risk score, what scam pattern was detected
- Speaks in **simple language** — no jargon, no confusing technical terms
- Works for **everyone** — elderly users, non-tech users, anyone who can have a conversation
- The entire conversation is **saved** as evidence in the audit trail

### Technology Used
> **TruGen AI** — a platform used by real banks like Chime, SoFi, and Santander to build AI video agents. We use their API to trigger the video call the moment a transaction is paused.

---

## Feature 2 — The Emergency Phone Call (Vapi AI)

### What it is
For the **highest risk transactions**, our system **calls the user's actual phone number** — not a notification, not a popup — a real phone call. The AI on the other end talks like a real person and guides the user to safety.

### Why this exists (the key insight)
> Most scams happen while the scammer is already on the phone with the victim.
> When that happens, the user never even looks at the app alert.
> **We need to reach the user on the phone — because that's where they are.**

### How it feels to the user
```
User is on a call with scammer (Line 1)
Scammer says: "Transfer ₹50,000 to this safe account NOW"
        │
        ▼
User opens payment app, initiates transfer
        │
        ▼
Our system detects: CRITICAL RISK
        │
        ▼
System calls user's phone (Line 2) — within seconds
        │
        ▼
User sees: "Incoming call — Payment Guardian"
        │
        ▼
AI voice says:
"This is your payment guardian. I've paused 
 a transfer of ₹50,000. You may currently be 
 speaking with someone who is pretending to be 
 from your bank. Real banks never ask you to 
 transfer money to a safe account. 
 Say BLOCK to stop this payment."
        │
        ▼
User hears this. The scammer's voice is now competing 
with a counter-voice that knows the truth.
        │
        ▼
User says "Block" → Payment blocked.
Call transcript saved to audit log.
```

### Why it's powerful
- Reaches the user **even if the app is closed**
- **Competes directly** with the scammer's voice in real time
- The AI has **full context** — it knows exactly which transaction, what risk was detected, what scam pattern matches
- User only needs to say one word — **no reading, no clicking, no typing**

### Technology Used
> **Vapi AI** — a platform for outbound AI phone calls. One API call from our backend triggers the phone call. The AI voice is powered by the same LLM that analysed the transaction.

---

## How They Work Together

```
Transaction Initiated
        │
        ▼
Risk Score Calculated
        │
        ├── Score 40-70 (MEDIUM RISK)
        │       └── TruGen Video Call appears in-app
        │           User has a conversation, decides
        │
        └── Score 70+ (HIGH / CRITICAL RISK)
                ├── TruGen Video Call in-app (if on app)
                └── Vapi Emergency Call to phone (always)
                    Both happening simultaneously
                    First response wins
```

---

## The Simple Summary

| | Old Way | Our Way |
|---|---|---|
| How user is alerted | Text popup | **A face talks to them** |
| Works while on scammer's call? | ❌ No | ✅ Yes — phone call |
| Understands non-tech users? | ❌ No | ✅ Yes — natural speech |
| Explains the risk? | ❌ Jargon | ✅ Simple spoken words |
| Records what happened? | Partially | ✅ Full conversation audit |

---

> **Core idea in one line:**
> *When someone is about to be scammed, we send a voice and a face — not a text box.*
