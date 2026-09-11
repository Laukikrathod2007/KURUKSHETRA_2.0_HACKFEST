import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Shield, Clock, User, IndianRupee, MessageSquare, Mic, Eye } from 'lucide-react'
import { calculateRiskScore } from '../utils/riskCalculator'
import RiskMeter from '../components/RiskMeter'
import RecipientPanel from '../components/RecipientPanel'
import EvidenceModal from '../components/EvidenceModal'
import DwellGate from '../components/DwellGate'
import VoiceGuardian from '../components/VoiceGuardian'

export default function PaymentSimulator() {
  const [formData, setFormData] = useState({
    amount: '',
    recipientUPI: '',
    note: '',
    recipientCategory: 'unknown',
    purposeIdentityClash: false,
    userBaseline: 5000,
    velocityWindow24h: 0,
    urgencyDetected: false,
    scamTypologyMatch: false,
    isNewPayee: false,
    onSanctionsList: false,
  })

  const [riskAnalysis, setRiskAnalysis] = useState(null)
  const [showEvidence, setShowEvidence] = useState(false)
  const [showDwell, setShowDwell] = useState(false)
  const [showVoice, setShowVoice] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const analyzePayment = () => {
    setProcessing(true)
    
    // Simulate analysis delay
    setTimeout(() => {
      const analysis = calculateRiskScore({
        ...formData,
        amount: parseFloat(formData.amount) || 0
      })
      
      setRiskAnalysis(analysis)
      setProcessing(false)

      // Show appropriate intervention
      if (analysis.action === 'PAUSE' || analysis.action === 'CHALLENGE') {
        setShowDwell(true)
      }
    }, 1500)
  }

  const handleSubmitPayment = () => {
    if (riskAnalysis.action === 'BLOCK') {
      alert('Transaction BLOCKED: This payment cannot proceed due to security concerns.')
      return
    }

    if (riskAnalysis.action === 'PAUSE') {
      alert('Transaction requires manual review. A security specialist will contact you.')
      return
    }

    alert('Payment Authorized: Transaction submitted successfully.')
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      amount: '',
      recipientUPI: '',
      note: '',
      recipientCategory: 'unknown',
      purposeIdentityClash: false,
      userBaseline: 5000,
      velocityWindow24h: 0,
      urgencyDetected: false,
      scamTypologyMatch: false,
      isNewPayee: false,
      onSanctionsList: false,
    })
    setRiskAnalysis(null)
    setShowEvidence(false)
    setShowDwell(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Simulator</h1>
          <p className="text-slate-400">Test the Agentic Guardian security system</p>
        </div>
        <button
          onClick={() => setShowVoice(true)}
          className="btn btn-outline flex items-center space-x-2"
        >
          <Mic className="w-4 h-4" />
          <span>Voice Guardian</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary-400" />
              <span>Payment Details</span>
            </h2>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <IndianRupee className="w-4 h-4 inline mr-1" />
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="input"
                />
              </div>

              {/* Recipient UPI */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Recipient UPI / Account
                </label>
                <input
                  type="text"
                  name="recipientUPI"
                  value={formData.recipientUPI}
                  onChange={handleInputChange}
                  placeholder="e.g., merchant@paytm or unknown@ybl"
                  className="input"
                />
              </div>

              {/* Payment Note */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Payment Note (max 500 chars)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Enter payment description"
                  maxLength={500}
                  rows={3}
                  className="input"
                />
                <p className="text-xs text-slate-500 mt-1">{formData.note.length}/500 characters</p>
              </div>

              {/* Advanced Options */}
              <details className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                <summary className="cursor-pointer text-slate-300 font-medium">
                  Advanced Test Scenarios
                </summary>
                <div className="mt-4 space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="isNewPayee"
                      checked={formData.isNewPayee}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-300">First-time payee</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="urgencyDetected"
                      checked={formData.urgencyDetected}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-300">Urgency language detected</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="scamTypologyMatch"
                      checked={formData.scamTypologyMatch}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-300">Scam pattern match</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="purposeIdentityClash"
                      checked={formData.purposeIdentityClash}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-300">Purpose-Identity clash</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="onSanctionsList"
                      checked={formData.onSanctionsList}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-300 text-danger-400">⚠️ Sanctions list match</span>
                  </label>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Velocity (24h transactions)</label>
                    <input
                      type="number"
                      name="velocityWindow24h"
                      value={formData.velocityWindow24h}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>
              </details>

              {/* Analyze Button */}
              <button
                onClick={analyzePayment}
                disabled={!formData.amount || !formData.recipientUPI || processing}
                className="btn btn-primary w-full text-lg py-3"
              >
                {processing ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Analyzing Security...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Analyze Payment
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Risk Analysis Results */}
          {riskAnalysis && (
            <div className="card animate-slide-up">
              <h2 className="text-xl font-semibold text-white mb-6">Risk Analysis</h2>
              
              <RiskMeter score={riskAnalysis.score} level={riskAnalysis.riskLevel} />

              {/* Risk Factors */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Risk Factors Detected:</h3>
                <div className="space-y-2">
                  {riskAnalysis.factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <span className="text-slate-300">{factor.name}</span>
                      <span className="text-danger-400 font-mono">+{factor.weight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="mt-6 p-4 rounded-lg border-2 bg-slate-800/50" style={{
                borderColor: 
                  riskAnalysis.action === 'BLOCK' ? '#dc2626' :
                  riskAnalysis.action === 'PAUSE' ? '#f59e0b' :
                  riskAnalysis.action === 'CHALLENGE' ? '#f59e0b' :
                  riskAnalysis.action === 'ADVISE' ? '#0ea5e9' :
                  '#22c55e'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Recommended Action</p>
                    <p className="text-2xl font-bold text-white">{riskAnalysis.action}</p>
                  </div>
                  {riskAnalysis.action === 'BLOCK' && <AlertTriangle className="w-8 h-8 text-danger-500" />}
                  {riskAnalysis.action === 'ALLOW' && <CheckCircle className="w-8 h-8 text-success-500" />}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center space-x-3">
                <button
                  onClick={() => setShowEvidence(true)}
                  className="btn btn-outline flex-1 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Evidence</span>
                </button>
                
                {riskAnalysis.action !== 'BLOCK' && (
                  <button
                    onClick={handleSubmitPayment}
                    className={`btn flex-1 ${
                      riskAnalysis.action === 'ALLOW' ? 'btn-success' :
                      riskAnalysis.action === 'ADVISE' ? 'btn-primary' :
                      'btn-warning'
                    }`}
                  >
                    {riskAnalysis.action === 'ALLOW' ? 'Proceed' : 'Override & Proceed'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Recipient Panel */}
        <div className="lg:col-span-1">
          <RecipientPanel 
            recipientUPI={formData.recipientUPI}
            category={formData.recipientCategory}
          />
        </div>
      </div>

      {/* Modals */}
      {showEvidence && riskAnalysis && (
        <EvidenceModal
          analysis={riskAnalysis}
          transaction={formData}
          onClose={() => setShowEvidence(false)}
        />
      )}

      {showDwell && (
        <DwellGate
          action={riskAnalysis.action}
          onComplete={() => setShowDwell(false)}
        />
      )}

      {showVoice && (
        <VoiceGuardian
          onClose={() => setShowVoice(false)}
        />
      )}
    </div>
  )
}
