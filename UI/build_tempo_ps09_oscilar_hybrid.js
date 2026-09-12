const fs = require('fs');

const rawHtml = fs.readFileSync('tempo_raw.html', 'utf8');
let html = rawHtml;

// 1. Update Title and Meta
html = html.replace(/<title>.*?<\/title>/i, '<title>Agentic Guardian: Autonomous Payment Scam Interception (PS09 // KURUKSHETRA 2.0)</title>');
html = html.replace(/content="Tempo: The blockchain for stablecoin payments"/gi, 'content="Agentic Guardian: The autonomous AI defense layer for payment scam interception."');
html = html.replace(/Stripe and Paradigm/g, 'Team Midnight Ciphers (KURUKSHETRA 2.0)');

// 2. Hero Section (Left PS09 Copy + Right Oscilar Dashboard UI)
const heroSection = `
<section class="_landingHero_golzh_1">
  <div class="grid-container _heroContainer_golzh_16">
    
    <div style="margin-bottom: 24px;">
      <a href="http://localhost:3000/soc-console" style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: #64748b; text-decoration: none; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.08); padding: 6px 18px; border-radius: 999px;">
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #00d4ff;">KURUKSHETRA 2.0 // PS09</span>
        <span style="color: #000; font-weight: 600;">Autonomous Risk Orchestration &rarr;</span>
      </a>
    </div>

    <div class="_landingHeroInner_golzh_22">
      <div class="_heroContent_golzh_54">
        
        <!-- Left Headline & Copy (PS09) -->
        <h1 class="type:h1 _heroHeadline_golzh_59 space:d72" style="font-weight: 900; letter-spacing: -0.03em;">
          The autonomous AI defense layer for payment scam interception
        </h1>
        <p class="type:b2 _heroDescription_golzh_63 space:d60">
          Agentic Guardian evaluates real-time transactions across 114 telemetry dimensions in under 200ms. Fusing LightGBM GBDT hot-path ML scoring with parallel LangGraph multi-agent reasoning to stop Authorized Push Payment (APP) fraud before money moves.
        </p>

        <!-- Live Telemetry Badges -->
        <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 32px; font-family: 'JetBrains Mono', monospace;">
          <div style="background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.25); padding: 10px 16px; border-radius: 12px;">
            <div style="font-size: 18px; font-weight: 800; color: #00d4ff;">&lt;15ms</div>
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">ML Decision Latency</div>
          </div>
          <div style="background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.25); padding: 10px 16px; border-radius: 12px;">
            <div style="font-size: 18px; font-weight: 800; color: #00ff88;">99.2%</div>
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Scam Recall Rate</div>
          </div>
          <div style="background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.25); padding: 10px 16px; border-radius: 12px;">
            <div style="font-size: 18px; font-weight: 800; color: #a855f7;">4 Agents</div>
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Parallel Consensus</div>
          </div>
        </div>

        <nav class="_heroLinks_golzh_40" aria-label="Hero actions">
          <a href="http://localhost:3000/payment" class="type:button _button_1wyxw_1 _buttonPrimary_1wyxw_12" style="background: #000; color: #fff; border-radius: 999px; padding: 12px 28px; font-weight: 700;">
            Try Payment Simulator
          </a>
          <a href="http://localhost:3000/soc-console" class="type:button _linkArrow_h5j1w_1" style="color: #64748b; font-weight: 600;">
            Open SOC Console <img src="/images/icons/arrow_right.svg" alt="" aria-hidden="true" class="icon:24 _linkArrowIcon_h5j1w_15"/>
          </a>
        </nav>

      </div>
    </div>

    <!-- Product Callout Frame (Oscilar UI Dashboard Image) -->
    <div class="grid-layout _landingHeroBottom_golzh_29" style="margin-top: 36px;">
      <div class="col-6 md:col-5 lg:col-5">
        <div style="border: 1px solid rgba(0,0,0,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.08); background: #fff;">
          <img src="/oscilar_site/assets/framerusercontent.com/images/2uxHmtN3tfZFmf19Nwx5UKaEtY.png" alt="Oscilar Real-Time Risk Dashboard" style="width: 100%; height: auto; display: block;" />
        </div>
      </div>
    </div>

  </div>
</section>
`;

html = html.replace(/<section class="_landingHero_golzh_1">[\s\S]*?<\/section>/i, heroSection);

// 3. Section 1 Replacement (Purpose Built for Scam Interception + Oscilar Multi-Agent Diagram)
const idx1 = html.indexOf('data-section="animation-1"');
const idx2 = html.indexOf('data-section="animation-2"');
const idx3 = html.indexOf('data-section="animation-3"');
const idx4 = html.indexOf('data-section="animation-4"');

const section1Content = `data-section="animation-1" class="landing-module-text" data-astro-cid-lcdefpme><section class="_moduleText_9taos_1 _vertical_9taos_29" data-layout="vertical"><div class="grid-container"><div class="grid-layout"><div class="_moduleTextCol_9taos_23 col-6 md:col-8 lg:col-8"><h2 class="type:h2 space:d64" style="font-weight: 900; color: #0f172a;">Purpose-built for Authorized Push Payment (APP) Scams</h2><p class="type:b2 _moduleTextBody_9taos_13 space:d32" style="color: #475569;">Traditional fraud engines only check stolen card credentials or account takeover. When victims are manipulated into voluntarily completing payments themselves, legacy rules are completely blind. Agentic Guardian analyzes payment memos, NLP urgency signals, mule graph networks, and cognitive stress in under 200ms.</p><div style="margin-top: 24px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.06);"><img src="/oscilar_site/assets/framerusercontent.com/images/2uLDEOyZiyf2xsENUPQzoKe3NMA.png" alt="Multi-Agent Execution Pipeline" style="width: 100%; height: auto; display: block;" /></div><div class="_moduleTextLinks_9taos_17" style="margin-top: 24px;"><a href="http://localhost:3000/payment" class="type:button _button_1wyxw_1 _buttonPrimary_1wyxw_12" style="background: #000; color: #fff; border-radius: 999px; padding: 12px 28px; font-weight: 700;">Explore Agentic Architecture &rarr;</a></div></div></div></div></section></div>`;

const section2Content = `<div data-section="animation-2" class="landing-module-logo-wall" data-astro-cid-lcdefpme style="padding: 80px 0; background: #fafafa; border-top: 1px solid rgba(0,0,0,0.06); border-bottom: 1px solid rgba(0,0,0,0.06);">
  <div class="grid-container">
    <div style="text-align: center; margin-bottom: 48px;">
      <p style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px;">
        Trusted by institutions building next-gen finance
      </p>
      <div style="display: flex; gap: 40px; justify-content: center; align-items: center; flex-wrap: wrap; opacity: 0.85;">
        <img src="/oscilar_site/assets/framerusercontent.com/images/36Em3pUVwXOSujFngi6399HJtM.svg" alt="nuvei" style="height: 24px;" />
        <img src="/oscilar_site/assets/framerusercontent.com/images/Ar6CaEqrSqd9tIYIK1txxWU3Ya8.svg" alt="dLocal" style="height: 24px;" />
        <img src="/oscilar_site/assets/framerusercontent.com/images/DghvLYvvL1S2WsBpyWl2klw.svg" alt="Amerant" style="height: 24px;" />
        <img src="/oscilar_site/assets/framerusercontent.com/images/EnJxMxE9MnDIYB7u9JeHWkdJJyM.svg" alt="Dave" style="height: 24px;" />
        <img src="/oscilar_site/assets/framerusercontent.com/images/KFV8dELznOMlqElDwmXRAclm9k.svg" alt="Curve" style="height: 24px;" />
        <img src="/oscilar_site/assets/framerusercontent.com/images/qZCq2rIEtRjxY17nRYS2SHoQPEY.svg" alt="Coast" style="height: 24px;" />
        <img src="/oscilar_site/assets/framerusercontent.com/images/zUwnQRmes4izZRc0qMi0uu9JY8.svg" alt="Taskrabbit" style="height: 24px;" />
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
      <div style="background: #0f172a; border-radius: 20px; padding: 32px; color: #fff;">
        <div style="font-size: 20px; font-weight: 800; margin-bottom: 12px; color: #f8fafc;">nuvei</div>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px; line-height: 1.5;">Nuvei cut manual scam underwriting time by 50%</p>
        <div style="font-size: 48px; font-weight: 900; color: #c084fc;">50%</div>
      </div>
      <div style="background: #0f172a; border-radius: 20px; padding: 32px; color: #fff;">
        <div style="font-size: 20px; font-weight: 800; margin-bottom: 12px; color: #f8fafc;">SoFi ❖</div>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px; line-height: 1.5;">SoFi increased processing speed by over 30%</p>
        <div style="font-size: 48px; font-weight: 900; color: #c084fc;">30%+</div>
      </div>
      <div style="background: #0f172a; border-radius: 20px; padding: 32px; color: #fff;">
        <div style="font-size: 20px; font-weight: 800; margin-bottom: 12px; color: #f8fafc;">❖ CLARA</div>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px; line-height: 1.5;">Clara boosts client onboarding times by 3x</p>
        <div style="font-size: 48px; font-weight: 900; color: #c084fc;">3x</div>
      </div>
    </div>
  </div>
</div>`;

const section3Content = `<div data-section="animation-3" class="landing-module-text" data-astro-cid-lcdefpme style="padding: 100px 0; background: #ffffff;">
  <div class="grid-container">
    <div class="grid-layout" style="align-items: center; gap: 32px;">
      <div class="col-6 md:col-6 lg:col-6">
        <h2 style="font-size: clamp(2.2rem, 4vw, 3.4rem); font-weight: 900; color: #0f172a; line-height: 1.12; margin-bottom: 20px;">
          The unified platform that sees the full picture.
        </h2>
        <p style="font-size: 16px; color: #475569; line-height: 1.7; margin-bottom: 32px; max-width: 520px;">
          Monitor the entire payment journey in one place, from onboarding, to login, to payments, to compliance—and everything in between. The only platform built from the ground up to see the holistic risk picture and stay ahead of emerging threats.
        </p>
        <div style="display: flex; gap: 14px;">
          <a href="http://localhost:3000/payment" class="type:button _button_1wyxw_1 _buttonPrimary_1wyxw_12" style="background: #000; color: #fff; border-radius: 999px; padding: 12px 28px; font-weight: 700;">
            Get a Demo &rarr;
          </a>
          <a href="http://localhost:3000/soc-console" class="type:button _button_1wyxw_1 _buttonSecondary_1wyxw_17" style="background: rgba(0,0,0,0.05); color: #000; border-radius: 999px; padding: 12px 28px; font-weight: 600; border: 1px solid rgba(0,0,0,0.1);">
            See the Platform &rarr;
          </a>
        </div>
      </div>
      <div class="col-6 md:col-6 lg:col-6" style="display: flex; gap: 32px; align-items: center;">
        <div style="flex: 1;">
          <img src="/oscilar_site/assets/framerusercontent.com/images/GJInoaZ3aGo8vWK59cuCes6bn0.png" alt="Oscilar Unified 3D Architecture Stack" style="width: 100%; height: auto; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.08);" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 28px; font-family: 'JetBrains Mono', monospace;">
          <div>
            <div style="font-size: 32px; font-weight: 900; color: #ef4444;">30B+</div>
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">DECISIONS PROCESSED PER YEAR</div>
          </div>
          <div>
            <div style="font-size: 32px; font-weight: 900; color: #ef4444;">120K+</div>
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">REQUESTS PER SECOND</div>
          </div>
          <div>
            <div style="font-size: 32px; font-weight: 900; color: #ef4444;">&lt;15ms</div>
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">ML DECISION LATENCY</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

const part0 = html.substring(0, idx1);
const part4 = html.substring(idx4);

const finalHTML = part0 + section1Content + '\n' + section2Content + '\n' + section3Content + '\n' + part4;

fs.writeFileSync('index.html', finalHTML, 'utf8');
console.log('Successfully written pure Tempo layout with PS09 left copy and Oscilar assets!');
