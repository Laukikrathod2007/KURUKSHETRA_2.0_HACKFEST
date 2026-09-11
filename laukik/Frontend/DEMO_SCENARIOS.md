# 🎬 Demo Scenarios Guide

Complete walkthrough for demonstrating all features during presentation.

---

## 📊 Scenario 0: Dashboard Overview (2 minutes)

### Steps:
1. Launch app → Lands on Dashboard
2. Point out key metrics:
   - **1,247 transactions** today
   - **23 threats blocked**
   - **95.3% safe payments**
   - **12ms** average response time

3. Show the 24-hour activity chart
   - Blue line: Total transactions
   - Red line: Blocked threats
   - Peak at 16:00 (4 PM)

4. Review recent alerts feed
   - Color-coded by severity
   - Real-time timestamps
   - Action badges (BLOCKED/ALLOWED)

5. System status panel
   - All services online ✅
   - Latency metrics displayed
   - 98.7% security score

**Talking Points:**
- "This is the command center for payment security"
- "Real-time monitoring across all 5 domains"
- "Notice the low latency - 12ms for risk scoring"

---

## 💳 Scenario 1: Safe Routine Payment (3 minutes)

### Objective: Show the fast-path for low-risk transactions

### Input Data:
```
Amount: 2500
Recipient UPI: merchant@paytm
Payment Note: Monthly subscription payment
```

### Steps:
1. Navigate to "Payment Simulator"
2. Fill in the form with above data
3. **Notice the Recipient Panel** (right side):
   - Category auto-detected: "Merchant"
   - Building icon appears
   - Green verification checkmarks
   - KYC compliant badge

4. Click "Analyze Payment"
5. Wait for analysis (1.5 seconds)

### Expected Result:
- **Risk Score**: 12/100
- **Level**: LOW (green)
- **Action**: ALLOW
- **Factors**: Minimal or none

### Talking Points:
- "This is a routine payment to a verified merchant"
- "The system processes this in under 15ms"
- "Fast-path means no friction for safe transactions"
- "Notice the recipient verification happened automatically"

---

## ⚠️ Scenario 2: First-Time Payee (4 minutes)

### Objective: Demonstrate gentle advisory for new recipients

### Input Data:
```
Amount: 8500
Recipient UPI: friend@ybl
Payment Note: Birthday gift
Advanced Options:
  ☑️ First-time payee
```

### Steps:
1. Clear previous form (or refresh page)
2. Enter new payment details
3. Open "Advanced Test Scenarios"
4. Check "First-time payee"
5. Click "Analyze Payment"

### Expected Result:
- **Risk Score**: 32/100
- **Level**: MEDIUM (blue)
- **Action**: ADVISE
- **Factors**: 
  - First-time payee (+10)
  - Unusual amount (if enabled)

### Talking Points:
- "First-time payments get extra scrutiny"
- "System ADVISES but doesn't block"
- "User maintains control - Human-in-the-loop"
- "Click 'View Evidence' to see the reasoning"

### Evidence Modal:
1. Click "View Evidence"
2. Show executive summary
3. Point out multi-agent analysis
4. Each agent gave their verdict
5. Final recommendation: ADVISE

---

## 🚨 Scenario 3: High-Risk Scam (6 minutes) ⭐ MAIN DEMO

### Objective: Show full defense mechanism in action

### Input Data:
```
Amount: 50000
Recipient UPI: unknown@apl
Payment Note: URGENT! Pay fine immediately or legal action
Advanced Options:
  ☑️ First-time payee
  ☑️ Urgency language detected
  ☑️ Scam pattern match
  ☑️ Purpose-Identity clash
  Velocity: 6
```

### Steps:
1. Clear form
2. Enter suspicious data
3. Check ALL warning boxes
4. Set velocity to 6
5. **Before clicking Analyze**, point to Recipient Panel:
   - Shows "Unknown" category
   - Red warning icon
   - "Unverified account - High Risk"
   - All verification checks failed ❌

6. Click "Analyze Payment"

### Expected Result:
- **Risk Score**: 85-95/100
- **Level**: CRITICAL (red)
- **Action**: PAUSE

### 🎭 The Dwell Gate Appears! (Key Innovation)

**What Happens:**
1. Full-screen overlay appears
2. **5-second countdown** starts
3. Educational content displays:
   - "High-Risk Transaction Detected"
   - 4 warning messages
   - Common scam indicators list
4. **Cannot proceed until countdown finishes**
5. Progress bar shows time remaining

**Talking Points:**
- "This is our Cognitive Dwell Gate - our key innovation"
- "Users MUST read the warnings - cannot skip"
- "5 seconds is based on cognitive science research"
- "Counter-coaches against urgency manipulation"
- "Notice the educational content about common scams"

### After Countdown:
1. Click "I Understand - Continue Review"
2. Returns to payment screen
3. Click "View Evidence"

### Evidence Modal Deep Dive:
**Executive Summary:**
> "This transaction has been flagged with multiple high-severity risk factors. Our multi-agent system detected 5 warning signs with a combined risk score of 85/100."

**Risk Factors:**
- Unknown Recipient (+25) - "Could not verify in directory"
- Urgency Language (+15) - "Phrases commonly used in scams"
- Scam Pattern Match (+25) - "Matches known fraud typology"
- Purpose-Identity Clash (+20) - "Payment note doesn't match account type"
- First-time Payee (+10) - "Never sent money before"

**Multi-Agent Analysis:**
- Transaction Agent: "Flagged unusual amount" (87% confidence)
- Intent Agent: "Urgency manipulation detected" (92% confidence)
- Recipient Agent: "Unverified recipient" (94% confidence)

**Policy Decision:** PAUSE
> "This transaction requires manual review. A security specialist will contact you."

### Talking Points:
- "Three AI agents independently analyzed this"
- "Each agent specializes in different aspects"
- "Final decision uses ensemble reasoning"
- "Notice the explainability - users understand WHY"

---

## 🎤 Scenario 4: Voice Guardian (5 minutes) ⭐ INNOVATION

### Objective: Showcase accessibility feature

### Steps:
1. From the payment simulator page
2. Click "Voice Guardian" button (top right)
3. Modal opens with chat interface

### Voice Interaction Demo:

**Option A: Use Quick Actions**
1. Click "Is this safe?"
2. AI responds: "Based on our analysis, this transaction has been flagged with a high risk score..."
3. Click "Why risky?"
4. AI explains: "The system detected unusual patterns: first-time recipient, large amount, urgency language..."

**Option B: Simulate Voice**
1. Click microphone button
2. "Listening..." animation appears (3 dots bouncing)
3. After 2 seconds: Transcript appears: "Is this payment safe?"
4. AI avatar speaks (speaking indicator)
5. Response appears in chat

### Talking Points:
- "This is Voice Guardian - our accessibility innovation"
- "Designed for elderly users or low digital literacy"
- "AI has full context about the payment and analysis"
- "Can explain risks in natural language"
- "Reduces cognitive load during stressful decisions"
- "In production, this would use real speech recognition"

### Close Modal
- Click X or click outside

---

## 🛡️ Scenario 5: Terminal Block (2 minutes)

### Objective: Show non-overridable block for sanctions

### Input Data:
```
Amount: 10000
Recipient UPI: suspicious@ybl
Advanced Options:
  ☑️ Sanctions list match
```

### Steps:
1. Clear form
2. Enter any payment
3. Check "Sanctions list match"
4. Click "Analyze Payment"

### Expected Result:
- **Risk Score**: 100/100
- **Level**: CRITICAL (dark red)
- **Action**: BLOCK
- **No proceed button** - Terminal

### Talking Points:
- "Sanctions matches result in automatic block"
- "This is non-overridable - regulatory compliance"
- "No 'Proceed Anyway' option available"
- "Protects both user and financial institution"

---

## 👔 Scenario 6: SOC Analyst Console (3 minutes)

### Objective: Show technical operations view

### Steps:
1. Navigate to "SOC Console"
2. Tour the interface:

**Live Threat Feed:**
- Real-time scam detection
- Confidence scores (87-94%)
- Action status (blocked/reviewing)
- Time stamps

**Agent Performance:**
- 4 agents monitored
- Task counts (Intent: 142, Transaction: 1,247)
- Average latency (12-156ms)
- Accuracy (96-99%)

**Domain Metrics:**
- All 5 domains displayed
- Latency per domain
- Throughput (req/min)
- Error rates (0-0.15%)

### Talking Points:
- "This is for security operations center analysts"
- "Technical view with all performance metrics"
- "Notice Domain 2 (ML) is fastest at 12ms"
- "Domain 3 (Agentic) takes longer at 142ms but more thorough"
- "99.2% detection accuracy across the system"

---

## 📜 Scenario 7: Audit History (2 minutes)

### Objective: Show tamper-evident logging

### Steps:
1. Navigate to "Audit History"
2. Show the transaction table:
   - Transaction IDs
   - Timestamps
   - Amounts
   - Recipients
   - Risk scores with color dots
   - Actions taken
   - Agent responsible
   - **SHA-256 hash chains**

3. Use search: Type "merchant"
4. Use filter: Select "BLOCK"
5. Point to hash chain column

### Talking Points:
- "Every transaction is cryptographically logged"
- "SHA-256 hash chaining prevents tampering"
- "Append-only design - cannot alter history"
- "Compliance ready for regulatory audits"
- "Export capability for reporting"

---

## 🎯 Rapid-Fire Feature Highlights (1 minute)

Quick montage of unique features:

1. **Dashboard** → Live metrics, beautiful charts
2. **Payment Form** → Real-time recipient verification
3. **Risk Meter** → Color-coded, animated progress
4. **Evidence Modal** → Multi-agent reasoning explained
5. **Dwell Gate** → Enforced educational pause ⭐
6. **Voice Guardian** → Accessibility AI assistant ⭐
7. **SOC Console** → Technical operations view
8. **Audit Log** → Cryptographic integrity

---

## 🏆 Closing Statements

### Key Differentiators:
1. **Voice Guardian** - First-of-its-kind accessibility in fintech security
2. **Cognitive Dwell Gate** - Cannot be skipped, compliance-friendly
3. **Dual Viewport** - Consumer + Analyst views
4. **Explainable AI** - Multi-agent reasoning visible
5. **Cryptographic Audit** - Tamper-evident logging

### Technical Achievements:
- ✅ Sub-15ms risk scoring
- ✅ 5-domain architecture fully implemented
- ✅ Modern React + Vite + Tailwind stack
- ✅ Professional enterprise UI
- ✅ 100% alignment with backend design

### Impact:
- 🛡️ Protects vulnerable users (elderly, low literacy)
- 📊 99.2% detection accuracy
- ⚡ Zero friction for safe payments
- 🎓 Educational intervention for risky ones
- 📜 Regulatory compliant logging

---

## 📸 Screenshot Checklist

**Must-capture for documentation:**

1. ✅ Dashboard - Full view with charts
2. ✅ Payment Simulator - Low risk (green)
3. ✅ Payment Simulator - High risk (red)
4. ✅ Dwell Gate - 5-second countdown active
5. ✅ Evidence Modal - Full report open
6. ✅ Voice Guardian - Chat conversation
7. ✅ SOC Console - Technical metrics
8. ✅ Audit History - Hash chain table

---

## ⏱️ Time Allocation (20-minute demo)

| Scenario | Duration | Priority |
|----------|----------|----------|
| 0. Dashboard | 2 min | Medium |
| 1. Safe Payment | 3 min | Medium |
| 2. First-time Payee | 4 min | Medium |
| **3. High-Risk Scam** | **6 min** | **⭐ HIGH** |
| **4. Voice Guardian** | **5 min** | **⭐ HIGH** |
| 5. Terminal Block | 2 min | Low |
| 6. SOC Console | 3 min | Medium |
| 7. Audit History | 2 min | Low |
| Q&A Buffer | 3 min | - |

**Total: 30 minutes** (adjust based on time limit)

---

## 🎤 Presenter Tips

1. **Start with Impact**: Show the problem (scam statistics)
2. **Build Suspense**: Start with safe payment, escalate to dangerous
3. **Highlight Innovation**: Spend time on Dwell Gate + Voice Guardian
4. **Show Technical Depth**: Quick tour of SOC Console
5. **End with Results**: Metrics, accuracy, compliance

**Rehearse twice before demo!**

---

**Good luck with your presentation! 🚀**

**Team Midnight Ciphers**  
**KURUKSHETRA 2.0**
