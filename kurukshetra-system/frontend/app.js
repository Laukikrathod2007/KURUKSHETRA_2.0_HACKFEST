const API_BASE = window.KURUKSHETRA_API_BASE;
const PAYER_ID = "payer_demo_rajesh";

const SCENARIOS = {
  green: { beneficiary: "grocer.local@oksbi", purpose: "", amount: 400 },
  yellow: { beneficiary: "newshop.mumbai@oksbi", purpose: "", amount: 1200 },
  orange: { beneficiary: "cbi.clearance.cell@sbi", purpose: "GOVT_FINE", amount: 75000 },
  red: { beneficiary: "mule.syndicate@axis", purpose: "", amount: 35000 },
};

let currentTxn = null;
let currentResolved = null;
let lastRiskPayload = null;

const $ = (id) => document.getElementById(id);

document.querySelectorAll("[data-scenario]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const s = SCENARIOS[btn.dataset.scenario];
    $("beneficiary").value = s.beneficiary;
    $("purpose").value = s.purpose;
    $("amount").value = s.amount;
    resetFlow();
    initiate();
  });
});

$("initiateBtn").addEventListener("click", () => {
  resetFlow();
  initiate();
});

$("toggleJudgePanel").addEventListener("click", () => {
  $("judgePanel").classList.toggle("open");
});

function resetFlow() {
  $("resolutionCard").classList.add("hidden");
  $("amountCard").classList.add("hidden");
  $("decisionCard").classList.add("hidden");
  $("decisionCard").innerHTML = "";
  $("judgePanel").innerHTML = "";
}

async function initiate() {
  const beneficiary = $("beneficiary").value.trim();
  const purpose = $("purpose").value || null;
  if (!beneficiary) {
    alert("Enter a UPI ID first.");
    return;
  }

  const res = await fetch(`${API_BASE}/pay/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      payer_id_hash: PAYER_ID,
      beneficiary_ref_hash: beneficiary,
      declared_purpose: purpose,
    }),
  });
  const data = await res.json();

  currentTxn = data.transaction_id;
  currentResolved = { name: data.resolved_name, mc_code: data.mc_code };
  lastRiskPayload = data.risk;

  $("resolutionCard").classList.remove("hidden");
  $("resolvedName").textContent = `${data.resolved_name} (MCC ${data.mc_code})`;
  $("resolutionZone").innerHTML = zoneBanner(data.risk.risk_zone, data.ui_hint);
  renderJudgePanel(data.risk);

  if (data.risk.risk_zone === "FREEZE") {
    // Already frozen at Event 1 -- no point showing the amount step.
    $("decisionCard").classList.remove("hidden");
    $("decisionCard").innerHTML = frozenAtLookupCard(data);
    return;
  }

  $("amountCard").classList.remove("hidden");
}

$("payBtn").addEventListener("click", confirmPayment);

async function confirmPayment() {
  const amount = parseFloat($("amount").value);
  if (!amount || amount <= 0) {
    alert("Enter a valid amount.");
    return;
  }
  const purpose = $("purpose").value || null;

  const res = await fetch(`${API_BASE}/pay/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_id: currentTxn,
      payer_id_hash: PAYER_ID,
      beneficiary_ref_hash: $("beneficiary").value.trim(),
      resolved_name: currentResolved.name,
      mc_code: currentResolved.mc_code,
      amount,
      declared_purpose: purpose,
    }),
  });
  const data = await res.json();
  lastRiskPayload = data.risk;
  renderJudgePanel(data.risk);
  renderDecision(data);
}

function zoneBanner(zone, text) {
  return `<div class="zone-banner zone-${zone}">${text}</div>`;
}

function frozenAtLookupCard(data) {
  return `
    <h2>Blocked before amount entry</h2>
    ${zoneBanner("FREEZE", "This recipient is already blocked based on recipient-side signals alone.")}
    <p style="font-size:.85rem;color:var(--ink-soft);">Reasons: ${data.risk.reasons.join(", ") || "none"}</p>
  `;
}

function renderDecision(data) {
  const zone = data.risk.risk_zone;
  const card = $("decisionCard");
  card.classList.remove("hidden");

  if (zone === "ALLOW") {
    card.innerHTML = `
      <h2>Payment proceeding</h2>
      ${zoneBanner("ALLOW", "No risk signals fired. Proceeding straight to PIN entry.")}
      <button class="btn-primary" id="pinBtn">Enter UPI PIN (simulated)</button>
    `;
    $("pinBtn").addEventListener("click", () => alert("PIN accepted (simulated). Payment settled. Kurukshetra was not consulted again."));
    return;
  }

  if (zone === "STEP_UP") {
    card.innerHTML = `
      <h2>Quick confirmation</h2>
      ${zoneBanner("STEP_UP", "This recipient is new, or some data wasn't fully available. Please confirm the details above are correct.")}
      <button class="btn-primary" id="confirmStepUp">Confirm &amp; continue to PIN</button>
    `;
    $("confirmStepUp").addEventListener("click", () => alert("PIN accepted (simulated). Payment settled."));
    return;
  }

  if (zone === "COACH") {
    const explanation = data.intervention?.explanation || "";
    card.innerHTML = `
      <h2>Please review before proceeding</h2>
      ${zoneBanner("COACH", "This transaction has been flagged as suspicious.")}
      <div class="explanation">${explanation}</div>
      <div class="ack-row">
        <input type="checkbox" id="ackBox" />
        <label for="ackBox" style="margin:0;">I understand that this transaction has been flagged as suspicious and I choose to proceed at my own risk.</label>
      </div>
      <button class="btn-danger" id="proceedAnyway" disabled>Proceed to PIN</button>
      <button class="btn-secondary" id="cancelPayment">Cancel payment</button>
    `;
    const ack = $("ackBox");
    const proceedBtn = $("proceedAnyway");
    ack.addEventListener("change", () => { proceedBtn.disabled = !ack.checked; });
    proceedBtn.addEventListener("click", () => alert("PIN accepted (simulated). Payment settled despite warning."));
    $("cancelPayment").addEventListener("click", () => { card.innerHTML = "<h2>Payment cancelled.</h2>"; });
    return;
  }

  if (zone === "FREEZE") {
    const explanation = data.intervention?.explanation || "";
    const helpline = data.intervention?.helpline;
    card.innerHTML = `
      <h2>Payment blocked</h2>
      ${zoneBanner("FREEZE", "HARD BLOCK -- this payment cannot proceed.")}
      <div class="explanation">${explanation}</div>
      ${helpline ? `<p style="margin-top:12px;"><b>Verified helpline:</b> ${helpline}</p>` : ""}
      <p style="font-size:.82rem;color:var(--ink-soft);margin-top:10px;">No acknowledgment can bypass this decision. A trusted contact has been notified (simulated).</p>
    `;
  }
}

function renderJudgePanel(risk) {
  const panel = $("judgePanel");
  const rows = risk.signals
    .map((s) => {
      const cls = s.triggered ? "signal-fired" : "signal-clear";
      return `<div class="signal-row">
        <span>${s.feature_name} <span class="badge badge-${s.label}">${s.label}</span></span>
        <span class="${cls}">${s.triggered ? "FIRED (+" + s.risk_contribution + ")" : "clear"}</span>
      </div>`;
    })
    .join("");
  panel.innerHTML = `
    <p style="font-size:.85rem;"><b>Risk score:</b> ${risk.risk_score.toFixed(2)} &nbsp;
    <b>Confidence:</b> ${risk.confidence.toFixed(2)} &nbsp;
    <b>Data completeness:</b> ${risk.data_completeness} &nbsp;
    <b>Tier reached:</b> ${risk.tier_reached}</p>
    ${rows}
  `;
}
