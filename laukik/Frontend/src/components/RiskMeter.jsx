import { Gauge } from 'lucide-react'

export default function RiskMeter({ score, level }) {
  const getColor = () => {
    if (score >= 70) return { bg: 'bg-danger-500', text: 'text-danger-400', border: 'border-danger-500' }
    if (score >= 50) return { bg: 'bg-warning-500', text: 'text-warning-400', border: 'border-warning-500' }
    if (score >= 30) return { bg: 'bg-primary-500', text: 'text-primary-400', border: 'border-primary-500' }
    return { bg: 'bg-success-500', text: 'text-success-400', border: 'border-success-500' }
  }

  const colors = getColor()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gauge className={`w-6 h-6 ${colors.text}`} />
          <div>
            <p className="text-sm text-slate-400">Risk Score</p>
            <p className={`text-3xl font-bold ${colors.text}`}>{score}/100</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg border-2 ${colors.border} ${colors.bg}/10`}>
          <p className={`text-lg font-bold ${colors.text}`}>{level}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors.bg} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>

      {/* Scale Labels */}
      <div className="flex justify-between text-xs text-slate-500">
        <span>0 - Low</span>
        <span>30 - Medium</span>
        <span>50 - High</span>
        <span>70 - Critical</span>
      </div>
    </div>
  )
}
