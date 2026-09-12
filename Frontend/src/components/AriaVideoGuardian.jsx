/**
 * AriaVideoGuardian.jsx
 * ─────────────────────────────────────────────────────────────────
 * Demo-mode TruGen AI Video Avatar simulation
 * Shows a realistic AI avatar with animated speaking, lip-sync effect,
 * live transcript, and context-aware responses based on the risk dossier.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from 'react'
import { X, Mic, MicOff, Volume2, VolumeX, Shield, AlertTriangle, PhoneCall } from 'lucide-react'

/* ── Context-aware Aria scripts based on risk level ─────────────── */
const ARIA_SCRIPTS = {
  HIGH: [
    { speaker: 'aria', text: "Hello, I'm Aria — your Payment Security Guardian. I've temporarily paused your transfer of ₹{amount} to {recipient} because our system detected high-risk scam indicators." },
    { speaker: 'aria', text: "Our AI found urgency language in your payment note and this is a first-time recipient. These are two of the top three warning signs of a payment scam." },
    { speaker: 'aria', text: "Can I ask — did someone contact you and ask you to make this payment urgently? Maybe over a call or WhatsApp?" },
    { speaker: 'user', text: "Yes, they said it was urgent..." },
    { speaker: 'aria', text: "That urgency is the scam. Legitimate payments never require rushing. Scammers create pressure to stop you from thinking clearly. Your money is completely safe right now — it has not left your account." },
    { speaker: 'aria', text: "I strongly recommend you do NOT proceed with this transfer. Would you like me to block this transaction and report the recipient?" },
  ],
  CRITICAL: [
    { speaker: 'aria', text: "Hello {name}, this is Aria — your emergency Payment Guardian. I've immediately blocked your transfer of ₹{amount} to {recipient}. This matches a known scam pattern with 95% confidence." },
    { speaker: 'aria', text: "Our system detected: urgency coercion, an unverified recipient, and an amount 10x your normal transactions — all three critical red flags firing simultaneously." },
    { speaker: 'aria', text: "I need to ask you directly — is someone on a call with you right now telling you to make this payment?" },
    { speaker: 'user', text: "They said police will come if I don't pay..." },
    { speaker: 'aria', text: "Stop. This is a Digital Arrest scam. The police NEVER collect fines over UPI or phone. This person is a criminal impersonating law enforcement. Please hang up their call immediately." },
    { speaker: 'aria', text: "Your money is safe. I've blocked this transaction. Would you like me to also call your registered emergency contact and report this to the Cyber Crime helpline 1930?" },
  ],
  MEDIUM: [
    { speaker: 'aria', text: "Hi {name}, I'm Aria from your payment security team. I've put a brief hold on your payment of ₹{amount} to {recipient} — just want to make sure this is intentional." },
    { speaker: 'aria', text: "This appears to be your first time paying this recipient. That's not necessarily a problem, but I want to confirm you actually know this person or business." },
    { speaker: 'aria', text: "Can you confirm how you know this recipient and why you're sending this amount today?" },
    { speaker: 'user', text: "Yes, it's my friend's new account." },
    { speaker: 'aria', text: "Perfect, thank you for confirming. I'll release the transaction. For future reference, you can add trusted contacts to your safe list to skip these checks." },
  ],
  LOW: [
    { speaker: 'aria', text: "Hi {name}, quick check from Aria — your payment guardian. Your transfer of ₹{amount} looks routine, just confirming you initiated this intentionally." },
    { speaker: 'aria', text: "Everything looks good on our end. Shall I go ahead and approve this transaction?" },
  ]
}

/* ── Talking animation frames ───────────────────────────────────── */
const MOUTH_STATES = ['😶', '🙂', '😮', '🙂', '😶', '😯', '🙂']

export default function AriaVideoGuardian({ riskLevel = 'HIGH', amount = '50,000', recipient = 'Unknown', name = 'User', onClose }) {
  const [phase, setPhase] = useState('connecting') // connecting → live → ended
  const [messages, setMessages] = useState([])
  const [currentScript, setCurrentScript] = useState([])
  const [scriptIndex, setScriptIndex] = useState(0)
  const [isAriaTyping, setIsAriaTyping] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isUserMuted, setIsUserMuted] = useState(true)
  const [mouthFrame, setMouthFrame] = useState(0)
  const [isTalking, setIsTalking] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const chatRef = useRef(null)
  const timerRef = useRef(null)

  /* ── Init ── */
  useEffect(() => {
    // Pick script based on risk level
    const script = ARIA_SCRIPTS[riskLevel] || ARIA_SCRIPTS.HIGH
    // Interpolate {amount}, {recipient}, {name}
    const filled = script.map(s => ({
      ...s,
      text: s.text
        .replace('{amount}', amount)
        .replace('{recipient}', recipient)
        .replace('{name}', name)
    }))
    setCurrentScript(filled)

    // Simulate connection delay
    setTimeout(() => {
      setPhase('live')
      setElapsed(0)
      startTimer()
      playNextLine(filled, 0)
    }, 2500)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsed(e => e + 1)
    }, 1000)
  }

  /* ── Auto-play script line by line ── */
  const playNextLine = (script, idx) => {
    if (idx >= script.length) return

    const line = script[idx]
    const delay = idx === 0 ? 500 : 1200

    setTimeout(() => {
      if (line.speaker === 'aria') {
        setIsAriaTyping(true)
        // Typing delay proportional to message length
        const typingTime = Math.min(line.text.length * 28, 3000)
        setTimeout(() => {
          setIsAriaTyping(false)
          setMessages(prev => [...prev, line])
          setIsTalking(true)
          // Talking duration
          const talkTime = Math.min(line.text.length * 45, 6000)
          setTimeout(() => {
            setIsTalking(false)
            setScriptIndex(idx + 1)
            // Auto-play next after pause
            if (script[idx + 1]) {
              playNextLine(script, idx + 1)
            }
          }, talkTime)
        }, typingTime)
      } else {
        // User line — show after brief pause
        setTimeout(() => {
          setMessages(prev => [...prev, line])
          setScriptIndex(idx + 1)
          if (script[idx + 1]) {
            playNextLine(script, idx + 1)
          }
        }, 800)
      }
    }, delay)
  }

  /* ── Mouth animation ── */
  useEffect(() => {
    if (!isTalking) return
    const interval = setInterval(() => {
      setMouthFrame(f => (f + 1) % MOUTH_STATES.length)
    }, 120)
    return () => clearInterval(interval)
  }, [isTalking])

  /* ── Auto scroll chat ── */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isAriaTyping])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const getRiskColor = () => {
    if (riskLevel === 'CRITICAL') return '#ef4444'
    if (riskLevel === 'HIGH') return '#f59e0b'
    if (riskLevel === 'MEDIUM') return '#0ea5e9'
    return '#22c55e'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: 960,
        height: '90vh', maxHeight: 700,
        background: '#0f172a',
        borderRadius: 20,
        border: '1px solid #1e293b',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: '0 0 80px rgba(14,165,233,0.15)',
      }}>

        {/* ── LEFT: Video Avatar Panel ── */}
        <div style={{
          width: '45%', background: '#020617',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          borderRight: '1px solid #1e293b',
        }}>
          {/* Connection overlay */}
          {phase === 'connecting' && (
            <div style={{
              position: 'absolute', inset: 0,
              background: '#020617',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', zIndex: 10,
              gap: 16,
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                border: '3px solid #0ea5e9',
                borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ color: '#64748b', fontSize: 14 }}>Connecting to Aria...</p>
            </div>
          )}

          {/* Avatar */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            {/* Glow ring when talking */}
            {isTalking && (
              <div style={{
                position: 'absolute', inset: -12,
                borderRadius: '50%',
                border: `2px solid ${getRiskColor()}`,
                animation: 'pulseRing 1s ease infinite',
              }} />
            )}

            {/* Avatar circle */}
            <div style={{
              width: 140, height: 140,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 60,
              boxShadow: isTalking ? `0 0 40px ${getRiskColor()}44` : 'none',
              transition: 'box-shadow 0.3s',
            }}>
              {phase === 'live' ? (isTalking ? MOUTH_STATES[mouthFrame] : '🤖') : '🤖'}
            </div>

            {/* Live indicator */}
            {phase === 'live' && (
              <div style={{
                position: 'absolute', bottom: 8, right: 8,
                width: 14, height: 14, borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #020617',
                boxShadow: '0 0 8px #22c55e',
                animation: 'pulse 1.5s infinite',
              }} />
            )}
          </div>

          {/* Name + status */}
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>Aria</p>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Payment Security Guardian</p>

          {/* Timer */}
          {phase === 'live' && (
            <div style={{
              marginTop: 12,
              padding: '4px 12px',
              background: '#1e293b',
              borderRadius: 999,
              fontSize: 12,
              color: '#94a3b8',
              fontFamily: 'monospace',
            }}>
              {formatTime(elapsed)}
            </div>
          )}

          {/* Risk badge */}
          <div style={{
            marginTop: 16,
            padding: '6px 16px',
            borderRadius: 999,
            background: `${getRiskColor()}18`,
            border: `1px solid ${getRiskColor()}44`,
            fontSize: 12, fontWeight: 700,
            color: getRiskColor(),
            letterSpacing: '0.1em',
          }}>
            {riskLevel} RISK
          </div>

          {/* Controls */}
          <div style={{
            position: 'absolute', bottom: 24,
            display: 'flex', gap: 12,
          }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: isMuted ? '#ef4444' : '#1e293b',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >
              {isMuted ? <VolumeX size={18} color="#fff" /> : <Volume2 size={18} color="#94a3b8" />}
            </button>

            <button
              onClick={() => setIsUserMuted(!isUserMuted)}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: isUserMuted ? '#1e293b' : '#22c55e',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isUserMuted ? <MicOff size={18} color="#64748b" /> : <Mic size={18} color="#fff" />}
            </button>

            <button
              onClick={onClose}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#ef4444',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <PhoneCall size={18} color="#fff" />
            </button>
          </div>
        </div>

        {/* ── RIGHT: Chat + Context Panel ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1e293b',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>Security Briefing</p>
              <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>
                ₹{amount} → {recipient}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none',
                cursor: 'pointer', padding: 8,
              }}
            >
              <X size={18} color="#475569" />
            </button>
          </div>

          {/* Risk context bar */}
          <div style={{
            margin: 12,
            padding: '10px 14px',
            background: `${getRiskColor()}10`,
            border: `1px solid ${getRiskColor()}30`,
            borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <AlertTriangle size={16} color={getRiskColor()} />
            <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>
              Transaction paused — Aria is reviewing your security incident in real time
            </p>
          </div>

          {/* Chat transcript */}
          <div
            ref={chatRef}
            style={{
              flex: 1, overflowY: 'auto',
              padding: '0 16px 16px',
              scrollBehavior: 'smooth',
            }}
          >
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.speaker === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 12,
                animation: 'slideUp 0.3s ease',
              }}>
                {msg.speaker === 'aria' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, marginRight: 8, flexShrink: 0,
                  }}>
                    🤖
                  </div>
                )}
                <div style={{
                  maxWidth: '78%',
                  padding: '10px 14px',
                  borderRadius: msg.speaker === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.speaker === 'user' ? '#0ea5e9' : '#1e293b',
                  border: msg.speaker === 'aria' ? '1px solid #334155' : 'none',
                  fontSize: 13,
                  color: '#e2e8f0',
                  lineHeight: 1.6,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isAriaTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>🤖</div>
                <div style={{
                  padding: '10px 16px', background: '#1e293b',
                  borderRadius: 14, border: '1px solid #334155',
                  display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#64748b',
                      animation: `bounce 1.2s ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {phase === 'live' && scriptIndex >= (currentScript.length - 1) && (
            <div style={{
              padding: 16,
              borderTop: '1px solid #1e293b',
              display: 'flex', gap: 10,
            }}>
              <button style={{
                flex: 1, padding: '10px 0',
                borderRadius: 10, border: 'none',
                background: '#ef4444', color: '#fff',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}
                onClick={onClose}
              >
                🚫 Block Transaction
              </button>
              <button style={{
                flex: 1, padding: '10px 0',
                borderRadius: 10,
                border: '1px solid #334155',
                background: 'transparent', color: '#94a3b8',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}
                onClick={onClose}
              >
                Proceed Anyway
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes pulseRing { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.05); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
      `}</style>
    </div>
  )
}
