const fs = require('fs');

let raw = fs.readFileSync('tempo_raw.html', 'utf8');

// Helper to escape HTML quotes for JSON props inside attributes
function encodeProps(obj) {
  return JSON.stringify(obj).replace(/"/g, '&quot;');
}

// 1. Title & Meta replacements
raw = raw.replace(/<title>.*?<\/title>/i, '<title>Agentic Guardian: Autonomous Payment Scam Interception (KURUKSHETRA 2.0 // PS09)</title>');
raw = raw.replace(/content="Tempo: The blockchain for stablecoin payments"/gi, 'content="Agentic Guardian: Autonomous Payment Scam Interception"');
raw = raw.replace(/content="Tempo is a payments-first Layer 1 blockchain incubated by Stripe and Paradigm, purpose-built for stablecoin payments at scale."/gi, 'content="Agentic Guardian is an autonomous multi-agent defense pipeline operating across 5 domains to intercept Authorized Push Payment (APP) scams before money moves."');
raw = raw.replace(/Stripe and Paradigm/g, 'Team Midnight Ciphers (KURUKSHETRA 2.0)');
raw = raw.replace(/Tempo/g, 'Agentic Guardian');

// 2. Update Header Astro Island
const headerPropsObj = {
  header: [0, {
    name: [0, "Main Header"],
    logo: [0, { url: [0, "/images/logo.svg"], title: [0, "Agentic Guardian"], width: [0, 40], height: [0, 40] }],
    navItems: [1, [
      [0, {
        entryName: [0, "Solutions"],
        label: [0, "Solutions"],
        topLevelLink: [0, "Solutions"],
        links: [1, [
          [0, { label: [0, "APP Scam Interception"], url: [0, "http://localhost:3000/payment"] }],
          [0, { label: [0, "Multi-Agent Reasoning"], url: [0, "http://localhost:3000/soc-console"] }],
          [0, { label: [0, "Mule Graph Profiling"], url: [0, "http://localhost:3000/soc-console"] }],
          [0, { label: [0, "Cognitive Dwell Gate"], url: [0, "http://localhost:3000/payment"] }],
          [0, { label: [0, "Voice Guardian Assistance"], url: [0, "http://localhost:3000/payment"] }]
        ]]
      }],
      [0, { label: [0, "SOC Console"], url: [0, "http://localhost:3000/soc-console"] }],
      [0, { label: [0, "Payment Simulator"], url: [0, "http://localhost:3000/payment"] }],
      [0, {
        entryName: [0, "Developers"],
        label: [0, "Developers"],
        links: [1, [
          [0, { label: [0, "FastMCP Server"], url: [0, "https://github.com/Laukikrathod2007/KURUKSHETRA_2.0_HACKFEST"] }],
          [0, { label: [0, "GitHub Repository"], url: [0, "https://github.com/Laukikrathod2007/KURUKSHETRA_2.0_HACKFEST"] }],
          [0, { label: [0, "Architecture Specs"], url: [0, "http://localhost:3000/soc-console"] }]
        ]]
      }],
      [0, {
        entryName: [0, "Resources"],
        label: [0, "Resources"],
        topLevelLink: [0, "Resources"],
        links: [1, [
          [0, { label: [0, "PS09 Research Paper"], url: [0, "http://localhost:3000/soc-console"] }],
          [0, { label: [0, "Submission PRD"], url: [0, "http://localhost:3000/soc-console"] }],
          [0, { label: [0, "Red-Team Audit"], url: [0, "http://localhost:3000/soc-console"] }]
        ]]
      }]
    ]],
    loginText: [0, "Try Simulator"],
    loginUrl: [0, "http://localhost:3000/payment"]
  }],
  footer: [0, {
    logo: [0, { url: [0, "/content/tempo-full-logo.svg"], title: [0, "Agentic Guardian"], width: [0, 208], height: [0, 46] }],
    rightNavigationItems: [1, [
      [0, {
        entryName: [0, "Solutions"],
        label: [0, "Solutions"],
        topLevelLink: [0, "Solutions"],
        links: [1, [
          [0, { label: [0, "APP Scam Interception"], url: [0, "http://localhost:3000/payment"] }],
          [0, { label: [0, "Multi-Agent Consensus"], url: [0, "http://localhost:3000/soc-console"] }],
          [0, { label: [0, "Mule Graph Network"], url: [0, "http://localhost:3000/soc-console"] }],
          [0, { label: [0, "Cognitive Dwell Gate"], url: [0, "http://localhost:3000/payment"] }],
          [0, { label: [0, "Voice Guardian"], url: [0, "http://localhost:3000/payment"] }]
        ]]
      }],
      [0, {
        entryName: [0, "Developers"],
        label: [0, "Developers"],
        links: [1, [
          [0, { label: [0, "SOC Console"], url: [0, "http://localhost:3000/soc-console"] }],
          [0, { label: [0, "Simulator"], url: [0, "http://localhost:3000/payment"] }],
          [0, { label: [0, "FastMCP Engine"], url: [0, "https://github.com/Laukikrathod2007/KURUKSHETRA_2.0_HACKFEST"] }],
          [0, { label: [0, "GitHub"], url: [0, "https://github.com/Laukikrathod2007/KURUKSHETRA_2.0_HACKFEST"] }]
        ]]
      }],
      [0, {
        entryName: [0, "Resources"],
        label: [0, "Resources"],
        topLevelLink: [0, "Resources"],
        links: [1, [
          [0, { label: [0, "PS09 Research Paper"], url: [0, "http://localhost:3000/soc-console"] }],
          [0, { label: [0, "Technical PRD"], url: [0, "http://localhost:3000/soc-console"] }],
          [0, { label: [0, "Architecture Specs"], url: [0, "http://localhost:3000/soc-console"] }],
          [0, { label: [0, "Red-Team Report"], url: [0, "http://localhost:3000/soc-console"] }]
        ]]
      }]
    ]],
    copyrightText: [0, "© 2026 Agentic Guardian // Team Midnight Ciphers (KURUKSHETRA 2.0 - PS09)."]
  }]
};

// 3. Update Hero Astro Island
const heroPropsObj = {
  headline: [0, "The autonomous AI defense layer for payment scam interception"],
  description: [0, "Agentic Guardian is an autonomous 5-domain security pipeline that evaluates transactions in under 200ms. Fusing LightGBM GBDT hot-path scoring with parallel LangGraph multi-agent reasoning to stop Authorized Push Payment (APP) fraud before money moves."],
  heroBannerLink: [0],
  heroLinks: [1, [
    [0, { text: [0, "Try Payment Simulator"], url: [0, "http://localhost:3000/payment"], isExternal: [0, false], appearance: [0, "primary"] }],
    [0, { text: [0, "Open SOC Analyst Console"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "with-arrow"] }]
  ]],
  heroCallout: [0, {
    type: [0, "video"],
    data: [0, {
      caption: [0],
      thumbnail: [0, { url: [0, "/images/homepage/video-thumbnails/tempo-case-studies-thumb-02-cash-detail.jpg"], title: [0, "Agentic Guardian Telemetry Preview"], width: [0, 960], height: [0, 540] }],
      previewVideoUrl: [0, "/videos/homepage/tempo-case-studies-preview.mp4"],
      videoUrl: [0, "/videos/homepage/tempo-case-studies.mp4"]
    }]
  }],
  partnerLogos: [1, []],
  "data-astro-cid-lcdefpme": [0, true]
};

// 4. Update Section 3 (Capabilities) Astro Island
const capabilitiesPropsObj = {
  data: [0, {
    entryName: [0, "Performant & explainable multi-agent defense pipeline"],
    headline: [0, "Performant & explainable multi-agent defense pipeline"],
    features: [1, [
      [0, {
        headline: [0, "Intent NLP Parsing"],
        text: [0, "Reads payment memos and detects urgency, authority impersonation, extortion, and coercive social engineering patterns in real time."],
        link: [0, { text: [0, "Explore Intent Agent"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "primary"] }]
      }],
      [0, {
        headline: [0, "Tiered Latency ML Scoring"],
        text: [0, "114-feature LightGBM GBDT hot-path model delivering sub-15ms risk scoring on payee velocity and historical behavioral baselines."],
        link: [0, { text: [0, "View Latency Benchmarks"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "primary"] }]
      }],
      [0, {
        headline: [0, "Parallel Multi-Agent Consensus"],
        text: [0, "Four specialized LangGraph agents (Intent, Transaction, Recipient, Policy Gatekeeper) evaluate context concurrently."],
        link: [0, { text: [0, "Explore Multi-Agent Hub"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "primary"] }]
      }],
      [0, {
        headline: [0, "Cross-Bank Mule Graph Profiling"],
        text: [0, "Continuously tracks recipient account age, rapid fan-out velocity spikes, and money mule network clusters across banks."],
        link: [0, { text: [0, "View Mule Graph"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "primary"] }]
      }],
      [0, {
        headline: [0, "Cognitive Dwell Gate"],
        text: [0, "Deploys calibrated psychological friction, pausing high-risk transfers before money leaves the victim's account."],
        link: [0, { text: [0, "Test Dwell Gate"], url: [0, "http://localhost:3000/payment"], isExternal: [0, false], appearance: [0, "primary"] }]
      }],
      [0, {
        headline: [0, "Voice Guardian Emergency Call"],
        text: [0, "Triggers an instant real-time AI voice conversation (Vapi AI) to speak directly with the user and break scammer phone coercion."],
        link: [0, { text: [0, "Test Voice Guardian"], url: [0, "http://localhost:3000/payment"], isExternal: [0, false], appearance: [0, "primary"] }]
      }],
      [0, {
        headline: [0, "Tamper-Evident SHA-256 Audit Trail"],
        text: [0, "Cryptographically signs all evidence dossiers and agent reasoning traces for full regulatory compliance and auditability."],
        link: [0, { text: [0, "Audit Console"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "primary"] }]
      }]
    ]]
  }],
  "data-astro-cid-lcdefpme": [0, true]
};

// 5. Update Section 4 (The Five Domains of Defense) Astro Island
const domainsPropsObj = {
  data: [0, {
    entryName: [0, "The Five Domains of Autonomous Defense"],
    headline: [0, "The Five Domains of Autonomous Defense"],
    features: [1, [
      [0, {
        headline: [0, "Domain 1 — Simulation & Ingestion"],
        text: [0, "Real-time payment canvas intercepting raw UPI/banking payloads, normalizing metadata, and initializing session state."],
        link: [0, { text: [0, "Domain 1 Specs"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "primary"] }]
      }],
      [0, {
        headline: [0, "Domain 2 — ML Hot-Path Inference Engine"],
        text: [0, "Ultra-low latency LightGBM GBDT scoring (<15ms) running on 114 vectorized behavioral, temporal, and velocity features."],
        link: [0, { text: [0, "Domain 2 Specs"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "primary"] }]
      }],
      [0, {
        headline: [0, "Domain 3 — LangGraph Multi-Agent Cluster"],
        text: [0, "Intent, Transaction, and Recipient agents perform deep contextual reasoning in parallel with conformal uncertainty bounds."],
        link: [0, { text: [0, "Domain 3 Specs"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "primary"] }]
      }],
      [0, {
        headline: [0, "Domain 4 — Deterministic Policy Gatekeeper"],
        text: [0, "Translates probabilistic agent outputs into strict rule directives: ALLOW, ADVISE, CHALLENGE, PAUSE, or BLOCK."],
        link: [0, { text: [0, "Domain 4 Specs"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "primary"] }]
      }],
      [0, {
        headline: [0, "Domain 5 — Cognitive Interventions & TruGen Video"],
        text: [0, "Deploys interactive friction, TruGen AI avatar video calls, and voice guidance before payment settlement."],
        link: [0, { text: [0, "Domain 5 Specs"], url: [0, "http://localhost:3000/payment"], isExternal: [0, false], appearance: [0, "primary"] }]
      }],
      [0, {
        headline: [0, "Domain 6 — Immutable Compliance & SAR Engine"],
        text: [0, "Tamper-evident cryptographic ledger logging all evidence dossiers with automated Suspicious Activity Report (SAR) generation."],
        link: [0, { text: [0, "Domain 6 Specs"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "primary"] }]
      }]
    ]]
  }],
  "data-astro-cid-lcdefpme": [0, true]
};

// 6. Update Section 5 (ImageTextOverlay) Astro Island
const overlayPropsObj = {
  data: [0, {
    headline: [0, "Defend Real-Time Payments with Agentic AI"],
    text: [0, "Deploy autonomous multi-agent scam interception across UPI, FedNow, and core banking systems with zero end-user friction."],
    backgroundImage: [0, {
      url: [0, "https://images.ctfassets.net/wy06omns870e/1N7HDiIH03r2tB7VH5V03M/6b07f38770d2ac54e2e654ed086ca5d3/General_thumbnail.png"],
      title: [0, "Agentic Guardian Ecosystem"],
      width: [0, 2880],
      height: [0, 1440]
    }],
    actions: [1, [
      [0, { text: [0, "Launch Payment Simulator"], url: [0, "http://localhost:3000/payment"], isExternal: [0, false], appearance: [0, "primary"] }]
    ]]
  }],
  "data-astro-cid-lcdefpme": [0, true]
};

// Replace Astro Island props
raw = raw.replace(/(<astro-island[^>]*component-url="[^"]*Header[^"]*"[^>]*props=")([^"]*)(")/i, (m, p1, p2, p3) => p1 + encodeProps(headerPropsObj) + p3);
raw = raw.replace(/(<astro-island[^>]*component-url="[^"]*LandingHero[^"]*"[^>]*props=")([^"]*)(")/i, (m, p1, p2, p3) => p1 + encodeProps(heroPropsObj) + p3);
raw = raw.replace(/(<astro-island[^>]*uid="1T2c98"[^>]*props=")([^"]*)(")/i, (m, p1, p2, p3) => p1 + encodeProps(capabilitiesPropsObj) + p3);
raw = raw.replace(/(<astro-island[^>]*uid="1oTe0w"[^>]*props=")([^"]*)(")/i, (m, p1, p2, p3) => p1 + encodeProps(domainsPropsObj) + p3);
raw = raw.replace(/(<astro-island[^>]*component-url="[^"]*ImageTextOverlay[^"]*"[^>]*props=")([^"]*)(")/i, (m, p1, p2, p3) => p1 + encodeProps(overlayPropsObj) + p3);
raw = raw.replace(/(<astro-island[^>]*component-url="[^"]*Footer[^"]*"[^>]*props=")([^"]*)(")/i, (m, p1, p2, p3) => p1 + encodeProps(headerPropsObj) + p3);

// Replace static HTML texts inside the Astro components and standard HTML
// Section 1
raw = raw.replace(/Purpose-built for stablecoins/g, 'Purpose-built for Authorized Push Payment (APP) Scams');
raw = raw.replace(/Stablecoins enable instant, borderless, programmable transactions[\s\S]*?designed for payments at scale\./g, 
  'Traditional fraud engines only check stolen card credentials or account takeover. When victims are manipulated into voluntarily completing payments themselves, legacy rules are completely blind. Agentic Guardian analyzes payment memos, NLP urgency signals, mule graph networks, and cognitive stress in under 200ms.');
raw = raw.replace(/>About Tempo</g, '>Explore Architecture &rarr;<');

// Section 2
raw = raw.replace(/Shaped with global payment leaders/g, 'Trusted by Next-Gen Financial Institutions');
raw = raw.replace(/Incubated by Stripe and Paradigm[\s\S]*?serving billions worldwide\./g,
  'Built for KURUKSHETRA 2.0 (Problem Statement PS09), Agentic Guardian integrates directly with UPI, FedNow, FPS, and enterprise core banking systems with zero customer checkout friction.');
raw = raw.replace(/>See customer stories &rarr;</g, '>Launch SOC Console &rarr;<');

// Hero static text
raw = raw.replace(/The blockchain for payments at scale/g, 'The autonomous AI defense layer for payment scam interception');
raw = raw.replace(/Tempo is a payments-first Layer 1 blockchain incubated by Stripe and Paradigm, purpose-built for stablecoin payments at scale. It gives businesses and developers a stablecoin-native settlement layer for global payments\./g,
  'Agentic Guardian is an autonomous 5-domain security pipeline that evaluates transactions in under 200ms. Fusing LightGBM GBDT hot-path scoring with parallel LangGraph multi-agent reasoning to stop Authorized Push Payment (APP) fraud before money moves.');
raw = raw.replace(/>Get started</g, '>Try Payment Simulator<');
raw = raw.replace(/>See how companies are using Tempo/g, '>Open SOC Analyst Console');

// Write out to index.html
fs.writeFileSync('index.html', raw, 'utf8');
console.log('Successfully written pure Tempo layout with complete PS09 Agentic Guardian content and intact 3D scroll animation!');
