import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ArrowDown, Zap, Eye, Lock, Brain, ChevronRight, Terminal, Activity } from 'lucide-react'
import MorphingShield from '../components/MorphingShield'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Stage definitions ─────────────────────────────────────────── */
const STAGES = [
  {
    progress: [0, 0.5],
    shape:    'Sphere',
    domain:   'Domain 1 & 2',
    title:    'Risk Analysis',
    subtitle: 'ML Hot-Path Engine',
    desc:     '114-feature LightGBM GBDT scores payment risk vectors in under 15ms. Hard deterministic overrides protect against confirmed mule accounts instantly.',
    color:    '#00d4ff',
    glow:     'rgba(0, 212, 255, 0.25)',
  },
  {
    progress: [0.5, 1.0],
    shape:    'TorusKnot',
    domain:   'Domain 3 & 4',
    title:    'Agentic Consensus',
    subtitle: 'Multi-Agent LLM Reasoning',
    desc:     'Intent Agent, Transaction Agent, and Recipient Agent reason in parallel via LangGraph. The Policy Gatekeeper emits exactly one of five deterministic directives.',
    color:    '#a855f7',
    glow:     'rgba(168, 85, 247, 0.25)',
  },
]

function useHeroProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '#hero-scroll-container',
      start:   'top top',
      end:     'bottom bottom',
      scrub:   true,
      onUpdate: (self) => setProgress(self.progress),
    })
    return () => st.kill()
  }, [])

  return progress
}

export default function Hero() {
  const progress = useHeroProgress()

  const stage = STAGES.find(s => progress >= s.progress[0] && progress < s.progress[1])
             || STAGES[STAGES.length - 1]

  return (
    <>
      {/* ────────────────────────────────────────────────────────────
          SCROLL CONTAINER — 300vh tall, drives the animation
      ──────────────────────────────────────────────────────────── */}
      <div id="hero-scroll-container" style={{ height: '300vh', position: 'relative' }}>
        {/* Sticky viewport */}
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* ── 3D Canvas (full bg) ── */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <MorphingShield scrollContainerId="hero-scroll-container" />
          </div>

          {/* ── Radial darkening overlay ── */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 15%, rgba(2,8,20,0.7) 65%, #020814 90%)',
            pointerEvents: 'none',
          }} />

          {/* ── Edge vignettes ── */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, #020814 0%, transparent 15%, transparent 85%, #020814 100%)',
          }} />

          {/* ── TOP-LEFT: Glassy stage readout card ── */}
          <div style={{
            position: 'absolute', top: '5.5rem', left: '2rem',
            maxWidth: '400px', zIndex: 10,
            background: 'rgba(2, 8, 20, 0.75)',
            border: `1px solid ${stage.color}40`,
            borderRadius: '16px',
            backdropFilter: 'blur(16px)',
            padding: '24px',
            boxShadow: `0 0 30px ${stage.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '4px 12px', borderRadius: '999px',
              border: `1px solid ${stage.color}50`,
              background: `${stage.color}15`,
              marginBottom: '14px',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: stage.color,
                boxShadow: `0 0 8px ${stage.color}`,
              }} />
              <span style={{
                fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: stage.color, fontFamily: 'JetBrains Mono, monospace',
              }}>
                {stage.domain} — {stage.subtitle}
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800, color: '#fff',
              lineHeight: 1.1, margin: 0,
            }}>
              {stage.title}
            </h2>

            <p style={{
              marginTop: '12px',
              color: '#94a3b8',
              fontSize: '13px',
              lineHeight: 1.65,
            }}>
              {stage.desc}
            </p>

            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: stage.color,
              opacity: 0.8,
              marginTop: 14,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <span>&gt; {stage.title.toLowerCase().replace(/\s+/g, '_')}.execute()</span>
              <span className="animate-blink">_</span>
            </div>
          </div>

          {/* ── TOP-RIGHT: Geometry Status HUD ── */}
          <div style={{
            position: 'absolute', top: '5.5rem', right: '2rem',
            textAlign: 'right', zIndex: 10,
            background: 'rgba(2, 8, 20, 0.75)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            backdropFilter: 'blur(16px)',
            padding: '16px 20px',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            <p style={{ color: '#64748b', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
              ACTIVE_GEOMETRY
            </p>
            <p style={{ color: stage.color, fontSize: '16px', fontWeight: 700 }}>
              {stage.shape}
            </p>
            <div style={{ marginTop: 8, fontSize: '10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#00ff88' }}>● PROTOCOL: ONLINE</span>
              <span style={{ color: '#00d4ff' }}>● VIEW_OFFSET: RIGHT-ALIGNED</span>
            </div>
          </div>

          {/* ── CENTER: Main hero title (visible at top of scroll) ── */}
          <div style={{
            position: 'relative', zIndex: 10,
            textAlign: 'center', pointerEvents: progress > 0.15 ? 'none' : 'auto',
            opacity: Math.max(0, 1 - progress * 4.5),
            transform: `translateY(${-progress * 60}px)`,
            transition: 'opacity 0.2s, transform 0.2s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <img src="/paykavach-icon.png" alt="PayKavach Logo" style={{ height: 72, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.4))' }} />
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999,
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              marginBottom: 20,
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.15)',
            }}>
              <Lock size={13} color="#00d4ff" />
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#00d4ff',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                KURUKSHETRA 2.0 // PS09
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 5.8rem)',
              fontWeight: 900, color: '#fff',
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: '-0.03em',
            }}>
              Pay
              <br />
              <span className="gradient-text">
                Kavach
              </span>
            </h1>

            <p style={{
              marginTop: 18, color: '#94a3b8',
              fontSize: 16, maxWidth: 520, margin: '18px auto 0',
              lineHeight: 1.6,
            }}>
              Autonomous, Real-Time Payment Scam Interception with Multi-Agent AI Consensus
            </p>

            {/* Quick Metrics */}
            <div style={{
              display: 'flex', gap: 24, marginTop: 24, justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {[
                { val: '<15ms', label: 'ML Decision' },
                { val: '99.2%', label: 'Recall Rate' },
                { val: '4 Agents', label: 'Consensus' },
              ].map((m, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-black/40 px-4 py-2">
                  <div className="text-base font-bold text-white">{m.val}</div>
                  <div className="text-[10px] text-neon-cyan uppercase tracking-wider">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 32 }}>
              <Link
                to="/payment"
                className="btn btn-primary no-underline text-sm shadow-[0_0_25px_rgba(0,212,255,0.35)]"
                style={{ padding: '12px 28px' }}
              >
                <Shield size={16} className="mr-2" />
                Launch Payment Simulator
              </Link>
              <Link
                to="/"
                className="btn btn-outline no-underline text-sm"
                style={{ padding: '12px 28px' }}
              >
                <Eye size={16} className="mr-2" />
                Security Dashboard
              </Link>
            </div>
          </div>

          {/* ── BOTTOM-CENTER: Scroll Indicator & Progress ── */}
          <div style={{
            position: 'absolute', bottom: '2.5rem',
            left: '50%', transform: 'translateX(-50%)',
            width: '240px', zIndex: 10, textAlign: 'center',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: 6, fontFamily: 'JetBrains Mono, monospace',
            }}>
              {['01 RISK', '02 AGENTS'].map((s, i) => (
                <span key={i} style={{ fontSize: '10px', color: '#64748b' }}>
                  {s}
                </span>
              ))}
            </div>

            <div style={{
              width: '100%', height: 3,
              background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress * 100}%`,
                background: 'linear-gradient(to right, #00d4ff, #a855f7, #00ff88)',
                borderRadius: 99,
                transition: 'width 0.1s linear',
              }} />
            </div>

            {progress < 0.04 && (
              <div style={{
                marginTop: 18, color: '#64748b',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>scroll to explore</span>
                <ArrowDown size={14} className="animate-bounce" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          CONTENT AFTER THE 3D SCROLL SECTION: DEFENSE PIPELINE
      ──────────────────────────────────────────────────────────── */}
      <div style={{ background: '#020814', position: 'relative', zIndex: 10, paddingTop: '5rem' }}>
        {/* Section Header */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 2.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999,
            background: 'rgba(0, 212, 255, 0.08)',
            border: '1px solid rgba(0, 212, 255, 0.25)',
            marginBottom: 18,
          }}>
            <Terminal size={13} color="#00d4ff" />
            <span style={{ fontSize: 11, color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>
              FIVE DEFENSE DOMAINS
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 14 }}>
            Five Specialized Domains.
            <span className="gradient-text"> Instant Interception.</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, maxWidth: 540, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Transactions are evaluated concurrently across behavioral vectors, NLP urgency scans, and graph mule checks.
          </p>
        </section>

        {/* 5 Domain Connected Cards */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 6rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { icon: Shield, num: 'D1', title: 'Simulation', color: '#00d4ff', desc: 'Realistic payment canvas with recipient verification panel' },
              { icon: Zap,    num: 'D2', title: 'ML Hot-Path', color: '#ffaa00', desc: '114-feature LightGBM GBDT scoring under 15ms' },
              { icon: Brain,  num: 'D3', title: 'AI Agents',   color: '#a855f7', desc: 'LangGraph multi-agent parallel reasoning' },
              { icon: Lock,   num: 'D4', title: 'Gatekeeper',  color: '#ff2d55', desc: 'Policy directives: ALLOW / ADVISE / CHALLENGE / PAUSE / BLOCK' },
              { icon: Eye,    num: 'D5', title: 'Intervention',color: '#00ff88', desc: 'Cognitive dwell gate + explainability + audit trail' },
            ].map((d, i) => {
              const Icon = d.icon
              return (
                <div
                  key={i}
                  className="card relative overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.025)',
                    borderColor: `${d.color}25`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${d.color}50`
                    e.currentTarget.style.boxShadow = `0 0 25px ${d.color}15`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${d.color}25`
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                    background: `linear-gradient(90deg, transparent, ${d.color}50, transparent)`,
                  }} />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${d.color}15`, color: d.color }}>
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-xs font-bold" style={{ color: d.color }}>{d.num}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{d.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{d.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Bottom Simulator Prompt */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 2rem 8rem', textAlign: 'center' }}>
          <div className="card p-10 border border-neon-cyan/20 bg-neon-cyan/[0.02]">
            <h3 className="text-2xl font-bold text-white mb-3">Experience Scam Interception Live</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Test suspicious payee notes, urgent impersonation prompts, and mule account transfers against the multi-agent pipeline.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/payment" className="btn btn-primary no-underline text-sm">
                <Shield size={16} className="mr-2" />
                Open Payment Simulator
              </Link>
              <Link to="/soc-console" className="btn btn-outline no-underline text-sm">
                <Terminal size={16} className="mr-2" />
                View SOC Console
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
