/**
 * ArchitectureDiagram.jsx
 * Clean, visual system architecture diagram for the hackathon presentation
 */

export default function ArchitectureDiagram() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#020617',
      fontFamily: 'Inter, sans-serif',
      padding: '40px 24px',
      color: '#f1f5f9',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ color: '#0ea5e9', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
            System Architecture
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Agentic Guardian</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>Real-Time Payment Scam Interception Pipeline</p>
        </div>

        {/* ── ROW 1: User + Frontend ── */}
        <Row>
          <Box icon="👤" label="User" sub="Makes a payment" color="#334155" textColor="#94a3b8" small />
          <Arrow />
          <Box icon="💳" label="Payment Simulator" sub="React Frontend" color="#0c2a3a" textColor="#0ea5e9" border="#0ea5e9" />
          <Arrow />
          <Box icon="⚡" label="FastAPI Backend" sub="Python · Port 8000" color="#0c1a2e" textColor="#38bdf8" border="#0284c7" />
        </Row>

        <VerticalArrow label="POST /analyze" />

        {/* ── ROW 2: Orchestrator ── */}
        <Row>
          <div style={{ flex: 1 }}>
            <Box
              icon="🧠"
              label="Guardian Orchestrator"
              sub="Weighted composite scoring · Runs 3 agents in parallel"
              color="#130c2a"
              textColor="#a78bfa"
              border="#7c3aed"
              wide
            />
          </div>
        </Row>

        <VerticalArrow label="parallel execution" />

        {/* ── ROW 3: Three Agents ── */}
        <Row gap={16}>
          <AgentBox icon="📝" label="Intent Agent" color="#1a1000" border="#d97706" textColor="#fbbf24"
            points={['Scans payment note', 'Detects urgency words', 'Finds coercion patterns', 'Score: 0–100']}
          />
          <AgentBox icon="💰" label="Transaction Agent" color="#0c1a10" border="#16a34a" textColor="#4ade80"
            points={['Checks amount vs baseline', '3x max = high risk', 'Round number flags', 'Score: 0–100']}
          />
          <AgentBox icon="👥" label="Recipient Agent" color="#0c1020" border="#2563eb" textColor="#60a5fa"
            points={['First-time payee check', 'Scam keyword in name', 'Numeric mule patterns', 'Score: 0–100']}
          />
        </Row>

        <VerticalArrow label="composite score → policy decision" />

        {/* ── ROW 4: Policy Gatekeeper ── */}
        <Row>
          <div style={{ flex: 1 }}>
            <Box icon="⚖️" label="Policy Gatekeeper" sub="Emits exactly ONE of five decisions" color="#1a0c0c" textColor="#f87171" border="#dc2626" wide />
          </div>
        </Row>

        {/* ── ROW 5: Five outcomes ── */}
        <div style={{ display: 'flex', gap: 10, margin: '16px 0 24px', justifyContent: 'center' }}>
          {[
            { label: 'ALLOW', color: '#22c55e', bg: '#052e16' },
            { label: 'ADVISE', color: '#60a5fa', bg: '#0c1a2e' },
            { label: 'CHALLENGE', color: '#fbbf24', bg: '#1a1200' },
            { label: 'PAUSE', color: '#fb923c', bg: '#1a0e00' },
            { label: 'BLOCK', color: '#f87171', bg: '#1a0505' },
          ].map(d => (
            <div key={d.label} style={{
              flex: 1, textAlign: 'center',
              padding: '10px 6px',
              background: d.bg,
              border: `1px solid ${d.color}44`,
              borderRadius: 10,
              color: d.color,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.05em',
            }}>
              {d.label}
            </div>
          ))}
        </div>

        <VerticalArrow label="if PAUSE / BLOCK → cognitive intervention" />

        {/* ── ROW 6: Intervention Layer ── */}
        <Row gap={16}>
          <AgentBox icon="⏱️" label="Dwell Gate" color="#0a1200" border="#65a30d" textColor="#a3e635"
            points={['5-second forced pause', 'Educational content', 'Scam awareness tips', 'Cannot be skipped']}
          />
          <AgentBox icon="🎥" label="Aria Video (TruGen)" color="#0a0c1a" border="#8b5cf6" textColor="#a78bfa"
            points={['Live AI video avatar', 'Context pre-injected', 'Persona-adaptive tone', 'Blocks or releases']}
          />
          <AgentBox icon="📞" label="Emergency Call (Vapi)" color="#1a0a0a" border="#ef4444" textColor="#f87171"
            points={['Outbound phone call', 'Aria speaks first', 'Full dossier context', 'User confirms / cancels']}
          />
        </Row>

        <VerticalArrow label="append-only audit record" />

        {/* ── ROW 7: Storage ── */}
        <Row gap={16}>
          <Box icon="🗄️" label="Session Store" sub="In-memory / Redis" color="#0c1a14" textColor="#34d399" border="#059669" />
          <Box icon="🔐" label="Audit Trail" sub="SHA-256 hash chained" color="#0c1020" textColor="#60a5fa" border="#2563eb" />
          <Box icon="📊" label="SOC Console" sub="React · Analyst view" color="#160c1a" textColor="#c084fc" border="#7c3aed" />
        </Row>

        {/* Legend */}
        <div style={{
          marginTop: 48,
          padding: '16px 20px',
          background: '#0f172a',
          borderRadius: 12,
          border: '1px solid #1e293b',
          display: 'flex', gap: 32, flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { color: '#0ea5e9', label: 'Frontend (React)' },
            { color: '#7c3aed', label: 'Backend (FastAPI/Python)' },
            { color: '#fbbf24', label: 'AI Agents' },
            { color: '#ef4444', label: 'External APIs (Vapi, TruGen)' },
            { color: '#059669', label: 'Storage (Redis, DB)' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{l.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

/* ── Layout helpers ─────────────────────────────────────────────── */

function Row({ children, gap = 24 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap, marginBottom: 0 }}>
      {children}
    </div>
  )
}

function Arrow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      color: '#334155', fontSize: 22, flexShrink: 0,
      padding: '0 4px',
    }}>
      →
    </div>
  )
}

function VerticalArrow({ label }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      margin: '12px 0',
      color: '#334155',
    }}>
      <div style={{ width: 1, height: 16, background: '#1e293b' }} />
      <span style={{ fontSize: 11, color: '#475569', margin: '4px 0', letterSpacing: '0.05em' }}>{label}</span>
      <div style={{ fontSize: 16, color: '#475569' }}>↓</div>
    </div>
  )
}

function Box({ icon, label, sub, color, textColor, border, small, wide }) {
  return (
    <div style={{
      flex: wide ? 1 : small ? '0 0 auto' : 1,
      padding: small ? '10px 14px' : '14px 18px',
      background: color,
      border: `1px solid ${border || '#1e293b'}`,
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: small ? 16 : 20 }}>{icon}</span>
        <span style={{ color: textColor, fontWeight: 700, fontSize: small ? 12 : 14 }}>{label}</span>
      </div>
      {sub && <p style={{ color: '#475569', fontSize: 11, margin: 0, paddingLeft: 28 }}>{sub}</p>}
    </div>
  )
}

function AgentBox({ icon, label, color, border, textColor, points }) {
  return (
    <div style={{
      flex: 1,
      padding: '14px 16px',
      background: color,
      border: `1px solid ${border}`,
      borderRadius: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ color: textColor, fontWeight: 700, fontSize: 13 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {points.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: border, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#64748b' }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
