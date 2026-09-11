import { X, FileText, Brain, Shield, AlertTriangle } from 'lucide-react'

export default function EvidenceModal({ analysis, transaction, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Evidence Report</h2>
              <p className="text-sm text-slate-400">AI-Generated Security Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Executive Summary */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary-400" />
                <span>Executive Summary</span>
              </h3>
              <div className={`p-4 rounded-lg border-2 ${
                analysis.action === 'BLOCK' ? 'bg-danger-500/10 border-danger-500/30' :
                analysis.action === 'PAUSE' ? 'bg-warning-500/10 border-warning-500/30' :
                analysis.action === 'ALLOW' ? 'bg-success-500/10 border-success-500/30' :
                'bg-primary-500/10 border-primary-500/30'
              }`}>
                <p className="text-slate-200 leading-relaxed">
                  {getExecutiveSummary(analysis, transaction)}
                </p>
              </div>
            </section>

            {/* Risk Factors */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-warning-400" />
                <span>Risk Factors Detected</span>
              </h3>
              <div className="space-y-2">
                {analysis.factors.map((factor, idx) => (
                  <div key={idx} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white mb-1">{factor.name}</p>
                        <p className="text-sm text-slate-400">{getFactorDescription(factor.name)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-danger-400">+{factor.weight}</p>
                        <p className="text-xs text-slate-500">risk points</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Agent Analysis */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary-400" />
                <span>Multi-Agent Analysis</span>
              </h3>
              <div className="space-y-3">
                <AgentCard
                  name="Transaction Agent"
                  verdict="Flagged unusual amount pattern"
                  confidence={87}
                />
                <AgentCard
                  name="Intent Agent"
                  verdict={transaction.urgencyDetected ? "Urgency manipulation detected" : "No linguistic threats"}
                  confidence={transaction.urgencyDetected ? 92 : 45}
                />
                <AgentCard
                  name="Recipient Agent"
                  verdict={transaction.recipientCategory === 'unknown' ? "Unverified recipient" : "Verified recipient"}
                  confidence={transaction.recipientCategory === 'unknown' ? 94 : 12}
                />
              </div>
            </section>

            {/* Recommended Action */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Policy Decision</h3>
              <div className="p-6 bg-slate-800/50 rounded-lg border-2 border-slate-700">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-2">Recommended Action</p>
                  <p className="text-4xl font-bold text-white mb-4">{analysis.action}</p>
                  <p className="text-slate-300 max-w-md mx-auto">
                    {getActionRationale(analysis.action)}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-700 bg-slate-900/50">
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
          <button className="btn btn-primary">
            Download Report
          </button>
        </div>
      </div>
    </div>
  )
}

function AgentCard({ name, verdict, confidence }) {
  return (
    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-white">{name}</p>
          <p className="text-sm text-slate-400 mt-1">{verdict}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary-400">{confidence}%</p>
          <p className="text-xs text-slate-500">confidence</p>
        </div>
      </div>
    </div>
  )
}

function getExecutiveSummary(analysis, transaction) {
  if (analysis.action === 'BLOCK') {
    return `This transaction has been automatically BLOCKED due to critical security concerns. Our multi-agent system detected ${analysis.factors.length} high-severity risk factors with a combined risk score of ${analysis.score}/100. The payment cannot proceed to protect you from potential fraud.`
  }
  if (analysis.action === 'PAUSE') {
    return `This transaction requires manual review before proceeding. We detected ${analysis.factors.length} significant risk factors resulting in a HIGH risk classification (${analysis.score}/100). A cognitive intervention will guide you through the decision process.`
  }
  if (analysis.action === 'ALLOW') {
    return `This transaction has been cleared for immediate processing. Our analysis found minimal risk factors (${analysis.score}/100) and the payment pattern matches your normal behavior.`
  }
  return `This transaction has ${analysis.factors.length} risk factors for your awareness (score: ${analysis.score}/100). We recommend reviewing the details before proceeding.`
}

function getFactorDescription(name) {
  const descriptions = {
    'Unknown Recipient': 'The payee could not be verified in our directory system.',
    'Purpose-Identity Mismatch': 'The payment note does not match the recipient account type.',
    'Unusual Amount (3x baseline)': 'This amount is significantly larger than your typical transactions.',
    'High Transaction Velocity': 'Multiple transactions detected in a short time window.',
    'Urgency Language Detected': 'The payment note contains phrases commonly used in scams.',
    'Scam Pattern Match': 'Transaction matches known fraud typology patterns.',
    'First-time Payee': 'You have never sent money to this recipient before.',
    'Sanctions List Match': 'Recipient appears on regulatory watchlists.',
  }
  return descriptions[name] || 'Security concern identified by our AI system.'
}

function getActionRationale(action) {
  const rationales = {
    'BLOCK': 'This transaction cannot proceed due to confirmed security threats. Your funds are protected.',
    'PAUSE': 'We need you to review additional information before making this payment. This pause protects you.',
    'CHALLENGE': 'Please confirm key details about this payment before we process it.',
    'ADVISE': 'We want to make you aware of some potential concerns, but the final decision is yours.',
    'ALLOW': 'This transaction is low-risk and has been approved for immediate processing.',
  }
  return rationales[action] || 'Policy decision based on multi-factor analysis.'
}
