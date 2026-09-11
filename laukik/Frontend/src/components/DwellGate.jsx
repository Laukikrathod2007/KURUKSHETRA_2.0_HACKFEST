import { useState, useEffect } from 'react'
import { Clock, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react'

export default function DwellGate({ action, onComplete }) {
  const [countdown, setCountdown] = useState(5)
  const [canProceed, setCanProceed] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanProceed(true)
    }
  }, [countdown])

  const educationalContent = {
    PAUSE: {
      title: "High-Risk Transaction Detected",
      icon: ShieldAlert,
      color: "danger",
      messages: [
        "This payment shows multiple red flags that match known scam patterns.",
        "Take time to verify the recipient's identity through a different channel.",
        "Scammers often create urgency. There's no rush - your safety comes first.",
        "If someone is pressuring you, this is a major warning sign.",
      ]
    },
    CHALLENGE: {
      title: "Unusual Payment Activity",
      icon: AlertTriangle,
      color: "warning",
      messages: [
        "This transaction is outside your normal payment patterns.",
        "Verify you actually need to make this payment.",
        "Confirm the recipient details are exactly correct.",
        "Consider calling the recipient to verify before sending.",
      ]
    }
  }

  const content = educationalContent[action] || educationalContent.CHALLENGE
  const Icon = content.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-danger-500 rounded-2xl max-w-2xl w-full shadow-2xl animate-slide-up">
        {/* Header */}
        <div className={`p-6 border-b border-${content.color}-500/30 bg-${content.color}-500/10`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-${content.color}-500/20 rounded-xl`}>
              <Icon className={`w-8 h-8 text-${content.color}-400`} />
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold text-${content.color}-400`}>{content.title}</h2>
              <p className="text-slate-300 mt-1">Please read carefully before proceeding</p>
            </div>
            {countdown > 0 && (
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full border-4 border-${content.color}-500 flex items-center justify-center bg-slate-900`}>
                  <span className={`text-2xl font-bold text-${content.color}-400`}>{countdown}</span>
                </div>
                <span className="text-xs text-slate-500 mt-1">seconds</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Educational Messages */}
          <div className="space-y-4">
            {content.messages.map((message, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className={`w-6 h-6 rounded-full bg-${content.color}-500/20 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <span className={`text-sm font-bold text-${content.color}-400`}>{idx + 1}</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{message}</p>
              </div>
            ))}
          </div>

          {/* Common Scam Warning */}
          <div className="p-5 bg-danger-500/10 border-2 border-danger-500/30 rounded-lg">
            <p className="text-lg font-semibold text-danger-400 mb-3">⚠️ Common Scam Indicators:</p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-danger-400 mt-0.5">•</span>
                <span>Someone claiming to be from the government, police, or bank</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-danger-400 mt-0.5">•</span>
                <span>Requests to pay "urgently" or face consequences</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-danger-400 mt-0.5">•</span>
                <span>Investment opportunities with guaranteed high returns</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-danger-400 mt-0.5">•</span>
                <span>Romance or relationship requests for money</span>
              </li>
            </ul>
          </div>

          {/* Countdown Progress */}
          {countdown > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Reading time required</span>
                <span className="text-slate-300">{countdown} seconds remaining</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-${content.color}-500 transition-all duration-1000 ease-linear`}
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-700 bg-slate-900/50 space-y-3">
          {canProceed ? (
            <>
              <button
                onClick={onComplete}
                className="btn btn-success w-full text-lg py-3 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>I Understand - Continue Review</span>
              </button>
              <p className="text-xs text-center text-slate-500">
                You can still cancel this payment after review
              </p>
            </>
          ) : (
            <div className="text-center py-3">
              <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-slate-500">Please read the security warnings above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
