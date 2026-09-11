import { useState } from 'react'
import { FileText, Download, Search, Filter, Shield, Hash } from 'lucide-react'

const mockAuditData = [
  {
    id: 'TXN-2026-001247',
    timestamp: '2026-09-11 14:32:18',
    amount: 15000,
    recipient: 'john.doe@paytm',
    riskScore: 72,
    action: 'PAUSE',
    hash: 'a3f5c9d2e8b1f4a7c6d9e2b5f8a1c4d7',
    agent: 'Intent + Transaction'
  },
  {
    id: 'TXN-2026-001246',
    timestamp: '2026-09-11 14:15:42',
    amount: 2500,
    recipient: 'merchant@ybl',
    riskScore: 18,
    action: 'ALLOW',
    hash: 'b7d2e5f8a1c4d7e9f2b5c8d1a4e7f9b2',
    agent: 'Fast-path ML'
  },
  {
    id: 'TXN-2026-001245',
    timestamp: '2026-09-11 14:08:29',
    amount: 50000,
    recipient: 'unknown@apl',
    riskScore: 95,
    action: 'BLOCK',
    hash: 'c4d7e9f2b5c8d1a4e7f9b2c5d8e1a4f7',
    agent: 'Sanctions Override'
  },
  {
    id: 'TXN-2026-001244',
    timestamp: '2026-09-11 13:55:11',
    amount: 8900,
    recipient: 'vendor@oksbi',
    riskScore: 45,
    action: 'CHALLENGE',
    hash: 'd7e9f2b5c8d1a4e7f9b2c5d8e1a4f7b9',
    agent: 'Agentic Reasoning'
  },
  {
    id: 'TXN-2026-001243',
    timestamp: '2026-09-11 13:42:05',
    amount: 1200,
    recipient: 'friend@upi',
    riskScore: 12,
    action: 'ALLOW',
    hash: 'e9f2b5c8d1a4e7f9b2c5d8e1a4f7b9c5',
    agent: 'Fast-path ML'
  },
]

export default function AuditHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')

  const filteredData = mockAuditData.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterAction === 'all' || item.action === filterAction
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Audit History</h1>
          <p className="text-slate-400">Cryptographically secured transaction log</p>
        </div>
        <button className="btn btn-primary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Transaction ID or Recipient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="input"
            >
              <option value="all">All Actions</option>
              <option value="ALLOW">ALLOW</option>
              <option value="ADVISE">ADVISE</option>
              <option value="CHALLENGE">CHALLENGE</option>
              <option value="PAUSE">PAUSE</option>
              <option value="BLOCK">BLOCK</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Transaction ID</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Timestamp</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-300">Amount</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Recipient</th>
                <th className="text-center p-4 text-sm font-semibold text-slate-300">Risk Score</th>
                <th className="text-center p-4 text-sm font-semibold text-slate-300">Action</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Agent</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Hash Chain</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-primary-400" />
                      <span className="font-mono text-sm text-slate-300">{item.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-400 font-mono">{item.timestamp}</td>
                  <td className="p-4 text-right text-sm text-white font-semibold">
                    ₹{item.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm text-slate-300 font-mono">{item.recipient}</td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        item.riskScore >= 70 ? 'bg-danger-500' :
                        item.riskScore >= 50 ? 'bg-warning-500' :
                        item.riskScore >= 30 ? 'bg-primary-500' :
                        'bg-success-500'
                      }`}></div>
                      <span className="text-sm font-semibold text-white">{item.riskScore}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`badge ${
                      item.action === 'BLOCK' ? 'badge-danger' :
                      item.action === 'PAUSE' ? 'badge-warning' :
                      item.action === 'CHALLENGE' ? 'badge-warning' :
                      item.action === 'ADVISE' ? 'badge-info' :
                      'badge-success'
                    }`}>
                      {item.action}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-400">{item.agent}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-slate-500" />
                      <span className="font-mono text-xs text-slate-500 truncate max-w-[120px]">
                        {item.hash}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">No transactions match your filters</p>
          </div>
        )}
      </div>

      {/* Hash Chain Info */}
      <div className="card bg-primary-500/5 border-primary-500/20">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-primary-500/10 rounded-lg">
            <Hash className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Cryptographic Audit Trail</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every transaction is recorded with SHA-256 hash chaining, creating a tamper-evident append-only log. 
              Each record contains the hash of the previous entry, ensuring integrity of the entire audit history.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
