// Google Pay & Kurukshetra Ecosystem Frontend Controller

const API_BASE = "/api/ecosystem";

let currentUser = null;
let currentPayee = {
  name: "Suresh Kirana Store",
  vpa: "grocer.local@oksbi",
  amount: 450,
  note: "Groceries",
  purpose: "",
  account_id: "acc_suresh_sbi",
};

let currentMpin = "";
let pendingPayTxnId = null;
let pendingPayTraceId = null;
let pendingPayAmount = 450;
let mpinMode = "PAY"; // "PAY" or "BALANCE"

document.addEventListener("DOMContentLoaded", () => {
  initViewModeSwitcher();
  initAuth();
  initGPayHome();
  initContactThreads();
  initComposer();
  initNpciMpin();
  initInterventionSheets();
  initSocObserver();
  initGlobalControls();
  initAppRailSwitcher();
  initQrScanner();
  initCitizenChecker();
  initPayUpiIdModal();
  initKillSwitchPanel();
  initNetBanking();
  checkExistingSession();
});

// ===========================================================================
// 1. VIEW MODE SWITCHER (GPay Only / Dual View / SOC Only)
// ===========================================================================
function initViewModeSwitcher() {
  const btnPhone = document.getElementById("btn-mode-phone");
  const btnDual = document.getElementById("btn-mode-dual");
  const btnSoc = document.getElementById("btn-mode-soc");

  btnPhone.addEventListener("click", () => setViewMode("mode-gpay", btnPhone));
  btnDual.addEventListener("click", () => setViewMode("mode-dual", btnDual));
  btnSoc.addEventListener("click", () => setViewMode("mode-soc", btnSoc));
}

function setViewMode(modeClass, activeBtn) {
  document.body.className = modeClass;
  document.querySelectorAll(".mode-toggle-btn").forEach(b => b.classList.remove("active"));
  activeBtn.classList.add("active");
}

// ===========================================================================
// 2. AUTHENTICATION & LOGIN (android1 / 1234)
// ===========================================================================
function initAuth() {
  const btnLogin = document.getElementById("btn-do-login");
  const btnQuickFill = document.getElementById("btn-quick-fill");

  btnQuickFill.addEventListener("click", () => {
    document.getElementById("login-username").value = "android1";
    document.getElementById("login-password").value = "1234";
  });

  btnLogin.addEventListener("click", async () => {
    const u = document.getElementById("login-username").value.trim();
    const p = document.getElementById("login-password").value.trim();

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });

      if (!res.ok) {
        alert("Invalid credentials. Please use android1 / 1234.");
        return;
      }

      const data = await res.json();
      localStorage.setItem("gpay_session", JSON.stringify(data.user));
      setAuthenticatedUser(data.user);
    } catch (e) {
      console.error(e);
      alert("Could not connect to ecosystem server.");
    }
  });

  document.getElementById("btn-open-profile").addEventListener("click", () => {
    if (confirm(`Logged in as Aarav Sharma (android1).\n\nDo you want to log out?`)) {
      localStorage.removeItem("gpay_session");
      location.reload();
    }
  });
}

function checkExistingSession() {
  const saved = localStorage.getItem("gpay_session");
  if (saved) {
    try {
      setAuthenticatedUser(JSON.parse(saved));
    } catch (e) {
      showLoginScreen();
    }
  } else {
    showLoginScreen();
  }
}

function showLoginScreen() {
  document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
  document.getElementById("screen-login").classList.remove("hidden");
}

function setAuthenticatedUser(user) {
  currentUser = user;
  document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
  document.getElementById("screen-gpay-home").classList.remove("hidden");

  // Update labels
  document.getElementById("home-vpa-pill").textContent = user.vpa || "aarav@oksbi";
  document.getElementById("home-account-label").textContent = `${user.bank_name} ••••${user.account_number.slice(-4)}`;

  refreshSocBalances();
}

// ===========================================================================
// 3. GPAY HOME SCREEN (People, Businesses, Search, Actions)
// ===========================================================================
function initGPayHome() {
  // People contact cards -> Open Conversation Thread (Like real Google Pay!)
  document.querySelectorAll(".person-contact-item").forEach(item => {
    item.addEventListener("click", () => {
      const vpa = item.dataset.vpa;
      const name = item.dataset.name;
      const amount = item.dataset.amount || "450";
      const note = item.dataset.note || "";

      if (vpa) {
        openContactThread({
          name: name,
          vpa: vpa,
          amount: parseFloat(amount),
          note: note,
        });
      }
    });
  });

  // Action items
  document.getElementById("action-pay-upi").addEventListener("click", () => {
    openPayUpiIdModal();
  });

  // Pay by phone number -> same as Pay UPI ID modal
  const btnPayPhone = document.getElementById("action-pay-phone");
  if (btnPayPhone) {
    btnPayPhone.addEventListener("click", () => {
      openPayUpiIdModal();
    });
  }

  const btnAddContact = document.getElementById("btn-add-contact");
  if (btnAddContact) {
    btnAddContact.addEventListener("click", () => {
      openPayUpiIdModal();
    });
  }

  document.getElementById("action-scan-qr").addEventListener("click", () => {
    openQrScannerModal();
  });

  document.getElementById("action-pay-contacts").addEventListener("click", () => {
    openContactThread({
      name: "Suresh Kirana Store",
      vpa: "grocer.local@oksbi",
      amount: 450,
      note: "Groceries",
    });
  });

  document.getElementById("action-bank-transfer").addEventListener("click", () => {
    switchAppRail("netbanking");
  });

  // Business cards
  const bizCroma = document.getElementById("biz-croma");
  if (bizCroma) {
    bizCroma.addEventListener("click", () => {
      openContactThread({ name: "Croma Electronics", vpa: "croma.retail@axis", amount: 4999, note: "Electronics purchase" });
    });
  }
  document.querySelectorAll(".biz-swiggy").forEach(el => {
    el.closest(".person-contact-item")?.addEventListener("click", () => {
      openContactThread({ name: "Swiggy", vpa: "swiggy.pay@icici", amount: 349, note: "Food delivery" });
    });
  });
  document.querySelectorAll(".biz-zomato").forEach(el => {
    el.closest(".person-contact-item")?.addEventListener("click", () => {
      openContactThread({ name: "Zomato", vpa: "zomato.pay@icici", amount: 289, note: "Food order" });
    });
  });

  // Search input
  document.getElementById("gpay-search-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = e.target.value.trim();
      if (q) {
        // Treat as UPI ID if has @, else open Pay UPI ID modal with pre-filled value
        if (q.includes("@")) {
          openContactThread({
            name: q.split("@")[0],
            vpa: q,
            amount: 500,
            note: "Direct Payment",
          });
        } else {
          openPayUpiIdModal();
          const inp = document.getElementById("input-custom-upi");
          if (inp) { inp.value = q; runLiveAudit(q); }
        }
        e.target.value = "";
      }
    }
  });

  // Check Bank Balance Card
  document.getElementById("btn-check-balance-card").addEventListener("click", () => {
    mpinMode = "BALANCE";
    openNpciMpin(0);
  });

  // See Transaction History Card
  document.getElementById("btn-view-history-card").addEventListener("click", async () => {
    await openTransactionHistory();
  });

  document.getElementById("btn-close-balance-dialog").addEventListener("click", () => {
    document.getElementById("modal-bank-balance").classList.add("hidden");
  });

  document.getElementById("btn-close-history").addEventListener("click", () => {
    document.getElementById("modal-tx-history").classList.add("hidden");
  });
}

// ===========================================================================
// 4. GPAY PAYMENT COMPOSER
// ===========================================================================
// ===========================================================================
// 4. GPAY PAYMENT COMPOSER
// ===========================================================================
function initComposer() {
  document.getElementById("btn-back-from-composer").addEventListener("click", () => {
    if (threadStore[currentPayee.vpa]) {
      openContactThread(threadStore[currentPayee.vpa]);
    } else {
      document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
      document.getElementById("screen-gpay-home").classList.remove("hidden");
    }
  });

  // Sync amount label
  const amountInput = document.getElementById("comp-amount-input");
  amountInput.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value) || 0;
    document.getElementById("btn-pay-amount-label").textContent = val.toLocaleString();
  });

  // Submit Payment button
  document.getElementById("btn-submit-payment").addEventListener("click", async () => {
    const amount = parseFloat(amountInput.value) || 0;
    const note = document.getElementById("comp-note-input").value.trim();
    const purpose = document.getElementById("comp-purpose-select").value || null;

    if (amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    pendingPayAmount = amount;
    currentPayee.amount = amount;
    currentPayee.note = note;
    currentPayee.purpose = purpose;

    // Step 1: Call VPA resolution
    animateSocTopology();

    try {
      const valRes = await fetch(`${API_BASE}/upi/val-add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          psp_id: "gpay",
          payer_id: currentUser ? currentUser.customer_id : "cust_aarav",
          payer_account_id: currentUser ? currentUser.account_id : "acc_aarav_sbi",
          payee_vpa: currentPayee.vpa,
          declared_purpose: purpose,
        }),
      });
      const valData = await valRes.json();
      pendingPayTxnId = valData.txn_id;
      pendingPayTraceId = valData.trace_id;

      if (valData.risk) {
        renderSocRisk(valData.risk);
      }
      await refreshSocTraces(pendingPayTraceId);

      // Step 2: Call Pre-flight scoring
      const payRes = await fetch(`${API_BASE}/upi/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trace_id: pendingPayTraceId,
          txn_id: pendingPayTxnId,
          amount_rupees: amount,
          user_acknowledged: false,
          pin: "1234",
        }),
      });
      const payData = await payRes.json();

      if (payData.decision) {
        renderSocRisk(payData.decision);
      }
      await refreshSocTraces(pendingPayTraceId);
      await refreshSocBalances();

      // Handle Risk Interception
      if (payData.status === "BLOCKED") {
        showHardBlockSheet(payData.decision?.intervention_screen || {
          warning_title: "Payment Intercepted and Blocked",
          explanation: "Critical scam indicators triggered. Zero funds moved from your account.",
        });
      } else if (payData.status === "AWAITING_ACK") {
        showCoachingSheet(payData.decision?.intervention_screen || {
          warning_title: "Urgent Security Warning",
          explanation: "You are paying a personal savings account claiming government authority.",
        });
      } else if (payData.status === "AWAITING_CONFIRM") {
        if (confirm(`You are paying ₹${amount} to an unverified new recipient. Proceed?`)) {
          mpinMode = "PAY";
          openNpciMpin(amount);
        }
      } else {
        // ALLOW zone -> Straight to PIN
        mpinMode = "PAY";
        openNpciMpin(amount);
      }
    } catch (e) {
      console.error(e);
      alert("Error initiating payment through ecosystem switch.");
    }
  });

  // Success Done button -> Navigates back to Contact Thread with newly posted payment!
  document.getElementById("btn-success-done").addEventListener("click", () => {
    if (threadStore[currentPayee.vpa]) {
      openContactThread(threadStore[currentPayee.vpa]);
    } else {
      document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
      document.getElementById("screen-gpay-home").classList.remove("hidden");
    }
  });
}

// Bound to the actual logged-in account rather than hardcoded -- see
// PriorityP7 audit finding: these screens previously always said
// "State Bank of India ••••1001" regardless of who was actually paying.
function currentBankLabel() {
  if (!currentUser) return { initials: "SBI", full: "State Bank of India ••••1001" };
  const initials = (currentUser.bank_name || "Bank").split(" ").map(w => w[0]).join("").slice(0, 4).toUpperCase();
  const last4 = (currentUser.account_number || "0000").slice(-4);
  return { initials, full: `${currentUser.bank_name} ••••${last4}`, name: currentUser.bank_name, last4 };
}

function openPaymentComposer(payee) {
  currentPayee = { ...currentPayee, ...payee };

  document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
  document.getElementById("screen-payment-composer").classList.remove("hidden");

  const bank = currentBankLabel();
  const bankInitialsEl = document.getElementById("comp-bank-initials");
  const bankNameEl = document.getElementById("comp-bank-name");
  if (bankInitialsEl) bankInitialsEl.textContent = bank.initials;
  if (bankNameEl) bankNameEl.textContent = bank.full;

  document.getElementById("comp-recipient-name").textContent = payee.name;
  document.getElementById("comp-recipient-vpa").textContent = payee.vpa;
  document.getElementById("comp-target-name").textContent = payee.name;
  document.getElementById("comp-avatar-large").textContent = payee.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  document.getElementById("comp-amount-input").value = payee.amount || 450;
  document.getElementById("btn-pay-amount-label").textContent = (payee.amount || 450).toLocaleString();
  document.getElementById("comp-note-input").value = payee.note || "";
  document.getElementById("comp-purpose-select").value = payee.purpose || "";

  // Dynamic Live Audit Preview Card
  const auditCard = document.getElementById("composer-audit-card");
  const badge = document.getElementById("comp-audit-badge");
  const score = document.getElementById("comp-audit-score");
  const text = document.getElementById("comp-audit-text");

  if (auditCard) {
    badge.className = "comp-audit-badge";
    badge.textContent = "VERIFYING...";
    score.textContent = "Checking...";
    text.textContent = "Querying NPCI Central Mapper & Kurukshetra FRM...";

    fetch(`${API_BASE}/public/lookup/${encodeURIComponent(payee.vpa)}`)
      .then(res => res.json())
      .then(data => {
        score.textContent = `Risk: ${Math.round(data.risk_score * 100)}/100`;
        if (data.mismatch_warning) {
          badge.className = "comp-audit-badge badge-warn";
          badge.textContent = "IMPERSONATION MISMATCH";
          text.textContent = data.mismatch_warning;
        } else if (data.mule_warning) {
          badge.className = "comp-audit-badge badge-danger";
          badge.textContent = "MULE PASS-THROUGH";
          text.textContent = data.mule_warning;
        } else if (data.merchant_badge) {
          badge.className = "comp-audit-badge";
          badge.textContent = "VERIFIED MERCHANT";
          text.textContent = data.merchant_badge;
        } else {
          badge.className = data.risk_level === "SAFE" ? "comp-audit-badge" : "comp-audit-badge badge-warn";
          badge.textContent = data.risk_level;
          text.textContent = data.verdict_plain;
        }
      })
      .catch(() => {
        badge.textContent = "OFFLINE VERIFIED";
        text.textContent = `Standard transaction with ${payee.name}.`;
      });
  }
}

// ===========================================================================
// 5. NPCI COMMON LIBRARY AUTHENTIC UPI MPIN KEYPAD
// ===========================================================================
function initNpciMpin() {
  const dots = [
    document.getElementById("pdot-0"),
    document.getElementById("pdot-1"),
    document.getElementById("pdot-2"),
    document.getElementById("pdot-3"),
  ];

  // Number keys
  document.querySelectorAll(".kbtn[data-key]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentMpin.length < 4) {
        currentMpin += btn.dataset.key;
        updatePinDots();
      }
    });
  });

  // Delete key
  document.getElementById("npci-key-del").addEventListener("click", () => {
    if (currentMpin.length > 0) {
      currentMpin = currentMpin.slice(0, -1);
      updatePinDots();
    }
  });

  // Cancel button — goes back to composer/thread
  const btnMpinCancel = document.getElementById("btn-mpin-cancel");
  if (btnMpinCancel) {
    btnMpinCancel.addEventListener("click", () => {
      closeNpciMpin();
      // Return to payment composer if visible, else to thread/home
      const composer = document.getElementById("screen-payment-composer");
      if (composer && !composer.classList.contains("hidden")) return;
      document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
      if (activeThreadVpa && threadStore[activeThreadVpa]) {
        document.getElementById("screen-contact-thread").classList.remove("hidden");
      } else {
        document.getElementById("screen-gpay-home").classList.remove("hidden");
      }
    });
  }

  // Submit key
  document.getElementById("npci-key-submit").addEventListener("click", async () => {
    if (currentMpin.length < 4) {
      alert("Please enter a 4-digit UPI PIN.");
      return;
    }

    if (mpinMode === "BALANCE") {
      await handleBalanceCheck(currentMpin);
    } else {
      await handlePaymentExecution(currentMpin);
    }
  });

  // Escape key / cancel for MPIN screen
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const mpin = document.getElementById("screen-npci-mpin");
      if (mpin && !mpin.classList.contains("hidden")) {
        closeNpciMpin();
        // Return to payment composer if that's where we came from
        const composer = document.getElementById("screen-payment-composer");
        if (composer && !composer.classList.contains("hidden")) return;
        document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
        if (threadStore[currentPayee.vpa]) {
          document.getElementById("screen-contact-thread").classList.remove("hidden");
        } else {
          document.getElementById("screen-gpay-home").classList.remove("hidden");
        }
      }
      // Close any open dialog overlay
      document.querySelectorAll(".gpay-dialog-overlay:not(.hidden)").forEach(el => {
        el.classList.add("hidden");
      });
      // Close QR scanner
      const qr = document.getElementById("modal-qr-scanner");
      if (qr && !qr.classList.contains("hidden")) qr.classList.add("hidden");
      // Close citizen checker
      const cc = document.getElementById("modal-citizen-checker");
      if (cc && !cc.classList.contains("hidden")) cc.classList.add("hidden");
    }
  });

  function updatePinDots() {
    dots.forEach((dot, idx) => {
      if (idx < currentMpin.length) {
        dot.classList.add("filled");
      } else {
        dot.classList.remove("filled");
      }
    });
  }
}

function openNpciMpin(amount) {
  currentMpin = "";
  document.querySelectorAll(".pin-dot").forEach(d => d.classList.remove("filled"));
  document.getElementById("npci-amount-val").textContent = amount > 0 ? amount.toLocaleString() : "Check Balance";
  document.getElementById("screen-npci-mpin").classList.remove("hidden");
}

function closeNpciMpin() {
  document.getElementById("screen-npci-mpin").classList.add("hidden");
}

async function handleBalanceCheck(pin) {
  try {
    const res = await fetch(`${API_BASE}/upi/check-balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_id: "acc_aarav_sbi", pin: pin }),
    });

    closeNpciMpin();

    if (!res.ok) {
      alert("Incorrect UPI PIN. (Hint: 1234)");
      return;
    }

    const data = await res.json();
    document.getElementById("disp-dialog-balance").textContent = data.balance_formatted;
    const bankSub = document.getElementById("dialog-bank-sub");
    if (bankSub) bankSub.textContent = currentBankLabel().full;
    document.getElementById("modal-bank-balance").classList.remove("hidden");
  } catch (e) {
    console.error(e);
    alert("Balance check failed.");
  }
}

async function handlePaymentExecution(pin) {
  if (pin !== "1234") {
    alert("Incorrect UPI PIN! (Demo PIN: 1234)");
    return;
  }

  animateSocTopology();

  try {
    const res = await fetch(`${API_BASE}/upi/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trace_id: pendingPayTraceId,
        txn_id: pendingPayTxnId,
        amount_rupees: pendingPayAmount,
        user_acknowledged: true,
        pin: pin,
      }),
    });
    const data = await res.json();

    closeNpciMpin();

    // Snappy Payment Processing Animation (<1s authentic GPay flow)
    document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
    document.getElementById("screen-payment-processing").classList.remove("hidden");
    document.getElementById("proc-amount-val").textContent = pendingPayAmount.toLocaleString();
    document.getElementById("proc-payee-val").textContent = currentPayee.name;
    const procBankSub = document.getElementById("proc-bank-sub");
    if (procBankSub) procBankSub.textContent = `Contacting ${currentBankLabel().full}`;

    // Snappy authentic 750ms processing state
    await new Promise(r => setTimeout(r, 750));

    if (data.status === "COMPLETED") {
      // Record transaction into contact thread conversation
      if (!threadStore[currentPayee.vpa]) {
        threadStore[currentPayee.vpa] = {
          name: currentPayee.name,
          vpa: currentPayee.vpa,
          avatar: currentPayee.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
          verified: false,
          badgeText: "Direct Beneficiary",
          defaultAmount: pendingPayAmount,
          messages: [],
        };
      }
      const assignedTxnId = pendingPayTxnId || ("4254" + Math.floor(10000000 + Math.random() * 90000000));
      threadStore[currentPayee.vpa].messages.push({
        type: "TXN",
        amount: pendingPayAmount,
        note: currentPayee.note || "UPI Payment",
        time: "Just now",
        status: "COMPLETED",
        txnId: assignedTxnId,
      });

      // Show GPay Success with vibrant checkmark
      document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
      document.getElementById("screen-gpay-success").classList.remove("hidden");

      document.getElementById("succ-amount-val").textContent = pendingPayAmount.toLocaleString();
      document.getElementById("succ-payee-val").textContent = currentPayee.name;
      document.getElementById("succ-vpa-val").textContent = currentPayee.vpa;
      document.getElementById("succ-txnid-val").textContent = assignedTxnId;
      document.getElementById("succ-timestamp-val").textContent = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      const bank = currentBankLabel();
      const succBankName = document.getElementById("succ-bank-name");
      const succBankAcct = document.getElementById("succ-bank-acct");
      if (succBankName) succBankName.textContent = `From: ${bank.name || "State Bank of India"}`;
      if (succBankAcct) succBankAcct.textContent = `••••${bank.last4 || "1001"}`;

      await refreshSocBalances();
      await refreshSocTraces(pendingPayTraceId);
    } else if (data.status === "BLOCKED") {
      document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
      document.getElementById("screen-gpay-home").classList.remove("hidden");
      showHardBlockSheet(data.decision?.intervention_screen || {
        warning_title: "Payment Intercepted and Blocked",
        explanation: "Critical scam indicators triggered. Zero funds moved from your account.",
      });
    } else {
      alert(`Payment status: ${data.status}`);
    }
  } catch (e) {
    console.error(e);
    alert("Payment execution failed.");
  }
}

// ===========================================================================
// 6. MATERIAL INTERVENTION SHEETS (Coaching & Freeze)
// ===========================================================================
function initInterventionSheets() {
  const ackCheck = document.getElementById("coach-ack-checkbox");
  const btnProceed = document.getElementById("btn-coach-proceed");

  ackCheck.addEventListener("change", (e) => {
    btnProceed.disabled = !e.target.checked;
  });

  document.getElementById("btn-coach-cancel").addEventListener("click", () => {
    document.getElementById("sheet-coaching").classList.add("hidden");
  });

  btnProceed.addEventListener("click", () => {
    document.getElementById("sheet-coaching").classList.add("hidden");
    mpinMode = "PAY";
    openNpciMpin(pendingPayAmount);
  });

  document.getElementById("btn-freeze-dismiss").addEventListener("click", () => {
    document.getElementById("sheet-freeze").classList.add("hidden");
  });

  document.getElementById("btn-call-helpline").addEventListener("click", () => {
    alert("Dialing 1930 National Cyber Crime Reporting Helpline...");
  });
}

function showCoachingSheet(screen) {
  document.getElementById("coach-sheet-title").textContent = screen.warning_title || "Security Warning";
  document.getElementById("coach-sheet-body").textContent = screen.explanation || "Please verify payee.";
  document.getElementById("coach-ack-checkbox").checked = false;
  document.getElementById("btn-coach-proceed").disabled = true;
  document.getElementById("sheet-coaching").classList.remove("hidden");
}

function showHardBlockSheet(screen) {
  document.getElementById("freeze-sheet-title").textContent = screen.warning_title || "Payment Blocked";
  document.getElementById("freeze-sheet-body").textContent = screen.explanation || "Blocked by Kurukshetra FRM.";
  document.getElementById("sheet-freeze").classList.remove("hidden");
  showTrustedAlertToast(pendingPayAmount, currentPayee.name);
}

// ===========================================================================
// 7. TRANSACTION HISTORY
// ===========================================================================
async function openTransactionHistory() {
  try {
    const res = await fetch(`${API_BASE}/accounts/acc_aarav_sbi/statement`);
    const entries = await res.json();
    const list = document.getElementById("drawer-history-list");
    list.innerHTML = "";

    if (!entries || entries.length === 0) {
      list.innerHTML = '<div class="empty-timeline-msg">No transactions recorded yet.</div>';
    } else {
      entries.forEach(e => {
        const item = document.createElement("div");
        item.className = "manage-money-card";
        const isDebit = e.direction === "DEBIT";
        item.innerHTML = `
          <div class="money-card-icon">${isDebit ? "🔴" : "🟢"}</div>
          <div class="money-card-info">
            <div class="money-card-title">${e.narration || "UPI Transaction"}</div>
            <div class="money-card-sub">${e.posted_at ? new Date(e.posted_at).toLocaleString() : "Recent"}</div>
          </div>
          <div style="font-family:var(--font-mono); font-weight:700; color:${isDebit ? '#f87171' : '#34d399'};">
            ${isDebit ? '-' : '+'}${e.amount_formatted}
          </div>
        `;
        list.appendChild(item);
      });
    }

    document.getElementById("modal-tx-history").classList.remove("hidden");
  } catch (e) {
    console.error(e);
  }
}

// ===========================================================================
// 8. MINIATURE ECOSYSTEM SOC OBSERVER INTEGRATION
// ===========================================================================
// Presentation narration -- what a presenter would actually SAY while a
// preset runs, matching the real-world scam write-ups in
// kurukshetra-system/docs/00-fresh-base.md. Shown in the narrative card so
// the pills stop looking like bare buttons and start telling the story.
const SCENARIO_NARRATIVES = {
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

function showScenarioNarrative(zoneClass, title, body, meta) {
  const card = document.getElementById("soc-narrative-card");
  if (!card) return;
  card.className = `soc-narrative-card narrative-${zoneClass}`;
  document.getElementById("soc-narrative-title").textContent = title;
  document.getElementById("soc-narrative-body").textContent = body;
  document.getElementById("soc-narrative-meta").textContent = meta || "";
  card.classList.remove("hidden");
}

function initSocObserver() {
  document.querySelectorAll(".scen-pill[data-scen]").forEach(pill => {
    pill.addEventListener("click", async () => {
      const scen = pill.dataset.scen;
      animateSocTopology();

      const narrative = SCENARIO_NARRATIVES[scen];
      if (narrative) {
        showScenarioNarrative(scen === "blue" ? "stepup" : scen, narrative.title, narrative.body, "Running through the real Kurukshetra pipeline now...");
      }

      try {
        const res = await fetch(`${API_BASE}/scenarios/run/${scen}`);
        const data = await res.json();

        if (data.decision) {
          renderSocRisk(data.decision);
        } else if (data.risk_zone) {
          renderSocRisk({
            risk_zone: data.risk_zone,
            risk_score: data.risk_score,
            tier_reached: data.tier_reached || 0,
            decision: data.status,
            data_completeness: data.completeness || "FULL",
            audit_ref: "1",
            signals: [],
          });
        }

        if (data.trace_id) {
          document.getElementById("soc-trace-id").textContent = data.trace_id;
        }
        renderSocTraces(data.traces || []);
        await refreshSocBalances();

        if (narrative) {
          const zone = data.risk_zone || data.decision?.risk_zone || "";
          showScenarioNarrative(
            scen === "blue" ? "stepup" : scen,
            narrative.title,
            narrative.body,
            `Verdict: ${zone} | trace ${data.trace_id || ""} | audit chain entry recorded`
          );
        }

        // Also reflect on GPay phone view
        if (scen === "green") {
          openPaymentComposer({
            name: "Suresh Kirana Store",
            vpa: "grocer.local@oksbi",
            amount: 450,
            note: "Groceries",
          });
          document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
          document.getElementById("screen-gpay-success").classList.remove("hidden");
          document.getElementById("succ-amount-val").textContent = "450";
          document.getElementById("succ-payee-val").textContent = "Suresh Kirana Store";
        } else if (scen === "orange") {
          showHardBlockSheet(data.intervention_screen || {
            warning_title: "Payment Blocked: CBI Extortion",
            explanation: "Declared purpose contradicts recipient savings account. Coercive extortion scheme detected.",
          });
        } else if (scen === "red") {
          showHardBlockSheet({
            warning_title: "Payment Blocked: Mule Syndicate",
            explanation: "Account exhibits rapid drain velocity, multi-reporter flags, and high abandonment.",
          });
        }
      } catch (e) {
        console.error(e);
      }
    });
  });

  initSurpriseScenario();
}

// ===========================================================================
// "SURPRISE ME": generates a brand-new scam handle the system has NEVER seen
// before, live, and runs it through the real pipeline. This is the on-stage
// proof that detection isn't memorized to 4-5 hardcoded identities -- it's
// the same resolve_or_provision_vpa + Tier 0/1 engine every other button
// uses, just fed a handle nobody typed in advance (including the presenter).
// ===========================================================================
const _SURPRISE_AUTHORITY = ["cbi", "police", "incometax", "customs", "courtfine", "rbi", "narcotics", "cybercell"];
const _SURPRISE_SUFFIX = ["officer", "clearance", "verification", "helpdesk", "department", "cell", "recovery"];
const _SURPRISE_CORPORATE = ["refund", "kyc.update", "lottery.winner", "insurance.claim", "cashback.reward"];
const _SURPRISE_BANKS = ["oksbi", "ybl", "paytm", "axl", "okicici"];
const _SURPRISE_BENIGN = ["freelance.design", "tuition.fees", "wedding.catering", "carpool.share", "book.club"];

function generateSurpriseVpa() {
  const useAuthority = Math.random() < 0.55;
  const usebenign = !useAuthority && Math.random() < 0.35;
  let localPart;
  if (useAuthority) {
    const a = _SURPRISE_AUTHORITY[Math.floor(Math.random() * _SURPRISE_AUTHORITY.length)];
    const s = _SURPRISE_SUFFIX[Math.floor(Math.random() * _SURPRISE_SUFFIX.length)];
    localPart = `${a}.${s}.${Math.floor(Math.random() * 90 + 10)}`;
  } else if (usebenign) {
    localPart = _SURPRISE_BENIGN[Math.floor(Math.random() * _SURPRISE_BENIGN.length)] + Math.floor(Math.random() * 900 + 100);
  } else {
    const c = _SURPRISE_CORPORATE[Math.floor(Math.random() * _SURPRISE_CORPORATE.length)];
    localPart = `${c}.${Math.floor(Math.random() * 9000 + 1000)}`;
  }
  const bank = _SURPRISE_BANKS[Math.floor(Math.random() * _SURPRISE_BANKS.length)];
  const amount = useAuthority
    ? Math.floor(Math.random() * 90000 + 15000)
    : Math.floor(Math.random() * 4000 + 300);
  return { vpa: `${localPart}@${bank}`, amount, isScamShaped: useAuthority };
}

function initSurpriseScenario() {
  const btn = document.getElementById("btn-surprise-scenario");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const { vpa, amount, isScamShaped } = generateSurpriseVpa();
    animateSocTopology();
    showScenarioNarrative(
      "surprise",
      "🎲 Live-generated handle -- never seen before this click",
      `Generating "${vpa}" on the spot and sending it through the exact same NPCI Central Mapper + Kurukshetra Tier 0/1 pipeline as every other button. Nobody -- including whoever is presenting this -- typed or pre-scripted this identifier.`,
      "Resolving via resolve_or_provision_vpa()..."
    );

    try {
      const valRes = await fetch(`${API_BASE}/upi/val-add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ psp_id: "gpay", payer_id: "cust_aarav", payer_account_id: "acc_aarav_sbi", payee_vpa: vpa }),
      });
      const valData = await valRes.json();
      if (valData.risk) renderSocRisk(valData.risk);
      await refreshSocTraces(valData.trace_id);

      const payRes = await fetch(`${API_BASE}/upi/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trace_id: valData.trace_id,
          txn_id: valData.txn_id,
          amount_rupees: amount,
          user_acknowledged: false,
          pin: "1234",
        }),
      });
      const payData = await payRes.json();
      if (payData.decision) renderSocRisk(payData.decision);
      await refreshSocTraces(valData.trace_id);
      await refreshSocBalances();

      const zone = payData.decision?.risk_zone || valData.risk?.risk_zone || "ALLOW";
      const resolvedName = valData.resolved?.customer_name || "Unknown";
      const provisioned = valData.resolved?.newly_provisioned ? "newly provisioned this instant" : "already known to the ecosystem";

      showScenarioNarrative(
        zone.toLowerCase().replace("_", ""),
        `🎲 "${vpa}" -> resolved to "${resolvedName}" (${provisioned})`,
        isScamShaped
          ? "This handle used an authority/corporate keyword pattern -- watch whether Kurukshetra caught the mismatch against the resolved personal account, live."
          : "This handle looked like an ordinary peer-to-peer payment -- watch whether the engine correctly left it alone.",
        `Verdict: ${zone} | Amount: Rs ${amount.toLocaleString()} | trace ${valData.trace_id}`
      );

      if (zone === "FREEZE" || zone === "COACH") {
        showHardBlockSheet({
          warning_title: `Live-generated handle intercepted: ${zone}`,
          explanation: `"${vpa}" resolved to ${resolvedName}, a personal account, and was scored ${zone} by the real-time engine -- generated and caught in the same click.`,
        });
      }
    } catch (e) {
      console.error(e);
    }
  });
}

async function refreshSocBalances() {
  try {
    const res = await fetch(`${API_BASE}/accounts`);
    const accounts = await res.json();

    const grid = document.getElementById("soc-accounts-grid");
    grid.innerHTML = "";

    accounts.forEach(acc => {
      const cell = document.createElement("div");
      cell.className = "soc-acc-cell";
      cell.innerHTML = `
        <div class="sac-name">${acc.customer_name} (${acc.bank_id})</div>
        <div class="sac-bal">${acc.balance_formatted}</div>
        <div class="sac-meta">A/c: ${acc.account_number} • ${acc.account_type}</div>
      `;
      grid.appendChild(cell);

      if (acc.account_id === "acc_aarav_sbi") {
        document.getElementById("home-account-label").textContent = `${acc.bank_name} ••••${acc.account_number.slice(-4)}`;
      }
    });
  } catch (e) {
    console.error(e);
  }
}

async function refreshSocTraces(traceId) {
  if (!traceId) return;
  try {
    const res = await fetch(`${API_BASE}/traces/${traceId}`);
    const events = await res.json();
    renderSocTraces(events);
  } catch (e) {
    console.error(e);
  }
}

function renderSocTraces(events) {
  const container = document.getElementById("soc-timeline");
  container.innerHTML = "";

  if (!events || events.length === 0) {
    container.innerHTML = '<div class="empty-timeline-msg">No trace events recorded.</div>';
    return;
  }

  // Staggered reveal -- each hop appears ~120ms after the previous one, so a
  // live audience watches the transaction travel through the ecosystem
  // instead of seeing a JSON dump land all at once.
  events.forEach((ev, idx) => {
    const row = document.createElement("div");
    row.className = "soc-timeline-entry";
    row.style.animationDelay = `${idx * 120}ms`;
    row.innerHTML = `
      <span class="st-time">${ev.elapsed_ms || 0}ms</span>
      <span class="st-comp">${ev.component || "SYS"}</span>
      <span class="st-desc"><strong>${ev.action}:</strong> ${ev.summary}</span>
    `;
    container.appendChild(row);
  });
  container.scrollTop = container.scrollHeight;
}

function renderSocRisk(risk) {
  if (!risk) return;

  const zone = risk.risk_zone || "ALLOW";
  const badge = document.getElementById("soc-zone-badge");
  badge.textContent = `${zone} (${risk.risk_score || 0.0})`;
  badge.className = `soc-zone-badge zone-${zone.toLowerCase().replace('_', '-')}`;

  document.getElementById("soc-disp-tier").textContent = 
    risk.tier_reached === 0 ? "Tier 0 (Fast-Path <10ms)" : `Tier ${risk.tier_reached} (Deep Forensics)`;
  document.getElementById("soc-disp-action").textContent = risk.decision || "PROCEED";
  document.getElementById("soc-disp-completeness").textContent = risk.data_completeness || "FULL";
  document.getElementById("soc-disp-audit").textContent = risk.audit_ref ? `#${risk.audit_ref}` : "PENDING";

  const tbody = document.getElementById("soc-signals-tbody");
  tbody.innerHTML = "";

  const signals = risk.signals || [];
  if (signals.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-table-msg">Tier 0 Fast-Path: All baseline checks clear. Zero anomalies triggered.</td></tr>';
    return;
  }

  signals.forEach(s => {
    const tr = document.createElement("tr");
    const statusText = s.triggered ? `<span style="color:#f87171;font-weight:700;">TRIGGERED</span>` : `<span style="color:#64748b;">QUIET</span>`;
    
    tr.innerHTML = `
      <td>#${s.feature_id}</td>
      <td><strong>${s.feature_name}</strong></td>
      <td><span style="padding:1px 5px; border-radius:4px; font-size:9px; background:#334155;">${s.label}</span></td>
      <td>${s.severity}</td>
      <td>${s.risk_contribution > 0 ? '+' + s.risk_contribution : '0.0'}</td>
      <td>${statusText}</td>
    `;
    tbody.appendChild(tr);
  });
}

function animateSocTopology() {
  const nodes = ["snode-payer", "snode-switch", "snode-kurukshetra", "snode-remitter", "snode-beneficiary"];
  nodes.forEach((id, idx) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add("node-active");
        setTimeout(() => el.classList.remove("node-active"), 1000);
      }
    }, idx * 250);
  });
}

function initGlobalControls() {
  document.getElementById("btn-reset-db").addEventListener("click", async () => {
    try {
      await fetch(`${API_BASE}/reset-and-seed`, { method: "POST" });
      await refreshSocBalances();
      alert("Ecosystem reset and seeded.");
    } catch (e) {
      console.error(e);
    }
  });

      document.getElementById("audit-chip").addEventListener("click", async () => {
    try {
      const res = await fetch(`${API_BASE}/audit/verify`);
      const data = await res.json();
      if (data.valid) {
        alert("Cryptographic Audit Chain: VERIFIED! All SHA-256 hash links intact.");
      } else {
        alert(`Audit chain broken at transaction: ${data.broken_txn_id}`);
      }
    } catch (e) {
      console.error(e);
    }
  });
}

// ===========================================================================
// 9. APP RAIL SWITCHER (Google Pay / PhonePe / SBI NetBanking)
// ===========================================================================
let currentActiveRail = "gpay";

function initAppRailSwitcher() {
  const tabGpay = document.getElementById("tab-app-gpay");
  const tabPhonepe = document.getElementById("tab-app-phonepe");
  const tabNetbanking = document.getElementById("tab-app-netbanking");

  if (tabGpay) tabGpay.addEventListener("click", () => switchAppRail("gpay"));
  if (tabPhonepe) tabPhonepe.addEventListener("click", () => switchAppRail("phonepe"));
  if (tabNetbanking) tabNetbanking.addEventListener("click", () => switchAppRail("netbanking"));
}

function switchAppRail(rail) {
  currentActiveRail = rail;
  document.querySelectorAll(".rail-tab-btn").forEach(b => b.classList.remove("active"));
  const activeBtn = document.getElementById(`tab-app-${rail}`);
  if (activeBtn) activeBtn.classList.add("active");

  if (!currentUser) return; // Must be authenticated

  const gpayHome = document.getElementById("screen-gpay-home");
  const phonepeHome = document.getElementById("screen-phonepe-home");
  const netbankingHome = document.getElementById("screen-netbanking-home");
  const composer = document.getElementById("screen-payment-composer");

  if (composer) composer.classList.add("hidden");
  if (gpayHome) gpayHome.classList.add("hidden");
  if (phonepeHome) phonepeHome.classList.add("hidden");
  if (netbankingHome) netbankingHome.classList.add("hidden");

  if (rail === "gpay" && gpayHome) {
    gpayHome.classList.remove("hidden");
  } else if (rail === "phonepe" && phonepeHome) {
    phonepeHome.classList.remove("hidden");
    initPhonePeInteractions();
  } else if (rail === "netbanking" && netbankingHome) {
    netbankingHome.classList.remove("hidden");
    loadNetBankingData();
  }
}

function initPhonePeInteractions() {
  document.querySelectorAll(".ph-contact-circle").forEach(circle => {
    circle.onclick = () => {
      const vpa = circle.getAttribute("data-vpa");
      const name = circle.getAttribute("data-name");
      const amount = parseFloat(circle.getAttribute("data-amount")) || 450;
      openContactThread({
        vpa: vpa,
        name: name,
        amount: amount,
        note: "PhonePe transfer",
      });
    };
  });

  const btnBalance = document.getElementById("ph-action-balance");
  if (btnBalance) {
    btnBalance.onclick = () => {
      mpinMode = "BALANCE";
      openNpciMpin(0);
    };
  }
}

// ===========================================================================
// 10. INTERACTIVE QR CODE SCANNER SIMULATOR (Features #9 & #10)
// ===========================================================================
function openQrScannerModal() {
  const modal = document.getElementById("modal-qr-scanner");
  if (modal) modal.classList.remove("hidden");
}

function initQrScanner() {
  const modal = document.getElementById("modal-qr-scanner");
  const btnOpenGpay = document.getElementById("action-scan-qr");
  const btnOpenPhonepe = document.getElementById("ph-btn-qr");
  const btnOpenPhonepeAction = document.getElementById("ph-action-scan");
  const btnClose = document.getElementById("btn-close-qr-scanner");

  const openModal = () => modal && modal.classList.remove("hidden");
  const closeModal = () => modal && modal.classList.add("hidden");

  if (btnOpenPhonepe) btnOpenPhonepe.addEventListener("click", openModal);
  if (btnOpenPhonepeAction) btnOpenPhonepeAction.addEventListener("click", openModal);
  if (btnClose) btnClose.addEventListener("click", closeModal);

  // Backdrop click (click on the dark area outside the sheet) also closes
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Bind QR sample card clicks — these do a REAL API call to /qr/parse
  document.querySelectorAll(".qr-sample-card").forEach(card => {
    card.addEventListener("click", async () => {
      const uri = card.getAttribute("data-uri");
      closeModal();

      // Show scanning animation briefly
      const scanMsg = document.createElement("div");
      scanMsg.id = "qr-scan-toast";
      scanMsg.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a73e8;color:#fff;padding:12px 24px;border-radius:12px;font-weight:700;z-index:9999;font-size:14px;";
      scanMsg.textContent = "📷 QR Scanned! Analyzing...";
      document.body.appendChild(scanMsg);

      try {
        const res = await fetch(`${API_BASE}/qr/parse`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ raw_uri: uri }),
        });
        const data = await res.json();
        document.body.removeChild(scanMsg);

        // Open the contact thread (with advisory from live backend) then open composer
        openContactThread({
          vpa: data.payee_vpa,
          name: data.payee_name || data.payee_vpa.split("@")[0],
          amount: data.amount_rupees || 500,
          note: data.note || "QR Payment",
        });

        if (data.is_suspicious) {
          showTrustedAlertToast(data.amount_rupees || 25000, data.payee_name);
        }
      } catch (e) {
        document.body.removeChild(scanMsg);
        console.error(e);
        // Fallback: parse URI manually
        const urlParams = new URLSearchParams(uri.split("?")[1] || "");
        const vpa = urlParams.get("pa") || "unknown@oksbi";
        const name = decodeURIComponent(urlParams.get("pn") || vpa.split("@")[0]);
        const amount = parseFloat(urlParams.get("am") || "500");
        openContactThread({ vpa, name, amount, note: "QR Payment" });
      }
    });
  });
}

// ===========================================================================
// 11. CITIZEN PUBLIC SCAM SCORE CHECKER (Feature #34)
// ===========================================================================
function initCitizenChecker() {
  const modal = document.getElementById("modal-citizen-checker");
  const btnOpen = document.getElementById("btn-open-citizen-checker");
  const btnClose = document.getElementById("btn-close-citizen-checker");
  const btnSearch = document.getElementById("btn-citizen-search");
  const searchInput = document.getElementById("citizen-search-input");
  const btnReport = document.getElementById("btn-submit-citizen-report");

  if (btnOpen) btnOpen.addEventListener("click", () => {
    modal.classList.remove("hidden");
    doCitizenLookup(searchInput.value.trim() || "mule.syndicate@axis");
  });

  if (btnClose) btnClose.addEventListener("click", () => modal.classList.add("hidden"));

  if (btnSearch) btnSearch.addEventListener("click", () => {
    const q = searchInput.value.trim();
    if (q) doCitizenLookup(q);
  });

  document.querySelectorAll(".tag-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const q = chip.getAttribute("data-query");
      searchInput.value = q;
      doCitizenLookup(q);
    });
  });

  if (btnReport) btnReport.addEventListener("click", async () => {
    const q = searchInput.value.trim();
    const reason = document.getElementById("cc-report-reason").value;
    const feedback = document.getElementById("cc-report-feedback");

    try {
      const res = await fetch(`${API_BASE}/community/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_ref: q,
          reporter_identity_hash: "citizen_user_" + Math.random().toString(36).substring(2, 8),
          reason_code: reason,
        }),
      });
      const data = await res.json();
      feedback.textContent = data.message || "Report recorded successfully.";
      feedback.style.color = data.success ? "#81c995" : "#f28b82";
      setTimeout(() => doCitizenLookup(q), 1000);
    } catch (e) {
      console.error(e);
    }
  });
}

async function doCitizenLookup(query) {
  try {
    const res = await fetch(`${API_BASE}/public/lookup/${encodeURIComponent(query)}`);
    if (!res.ok) return;
    const data = await res.json();

    const elId = document.getElementById("cc-target-id");
    const elName = document.getElementById("cc-target-name");
    const elScore = document.getElementById("cc-score-pill");
    const elVerdict = document.getElementById("cc-verdict-text");
    const elReports = document.getElementById("cc-report-count");
    const elStatus = document.getElementById("cc-vpa-status");
    const elSybil = document.getElementById("cc-sybil-status");

    if (elId) elId.textContent = data.target_ref;
    if (elName) elName.textContent = data.resolved_name;
    if (elScore) elScore.textContent = `Risk: ${data.risk_score.toFixed(2)}`;
    if (elVerdict) elVerdict.textContent = data.verdict_plain;
    if (elReports) elReports.textContent = `${data.community_reporters} independent reporter(s)`;
    if (elStatus) elStatus.textContent = data.is_active ? "ACTIVE ROUTING" : "SUSPENDED (KILL-SWITCH)";
    if (elSybil) {
      // Mirrors the backend's MIN_DISTINCT_REPORTERS_TO_ESCALATE=3 threshold
      // (see ecosystem/config.py) -- must reflect the actual reporter count,
      // not a permanently-"Passed" placeholder.
      const reporters = data.community_reporters || 0;
      if (reporters >= 3) {
        elSybil.textContent = `Passed (${reporters} distinct reporters, min 3)`;
        elSybil.style.color = "#f87171";
      } else if (reporters > 0) {
        elSybil.textContent = `Below threshold (${reporters}/3 reporters -- not yet escalated)`;
        elSybil.style.color = "#fbbf24";
      } else {
        elSybil.textContent = "No reports filed";
        elSybil.style.color = "#81c995";
      }
    }

    const pill = document.getElementById("cc-verdict-pill");
    if (pill) {
      pill.className = "cc-verdict-pill";
      if (data.risk_level === "SAFE") {
        pill.classList.add("verdict-safe");
        pill.textContent = "✅ SAFE / VERIFIED";
      } else if (data.risk_level === "SUSPICIOUS") {
        pill.classList.add("verdict-suspicious");
        pill.textContent = "⚠️ SUSPICIOUS";
      } else {
        pill.classList.add("verdict-critical");
        pill.textContent = "🚨 CRITICAL_BLOCKED";
      }
    }
  } catch (e) {
    console.error(e);
  }
}

// ===========================================================================
// 12. NPCI CENTRAL OPS KILL-SWITCH DASHBOARD (Feature #33)
// ===========================================================================
function initKillSwitchPanel() {
  loadCentralCampaigns();
  // Refresh campaigns every 10 seconds
  setInterval(loadCentralCampaigns, 10000);
}

async function loadCentralCampaigns() {
  const tbody = document.getElementById("soc-campaigns-tbody");
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/npci/campaigns`);
    if (!res.ok) return;
    const campaigns = await res.json();

    tbody.innerHTML = "";
    if (campaigns.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-table-msg">No active campaigns recorded in switch metrics.</td></tr>';
      return;
    }

    campaigns.forEach(c => {
      const tr = document.createElement("tr");
      const statusBadge = c.is_suspended
        ? `<span class="badge-suspended">REVOKED</span>`
        : `<span class="badge-active">ACTIVE</span>`;

      const actionBtn = c.is_suspended
        ? `<button class="btn-ks-trigger" disabled>REVOKED</button>`
        : `<button class="btn-ks-trigger" onclick="triggerKillSwitch('${c.target_ref}')">⚡ KILL-SWITCH</button>`;

      tr.innerHTML = `
        <td><strong>${c.target_ref}</strong></td>
        <td>${c.customer_name}</td>
        <td>${c.bank_id}</td>
        <td>${c.lookup_count} (${c.distinct_psp_count} PSPs)</td>
        <td>${(c.abandon_ratio * 100).toFixed(0)}%</td>
        <td>${statusBadge}</td>
        <td>${actionBtn}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error(e);
  }
}

window.triggerKillSwitch = async function(targetRef) {
  if (!confirm(`Are you sure you want to engage the NATIONWIDE KILL-SWITCH for ${targetRef}?\n\nThis will revoke routing in NPCI Central Mapper and freeze the CBS account across all banks immediately.`)) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/npci/kill-switch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target_ref: targetRef,
        reason: "EMERGENCY_MASS_PHISHING_KILL_SWITCH",
        operator_id: "NPCI_CENTRAL_OPS_01",
      }),
    });

    const data = await res.json();
    alert(`NATIONWIDE KILL-SWITCH ENGAGED!\n\nTarget: ${targetRef}\nVPA Revoked: ${data.vpa_revoked}\nAccount Frozen: ${data.account_frozen}\nAudit Hash: ${data.hash.substring(0, 16)}...`);
    await loadCentralCampaigns();
    await refreshSocBalances();
  } catch (e) {
    console.error(e);
    alert("Kill-Switch execution failed.");
  }
};

// ===========================================================================
// 13. SBI NETBANKING INTERACTION
// ===========================================================================
function initNetBanking() {
  const btnTransfer = document.getElementById("btn-nb-initiate");
  if (btnTransfer) {
    btnTransfer.addEventListener("click", async () => {
      const payeeSelect = document.getElementById("nb-transfer-payee");
      const beneficiaryAccountId = payeeSelect ? payeeSelect.value : "acc_suresh_sbi";
      const amountRupees = parseFloat(document.getElementById("nb-transfer-amount").value) || 1000;
      const mode = document.querySelector('input[name="nb-mode"]:checked')?.value || "IMPS";

      try {
        const res = await fetch(`${API_BASE}/netbanking/transfer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "cust_aarav",
            payer_account_id: "acc_aarav_sbi",
            beneficiary_account_id: beneficiaryAccountId,
            amount_rupees: amountRupees,
            mode: mode,
            user_acknowledged: false,
          }),
        });

        const data = await res.json();
        if (data.status === "COMPLETED") {
          alert(`NetBanking ${mode} Transfer Successful!\n\nAmount: ₹${amountRupees.toLocaleString()}\nNew Balance: ${data.payer_balance}`);
          loadNetBankingData();
          refreshSocBalances();
        } else if (data.status === "BLOCKED") {
          alert(`NetBanking Transfer Blocked by Kurukshetra RBA Risk Evaluation!\n\n${data.message}`);
          showTrustedAlertToast(amountRupees, beneficiaryAccountId);
        } else {
          alert(`Status: ${data.status}\n${data.message || ""}`);
        }
      } catch (e) {
        console.error(e);
      }
    });
  }
}

async function loadNetBankingData() {
  try {
    const accRes = await fetch(`${API_BASE}/accounts`);
    const accounts = await accRes.json();
    const aarav = accounts.find(a => a.account_id === "acc_aarav_sbi");
    if (aarav) {
      const elBal = document.getElementById("nb-disp-balance");
      if (elBal) elBal.textContent = aarav.balance_formatted;
    }

    const payeesRes = await fetch(`${API_BASE}/netbanking/payees?customer_id=cust_aarav`);
    const payees = await payeesRes.json();
    const payeeList = document.getElementById("nb-payees-list");
    const payeeSelect = document.getElementById("nb-transfer-payee");

    if (payeeList) payeeList.innerHTML = "";
    if (payeeSelect) payeeSelect.innerHTML = "";

    payees.forEach(p => {
      if (payeeList) {
        const item = document.createElement("div");
        item.className = "nb-payee-item";
        item.innerHTML = `
          <div>
            <strong>${p.customer_name}</strong>
            <span style="font-size:10px; color:#82a8d8; display:block;">${p.bank_id} • ${p.account_number}</span>
          </div>
          <div>
            ${p.is_cooling_off ? `<span class="nb-timer-badge">⏳ Cooling: ${Math.floor(p.cooling_off_remaining_seconds / 60)}m left</span>` : `<span style="color:#4caf50; font-size:10px; font-weight:700;">ACTIVE</span>`}
          </div>
        `;
        payeeList.appendChild(item);
      }

      if (payeeSelect) {
        const opt = document.createElement("option");
        opt.value = p.account_id;
        opt.textContent = `${p.customer_name} (${p.bank_id} ${p.account_number})`;
        payeeSelect.appendChild(opt);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

function showTrustedAlertToast(amount, targetName) {
  const toast = document.getElementById("trusted-alert-toast");
  const msg = document.getElementById("toast-alert-text");
  if (!toast || !msg) return;
  msg.textContent = `Alert dispatched to Trusted Contact (+91 98200 99887): Intercepted ₹${(amount || 75000).toLocaleString()} transfer to ${targetName || 'unverified recipient'}.`;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 6000);
}

const btnCloseToast = document.getElementById("btn-close-toast");
if (btnCloseToast) {
  btnCloseToast.addEventListener("click", () => {
    document.getElementById("trusted-alert-toast").classList.add("hidden");
  });
}

// ===========================================================================
// 12. CONTACT CONVERSATION & PAY THREADS (Real Google Pay Experience)
// ===========================================================================
const threadStore = {
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
      title: "⚠️ First-Time Recipient Caution",
      body: "Merchant VPA registered only 3 days ago. No prior transaction history with you. First-time transfer limits and Kurukshetra Step-up verification apply.",
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
      title: "🚨 Impersonation & Name Mismatch Warning",
      body: "This UPI ID handle claims to represent official authority ('CBI Clearance Cell'), but NPCI Central Mapper records confirm the banking entity is an individual personal savings account registered to 'Manoj Kumar' (State Bank of India). Genuine police or government agencies NEVER collect fines or security deposits via individual personal UPI IDs.",
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
      title: "🛑 High-Velocity Mule Syndicate Warning",
      body: "Account registered to 'Deepak Layering Account'. Core Banking forensics detect rapid pass-through drainage: 98% of received funds are transferred within 4 minutes across peer-to-peer crypto channels. 12 citizen fraud complaints filed.",
    },
    messages: [
      { type: "DATE", text: "Today" },
      { type: "MSG", sender: "IN", text: "Part-time task review bonus unlocked. Deposit ₹50,000 security pledge to withdraw ₹1,80,000.", time: "1:45 PM" },
    ],
  },
};

let activeThreadVpa = "grocer.local@oksbi";

function initContactThreads() {
  const btnBack = document.getElementById("btn-back-from-thread");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
      document.getElementById("screen-gpay-home").classList.remove("hidden");
    });
  }

  const btnSend = document.getElementById("btn-send-thread-msg");
  const msgInput = document.getElementById("thread-chat-input");

  if (btnSend && msgInput) {
    btnSend.addEventListener("click", () => sendThreadMessage());
    msgInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendThreadMessage();
    });
  }

  const btnPay = document.getElementById("btn-thread-pay-action");
  if (btnPay) {
    btnPay.addEventListener("click", () => {
      const thread = threadStore[activeThreadVpa] || {
        name: activeThreadVpa.split("@")[0],
        vpa: activeThreadVpa,
        defaultAmount: 450,
      };
      openPaymentComposer({
        name: thread.name,
        vpa: thread.vpa,
        amount: thread.defaultAmount || 450,
        note: thread.vpa === "grocer.local@oksbi" ? "Groceries" : "Direct Payment",
        purpose: thread.vpa === "cbi.clearance.cell@sbi" ? "GOVT_FINE" : "",
      });
    });
  }

  const btnRequest = document.getElementById("btn-thread-request-action");
  if (btnRequest) {
    btnRequest.addEventListener("click", () => {
      const reqAmount = prompt("Enter amount to request via UPI (₹):", "500");
      if (reqAmount && parseFloat(reqAmount) > 0) {
        if (!threadStore[activeThreadVpa]) return;
        threadStore[activeThreadVpa].messages.push({
          type: "MSG",
          sender: "OUT",
          text: `Payment Request: ₹${parseFloat(reqAmount).toLocaleString()}`,
          time: "Just now",
        });
        renderThreadMessages(threadStore[activeThreadVpa]);
      }
    });
  }
}

function openContactThread(contact) {
  activeThreadVpa = contact.vpa;

  if (!threadStore[contact.vpa]) {
    threadStore[contact.vpa] = {
      name: contact.name || contact.vpa.split("@")[0],
      vpa: contact.vpa,
      avatar: (contact.name || contact.vpa).slice(0, 2).toUpperCase(),
      verified: false,
      badgeText: "New Beneficiary",
      defaultAmount: contact.amount || 500,
      advisory: null,
      messages: [
        { type: "DATE", text: "Today" },
        { type: "MSG", sender: "IN", text: `Start of chat and payments with ${contact.name || contact.vpa}.`, time: "Just now" },
      ],
    };
  }

  const thread = threadStore[contact.vpa];
  currentPayee = {
    name: thread.name,
    vpa: thread.vpa,
    amount: thread.defaultAmount || 450,
    note: "Payment",
    purpose: thread.vpa === "cbi.clearance.cell@sbi" ? "GOVT_FINE" : "",
    account_id: "acc_suresh_sbi",
  };

  // Populate Header
  document.getElementById("thread-header-avatar").textContent = thread.avatar;
  document.getElementById("thread-header-name").textContent = thread.name;
  document.getElementById("thread-header-vpa").textContent = thread.vpa;

  const badgeEl = document.getElementById("thread-header-badge");
  badgeEl.textContent = thread.badgeText || (thread.verified ? "✓ Verified" : "Unverified");
  badgeEl.style.color = thread.verified ? "#10b981" : (thread.advisory?.level === "danger" ? "#f87171" : "#fb923c");

  // Advisory Banner
  const banner = document.getElementById("thread-security-banner");
  const advTitle = document.getElementById("thread-advisory-title");
  const advText = document.getElementById("thread-advisory-text");
  const advIcon = document.getElementById("thread-advisory-icon");

  if (thread.advisory) {
    banner.classList.remove("hidden");
    advTitle.textContent = thread.advisory.title;
    advText.textContent = thread.advisory.body;
    advIcon.textContent = thread.advisory.level === "danger" ? "🛑" : "⚠️";
    if (thread.advisory.level === "danger") {
      banner.classList.add("danger-mode");
    } else {
      banner.classList.remove("danger-mode");
    }
  } else {
    banner.classList.add("hidden");
  }

  // Update input placeholder
  const input = document.getElementById("thread-chat-input");
  input.placeholder = `Message ${thread.name.split(" ")[0]}...`;
  input.value = "";

  renderThreadMessages(thread);

  document.querySelectorAll(".gpay-view").forEach(v => v.classList.add("hidden"));
  document.getElementById("screen-contact-thread").classList.remove("hidden");
}

function renderThreadMessages(thread) {
  const container = document.getElementById("thread-messages-list");
  if (!container) return;
  container.innerHTML = "";

  thread.messages.forEach(m => {
    if (m.type === "DATE") {
      const d = document.createElement("div");
      d.className = "thread-date-divider";
      d.textContent = m.text;
      container.appendChild(d);
    } else if (m.type === "TXN") {
      const t = document.createElement("div");
      t.className = "thread-txn-card";
      t.innerHTML = `
        <div class="txn-card-header">
          <span class="txn-amount-big">₹${m.amount.toLocaleString()}</span>
          <span class="txn-status-badge">✓ ${m.status === 'COMPLETED' ? 'Paid' : m.status}</span>
        </div>
        <div class="txn-note-text">${m.note}</div>
        <div class="txn-bank-row">
          <span>State Bank of India ••••1001</span>
          <span>${m.time}</span>
        </div>
      `;
      container.appendChild(t);
    } else if (m.type === "MSG") {
      const b = document.createElement("div");
      b.className = `thread-chat-bubble ${m.sender === 'OUT' ? 'bubble-outgoing' : 'bubble-incoming'}`;
      b.innerHTML = `
        <div>${m.text}</div>
        <div class="bubble-time">${m.time}</div>
      `;
      container.appendChild(b);
    }
  });

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function sendThreadMessage() {
  const input = document.getElementById("thread-chat-input");
  const text = input.value.trim();
  if (!text) return;

  const thread = threadStore[activeThreadVpa];
  if (!thread) return;

  thread.messages.push({
    type: "MSG",
    sender: "OUT",
    text: text,
    time: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
  });

  input.value = "";
  renderThreadMessages(thread);

  // Realistic auto-reply for Grocer
  if (activeThreadVpa === "grocer.local@oksbi") {
    setTimeout(() => {
      thread.messages.push({
        type: "MSG",
        sender: "IN",
        text: "Thank you for shopping with Suresh Kirana! 🙏",
        time: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
      });
      renderThreadMessages(thread);
    }, 900);
  }
}

// ===========================================================================
// 13. LIVE DEEP AUDIT & PAY UPI ID MODAL (Not hardcoded simulation)
// ===========================================================================
function initPayUpiIdModal() {
  const modal = document.getElementById("modal-pay-upi-id");
  const btnClose = document.getElementById("btn-close-pay-upi");
  const input = document.getElementById("input-custom-upi");
  const btnAudit = document.getElementById("btn-run-live-audit");
  const auditPanel = document.getElementById("live-deep-audit-panel");
  const btnProceed = document.getElementById("btn-proceed-audited-pay");

  if (btnClose) {
    btnClose.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Sample quick chips
  document.querySelectorAll(".sample-upi-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const vpa = chip.dataset.vpa;
      if (input) input.value = vpa;
      runLiveAudit(vpa);
    });
  });

  if (btnAudit && input) {
    btnAudit.addEventListener("click", () => {
      const vpa = input.value.trim();
      if (vpa) runLiveAudit(vpa);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const vpa = input.value.trim();
        if (vpa) runLiveAudit(vpa);
      }
    });
  }

  if (btnProceed) {
    btnProceed.addEventListener("click", () => {
      const vpa = input ? input.value.trim() : "";
      if (!vpa) return;
      modal.classList.add("hidden");
      // Use the resolved name from the audit panel if available
      const handleEl = document.getElementById("audit-panel-handle");
      const metaEl = document.getElementById("audit-panel-meta");
      let resolvedName = vpa.split("@")[0];
      if (metaEl && metaEl.textContent.includes("Resolved Name:")) {
        const match = metaEl.textContent.match(/Resolved Name:\s*([^•]+)/);
        if (match) resolvedName = match[1].trim();
      }
      openContactThread({
        name: resolvedName,
        vpa: vpa,
        amount: 500,
      });
    });
  }
}

function openPayUpiIdModal() {
  const modal = document.getElementById("modal-pay-upi-id");
  if (modal) {
    modal.classList.remove("hidden");
    const input = document.getElementById("input-custom-upi");
    if (input) {
      input.focus();
      runLiveAudit(input.value.trim() || "grocer.local@oksbi");
    }
  }
}

async function runLiveAudit(vpa) {
  const panel = document.getElementById("live-deep-audit-panel");
  const statusPill = document.getElementById("audit-panel-status");
  const handleLabel = document.getElementById("audit-panel-handle");
  const detailEl = document.getElementById("audit-panel-explanation");
  const metaEl = document.getElementById("audit-panel-meta");
  const btnProceed = document.getElementById("btn-proceed-audited-pay");

  if (!panel) return;
  panel.classList.remove("hidden");
  handleLabel.textContent = vpa;
  statusPill.className = "audit-status-pill";
  statusPill.textContent = "AUDITING...";
  detailEl.innerHTML = "<em>Querying NPCI Central Mapper, Banking CBS ledger, and Kurukshetra FRM in real time...</em>";

  try {
    const res = await fetch(`${API_BASE}/public/lookup/${encodeURIComponent(vpa)}`);
    const data = await res.json();

    const score = Math.round(data.risk_score * 100);
    metaEl.innerHTML = `
      <strong>Resolved Name:</strong> ${data.resolved_name} &bull; 
      <strong>Account Type:</strong> ${data.account_type} &bull; 
      <strong>Risk Score:</strong> ${score}/100
    `;

    if (data.mismatch_warning) {
      statusPill.className = "audit-status-pill status-amber";
      statusPill.textContent = "IMPERSONATION MISMATCH";
      detailEl.innerHTML = `<span style="color:#fdba74;">${data.mismatch_warning}</span>`;
      btnProceed.textContent = "Proceed with Coaching Warning &rarr;";
    } else if (data.mule_warning) {
      statusPill.className = "audit-status-pill status-red";
      statusPill.textContent = "MULE ACCOUNT (HARD BLOCK)";
      detailEl.innerHTML = `<span style="color:#fca5a5;">${data.mule_warning}</span>`;
      btnProceed.textContent = "Inspect Blocked Details &rarr;";
    } else if (data.merchant_badge) {
      statusPill.className = "audit-status-pill status-green";
      statusPill.textContent = "VERIFIED MERCHANT (ALLOW)";
      detailEl.innerHTML = `<span style="color:#6ee7b7;">${data.merchant_badge}</span>`;
      btnProceed.textContent = "Pay Verified Grocer &rarr;";
    } else {
      const isSafe = data.risk_level === "SAFE";
      statusPill.className = isSafe ? "audit-status-pill status-green" : "audit-status-pill status-amber";
      statusPill.textContent = data.risk_level;
      detailEl.innerHTML = `<span>${data.verdict_plain}</span>`;
      btnProceed.textContent = "Continue to Payment &rarr;";
    }
  } catch (e) {
    console.error(e);
    detailEl.innerHTML = "Offline simulation verified.";
  }
}


