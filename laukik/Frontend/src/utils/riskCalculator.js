/**
 * Calculate risk score based on multiple factors
 * Implements the 5-domain architecture risk scoring
 */
export function calculateRiskScore(transaction) {
  let score = 0
  const factors = []

  // Domain 1: Recipient Verification
  if (transaction.recipientCategory === 'unknown') {
    score += 25
    factors.push({ name: 'Unknown Recipient', weight: 25 })
  }

  // Purpose-Identity Clash
  if (transaction.purposeIdentityClash) {
    score += 20
    factors.push({ name: 'Purpose-Identity Mismatch', weight: 20 })
  }

  // Domain 2: Baseline Deviation
  if (transaction.amount > transaction.userBaseline * 3) {
    score += 15
    factors.push({ name: 'Unusual Amount (3x baseline)', weight: 15 })
  }

  // Velocity Analysis
  if (transaction.velocityWindow24h > 5) {
    score += 10
    factors.push({ name: 'High Transaction Velocity', weight: 10 })
  }

  // Domain 3: Linguistic Analysis
  if (transaction.urgencyDetected) {
    score += 15
    factors.push({ name: 'Urgency Language Detected', weight: 15 })
  }

  if (transaction.scamTypologyMatch) {
    score += 25
    factors.push({ name: 'Scam Pattern Match', weight: 25 })
  }

  // First-time payee
  if (transaction.isNewPayee) {
    score += 10
    factors.push({ name: 'First-time Payee', weight: 10 })
  }

  // Sanctions/Mule List
  if (transaction.onSanctionsList) {
    score = 100 // Automatic block
    factors.push({ name: 'Sanctions List Match', weight: 100 })
  }

  return {
    score: Math.min(score, 100),
    factors,
    riskLevel: getRiskLevel(score),
    action: getRecommendedAction(score, transaction)
  }
}

function getRiskLevel(score) {
  if (score >= 70) return 'CRITICAL'
  if (score >= 50) return 'HIGH'
  if (score >= 30) return 'MEDIUM'
  return 'LOW'
}

function getRecommendedAction(score, transaction) {
  if (transaction.onSanctionsList) return 'BLOCK'
  if (score >= 70) return 'PAUSE'
  if (score >= 50) return 'CHALLENGE'
  if (score >= 30) return 'ADVISE'
  return 'ALLOW'
}

/**
 * Scam taxonomy categories
 */
export const SCAM_TYPES = {
  ROMANCE: 'Romance/Dating Scam',
  INVESTMENT: 'Investment/Crypto Scam',
  IMPERSONATION: 'Authority Impersonation',
  TASK: 'Task-based Scam',
  INVOICE: 'Invoice Manipulation',
  PURCHASE: 'Purchase Scam'
}
