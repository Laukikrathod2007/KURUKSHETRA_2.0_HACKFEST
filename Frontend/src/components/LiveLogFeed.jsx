import { useState, useEffect, useRef } from 'react'

const SAMPLE_LOGS = [
  { time: '00:24:12.102', sev: 'ALLOW', src: 'POLICY', msg: 'Txn #TX-9021 verified against whitelist. Allow score 0.04' },
  { time: '00:24:14.341', sev: 'INFO',  src: 'ML-ENGINE', msg: 'Extracted 114 features for payment vector in 8.2ms' },
  { time: '00:24:16.890', sev: 'WARN',  src: 'INTENT', msg: 'Detected urgency phrasing: "pay within 30 mins to avoid fee"' },
  { time: '00:24:18.125', sev: 'BLOCK', src: 'POLICY', msg: 'Recipient #RC-4412 matched known mule network. Directive: BLOCK' },
  { time: '00:24:21.050', sev: 'ALLOW', src: 'AUDIT', msg: 'Signed cryptographic audit hash for incident #INC-781' },
  { time: '00:24:23.774', sev: 'INFO',  src: 'RECIPIENT', msg: 'Queried account age registry: payee account age 42 days' },
  { time: '00:24:26.419', sev: 'WARN',  src: 'TXN-AGENT', msg: 'Amount exceeds 30-day moving average by 4.2x (z-score: 3.11)' },
  { time: '00:24:28.910', sev: 'BLOCK', src: 'POLICY', msg: 'Coerced remote-desktop session flagged. Intercepted payment.' },
]

export default function LiveLogFeed({ maxLogs = 30 }) {
  const [logs, setLogs] = useState(SAMPLE_LOGS)
  const feedRef = useRef(null)

  useEffect(() => {
    const templates = [
      { sev: 'ALLOW', src: 'POLICY', msg: 'P2P Transfer to recurrent contact cleared. Score: 0.02' },
      { sev: 'INFO',  src: 'ML-ENGINE', msg: 'GBDT evaluation completed across 114 telemetry dimensions' },
      { sev: 'WARN',  src: 'INTENT', msg: 'NLP scan: Impersonation keywords detected ("Customs release fee")' },
      { sev: 'BLOCK', src: 'POLICY', msg: 'High-risk payee velocity triggered hard override rule' },
      { sev: 'INFO',  src: 'RECIPIENT', msg: 'Cross-institution graph lookup completed in 14ms' },
      { sev: 'ALLOW', src: 'AUDIT', msg: 'Tamper-evident log written to local encrypted store' },
    ]

    const interval = setInterval(() => {
      const randomItem = templates[Math.floor(Math.random() * templates.length)]
      const now = new Date()
      const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`

      setLogs((prev) => [...prev.slice(-(maxLogs - 1)), { ...randomItem, time: timeStr }])
    }, 3200)

    return () => clearInterval(interval)
  }, [maxLogs])

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [logs])

  const getSevColor = (sev) => {
    switch (sev) {
      case 'BLOCK': return 'text-neon-red bg-neon-red/10 border-neon-red/30'
      case 'WARN':  return 'text-neon-amber bg-neon-amber/10 border-neon-amber/30'
      case 'ALLOW': return 'text-neon-green bg-neon-green/10 border-neon-green/30'
      default:      return 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30'
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50 p-4">
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
          <span className="font-mono text-xs font-semibold text-slate-300">LIVE TELEMETRY FEED</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">STREAM ACTIVE</span>
      </div>

      <div
        ref={feedRef}
        className="h-56 space-y-2 overflow-y-auto font-mono text-[11px] leading-tight text-slate-300 scroll-smooth pr-1"
      >
        {logs.map((log, idx) => (
          <div key={idx} className="flex items-baseline gap-2 py-0.5 hover:bg-white/[0.02]">
            <span className="text-slate-500 shrink-0 text-[10px]">{log.time}</span>
            <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold shrink-0 ${getSevColor(log.sev)}`}>
              {log.sev}
            </span>
            <span className="text-slate-400 text-[10px] shrink-0 font-semibold">[{log.src}]</span>
            <span className="text-slate-200 truncate">{log.msg}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 text-neon-cyan/80 text-[10px] pt-1">
          <span>&gt; awaiting next stream cycle</span>
          <span className="animate-blink">_</span>
        </div>
      </div>
    </div>
  )
}
