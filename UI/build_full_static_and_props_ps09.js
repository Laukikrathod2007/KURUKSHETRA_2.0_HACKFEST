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
// 3. Hero Astro Island Props — Structured typography & pill inspired by Ebury
const heroPropsObj = {
  headline: [0, "Autonomous defense built for real-time payment networks"],
  description: [0, "Intercept Authorized Push Payment (APP) fraud across UPI, FedNow, and core banking before money moves — with zero customer checkout friction."],
  heroBannerLink: [0, {
    text: [0, "See what's new: Autonomous Multi-Agent Defense ↗"],
    url: [0, "http://localhost:3000/soc-console"],
    isExternal: [0, false]
  }],
  heroLinks: [1, [
    [0, { text: [0, "Try Payment Simulator"], url: [0, "http://localhost:3000/payment"], isExternal: [0, false], appearance: [0, "primary"] }],
    [0, { text: [0, "Open SOC Analyst Console"], url: [0, "http://localhost:3000/soc-console"], isExternal: [0, false], appearance: [0, "with-arrow"] }]
  ]],
  heroCallout: [0],
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

// Inject custom styles: logo display + gold accent touches + bigger logo cells + page-load animation
if (!html.includes('paykavach-logo-styles')) {
  html = html.replace('</head>', `<style id="paykavach-logo-styles">
/* ─── Logo Display ─── */
._headerLogo_aukpd_20 a { display: flex !important; align-items: center !important; text-decoration: none !important; }
._headerLogo_aukpd_20 img { width: auto !important; height: 38px !important; max-width: 210px !important; object-fit: contain !important; }
._footerLogoImg_cl0m3_63 { width: auto !important; height: 52px !important; max-width: 250px !important; object-fit: contain !important; }
._mobileNavLogoImg_aukpd_521 { width: auto !important; height: 44px !important; max-width: 220px !important; object-fit: contain !important; }

/* ─── Gold Accent Color Touches (matching #C9A227 / #F0C040 logo palette) ─── */
/* Primary buttons — gold gradient */
._buttonPrimary_1wyxw_12 {
  background: linear-gradient(135deg, #C9A227 0%, #F0C040 100%) !important;
  color: #0a0a0f !important;
  border: none !important;
  font-weight: 800 !important;
  box-shadow: 0 4px 20px rgba(201,162,39,0.35) !important;
  transition: all 0.25s ease !important;
}
._buttonPrimary_1wyxw_12:hover {
  box-shadow: 0 6px 28px rgba(201,162,39,0.55) !important;
  transform: translateY(-1px) !important;
}
/* Secondary buttons — gold border */
._buttonSecondary_1wyxw_17 {
  border-color: rgba(201,162,39,0.4) !important;
  color: #C9A227 !important;
  transition: all 0.25s ease !important;
}
._buttonSecondary_1wyxw_17:hover {
  border-color: #C9A227 !important;
  background: rgba(201,162,39,0.06) !important;
}
/* Feature list accent dots / icons */
._featureItemIcon_1wyxw_1, ._icon_1wyxw_1 { color: #C9A227 !important; }
/* Section headers — subtle gold underline */
._headerTitle_osd0a_6::after {
  content: '';
  display: block;
  width: 48px;
  height: 2px;
  background: linear-gradient(90deg, #C9A227, #F0C040);
  margin-top: 12px;
  border-radius: 2px;
}
/* Logo wall cells — hover gold glow */
._logoCell_osd0a_37 {
  transition: all 0.2s ease !important;
}
._logoCell_osd0a_37:hover {
  background: rgba(201,162,39,0.04) !important;
}
/* Footer gold accent */
._footerSectionTitle_cl0m3_1 { color: #C9A227 !important; }

/* ─── Bigger logo wall cells ─── */
._logosGrid_osd0a_31 ._logoCell_osd0a_37 {
  padding: 28px 20px !important;
  min-height: 100px !important;
}
._logoImageCompact_osd0a_89 {
  width: 130px !important;
  height: auto !important;
  max-height: 56px !important;
  filter: grayscale(1) brightness(0) !important;
  opacity: 0.75 !important;
  transition: opacity 0.2s ease !important;
  object-fit: contain !important;
}
._logoCell_osd0a_37:hover ._logoImageCompact_osd0a_89 {
  opacity: 1 !important;
  filter: grayscale(0) brightness(1) !important;
}

/* ─── Hero Headline & Structure (Ebury-style structured typography) ─── */
._heroHeadline_golzh_59 {
  font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif) !important;
  font-weight: 800 !important;
  letter-spacing: -0.035em !important;
  line-height: 1.12 !important;
  font-size: clamp(2.4rem, 4.6vw, 3.9rem) !important;
  color: #061B31 !important;
  max-width: 580px !important;
  margin-top: 0 !important;
  margin-bottom: 20px !important;
  text-wrap: balance !important;
}
._heroDescription_golzh_63 {
  font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif) !important;
  font-size: clamp(1rem, 1.2vw, 1.125rem) !important;
  line-height: 1.65 !important;
  color: #4b5563 !important;
  max-width: 480px !important;
  margin-bottom: 34px !important;
  font-weight: 450 !important;
}
._heroBanner_148bq_1 {
  border-radius: 999px !important;
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(6, 27, 49, 0.12) !important;
  padding: 8px 18px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #061B31 !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  margin-bottom: 24px !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04) !important;
  text-decoration: none !important;
  transition: all 0.2s ease !important;
}
._heroBanner_148bq_1:hover {
  background: #ffffff !important;
  border-color: #C9A227 !important;
  box-shadow: 0 4px 14px rgba(201, 162, 39, 0.2) !important;
  transform: translateY(-1px) !important;
}
._heroBannerIndicator_148bq_15 {
  width: 7px !important;
  height: 7px !important;
  border-radius: 50% !important;
  background-color: #C9A227 !important;
  box-shadow: 0 0 6px #C9A227 !important;
  flex-shrink: 0 !important;
}
._landingHeroBottom_golzh_29 {
  display: none !important;
}

/* ─── Splash / Page-Load Animation ─── */
#pk-splash {
  position: fixed;
  inset: 0;
  background: #0a0a0f;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  pointer-events: none;
  transition: opacity 0.6s ease, visibility 0.6s ease;
}
#pk-splash.hidden {
  opacity: 0;
  visibility: hidden;
}
#pk-splash-logo {
  width: 100px;
  height: 100px;
  animation: pkLogoReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
}
#pk-splash-wordmark {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: pkFadeUp 0.6s ease 0.5s forwards;
  opacity: 0;
}
#pk-splash-wordmark span:first-child {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 28px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.03em;
}
#pk-splash-wordmark span:last-child {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  color: #C9A227;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
#pk-splash-bar {
  width: 200px;
  height: 2px;
  background: #1a1a2e;
  border-radius: 2px;
  overflow: hidden;
  animation: pkFadeUp 0.5s ease 0.7s forwards;
  opacity: 0;
}
#pk-splash-bar-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #C9A227, #F0C040);
  animation: pkBarFill 1s ease 0.8s forwards;
  border-radius: 2px;
}
#pk-splash-dots {
  display: flex;
  gap: 6px;
  animation: pkFadeUp 0.5s ease 0.9s forwards;
  opacity: 0;
}
#pk-splash-dots span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #C9A227;
  animation: pkDotPulse 1.2s ease infinite;
}
#pk-splash-dots span:nth-child(2) { animation-delay: 0.2s; }
#pk-splash-dots span:nth-child(3) { animation-delay: 0.4s; }

/* Gold orbit ring around splash logo */
#pk-splash-orbit {
  position: absolute;
  width: 140px;
  height: 140px;
  border: 1.5px solid rgba(201,162,39,0.3);
  border-radius: 50%;
  animation: pkOrbitSpin 2s linear infinite, pkFadeUp 0.4s ease 0.2s forwards;
  opacity: 0;
}
#pk-splash-orbit::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: #C9A227;
  border-radius: 50%;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px #C9A227;
}

@keyframes pkLogoReveal {
  from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
  to   { opacity: 1; transform: scale(1) rotate(0deg); }
}
@keyframes pkFadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pkBarFill {
  from { width: 0%; }
  to   { width: 100%; }
}
@keyframes pkDotPulse {
  0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
  40%           { transform: scale(1); opacity: 1; }
}
@keyframes pkOrbitSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>

<!-- PayKavach Page Load Splash Animation -->
<script>
(function() {
  // Inject splash DOM before body renders
  document.addEventListener('DOMContentLoaded', function() {
    var splash = document.createElement('div');
    splash.id = 'pk-splash';
    splash.innerHTML = \`
      <div id="pk-splash-orbit"></div>
      <img id="pk-splash-logo" src="/images/paykavach-icon.png" alt="PayKavach" />
      <div id="pk-splash-wordmark">
        <span>PayKavach</span>
        <span>Autonomous AI Payment Defense</span>
      </div>
      <div id="pk-splash-bar"><div id="pk-splash-bar-fill"></div></div>
      <div id="pk-splash-dots"><span></span><span></span><span></span></div>
    \`;
    document.body.insertBefore(splash, document.body.firstChild);
    // Dismiss after 2.2s
    setTimeout(function() { splash.classList.add('hidden'); }, 2200);
    setTimeout(function() { splash.remove(); }, 2900);
  });
})();
</script>

</head>`);
}

// Replace static HTML texts throughout the document
html = html.replace(/<div class="_heroContent_golzh_54"><h1 class="type:h1 _heroHeadline_golzh_59 space:d72">The blockchain for payments at scale<\/h1><p class="type:b2 _heroDescription_golzh_63 space:d60">Tempo is a payments-first Layer 1 blockchain incubated by Stripe and Paradigm, purpose-built for stablecoin payments at scale\. It gives businesses and developers a stablecoin-native settlement layer for global payments\.<\/p>/,
  `<div class="_heroContent_golzh_54"><div class="space:d24"><a href="http://localhost:3000/soc-console" class="type:button _heroBanner_148bq_1"><span class="_heroBannerIndicator_148bq_15"></span>See what's new: Autonomous Multi-Agent Defense ↗<img src="/images/icons/arrow_linkout.svg" alt="" aria-hidden="true" class="icon:24 _heroBannerArrow_148bq_22"/></a></div><h1 class="type:h1 _heroHeadline_golzh_59 space:d72">Autonomous defense built for real-time payment networks</h1><p class="type:b2 _heroDescription_golzh_63 space:d60">Intercept Authorized Push Payment (APP) fraud across UPI, FedNow, and core banking before money moves — with zero customer checkout friction.</p>`);
html = html.replace(/>Get started</g, '>Try Payment Simulator<');
html = html.replace(/>See how companies are using Tempo/g, '>Open SOC Analyst Console');

html = html.replace(/Purpose-built for stablecoins/g, 'Purpose-built for Authorized Push Payment (APP) Scams');
html = html.replace(/Stablecoins enable instant, borderless, programmable transactions, but current blockchain infrastructure isn’t designed for them: existing systems are either fully general or trading-focused\. Tempo is designed for payments at scale\./g, 
  'Traditional fraud engines only check stolen card credentials or account takeover. When victims are manipulated into voluntarily completing payments themselves, legacy rules are completely blind. PayKavach analyzes payment memos, NLP urgency signals, mule graph networks, and cognitive stress in under 200ms.');
html = html.replace(/>About Tempo</g, '>Explore Architecture &rarr;<');

// Replace Section 2 logo wall — keep exact Tempo template structure, swap in PayKavach tech stack SVG wordmarks
const paykavachLogoWall = `<div data-section="animation-2" class="landing-module-logo-wall" data-astro-cid-lcdefpme><section class="_isHalf_osd0a_140"><div class="grid-container"><div class="grid-layout"><div class=" col-6 md:col-8 lg:col-6"><div class="_gridHeader_osd0a_1"><h2 class="_headerTitle_osd0a_6 type:h2 space:d64">Built on the infrastructure that powers real-time payments</h2><p class="_headerText_osd0a_7 type:b2">PayKavach integrates across payment rails, AI agent frameworks, and compliance standards — intercepting fraud across every layer of the modern financial stack.</p><nav class="_gridHeaderActions_osd0a_15" aria-label="Logo wall actions"><a href="#" class="type:button _button_1wyxw_1 _buttonSecondary_1wyxw_17">Explore the architecture &rarr;</a></nav></div><ul class="_logosGrid_osd0a_31 _logosGridHalf_osd0a_46"><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/upi-npci.svg" alt="UPI / NPCI" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/fednow.svg" alt="FedNow" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/swift-iso20022.svg" alt="SWIFT ISO 20022" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/fps-uk.svg" alt="FPS Faster Payments UK" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/lightgbm.svg" alt="LightGBM" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/langgraph.svg" alt="LangGraph" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/fastmcp.svg" alt="FastMCP" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/vapi-ai.svg" alt="Vapi AI" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/trugen.svg" alt="TruGen" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/intent-nlp.svg" alt="Intent NLP" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/mule-graph.svg" alt="Mule Graph" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/dwell-gate.svg" alt="Dwell Gate" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/sha256-audit.svg" alt="SHA-256 Audit Trail" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/fincen-sar.svg" alt="FinCEN SAR" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/rbi-framework.svg" alt="RBI Cyber Directive" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/pci-dss.svg" alt="PCI-DSS v4.0" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/iso27001.svg" alt="ISO 27001" width="100" height="34" loading="lazy"/></li><li class="_logoCell_osd0a_37"><img class="_logoImageCompact_osd0a_89" src="/content/partners/policy-gate.svg" alt="Policy Gatekeeper" width="100" height="34" loading="lazy"/></li></ul></div></div></div></section></div>`;

html = html.replace(/<div data-section="animation-2" class="landing-module-logo-wall"[\s\S]*?<\/section>\s*<\/div>/i, () => paykavachLogoWall);


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

// Remove leftover 07 Privacy card from Section 4
html = html.replace(/<article class="_blockFeature_phh4x_1 _isLinked_phh4x_30"><a href="https:\/\/tempo\.xyz\/blog\/privacy-on-tempo\/"[\s\S]*?<\/article>/i, '');

// Read Customer Journey Touchpoints Component (matching media_1789188728892.png)
const customerJourneyHTML = fs.readFileSync('C:/Users/LAUKIK/.gemini/antigravity/brain/988ba458-3ecc-4c12-a616-04b83c88d640/scratch/customer_journey_component.html', 'utf8');

// Read Exact Oscilar Methodology Component (matching media_1789179124045.png)
const methodologyHTML = fs.readFileSync('C:/Users/LAUKIK/.gemini/antigravity/brain/988ba458-3ecc-4c12-a616-04b83c88d640/scratch/oscilar_exact_component.html', 'utf8');

// Insert Customer Journey & Methodology components right BEFORE ImageTextOverlay island ("Protect Real-Time Payments with PayKavach")
html = html.replace(/(<astro-island[^>]*component-url="[^"]*ImageTextOverlay[^"]*"[\s\S]*?<\/astro-island>)/i, (match) => customerJourneyHTML + '\n' + methodologyHTML + '\n' + match);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Clean PayKavach build with Exact Oscilar Methodology completed successfully!');





