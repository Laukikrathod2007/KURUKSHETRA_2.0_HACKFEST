const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Oscilar Solution Tabs Component HTML (Image media_1789174745621.png)
const section4TabsHTML = `
<div data-section="animation-4" class="landing-module-feature-list" data-astro-cid-lcdefpme style="padding: 100px 0; background: #fcfcfd; border-top: 1px solid rgba(0,0,0,0.06); position: relative; z-index: 10;">
  <div class="grid-container">
    
    <!-- Top Category Tabs (Onboarding, Credit, Fraud, Compliance) -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 48px; border-radius: 12px; background: #f1f5f9; padding: 6px;">
      <div style="padding: 12px; text-align: center; font-weight: 700; color: #475569; border-radius: 8px; cursor: pointer; font-size: 14px; background: transparent;">Onboarding</div>
      <div style="padding: 12px; text-align: center; font-weight: 700; color: #475569; border-radius: 8px; cursor: pointer; font-size: 14px; background: transparent;">Credit</div>
      <div style="padding: 12px; text-align: center; font-weight: 700; color: #475569; border-radius: 8px; cursor: pointer; font-size: 14px; background: transparent;">Fraud</div>
      <div style="padding: 12px; text-align: center; font-weight: 700; color: #ffffff; border-radius: 8px; cursor: pointer; font-size: 14px; background: #8b5cf6; box-shadow: 0 4px 12px rgba(139,92,246,0.3);">Compliance</div>
    </div>

    <!-- Main Content Area -->
    <div class="grid-layout" style="align-items: center; gap: 40px;">
      
      <!-- Left Sub-tab Indicators & Copy (Image media_1789174745621.png) -->
      <div class="col-6 md:col-6 lg:col-6" style="display: flex; gap: 24px;">
        
        <!-- Vertical 01 02 03 04 Step Indicators -->
        <div style="display: flex; flex-direction: column; gap: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: #cbd5e1;">
          <span style="color: #cbd5e1;">01</span>
          <span style="color: #cbd5e1;">02</span>
          <span style="color: #cbd5e1;">03</span>
          <span style="color: #8b5cf6; font-weight: 900; position: relative;">04 <span style="position: absolute; left: 24px; top: 6px; width: 20px; height: 2px; background: #8b5cf6;"></span></span>
        </div>

        <!-- Copy Details -->
        <div>
          <h2 style="font-size: clamp(2rem, 3.8vw, 3rem); font-weight: 900; color: #0f172a; line-height: 1.15; margin-bottom: 20px;">
            Prioritize key alerts and stay on top of AML compliance.
          </h2>
          <p style="font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 28px; max-width: 480px;">
            Reduce false positives and prioritize key alerts and cases with Oscilar's AI Case Management. Uplevel your compliance operations and accelerate investigations, SAR filing, reporting and governance.
          </p>
          <div style="margin-bottom: 32px;">
            <a href="http://localhost:3000/payment" class="type:button _button_1wyxw_1 _buttonPrimary_1wyxw_12" style="background: #000; color: #fff; border-radius: 999px; padding: 12px 28px; font-weight: 700;">
              Get a Demo &rarr;
            </a>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 20px;">
            <span style="color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">EXPLORE AML COMPLIANCE FOR:</span>
            <a href="http://localhost:3000/soc-console" style="color: #0f172a; text-decoration: none;">FinTechs &rarr;</a>
            <a href="http://localhost:3000/soc-console" style="color: #0f172a; text-decoration: none;">Sponsor Banks and BaaS &rarr;</a>
          </div>
        </div>

      </div>

      <!-- Right Side: Oscilar Command Center UI Screenshot Frame (Image media_1789174745621.png) -->
      <div class="col-6 md:col-6 lg:col-6">
        <div style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 20px; padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.08);">
          <img src="/oscilar_site/assets/framerusercontent.com/images/vo8wNNTvTY6aUHLJcYhzpShfNQ8.png" alt="Oscilar Unified Command Center UI" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
        </div>
      </div>

    </div>

  </div>
</div>
`;

// Replace Section 4 in index.html
html = html.replace(/<div data-section="animation-4"[\s\S]*?<\/astro-island>\s*<\/section>\s*<\/div>/i, section4TabsHTML);

// 2. Clean Footer Links Replacement
const cleanFooterHTML = `
<footer class="_footer_cl0m3_1" style="background: #090d16; color: #fff; padding: 60px 0 40px; border-top: 1px solid rgba(255,255,255,0.08); position: relative; z-index: 10;">
  <div class="grid-container">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-bottom: 48px;">
      
      <!-- Col 1: Branding -->
      <div>
        <div style="font-size: 20px; font-weight: 900; color: #fff; margin-bottom: 8px;">Agentic Guardian</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00d4ff; margin-bottom: 16px;">
          KURUKSHETRA 2.0 // PS09
        </div>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
          Autonomous multi-agent risk decisioning layer built for real-time payment scam interception.
        </p>
      </div>

      <!-- Col 2: Solutions -->
      <div>
        <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 16px;">Solutions</div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: #94a3b8;">
          <li><a href="http://localhost:3000/payment" style="color: inherit; text-decoration: none;">APP Scam Interception</a></li>
          <li><a href="http://localhost:3000/payment" style="color: inherit; text-decoration: none;">Multi-Agent Reasoning</a></li>
          <li><a href="http://localhost:3000/soc-console" style="color: inherit; text-decoration: none;">Mule Graph Profiling</a></li>
          <li><a href="http://localhost:3000/payment" style="color: inherit; text-decoration: none;">Cognitive Dwell Gate</a></li>
          <li><a href="http://localhost:3000/soc-console" style="color: inherit; text-decoration: none;">Cryptographic Audit</a></li>
        </ul>
      </div>

      <!-- Col 3: Developers -->
      <div>
        <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 16px;">Developers</div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: #94a3b8;">
          <li><a href="http://localhost:3000/soc-console" style="color: inherit; text-decoration: none;">SOC Analyst Console</a></li>
          <li><a href="http://localhost:3000/payment" style="color: inherit; text-decoration: none;">Payment Simulator</a></li>
          <li><a href="https://github.com/Laukikrathod2007/KURUKSHETRA_2.0_HACKFEST" style="color: inherit; text-decoration: none;">FastMCP Server</a></li>
          <li><a href="https://github.com/Laukikrathod2007/KURUKSHETRA_2.0_HACKFEST" style="color: inherit; text-decoration: none;">GitHub Repository</a></li>
        </ul>
      </div>

      <!-- Col 4: Resources -->
      <div>
        <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 16px;">Resources</div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: #94a3b8;">
          <li><a href="http://localhost:3000/soc-console" style="color: inherit; text-decoration: none;">PS09 Research Paper</a></li>
          <li><a href="http://localhost:3000/soc-console" style="color: inherit; text-decoration: none;">Submission PRD</a></li>
          <li><a href="http://localhost:3000/soc-console" style="color: inherit; text-decoration: none;">Architecture Specs</a></li>
          <li><a href="http://localhost:3000/soc-console" style="color: inherit; text-decoration: none;">Red-Team Report</a></li>
        </ul>
      </div>

    </div>

    <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; flex-wrap: wrap; gap: 12px;">
      <span>&copy; 2026 Agentic Guardian // Team Midnight Ciphers (KURUKSHETRA 2.0 - PS09)</span>
      <span style="color: #00ff88;">● 114 Telemetry Dimensions Active</span>
    </div>
  </div>
</footer>
`;

html = html.replace(/<footer class="_footer_cl0m3_1"[\s\S]*?<\/footer>/i, cleanFooterHTML);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html with Oscilar Solution Tabs and Clean PS09 Footer!');
