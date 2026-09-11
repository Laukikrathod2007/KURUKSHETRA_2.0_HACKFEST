import { User, Building, Landmark, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react'

export default function RecipientPanel({ recipientUPI, category }) {
  const getCategoryInfo = () => {
    if (recipientUPI.includes('merchant') || recipientUPI.includes('@paytm')) {
      return {
        type: 'Merchant',
        icon: Building,
        color: 'primary',
        verified: true,
        description: 'Registered business account'
      }
    }
    
    if (recipientUPI.includes('gov') || recipientUPI.includes('govt')) {
      return {
        type: 'Government',
        icon: Landmark,
        color: 'success',
        verified: true,
        description: 'Government entity account'
      }
    }

    if (recipientUPI.includes('unknown') || recipientUPI.includes('@apl')) {
      return {
        type: 'Unknown',
        icon: AlertTriangle,
        color: 'danger',
        verified: false,
        description: 'Unverified account - High Risk'
      }
    }

    return {
      type: 'Personal',
      icon: User,
      color: 'primary',
      verified: true,
      description: 'Personal user account'
    }
  }

  const info = getCategoryInfo()
  const Icon = info.icon

  return (
    <div className="card sticky top-24">
      <h2 className="text-xl font-semibold text-white mb-6">Recipient Verification</h2>

      {recipientUPI ? (
        <div className="space-y-6">
          {/* Category Badge */}
          <div className={`p-4 rounded-lg border-2 bg-${info.color}-500/10 border-${info.color}-500/30`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 bg-${info.color}-500/20 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${info.color}-400`} />
              </div>
              <div>
                <p className="text-sm text-slate-400">Account Type</p>
                <p className={`text-lg font-bold text-${info.color}-400`}>{info.type}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">{info.description}</p>
          </div>

          {/* Verification Status */}
          <div className="space-y-3">
            <VerificationItem 
              label="Identity Verified"
              verified={info.verified}
            />
            <VerificationItem 
              label="KYC Compliant"
              verified={info.verified}
            />
            <VerificationItem 
              label="Transaction History"
              verified={info.verified}
            />
          </div>

          {/* UPI Handle */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">UPI Handle</p>
            <p className="font-mono text-sm text-white break-all">{recipientUPI}</p>
          </div>

          {/* Warning for Unknown */}
          {!info.verified && (
            <div className="p-4 bg-danger-500/10 border border-danger-500/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-danger-400 mb-1">High Risk Recipient</p>
                  <p className="text-xs text-slate-300">
                    This recipient could not be verified. Proceed with extreme caution.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Enter a recipient UPI to see verification details</p>
        </div>
      )}
    </div>
  )
}

function VerificationItem({ label, verified }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700">
      <span className="text-sm text-slate-300">{label}</span>
      {verified ? (
        <CheckCircle className="w-5 h-5 text-success-400" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-danger-400" />
      )}
    </div>
  )
}
