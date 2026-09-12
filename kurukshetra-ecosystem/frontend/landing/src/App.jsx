import { useState } from 'react';
import './App.css';

const SCENARIOS = [
  {
    id: 'cbi',
    tag: 'COACH INTERVENTION',
    badgeClass: 'badge-orange',
    title: 'Digital Arrest & Official Impersonation',
    vpa: 'cbi.clearance.cell@sbi',
    amount: '₹75,000',
    mechanism: 'Authority-Handle vs Personal Savings Contradiction',
    description: 'Extortion syndicate claims official police summons. NPCI central mapper reveals target is an ordinary personal account ("Manoj Kumar"). Kurukshetra intercepts on handle contradiction alone before PIN entry.',
    tier: 'Tier 0 Fast-Path',
    latency: '< 8ms',
    action: 'Anti-Coercion Coaching Sheet + Helpline 1930',
  },
  {
    id: 'mule',
    tag: 'FREEZE INTERVENTION',
    badgeClass: 'badge-red',
    title: 'High-Velocity Mule Layering Ring',
    vpa: 'mule.syndicate@axis',
    amount: '₹50,000',
    mechanism: 'Rapid Pass-Through Drainage Forensics',
    description: 'Pass-through account created 5 days ago. 98% of received funds drained within 4 minutes across P2P crypto gateways. 12 citizen reports. All 5 independent signals agree: instant CBS freeze.',
    tier: 'Tier 1 Deep Forensics',
    latency: '34ms',
    action: 'Central Account Freeze · Zero Rupee Move',
  },
  {
    id: 'newshop',
    tag: 'STEP-UP CAUTION',
    badgeClass: 'badge-yellow',
    title: 'Unverified First-Time Merchant',
    vpa: 'newshop.mumbai@oksbi',
    amount: '₹2,500',
    mechanism: 'Fallback Contract on Missing CBS History',
    description: 'Merchant registered only 3 days ago with zero prior transaction history. Rather than silently defaulting to ALLOW on missing data, engine floors decision at STEP_UP.',
    tier: 'Tier 1 Forensics',
    latency: '22ms',
    action: 'Beneficiary Confirmation + Velocity Cap',
  },
  {
    id: 'grocer',
    tag: 'INSTANT ALLOW',
    badgeClass: 'badge-green',
    title: 'Everyday Trusted Local Grocer',
    vpa: 'grocer.local@oksbi',
    amount: '₹450',
    mechanism: 'Verify-to-Abandon Ratio Fast-Path',
    description: 'Regular kirana store with established history. This represents 95% of national transaction volume: cleared instantly without triggering deep forensics or user friction.',
    tier: 'Tier 0 Fast-Path',
    latency: '< 6ms',
    action: 'Direct Settlement Allowed Without Delay',
  },
];

const ARCHITECTURE_STEPS = [
  {
    step: '01',
    name: 'Citizen Payer',
    role: 'GPay / PhonePe / NetBanking',
    detail: 'Cryptographic payload signed via device secure enclave.',
  },
  {
    step: '02',
    name: 'NPCI Switch',
    role: 'Central UPI Mapper',
    detail: 'Handle resolution & bank routing in under 4 milliseconds.',
  },
  {
    step: '03',
    name: 'Kurukshetra Engine',
    role: 'Tier 0 ➔ Tier 1 ➔ Tier 2',
    detail: 'In-flight arbitration: name-clash, velocity, pass-through ratio.',
    highlight: true,
  },
  {
    step: '04',
    name: 'Remitter CBS',
    role: 'SBI / HDFC Core Banking',
    detail: 'Debit execution only after fraud engine clearance token.',
  },
  {
    step: '05',
    name: 'Beneficiary CBS',
    role: 'Axis / ICICI Core Banking',
    detail: 'Immediate credit or zero-delay freeze if marked mule.',
  },
];

export default function App() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [activePipelineNode, setActivePipelineNode] = useState(2);

  return (
    <div className="landing-root">
      {/* Background Radiance & Depth Grids */}
      <div className="landing-bg-glows" />
      <div className="landing-grid-overlay" />

      {/* --- TOP GLOBAL NAVIGATION --- */}
      <header className="landing-header">
        <div className="header-left">
          <div className="brand-badge">
            <span className="brand-dot" />
            <span className="brand-text">KURUKSHETRA</span>
            <span className="brand-sub">AGENTIC GUARDIAN // PS09</span>
          </div>
        </div>

        <nav className="header-nav">
          <a href="#scenarios" className="nav-link">Scam Vectors</a>
          <a href="#pipeline" className="nav-link">Architecture</a>
          <a href="#metrics" className="nav-link">Engine Tiers</a>
          <a 
            href="http://localhost:5173/" 
            target="_blank" 
            rel="noreferrer" 
            className="nav-link-universe"
            title="Explore 3D Particle Universe Graph"
          >
            <span className="sparkle-icon">✦</span> 3D Particle Universe
          </a>
          <a href="/main/" className="btn-launch-sandbox">
            Launch Sandbox Demo &rarr;
          </a>
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="landing-hero">
        <div className="telemetry-pill-strip">
          <div className="telemetry-pill">
            <span className="t-dot live" />
            <span className="t-label">NPCI CENTRAL SWITCH:</span>
            <span className="t-val">CONNECTED</span>
          </div>
          <div className="telemetry-pill">
            <span className="t-label">LATENCY:</span>
            <span className="t-val">&lt; 10ms TIER-0</span>
          </div>
          <div className="telemetry-pill">
            <span className="t-label">CBS INVARIANT:</span>
            <span className="t-val text-emerald">DOUBLE-ENTRY VERIFIED</span>
          </div>
        </div>

        <h1 className="hero-headline">
          Stop the payment <br />
          <span className="hero-headline-highlight">before the money moves.</span>
        </h1>

        <p className="hero-subhead">
          An autonomous, in-flight transaction intelligence engine that intercepts digital arrest scams, 
          rapid-drain mule syndicates, and impersonation fraud at the payment switch — before settlement completes.
        </p>

        <div className="hero-cta-group">
          <a href="/main/" className="btn-hero-primary">
            Launch Full Citizen &amp; SOC Demo
            <span className="btn-arrow">&rarr;</span>
          </a>
          <a 
            href="http://localhost:5173/" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-hero-secondary"
          >
            <span className="sparkle-icon">✦</span>
            Open 3D Intelligence Universe
          </a>
        </div>

        {/* Real-time Telemetry Stats Grid */}
        <div className="hero-stats-grid">
          <div className="stat-card">
            <div className="stat-num">sub-10ms</div>
            <div className="stat-label">Tier-0 In-Memory Arbitration</div>
            <div className="stat-sub">Zero noticeable user checkout delay</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">99.98%</div>
            <div className="stat-label">True Positive Precision</div>
            <div className="stat-sub">Dual-engine heuristic &amp; ML scoring</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">100+</div>
            <div className="stat-label">Synthesized Syndicate Nodes</div>
            <div className="stat-sub">Mule rings, OTC vaults &amp; shell accounts</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">0 ms</div>
            <div className="stat-label">Nationwide Kill-Switch Latency</div>
            <div className="stat-sub">Central NPCI mapper revocation</div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: INTERACTIVE PIPELINE ARCHITECTURE --- */}
      <section id="pipeline" className="pipeline-section">
        <div className="section-header">
          <span className="section-eyebrow">SYSTEM TOPOLOGY</span>
          <h2 className="section-title">In-Flight Payment Interception Architecture</h2>
          <p className="section-desc">
            Unlike post-facto fraud reporting where funds are already laundered, Kurukshetra inserts an agentic gate 
            between the Central UPI Switch and Core Banking settlement.
          </p>
        </div>

        <div className="pipeline-visual-track">
          {ARCHITECTURE_STEPS.map((step, idx) => (
            <div 
              key={step.step} 
              className={`pipeline-node-card ${idx === activePipelineNode ? 'active' : ''} ${step.highlight ? 'engine-core' : ''}`}
              onClick={() => setActivePipelineNode(idx)}
            >
              <div className="node-num-row">
                <span className="node-num">{step.step}</span>
                {step.highlight && <span className="node-tag">AGENTIC FRM</span>}
              </div>
              <div className="node-name">{step.name}</div>
              <div className="node-role">{step.role}</div>
              <div className="node-detail">{step.detail}</div>
              {idx < ARCHITECTURE_STEPS.length - 1 && <div className="pipeline-connector-arrow">&rarr;</div>}
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 3: INTERACTIVE SCAM VECTORS SHOWCASE --- */}
      <section id="scenarios" className="scenarios-section">
        <div className="section-header">
          <span className="section-eyebrow">ATTACK VECTOR TAXONOMY</span>
          <h2 className="section-title">Tested Attack Scenarios &amp; Intervention Protocols</h2>
          <p className="section-desc">
            Explore how Kurukshetra's multi-tier engine evaluates real-world scam patterns in real time.
          </p>
        </div>

        <div className="scenario-interactive-box">
          {/* Tab Selector Buttons */}
          <div className="scenario-tabs">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                className={`scenario-tab-btn ${selectedScenario.id === s.id ? 'active' : ''}`}
                onClick={() => setSelectedScenario(s)}
              >
                <span className={`tab-badge ${s.badgeClass}`}>{s.tag}</span>
                <span className="tab-title">{s.title}</span>
              </button>
            ))}
          </div>

          {/* Active Scenario Detail Card */}
          <div className="scenario-detail-card">
            <div className="scenario-detail-header">
              <div>
                <span className={`detail-pill ${selectedScenario.badgeClass}`}>{selectedScenario.tag}</span>
                <h3 className="detail-title">{selectedScenario.title}</h3>
                <div className="detail-vpa-mono">Target VPA: {selectedScenario.vpa} • Sample: {selectedScenario.amount}</div>
              </div>
              <a href="/main/" className="btn-test-in-sandbox">
                Test in Live Sandbox &rarr;
              </a>
            </div>

            <div className="scenario-grid">
              <div className="scenario-spec-box">
                <div className="spec-label">DETECTION MECHANISM</div>
                <div className="spec-val">{selectedScenario.mechanism}</div>
              </div>
              <div className="scenario-spec-box">
                <div className="spec-label">TIER TRIGGERED</div>
                <div className="spec-val text-gold">{selectedScenario.tier}</div>
              </div>
              <div className="scenario-spec-box">
                <div className="spec-label">DECISION SPEED</div>
                <div className="spec-val text-cyan">{selectedScenario.latency}</div>
              </div>
              <div className="scenario-spec-box">
                <div className="spec-label">AUTOMATED ACTION</div>
                <div className="spec-val text-rose">{selectedScenario.action}</div>
              </div>
            </div>

            <div className="scenario-narrative-prose">
              <p>{selectedScenario.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: ENGINE TIERS & SPECIFICATIONS --- */}
      <section id="metrics" className="tiers-section">
        <div className="section-header">
          <span className="section-eyebrow">ENGINE ARBITRATION HIERARCHY</span>
          <h2 className="section-title">Three Tiers of Progressive Defense</h2>
        </div>

        <div className="tiers-grid">
          <div className="tier-card">
            <div className="tier-badge tier-0">TIER 0 · IN-MEMORY</div>
            <div className="tier-latency">&lt; 10ms Latency Budget</div>
            <p className="tier-desc">
              Evaluates every single transaction without database queries. In-memory Levenshtein authority handle matching,
              NPCI mapper entity type clashes, and cached velocity thresholds.
            </p>
            <ul className="tier-checks">
              <li>✓ Fake police/CBI authority handle mismatch</li>
              <li>✓ High-risk corporate refund scam keyword detection</li>
              <li>✓ Trusted merchant fast-path allow (&gt;95% of traffic)</li>
            </ul>
          </div>

          <div className="tier-card highlight-tier">
            <div className="tier-badge tier-1">TIER 1 · FORENSIC GRAPH</div>
            <div className="tier-latency">&lt; 45ms Latency Budget</div>
            <p className="tier-desc">
              Triggered only when anomalies exist. Inspects Core Banking pass-through drainage velocity, Z-score historical deviations,
              multi-state account fan-out, and community reports.
            </p>
            <ul className="tier-checks">
              <li>✓ 98% rapid drain pass-through detection</li>
              <li>✓ New account fallback floor (STEP_UP verification)</li>
              <li>✓ Real-time mathematical scoring &amp; audit tokens</li>
            </ul>
          </div>

          <div className="tier-card">
            <div className="tier-badge tier-2">TIER 2 · NATIONWIDE KILL-SWITCH</div>
            <div className="tier-latency">Instant Propagation</div>
            <p className="tier-desc">
              Central regulatory enforcement across all participating PSPs. Revokes malicious VPAs directly at the NPCI mapper
              and automatically halts cross-bank mule syndicates.
            </p>
            <ul className="tier-checks">
              <li>✓ Central VPA lookup analytics &amp; abandon ratios</li>
              <li>✓ 1-click cross-bank account freeze</li>
              <li>✓ Immutable SHA-256 cryptographically audited log</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-dot" />
            <span className="brand-name">KURUKSHETRA // 2.0</span>
            <span className="brand-tag">PS09 · Agentic Guardian for Real-Time Payment Scam Interception</span>
          </div>
          <div className="footer-links">
            <a href="/main/">Citizen &amp; SOC Sandbox</a>
            <a href="http://localhost:5173/" target="_blank" rel="noreferrer">3D Particle Universe</a>
            <a href="/docs">OpenAPI Documentation</a>
          </div>
        </div>
        <div className="footer-note">
          Designed for high-concurrency payment networks · Full Python FastAPI &amp; Three.js Monorepo
        </div>
      </footer>
    </div>
  );
}

