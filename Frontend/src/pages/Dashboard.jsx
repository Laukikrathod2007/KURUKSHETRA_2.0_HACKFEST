import { Shield, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const stats = [
  { name: 'Transactions Today', value: '1,247', change: '+12.3%', trend: 'up', icon: TrendingUp, color: 'primary' },
  { name: 'Blocked Threats', value: '23', change: '+8', trend: 'up', icon: Shield, color: 'danger' },
  { name: 'Safe Payments', value: '1,189', change: '95.3%', trend: 'up', icon: CheckCircle, color: 'success' },
  { name: 'Avg Response Time', value: '12ms', change: '-3ms', trend: 'down', icon: Clock, color: 'warning' },
]

const chartData = [
  { name: '00:00', transactions: 45, blocked: 2 },
  { name: '04:00', transactions: 23, blocked: 1 },
  { name: '08:00', transactions: 89, blocked: 4 },
  { name: '12:00', transactions: 156, blocked: 7 },
  { name: '16:00', transactions: 234, blocked: 5 },
  { name: '20:00', transactions: 178, blocked: 4 },
  { name: '23:59', transactions: 91, blocked: 0 },
]

const recentAlerts = [
  { id: 1, type: 'HIGH', message: 'Large unusual transfer detected', time: '2 min ago', action: 'BLOCKED' },
  { id: 2, type: 'MEDIUM', message: 'First-time payee transaction', time: '15 min ago', action: 'CHALLENGED' },
  { id: 3, type: 'LOW', message: 'Routine payment verified', time: '23 min ago', action: 'ALLOWED' },
  { id: 4, type: 'CRITICAL', message: 'Sanctions list match', time: '1 hr ago', action: 'BLOCKED' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
        <p className="text-slate-400">Real-time payment security monitoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-400 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <span className={`text-sm ${stat.trend === 'up' ? 'text-success-400' : 'text-slate-400'}`}>
                  {stat.change}
                </span>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Transaction Activity (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
            />
            <Area type="monotone" dataKey="transactions" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorTransactions)" />
            <Area type="monotone" dataKey="blocked" stroke="#ef4444" fillOpacity={1} fill="url(#colorBlocked)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Alerts */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Security Alerts</h3>
        <div className="space-y-4">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  alert.type === 'CRITICAL' ? 'bg-danger-500' :
                  alert.type === 'HIGH' ? 'bg-warning-500' :
                  alert.type === 'MEDIUM' ? 'bg-primary-500' :
                  'bg-success-500'
                } animate-pulse`}></div>
                <div>
                  <p className="text-white font-medium">{alert.message}</p>
                  <p className="text-sm text-slate-400">{alert.time}</p>
                </div>
              </div>
              <span className={`badge ${
                alert.action === 'BLOCKED' ? 'badge-danger' :
                alert.action === 'CHALLENGED' ? 'badge-warning' :
                'badge-success'
              }`}>
                {alert.action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <StatusItem label="ML Risk Engine" status="online" latency="8ms" />
            <StatusItem label="Agentic Reasoning" status="online" latency="142ms" />
            <StatusItem label="Recipient Verification" status="online" latency="23ms" />
            <StatusItem label="Audit Trail Service" status="online" latency="5ms" />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Security Posture</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Overall Security Score</span>
                <span className="text-success-400 font-semibold">98.7%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-success-500 h-2 rounded-full" style={{ width: '98.7%' }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-white">99.2%</p>
                <p className="text-xs text-slate-400">Detection Rate</p>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-white">0.3%</p>
                <p className="text-xs text-slate-400">False Positives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusItem({ label, status, latency }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-300">{label}</span>
      <div className="flex items-center space-x-3">
        <span className="text-sm text-slate-400">{latency}</span>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-success-500' : 'bg-danger-500'}`}></div>
          <span className="text-sm text-slate-300 capitalize">{status}</span>
        </div>
      </div>
    </div>
  )
}
