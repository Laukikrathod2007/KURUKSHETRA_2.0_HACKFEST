/**
 * EmergencyCallDemo.jsx
 * ─────────────────────────────────────────────────────────────────
 * Demo-mode Vapi emergency phone call simulation
 * Realistic phone call UI: ringing → connected → Aria speaking
 * with live waveform visualization and transcript
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from 'react'
import { Phone, PhoneOff, PhoneCall, Mic, MicOff, Volume2 } from 'lucide-react'

const CALL_SCRIPT = [
  { delay: 0,    text: null, phase: 'ringing' },
  { delay: 3000, text: null, phase: 'connected' },
  { delay: 3800, text: "Hello {name}, this is Aria from your Payment Guardian service.", phase: 'speaking' },
  { delay: 8000, text: "I've temporarily held your transfer of ₹{amount} to {recipient}.", phase: 'speaking' },
  { delay: 13000, text: "Our system detected critical scam indicators — urgency language and an unverified recipient.", phase: 'speaking' },
  { delay: 19000, text: "Are you currently on a call with someone who asked you to make this payment?", phase: 'speaking' },
  { delay: 25000, text: "If yes, please hang up that call immediately. Legitimate authorities never demand payments over UPI.", phase: 'speaking' },
  { delay: 32000, text: "Your money is completely safe. I'm here to help you. Shall I block this transaction?", phase: 'speaking' },
]

function Waveform({ active }) {
  const bars = 28
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 40 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2,
          background: active ? '#22c55e' : '#334155',
          height: active
            ? `${12 + Math.sin(Date.now() / 200 + i * 0.5) * 10 + Math.random() * 14}px`
            : '4px',
          transition: active ? 'none' : 'height 0.3s',
          animation: active ? `wave ${0.4 + (i % 5) * 0.1}s ${i * 0.03}s ease-in-out infinite alternate` : 'none',
        }} />
      ))}
      <style>{`
        @keyframes wave {
          from { height: 4px; }
          to { height: ${8 + Math.floor(Math.random() * 24)}px; }
        }
      `}</style>
    </div>
  )
}

export default function EmergencyCallDemo({ amount = '50,000', recipient = 'Unknown', name = 'User', phone = '+91 98765 43210', onClose }) {
  const [phase, setPhase] = useState('ringing') // ringing → connected → speaking → ended
  const [transcript, setTranscript] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [ringCount, setRingCount] = useState(0)
  const timerRef = useRef(null)
  const transcriptRef = useRef(null)

  useEffect(() => {
    // Fill in script with values
    const filled = CALL_SCRIPT.map(s => ({
      ...s,
      text: s.text
        ? s.text.replace('{name}', name).replace('{amount}', amount).replace('{recipient}', recipient)
        : null
    }))

    // Ring counter
    const ringInterval = setInterval(() => {
      setRingCount(c => c + 1)
    }, 2000)

    // Execute script
    const timeouts = filled.map(step => {
      return setTimeout(() => {
        setPhase(step.phase)
        if (step.phase === 'connected') {
          clearInterval(ringInterval)
          // Start elapsed timer
          timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
        }
        if (step.text) {
          setCurrentText(step.text)
          setTranscript(prev => [...prev, { speaker: 'aria', text: step.text }])
        }
      }, step.delay)
    })

    return () => {
      timeouts.forEach(clearTimeout)
      clearInterval(ringInterval)
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcript])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const hangUp = () => {
    clearInterval(timerRef.current)
    setPhase('ended')
    setTimeout(onClose, 1500)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        width: 380,
        background: '#0f172a',
        borderRadius: 28,
        border: '1px solid #1e293b',
        overflow: 'hidden',
        boxShadow: '0 0 60px rgba(239,68,68,0.2)',
      }}>

        {/* ── Call Header ── */}
        <div style={{
          background: 'linear-gradient(180deg, #0c1526 0%, #0f172a 100%)',
          padding: '32px 24px 24px',
          textAlign: 'center',
          borderBottom: '1px solid #1e293b',
        }}>
          {/* Caller avatar */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
            {/* Ringing pulse rings */}
            {phase === 'ringing' && [1, 2, 3].map(i => (
              <div key={i} style={{
                position: 'absolute',
                inset: -(i * 14),
                borderRadius: '50%',
                border: '1.5px solid rgba(239,68,68,0.3)',
                animation: `ringPulse ${1 + i * 0.3}s ${i * 0.2}s ease-out infinite`,
              }} />
            ))}

            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, #991b1b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36,
              border: `3px solid ${phase === 'connected' || phase === 'speaking' ? '#22c55e' : '#ef4444'}`,
              boxShadow: phase === 'speaking' ? '0 0 30px rgba(34,197,94,0.4)' : 'none',
              transition: 'box-shadow 0.5s',
            }}>
              🛡️
            </div>
          </div>

          <p style={{ color: '#fff', fontWeight: 700, fontSize: 20, margin: 0 }}>Aria Guardian</p>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4, marginBottom: 12 }}>
            Payment Security Emergency Line
          </p>

          {/* Status */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 999,
            background: phase === 'ringing' ? '#ef444420' : phase === 'ended' ? '#33415520' : '#22c55e20',
            border: `1px solid ${phase === 'ringing' ? '#ef444440' : phase === 'ended' ? '#33415540' : '#22c55e40'}`,
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: phase === 'ringing' ? '#ef4444' : phase === 'ended' ? '#64748b' : '#22c55e',
              animation: phase !== 'ended' ? 'pulse 1.5s infinite' : 'none',
            }} />
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: phase === 'ringing' ? '#ef4444' : phase === 'ended' ? '#64748b' : '#22c55e',
              letterSpacing: '0.05em',
            }}>
              {phase === 'ringing' ? `Calling... (${ringCount})` :
               phase === 'ended' ? 'Call Ended' :
               formatTime(elapsed)}
            </span>
          </div>
        </div>

        {/* ── Transcript ── */}
        <div ref={transcriptRef} style={{
          height: 220, overflowY: 'auto',
          padding: '16px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {phase === 'ringing' && (
            <div style={{ textAlign: 'center', marginTop: 60 }}>
              <Phone size={28} color="#ef4444" style={{ animation: 'shake 0.5s infinite' }} />
              <p style={{ color: '#475569', fontSize: 13, marginTop: 12 }}>
                Emergency security call incoming...
              </p>
            </div>
          )}

          {transcript.map((msg, i) => (
            <div key={i} style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px 12px 12px 4px',
              padding: '10px 14px',
              animation: 'slideIn 0.3s ease',
            }}>
              <p style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 600, margin: '0 0 4px' }}>
                🛡️ ARIA
              </p>
              <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
                {msg.text}
              </p>
            </div>
          ))}

          {/* Speaking indicator */}
          {phase === 'connected' && transcript.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <p style={{ color: '#22c55e', fontSize: 13 }}>✅ Connected — Aria is speaking...</p>
            </div>
          )}
        </div>

        {/* ── Waveform ── */}
        <div style={{
          padding: '8px 24px',
          display: 'flex', justifyContent: 'center',
          borderTop: '1px solid #1e293b',
          borderBottom: '1px solid #1e293b',
          background: '#0a1120',
        }}>
          <Waveform active={phase === 'speaking' && !isMuted} />
        </div>

        {/* ── Call Controls ── */}
        <div style={{
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        }}>
          {/* Mute */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                background: isMuted ? '#ef4444' : '#1e293b',
                border: '1px solid #334155',
                cursor: 'pointer', marginBottom: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isMuted ? <MicOff size={20} color="#fff" /> : <Mic size={20} color="#94a3b8" />}
            </button>
            <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>{isMuted ? 'Unmute' : 'Mute'}</p>
          </div>

          {/* Hang up */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={hangUp}
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#ef4444',
                border: 'none', cursor: 'pointer', marginBottom: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(239,68,68,0.4)',
              }}
            >
              <PhoneOff size={26} color="#fff" />
            </button>
            <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>End Call</p>
          </div>

          {/* Speaker */}
          <div style={{ textAlign: 'center' }}>
            <button style={{
              width: 52, height: 52, borderRadius: '50%',
              background: '#1e293b', border: '1px solid #334155',
              cursor: 'pointer', marginBottom: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Volume2 size={20} color="#94a3b8" />
            </button>
            <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>Speaker</p>
          </div>
        </div>

        {/* Called number */}
        <div style={{
          textAlign: 'center', paddingBottom: 16,
        }}>
          <p style={{ fontSize: 11, color: '#334155', margin: 0 }}>
            Emergency security line · {phone}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes ringPulse { 0% { transform:scale(0.8); opacity:0.8; } 100% { transform:scale(1.4); opacity:0; } }
        @keyframes shake { 0%,100% { transform:rotate(0deg); } 25% { transform:rotate(-15deg); } 75% { transform:rotate(15deg); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}
