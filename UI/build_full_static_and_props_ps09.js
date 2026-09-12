const fs = require('fs');

let html = fs.readFileSync('tempo_raw.html', 'utf8');

// Helper to escape HTML quotes for JSON props inside attributes
function encodeProps(obj) {
  return JSON.stringify(obj).replace(/"/g, '&quot;');
}

// 1. Meta & Title with PayKavach branding
html = html.replace(/<title>.*?<\/title>/i, '<title>PayKavach: Autonomous Payment Scam Interception (KURUKSHETRA 2.0 // PS09)</title>');
html = html.replace(/content="Tempo: The blockchain for stablecoin payments"/gi, 'content="PayKavach — Intercept Before It Reaches"');
html = html.replace(/content="Tempo is a payments-first Layer 1 blockchain incubated by Stripe and Paradigm, purpose-built for stablecoin payments at scale."/gi, 'content="PayKavach is an autonomous AI multi-agent defense pipeline operating across 5 domains to intercept Authorized Push Payment (APP) scams before money moves."');

// 2. Header Astro Island Props
const headerPropsObj = {
  header: [0, {
    name: [0, "Main Header"],
    logo: [0, { url: [0, "/images/paykavach-logo.png"], title: [0, "PayKavach"], width: [0, 180], height: [0, 42] }],
    navItems: [1, [
      [0, {
        entryName: [0, "Solutions"],
        label: [0, "Solutions"],
        topLevelLink: [0, "Solutions"],
        links: [1, [
          [0, { label: [0, "APP Scam Interception"], url: [0, "http://localhost:3000/payment"] }],
          [0, { label: [0, "Multi-Agent Consensus Hub"], url: [0, "http://localhost:3000/soc-console"] }],
          [0, { label: [0, "Mule Graph Intelligence"], url: [0, "http://localhost:3000/soc-console"] }],
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
          [0, { label: [0, "FastMCP Security Server"], url: [0, "https://github.com/Laukikrathod2007/KURUKSHETRA_2.0_HACKFEST"] }],
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
    logo: [0, { url: [0, "/images/paykavach-logo.png"], title: [0, "PayKavach — Intercept Before It Reaches"], width: [0, 220], height: [0, 52] }],
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
    copyrightText: [0, "© 2026 PayKavach // Team Midnight Ciphers (KURUKSHETRA 2.0 - PS09). All rights reserved."]
  }]
};

// 3. Hero Astro Island Props
const heroPropsObj = {
  headline: [0, "Intercept Before It Reaches — Autonomous AI Payment Scam Defense"],
  description: [0, "PayKavach is an autonomous 5-domain security pipeline that evaluates real-time transactions in under 200ms. Fusing LightGBM ML hot-path scoring with parallel LangGraph multi-agent reasoning to stop Authorized Push Payment (APP) fraud before money moves."],
  heroBannerLink: [0],
  heroLinks: [1, [
    [0, { text: [0, "Try Payment Simulator"], url: [0, "http://localhost:3000/payment"], isExternal: [0, false], appearance: [0, "primary"] }],
    [0, { text: [0, "Open SOC Analyst Console"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "with-arrow"] }]
  ]],
  heroCallout: [0, {
    type: [0, "video"],
    data: [0, {
      caption: [0],
      thumbnail: [0, { url: [0, "/images/homepage/video-thumbnails/tempo-case-studies-thumb-02-cash-detail.jpg"], title: [0, "PayKavach Telemetry Preview"], width: [0, 960], height: [0, 540] }],
      previewVideoUrl: [0, "/videos/homepage/tempo-case-studies-preview.mp4"],
      videoUrl: [0, "/videos/homepage/tempo-case-studies.mp4"]
    }]
  }],
  partnerLogos: [1, []],
  "data-astro-cid-lcdefpme": [0, true]
};

// 4. Section 3 Capabilities Props
const capabilitiesPropsObj = {
  data: [0, {
    entryName: [0, "Performant & Explainable Multi-Agent Defense Pipeline"],
    headline: [0, "Performant & Explainable Multi-Agent Defense Pipeline"],
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

// 5. Section 4 Domains Props
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

// 6. Section 5 Overlay Props
const overlayPropsObj = {
  data: [0, {
    headline: [0, "Protect Real-Time Payments with PayKavach"],
    text: [0, "Deploy autonomous multi-agent scam interception across UPI, FedNow, and core banking systems with zero customer checkout friction."],
    backgroundImage: [0, {
      url: [0, "https://images.ctfassets.net/wy06omns870e/1N7HDiIH03r2tB7VH5V03M/6b07f38770d2ac54e2e654ed086ca5d3/General_thumbnail.png"],
      title: [0, "PayKavach Ecosystem"],
      width: [0, 2880],
      height: [0, 1440]
    }],
    actions: [1, [
      [0, { text: [0, "Launch Payment Simulator"], url: [0, "http://localhost:3000/payment"], isExternal: [0, false], appearance: [0, "primary"] }]
    ]]
  }],
  "data-astro-cid-lcdefpme": [0, true]
};

// Replace Astro Island props attributes safely
html = html.replace(/(<astro-island[^>]*component-url="[^"]*Header[^"]*"[^>]*props=")([^"]*)(")/i, (m, p1, p2, p3) => p1 + encodeProps(headerPropsObj) + p3);
html = html.replace(/(<astro-island[^>]*component-url="[^"]*LandingHero[^"]*"[^>]*props=")([^"]*)(")/i, (m, p1, p2, p3) => p1 + encodeProps(heroPropsObj) + p3);

let moduleCount = 0;
html = html.replace(/(<astro-island[^>]*component-url="[^"]*ModuleFeatureList[^"]*"[^>]*props=")([^"]*)(")/gi, (m, p1, p2, p3) => {
  moduleCount++;
  if (moduleCount === 1) {
    return p1 + encodeProps(capabilitiesPropsObj) + p3;
  } else {
    return p1 + encodeProps(domainsPropsObj) + p3;
  }
});

html = html.replace(/(<astro-island[^>]*component-url="[^"]*ImageTextOverlay[^"]*"[^>]*props=")([^"]*)(")/i, (m, p1, p2, p3) => p1 + encodeProps(overlayPropsObj) + p3);
html = html.replace(/(<astro-island[^>]*component-url="[^"]*Footer[^"]*"[^>]*props=")([^"]*)(")/i, (m, p1, p2, p3) => p1 + encodeProps(headerPropsObj) + p3);

// Replace static header / footer logos
html = html.replace(/src="\/images\/logo\.svg"/g, 'src="/images/paykavach-logo.png"');
html = html.replace(/src="\/content\/tempo-full-logo\.svg"/g, 'src="/images/paykavach-logo.png"');
html = html.replace(/alt="Tempo full logo"/g, 'alt="PayKavach — Intercept Before It Reaches"');
html = html.replace(/alt="Tempo"/g, 'alt="PayKavach"');

// Inject custom styles for logo display so it renders cleanly and sharp
if (!html.includes('paykavach-logo-styles')) {
  html = html.replace('</head>', `<style id="paykavach-logo-styles">
._headerLogo_aukpd_20 a { display: flex !important; align-items: center !important; text-decoration: none !important; }
._headerLogo_aukpd_20 img { width: auto !important; height: 38px !important; max-width: 210px !important; object-fit: contain !important; }
._footerLogoImg_cl0m3_63 { width: auto !important; height: 52px !important; max-width: 250px !important; object-fit: contain !important; }
._mobileNavLogoImg_aukpd_521 { width: auto !important; height: 44px !important; max-width: 220px !important; object-fit: contain !important; }
</style></head>`);
}

// Replace static HTML texts throughout the document
html = html.replace(/The blockchain for payments at scale/g, 'Intercept Before It Reaches — Autonomous AI Payment Scam Defense');
html = html.replace(/Tempo is a payments-first Layer 1 blockchain incubated by Stripe and Paradigm, purpose-built for stablecoin payments at scale\. It gives businesses and developers a stablecoin-native settlement layer for global payments\./g,
  'PayKavach is an autonomous 5-domain security pipeline that evaluates real-time payments in under 200ms. Fusing LightGBM ML hot-path scoring with parallel LangGraph multi-agent reasoning to stop Authorized Push Payment (APP) fraud before money moves.');
html = html.replace(/>Get started</g, '>Try Payment Simulator<');
html = html.replace(/>See how companies are using Tempo/g, '>Open SOC Analyst Console');

html = html.replace(/Purpose-built for stablecoins/g, 'Purpose-built for Authorized Push Payment (APP) Scams');
html = html.replace(/Stablecoins enable instant, borderless, programmable transactions, but current blockchain infrastructure isn’t designed for them: existing systems are either fully general or trading-focused\. Tempo is designed for payments at scale\./g, 
  'Traditional fraud engines only check stolen card credentials or account takeover. When victims are manipulated into voluntarily completing payments themselves, legacy rules are completely blind. PayKavach analyzes payment memos, NLP urgency signals, mule graph networks, and cognitive stress in under 200ms.');
html = html.replace(/>About Tempo</g, '>Explore Architecture &rarr;<');

html = html.replace(/Shaped with global payment leaders/g, 'Trusted by Next-Gen Financial Institutions');
html = html.replace(/Incubated by Stripe and Paradigm, Tempo was designed with input from category-defining fintechs, banks, and commerce platforms serving billions worldwide\./g,
  'Built for KURUKSHETRA 2.0 (Problem Statement PS09), PayKavach integrates directly with UPI, FedNow, FPS, and enterprise core banking systems with zero customer checkout friction.');
html = html.replace(/>See customer stories &rarr;</g, '>Launch SOC Console &rarr;<');

// Static Section 3 texts
html = html.replace(/Performant &amp; scalable for any payments flow/g, 'Performant &amp; Explainable Multi-Agent Defense Pipeline');
html = html.replace(/>Remittances</g, '>Intent NLP Parsing<');
html = html.replace(/Send money across borders instantly, securely, and at a fraction of traditional costs\./g, 'Reads payment memos and detects urgency, authority impersonation, extortion, and coercive social engineering patterns in real time.');
html = html.replace(/>Global payouts</g, '>Tiered Latency ML Scoring<');
html = html.replace(/Pay anyone, anywhere, in any currency—without banking delays or fees\./g, '114-feature LightGBM GBDT hot-path model delivering sub-15ms risk scoring on payee velocity and historical behavioral baselines.');
html = html.replace(/>Payroll</g, '>Parallel Multi-Agent Consensus<');
html = html.replace(/Faster funding, cheaper cross-border payouts, and new revenue streams for payroll providers\./g, 'Four specialized LangGraph agents (Intent, Transaction, Recipient, Policy Gatekeeper) evaluate context concurrently.');
html = html.replace(/>Embedded finance</g, '>Cross-Bank Mule Graph Profiling<');
html = html.replace(/Build compliant, programmable payments—in any stablecoin—directly into your products\./g, 'Continuously tracks recipient account age, rapid fan-out velocity spikes, and money mule network clusters across banks.');
html = html.replace(/>Microtransactions</g, '>Cognitive Dwell Gate<');
html = html.replace(/Enable sub-cent stablecoin payments for pay-per-use services\./g, 'Deploys calibrated psychological friction, pausing high-risk transfers before money leaves the victim\'s account.');
html = html.replace(/>Agentic commerce</g, '>Voice Guardian Emergency Call<');
html = html.replace(/Facilitate low-cost, instant payments for agents to autonomously execute transactions\./g, 'Triggers an instant real-time AI voice conversation (Vapi AI) to speak directly with the user and break scammer phone coercion.');
html = html.replace(/>Tokenized deposits</g, '>Tamper-Evident SHA-256 Audit Trail<');
html = html.replace(/Move customer funds onchain for instant settlement and efficient interbank transfers\./g, 'Cryptographically signs all evidence dossiers and agent reasoning traces for full regulatory compliance and auditability.');

// Static Section 4 texts
html = html.replace(/Designed for real-world use cases at scale/g, 'The Five Domains of Autonomous Defense');
html = html.replace(/>Dedicated payment lanes</g, '>Domain 1 — Simulation &amp; Ingestion<');
html = html.replace(/Guaranteed blockspace for payments at the protocol level\. Fees stay low and stable even when network activity spikes\./g, 'Real-time payment canvas intercepting raw UPI/banking payloads, normalizing metadata, and initializing session state.');
html = html.replace(/>Stablecoin-native gas</g, '>Domain 2 — ML Hot-Path Inference Engine<');
html = html.replace(/Pay fees in USD stablecoins\. No volatile gas tokens, predictable costs, and simpler accounting\./g, 'Ultra-low latency LightGBM GBDT scoring (<15ms) running on 114 vectorized behavioral, temporal, and velocity features.');
html = html.replace(/>Built-in stable asset DEX</g, '>Domain 3 — LangGraph Multi-Agent Cluster<');
html = html.replace(/Native DEX optimized for stablecoins and tokenized deposits\. Low fees and maintained liquidity\./g, 'Intent, Transaction, and Recipient agents perform deep contextual reasoning in parallel with conformal uncertainty bounds.');
html = html.replace(/>Payments metadata</g, '>Domain 4 — Deterministic Policy Gatekeeper<');
html = html.replace(/Structured memo fields for invoices and identifiers\. Reconcile payments against ERP systems without custom code\./g, 'Translates probabilistic agent outputs into strict rule directives: ALLOW, ADVISE, CHALLENGE, PAUSE, or BLOCK.');
html = html.replace(/>Deterministic settlement</g, '>Domain 5 — Cognitive Interventions &amp; TruGen Video<');
html = html.replace(/Blocks finalize in ~0\.6 seconds with no re-orgs\. Settlement certainty that matches existing financial systems\./g, 'Deploys interactive friction, TruGen AI avatar video calls, and voice guidance before payment settlement.');
html = html.replace(/>Modern wallet signing</g, '>Domain 6 — Immutable Compliance &amp; SAR Engine<');
html = html.replace(/Programmable smart accounts with gas sponsorship, batch transactions, scheduled payments, and passkey auth\./g, 'Tamper-evident cryptographic ledger logging all evidence dossiers with automated Suspicious Activity Report (SAR) generation.');

// Static Section 5 texts
html = html.replace(/Stay updated/g, 'Protect Real-Time Payments with PayKavach');
html = html.replace(/Get Tempo updates delivered to your inbox\. No spam, unsubscribe anytime\./g, 'Deploy autonomous multi-agent scam interception across UPI, FedNow, and core banking systems with zero customer checkout friction.');

// Clean up all static URLs and links
html = html.replace(/https:\/\/tempo\.xyz\/solutions\/[a-z-]+/g, 'http://localhost:3000/payment');
html = html.replace(/https:\/\/tempo\.xyz\/learn\/[a-z-]+/g, 'http://localhost:3000/soc-console');
html = html.replace(/https:\/\/tempo\.xyz\/learn\//g, 'http://localhost:3000/soc-console');
html = html.replace(/https:\/\/tempo\.xyz\/blog\/[a-z-]+/g, 'http://localhost:3000/soc-console');
html = html.replace(/https:\/\/tempo\.xyz\/blog\/[a-z-]+\//g, 'http://localhost:3000/soc-console');
html = html.replace(/https:\/\/tempo\.xyz\/customer-stories/g, 'http://localhost:3000/soc-console');
html = html.replace(/https:\/\/tempo\.xyz\/ecosystem/g, 'http://localhost:3000/soc-console');
html = html.replace(/https:\/\/tempo\.xyz\/developers\/docs/g, 'http://localhost:3000/soc-console');
html = html.replace(/https:\/\/explore\.tempo\.xyz\//g, 'http://localhost:3000/soc-console');
html = html.replace(/https:\/\/wallet\.tempo\.xyz\/welcome/g, 'http://localhost:3000/payment');
html = html.replace(/https:\/\/status\.tempo\.xyz\//g, 'http://localhost:3000/soc-console');
html = html.replace(/https:\/\/github\.com\/tempoxyz/g, 'https://github.com/Laukikrathod2007/KURUKSHETRA_2.0_HACKFEST');
html = html.replace(/hello@tempo\.xyz/g, 'contact@paykavach.io');

html = html.replace(/href="\/solutions\/[a-z-]+"/g, 'href="http://localhost:3000/payment"');
html = html.replace(/href="\/customer-stories"/g, 'href="http://localhost:3000/soc-console"');
html = html.replace(/href="\/ecosystem"/g, 'href="http://localhost:3000/soc-console"');
html = html.replace(/href="\/developers\/docs"/g, 'href="http://localhost:3000/soc-console"');
html = html.replace(/href="\/developers\/blog"/g, 'href="http://localhost:3000/soc-console"');
html = html.replace(/href="\/developers\/"/g, 'href="http://localhost:3000/payment"');
html = html.replace(/href="\/developers"/g, 'href="http://localhost:3000/payment"');
html = html.replace(/href="\/about\/"/g, 'href="http://localhost:3000/soc-console"');
html = html.replace(/href="\/about"/g, 'href="http://localhost:3000/soc-console"');
html = html.replace(/href="\/faq"/g, 'href="http://localhost:3000/soc-console"');
html = html.replace(/href="\/blog"/g, 'href="http://localhost:3000/soc-console"');
html = html.replace(/href="\/reports"/g, 'href="http://localhost:3000/soc-console"');
html = html.replace(/href="\/advisory"/g, 'href="http://localhost:3000/soc-console"');
html = html.replace(/href="\/privacy-policy\/"/g, 'href="http://localhost:3000/soc-console"');
html = html.replace(/href="\/contact"/g, 'href="http://localhost:3000/soc-console"');

html = html.replace(/© 2026 Tempo\. Incubated by Stripe and Paradigm\./g, '© 2026 PayKavach // Team Midnight Ciphers (KURUKSHETRA 2.0 - PS09). All rights reserved.');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Clean PayKavach build completed successfully!');

