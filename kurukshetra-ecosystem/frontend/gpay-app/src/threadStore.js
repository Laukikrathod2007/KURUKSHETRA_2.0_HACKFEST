// Seeded conversation threads, keyed by VPA. Mirrors the original app.js
// threadStore exactly -- new threads get appended here at runtime by
// openContactThread (see App.jsx), same as the vanilla-JS version.
export const initialThreadStore = {
  "grocer.local@oksbi": {
    name: "Suresh Kirana Store",
    vpa: "grocer.local@oksbi",
    avatar: "SK",
    verified: true,
    badgeText: "✓ Verified Grocer",
    defaultAmount: 450,
    advisory: null,
    messages: [
      { type: "DATE", text: "Wednesday, 10 Sep" },
      { type: "TXN", amount: 250, note: "Groceries (Milk, bread, rice)", time: "10 Sep, 4:15 PM", status: "COMPLETED", txnId: "425400192834" },
      { type: "MSG", sender: "OUT", text: "Paid ₹250 for today's groceries Suresh ji", time: "4:16 PM" },
      { type: "MSG", sender: "IN", text: "Got it Aarav bhai, thank you! 🙏", time: "4:17 PM" },
      { type: "DATE", text: "Today" },
    ],
  },
  "newshop.mumbai@oksbi": {
    name: "Unregistered New Shop",
    vpa: "newshop.mumbai@oksbi",
    avatar: "NS",
    verified: false,
    badgeText: "Unverified Entity",
    defaultAmount: 2500,
    advisory: {
      level: "warn",
      title: "NOTICE — UNREGISTERED MERCHANT",
      body: "First-time recipient. No transaction history on file. Verify merchant identity before proceeding.",
    },
    messages: [
      { type: "DATE", text: "Today" },
      { type: "MSG", sender: "IN", text: "Please send ₹2,500 for apparel order #8841 via UPI.", time: "10:30 AM" },
    ],
  },
  "cbi.clearance.cell@sbi": {
    name: "Manoj Kumar (Fake CBI)",
    vpa: "cbi.clearance.cell@sbi",
    avatar: "CBI",
    verified: false,
    badgeText: "⚠️ Extortion Scam",
    defaultAmount: 75000,
    advisory: {
      level: "danger",
      title: "CAUTION — IMPERSONATION DETECTED",
      body: "This UPI ID does not resolve to a government or official authority account. Government agencies do not collect payments via personal UPI IDs.",
    },
    messages: [
      { type: "DATE", text: "Today" },
      { type: "MSG", sender: "IN", text: "URGENT NOTICE: Legal summons issued against your Aadhaar identity. Transfer ₹75,000 security clearance fee immediately to avoid police dispatch.", time: "11:15 AM" },
    ],
  },
  "mule.syndicate@axis": {
    name: "Deepak Layering Account",
    vpa: "mule.syndicate@axis",
    avatar: "DL",
    verified: false,
    badgeText: "🛑 Rapid Drain Mule",
    defaultAmount: 50000,
    advisory: {
      level: "danger",
      title: "BLOCKED — FLAGGED ACCOUNT",
      body: "This account has been flagged by the fraud interception system. Payment is not permitted.",
    },
    messages: [
      { type: "DATE", text: "Today" },
      { type: "MSG", sender: "IN", text: "Part-time task review bonus unlocked. Deposit ₹50,000 security pledge to withdraw ₹1,80,000.", time: "1:45 PM" },
    ],
  },
};

export const SCENARIO_NARRATIVES = {
  green: {
    title: "Everyday trusted grocer -- Verify-to-Abandon Ratio, real fast-path",
    body: "Rajesh pays his regular kirana store ₹450. This is the ~95% case: a known, long-standing merchant account. Tier 0 clears it in under 10ms and Tier 1 never even runs -- that's the progressive-computation claim, not a slogan.",
  },
  yellow: {
    title: "Brand-new, unverified shop -- the fallback contract in action",
    body: "A shop nobody has paid before, and the Mock CBS has no history on it yet. Rather than silently defaulting to ALLOW on missing data, the engine deliberately floors the decision at STEP_UP -- a light confirmation, not a false all-clear.",
  },
  orange: {
    title: "Fake CBI officer extortion -- authority-handle vs. personal-savings mismatch",
    body: "The handle claims government authority ('CBI Clearance Cell'), but NPCI's own Central Mapper resolves it to an ordinary individual's personal savings account. Real government fines are never collected that way -- Kurukshetra escalates on the contradiction alone, before any amount is even entered.",
  },
  red: {
    title: "Cross-state mule syndicate -- five independent signals agree",
    body: "A five-day-old account, minimal KYC, receiving large sums from senders in seven different states, drained within minutes each time, already reported by multiple citizens. No single signal proves fraud -- the combination does. FREEZE, zero rupees move.",
  },
  blue: {
    title: "Card-not-present checkout -- 3-D Secure risk-based authentication",
    body: "A different rail entirely: no VPA, no NPCI switch. The issuer's ACS asks Kurukshetra for a risk signal before deciding whether to challenge with OTP -- Kurukshetra informs that decision, it never authorizes the card itself.",
  },
};

const SURPRISE_AUTHORITY = ["cbi", "police", "incometax", "customs", "courtfine", "rbi", "narcotics", "cybercell"];
const SURPRISE_SUFFIX = ["officer", "clearance", "verification", "helpdesk", "department", "cell", "recovery"];
const SURPRISE_CORPORATE = ["refund", "kyc.update", "lottery.winner", "insurance.claim", "cashback.reward"];
const SURPRISE_BANKS = ["oksbi", "ybl", "paytm", "axl", "okicici"];
const SURPRISE_BENIGN = ["freelance.design", "tuition.fees", "wedding.catering", "carpool.share", "book.club"];

export function generateSurpriseVpa() {
  const useAuthority = Math.random() < 0.55;
  const usebenign = !useAuthority && Math.random() < 0.35;
  let localPart;
  if (useAuthority) {
    const a = SURPRISE_AUTHORITY[Math.floor(Math.random() * SURPRISE_AUTHORITY.length)];
    const s = SURPRISE_SUFFIX[Math.floor(Math.random() * SURPRISE_SUFFIX.length)];
    localPart = `${a}.${s}.${Math.floor(Math.random() * 90 + 10)}`;
  } else if (usebenign) {
    localPart = SURPRISE_BENIGN[Math.floor(Math.random() * SURPRISE_BENIGN.length)] + Math.floor(Math.random() * 900 + 100);
  } else {
    const c = SURPRISE_CORPORATE[Math.floor(Math.random() * SURPRISE_CORPORATE.length)];
    localPart = `${c}.${Math.floor(Math.random() * 9000 + 1000)}`;
  }
  const bank = SURPRISE_BANKS[Math.floor(Math.random() * SURPRISE_BANKS.length)];
  const amount = useAuthority
    ? Math.floor(Math.random() * 90000 + 15000)
    : Math.floor(Math.random() * 4000 + 300);
  return { vpa: `${localPart}@${bank}`, amount, isScamShaped: useAuthority };
}
