const fs = require('fs');

const rawHtml = fs.readFileSync('tempo_raw.html', 'utf8');
let html = rawHtml;

// 1. Update Title and Meta
html = html.replace(/<title>.*?<\/title>/i, '<title>Agentic Guardian: AI Agents for Every Risk Decision (PS09 // KURUKSHETRA 2.0)</title>');
html = html.replace(/content="Tempo: The blockchain for stablecoin payments"/gi, 'content="Agentic Guardian: AI agents for every risk decision."');

// 2. Adjust Canvas Positioning CSS so <canvas id="gl"> is clipped/offset to the right half ONLY and never covers left text
const canvasCSS = `
<style>
  #gl {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    left: 48% !important;
    width: 52% !important;
    height: 100vh !important;
    pointer-events: none !important;
    z-index: 1 !important;
    opacity: 0.9 !important;
  }
  @media (max-width: 1023px) {
    #gl { display: none !important; }
  }
  ._heroHeadline_golzh_59, ._heroDescription_golzh_63, h1, p, a, button {
    position: relative !important;
    z-index: 10 !important;
  }
</style>
`;

html = html.replace('</head>', canvasCSS + '\n</head>');

// 3. Hero Section (Image 1 Oscilar)
const oscilarHeroHTML = `
<section class="_landingHero_golzh_1" style="padding-top: 30px; padding-bottom: 70px; position: relative; z-index: 10;">
  <div class="grid-container _heroContainer_golzh_16">
    <div style="margin-bottom: 28px;">
      <a href="http://localhost:3000/soc-console" style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: #64748b; text-decoration: none; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.08); padding: 6px 18px; border-radius: 999px;">
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #ef4444;">EX-SANTANDER COO SERGIO COSTANTINI JOINS AGENTIC GUARDIAN</span>
        <span style="color: #ef4444; font-weight: 600;">/ Read the story &rarr;</span>
      </a>
    </div>
    <div class="grid-layout" style="align-items: center; gap: 32px;">
      <div class="col-6 md:col-6 lg:col-6" style="position: relative; z-index: 20;">
        <h1 style="font-size: clamp(2.8rem, 4.8vw, 4.5rem); font-weight: 900; color: #000; line-height: 1.08; margin-bottom: 24px; letter-spacing: -0.03em;">
          AI agents for <br/>
          <span style="color: #ef4444;">every</span> risk decision.
        </h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.7; margin-bottom: 28px; max-width: 520px;">
          Agentic Guardian is the <strong>Agentic Risk Platform</strong> for financial institutions. AI agents that handle detection, decisions, and resolution across fraud, scams, onboarding, and AML compliance. The result: <strong>45% fewer false positives</strong>, <strong>5x faster policy deployment</strong>, <strong>3x faster case resolution</strong>.
        </p>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <a href="http://localhost:3000/payment" class="type:button _button_1wyxw_1 _buttonPrimary_1wyxw_12" style="background: #000; color: #fff; border-radius: 999px; padding: 12px 28px; font-weight: 700;">
            Get a Demo &rarr;
          </a>
          <a href="http://localhost:3000/soc-console" class="type:button _button_1wyxw_1 _buttonSecondary_1wyxw_17" style="background: rgba(0,0,0,0.05); color: #000; border-radius: 999px; padding: 12px 28px; font-weight: 600; border: 1px solid rgba(0,0,0,0.1);">
            View Platform Details
          </a>
        </div>
      </div>
      <div class="col-6 md:col-6 lg:col-6" style="position: relative; z-index: 20;">
        <div style="background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(0,0,0,0.08); border-radius: 24px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); backdrop-filter: blur(12px);">
          <div style="background: #fafafa; border: 1px solid rgba(0,0,0,0.06); border-radius: 16px; padding: 16px; margin-bottom: 18px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: #ef4444; color: #fff; font-size: 11px; font-weight: 700;">2</span>
              <span style="font-size: 15px; font-weight: 800; color: #0f172a;">Optimize</span>
            </div>
            <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
              Assess real-time performance without SQL expertise and get instant AI-powered recommendations.
            </p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 18px; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 14px;">
            <div>
              <div style="font-size: 22px; font-weight: 900; color: #0f172a;">48</div>
              <div style="font-size: 10px; color: #64748b; font-family: 'JetBrains Mono', monospace;">Active Risk Rules</div>
            </div>
            <div>
              <div style="font-size: 22px; font-weight: 900; color: #0f172a;">0.987</div>
              <div style="font-size: 10px; color: #64748b; font-family: 'JetBrains Mono', monospace;">AUC-ROC Accuracy</div>
            </div>
            <div>
              <div style="font-size: 22px; font-weight: 900; color: #0f172a;">3.2 min</div>
              <div style="font-size: 10px; color: #64748b; font-family: 'JetBrains Mono', monospace;">Avg. Alert Backlog</div>
            </div>
          </div>
          <div style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(0,0,0,0.08);">
            <img src="/oscilar_site/assets/framerusercontent.com/images/2uxHmtN3tfZFmf19Nwx5UKaEtY.png" alt="Oscilar Real-Time Risk Dashboard" style="width: 100%; height: 210px; object-fit: cover; display: block;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

html = html.replace(/<section class="_landingHero_golzh_1">[\s\S]*?<\/section>/i, oscilarHeroHTML);

// 4. Precise Section Splitting & Replacement
const idx1 = html.indexOf('data-section="animation-1"');
const idx4 = html.indexOf('data-section="animation-4"');

const section1Content = `data-section="animation-1" class="landing-module-text" data-astro-cid-lcdefpme><section class="_moduleText_9taos_1 _vertical_9taos_29" data-layout="vertical" style="position: relative; z-index: 10;"><div class="grid-container"><div class="grid-layout"><div class="_moduleTextCol_9taos_23 col-6 md:col-8 lg:col-8"><h2 class="type:h2 space:d64" style="font-weight: 900; color: #0f172a;">Purpose-built for Authorized Push Payment (APP) Scams</h2><p class="type:b2 _moduleTextBody_9taos_13 space:d32" style="color: #475569;">Traditional fraud engines only check stolen card credentials or account takeover. When victims are manipulated into voluntarily completing payments themselves, legacy rules are completely blind. Agentic Guardian analyzes payment memos, NLP urgency signals, mule graph networks, and cognitive stress in under 200ms.</p><div class="_moduleTextLinks_9taos_17"><a href="http://localhost:3000/payment" class="type:button _button_1wyxw_1 _buttonPrimary_1wyxw_12" style="background: #000; color: #fff; border-radius: 999px; padding: 12px 28px; font-weight: 700;">Explore Agentic Architecture &rarr;</a></div></div></div></div></section></div>`;

const section2Content = `<div data-section="animation-2" class="landing-module-logo-wall" data-astro-cid-lcdefpme style="padding: 80px 0; background: #fafafa; border-top: 1px solid rgba(0,0,0,0.06); border-bottom: 1px solid rgba(0,0,0,0.06); position: relative; z-index: 10;">
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

const section3Content = `<div data-section="animation-3" class="landing-module-text" data-astro-cid-lcdefpme style="padding: 100px 0; background: #ffffff; position: relative; z-index: 10;">
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
console.log('Successfully written clean master Oscilar landing page!');
