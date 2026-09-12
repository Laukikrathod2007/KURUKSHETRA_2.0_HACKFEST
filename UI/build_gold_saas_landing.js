const fs = require('fs');

const goldSaaSHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agentic Guardian: AI Agents for Every Risk Decision (KURUKSHETRA 2.0 // PS09)</title>
  <meta name="description" content="Agentic Guardian is an autonomous multi-agent risk decisioning platform operating across 5 domains to intercept Authorized Push Payment (APP) scams in real time.">
  
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
  
  <!-- Custom Fonts -->
  <link rel="preload" href="/fonts/HB_Set/HBSetv0.96-Light.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/Pilat/Pilat-Book.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- CSS Bundles -->
  <link rel="stylesheet" href="/_astro/index.Cc_3WQvc.css">
  <link rel="stylesheet" href="/_astro/Layout.CYu0A3dY.css">

  <style>
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      background-color: #02060d;
      color: #f8fafc;
      font-family: 'Inter', system-ui, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background-image: 
        linear-gradient(rgba(255, 215, 0, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 215, 0, 0.02) 1px, transparent 1px);
      background-size: 40px 40px;
      overflow-x: hidden;
    }

    .font-mono { font-family: 'JetBrains Mono', monospace; }

    /* Luxury Gold Gradient Text */
    .gold-gradient {
      background: linear-gradient(135deg, #ffd700 0%, #fbbf24 50%, #d97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Gold Glass Card */
    .gold-card {
      background: rgba(255, 215, 0, 0.025);
      border: 1px solid rgba(255, 215, 0, 0.15);
      border-radius: 20px;
      backdrop-filter: blur(16px);
      padding: 32px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .gold-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.45), transparent);
    }
    .gold-card:hover {
      border-color: rgba(255, 215, 0, 0.35);
      box-shadow: 0 0 35px rgba(255, 215, 0, 0.08);
      transform: translateY(-2px);
    }

    /* Metallic Gold Buttons */
    .btn-gold {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 28px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
    }
    .btn-gold-primary {
      background: linear-gradient(135deg, #ffd700, #f59e0b);
      color: #02060d;
      box-shadow: 0 0 25px rgba(255, 215, 0, 0.35);
    }
    .btn-gold-primary:hover {
      background: linear-gradient(135deg, #ffe033, #fbbf24);
      box-shadow: 0 0 35px rgba(255, 215, 0, 0.55);
      transform: translateY(-1px);
    }
    .btn-gold-outline {
      background: transparent;
      border: 1px solid rgba(255, 215, 0, 0.25);
      color: #ffd700;
    }
    .btn-gold-outline:hover {
      border-color: rgba(255, 215, 0, 0.5);
      color: #ffffff;
      background: rgba(255, 215, 0, 0.08);
    }

    /* Image Frame */
    .img-frame {
      border-radius: 16px;
      border: 1px solid rgba(255, 215, 0, 0.2);
      box-shadow: 0 0 40px rgba(255, 215, 0, 0.12);
      transition: transform 0.3s ease, border-color 0.3s ease;
    }
    .img-frame:hover {
      transform: scale(1.01);
      border-color: rgba(255, 215, 0, 0.4);
    }

    /* Infinite Marquee */
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      display: flex;
      width: 200%;
      animation: marquee 35s linear infinite;
    }
    .animate-marquee:hover {
      animation-play-state: paused;
    }
  </style>
</head>

<body>
  <!-- Fixed 3D Canvas Background (Tempo 3D Wireframe Ribbon Sphere - Pops as glowing hologram against pitch black) -->
  <canvas id="gl" data-astro-cid-lcdefpme style="position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.85;"></canvas>

  <main id="app" data-astro-cid-lcdefpme style="position: relative; z-index: 10;">
    
    <!-- ── 1. HEADER ── -->
    <header style="position: sticky; top: 0; z-index: 100; background: rgba(2, 6, 13, 0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 215, 0, 0.15);">
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 72px; display: flex; align-items: center; justify-content: space-between;">
        
        <!-- Logo -->
        <a href="/" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
          <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(255,215,0,0.12); border: 1px solid rgba(255,215,0,0.35); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(255,215,0,0.25);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div style="font-size: 16px; font-weight: 800; color: #fff; line-height: 1.2;">Agentic Guardian</div>
            <div style="font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #ffd700; letter-spacing: 0.08em;">KURUKSHETRA 2.0 // PS09</div>
          </div>
        </a>

        <!-- Navigation Links -->
        <nav style="display: flex; gap: 12px;" class="hidden md:flex">
          <a href="#overview" style="padding: 8px 14px; color: #94a3b8; font-size: 13px; font-weight: 600; text-decoration: none; transition: color 0.2s;">Overview</a>
          <a href="#agents" style="padding: 8px 14px; color: #94a3b8; font-size: 13px; font-weight: 600; text-decoration: none; transition: color 0.2s;">AI Agent Hub</a>
          <a href="#playground" style="padding: 8px 14px; color: #ffd700; font-size: 13px; font-weight: 600; text-decoration: none; transition: color 0.2s;">Scam Playground</a>
          <a href="#unified" style="padding: 8px 14px; color: #94a3b8; font-size: 13px; font-weight: 600; text-decoration: none; transition: color 0.2s;">Platform Stack</a>
        </nav>

        <!-- Right Header Actions -->
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); padding: 4px 12px; border-radius: 999px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00ff88;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 8px #00ff88;"></span>
            <span>SYSTEM LIVE</span>
          </div>
          <a href="http://localhost:3000/payment" class="btn-gold btn-gold-primary" style="padding: 9px 22px; font-size: 13px;">
            Get a Demo &rarr;
          </a>
        </div>

      </div>
    </header>

    <!-- ── 2. HERO SECTION (Image 1 Oscilar Content + Black & Gold SaaS Theme) ── -->
    <section id="overview" data-section="intro" style="padding: 90px 0 80px; min-height: 85vh; display: flex; align-items: center;">
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px; width: 100%;">
        
        <!-- Announcement Banner -->
        <div style="margin-bottom: 32px;">
          <a href="http://localhost:3000/soc-console" style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: #94a3b8; text-decoration: none; background: rgba(255,215,0,0.04); border: 1px solid rgba(255,215,0,0.2); padding: 6px 18px; border-radius: 999px;">
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #ffd700;">EX-SANTANDER COO SERGIO COSTANTINI JOINS AGENTIC GUARDIAN</span>
            <span style="color: #ffd700; font-weight: 600;">/ Read the story &rarr;</span>
          </a>
        </div>

        <div style="display: grid; grid-template-columns: 1fr;" class="lg:grid-cols-12" style="gap: 48px; align-items: center;">
          
          <!-- Hero Left Column (6 cols) -->
          <div style="max-width: 620px;">
            <h1 style="font-size: clamp(2.8rem, 5.5vw, 4.6rem); font-weight: 900; color: #fff; line-height: 1.08; margin-bottom: 24px; letter-spacing: -0.03em;">
              AI agents for <br/>
              <span class="gold-gradient">every</span> risk decision.
            </h1>
            
            <p style="color: #94a3b8; font-size: 17px; line-height: 1.7; margin-bottom: 36px;">
              Agentic Guardian is the <strong style="color: #fff;">Agentic Risk Platform</strong> for financial institutions. AI agents that handle detection, decisions, and resolution across fraud, scams, onboarding, and AML compliance. The result: <strong style="color: #ffd700;">45% fewer false positives</strong>, <strong style="color: #ffd700;">5x faster policy deployment</strong>, <strong style="color: #ffd700;">3x faster case resolution</strong>.
            </p>

            <!-- Hero Impact Metrics Badges -->
            <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 40px; font-family: 'JetBrains Mono', monospace;">
              <div style="background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.25); padding: 12px 20px; border-radius: 14px;">
                <div style="font-size: 22px; font-weight: 900; color: #ffd700;">45%</div>
                <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-top: 2px;">Fewer False Positives</div>
              </div>
              <div style="background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.25); padding: 12px 20px; border-radius: 14px;">
                <div style="font-size: 22px; font-weight: 900; color: #ffd700;">5x</div>
                <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-top: 2px;">Faster Policy Deploy</div>
              </div>
              <div style="background: rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.25); padding: 12px 20px; border-radius: 14px;">
                <div style="font-size: 22px; font-weight: 900; color: #00ff88;">&lt;15ms</div>
                <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin-top: 2px;">ML Decision Latency</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <a href="http://localhost:3000/payment" class="btn-gold btn-gold-primary">
                Get a Demo &rarr;
              </a>
              <a href="http://localhost:3000/soc-console" class="btn-gold btn-gold-outline">
                View Platform Console &rarr;
              </a>
            </div>
          </div>

          <!-- Hero Right Column: Oscilar Real-Time Dashboard UI (Image 1) -->
          <div>
            <div class="gold-card" style="padding: 24px;">
              
              <!-- Optimize Card -->
              <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,215,0,0.2); border-radius: 16px; padding: 18px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #ffd700; color: #02060d; font-size: 11px; font-weight: 900;">2</span>
                  <span style="font-size: 15px; font-weight: 800; color: #fff;">Optimize Risk Rules</span>
                </div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
                  Assess real-time performance without SQL expertise and get instant AI-powered recommendations.
                </p>
              </div>

              <!-- 3 Key Metric Stats -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px;">
                <div>
                  <div style="font-size: 22px; font-weight: 900; color: #ffd700; font-family: 'JetBrains Mono', monospace;">48</div>
                  <div style="font-size: 10px; color: #64748b; font-family: 'JetBrains Mono', monospace;">Active Risk Rules</div>
                </div>
                <div>
                  <div style="font-size: 22px; font-weight: 900; color: #00ff88; font-family: 'JetBrains Mono', monospace;">0.987</div>
                  <div style="font-size: 10px; color: #64748b; font-family: 'JetBrains Mono', monospace;">AUC-ROC Accuracy</div>
                </div>
                <div>
                  <div style="font-size: 22px; font-weight: 900; color: #ffd700; font-family: 'JetBrains Mono', monospace;">3.2 min</div>
                  <div style="font-size: 10px; color: #64748b; font-family: 'JetBrains Mono', monospace;">Avg. Alert Backlog</div>
                </div>
              </div>

              <!-- Oscilar Dashboard Screenshot Image -->
              <div style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,215,0,0.15);">
                <img src="/oscilar_site/assets/framerusercontent.com/images/2uxHmtN3tfZFmf19Nwx5UKaEtY.png" alt="Oscilar Risk Dashboard" style="width: 100%; height: 220px; object-fit: cover; display: block;" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ── 3. INSTITUTIONAL TRUST & 3 METRIC CARDS (Image 4) ── -->
    <section data-section="animation-1" style="padding: 80px 0; background: rgba(0,0,0,0.5); border-top: 1px solid rgba(255,215,0,0.1); border-bottom: 1px solid rgba(255,215,0,0.1);">
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px;">
        
        <div style="text-align: center; margin-bottom: 48px;">
          <p style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #ffd700; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px;">
            Trusted by institutions building next-gen finance
          </p>
          <div style="display: flex; gap: 40px; justify-content: center; align-items: center; flex-wrap: wrap; opacity: 0.85;">
            <img src="/oscilar_site/assets/framerusercontent.com/images/36Em3pUVwXOSujFngi6399HJtM.svg" alt="nuvei" style="height: 24px; filter: brightness(0) invert(1);" />
            <img src="/oscilar_site/assets/framerusercontent.com/images/Ar6CaEqrSqd9tIYIK1txxWU3Ya8.svg" alt="dLocal" style="height: 24px; filter: brightness(0) invert(1);" />
            <img src="/oscilar_site/assets/framerusercontent.com/images/DghvLYvvL1S2WsBpyWl2klw.svg" alt="Amerant" style="height: 24px; filter: brightness(0) invert(1);" />
            <img src="/oscilar_site/assets/framerusercontent.com/images/EnJxMxE9MnDIYB7u9JeHWkdJJyM.svg" alt="Dave" style="height: 24px; filter: brightness(0) invert(1);" />
            <img src="/oscilar_site/assets/framerusercontent.com/images/KFV8dELznOMlqElDwmXRAclm9k.svg" alt="Curve" style="height: 24px; filter: brightness(0) invert(1);" />
            <img src="/oscilar_site/assets/framerusercontent.com/images/qZCq2rIEtRjxY17nRYS2SHoQPEY.svg" alt="Coast" style="height: 24px; filter: brightness(0) invert(1);" />
            <img src="/oscilar_site/assets/framerusercontent.com/images/zUwnQRmes4izZRc0qMi0uu9JY8.svg" alt="Taskrabbit" style="height: 24px; filter: brightness(0) invert(1);" />
          </div>
        </div>

        <!-- 3 Metric Impact Cards (Image 4) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          
          <div class="gold-card">
            <div style="font-size: 20px; font-weight: 800; margin-bottom: 12px; color: #fff;">nuvei</div>
            <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px; line-height: 1.5;">
              Nuvei cut manual scam underwriting time by 50%
            </p>
            <div style="font-size: 48px; font-weight: 900; color: #ffd700; font-family: 'JetBrains Mono', monospace;">50%</div>
          </div>

          <div class="gold-card">
            <div style="font-size: 20px; font-weight: 800; margin-bottom: 12px; color: #fff;">SoFi ❖</div>
            <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px; line-height: 1.5;">
              SoFi increased transaction processing speed by over 30%
            </p>
            <div style="font-size: 48px; font-weight: 900; color: #ffd700; font-family: 'JetBrains Mono', monospace;">30%+</div>
          </div>

          <div class="gold-card">
            <div style="font-size: 20px; font-weight: 800; margin-bottom: 12px; color: #fff;">❖ CLARA</div>
            <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px; line-height: 1.5;">
              Clara boosts client onboarding security times by 3x
            </p>
            <div style="font-size: 48px; font-weight: 900; color: #ffd700; font-family: 'JetBrains Mono', monospace;">3x</div>
          </div>

        </div>

      </div>
    </section>

    <!-- ── 4. MULTI-AGENT REASONING STUDIO (Oscilar UI Showcase 1) ── -->
    <section id="agents" data-section="animation-2" style="padding: 120px 0;">
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px;">
        
        <div style="text-align: center; margin-bottom: 60px;">
          <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 999px; background: rgba(255,215,0,0.08); border: 1px solid rgba(255,215,0,0.25); margin-bottom: 16px;">
            <span style="font-size: 11px; font-weight: 700; color: #ffd700; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase;">
              DOMAIN 3 // PARALLEL MULTI-AGENT CONSENSUS
            </span>
          </div>
          <h2 style="font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 16px;">
            Four Specialized AI Agents <br/>
            <span class="gold-gradient">Reasoning in Parallel</span>
          </h2>
          <p style="color: #94a3b8; font-size: 16px; max-width: 620px; margin: 0 auto; line-height: 1.7;">
            While LightGBM handles instant hot-path GBDT scoring, our LangGraph multi-agent cluster analyzes contextual memos, recipient graphs, and behavioral anomalies concurrently.
          </p>
        </div>

        <!-- Oscilar Multi-Agent Screenshot Image -->
        <div class="gold-card" style="padding: 24px; margin-bottom: 48px;">
          <img src="/oscilar_site/assets/framerusercontent.com/images/2uLDEOyZiyf2xsENUPQzoKe3NMA.png" alt="Multi-Agent Execution Canvas" class="img-frame" style="width: 100%; height: auto; display: block;" />
        </div>

      </div>
    </section>

    <!-- ── 5. INTERACTIVE SCAM PLAYGROUND ── -->
    <section id="playground" data-section="animation-3" style="padding: 100px 0; background: rgba(0,0,0,0.6); border-top: 1px solid rgba(255,215,0,0.12); border-bottom: 1px solid rgba(255,215,0,0.12);">
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px;">
        
        <div style="text-align: center; margin-bottom: 50px;">
          <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 999px; background: rgba(255,215,0,0.08); border: 1px solid rgba(255,215,0,0.25); margin-bottom: 16px;">
            <span style="font-size: 11px; font-weight: 700; color: #ffd700; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase;">
              INTERACTIVE AI SCAM INTERCEPTOR DEMO
            </span>
          </div>
          <h2 style="font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 16px;">
            Test Real-World Attack Scenarios <span class="gold-gradient">Live</span>
          </h2>
          <p style="color: #94a3b8; font-size: 16px; max-width: 600px; margin: 0 auto; line-height: 1.7;">
            Select an attack vector below to see how our multi-agent risk engine scores risk, parses NLP memos, checks mule graphs, and issues instantaneous directives.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr;" class="lg:grid-cols-12" style="gap: 32px; align-items: start;">
          
          <!-- Scenario Selectors (5 Cols) -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <p style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">
              SELECT SCAM VECTOR TO EVALUATE:
            </p>

            <button id="scen-1" onclick="selectScenario(1)" style="text-align: left; background: rgba(255,45,85,0.12); border: 1px solid rgba(255,45,85,0.5); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.boxShadow='0 0 25px rgba(255,45,85,0.25)'" onmouseout="this.style.boxShadow='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 15px; font-weight: 700; color: #fff;">1. Urgent Authority Impersonation</span>
                <span style="background: rgba(255,45,85,0.2); color: #ff2d55; border: 1px solid rgba(255,45,85,0.4); font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">CRITICAL SCAM</span>
              </div>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">
                "Transfer $2,450 to Customs Officer Account within 15 mins to prevent arrest"
              </p>
            </button>

            <button id="scen-2" onclick="selectScenario(2)" style="text-align: left; background: rgba(255,170,0,0.04); border: 1px solid rgba(255,170,0,0.2); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.boxShadow='0 0 25px rgba(255,170,0,0.25)'" onmouseout="this.style.boxShadow='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 15px; font-weight: 700; color: #fff;">2. High-Velocity Mule Account</span>
                <span style="background: rgba(255,170,0,0.2); color: #ffaa00; border: 1px solid rgba(255,170,0,0.4); font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">HIGH RISK</span>
              </div>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">
                First-time payee account created 3 hours ago with 14 rapid incoming payments
              </p>
            </button>

            <button id="scen-3" onclick="selectScenario(3)" style="text-align: left; background: rgba(0,255,136,0.04); border: 1px solid rgba(0,255,136,0.2); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.boxShadow='0 0 25px rgba(0,255,136,0.25)'" onmouseout="this.style.boxShadow='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 15px; font-weight: 700; color: #fff;">3. Recurrent Monthly Transfer</span>
                <span style="background: rgba(0,255,136,0.2); color: #00ff88; border: 1px solid rgba(0,255,136,0.4); font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">LEGITIMATE</span>
              </div>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">
                $150 rent contribution to known contacts list item (12th recurrent payment)
              </p>
            </button>
          </div>

          <!-- Interactive Visual Card (7 Cols) -->
          <div class="gold-card" style="box-shadow: 0 0 40px rgba(255,215,0,0.08);">
            
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; margin-bottom: 20px;">
              <div>
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #64748b; text-transform: uppercase;">POLICY DIRECTIVE</span>
                <h3 id="res-directive" style="font-size: 24px; font-weight: 900; color: #ff2d55; margin-top: 2px; font-family: 'JetBrains Mono', monospace;">
                  DIRECTIVE: BLOCK
                </h3>
              </div>
              <div style="text-align: right;">
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #64748b; text-transform: uppercase;">RISK SCORE</span>
                <div id="res-score" style="font-size: 28px; font-weight: 900; color: #ff2d55; font-family: 'JetBrains Mono', monospace;">
                  96 / 100
                </div>
              </div>
            </div>

            <!-- Oscilar UI Screenshot -->
            <div style="border: 1px solid rgba(255,215,0,0.15); border-radius: 12px; overflow: hidden; margin-bottom: 20px; background: #000;">
              <img id="res-img" src="/oscilar_site/assets/framerusercontent.com/images/2uxHmtN3tfZFmf19Nwx5UKaEtY.png" alt="Oscilar Risk Gauge UI" style="width: 100%; height: 200px; object-fit: cover; opacity: 0.9;" />
            </div>

            <div style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,215,0,0.15); border-radius: 12px; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #e2e8f0; line-height: 1.6;">
              <div style="color: #ffd700; font-size: 10px; margin-bottom: 6px;">&gt; AGENTIC REASONING TRACE:</div>
              <p id="res-log" style="margin: 0; color: #94a3b8;">
                [Intent Agent] Flagged coercive language: "customs fee" + "avoid arrest"<br/>
                [Recipient Agent] Payee account created &lt;24h ago with high velocity transfers<br/>
                [Policy Gatekeeper] Override rule R-04 triggered &rarr; Transaction Aborted before settlement.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- ── 6. UNIFIED 3D STACK ARCHITECTURE SECTION (Image 5 Oscilar Content) ── -->
    <section id="unified" data-section="animation-4" style="padding: 120px 0;">
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px;">
        
        <div style="display: grid; grid-template-columns: 1fr;" class="lg:grid-cols-12" style="gap: 48px; align-items: center;">
          
          <div class="lg:col-span-6">
            <h2 style="font-size: clamp(2.2rem, 4vw, 3.4rem); font-weight: 900; color: #fff; line-height: 1.12; margin-bottom: 20px;">
              The unified platform that <br/>
              <span class="gold-gradient">sees the full picture.</span>
            </h2>
            <p style="font-size: 16px; color: #94a3b8; line-height: 1.7; margin-bottom: 32px; max-width: 520px;">
              Monitor the entire payment journey in one place, from onboarding, to login, to payments, to compliance—and everything in between. The only platform built from the ground up to see the holistic risk picture and stay ahead of emerging threats.
            </p>
            <div style="display: flex; gap: 14px;">
              <a href="http://localhost:3000/payment" class="btn-gold btn-gold-primary">
                Get a Demo &rarr;
              </a>
              <a href="http://localhost:3000/soc-console" class="btn-gold btn-gold-outline">
                See the Platform &rarr;
              </a>
            </div>
          </div>

          <div class="lg:col-span-6" style="display: flex; gap: 32px; align-items: center;">
            <div style="flex: 1;">
              <img src="/oscilar_site/assets/framerusercontent.com/images/GJInoaZ3aGo8vWK59cuCes6bn0.png" alt="Oscilar Unified 3D Architecture Stack" class="img-frame" style="width: 100%; height: auto; display: block;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 28px; font-family: 'JetBrains Mono', monospace;">
              <div>
                <div style="font-size: 32px; font-weight: 900; color: #ffd700;">30B+</div>
                <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">DECISIONS PROCESSED PER YEAR</div>
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 900; color: #ffd700;">120K+</div>
                <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">REQUESTS PER SECOND</div>
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 900; color: #00ff88;">&lt;15ms</div>
                <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">ML DECISION LATENCY</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- ── 7. FOOTER ── -->
    <footer style="padding: 60px 0 40px; background: rgba(0,0,0,0.8); border-top: 1px solid rgba(255,215,0,0.12);">
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px; display: flex; flex-direction: column; gap: 32px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #fff;">Agentic Guardian</div>
            <div style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #ffd700; margin-top: 4px;">
              KURUKSHETRA 2.0 // PS09 — Team Midnight Ciphers
            </div>
          </div>

          <div style="display: flex; gap: 16px;">
            <a href="http://localhost:3000/payment" class="btn-gold btn-gold-primary" style="padding: 10px 24px; font-size: 13px;">
              Launch Payment Simulator
            </a>
            <a href="http://localhost:3000/soc-console" class="btn-gold btn-gold-outline" style="padding: 10px 24px; font-size: 13px;">
              Open SOC Console
            </a>
          </div>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b;">
          <span>&copy; 2026 Agentic Guardian // KURUKSHETRA 2.0 Hackfest Submission</span>
          <span style="color: #00ff88;">● 114 Telemetry Dimensions Active</span>
        </div>

      </div>
    </footer>

  </main>

  <!-- Interactive Scam Playground JS -->
  <script>
    function selectScenario(scen) {
      const s1 = document.getElementById('scen-1');
      const s2 = document.getElementById('scen-2');
      const s3 = document.getElementById('scen-3');
      
      const dir = document.getElementById('res-directive');
      const score = document.getElementById('res-score');
      const img = document.getElementById('res-img');
      const log = document.getElementById('res-log');

      [s1, s2, s3].forEach(s => {
        s.style.borderColor = 'rgba(255,255,255,0.1)';
        s.style.background = 'rgba(255,255,255,0.02)';
      });

      if (scen === 1) {
        s1.style.borderColor = 'rgba(255,45,85,0.6)';
        s1.style.background = 'rgba(255,45,85,0.12)';
        dir.innerText = 'DIRECTIVE: BLOCK';
        dir.style.color = '#ff2d55';
        score.innerText = '96 / 100';
        score.style.color = '#ff2d55';
        img.src = '/oscilar_site/assets/framerusercontent.com/images/2uxHmtN3tfZFmf19Nwx5UKaEtY.png';
        log.innerHTML = '[Intent Agent] Flagged coercive language: "customs fee" + "avoid arrest"<br/>[Recipient Agent] Payee account created &lt;24h ago with high velocity transfers<br/>[Policy Gatekeeper] Override rule R-04 triggered &rarr; Transaction Aborted before settlement.';
      } else if (scen === 2) {
        s2.style.borderColor = 'rgba(255,170,0,0.6)';
        s2.style.background = 'rgba(255,170,0,0.12)';
        dir.innerText = 'DIRECTIVE: CHALLENGE';
        dir.style.color = '#ffaa00';
        score.innerText = '74 / 100';
        score.style.color = '#ffaa00';
        img.src = '/oscilar_site/assets/framerusercontent.com/images/3u5gKkgdIwhvwqHSF4qvOh4qBU.png';
        log.innerHTML = '[Transaction Agent] Amount is 4.2x user 30-day moving average<br/>[Recipient Agent] Mule Graph indicates potential money funnel node<br/>[Policy Gatekeeper] Directive: CHALLENGE &rarr; Voice Guardian + Biometric Dwell Gate engaged.';
      } else if (scen === 3) {
        s3.style.borderColor = 'rgba(0,255,136,0.6)';
        s3.style.background = 'rgba(0,255,136,0.12)';
        dir.innerText = 'DIRECTIVE: ALLOW';
        dir.style.color = '#00ff88';
        score.innerText = '4 / 100';
        score.style.color = '#00ff88';
        img.src = '/oscilar_site/assets/framerusercontent.com/images/GJInoaZ3aGo8vWK59cuCes6bn0.png';
        log.innerHTML = '[Intent Agent] No urgency or threat keywords in payment memo<br/>[Recipient Agent] Verified recurrent payee with 12 prior successful transfers<br/>[Policy Gatekeeper] Directive: ALLOW &rarr; Fast-track payment cleared in 14.2ms.';
      }
    }
  </script>

  <!-- Astro / Three.js 3D Wireframe Ribbon Sphere Script Bundles -->
  <script type="module" src="/_astro/main.BWQdUeit.js"></script>
  <script type="module" src="/_astro/SmoothMouse.DDz9qNYp.js"></script>
  <script type="module" src="/_astro/ShapeScene.Db3z1nlR.js"></script>
  <script type="module" src="/_astro/ScrollTrigger.brc2lzcB.js"></script>
  <script type="module" src="/_astro/gsap.Bi_c5vh2.js"></script>
  <script type="module" src="/_astro/lenis.BLzYG_9N.js"></script>
  <script type="module" src="/_astro/index.astro_astro_type_script_index_0_lang.5Yvueq_s.js"></script>
</body>
</html>
`;

fs.writeFileSync('index.html', goldSaaSHTML, 'utf8');
console.log('Successfully written Black & Gold Luxury SaaS landing page into index.html!');
