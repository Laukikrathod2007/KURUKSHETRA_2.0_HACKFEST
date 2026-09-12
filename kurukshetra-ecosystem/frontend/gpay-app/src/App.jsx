import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { API_BASE, getJson, postJson } from "./api";
import { initialThreadStore, SCENARIO_NARRATIVES, generateSurpriseVpa } from "./threadStore";

export default function App() {
  // ---- View / mode state -------------------------------------------------
  const [viewMode, setViewMode] = useState("mode-gpay");
  const [activeRail, setActiveRail] = useState("gpay");
  const [screen, setScreen] = useState("login"); // login | home | phonepe-home | netbanking-home | thread | composer | processing | success
  const [currentUser, setCurrentUser] = useState(null);

  // ---- Payee / payment flow state ---------------------------------------
  const [currentPayee, setCurrentPayee] = useState({
    name: "Suresh Kirana Store",
    vpa: "grocer.local@oksbi",
    amount: 450,
    note: "Groceries",
    purpose: "",
    account_id: "acc_suresh_sbi",
  });
  const [pendingPay, setPendingPay] = useState({ txnId: null, traceId: null, amount: 450 });
  const [mpinMode, setMpinMode] = useState("PAY"); // PAY | BALANCE

  // ---- Thread store (mutable conversation state) -------------------------
  const [threadStore, setThreadStore] = useState(initialThreadStore);
  const [activeThreadVpa, setActiveThreadVpa] = useState("grocer.local@oksbi");

  // ---- Modals / overlays --------------------------------------------------
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceDisplay, setBalanceDisplay] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showCitizenModal, setShowCitizenModal] = useState(false);
  const [showPayUpiModal, setShowPayUpiModal] = useState(false);
  const [showMpin, setShowMpin] = useState(false);
  const [mpinAmount, setMpinAmount] = useState(0);
  const [mpin, setMpin] = useState("");
  const [coachSheet, setCoachSheet] = useState(null); // {title, body}
  const [coachAck, setCoachAck] = useState(false);
  const [freezeSheet, setFreezeSheet] = useState(null); // {title, body}
  const [toast, setToast] = useState(null);

  // ---- Composer state -----------------------------------------------------
  const [composerAmount, setComposerAmount] = useState(450);
  const [composerNote, setComposerNote] = useState("");
  const [composerPurpose, setComposerPurpose] = useState("");
  const [composerAudit, setComposerAudit] = useState({ badgeClass: "", badge: "VERIFYING...", text: "Checking..." });

  // ---- SOC observer state --------------------------------------------------
  const [socRisk, setSocRisk] = useState(null);
  const [socTraces, setSocTraces] = useState([]);
  const [socAccounts, setSocAccounts] = useState([]);
  const [socTraceId, setSocTraceId] = useState("TRC_READY");
  const [narrative, setNarrative] = useState(null); // {zoneClass, title, body, meta}
  const [activeNodes, setActiveNodes] = useState(new Set());
  const [campaigns, setCampaigns] = useState([]);

  // ---- Success/processing display fields ----------------------------------
  const [successInfo, setSuccessInfo] = useState(null);
  const [processingInfo, setProcessingInfo] = useState(null);

  // ---- Login form -----------------------------------------------------------
  const [loginUser, setLoginUser] = useState("android1");
  const [loginPass, setLoginPass] = useState("1234");

  // ---- NetBanking -------------------------------------------------------------
  const [nbBalance, setNbBalance] = useState("₹1,50,000.00");
  const [nbPayees, setNbPayees] = useState([]);
  const [nbSelectedPayee, setNbSelectedPayee] = useState("");
  const [nbAmount, setNbAmount] = useState(1500);
  const [nbMode, setNbMode] = useState("IMPS");

  // ---- Citizen checker ------------------------------------------------------
  const [citizenQuery, setCitizenQuery] = useState("mule.syndicate@axis");
  const [citizenResult, setCitizenResult] = useState(null);
  const [citizenReportReason, setCitizenReportReason] = useState("IMPERSONATION_OFFICIAL");
  const [citizenFeedback, setCitizenFeedback] = useState("🔒 Anti-Sybil rule enforced: 1 report per identity hash with exponential decay.");
  const [citizenFeedbackOk, setCitizenFeedbackOk] = useState(true);

  // ---- Pay-UPI-ID live audit ----------------------------------------------
  const [payUpiInput, setPayUpiInput] = useState("grocer.local@oksbi");
  const [liveAudit, setLiveAudit] = useState(null); // {statusClass, status, detailHtml, meta, proceedLabel}

  // ---- Thread chat input -----------------------------------------------------
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    document.body.className = viewMode;
  }, [viewMode]);

  // ---- Session bootstrap ---------------------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("gpay_session");
    if (saved) {
      try {
        setAuthenticatedUser(JSON.parse(saved));
      } catch {
        setScreen("login");
      }
    } else {
      setScreen("login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUser) refreshSocBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Kill-switch campaigns poll every 10s, same cadence as the original.
  useEffect(() => {
    loadCentralCampaigns();
    const id = setInterval(loadCentralCampaigns, 10000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setAuthenticatedUser(user) {
    setCurrentUser(user);
    setScreen("home");
  }

  function doLogin() {
    postJson("/auth/login", { username: loginUser.trim(), password: loginPass.trim() })
      .then(async (res) => {
        if (!res.ok) {
          alert("Invalid credentials. Please use android1 / 1234.");
          return;
        }
        const data = await res.json();
        localStorage.setItem("gpay_session", JSON.stringify(data.user));
        setAuthenticatedUser(data.user);
      })
      .catch((e) => {
        console.error(e);
        alert("Could not connect to ecosystem server.");
      });
  }

  function logout() {
    if (confirm("Logged in as Aarav Sharma (android1).\n\nDo you want to log out?")) {
      localStorage.removeItem("gpay_session");
      location.reload();
    }
  }

  function currentBankLabel() {
    if (!currentUser) return { initials: "SBI", full: "State Bank of India ••••1001" };
    const initials = (currentUser.bank_name || "Bank").split(" ").map((w) => w[0]).join("").slice(0, 4).toUpperCase();
    const last4 = (currentUser.account_number || "0000").slice(-4);
    return { initials, full: `${currentUser.bank_name} ••••${last4}`, name: currentUser.bank_name, last4 };
  }

  // ---- SOC helpers ------------------------------------------------------------
  function animateSocTopology() {
    const nodes = ["snode-payer", "snode-switch", "snode-kurukshetra", "snode-remitter", "snode-beneficiary"];
    nodes.forEach((id, idx) => {
      setTimeout(() => {
        setActiveNodes((prev) => new Set(prev).add(id));
        setTimeout(() => {
          setActiveNodes((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, 1000);
      }, idx * 250);
    });
  }

  async function refreshSocBalances() {
    try {
      const accounts = await getJson("/accounts");
      setSocAccounts(accounts);
    } catch (e) {
      console.error(e);
    }
  }

  async function refreshSocTraces(traceId) {
    if (!traceId) return;
    try {
      const events = await getJson(`/traces/${traceId}`);
      setSocTraces(events || []);
    } catch (e) {
      console.error(e);
    }
  }

  function showScenarioNarrative(zoneClass, title, body, meta) {
    setNarrative({ zoneClass, title, body, meta });
  }

  async function loadCentralCampaigns() {
    try {
      const res = await fetch(`${API_BASE}/npci/campaigns`);
      if (!res.ok) return;
      setCampaigns(await res.json());
    } catch (e) {
      console.error(e);
    }
  }

  async function triggerKillSwitch(targetRef) {
    if (
      !confirm(
        `Are you sure you want to engage the NATIONWIDE KILL-SWITCH for ${targetRef}?\n\nThis will revoke routing in NPCI Central Mapper and freeze the CBS account across all banks immediately.`
      )
    ) {
      return;
    }
    try {
      const data = await postJson("/npci/kill-switch", {
        target_ref: targetRef,
        reason: "EMERGENCY_MASS_PHISHING_KILL_SWITCH",
        operator_id: "NPCI_CENTRAL_OPS_01",
      }).then((r) => r.json());
      alert(
        `NATIONWIDE KILL-SWITCH ENGAGED!\n\nTarget: ${targetRef}\nVPA Revoked: ${data.vpa_revoked}\nAccount Frozen: ${data.account_frozen}\nAudit Hash: ${data.hash.substring(0, 16)}...`
      );
      await loadCentralCampaigns();
      await refreshSocBalances();
    } catch (e) {
      console.error(e);
      alert("Kill-Switch execution failed.");
    }
  }

  function showTrustedAlertToast(amount, targetName) {
    setToast(`Alert dispatched to Trusted Contact (+91 98200 99887): Intercepted ₹${(amount || 75000).toLocaleString()} transfer to ${targetName || "unverified recipient"}.`);
    setTimeout(() => setToast(null), 6000);
  }

  function showCoachingSheet(sc) {
    setCoachSheet({ title: sc.warning_title || "Security Warning", body: sc.explanation || "Please verify payee." });
    setCoachAck(false);
  }

  function showHardBlockSheet(sc) {
    setFreezeSheet({ title: sc.warning_title || "Payment Blocked", body: sc.explanation || "Blocked by Kurukshetra FRM." });
    showTrustedAlertToast(pendingPay.amount, currentPayee.name);
  }

  // ---- Contact threads --------------------------------------------------------
  function openContactThread(contact) {
    setThreadStore((prev) => {
      if (prev[contact.vpa]) return prev;
      return {
        ...prev,
        [contact.vpa]: {
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
        },
      };
    });
    setActiveThreadVpa(contact.vpa);
    setChatInput("");
    setCurrentPayee((prev) => ({
      ...prev,
      name: contact.name || contact.vpa.split("@")[0],
      vpa: contact.vpa,
      amount: contact.amount || 450,
      note: "Payment",
      purpose: contact.vpa === "cbi.clearance.cell@sbi" ? "GOVT_FINE" : "",
    }));
    setScreen("thread");
  }

  function sendThreadMessage() {
    const text = chatInput.trim();
    if (!text) return;
    setThreadStore((prev) => {
      const thread = prev[activeThreadVpa];
      if (!thread) return prev;
      const updated = {
        ...thread,
        messages: [
          ...thread.messages,
          { type: "MSG", sender: "OUT", text, time: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) },
        ],
      };
      return { ...prev, [activeThreadVpa]: updated };
    });
    setChatInput("");

    if (activeThreadVpa === "grocer.local@oksbi") {
      setTimeout(() => {
        setThreadStore((prev) => {
          const thread = prev[activeThreadVpa];
          if (!thread) return prev;
          return {
            ...prev,
            [activeThreadVpa]: {
              ...thread,
              messages: [
                ...thread.messages,
                { type: "MSG", sender: "IN", text: "Thank you for shopping with Suresh Kirana! 🙏", time: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) },
              ],
            },
          };
        });
      }, 900);
    }
  }

  function requestPayment() {
    const reqAmount = prompt("Enter amount to request via UPI (₹):", "500");
    if (reqAmount && parseFloat(reqAmount) > 0) {
      setThreadStore((prev) => {
        const thread = prev[activeThreadVpa];
        if (!thread) return prev;
        return {
          ...prev,
          [activeThreadVpa]: {
            ...thread,
            messages: [...thread.messages, { type: "MSG", sender: "OUT", text: `Payment Request: ₹${parseFloat(reqAmount).toLocaleString()}`, time: "Just now" }],
          },
        };
      });
    }
  }

  // ---- Payment composer ---------------------------------------------------------
  function openPaymentComposer(payee) {
    setCurrentPayee((prev) => ({ ...prev, ...payee }));
    setComposerAmount(payee.amount || 450);
    setComposerNote(payee.note || "");
    setComposerPurpose(payee.purpose || "");
    setComposerAudit({ badgeClass: "", badge: "VERIFYING...", text: "Checking..." });
    setScreen("composer");

    getJson(`/public/lookup/${encodeURIComponent(payee.vpa)}`)
      .then((data) => {
        const score = `Risk: ${Math.round(data.risk_score * 100)}/100`;
        if (data.mismatch_warning) {
          setComposerAudit({ badgeClass: "badge-warn", badge: "IMPERSONATION MISMATCH", text: data.mismatch_warning, score });
        } else if (data.mule_warning) {
          setComposerAudit({ badgeClass: "badge-danger", badge: "MULE PASS-THROUGH", text: data.mule_warning, score });
        } else if (data.merchant_badge) {
          setComposerAudit({ badgeClass: "", badge: "VERIFIED MERCHANT", text: data.merchant_badge, score });
        } else {
          setComposerAudit({ badgeClass: data.risk_level === "SAFE" ? "" : "badge-warn", badge: data.risk_level, text: data.verdict_plain, score });
        }
      })
      .catch(() => {
        setComposerAudit({ badgeClass: "", badge: "OFFLINE VERIFIED", text: `Standard transaction with ${payee.name}.` });
      });
  }

  function backFromComposer() {
    if (threadStore[currentPayee.vpa]) {
      setActiveThreadVpa(currentPayee.vpa);
      setScreen("thread");
    } else {
      setScreen("home");
    }
  }

  async function submitPayment() {
    const amount = parseFloat(composerAmount) || 0;
    if (amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setPendingPay((p) => ({ ...p, amount }));
    setCurrentPayee((prev) => ({ ...prev, amount, note: composerNote, purpose: composerPurpose || null }));

    animateSocTopology();

    try {
      const valData = await postJson("/upi/val-add", {
        psp_id: "gpay",
        payer_id: currentUser ? currentUser.customer_id : "cust_aarav",
        payer_account_id: currentUser ? currentUser.account_id : "acc_aarav_sbi",
        payee_vpa: currentPayee.vpa,
        declared_purpose: composerPurpose || null,
      }).then((r) => r.json());

      setPendingPay({ txnId: valData.txn_id, traceId: valData.trace_id, amount });

      if (valData.risk) setSocRisk(valData.risk);
      await refreshSocTraces(valData.trace_id);

      const payData = await postJson("/upi/pay", {
        trace_id: valData.trace_id,
        txn_id: valData.txn_id,
        amount_rupees: amount,
        user_acknowledged: false,
        pin: "1234",
      }).then((r) => r.json());

      if (payData.decision) setSocRisk(payData.decision);
      await refreshSocTraces(valData.trace_id);
      await refreshSocBalances();

      if (payData.status === "BLOCKED") {
        setScreen("home");
        showHardBlockSheet(
          payData.decision?.intervention_screen || {
            warning_title: "Payment Intercepted and Blocked",
            explanation: "Critical scam indicators triggered. Zero funds moved from your account.",
          }
        );
      } else if (payData.status === "AWAITING_ACK") {
        showCoachingSheet(
          payData.decision?.intervention_screen || {
            warning_title: "Urgent Security Warning",
            explanation: "You are paying a personal savings account claiming government authority.",
          }
        );
      } else if (payData.status === "AWAITING_CONFIRM") {
        if (confirm(`You are paying ₹${amount} to an unverified new recipient. Proceed?`)) {
          openMpin("PAY", amount);
        }
      } else {
        openMpin("PAY", amount);
      }
    } catch (e) {
      console.error(e);
      alert("Error initiating payment through ecosystem switch.");
    }
  }

  function onSuccessDone() {
    if (threadStore[currentPayee.vpa]) {
      setActiveThreadVpa(currentPayee.vpa);
      setScreen("thread");
    } else {
      setScreen("home");
    }
  }

  // ---- MPIN keypad ------------------------------------------------------------
  function openMpin(mode, amount) {
    setMpinMode(mode);
    setMpin("");
    setMpinAmount(amount);
    setShowMpin(true);
  }

  function closeMpin() {
    setShowMpin(false);
  }

  function mpinCancel() {
    closeMpin();
    if (screen === "composer") return;
    if (threadStore[activeThreadVpa]) {
      setScreen("thread");
    } else {
      setScreen("home");
    }
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key !== "Escape") return;
      if (showMpin) {
        closeMpin();
        if (screen !== "composer") {
          setScreen(threadStore[currentPayee.vpa] ? "thread" : "home");
        }
      }
      setShowQrModal(false);
      setShowCitizenModal(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMpin, screen, currentPayee.vpa, threadStore]);

  async function submitMpin() {
    if (mpin.length < 4) {
      alert("Please enter a 4-digit UPI PIN.");
      return;
    }
    if (mpinMode === "BALANCE") {
      await handleBalanceCheck(mpin);
    } else {
      await handlePaymentExecution(mpin);
    }
  }

  async function handleBalanceCheck(pin) {
    try {
      const res = await postJson("/upi/check-balance", { account_id: "acc_aarav_sbi", pin });
      closeMpin();
      if (!res.ok) {
        alert("Incorrect UPI PIN. (Hint: 1234)");
        return;
      }
      const data = await res.json();
      setBalanceDisplay(data.balance_formatted);
      setShowBalanceModal(true);
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
      const data = await postJson("/upi/pay", {
        trace_id: pendingPay.traceId,
        txn_id: pendingPay.txnId,
        amount_rupees: pendingPay.amount,
        user_acknowledged: true,
        pin,
      }).then((r) => r.json());

      closeMpin();

      const bank = currentBankLabel();
      setProcessingInfo({ amount: pendingPay.amount, payee: currentPayee.name, bankSub: `Contacting ${bank.full}` });
      setScreen("processing");

      await new Promise((r) => setTimeout(r, 750));

      if (data.status === "COMPLETED") {
        const assignedTxnId = pendingPay.txnId || "4254" + Math.floor(10000000 + Math.random() * 90000000);
        setThreadStore((prev) => {
          const existing = prev[currentPayee.vpa] || {
            name: currentPayee.name,
            vpa: currentPayee.vpa,
            avatar: currentPayee.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
            verified: false,
            badgeText: "Direct Beneficiary",
            defaultAmount: pendingPay.amount,
            messages: [],
          };
          return {
            ...prev,
            [currentPayee.vpa]: {
              ...existing,
              messages: [
                ...existing.messages,
                { type: "TXN", amount: pendingPay.amount, note: currentPayee.note || "UPI Payment", time: "Just now", status: "COMPLETED", txnId: assignedTxnId },
              ],
            },
          };
        });

        setSuccessInfo({
          amount: pendingPay.amount,
          payee: currentPayee.name,
          vpa: currentPayee.vpa,
          txnId: assignedTxnId,
          timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
          bankName: bank.name || "State Bank of India",
          last4: bank.last4 || "1001",
        });
        setScreen("success");

        await refreshSocBalances();
        await refreshSocTraces(pendingPay.traceId);
      } else if (data.status === "BLOCKED") {
        setScreen("home");
        showHardBlockSheet(
          data.decision?.intervention_screen || {
            warning_title: "Payment Intercepted and Blocked",
            explanation: "Critical scam indicators triggered. Zero funds moved from your account.",
          }
        );
      } else {
        alert(`Payment status: ${data.status}`);
      }
    } catch (e) {
      console.error(e);
      alert("Payment execution failed.");
    }
  }

  // ---- Transaction history -------------------------------------------------------
  async function openTransactionHistory() {
    try {
      const entries = await getJson("/accounts/acc_aarav_sbi/statement");
      setHistoryEntries(entries || []);
      setShowHistoryModal(true);
    } catch (e) {
      console.error(e);
    }
  }

  // ---- Global controls -------------------------------------------------------------
  async function resetDb() {
    try {
      await postJson("/reset-and-seed", {});
      await refreshSocBalances();
      alert("Ecosystem reset and seeded.");
    } catch (e) {
      console.error(e);
    }
  }

  async function verifyAuditChain() {
    try {
      const data = await getJson("/audit/verify");
      if (data.valid) {
        alert("Cryptographic Audit Chain: VERIFIED! All SHA-256 hash links intact.");
      } else {
        alert(`Audit chain broken at transaction: ${data.broken_txn_id}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // ---- App rail switcher ------------------------------------------------------------
  function switchAppRail(rail) {
    setActiveRail(rail);
    if (!currentUser) return;
    if (rail === "gpay") setScreen("home");
    else if (rail === "phonepe") setScreen("phonepe-home");
    else if (rail === "netbanking") {
      setScreen("netbanking-home");
      loadNetBankingData();
    }
  }

  // ---- QR scanner -----------------------------------------------------------------------
  async function scanQr(uri) {
    setShowQrModal(false);
    try {
      const data = await postJson("/qr/parse", { raw_uri: uri }).then((r) => r.json());
      openContactThread({
        vpa: data.payee_vpa,
        name: data.payee_name || data.payee_vpa.split("@")[0],
        amount: data.amount_rupees || 500,
        note: data.note || "QR Payment",
      });
      if (data.is_suspicious) showTrustedAlertToast(data.amount_rupees || 25000, data.payee_name);
    } catch (e) {
      console.error(e);
      const urlParams = new URLSearchParams(uri.split("?")[1] || "");
      const vpa = urlParams.get("pa") || "unknown@oksbi";
      const name = decodeURIComponent(urlParams.get("pn") || vpa.split("@")[0]);
      const amount = parseFloat(urlParams.get("am") || "500");
      openContactThread({ vpa, name, amount, note: "QR Payment" });
    }
  }

  // ---- Citizen checker -----------------------------------------------------------------
  async function doCitizenLookup(query) {
    try {
      const res = await fetch(`${API_BASE}/public/lookup/${encodeURIComponent(query)}`);
      if (!res.ok) return;
      const data = await res.json();
      setCitizenResult(data);
    } catch (e) {
      console.error(e);
    }
  }

  function openCitizenChecker() {
    setShowCitizenModal(true);
    doCitizenLookup(citizenQuery.trim() || "mule.syndicate@axis");
  }

  async function submitCitizenReport() {
    try {
      const data = await postJson("/community/report", {
        target_ref: citizenQuery.trim(),
        reporter_identity_hash: "citizen_user_" + Math.random().toString(36).substring(2, 8),
        reason_code: citizenReportReason,
      }).then((r) => r.json());
      setCitizenFeedback(data.message || "Report recorded successfully.");
      setCitizenFeedbackOk(!!data.success);
      setTimeout(() => doCitizenLookup(citizenQuery.trim()), 1000);
    } catch (e) {
      console.error(e);
    }
  }

  // ---- Pay-UPI-ID live audit ------------------------------------------------------------
  async function runLiveAudit(vpa) {
    setLiveAudit({ status: "AUDITING...", statusClass: "", detailHtml: "<em>Querying NPCI Central Mapper, Banking CBS ledger, and Kurukshetra FRM in real time...</em>", meta: "" });
    try {
      const data = await getJson(`/public/lookup/${encodeURIComponent(vpa)}`);
      const score = Math.round(data.risk_score * 100);
      const meta = `Resolved Name: ${data.resolved_name} • Account Type: ${data.account_type} • Risk Score: ${score}/100`;

      if (data.mismatch_warning) {
        setLiveAudit({ status: "IMPERSONATION MISMATCH", statusClass: "status-amber", detailHtml: data.mismatch_warning, detailColor: "#fdba74", meta, proceedLabel: "Proceed with Coaching Warning →", resolvedName: data.resolved_name });
      } else if (data.mule_warning) {
        setLiveAudit({ status: "MULE ACCOUNT (HARD BLOCK)", statusClass: "status-red", detailHtml: data.mule_warning, detailColor: "#fca5a5", meta, proceedLabel: "Inspect Blocked Details →", resolvedName: data.resolved_name });
      } else if (data.merchant_badge) {
        setLiveAudit({ status: "VERIFIED MERCHANT (ALLOW)", statusClass: "status-green", detailHtml: data.merchant_badge, detailColor: "#6ee7b7", meta, proceedLabel: "Pay Verified Grocer →", resolvedName: data.resolved_name });
      } else {
        const isSafe = data.risk_level === "SAFE";
        setLiveAudit({ status: data.risk_level, statusClass: isSafe ? "status-green" : "status-amber", detailHtml: data.verdict_plain, meta, proceedLabel: "Continue to Payment →", resolvedName: data.resolved_name });
      }
    } catch (e) {
      console.error(e);
      setLiveAudit({ status: "OFFLINE", statusClass: "", detailHtml: "Offline simulation verified.", meta: "" });
    }
  }

  function openPayUpiIdModal() {
    setShowPayUpiModal(true);
    const vpa = payUpiInput.trim() || "grocer.local@oksbi";
    runLiveAudit(vpa);
  }

  function proceedAuditedPay() {
    const vpa = payUpiInput.trim();
    if (!vpa) return;
    setShowPayUpiModal(false);
    const resolvedName = liveAudit?.resolvedName || vpa.split("@")[0];
    openContactThread({ name: resolvedName, vpa, amount: 500 });
  }

  // ---- Scenario presets ------------------------------------------------------------------
  async function runScenario(scen) {
    animateSocTopology();
    const narr = SCENARIO_NARRATIVES[scen];
    if (narr) showScenarioNarrative(scen === "blue" ? "stepup" : scen, narr.title, narr.body, "Running through the real Kurukshetra pipeline now...");

    try {
      const data = await getJson(`/scenarios/run/${scen}`);

      if (data.decision) {
        setSocRisk(data.decision);
      } else if (data.risk_zone) {
        setSocRisk({
          risk_zone: data.risk_zone,
          risk_score: data.risk_score,
          tier_reached: data.tier_reached || 0,
          decision: data.status,
          data_completeness: data.completeness || "FULL",
          audit_ref: "1",
          signals: [],
        });
      }

      if (data.trace_id) setSocTraceId(data.trace_id);
      setSocTraces(data.traces || []);
      await refreshSocBalances();

      if (narr) {
        const zone = data.risk_zone || data.decision?.risk_zone || "";
        showScenarioNarrative(scen === "blue" ? "stepup" : scen, narr.title, narr.body, `Verdict: ${zone} | trace ${data.trace_id || ""} | audit chain entry recorded`);
      }

      if (scen === "green") {
        openPaymentComposer({ name: "Suresh Kirana Store", vpa: "grocer.local@oksbi", amount: 450, note: "Groceries" });
        setSuccessInfo({ amount: 450, payee: "Suresh Kirana Store", vpa: "grocer.local@oksbi", txnId: "", timestamp: "", bankName: "State Bank of India", last4: "1001" });
        setScreen("success");
      } else if (scen === "orange") {
        showHardBlockSheet(
          data.intervention_screen || { warning_title: "Payment Blocked: CBI Extortion", explanation: "Declared purpose contradicts recipient savings account. Coercive extortion scheme detected." }
        );
      } else if (scen === "red") {
        showHardBlockSheet({ warning_title: "Payment Blocked: Mule Syndicate", explanation: "Account exhibits rapid drain velocity, multi-reporter flags, and high abandonment." });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function runSurpriseScenario() {
    const { vpa, amount, isScamShaped } = generateSurpriseVpa();
    animateSocTopology();
    showScenarioNarrative(
      "surprise",
      "🎲 Live-generated handle -- never seen before this click",
      `Generating "${vpa}" on the spot and sending it through the exact same NPCI Central Mapper + Kurukshetra Tier 0/1 pipeline as every other button. Nobody -- including whoever is presenting this -- typed or pre-scripted this identifier.`,
      "Resolving via resolve_or_provision_vpa()..."
    );

    try {
      const valData = await postJson("/upi/val-add", { psp_id: "gpay", payer_id: "cust_aarav", payer_account_id: "acc_aarav_sbi", payee_vpa: vpa }).then((r) => r.json());
      if (valData.risk) setSocRisk(valData.risk);
      await refreshSocTraces(valData.trace_id);

      const payData = await postJson("/upi/pay", {
        trace_id: valData.trace_id,
        txn_id: valData.txn_id,
        amount_rupees: amount,
        user_acknowledged: false,
        pin: "1234",
      }).then((r) => r.json());
      if (payData.decision) setSocRisk(payData.decision);
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
  }

  // ---- NetBanking ------------------------------------------------------------------------
  async function loadNetBankingData() {
    try {
      const accounts = await getJson("/accounts");
      const aarav = accounts.find((a) => a.account_id === "acc_aarav_sbi");
      if (aarav) setNbBalance(aarav.balance_formatted);

      const payees = await getJson("/netbanking/payees?customer_id=cust_aarav");
      setNbPayees(payees);
      if (payees.length > 0) setNbSelectedPayee(payees[0].account_id);
    } catch (e) {
      console.error(e);
    }
  }

  async function initiateNbTransfer() {
    const beneficiaryAccountId = nbSelectedPayee || "acc_suresh_sbi";
    const amountRupees = parseFloat(nbAmount) || 1000;
    try {
      const data = await postJson("/netbanking/transfer", {
        customer_id: "cust_aarav",
        payer_account_id: "acc_aarav_sbi",
        beneficiary_account_id: beneficiaryAccountId,
        amount_rupees: amountRupees,
        mode: nbMode,
        user_acknowledged: false,
      }).then((r) => r.json());

      if (data.status === "COMPLETED") {
        alert(`NetBanking ${nbMode} Transfer Successful!\n\nAmount: ₹${amountRupees.toLocaleString()}\nNew Balance: ${data.payer_balance}`);
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
  }

  function initPhonePeContact(vpa, name, amount) {
    openContactThread({ vpa, name, amount: amount || 450, note: "PhonePe transfer" });
  }

  // ------------------------------------------------------------------------------
  const activeThread = threadStore[activeThreadVpa];
  const bank = currentBankLabel();

  return (
    <>
      <header className="global-navbar">
        <div className="nav-left">
          <div className="google-g-logo">
            <span style={{ color: "#4285F4" }}>G</span>
            <span style={{ color: "#EA4335" }}>o</span>
            <span style={{ color: "#FBBC05" }}>o</span>
            <span style={{ color: "#4285F4" }}>g</span>
            <span style={{ color: "#34A853" }}>l</span>
            <span style={{ color: "#EA4335" }}>e</span>
            <span className="pay-text">Pay</span>
          </div>
          <span className="runtime-badge">KURUKSHETRA LIVE ENGINE</span>
        </div>

        <div className="nav-center view-mode-selector">
          <button className={`mode-toggle-btn${viewMode === "mode-gpay" ? " active" : ""}`} onClick={() => setViewMode("mode-gpay")}>📱 GPay App</button>
          <button className={`mode-toggle-btn${viewMode === "mode-dual" ? " active" : ""}`} onClick={() => setViewMode("mode-dual")}>🖥️ Dual View (App + SOC)</button>
          <button className={`mode-toggle-btn${viewMode === "mode-soc" ? " active" : ""}`} onClick={() => setViewMode("mode-soc")}>🛡️ Ecosystem SOC</button>
        </div>

        <div className="nav-right">
          <button className="btn-tool-pill" title="Open Public Scam Score Portal (Feature #34)" onClick={openCitizenChecker}>
            🛡️ Citizen Scam Check
          </button>
          <div className="metric-chip" id="audit-chip" title="Click to verify SHA-256 hash-chain integrity" onClick={verifyAuditChain}>
            <span className="icon">⛓️</span>
            <span>AUDIT: <strong>VERIFIED</strong></span>
          </div>
          <button className="btn-reset-pill" title="Reset all bank accounts and database to seed" onClick={resetDb}>
            <span>🔄</span> Reset
          </button>
        </div>
      </header>

      <div className="main-viewport-container">
        <div className="gpay-phone-wrapper">
          <div className="phone-app-rail-switcher">
            <button className={`rail-tab-btn${activeRail === "gpay" ? " active" : ""}`} onClick={() => switchAppRail("gpay")}>🔵 Google Pay</button>
            <button className={`rail-tab-btn${activeRail === "phonepe" ? " active" : ""}`} onClick={() => switchAppRail("phonepe")}>🟣 PhonePe</button>
            <button className={`rail-tab-btn${activeRail === "netbanking" ? " active" : ""}`} onClick={() => switchAppRail("netbanking")}>🏛️ SBI NetBanking</button>
          </div>

          <div className="phone-device-bezel">
            {toast && (
              <div className="trusted-alert-toast">
                <div className="toast-bell">🔔</div>
                <div className="toast-body">
                  <div className="toast-title">Kurukshetra Emergency Alert</div>
                  <div className="toast-msg">{toast}</div>
                </div>
                <button className="toast-close" onClick={() => setToast(null)}>&times;</button>
              </div>
            )}

            <div className="phone-notch">
              <div className="phone-camera"></div>
              <div className="phone-speaker-slot"></div>
            </div>

            <div className="phone-screen-inner">
              {screen === "login" && (
                <LoginScreen
                  username={loginUser}
                  password={loginPass}
                  onUsername={setLoginUser}
                  onPassword={setLoginPass}
                  onAutofill={() => { setLoginUser("android1"); setLoginPass("1234"); }}
                  onLogin={doLogin}
                />
              )}

              {screen === "home" && (
                <GPayHome
                  currentUser={currentUser}
                  bank={bank}
                  onOpenThread={openContactThread}
                  onOpenPayUpi={openPayUpiIdModal}
                  onOpenQr={() => setShowQrModal(true)}
                  onBankTransfer={() => switchAppRail("netbanking")}
                  onCheckBalance={() => openMpin("BALANCE", 0)}
                  onViewHistory={openTransactionHistory}
                  onOpenProfile={logout}
                />
              )}

              {screen === "phonepe-home" && <PhonePeHome onContact={initPhonePeContact} onQr={() => setShowQrModal(true)} onBalance={() => openMpin("BALANCE", 0)} />}

              {screen === "netbanking-home" && (
                <NetBankingHome
                  balance={nbBalance}
                  payees={nbPayees}
                  selectedPayee={nbSelectedPayee}
                  onSelectPayee={setNbSelectedPayee}
                  amount={nbAmount}
                  onAmount={setNbAmount}
                  mode={nbMode}
                  onMode={setNbMode}
                  onTransfer={initiateNbTransfer}
                />
              )}

              {screen === "thread" && activeThread && (
                <ContactThread
                  thread={activeThread}
                  chatInput={chatInput}
                  onChatInput={setChatInput}
                  onSend={sendThreadMessage}
                  onBack={() => setScreen("home")}
                  onPay={() =>
                    openPaymentComposer({
                      name: activeThread.name,
                      vpa: activeThread.vpa,
                      amount: activeThread.defaultAmount || 450,
                      note: activeThread.vpa === "grocer.local@oksbi" ? "Groceries" : "Direct Payment",
                      purpose: activeThread.vpa === "cbi.clearance.cell@sbi" ? "GOVT_FINE" : "",
                    })
                  }
                  onRequest={requestPayment}
                />
              )}

              {screen === "composer" && (
                <PaymentComposer
                  payee={currentPayee}
                  bank={bank}
                  amount={composerAmount}
                  onAmount={setComposerAmount}
                  note={composerNote}
                  onNote={setComposerNote}
                  purpose={composerPurpose}
                  onPurpose={setComposerPurpose}
                  audit={composerAudit}
                  onBack={backFromComposer}
                  onSubmit={submitPayment}
                />
              )}

              {screen === "processing" && processingInfo && <ProcessingScreen info={processingInfo} />}

              {screen === "success" && successInfo && <SuccessScreen info={successInfo} onDone={onSuccessDone} />}

              {showMpin && (
                <NpciMpin
                  amount={mpinAmount}
                  mpin={mpin}
                  onDigit={(d) => setMpin((prev) => (prev.length < 4 ? prev + d : prev))}
                  onDelete={() => setMpin((prev) => prev.slice(0, -1))}
                  onCancel={mpinCancel}
                  onSubmit={submitMpin}
                />
              )}

              {coachSheet && (
                <CoachingSheet
                  sheet={coachSheet}
                  ack={coachAck}
                  onAck={setCoachAck}
                  onCancel={() => setCoachSheet(null)}
                  onProceed={() => {
                    setCoachSheet(null);
                    openMpin("PAY", pendingPay.amount);
                  }}
                />
              )}

              {freezeSheet && (
                <FreezeSheet
                  sheet={freezeSheet}
                  onDismiss={() => setFreezeSheet(null)}
                  onHelpline={() => alert("Dialing 1930 National Cyber Crime Reporting Helpline...")}
                />
              )}

              {showBalanceModal && (
                <BalanceModal balance={balanceDisplay} bankLabel={bank.full} onClose={() => setShowBalanceModal(false)} />
              )}

              {showHistoryModal && <HistoryModal entries={historyEntries} onClose={() => setShowHistoryModal(false)} />}

              {showQrModal && <QrScannerModal onClose={() => setShowQrModal(false)} onScan={scanQr} />}

              {showPayUpiModal && (
                <PayUpiIdModal
                  value={payUpiInput}
                  onChange={setPayUpiInput}
                  onClose={() => setShowPayUpiModal(false)}
                  onAudit={runLiveAudit}
                  audit={liveAudit}
                  onProceed={proceedAuditedPay}
                />
              )}
            </div>
          </div>
        </div>

        <SocObserver
          onRunScenario={runScenario}
          onSurprise={runSurpriseScenario}
          narrative={narrative}
          activeNodes={activeNodes}
          accounts={socAccounts}
          risk={socRisk}
          traceId={socTraceId}
          traces={socTraces}
          campaigns={campaigns}
          onKillSwitch={triggerKillSwitch}
        />
      </div>

      {showCitizenModal && (
        <CitizenCheckerModal
          query={citizenQuery}
          onQuery={setCitizenQuery}
          onSearch={() => doCitizenLookup(citizenQuery.trim())}
          onClose={() => setShowCitizenModal(false)}
          result={citizenResult}
          reason={citizenReportReason}
          onReason={setCitizenReportReason}
          onReport={submitCitizenReport}
          feedback={citizenFeedback}
          feedbackOk={citizenFeedbackOk}
        />
      )}
    </>
  );
}

// =============================================================================
// Screen components
// =============================================================================

function LoginScreen({ username, password, onUsername, onPassword, onAutofill, onLogin }) {
  return (
    <div className="gpay-view" id="screen-login">
      <div className="login-brand-hero">
        <div className="hero-g-circle">
          <svg width="40" height="40" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        </div>
        <h1 className="hero-title">Google Pay</h1>
        <p className="hero-subtitle">Fast, simple, and secure payments</p>
      </div>

      <div className="login-form-card">
        <div className="login-instruction">Sign in to your simulated Android phone:</div>
        <div className="login-field-group">
          <label htmlFor="login-username">Username</label>
          <input type="text" id="login-username" className="g-input" value={username} onChange={(e) => onUsername(e.target.value)} placeholder="android1" />
        </div>
        <div className="login-field-group">
          <label htmlFor="login-password">Password</label>
          <input type="password" id="login-password" className="g-input" value={password} onChange={(e) => onPassword(e.target.value)} placeholder="1234" />
        </div>

        <div className="login-quick-helper">
          <span>Demo User:</span> <code>android1</code> / <code>1234</code>
          <button type="button" className="btn-text" onClick={onAutofill}>Auto-fill</button>
        </div>

        <button type="button" className="btn-gpay-primary" onClick={onLogin}>
          Sign in &rarr;
        </button>
      </div>

      <div className="login-footer-security">
        <span>🔒 Protected by Kurukshetra Real-Time ML/Heuristic Interception</span>
      </div>
    </div>
  );
}

const PEOPLE = [
  { vpa: "grocer.local@oksbi", name: "Suresh Kirana Store", amount: 450, note: "Groceries", initials: "SK", cls: "person-suresh", badge: "safe", sub: "Trusted Grocer" },
  { vpa: "newshop.mumbai@oksbi", name: "Unregistered New Shop", amount: 2500, note: "Apparel", initials: "NS", cls: "person-newshop", sub: "Unverified" },
  { vpa: "cbi.clearance.cell@sbi", name: "Manoj Kumar (Fake CBI)", amount: 75000, note: "GOVT_FINE", initials: "CBI", cls: "person-cbi", badge: "alert", sub: "Extortion Scam", subColor: "#fb923c" },
  { vpa: "mule.syndicate@axis", name: "Deepak Layering Account", amount: 50000, note: "Crypto Settlement", initials: "DL", cls: "person-mule", badge: "danger", sub: "Rapid Drain", subColor: "#f87171" },
];

function GPayHome({ currentUser, bank, onOpenThread, onOpenPayUpi, onOpenQr, onBankTransfer, onCheckBalance, onViewHistory, onOpenProfile }) {
  const [search, setSearch] = useState("");

  function submitSearch(e) {
    if (e.key !== "Enter") return;
    const q = search.trim();
    if (!q) return;
    if (q.includes("@")) {
      onOpenThread({ name: q.split("@")[0], vpa: q, amount: 500, note: "Direct Payment" });
    } else {
      onOpenPayUpi();
    }
    setSearch("");
  }

  return (
    <div className="gpay-view" id="screen-gpay-home">
      <div className="gpay-home-header">
        <div className="gpay-search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Pay by name or phone number" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={submitSearch} />
          <span className="mic-icon">🎙️</span>
        </div>
        <div className="gpay-profile-circle" title="View Profile" onClick={onOpenProfile}>
          <span>A</span>
        </div>
      </div>

      <div className="gpay-home-scroll">
        <div className="gpay-actions-grid">
          <div className="gpay-action-item" onClick={onOpenQr}>
            <div className="action-icon-circle blue-grad">📷</div>
            <span className="action-label">Scan any QR</span>
          </div>
          <div className="gpay-action-item" onClick={() => onOpenThread({ name: "Suresh Kirana Store", vpa: "grocer.local@oksbi", amount: 450, note: "Groceries" })}>
            <div className="action-icon-circle blue-grad">👥</div>
            <span className="action-label">Pay contacts</span>
          </div>
          <div className="gpay-action-item" onClick={onOpenPayUpi}>
            <div className="action-icon-circle blue-grad">📱</div>
            <span className="action-label">Pay phone</span>
          </div>
          <div className="gpay-action-item" onClick={onBankTransfer}>
            <div className="action-icon-circle blue-grad">🏛️</div>
            <span className="action-label">Bank transfer</span>
          </div>
          <div className="gpay-action-item" onClick={onOpenPayUpi}>
            <div className="action-icon-circle blue-grad">🆔</div>
            <span className="action-label">Pay UPI ID</span>
          </div>
          <div className="gpay-action-item">
            <div className="action-icon-circle blue-grad">🔄</div>
            <span className="action-label">Self transfer</span>
          </div>
          <div className="gpay-action-item">
            <div className="action-icon-circle blue-grad">💡</div>
            <span className="action-label">Pay bills</span>
          </div>
          <div className="gpay-action-item">
            <div className="action-icon-circle blue-grad">📶</div>
            <span className="action-label">Recharge</span>
          </div>
        </div>

        <div className="gpay-section-container">
          <div className="section-heading-row">
            <span className="section-title">People</span>
            <span className="section-action" onClick={onOpenPayUpi}>+ Add</span>
          </div>

          <div className="people-avatars-grid">
            {PEOPLE.map((p) => (
              <div className="person-contact-item" key={p.vpa} onClick={() => onOpenThread({ name: p.name, vpa: p.vpa, amount: p.amount, note: p.note })}>
                <div className={`person-avatar-circle ${p.cls}`}>
                  <span>{p.initials}</span>
                  {p.badge === "safe" && <div className="safe-badge-tick">✓</div>}
                  {p.badge === "alert" && <div className="alert-badge-icon">⚠️</div>}
                  {p.badge === "danger" && <div className="danger-badge-icon">🛑</div>}
                </div>
                <div className="person-name">{p.name.split(" ")[0] === "Suresh" ? "Suresh Kirana" : p.name.split(" ").slice(0, 2).join(" ")}</div>
                <div className="person-sub" style={p.subColor ? { color: p.subColor } : undefined}>{p.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="gpay-section-container">
          <div className="section-heading-row">
            <span className="section-title">Businesses</span>
            <span className="section-action">Explore</span>
          </div>
          <div className="people-avatars-grid">
            <div className="person-contact-item" onClick={() => onOpenThread({ name: "Croma Electronics", vpa: "croma.retail@axis", amount: 4999, note: "Electronics purchase" })}>
              <div className="person-avatar-circle biz-croma-avatar"><span>CR</span></div>
              <div className="person-name">Croma</div>
              <div className="person-sub">Electronics</div>
            </div>
            <div className="person-contact-item" onClick={() => onOpenThread({ name: "Swiggy", vpa: "swiggy.pay@icici", amount: 349, note: "Food delivery" })}>
              <div className="person-avatar-circle biz-swiggy"><span>SW</span></div>
              <div className="person-name">Swiggy</div>
              <div className="person-sub">Food Delivery</div>
            </div>
            <div className="person-contact-item" onClick={() => onOpenThread({ name: "Zomato", vpa: "zomato.pay@icici", amount: 289, note: "Food order" })}>
              <div className="person-avatar-circle biz-zomato"><span>ZO</span></div>
              <div className="person-name">Zomato</div>
              <div className="person-sub">Dining</div>
            </div>
          </div>
        </div>

        <div className="gpay-section-container">
          <div className="section-heading-row">
            <span className="section-title">Manage your money</span>
          </div>

          <div className="manage-money-card" onClick={onCheckBalance}>
            <div className="money-card-icon">🏦</div>
            <div className="money-card-info">
              <div className="money-card-title">Check bank balance</div>
              <div className="money-card-sub">{bank.full}</div>
            </div>
            <div className="money-card-arrow">&rarr;</div>
          </div>

          <div className="manage-money-card" onClick={onViewHistory}>
            <div className="money-card-icon">📜</div>
            <div className="money-card-info">
              <div className="money-card-title">See transaction history</div>
              <div className="money-card-sub">Recent UPI debits & credits</div>
            </div>
            <div className="money-card-arrow">&rarr;</div>
          </div>
        </div>

        <div className="gpay-home-footer-info">
          <span>UPI ID: <strong>{currentUser?.vpa || "aarav@oksbi"}</strong></span>
        </div>
      </div>
    </div>
  );
}

const PHONEPE_CONTACTS = [
  { vpa: "grocer.local@oksbi", name: "Suresh Kirana (New on PhonePe)", amount: 450, label: "Suresh (New)", cls: "" },
  { vpa: "mule.syndicate@axis", name: "Deepak Syndicate", amount: 12000, label: "Deepak M.", cls: "ph-danger-avatar" },
  { vpa: "crypto.arbitrage@ybl", name: "Crypto Arbitrage", amount: 30000, label: "Crypto Arbit.", cls: "ph-warn-avatar" },
];

function PhonePeHome({ onContact, onQr, onBalance }) {
  return (
    <div className="gpay-view" id="screen-phonepe-home">
      <div className="phonepe-home-header">
        <div className="phonepe-logo-row">
          <div className="phonepe-logo">पे <span>PhonePe</span></div>
          <div className="phonepe-header-icons">
            <span className="ph-icon" title="Scan QR" onClick={onQr}>📷</span>
            <span className="ph-icon">🔔</span>
            <span className="ph-icon">❓</span>
          </div>
        </div>
        <div className="phonepe-profile-card">
          <div className="ph-avatar">A</div>
          <div className="ph-user-info">
            <div className="ph-name">Aarav Sharma</div>
            <div className="ph-vpa">aarav@ybl</div>
          </div>
          <div className="ph-iso-badge">ISOLATED LEDGER</div>
        </div>
      </div>

      <div className="phonepe-scroll">
        <div className="phonepe-action-card">
          <div className="ph-card-title">Transfer Money</div>
          <div className="ph-actions-grid">
            <div className="ph-action-item" onClick={onQr}>
              <div className="ph-icon-box">📷</div>
              <span>Scan QR</span>
            </div>
            <div className="ph-action-item">
              <div className="ph-icon-box">👤</div>
              <span>To Mobile</span>
            </div>
            <div className="ph-action-item">
              <div className="ph-icon-box">🏛️</div>
              <span>To UPI ID</span>
            </div>
            <div className="ph-action-item" onClick={onBalance}>
              <div className="ph-icon-box">₹</div>
              <span>Check Balance</span>
            </div>
          </div>
        </div>

        <div className="phonepe-isolation-notice">
          <div className="notice-icon">ℹ️</div>
          <div className="notice-text">
            <strong>Cross-PSP History Blind Spot:</strong> PhonePe operates its own isolated local ledger. Transfers made on Google Pay are invisible here. Suresh Kirana is treated as a <em>new beneficiary</em> on PhonePe, triggering Kurukshetra Tier 1 checks!
          </div>
        </div>

        <div className="phonepe-section">
          <div className="ph-sec-title">Transfers on PhonePe</div>
          <div className="ph-contacts-row">
            {PHONEPE_CONTACTS.map((c) => (
              <div className="ph-contact-circle" key={c.vpa} onClick={() => onContact(c.vpa, c.name, c.amount)}>
                <div className={`ph-circle-avatar ${c.cls}`}>{c.label.slice(0, 2).toUpperCase()}</div>
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NetBankingHome({ balance, payees, selectedPayee, onSelectPayee, amount, onAmount, mode, onMode, onTransfer }) {
  return (
    <div className="gpay-view" id="screen-netbanking-home">
      <div className="netbanking-header">
        <div className="nb-logo-row">
          <div className="nb-sbi-emblem">SBI</div>
          <div className="nb-brand">State Bank of India <span>Retail NetBanking</span></div>
        </div>
        <div className="nb-user-chip">Logged in: <strong>cust_aarav</strong></div>
      </div>

      <div className="netbanking-scroll">
        <div className="nb-account-card">
          <div className="nb-acc-row">
            <div>
              <div className="nb-label">Primary Account</div>
              <div className="nb-acc-no">SBIN-20348911001</div>
            </div>
            <div className="nb-acc-right">
              <div className="nb-label">Available Balance</div>
              <div className="nb-balance">{balance}</div>
            </div>
          </div>
        </div>

        <div className="nb-section-card">
          <div className="nb-sec-header">
            <span>Registered Beneficiaries</span>
            <span className="nb-rule-hint">RBI 30-min Cooling-Off Mandatory</span>
          </div>
          <div className="nb-payee-list">
            {payees.map((p) => (
              <div className="nb-payee-item" key={p.account_id}>
                <div>
                  <strong>{p.customer_name}</strong>
                  <span style={{ fontSize: 10, color: "#82a8d8", display: "block" }}>{p.bank_id} • {p.account_number}</span>
                </div>
                <div>
                  {p.is_cooling_off ? (
                    <span className="nb-timer-badge">⏳ Cooling: {Math.floor(p.cooling_off_remaining_seconds / 60)}m left</span>
                  ) : (
                    <span style={{ color: "#4caf50", fontSize: 10, fontWeight: 700 }}>ACTIVE</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="nb-section-card">
          <div className="nb-sec-header">Instant IMPS / NEFT Transfer</div>
          <div className="nb-form-group">
            <label htmlFor="nb-transfer-payee">Select Beneficiary</label>
            <select id="nb-transfer-payee" className="nb-select" value={selectedPayee} onChange={(e) => onSelectPayee(e.target.value)}>
              {payees.map((p) => (
                <option key={p.account_id} value={p.account_id}>{p.customer_name} ({p.bank_id} {p.account_number})</option>
              ))}
            </select>
          </div>
          <div className="nb-form-group">
            <label htmlFor="nb-transfer-amount">Amount (₹)</label>
            <input type="number" id="nb-transfer-amount" className="nb-input" value={amount} min="1" onChange={(e) => onAmount(e.target.value)} />
          </div>
          <div className="nb-form-group">
            <label>Transfer Mode</label>
            <div className="nb-radio-row">
              <label><input type="radio" name="nb-mode" checked={mode === "IMPS"} onChange={() => onMode("IMPS")} /> IMPS (Instant)</label>
              <label><input type="radio" name="nb-mode" checked={mode === "NEFT"} onChange={() => onMode("NEFT")} /> NEFT (Batch)</label>
            </div>
          </div>
          <button type="button" className="btn-nb-primary" onClick={onTransfer}>
            Initiate Transfer with Kurukshetra Check &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactThread({ thread, chatInput, onChatInput, onSend, onBack, onPay, onRequest }) {
  const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [thread.messages.length]);

  return (
    <div className="gpay-view" id="screen-contact-thread">
      <div className="thread-header">
        <button className="btn-icon-back" onClick={onBack}>&larr;</button>
        <div className="thread-avatar-circle">{thread.avatar}</div>
        <div className="thread-recipient-details">
          <div className="thread-recipient-name">{thread.name}</div>
          <div className="thread-recipient-vpa-row">
            <span>{thread.vpa}</span>
            <span className="thread-verified-tick" style={{ color: thread.verified ? "#10b981" : thread.advisory?.level === "danger" ? "#f87171" : "#fb923c" }}>
              {thread.badgeText || (thread.verified ? "✓ Verified" : "Unverified")}
            </span>
          </div>
        </div>
        <div className="thread-header-actions">
          <button className="btn-thread-icon" title="Call">📞</button>
          <button className="btn-thread-icon" title="Options">⋮</button>
        </div>
      </div>

      {thread.advisory && (
        <div className={`thread-advisory-banner${thread.advisory.level === "danger" ? " danger-mode" : ""}`}>
          <div className="advisory-icon">{thread.advisory.level === "danger" ? "🛑" : "⚠️"}</div>
          <div className="advisory-content">
            <div className="advisory-title">{thread.advisory.title}</div>
            <div className="advisory-body">{thread.advisory.body}</div>
          </div>
        </div>
      )}

      <div className="thread-body-scroll" ref={listRef}>
        {thread.messages.map((m, i) => {
          if (m.type === "DATE") return <div className="thread-date-divider" key={i}>{m.text}</div>;
          if (m.type === "TXN")
            return (
              <div className="thread-txn-card" key={i}>
                <div className="txn-card-header">
                  <span className="txn-amount-big">₹{m.amount.toLocaleString()}</span>
                  <span className="txn-status-badge">✓ {m.status === "COMPLETED" ? "Paid" : m.status}</span>
                </div>
                <div className="txn-note-text">{m.note}</div>
                <div className="txn-bank-row">
                  <span>State Bank of India ••••1001</span>
                  <span>{m.time}</span>
                </div>
              </div>
            );
          return (
            <div className={`thread-chat-bubble ${m.sender === "OUT" ? "bubble-outgoing" : "bubble-incoming"}`} key={i}>
              <div>{m.text}</div>
              <div className="bubble-time">{m.time}</div>
            </div>
          );
        })}
      </div>

      <div className="thread-footer">
        <div className="thread-input-row">
          <input
            type="text"
            placeholder={`Message ${thread.name.split(" ")[0]}...`}
            value={chatInput}
            onChange={(e) => onChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
          />
          <button className="btn-send-msg" onClick={onSend}>➤</button>
        </div>
        <div className="thread-actions-pills">
          <button className="btn-thread-pill btn-pill-pay" onClick={onPay}>
            <span className="pill-rupee">₹</span> Pay
          </button>
          <button className="btn-thread-pill btn-pill-request" onClick={onRequest}>
            Request
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentComposer({ payee, bank, amount, onAmount, note, onNote, purpose, onPurpose, audit, onBack, onSubmit }) {
  const initials = payee.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="gpay-view" id="screen-payment-composer">
      <div className="composer-header">
        <button className="btn-icon-back" onClick={onBack}>&larr;</button>
        <div className="composer-recipient-info">
          <div className="composer-recipient-name">{payee.name}</div>
          <div className="composer-recipient-vpa">{payee.vpa}</div>
        </div>
        <div className="composer-more">⋮</div>
      </div>

      <div className="composer-body">
        <div className="composer-avatar-large">{initials}</div>
        <div className="composer-paying-text">Paying <span>{payee.name}</span></div>

        <div className="composer-audit-card">
          <div className="comp-audit-header">
            <span className={`comp-audit-badge${audit.badgeClass ? " " + audit.badgeClass : ""}`}>{audit.badge}</span>
            <span className="comp-audit-score">{audit.score || "Checking..."}</span>
          </div>
          <div className="comp-audit-text">{audit.text}</div>
        </div>

        <div className="composer-amount-box">
          <span className="composer-rupee-sign">₹</span>
          <input type="number" className="composer-amount-field" value={amount} min="1" step="1" onChange={(e) => onAmount(e.target.value)} />
        </div>

        <div className="composer-note-box">
          <input type="text" placeholder="Add a note (e.g. Groceries, Dinner)" value={note} onChange={(e) => onNote(e.target.value)} />
        </div>

        <div className="composer-purpose-dropdown">
          <label htmlFor="comp-purpose-select">Intent / Category:</label>
          <select id="comp-purpose-select" className="g-select-sm" value={purpose} onChange={(e) => onPurpose(e.target.value)}>
            <option value="">Personal / General Payment</option>
            <option value="GOVT_FINE">Government Fine / Tax Penalty</option>
            <option value="COURT_BAIL">Court Bail / Law Enforcement</option>
            <option value="REFUND">Refund / Reversal</option>
          </select>
        </div>

        <div className="composer-bank-selector">
          <div className="bank-sbi-logo">{bank.initials}</div>
          <div className="bank-details">
            <div className="bank-name">{bank.full}</div>
            <div className="bank-balance-hint">Savings Account</div>
          </div>
          <div className="bank-check-icon">✓</div>
        </div>

        <button className="btn-gpay-primary btn-pay-action" onClick={onSubmit}>
          Pay ₹<span>{Number(amount || 0).toLocaleString()}</span> &rarr;
        </button>
      </div>
    </div>
  );
}

function NpciMpin({ amount, mpin, onDigit, onDelete, onCancel, onSubmit }) {
  return (
    <div className="npci-mpin-overlay" id="screen-npci-mpin">
      <div className="npci-header">
        <button className="npci-cancel-btn" title="Cancel" onClick={onCancel}>✕</button>
        <div className="npci-brand-title">NPCI <span>UPI</span></div>
        <div className="npci-bank-label">State Bank of India</div>
      </div>

      <div className="npci-body">
        <div className="npci-txn-summary">
          <span className="npci-paying-label">ENTER 4-DIGIT UPI PIN</span>
          <span className="npci-amount-display">{amount > 0 ? `₹${amount.toLocaleString()}` : "Check Balance"}</span>
        </div>

        <div className="npci-pin-dots">
          {[0, 1, 2, 3].map((i) => (
            <div className={`pin-dot${i < mpin.length ? " filled" : ""}`} key={i}></div>
          ))}
        </div>

        <div className="npci-security-warning">
          <span>🔒 UPI PIN will debit your account. Never share with anyone.</span>
        </div>

        <div className="npci-keypad">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((k) => (
            <button className="kbtn" data-key={k} key={k} onClick={() => onDigit(k)}>{k}</button>
          ))}
          <button className="kbtn kbtn-del" onClick={onDelete}>⌫</button>
          <button className="kbtn" data-key="0" onClick={() => onDigit("0")}>0</button>
          <button className="kbtn kbtn-submit" onClick={onSubmit}>✓</button>
        </div>
      </div>
    </div>
  );
}

function ProcessingScreen({ info }) {
  return (
    <div className="gpay-view" id="screen-payment-processing">
      <div className="processing-screen-inner">
        <div className="processing-spinner-ring">
          <div className="spinner-dual-arc"></div>
        </div>
        <div className="proc-amount-text">Paying ₹{info.amount.toLocaleString()}</div>
        <div className="proc-payee-text">To <strong>{info.payee}</strong></div>
        <div className="proc-bank-sub">{info.bankSub}</div>
        <div className="proc-frm-shield">
          <span className="shield-pulse">🛡️</span>
          <span>Protected in real time by Kurukshetra FRM</span>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ info, onDone }) {
  return (
    <div className="gpay-view" id="screen-gpay-success">
      <div className="success-screen-inner">
        <div className="success-blue-circle">
          <svg className="checkmark-svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>

        <div className="success-amount-text">₹{info.amount.toLocaleString()}</div>
        <div className="success-paid-to">Paid to <strong>{info.payee}</strong></div>
        <div className="success-timestamp">{info.timestamp || "Just now"}</div>

        <div className="success-details-card">
          <div className="succ-detail-row">
            <span>UPI transaction ID</span>
            <strong>{info.txnId || "—"}</strong>
          </div>
          <div className="succ-detail-row">
            <span>To:</span>
            <span>{info.vpa}</span>
          </div>
          <div className="succ-detail-row">
            <span>From: {info.bankName}</span>
            <span>••••{info.last4}</span>
          </div>
          <div className="succ-detail-row">
            <span>CBS Invariant:</span>
            <span style={{ color: "#10b981", fontWeight: 700 }}>Double-Entry 2 Legs Posted</span>
          </div>
        </div>

        <button className="btn-gpay-primary" onClick={onDone}>Done</button>
      </div>
    </div>
  );
}

function CoachingSheet({ sheet, ack, onAck, onCancel, onProceed }) {
  return (
    <div className="material-bottom-sheet" id="sheet-coaching">
      <div className="sheet-content sheet-warning">
        <div className="sheet-icon-header">
          <div className="sheet-alert-icon">⚠️</div>
          <div className="sheet-title">{sheet.title}</div>
        </div>

        <div className="sheet-explanation">{sheet.body}</div>

        <label className="sheet-ack-checkbox">
          <input type="checkbox" checked={ack} onChange={(e) => onAck(e.target.checked)} />
          <span>I understand this is an ordinary individual account and NOT an official government treasury account. Proceed at my own risk.</span>
        </label>

        <div className="sheet-actions">
          <button className="btn-sheet-cancel" onClick={onCancel}>Cancel Payment</button>
          <button className="btn-sheet-proceed" disabled={!ack} onClick={onProceed}>Proceed to PIN &rarr;</button>
        </div>
      </div>
    </div>
  );
}

function FreezeSheet({ sheet, onDismiss, onHelpline }) {
  return (
    <div className="material-bottom-sheet" id="sheet-freeze">
      <div className="sheet-content sheet-danger">
        <div className="sheet-icon-header">
          <div className="sheet-alert-icon danger-icon">🛑</div>
          <div className="sheet-title">{sheet.title}</div>
        </div>

        <div className="sheet-explanation">{sheet.body}</div>

        <div className="sheet-safe-guarantee">
          🛡️ <strong>Zero funds moved from your account.</strong> Your SBI balance is 100% safe.
        </div>

        <div className="sheet-actions">
          <button className="btn-sheet-helpline" onClick={onHelpline}>📞 Call 1930 Cyber Helpline</button>
          <button className="btn-sheet-cancel" onClick={onDismiss}>Got It</button>
        </div>
      </div>
    </div>
  );
}

function BalanceModal({ balance, bankLabel, onClose }) {
  return (
    <div className="gpay-dialog-overlay" id="modal-bank-balance">
      <div className="gpay-dialog-card">
        <div className="dialog-bank-icon">🏛️</div>
        <div className="dialog-title">Available Bank Balance</div>
        <div className="dialog-sub">{bankLabel}</div>
        <div className="dialog-balance-big">{balance}</div>
        <button className="btn-gpay-primary" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

function HistoryModal({ entries, onClose }) {
  return (
    <div className="gpay-dialog-overlay" id="modal-tx-history">
      <div className="gpay-drawer-card">
        <div className="drawer-header">
          <div className="drawer-title">Transaction History</div>
          <button className="drawer-close" onClick={onClose}>&times;</button>
        </div>
        <div className="drawer-scroll-list">
          {entries.length === 0 ? (
            <div className="empty-timeline-msg">No transactions recorded yet.</div>
          ) : (
            entries.map((e, i) => {
              const isDebit = e.direction === "DEBIT";
              return (
                <div className="manage-money-card" key={i}>
                  <div className="money-card-icon">{isDebit ? "🔴" : "🟢"}</div>
                  <div className="money-card-info">
                    <div className="money-card-title">{e.narration || "UPI Transaction"}</div>
                    <div className="money-card-sub">{e.posted_at ? new Date(e.posted_at).toLocaleString() : "Recent"}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: isDebit ? "#f87171" : "#34d399" }}>
                    {isDebit ? "-" : "+"}{e.amount_formatted}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

const QR_SAMPLES = [
  { id: "safe", uri: "upi://pay?pa=grocer.local@oksbi&pn=Suresh%20Kirana&mc=5411", icon: "🛒", title: "Suresh Kirana (Merchant QR)", sub: "Safe grocer • Standard payment", badge: "SAFE", badgeCls: "qr-badge-safe", cardCls: "" },
  { id: "trap", uri: "upi://pay?pa=scam.lottery@oksbi&pn=Cashback%20Reward&am=25000&tn=claim_reward", icon: "⚠️", title: "Phishing 'Scan-to-Receive' Trap", sub: "Feature #9 • Pre-filled debit am=25000", badge: "DEBIT TRAP", badgeCls: "qr-badge-danger", cardCls: "qr-card-trap" },
  { id: "deeplink", uri: "upi://pay?pa=cbi.clearance.cell@sbi&pn=CBI%20Officer&am=50000&tn=kyc_urgent_fine", icon: "🚨", title: "Deep-Link Impersonation Trap", sub: "Feature #10 • Pre-filled fine tn=kyc_urgent", badge: "PHISHING", badgeCls: "qr-badge-danger", cardCls: "qr-card-trap" },
];

function QrScannerModal({ onClose, onScan }) {
  return (
    <div className="qr-scanner-modal" id="modal-qr-scanner" onClick={(e) => e.target.id === "modal-qr-scanner" && onClose()}>
      <div className="qr-camera-viewfinder">
        <button className="qr-btn-close" onClick={onClose}>&times;</button>
        <div className="qr-target-box">
          <div className="qr-laser-line"></div>
          <div className="qr-corner tl"></div>
          <div className="qr-corner tr"></div>
          <div className="qr-corner bl"></div>
          <div className="qr-corner br"></div>
        </div>
        <div className="qr-instruction-text">Point camera at UPI QR Code</div>
      </div>

      <div className="qr-presets-sheet">
        <div className="qr-presets-title">Tap a sample QR Code to simulate scan:</div>
        <div className="qr-chips-row">
          {QR_SAMPLES.map((s) => (
            <div className={`qr-sample-card ${s.cardCls}`} key={s.id} onClick={() => onScan(s.uri)}>
              <div className="qr-card-icon">{s.icon}</div>
              <div className="qr-card-info">
                <strong>{s.title}</strong>
                <span>{s.sub}</span>
              </div>
              <div className={s.badgeCls}>{s.badge}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PAY_UPI_SAMPLES = [
  { vpa: "grocer.local@oksbi", label: "🛒 Suresh Kirana (Safe)", cls: "chip-safe" },
  { vpa: "cbi.clearance.cell@sbi", label: "⚠️ CBI Clearance (Impersonation)", cls: "chip-warn" },
  { vpa: "mule.syndicate@axis", label: "🛑 Mule Syndicate (Rapid Drain)", cls: "chip-danger" },
  { vpa: "newshop.mumbai@oksbi", label: "🛍️ New Shop (Unverified)", cls: "chip-info" },
];

function PayUpiIdModal({ value, onChange, onClose, onAudit, audit, onProceed }) {
  return (
    <div className="gpay-dialog-overlay" id="modal-pay-upi-id">
      <div className="gpay-drawer-card upi-audit-drawer">
        <div className="drawer-header">
          <div className="drawer-title">Pay Any UPI ID / Number</div>
          <button className="drawer-close" onClick={onClose}>&times;</button>
        </div>

        <div className="upi-input-container">
          <label htmlFor="input-custom-upi" className="upi-input-label">Enter or Paste UPI ID:</label>
          <div className="upi-input-group">
            <input
              type="text"
              id="input-custom-upi"
              placeholder="e.g. grocer.local@oksbi, cbi.clearance.cell@sbi"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && value.trim() && onAudit(value.trim())}
            />
            <button type="button" className="btn-input-audit" onClick={() => value.trim() && onAudit(value.trim())}>Audit & Verify</button>
          </div>

          <div className="upi-quick-chips">
            <span className="chip-label">Test Samples:</span>
            {PAY_UPI_SAMPLES.map((s) => (
              <button type="button" key={s.vpa} className={`sample-upi-chip ${s.cls}`} onClick={() => { onChange(s.vpa); onAudit(s.vpa); }}>
                {s.label}
              </button>
            ))}
          </div>

          {audit && (
            <div className="live-deep-audit-panel">
              <div className="audit-panel-header">
                <span className={`audit-status-pill${audit.statusClass ? " " + audit.statusClass : ""}`}>{audit.status}</span>
                <span className="audit-target-handle">{value}</span>
              </div>
              <div className="audit-panel-detail">
                <span style={audit.detailColor ? { color: audit.detailColor } : undefined}>{audit.detailHtml}</span>
              </div>
              <div className="audit-panel-meta">{audit.meta}</div>
              <button type="button" className="btn-gpay-primary btn-proceed-audited" onClick={onProceed}>
                {audit.proceedLabel || "Open Contact & Pay →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CitizenCheckerModal({ query, onQuery, onSearch, onClose, result, reason, onReason, onReport, feedback, feedbackOk }) {
  const reporters = result?.community_reporters || 0;
  let sybilText = "No reports filed";
  let sybilColor = "#81c995";
  if (reporters >= 3) {
    sybilText = `Passed (${reporters} distinct reporters, min 3)`;
    sybilColor = "#f87171";
  } else if (reporters > 0) {
    sybilText = `Below threshold (${reporters}/3 reporters -- not yet escalated)`;
    sybilColor = "#fbbf24";
  }

  let verdictCls = "verdict-critical";
  let verdictText = "🚨 CRITICAL_BLOCKED";
  if (result?.risk_level === "SAFE") {
    verdictCls = "verdict-safe";
    verdictText = "✅ SAFE / VERIFIED";
  } else if (result?.risk_level === "SUSPICIOUS") {
    verdictCls = "verdict-suspicious";
    verdictText = "⚠️ SUSPICIOUS";
  }

  return (
    <div className="gpay-dialog-overlay" id="modal-citizen-checker">
      <div className="citizen-checker-card">
        <div className="citizen-checker-header">
          <div className="cc-icon-title">
            <span className="cc-shield">🛡️</span>
            <div>
              <div className="cc-title">Citizen Public Scam Score Lookup</div>
              <div className="cc-sub">Zero-login public safety portal (Feature #34)</div>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}>&times;</button>
        </div>

        <div className="citizen-checker-body">
          <div className="cc-search-row">
            <input type="text" placeholder="Enter UPI ID, Phone, or Bank Account..." value={query} onChange={(e) => onQuery(e.target.value)} />
            <button className="btn-gpay-primary" onClick={onSearch}>Verify Safety</button>
          </div>

          <div className="cc-quick-tags">
            <span>Quick checks:</span>
            {["grocer.local@oksbi", "mule.syndicate@axis", "cbi.clearance.cell@sbi"].map((q) => (
              <button className="tag-chip" key={q} onClick={() => { onQuery(q); onSearch(); }}>{q}</button>
            ))}
          </div>

          {result && (
            <div className="cc-result-card">
              <div className="cc-status-row">
                <span className={`cc-verdict-pill ${verdictCls}`}>{verdictText}</span>
                <span className="cc-score-pill">Risk: {result.risk_score.toFixed(2)}</span>
              </div>
              <div className="cc-name-row">
                Target: <strong>{result.target_ref}</strong> ({result.resolved_name})
              </div>
              <p className="cc-verdict-text">{result.verdict_plain}</p>
              <div className="cc-meta-grid">
                <div className="cc-meta-item">
                  <span className="cc-m-lbl">Community Reports</span>
                  <span className="cc-m-val">{reporters} independent reporter(s)</span>
                </div>
                <div className="cc-meta-item">
                  <span className="cc-m-lbl">Sybil Verification</span>
                  <span className="cc-m-val" style={{ color: sybilColor }}>{sybilText}</span>
                </div>
                <div className="cc-meta-item">
                  <span className="cc-m-lbl">Nationwide Status</span>
                  <span className="cc-m-val">{result.is_active ? "ACTIVE ROUTING" : "SUSPENDED (KILL-SWITCH)"}</span>
                </div>
              </div>
            </div>
          )}

          <div className="cc-report-section">
            <div className="cc-rep-title">Submit Community Fraud Report (Feature #11)</div>
            <div className="cc-rep-row">
              <select className="g-select-sm" value={reason} onChange={(e) => onReason(e.target.value)}>
                <option value="IMPERSONATION_OFFICIAL">Fake Government / Police Impersonation</option>
                <option value="ELECTRICITY_BILL_FRAUD">Electricity / Utility Bill Scam</option>
                <option value="CRYPTO_TASK_FRAUD">Part-time Job / Crypto Arbitrage Scam</option>
                <option value="ACCIDENTAL_TRANSFER_TRAP">Accidental Transfer Refund Trap</option>
              </select>
              <button className="btn-report-action" onClick={onReport}>Report Account</button>
            </div>
            <div className="cc-rep-notice" style={{ color: feedbackOk ? undefined : "#f28b82" }}>{feedback}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SCENARIO_PILLS = [
  { scen: "green", cls: "scen-green", label: "🟢 Grocer (ALLOW)" },
  { scen: "yellow", cls: "scen-yellow", label: "🟡 New Shop (STEP_UP)" },
  { scen: "orange", cls: "scen-orange", label: "🟠 CBI Arrest (COACH/FREEZE)" },
  { scen: "red", cls: "scen-red", label: "🔴 Mule Syndicate (FREEZE)" },
  { scen: "blue", cls: "scen-blue", label: "🔵 Card CNP (3DS OTP)" },
];

function SocObserver({ onRunScenario, onSurprise, narrative, activeNodes, accounts, risk, traceId, traces, campaigns, onKillSwitch }) {
  const zone = risk?.risk_zone || "ALLOW";
  const zoneClass = `zone-${zone.toLowerCase().replace("_", "-")}`;
  const signals = risk?.signals || [];

  const nodes = [
    { id: "snode-payer", icon: "📱", title: "Payer GPay", sub: "Aarav Sharma" },
    { id: "snode-switch", icon: "🔄", title: "NPCI Switch", sub: "Central Mapper", arrow: true },
    { id: "snode-kurukshetra", icon: "🛡️", title: "Kurukshetra FRM", sub: "Tier 0 • Tier 1 • MCP", arrow: true, highlight: true },
    { id: "snode-remitter", icon: "🏛️", title: "Remitter CBS", sub: "SBI Core Banking", arrow: true },
    { id: "snode-beneficiary", icon: "🏦", title: "Beneficiary CBS", sub: "Payee Bank", arrow: true },
  ];

  return (
    <div className="soc-observer-wrapper">
      <div className="soc-preset-bar">
        <span className="soc-preset-title">DEMO PRESETS:</span>
        {SCENARIO_PILLS.map((p) => (
          <button className={`scen-pill ${p.cls}`} key={p.scen} onClick={() => onRunScenario(p.scen)}>{p.label}</button>
        ))}
        <button className="scen-pill scen-surprise" onClick={onSurprise}>🎲 Surprise Me: Live Scam</button>
      </div>

      {narrative && (
        <div className={`soc-narrative-card narrative-${narrative.zoneClass}`}>
          <div className="soc-narrative-title">{narrative.title}</div>
          <div className="soc-narrative-body">{narrative.body}</div>
          <div className="soc-narrative-meta">{narrative.meta}</div>
        </div>
      )}

      <div className="soc-card">
        <div className="soc-card-title-row">
          <span>MINIATURE PAYMENT ECOSYSTEM ARCHITECTURE</span>
          <span className="soc-live-status"><span className="pulse-dot"></span> LIVE NETWORK</span>
        </div>
        <div className="soc-nodes-row">
          {nodes.map((n) => (
            <div key={n.id} style={{ display: "contents" }}>
              {n.arrow && <div className="snode-arrow">&rarr;</div>}
              <div className={`soc-node${n.highlight ? " node-highlight" : ""}${activeNodes.has(n.id) ? " node-active" : ""}`}>
                <div className="snode-icon">{n.icon}</div>
                <div className="snode-title">{n.title}</div>
                <div className="snode-sub">{n.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="soc-card">
        <div className="soc-card-title-row">
          <span>CORE BANKING SYSTEM (CBS) LIVE BALANCES</span>
          <span className="soc-badge-tag">DOUBLE-ENTRY INVARIANT</span>
        </div>
        <div className="soc-accounts-grid">
          {accounts.map((acc) => (
            <div className="soc-acc-cell" key={acc.account_id}>
              <div className="sac-name">{acc.customer_name} ({acc.bank_id})</div>
              <div className="sac-bal">{acc.balance_formatted}</div>
              <div className="sac-meta">A/c: {acc.account_number} • {acc.account_type}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="soc-card">
        <div className="soc-card-title-row">
          <span>KURUKSHETRA RISK ENGINE BREAKDOWN</span>
          <div className={`soc-zone-badge ${zoneClass}`}>{zone} ({risk?.risk_score ?? "0.00"})</div>
        </div>

        <div className="soc-metrics-row">
          <div className="soc-metric-cell">
            <div className="sm-label">TIER REACHED</div>
            <div className="sm-val">{!risk || risk.tier_reached === 0 ? "Tier 0 (Fast-Path)" : `Tier ${risk.tier_reached} (Deep Forensics)`}</div>
          </div>
          <div className="soc-metric-cell">
            <div className="sm-label">POLICY ACTION</div>
            <div className="sm-val">{risk?.decision || "PROCEED"}</div>
          </div>
          <div className="soc-metric-cell">
            <div className="sm-label">DATA COMPLETENESS</div>
            <div className="sm-val">{risk?.data_completeness || "FULL"}</div>
          </div>
          <div className="soc-metric-cell">
            <div className="sm-label">AUDIT CHAIN SEQ</div>
            <div className="sm-val">{risk?.audit_ref ? `#${risk.audit_ref}` : "PENDING"}</div>
          </div>
        </div>

        <div className="soc-signals-table-wrap">
          <table className="soc-table">
            <thead>
              <tr>
                <th>FEAT #</th>
                <th>DETECTOR</th>
                <th>LABEL</th>
                <th>SEVERITY</th>
                <th>WEIGHT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {signals.length === 0 ? (
                <tr><td colSpan={6} className="empty-table-msg">Tier 0 Fast-Path: All baseline checks clear. Zero anomalies triggered.</td></tr>
              ) : (
                signals.map((s, i) => (
                  <tr key={i}>
                    <td>#{s.feature_id}</td>
                    <td><strong>{s.feature_name}</strong></td>
                    <td><span style={{ padding: "1px 5px", borderRadius: 4, fontSize: 9, background: "#334155" }}>{s.label}</span></td>
                    <td>{s.severity}</td>
                    <td>{s.risk_contribution > 0 ? "+" + s.risk_contribution : "0.0"}</td>
                    <td>{s.triggered ? <span style={{ color: "#f87171", fontWeight: 700 }}>TRIGGERED</span> : <span style={{ color: "#64748b" }}>QUIET</span>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="soc-card soc-trace-card">
        <div className="soc-card-title-row">
          <span>HOP-BY-HOP TRANSACTION JOURNEY</span>
          <span className="trace-chip-mono">{traceId}</span>
        </div>
        <div className="soc-timeline">
          {traces.length === 0 ? (
            <div className="empty-timeline-msg">Live events with microsecond timestamps will stream here.</div>
          ) : (
            traces.map((ev, i) => (
              <div className="soc-timeline-entry" style={{ animationDelay: `${i * 120}ms` }} key={i}>
                <span className="st-time">{ev.elapsed_ms || 0}ms</span>
                <span className="st-comp">{ev.component || "SYS"}</span>
                <span className="st-desc"><strong>{ev.action}:</strong> {ev.summary}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="soc-card soc-killswitch-card">
        <div className="soc-card-title-row">
          <span>⚡ NPCI CENTRAL OPS: REAL-TIME CAMPAIGN & NATIONWIDE KILL-SWITCH</span>
          <span className="soc-badge-tag tag-red">CENTRAL REGULATORY LAYER</span>
        </div>
        <div className="soc-ks-intro">
          Cross-PSP lookup analytics. Engaging the <strong>Nationwide Kill-Switch</strong> revokes malicious VPAs centrally in the NPCI Central Mapper and freezes CBS accounts across all banks with zero delay.
        </div>
        <div className="soc-campaigns-table-wrap">
          <table className="soc-table">
            <thead>
              <tr>
                <th>TARGET IDENTIFIER</th>
                <th>BENEFICIARY</th>
                <th>BANK</th>
                <th>LOOKUPS</th>
                <th>ABANDON %</th>
                <th>STATUS</th>
                <th>KILL-SWITCH ACTION</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr><td colSpan={7} className="empty-table-msg">No active campaigns recorded in switch metrics.</td></tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.target_ref}>
                    <td><strong>{c.target_ref}</strong></td>
                    <td>{c.customer_name}</td>
                    <td>{c.bank_id}</td>
                    <td>{c.lookup_count} ({c.distinct_psp_count} PSPs)</td>
                    <td>{(c.abandon_ratio * 100).toFixed(0)}%</td>
                    <td>{c.is_suspended ? <span className="badge-suspended">REVOKED</span> : <span className="badge-active">ACTIVE</span>}</td>
                    <td>{c.is_suspended ? <button className="btn-ks-trigger" disabled>REVOKED</button> : <button className="btn-ks-trigger" onClick={() => onKillSwitch(c.target_ref)}>⚡ KILL-SWITCH</button>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
