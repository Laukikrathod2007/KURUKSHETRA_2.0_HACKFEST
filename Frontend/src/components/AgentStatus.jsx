import { useState, useEffect } from 'react'
import { Brain, Activity, Users, Network } from 'lucide-react'

const INITIAL_AGENTS = [
  { id: 'intent', name: 'Intent Agent', role: 'Social Engineering & Memos', icon: Brain, status: 'ACTIVE', latency: '42ms', confidence: 98 },
  { id: 'txn', name: 'Transaction Agent', role: 'Velocity & Pattern Anomaly', icon: Activity, status: 'ACTIVE', latency: '18ms', confidence: 99 },
  { id: 'recipient', name: 'Recipient Agent', role: 'Mule Risk & Account Age', icon: Users, status: 'REASONING', latency: '88ms', confidence: 94 },
  { id: 'orchestrator', name: 'Policy Gatekeeper', role: 'Deterministic Directives', icon: Network, status: 'ACTIVE', latency: '6ms', confidence: 100 },
]

export default function AgentStatus() {
  const [agents, setAgents] = useState(INITIAL_AGENTS)

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) => {
        const randomIndex = Math.floor(Math.random() * prev.length)
        return prev.map((agent, i) => {
          if (i === randomIndex) {
            const nextStatus = agent.status === 'REASONING' ? 'ACTIVE' : 'REASONING'
            const latencyVariance = Math.floor(Math.random() * 20) - 10
            const currentNum = parseInt(agent.latency) || 30
            return {
              ...agent,
              status: nextStatus,
              latency: `${Math.max(4, currentNum + latencyVariance)}ms`,
            }
          }
          return agent
        })
      })
    }, 2800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
          AI Multi-Agent Pipeline
        </h3>
        <span className="badge badge-success text-[10px]">
          4/4 AGENTS ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {agents.map((agent) => {
          const Icon = agent.icon
          const isReasoning = agent.status === 'REASONING'

          return (
            <div
              key={agent.id}
              className="relative overflow-hidden rounded-xl border p-3.5 transition-all"
              style={{
                background: isReasoning ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                borderColor: isReasoning ? 'rgba(139, 92, 246, 0.35)' : 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      background: isReasoning ? 'rgba(139, 92, 246, 0.2)' : 'rgba(0, 212, 255, 0.12)',
                      color: isReasoning ? '#a855f7' : '#00d4ff',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{agent.name}</p>
                    <p className="text-[10px] text-slate-400">{agent.role}</p>
                  </div>
                </div>

                <span
                  className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold"
                  style={{
                    background: isReasoning ? 'rgba(139, 92, 246, 0.2)' : 'rgba(0, 255, 136, 0.1)',
                    color: isReasoning ? '#c084fc' : '#00ff88',
                  }}
                >
                  {agent.status}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[10px]">
                <span className="text-slate-400 font-mono">Latency: {agent.latency}</span>
                <span className="text-neon-cyan font-mono font-semibold">{agent.confidence}% confidence</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
