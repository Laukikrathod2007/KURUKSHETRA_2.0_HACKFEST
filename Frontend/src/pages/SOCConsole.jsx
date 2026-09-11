import { Monitor, Activity, AlertCircle, TrendingUp, Users, Target } from 'lucide-react'

const liveThreats = [
  { id: 1, type: 'Investment Scam', confidence: 94, blocked: true, time: '12s ago' },
  { id: 2, type: 'Invoice Manipulation', confidence: 87, blocked: false, time: '45s ago' },
  { id: 3, type: 'Romance Scam', confidence: 91, blocked: true, time: '2m ago' },
]

const agentActivity = [
  { agent: 'Intent Agent', tasks: 142, avgTime: '89ms', accuracy: '96.2%' },
  { agent: 'Transaction Agent', tasks: 1247, avgTime: '12ms', accuracy: '99.1%' },
  { agent: 'Recipient Agent', tasks: 1156, avgTime: '23ms', accuracy: '98.7%' },
  { agent: 'Orchestrator', tasks: 1247, avgTime: '156ms', accuracy: '97.8%' },
]

export default function SOCConsole() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">SOC Analyst Console</h1>
        <p className="text-slate-400">Technical security operations dashboard</p>
      </div>

      {/* Live Threat Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-danger-400" />
              <span>Live Threat Feed</span>
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-danger-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-400">Real-time</span>
            </div>
          </div>

          <div className="space-y-3">
            {liveThreats.map((threat) => (
              <div key={threat.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{threat.type}</span>
                  <span className={`badge ${threat.blocked ? 'badge-danger' : 'badge-warning'}`}>
                    {threat.blocked ? 'BLOCKED' : 'REVIEWING'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Confidence: {threat.confidence}%</span>
                  <span className="text-slate-500">{threat.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary-400" />
            <span>Agent Performance</span>
          </h2>

          <div className="space-y-4">
            {agentActivity.map((agent) => (
              <div key={agent.agent} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white">{agent.agent}</span>
                  <span className="text-sm text-success-400">{agent.accuracy}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Tasks: </span>
                    <span className="text-white font-semibold">{agent.tasks}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Avg Time: </span>
                    <span className="text-white font-semibold">{agent.avgTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-primary-400" />
            <TrendingUp className="w-5 h-5 text-success-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1">Detection Accuracy</p>
          <p className="text-3xl font-bold text-white">99.2%</p>
          <p className="text-sm text-success-400 mt-2">+0.8% from last week</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-warning-400" />
            <TrendingUp className="w-5 h-5 text-success-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1">Protected Users</p>
          <p className="text-3xl font-bold text-white">12,489</p>
          <p className="text-sm text-success-400 mt-2">+234 today</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <Monitor className="w-8 h-8 text-success-400" />
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-sm text-slate-400 mb-1">System Uptime</p>
          <p className="text-3xl font-bold text-white">99.98%</p>
          <p className="text-sm text-slate-400 mt-2">47 days, 8 hours</p>
        </div>
      </div>

      {/* Technical Metrics */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-6">Domain Performance Metrics</h2>
        
        <div className="space-y-6">
          <MetricRow 
            domain="Domain 1: Recipient Verification" 
            latency="23ms" 
            throughput="1,247 req/min" 
            errorRate="0.02%"
          />
          <MetricRow 
            domain="Domain 2: ML Risk Engine (GBDT)" 
            latency="12ms" 
            throughput="1,247 req/min" 
            errorRate="0.01%"
          />
          <MetricRow 
            domain="Domain 3: Agentic Reasoning" 
            latency="142ms" 
            throughput="89 req/min" 
            errorRate="0.15%"
          />
          <MetricRow 
            domain="Domain 4: Policy Gatekeeper" 
            latency="8ms" 
            throughput="1,247 req/min" 
            errorRate="0.00%"
          />
          <MetricRow 
            domain="Domain 5: Cognitive Intervention" 
            latency="34ms" 
            throughput="156 req/min" 
            errorRate="0.03%"
          />
        </div>
      </div>
    </div>
  )
}

function MetricRow({ domain, latency, throughput, errorRate }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700">
      <span className="text-slate-300 font-medium flex-1">{domain}</span>
      <div className="flex items-center space-x-8 text-sm">
        <div>
          <span className="text-slate-400">Latency: </span>
          <span className="text-white font-semibold">{latency}</span>
        </div>
        <div>
          <span className="text-slate-400">Throughput: </span>
          <span className="text-white font-semibold">{throughput}</span>
        </div>
        <div>
          <span className="text-slate-400">Errors: </span>
          <span className={`font-semibold ${parseFloat(errorRate) > 0.1 ? 'text-warning-400' : 'text-success-400'}`}>
            {errorRate}
          </span>
        </div>
      </div>
    </div>
  )
}
