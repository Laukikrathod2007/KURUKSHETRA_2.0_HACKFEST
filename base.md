# Kurukshetra — Complete Feature Base
## Every Feature. What It Does. Why It Matters.

---

## How This System Works (In One Paragraph)

Kurukshetra is a central anti-scam intelligence layer that sits between UPI payment apps (Google Pay, PhonePe, Paytm, BHIM — any of them) and the NPCI settlement infrastructure. Every UPI transaction passes through it. The moment a user selects someone to pay, Kurukshetra begins investigating the **recipient and the caller** — not the user. It profiles attackers, not victims. It never listens to calls, never reads messages, never tracks touch pressure. Instead, it checks fraud databases, analyzes the recipient's account behavior, correlates caller reputation, and uses crowd intelligence from millions of other transactions to determine whether this payment is safe, suspicious, or a confirmed scam.

---

## Category A: VPA Resolution Intelligence

These features exploit a simple fact: every UPI payment starts with a **verification step** where the app fetches the registered name for a UPI ID. We own that API call. We can learn from it.

### Verify-to-Abandon Ratio

Every time someone enters a UPI ID to pay, our system fetches the registered name from NPCI. We count how many people looked up a particular account versus how many actually completed the payment. If 87 people checked an account and only 4 paid, that means 83 people saw something suspicious and walked away. That abandonment ratio is crowd intelligence — the collective judgment of hundreds of strangers who each independently decided not to trust this account. When the next potential victim looks up the same UPI ID, we can tell them: "83 other users checked this account recently. Most chose not to pay."

### Resolution Burst Detection

If 20 different users all verify the same UPI ID within a two-hour window, it means a scam campaign is actively running right now. The scammer is calling victims one after another, giving each of them the same payment target. Each victim independently looks up the UPI ID in their payment app. We see this cluster of lookups in real time and recognize it as an active campaign. We can flag every subsequent lookup of that UPI ID with a live warning: "This account is being checked by an unusual number of users right now — a pattern that matches active scam campaigns."

### Beneficiary Name vs. Claimed Identity

When the user verifies a UPI ID, NPCI returns the actual registered name on the bank account. If someone on the phone claimed to be "Inspector Vikramaditya from the Central Bureau of Investigation," but the UPI ID resolves to "Sunil Verma — Personal Savings Account," that contradiction is devastating. Government agencies do not accept payments into personal savings accounts belonging to random individuals. We display this mismatch clearly: "You're about to pay Sunil Verma (Personal Savings Account). Government agencies never accept payments to individual personal accounts."

### UPI Handle Authority Pattern Detection

Scammers create UPI IDs designed to look official — things like `cbi.clearance@oksbi` or `rbi.verification.dept@okhdfc` or `income.tax.refund@okhdfcbank`. No legitimate government agency has UPI IDs structured like this. Real government collection accounts are registered through official channels with proper merchant verification. We maintain a pattern dictionary of government and authority terms and flag any individual personal account whose UPI handle contains them. If the handle says "CBI" but the account is a 4-day-old personal savings account, it's a scam — with near-absolute certainty.

---

## Category B: Session Behavior Intelligence

These features come from our own app's user interface. We control the text fields, the navigation, and the session. This is standard app analytics — not OS-level snooping, not system keyboard access, not touch biometrics. Every app in the world tracks screen views and input events. We just do it smarter.

### Dictation Cadence Detection

When someone types a UPI ID in our app's text field, the rhythm of their typing tells a story. A person typing from memory types unevenly — pausing to remember, making corrections, backspacing, with variable gaps between keystrokes. A person being dictated to over the phone types at a metronomic pace — steady intervals between keystrokes, zero corrections, no pauses, because they're transcribing audio in real time. We measure the variance in inter-keystroke timing within our own input field. Abnormally low variance on a first-time recipient's UPI ID means someone is reading it out to the user character by character.

### Amount Entry Behavior

When a person decides on their own how much to send, they often hesitate — typing an amount, deleting it, trying a different number, settling on a final value. When a person is told exactly how much to send by someone on the phone, they type the amount once, with no edits, and tap Pay. We count the number of edits in the amount field. Zero edits on a high-value first-time payment is a subtle but real signal that the amount was dictated, not decided.

### Session Navigation Fingerprint

A normal person opening their payment app browses a bit — they might check their balance, glance at recent transactions, then navigate to the payment screen. A person being coached through the app by a scammer goes straight from app launch to the payment screen without any detours. We track how many screens the user visited before reaching the payment flow and how long the overall session took. An unusually short, direct session on a high-value first-time payment suggests the user is being walked through the app step by step by someone on the phone.

### Copy-Paste Detection for UPI ID

Did the user type the UPI ID character by character, or did they paste it from their clipboard in one action? If they typed it, they probably know the recipient or are reading it from a physical source. If they pasted it, someone sent it to them — via SMS, WhatsApp, or another messaging channel. A pasted UPI ID for a first-time recipient means the payment target was externally sourced. We detect this through our own input field's event handling — a full UPI ID appearing in a single input event versus character-by-character entry.

---

## Category C: QR Code and Payment Link Forensics

UPI supports payments through QR codes and deep links. Both carry metadata that can reveal whether the payment is legitimate or part of a scam campaign.

### QR Code Provenance Analysis

UPI QR codes come in two types. Static QR codes are printed at shops — they contain the merchant's UPI ID but no amount, and the user types the amount themselves. Dynamic QR codes are generated for a specific transaction — they contain both the recipient and a pre-filled amount. Dynamic QR codes can be sent via WhatsApp or SMS, which means a scammer can generate one and send it to the victim. We also check whether the QR was scanned from a live camera (the user is physically present with the recipient) or from a saved image in the gallery (someone sent the QR as a screenshot). A dynamic QR code loaded from a screenshot, pointing to a personal account with a high pre-filled amount, is almost certainly forwarded scam material.

### Payment Link Forensics

UPI deep links look like `upi://pay?pa=someone@oksbi&am=48000&tn=CBI%20Clearance`. When a user taps such a link, we can analyze its contents before processing. Does the transaction note parameter contain authority-impersonation language? Was the link received via SMS from an unregistered sender ID, which indicates a promotional or spam route rather than a legitimate transactional message? Does the link point to a personal account with a suspiciously high amount? Is the link wrapped in a URL shortener that obscures the actual payment target? All of this is visible to us the moment the user opens the link.

---

## Category D: Network-Level Cross-Victim Intelligence

These features are only possible because we see transactions across ALL connected UPI apps, not just one. They detect patterns that emerge across multiple victims simultaneously.

### Community Scam Reports

After any intervention — whether we warned the user, paused their payment, or challenged them — we ask a simple question: "Was this payment legitimate or suspicious?" Over time, this builds a community-sourced reputation database for UPI IDs, like Truecaller but for payment accounts. When the next user tries to pay the same account, we can display: "12 users have reported this account as suspicious in the last 7 days." Community reporting turns every user into a sensor in a nationwide scam detection network.

### Cross-Victim Caller-Recipient Correlation

This is the most powerful signal in the entire system. If five different users all received a call from the same phone number and then tried to pay the same recipient account within the same day, those aren't five independent events — that's a coordinated scam operation. The caller and the recipient are working together. We detect this pattern by correlating caller information (from opt-in call log access) with payment targets across our entire user base. By victim number five, we know the exact caller-recipient pair and can block it system-wide. Individual apps can never see this — they only see their own users. The central layer sees everyone.

### Verification Fan-In as a Leading Indicator

Banks currently track how many people PAID a given account (payment-level fan-in). We can track how many people LOOKED UP a given account without paying (verification-level fan-in). If 87 people verified an account but only 4 paid, the verification fan-in is dramatically higher than the payment fan-in. This gives us a leading indicator — we detect a scam before most payments complete, not after. The gap between "people who checked" and "people who paid" is a real-time measure of how suspicious an account appears to the general population.

---

## Category E: Transaction Pattern Intelligence

These features analyze the sender's own transaction history and the structure of the current payment to detect patterns characteristic of different scam types.

### Drip Scam Escalation Detection

Many scams don't start with a large payment. They start small and escalate. First, the victim sends five hundred rupees as a "verification." Then two thousand for a "processing fee." Then five thousand for "platform activation." Then fifteen thousand for "tax clearance." Then forty-eight thousand for "final bail payment." Each payment is larger than the last, and the gaps between payments are shrinking. We detect this geometric escalation pattern — multiple payments to the same recipient where each is significantly larger than the previous, with accelerating velocity. This catches slow-burn grooming scams that would slip past any single-transaction analysis.

### Threshold Evasion Detection

Scammers know that large transactions attract scrutiny, so they instruct victims to split payments into smaller chunks just below common alert thresholds. Five transactions of ₹9,999 to the same recipient within thirty minutes, each staying just under ₹10,000, but adding up to ₹49,995. We detect this structured splitting: multiple payments to the same recipient where each is suspiciously close to a round threshold, but the cumulative total exceeds any single historical payment the user has ever made.

### Refund Reversal Scam Detection

A scammer sends ₹1 to the victim, then calls: "I accidentally sent you ₹50,000. Please return it." The victim checks their account, sees a ₹1 credit (or a faked screenshot), and sends ₹50,000 "back." We detect this by checking whether the recipient previously sent a tiny amount to the sender. If there's a prior tiny inbound transaction followed by a much larger outbound transaction to the same account, and the outbound-to-inbound ratio is extreme, this matches the refund reversal scam pattern.

### UPI Collect Request Abuse Detection

UPI supports "collect" requests — where someone can REQUEST money from you, and you approve the request. Scammers exploit this by sending collect requests with misleading notes like "Approve to receive ₹5,000 cashback." The victim approves, thinking they'll receive money, but they're actually authorizing a payment out of their account. We detect high-value collect requests from unknown or flagged UPI IDs, especially when they arrive in multiples from the same unknown sender, and when the request note contains misleading language about receiving money or cashback.

---

## Category F: Recipient Account Forensics

These features analyze the recipient's account behavior using data that banks already possess. No additional data collection is needed — these are patterns visible in standard banking transaction records.

### One-Way Account Detection

Normal bank accounts show two-way transaction flow — money comes in from salary and transfers, money goes out for purchases, bills, and sending to friends. Mule accounts behave completely differently: they only receive money from many different people, and all outbound transactions are forwarding to other mule accounts. They never make normal purchases or pay bills. We calculate the inbound-to-outbound ratio and the nature of outbound transactions. An account that only receives from strangers and only sends to a small set of other accounts is behaviorally distinct from any legitimate account.

### Burst-Drain-Dormant Lifecycle Detection

Mule accounts follow a distinctive lifecycle: they sit dormant with no activity, then suddenly activate and receive payments from many different victims over a short burst period, then rapidly drain all funds by forwarding them to other accounts, then go dormant again. This burst-drain-dormant cycle is unique to mule accounts and is detectable from the temporal pattern of transaction volume. A legitimate account shows steady, continuous activity. A mule account shows dramatic spikes followed by complete silence.

### Scam Hours Activity Concentration

Professional scam operations run on schedules. Most digital arrest calls happen between ten in the morning and six in the evening on weekdays, because that's when impersonation calls are most effective — people are at work, alert, and reachable by phone. Mule accounts associated with these operations show activity concentrated during these hours and go silent on weekends. Regular people's accounts show activity throughout the day and week — grocery shopping at eight in the evening, food delivery at ten at night, weekend purchases. An account whose entire inbound activity is concentrated in weekday business hours is behaving like a professional operation.

---

## Category G: Recipient Intelligence from Banking and Government Infrastructure

These features integrate with existing Indian government and financial infrastructure that was built specifically for fraud prevention.

### Recipient Account Graph Analysis

For every recipient account, the bank already knows: when the account was opened, what level of KYC verification was completed, how many unique people have sent money to this account in the last seven days, from how many different states those senders are located, and how quickly money is moved out after being received. A four-day-old account with minimum KYC that received payments from twenty-three different people across eight states and forwarded all funds within six minutes of receipt is a textbook mule account. A seven-year-old fully verified merchant account receiving payments from local customers and holding funds for normal business operations is clearly legitimate. The bank already has all of this data. We just ask the right questions about it.

### Aadhaar and PAN Cross-Verification

Every Indian bank account is linked to Aadhaar and PAN. We can check whether the recipient's Aadhaar is active, flagged, or suspended. We can check whether other bank accounts linked to the same Aadhaar have been flagged for fraud. We can check whether the occupation declared on PAN matches the volume of money flowing through the account — a PAN that says "Student" attached to an account receiving three lakh rupees per week has an obvious mismatch. We can check whether the KYC was done through in-person verification, video KYC, or just OTP-based verification, with each method carrying a different trust level.

### I4C and CFCFRMS Integration

The Indian government's Indian Cyber Crime Coordination Centre maintains a real-time database of reported cybercrime accounts through the Citizen Financial Cyber Fraud Reporting and Management System. When someone calls the 1930 Cybercrime Helpline and reports a scam, the account details are entered into this system. Banks are already connected to it. We query this database at the moment of payment: has this account been reported? How many times? When was the most recent report? This is direct government criminal intelligence — and it's available via API.

### TRAI and Sanchar Saathi Integration

India's telecom regulator TRAI mandates Caller Name Presentation, which displays the registered name of the caller (not a spoofed display name). The Sanchar Saathi portal allows citizens to report fraudulent SIM cards and check if a phone number has been flagged. We integrate with these systems to check the caller's reputation at the moment of payment: is the caller's number flagged in Sanchar Saathi? Has it been reported on the TRAI spam registry? Is the SIM registered to a person whose Aadhaar is flagged? These are public safety databases with zero privacy cost.

---

## Category H: Intelligent Intervention Design

These aren't detection features — they're about HOW we intervene when we detect a threat. The quality of intervention design determines whether users actually stop or just click through warnings.

### Scam Playbook Intervention

Instead of showing a generic warning like "This might be a scam," we show the user the exact playbook of the scam they're being subjected to — step by step. "Step 1: Someone called you claiming to be from CBI. Step 2: They threatened you with arrest. Step 3: They told you to send money to a safe account. Step 4: You are here. Step 5: After you pay, they will call again asking for more money. They will never stop." This is uncanny for the victim — the system knows exactly what just happened to them. It proves the system understands the situation, which builds trust in the warning. And showing what comes NEXT (they'll ask for more money) breaks the illusion that this is a one-time payment that will make the problem go away.

### Trusted Contact Emergency Override

During setup, users designate one or two trusted contacts — a spouse, a parent, a sibling. When a high-risk payment is detected and paused, the user is offered the option to call their trusted contact before proceeding. The trusted contact receives a notification: "Your family member is about to send ₹48,000 to an account flagged for fraud. They may be under pressure from a scam caller. Would you like to call them?" A scammer can psychologically control one person. They cannot control two. The trusted contact is not under the scammer's emotional manipulation. They will immediately recognize the situation and talk the victim out of it. This is a human circuit breaker.

### Purpose Declaration with Contradiction Detection

For high-value first-time payments, we ask the user to declare the purpose of the payment from a simple dropdown: gift, bill payment, rent, government fee, investment, medical emergency, or other. This forces the user to consciously categorize what they're doing. And it creates exploitable contradictions. If the user selects "Government Fee" but the recipient is a personal savings account belonging to an individual, we flag the contradiction: "Government agencies don't accept payments to personal savings accounts." If the user selects "Investment" but the recipient is a four-day-old unverified personal account, we flag it: "Registered investment platforms are verified businesses, not personal savings accounts." The user's own declaration becomes evidence against the scammer's narrative.

### Voice Explanation Challenge

For the highest-risk interventions, we offer the user the option to record a ten-second voice note explaining why they're making this payment. The purpose is not primarily to analyze the audio — it's to force the victim to articulate their reasoning out loud. Under a scammer's psychological control, the reasoning is: "Because the CBI officer told me I need to pay bail to avoid arrest." When you force someone to say this out loud and hear their own voice say it, the spell often breaks. It's one thing to think it under pressure. It's another to hear yourself explain it. This is a cognitive debiasing technique backed by psychology research — verbalizing a belief forces critical evaluation of that belief.

### Recipient Account Timeline Visualization

Instead of telling the user in text that the account is suspicious, we show them a visual timeline of the account's entire life. Created four days ago. Nothing on day one. Nothing on day two. On day three, eight payments from eight different people totaling three lakh forty-two thousand rupees, with all money forwarded within six minutes. On day four — today — fifteen payments from fifteen people totaling seven lakh eighty-five thousand rupees, all forwarded within four minutes. And at the bottom: "You are about to be person number twenty-four." Numbers in a paragraph are abstract. A visual timeline showing a burst of activity from strangers on a brand-new account is visceral. No amount of "but sir, this is an official government account" survives seeing that timeline.

### One-Tap Real Bank Verification

When the system detects a bank impersonation pattern — someone claiming to be from the user's bank and instructing them to transfer money — we offer a one-tap button to call the user's actual bank helpline. "If your bank really called you, let us connect you to their official helpline. If this is real, they'll confirm it." The verified toll-free number is displayed. The scammer's impersonation collapses the instant the user talks to the real bank. The real bank will immediately tell the user: "We never called you. This is a scam. Do not send any money."

### Post-Payment Regret Window

Even after a payment goes through — if the user overrode all warnings — we provide a fifteen-minute window during which the user can reverse the payment with a single tap. After the scammer hangs up or asks for a second, larger payment, victims often experience a moment of clarity where they realize what just happened. Having a one-tap reversal available during that window catches that moment. We reinforce it with social proof: "Of the 49 people who made a similar payment this month, 31 requested a reversal within ten minutes."

---

## Category I: Cross-App Intelligence (MCP Architecture Exclusive)

These features are only possible because Kurukshetra operates as a central middleware that sees transactions across ALL connected UPI apps, not just one.

### Cross-App Smurfing Detection

A scammer tells the victim: "Send ₹9,999 from Google Pay, then ₹9,999 from PhonePe, then ₹9,999 from Paytm." Each individual app sees a single transaction below any alert threshold. None of them can detect the pattern. But Kurukshetra, sitting as the central intelligence layer, sees the same sender paying the same recipient across three different apps within minutes. It recognizes this as structured splitting across apps to evade per-app detection. This is literally impossible for any individual UPI app to catch. Only a central layer that sees everything can detect cross-app patterns.

### Real-Time Scam Campaign Detection and Termination

Currently, when a scam account is reported, the process goes: victim reports to bank, bank investigates over several days, bank blocks the account, NPCI eventually propagates the block to other banks. This takes days. During those days, dozens more victims lose money to the same account. As a central layer processing millions of transactions across all apps, Kurukshetra can detect a scam campaign within its first hour: multiple victims, all receiving calls from the same number, all directed to pay the same account, across different UPI apps and different cities. We push a hard block on that account to every connected UPI app within forty-five minutes of the first detected victim. Campaign killed.

### Public Scam Score Lookup

A public web portal and API where anyone — not just users of a specific UPI app — can check the safety score of any UPI ID. Enter a UPI ID in a browser and see: risk level, number of user reports, account age, how many people checked it, how many chose not to pay. People can check a UPI ID before making a payment, even from a different device. They can share the safety check link with family members: "Mom, check this link before you pay that person." This extends protection beyond our app to anyone with a web browser.

---

## Category J: Learning and Self-Improvement

These features allow the system to learn from its own interventions and improve over time.

### Post-Hold Escalation Detection

After a payment is paused with a four-hour cooling-off hold, if the user comes back after four hours, confirms the payment, and then immediately initiates a second, even larger payment to the exact same recipient, this indicates the scammer anticipated the hold and coached the victim through it: "The bank will try to stop you. Just wait and then confirm. And then send the rest." We detect this post-hold immediate escalation pattern as a second-order signal that the user is still under the scammer's influence even after the cooling-off period.

### Intervention Effectiveness Tracking

After every intervention — whether we advised, challenged, or paused a payment — we track what happened next. Did the user cancel the payment? Did they proceed anyway? If they proceeded, did they later file a dispute? What percentage of users abort at each intervention level? Which coaching messages produce the highest abort rates? This creates a feedback loop where we continuously optimize our intervention language, our warning designs, and our escalation thresholds based on what actually changes user behavior in the real world.

---

## Category K: UPI-Specific Indian Infrastructure Features

### Multi-VPA Phone Mapping Detection

When a phone number is entered for payment, we can check how many different UPI IDs are linked to it. A normal person has one or two UPI IDs — one per bank account. A mule operator running multiple accounts from a single phone might have seven UPI IDs across four different banks, all individual personal accounts, all created within the last thirty days. That concentration of new accounts on a single phone number is a mule recruitment pattern — someone systematically opened accounts at multiple banks to serve as payment collection points.

### Refund Fraud via Collect Request

Scammers send tiny UPI collect requests to victims — requesting ₹1 or ₹10 — and when the victim approves (thinking it's trivial), the scammer follows up with a call: "I sent you money by mistake, please return it" or uses the successful collect as social engineering leverage for a larger scam. We track sequences where a tiny collect request is followed by a large outbound payment to the same account, flagging the pattern as a potential setup for refund fraud.

---

## The Underlying Philosophy

Every single one of these features shares three properties:

**First, they investigate the attacker, not the victim.** We never listen to the user's calls, read their messages, track their location, measure their hand tremors, or monitor their screen. We analyze the recipient's account, the caller's reputation, the crowd's collective judgment, and the infrastructure's own metadata.

**Second, they use data that already exists.** Banks already have transaction graphs. NPCI already resolves UPI IDs to names. TRAI already tracks spam complaints. I4C already maintains a fraud database. We don't create new surveillance — we ask smarter questions about existing data.

**Third, they respect the user's autonomy.** The system advises, challenges, and pauses — but it never silently blocks a legitimate payment. For genuine emergencies, the system steps aside with a gentle informational message. It earns trust by being right when it intervenes and invisible when it shouldn't.
