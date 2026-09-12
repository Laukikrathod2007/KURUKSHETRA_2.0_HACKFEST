/**
 * Kurukshetra Investigation Intelligence Registry
 *
 * Provides a self-contained, data-driven synthetic intelligence dataset
 * with multi-degree suspicious transaction graphs, identity & evidence constellations,
 * device clusters, external reputation signals, and entity trust profiles.
 * Also seamlessly connects to live backend SSE events when available.
 */

export const RISK_COLORS = {
  FREEZE: '#fb7185',   // Critical / Frozen
  COACH: '#fdba74',    // High risk / Coaching
  STEP_UP: '#fed7aa',  // Medium risk / Step-Up MFA
  ALLOW: '#5eead4',    // Low risk / Clean flow
  EVIDENCE: '#38bdf8', // Identity & Evidence Constellation
};

export function formatINR(amountPaiseOrRupees, isPaise = false) {
  const amount = isPaise ? amountPaiseOrRupees / 100 : amountPaiseOrRupees;
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

// ---------------------------------------------------------------------------
// 1. PRIMARY FLAGSHIP ENTITY: RAHUL SHARMA
// ---------------------------------------------------------------------------
const RAHUL_SHARMA_ENTITY = {
  id: 'rahul-sharma',
  name: 'Rahul Sharma',
  aliases: ['R. Sharma', 'Rahul S.', 'Sharma Traders'],
  type: 'Individual',
  role: 'Target Entity',
  category: 'Retail Banking User',
  riskScore: 78,
  riskLevel: 'HIGH',
  kycStatus: 'KYC On File (Tier-2)',
  upiId: 'rahul.sharma@oksbi',
  phone: '+91 ••••• 1021',
  accountNumber: '•••• •••• 9031',
  bank: 'State Bank of India',
  city: 'Mumbai, Maharashtra',
  totalInflow: 4850000,
  totalOutflow: 4620000,
  accent: '#fdba74',
  activeAlerts: [
    'Transaction velocity 4.2× above personal baseline',
    'Shared device observed active across 4 distinct accounts',
    'Rapid fund dissipation to newly registered mule accounts',
  ],

  // Trust & Cleanliness profile (Evidence over verdicts)
  trustProfile: {
    overall: 72,
    identity: 91,
    kyc: 100,
    contact: 68,
    devices: 57,
    reputation: 44,
    transactions: 71,
    elevatedSignals: [
      {
        title: 'Multiple Mobile Identifiers Linked',
        detail: '4 distinct SIMs associated with identity; 2 secondary SIMs flagged in community reports.',
        severity: 'MEDIUM',
      },
      {
        title: 'Shared Hardware Device Observed',
        detail: 'Hardware ID DEVICE-9B42 detected operating across 4 distinct banking accounts within 48 hours.',
        severity: 'CRITICAL',
      },
      {
        title: 'Transaction Velocity Surge',
        detail: 'Velocity reached 4.2× historical baseline with net balance dropping to <3% within 120s.',
        severity: 'HIGH',
      },
    ],
  },

  // Identity & Evidence Constellation (History Lens)
  historyIntelligence: {
    aadhaar: {
      number: '•••• •••• 4821',
      status: 'VERIFIED',
      linkedMobilesCount: 4,
      linkedAccountsCount: 3,
      identityConflicts: 1,
      conflictDetail: 'Residential address discrepancy vs CKYC registry record (dated Jul 2026)',
      reputationSignals: 2,
      lastAuthTimestamp: '08 Sep 2026 11:22:15',
    },
    pan: {
      number: '••••• 8842G',
      status: 'VERIFIED',
      nameConsistency: '98% Match',
      kycTier: 'Tier-2 Comprehensive',
      linkedAccountsCount: 4,
      flags: ['Directorship link to dormant entity "Apex Trade Conduits LLP"'],
    },
    mobiles: [
      {
        number: '+91 ••••• 1021',
        type: 'PRIMARY',
        status: 'VERIFIED',
        simAge: '3.2 years',
        simOperator: 'Jio 5G',
        psp: 'Google Pay',
        reputation: 'CLEAN',
        note: 'Registered primary banking contact since Jan 2023',
      },
      {
        number: '+91 ••••• 8842',
        type: 'SECONDARY',
        status: 'SHARED ASSOCIATION',
        simAge: '4 months',
        simOperator: 'Airtel',
        psp: 'PhonePe',
        reputation: 'SUSPICIOUS',
        note: 'Shared hardware telemetry observed across 3 separate recipient accounts',
      },
      {
        number: '+91 ••••• 6517',
        type: 'SECONDARY',
        status: 'REPUTATION SIGNAL',
        simAge: '28 days',
        simOperator: 'Vi',
        psp: 'BHIM UPI',
        reputation: 'CRITICAL',
        note: 'Reported in 4 community fraud incidents under Section 1930 / I4C',
      },
    ],
    accounts: [
      {
        number: '•••• 9031',
        bank: 'State Bank of India',
        type: 'Primary Savings',
        status: 'ACTIVE',
        age: '4.1 years',
        velocity: 'Surge: 4.2× baseline',
        balanceRange: '₹12,400 (Drained from ₹2.4 Lakh)',
        note: 'Origin account for recent high-velocity disbursements',
      },
      {
        number: '•••• 4819',
        bank: 'Axis Bank',
        label: 'Account X',
        type: 'Current Account',
        status: 'SUSPECTED MULE',
        age: '23 days',
        velocity: '98.2% drained in <120s',
        balanceRange: '₹840',
        note: 'Rapid pass-through node; holds placed under PMLA guidelines',
      },
      {
        number: '•••• 1102',
        bank: 'HDFC Bank',
        label: 'Account Y',
        type: 'Commercial Current',
        status: 'FLAGGED SHELL',
        age: '2 months',
        velocity: 'High-frequency fan-out',
        balanceRange: 'Near-zero end-of-day',
        note: 'Corporate layering conduit identified in 2nd-degree cluster',
      },
    ],
    devices: [
      {
        id: 'DEVICE-9B42',
        model: 'Samsung Galaxy S24 Ultra (Android 14)',
        accountsAssociated: 4,
        firstObserved: 'Aug 2026',
        status: 'UNUSUAL REUSE',
        riskLevel: 'CRITICAL',
        imeiHash: '•••• •••• c93f',
        networkType: 'Cellular LTE + Residential Wi-Fi',
        note: 'Operates both Rahul Sharma and Account X, Y sessions within minutes',
        connectedEntities: ['account-x', 'account-y', 'surat-mule-hub'],
      },
      {
        id: 'DEVICE-4F11',
        model: 'Apple iPhone 15 Pro (iOS 17.5)',
        accountsAssociated: 1,
        firstObserved: 'Sep 2025',
        status: 'NORMAL',
        riskLevel: 'LOW',
        imeiHash: '•••• •••• 12a0',
        networkType: 'Home Wi-Fi',
        note: 'Personal primary device for routine merchant debits',
        connectedEntities: [],
      },
    ],
    reputation: {
      source: 'Synthetic Reputation Intelligence',
      riskScore: 78,
      communityReportsCount: 6,
      cfcfrms1930Match: true,
      lastReportDate: '11 Sep 2026',
      reputationTags: [
        'National 1930 Cybercrime Registry Match',
        'High-Velocity Mule Layering Pattern',
        'Device-Cluster Multi-Account Association',
      ],
      description:
        'External telemetry flags multiple peer complaints regarding unauthorized investment scheme conduits and rapid transit layering.',
    },
  },

  // Multi-Degree Suspicious Transaction Graph
  connections: [
    // --- DEGREE 1: Direct Relationships ---
    {
      targetId: 'account-x',
      targetName: 'Account X',
      targetRole: 'Mule Layering Account',
      targetType: 'Axis Bank Current',
      degree: 1,
      riskLevel: 'CRITICAL',
      riskScore: 82,
      accent: '#fb7185',
      relation: 'Rapid Pass-Through Layering',
      direction: 'OUTFLOW',
      amount: 25000,
      txnCount: 4,
      isSuspicious: true,
      signals: ['New recipient', 'Amount anomaly', 'Velocity spike (4.2×)', 'Rapid pass-through'],
      recentTxn: {
        id: 'TXN-UPI-984210',
        amount: 25000,
        type: 'UPI P2P',
        timestamp: '12 Sep 2026 14:32:08',
        riskScore: 82,
        status: 'PAUSED',
        direction: 'OUTFLOW',
        signals: ['New recipient', 'Amount anomaly', 'Velocity spike'],
        sender: 'Rahul Sharma (•••• 9031)',
        receiver: 'Account X (•••• 4819)',
        narrative: 'High-value outlier transfer to newly linked beneficiary. System intervened with 4-hour cooling hold.',
      },
    },
    {
      targetId: 'recipient-z',
      targetName: 'Recipient Z',
      targetRole: 'Fast Transit Mule',
      targetType: 'Canara Bank Retail',
      degree: 1,
      riskLevel: 'HIGH',
      riskScore: 76,
      accent: '#fdba74',
      relation: 'ATM Cash-Out Conduit',
      direction: 'OUTFLOW',
      amount: 45000,
      txnCount: 3,
      isSuspicious: true,
      signals: ['Night-time burst', 'High-ratio outflow', 'Device co-location'],
      recentTxn: {
        id: 'TXN-IMPS-410924',
        amount: 45000,
        type: 'IMPS',
        timestamp: '12 Sep 2026 13:14:22',
        riskScore: 76,
        status: 'FLAGGED',
        direction: 'OUTFLOW',
        signals: ['High-ratio outflow', 'Device co-location'],
        sender: 'Rahul Sharma',
        receiver: 'Recipient Z',
        narrative: 'Funds drained within 4 minutes of receipt via Borivali ATM terminal.',
      },
    },
    {
      targetId: 'vikram-logistics',
      targetName: 'Vikram Logistics',
      targetRole: 'Shell Corporate Conduit',
      targetType: 'ICICI Current',
      degree: 1,
      riskLevel: 'HIGH',
      riskScore: 68,
      accent: '#fdba74',
      relation: 'Circular Flow Origin',
      direction: 'INFLOW',
      amount: 120000,
      txnCount: 2,
      isSuspicious: true,
      signals: ['Circular movement', 'Dormant activation'],
      recentTxn: {
        id: 'TXN-NEFT-881290',
        amount: 120000,
        type: 'NEFT',
        timestamp: '11 Sep 2026 19:40:00',
        riskScore: 68,
        status: 'MONITOR',
        direction: 'INFLOW',
        signals: ['Circular flow origin', 'Dormant reactivation'],
        sender: 'Vikram Logistics',
        receiver: 'Rahul Sharma',
        narrative: 'Inbound corporate transfer originating from recently reactivated commercial shell.',
      },
    },
    {
      targetId: 'priya-shah',
      targetName: 'Priya Shah',
      targetRole: 'Verified Individual',
      targetType: 'HDFC Savings',
      degree: 1,
      riskLevel: 'LOW',
      riskScore: 24,
      accent: '#5eead4',
      relation: 'Routine Peer Transfer',
      direction: 'OUTFLOW',
      amount: 15000,
      txnCount: 8,
      isSuspicious: false,
      signals: ['Normal family remittance'],
      recentTxn: {
        id: 'TXN-UPI-109482',
        amount: 15000,
        type: 'UPI',
        timestamp: '10 Sep 2026 11:20:00',
        riskScore: 24,
        status: 'VERIFIED',
        direction: 'OUTFLOW',
        signals: ['Consistent counterparty history'],
        sender: 'Rahul Sharma',
        receiver: 'Priya Shah',
        narrative: 'Verified regular peer-to-peer transfer with consistent 18-month baseline history.',
      },
    },

    // --- DEGREE 2: Suspicious Relationships of Counterparties ---
    {
      targetId: 'account-y',
      targetName: 'Account Y',
      targetRole: 'Secondary Layering Hop',
      targetType: 'HDFC Bank Current',
      degree: 2,
      parentEntityId: 'account-x',
      parentEntityName: 'Account X',
      riskLevel: 'CRITICAL',
      riskScore: 88,
      accent: '#fb7185',
      relation: 'Multi-Hop Layering Chain',
      direction: 'OUTFLOW',
      amount: 24200,
      txnCount: 5,
      isSuspicious: true,
      signals: ['Fan-out layering', 'Drain in <90s', 'Shared shell directorship'],
      recentTxn: {
        id: 'TXN-IMPS-774102',
        amount: 24200,
        type: 'IMPS',
        timestamp: '12 Sep 2026 14:35:12',
        riskScore: 88,
        status: 'FROZEN',
        direction: 'OUTFLOW',
        signals: ['Fan-out layering', 'Drain in <90s'],
        sender: 'Account X',
        receiver: 'Account Y',
        narrative: 'Rapid relay transfer immediately following inbound credit from Rahul Sharma.',
      },
    },
    {
      targetId: 'surat-mule-hub',
      targetName: 'Surat Mule Hub',
      targetRole: 'Syndicate Aggregator',
      targetType: 'Cooperative Bank Conduit',
      degree: 2,
      parentEntityId: 'account-x',
      parentEntityName: 'Account X',
      riskLevel: 'CRITICAL',
      riskScore: 94,
      accent: '#fb7185',
      relation: 'Syndicate Fan-In Concentration',
      direction: 'OUTFLOW',
      amount: 50000,
      txnCount: 12,
      isSuspicious: true,
      signals: ['National cybercrime blacklist', 'Massive fan-in concentration', 'Mule runner network'],
      recentTxn: {
        id: 'TXN-RTGS-554109',
        amount: 50000,
        type: 'RTGS',
        timestamp: '12 Sep 2026 14:38:00',
        riskScore: 94,
        status: 'FROZEN',
        direction: 'OUTFLOW',
        signals: ['Blacklist match', 'Massive fan-in'],
        sender: 'Account X',
        receiver: 'Surat Mule Hub',
        narrative: 'Centralized pooling account for regional digital arrest and task-fraud operations.',
      },
    },
    {
      targetId: 'atm-cashout-borivali',
      targetName: 'ATM Terminal Borivali',
      targetRole: 'Physical Cash Dispenser',
      targetType: 'ATM Network Node',
      degree: 2,
      parentEntityId: 'recipient-z',
      parentEntityName: 'Recipient Z',
      riskLevel: 'CRITICAL',
      riskScore: 92,
      accent: '#fb7185',
      relation: 'Physical Cash Drainage',
      direction: 'OUTFLOW',
      amount: 40000,
      txnCount: 4,
      isSuspicious: true,
      signals: ['Instant ATM withdrawal <180s', 'Split micro-withdrawals'],
      recentTxn: {
        id: 'TXN-ATM-993102',
        amount: 40000,
        type: 'NFS ATM Debit',
        timestamp: '12 Sep 2026 13:18:04',
        riskScore: 92,
        status: 'DISPENSED',
        direction: 'OUTFLOW',
        signals: ['Instant cash draining', 'Mule runner pattern'],
        sender: 'Recipient Z',
        receiver: 'ATM Borivali West Terminal 4',
        narrative: 'Physical cash withdrawal executed 3 minutes and 42 seconds after credit posting.',
      },
    },

    // --- DEGREE 3: Broader Syndicate Ecosystem ---
    {
      targetId: 'crypto-otc-vault',
      targetName: 'Crypto P2P Escrow Vault',
      targetRole: 'Off-Ramp Escrow',
      targetType: 'Virtual Asset Service Provider',
      degree: 3,
      parentEntityId: 'surat-mule-hub',
      parentEntityName: 'Surat Mule Hub',
      riskLevel: 'CRITICAL',
      riskScore: 96,
      accent: '#fb7185',
      relation: 'USDT Cross-Border Liquidation',
      direction: 'OUTFLOW',
      amount: 450000,
      txnCount: 19,
      isSuspicious: true,
      signals: ['Non-custodial wallet sweep', 'P2P Telegram trade escrow', 'Cross-border capital flight'],
      recentTxn: {
        id: 'TXN-CRYPTO-601923',
        amount: 450000,
        type: 'P2P Escrow Hop',
        timestamp: '12 Sep 2026 15:02:11',
        riskScore: 96,
        status: 'INTERCEPTED',
        direction: 'OUTFLOW',
        signals: ['USDT off-ramp conversion', 'Section 12 PMLA enforcement'],
        sender: 'Surat Mule Hub',
        receiver: 'P2P Escrow Desk (USDT-TRC20)',
        narrative: 'Automated conversion of illicit proceeds into non-custodial crypto assets.',
      },
    },
    {
      targetId: 'offshore-trading-corp',
      targetName: 'Pacific Rim Trade Conduits',
      targetRole: 'Foreign Commercial Shell',
      targetType: 'Cross-Border Merchant Rail',
      degree: 3,
      parentEntityId: 'account-y',
      parentEntityName: 'Account Y',
      riskLevel: 'CRITICAL',
      riskScore: 90,
      accent: '#fb7185',
      relation: 'Trade-Based Layering Loop',
      direction: 'OUTFLOW',
      amount: 280000,
      txnCount: 6,
      isSuspicious: true,
      signals: ['Fictitious invoice settlement', 'Cross-border merchant camouflage'],
      recentTxn: {
        id: 'TXN-SWIFT-110942',
        amount: 280000,
        type: 'Cross-Border Outflow',
        timestamp: '12 Sep 2026 15:30:00',
        riskScore: 90,
        status: 'BLOCKED',
        direction: 'OUTFLOW',
        signals: ['Fictitious import declaration'],
        sender: 'Account Y',
        receiver: 'Pacific Rim Trade Conduits',
        narrative: 'Layering transfer halted by automated trade-based money laundering rules.',
      },
    },
    {
      targetId: 'layer-bridge-alpha',
      targetName: 'Layering Conduit Alpha',
      targetRole: 'Circular Bridge Hub',
      targetType: 'Private Bank Corporate',
      degree: 3,
      parentEntityId: 'vikram-logistics',
      parentEntityName: 'Vikram Logistics',
      riskLevel: 'HIGH',
      riskScore: 84,
      accent: '#fdba74',
      relation: 'Circular Loop Closure',
      direction: 'OUTFLOW',
      amount: 110000,
      txnCount: 4,
      isSuspicious: true,
      signals: ['Closed circular ring', 'Smurfing burst'],
      recentTxn: {
        id: 'TXN-RTGS-990142',
        amount: 110000,
        type: 'RTGS',
        timestamp: '11 Sep 2026 21:10:00',
        riskScore: 84,
        status: 'FLAGGED',
        direction: 'OUTFLOW',
        signals: ['Circular cycle completion'],
        sender: 'Vikram Logistics',
        receiver: 'Layering Conduit Alpha',
        narrative: 'Funds routed through secondary loop, returning capital to initial funding vehicle.',
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. ADDITIONAL INVESTIGATIVE ENTITIES
// ---------------------------------------------------------------------------
const SECONDARY_ENTITIES = [
  {
    id: 'account-x',
    name: 'Account X',
    aliases: ['Axis Pass-Through 4819', 'Layering Mule X'],
    type: 'Account',
    role: 'Mule Layering Account',
    category: 'Suspected Pass-Through Mule',
    riskScore: 82,
    riskLevel: 'CRITICAL',
    kycStatus: 'Forged Utility Document / Tier-1',
    upiId: 'layering.x@okaxis',
    phone: '+91 ••••• 8842',
    accountNumber: '•••• •••• 4819',
    bank: 'Axis Bank',
    city: 'Surat, Gujarat',
    totalInflow: 3800000,
    totalOutflow: 3760000,
    accent: '#fb7185',
    activeAlerts: [
      'Account balance maintained below 2% within 120 seconds of receipt',
      'Hardware identifier shared with Rahul Sharma and Account Y',
      'Flagged under Section 1930 Cybercrime Rapid Containment',
    ],
    trustProfile: {
      overall: 38,
      identity: 42,
      kyc: 20,
      contact: 34,
      devices: 28,
      reputation: 19,
      transactions: 25,
      elevatedSignals: [
        { title: 'Zero Average Balance Draining', detail: '98.2% of inbound funds drained in <120 seconds.', severity: 'CRITICAL' },
        { title: 'Shared Device Hardware', detail: 'Observed active on DEVICE-9B42 alongside Rahul Sharma.', severity: 'CRITICAL' },
      ],
    },
    historyIntelligence: {
      aadhaar: { number: '•••• •••• 1928', status: 'UNVERIFIED', linkedMobilesCount: 6, linkedAccountsCount: 5, identityConflicts: 3, conflictDetail: 'Name mismatch on PAN linkage', reputationSignals: 5 },
      pan: { number: '••••• 4910K', status: 'FLAGGED', nameConsistency: '45% Match', kycTier: 'Tier-1 Restricted', linkedAccountsCount: 5, flags: ['Multiple cyber reports'] },
      mobiles: [
        { number: '+91 ••••• 8842', type: 'PRIMARY', status: 'SHARED ASSOCIATION', simAge: '4 months', simOperator: 'Airtel', psp: 'PhonePe', reputation: 'SUSPICIOUS', note: 'Hardware shared with Rahul Sharma' },
      ],
      accounts: [
        { number: '•••• 4819', bank: 'Axis Bank', type: 'Current', status: 'FROZEN', age: '23 days', velocity: 'Rapid drain', balanceRange: '₹840', note: 'Mule transit node' },
      ],
      devices: [
        { id: 'DEVICE-9B42', model: 'Samsung Galaxy S24 Ultra (Android 14)', accountsAssociated: 4, firstObserved: 'Aug 2026', status: 'UNUSUAL REUSE', riskLevel: 'CRITICAL', note: 'Multi-account operation hub', connectedEntities: ['rahul-sharma', 'account-y', 'surat-mule-hub'] },
      ],
      reputation: { source: 'Synthetic Reputation Intelligence', riskScore: 86, communityReportsCount: 14, cfcfrms1930Match: true, lastReportDate: '12 Sep 2026', reputationTags: ['National Mule Network Match', 'CFCFRMS High Risk'] },
    },
    connections: [],
  },

  {
    id: 'deepak-layering-account',
    name: 'Deepak Layering Account',
    aliases: ['acc_mule_axis', 'Deepak Yadav Layering'],
    type: 'Account',
    role: 'Mule Account',
    category: 'Frozen / Kill-Switched Account',
    riskScore: 98,
    riskLevel: 'CRITICAL',
    kycStatus: 'Nationwide Suspended',
    upiId: 'deepak.layer@okaxis',
    phone: '+91 ••••• 7712',
    accountNumber: '•••• •••• 5590',
    bank: 'Axis Bank',
    city: 'Ahmedabad, Gujarat',
    totalInflow: 9285000,
    totalOutflow: 9190000,
    accent: '#fb7185',
    activeAlerts: [
      'Kill-switch triggered across 14 beneficiary banks',
      'Section 12 PMLA enforcement hold posted to CBS ledger',
      'I4C CFCFRMS 1930 Hotlist Priority 1 Match',
    ],
    trustProfile: {
      overall: 12,
      identity: 18,
      kyc: 10,
      contact: 15,
      devices: 14,
      reputation: 8,
      transactions: 9,
      elevatedSignals: [
        { title: 'Immediate Cash-Out Dispersion', detail: 'Average fund retention time 84 seconds.', severity: 'CRITICAL' },
        { title: 'Nationwide Kill-Switch', detail: 'Account completely frozen following 1930 reporting.', severity: 'CRITICAL' },
      ],
    },
    historyIntelligence: {
      aadhaar: { number: '•••• •••• 9901', status: 'SUSPENDED', linkedMobilesCount: 8, linkedAccountsCount: 9, identityConflicts: 4, conflictDetail: 'Blacklisted in Ministry of Home Affairs I4C registry', reputationSignals: 12 },
      pan: { number: '••••• 3319P', status: 'SUSPENDED', nameConsistency: '30% Match', kycTier: 'Defunct', linkedAccountsCount: 9, flags: ['Involved in cyber-syndicate laundering'] },
      mobiles: [
        { number: '+91 ••••• 7712', type: 'PRIMARY', status: 'BLOCKED', simAge: '2 months', simOperator: 'Jio', psp: 'GPay', reputation: 'CRITICAL', note: 'National cybercrime blacklist' },
      ],
      accounts: [
        { number: '•••• 5590', bank: 'Axis Bank', type: 'Current', status: 'FROZEN', age: '1.5 months', velocity: 'Dispersal <90s', balanceRange: '₹0 (Frozen)', note: 'Kill-switched node' },
      ],
      devices: [
        { id: 'DEVICE-77A1', model: 'Redmi Note 12 (Android 13)', accountsAssociated: 6, firstObserved: 'Jul 2026', status: 'SYNDICATE RUNNER', riskLevel: 'CRITICAL', note: 'Operated by runner team in Ahmedabad', connectedEntities: [] },
      ],
      reputation: { source: 'Synthetic Reputation Intelligence', riskScore: 98, communityReportsCount: 29, cfcfrms1930Match: true, lastReportDate: '12 Sep 2026', reputationTags: ['I4C CFCFRMS Active Freeze', 'Syndicate Layering Hub'] },
    },
    connections: [],
  },

  {
    id: 'kabir-singhania',
    name: 'Kabir Singhania',
    aliases: ['K. Singhania', 'Singhania FZE'],
    type: 'Individual',
    role: 'Target Entity',
    category: 'High Net-Worth / Corporate Hub',
    riskScore: 84,
    riskLevel: 'CRITICAL',
    kycStatus: 'Tier-2 Comprehensive',
    upiId: 'kabir.singhania@okhdfcbank',
    phone: '+91 ••••• 4410',
    accountNumber: '•••• •••• 7122',
    bank: 'HDFC Bank',
    city: 'New Delhi, NCR',
    totalInflow: 48500000,
    totalOutflow: 46200000,
    accent: '#fb7185',
    activeAlerts: [
      'Multi-crore high-volume settlement hops across OTC vaults',
      'Layered corporate shells with overlapping beneficial ownership',
    ],
    trustProfile: {
      overall: 48,
      identity: 88,
      kyc: 94,
      contact: 52,
      devices: 46,
      reputation: 35,
      transactions: 40,
      elevatedSignals: [
        { title: 'High-Volume Layering', detail: 'Over ₹4.5 Crores structured into micro-lots.', severity: 'CRITICAL' },
        { title: 'Offshore Escrow Links', detail: 'Direct transfers into crypto OTC liquidity pools.', severity: 'HIGH' },
      ],
    },
    historyIntelligence: {
      aadhaar: { number: '•••• •••• 6012', status: 'VERIFIED', linkedMobilesCount: 3, linkedAccountsCount: 6, identityConflicts: 0, conflictDetail: 'None', reputationSignals: 3 },
      pan: { number: '••••• 1009M', status: 'VERIFIED', nameConsistency: '99% Match', kycTier: 'Tier-2 Verified', linkedAccountsCount: 6, flags: ['Multiple overseas remittances reported'] },
      mobiles: [
        { number: '+91 ••••• 4410', type: 'PRIMARY', status: 'VERIFIED', simAge: '5.4 years', simOperator: 'Airtel', psp: 'HDFC PayZapp', reputation: 'NORMAL', note: 'Executive SIM' },
      ],
      accounts: [
        { number: '•••• 7122', bank: 'HDFC Bank', type: 'Corporate Current', status: 'ACTIVE', age: '6.2 years', velocity: 'High volume', balanceRange: '₹42 Lakh', note: 'Primary business entity' },
      ],
      devices: [
        { id: 'DEVICE-33C9', model: 'Apple iPhone 16 Pro Max', accountsAssociated: 2, firstObserved: 'Sep 2026', status: 'NORMAL', riskLevel: 'LOW', note: 'Primary terminal', connectedEntities: [] },
      ],
      reputation: { source: 'Synthetic Reputation Intelligence', riskScore: 84, communityReportsCount: 4, cfcfrms1930Match: false, lastReportDate: '10 Sep 2026', reputationTags: ['High Volume Hawala Flag', 'Cross-Border OTC Monitor'] },
    },
    connections: [],
  },

  {
    id: 'aarav-sharma',
    name: 'Aarav Sharma',
    aliases: ['acc_aarav_sbi'],
    type: 'Individual',
    role: 'User',
    category: 'Retail Account',
    riskScore: 22,
    riskLevel: 'LOW',
    kycStatus: 'KYC On File',
    upiId: 'aarav@oksbi',
    phone: '+91 ••••• 5521',
    accountNumber: '•••• •••• 3019',
    bank: 'State Bank of India',
    city: 'Pune, Maharashtra',
    totalInflow: 185000,
    totalOutflow: 142000,
    accent: '#5eead4',
    activeAlerts: [],
    trustProfile: {
      overall: 88,
      identity: 95,
      kyc: 100,
      contact: 84,
      devices: 90,
      reputation: 82,
      transactions: 85,
      elevatedSignals: [],
    },
    historyIntelligence: {
      aadhaar: { number: '•••• •••• 7741', status: 'VERIFIED', linkedMobilesCount: 1, linkedAccountsCount: 2, identityConflicts: 0, conflictDetail: 'None', reputationSignals: 0 },
      pan: { number: '••••• 9920A', status: 'VERIFIED', nameConsistency: '100% Match', kycTier: 'Tier-2 Verified', linkedAccountsCount: 2, flags: [] },
      mobiles: [
        { number: '+91 ••••• 5521', type: 'PRIMARY', status: 'VERIFIED', simAge: '4.8 years', simOperator: 'Jio', psp: 'GPay', reputation: 'CLEAN', note: 'Standard personal contact' },
      ],
      accounts: [
        { number: '•••• 3019', bank: 'State Bank of India', type: 'Savings', status: 'ACTIVE', age: '5.1 years', velocity: 'Normal', balanceRange: '₹42,000', note: 'Routine personal account' },
      ],
      devices: [
        { id: 'DEVICE-11A0', model: 'Google Pixel 8', accountsAssociated: 1, firstObserved: 'Oct 2024', status: 'CLEAN', riskLevel: 'LOW', note: 'Single-user personal device', connectedEntities: [] },
      ],
      reputation: { source: 'Synthetic Reputation Intelligence', riskScore: 12, communityReportsCount: 0, cfcfrms1930Match: false, lastReportDate: 'None', reputationTags: ['Clean Consumer Baseline'] },
    },
    connections: [],
  },
];

// ---------------------------------------------------------------------------
// 3. PROCEDURAL GENERATION: UP TO 105 RICH SYNTHETIC ENTITIES
// ---------------------------------------------------------------------------
const FIRST_NAMES = [
  'Amit', 'Priya', 'Ramesh', 'Neha', 'Vikram', 'Anjali', 'Rohit', 'Sunita',
  'Suresh', 'Geeta', 'Manoj', 'Pooja', 'Ashok', 'Kavita', 'Sanjay', 'Rekha',
  'Deepak', 'Meena', 'Rahul', 'Swati', 'Rajesh', 'Divya', 'Kiran', 'Shalini',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Yadav', 'Gupta', 'Singh', 'Kapoor', 'Reddy',
  'Nair', 'Iyer', 'Rao', 'Chauhan', 'Shah', 'Mehta', 'Joshi', 'Bose',
];

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra Bank'];
const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Pune', 'Kolkata', 'Surat', 'Jaipur', 'Lucknow'];

function buildSyntheticEcosystem() {
  const registry = {};

  // 1. Insert Rahul Sharma first
  registry[RAHUL_SHARMA_ENTITY.id] = { ...RAHUL_SHARMA_ENTITY };

  // 2. Insert secondary curated entities
  SECONDARY_ENTITIES.forEach((e) => {
    registry[e.id] = { ...e };
  });

  // Wire back-links for Rahul's degree connections into registry so counterparties exist as full entities
  RAHUL_SHARMA_ENTITY.connections.forEach((conn) => {
    if (!registry[conn.targetId]) {
      const isCrit = conn.riskScore >= 80;
      const isHigh = conn.riskScore >= 65;
      const riskLevel = isCrit ? 'CRITICAL' : isHigh ? 'HIGH' : conn.riskScore >= 35 ? 'MEDIUM' : 'LOW';

      registry[conn.targetId] = {
        id: conn.targetId,
        name: conn.targetName,
        aliases: [conn.targetName],
        type: conn.targetType.includes('Current') || conn.targetType.includes('Vault') ? 'Account' : 'Individual',
        role: conn.targetRole,
        category: conn.targetType,
        riskScore: conn.riskScore,
        riskLevel,
        kycStatus: isCrit ? 'Suspect Address / Unverified' : 'KYC On File',
        upiId: `${conn.targetId.replace(/[^a-zA-Z0-9]/g, '')}@okaxis`,
        phone: `+91 ••••• ${1000 + (conn.riskScore * 37) % 8999}`,
        accountNumber: `•••• •••• ${2000 + (conn.riskScore * 61) % 7999}`,
        bank: 'Axis Bank',
        city: 'Surat, Gujarat',
        totalInflow: conn.amount * 18,
        totalOutflow: conn.amount * 17.5,
        accent: conn.accent,
        activeAlerts: conn.signals || [],
        trustProfile: {
          overall: 100 - conn.riskScore,
          identity: 60,
          kyc: 50,
          contact: 45,
          devices: 40,
          reputation: 35,
          transactions: 100 - conn.riskScore,
          elevatedSignals: (conn.signals || []).map((s) => ({ title: s, detail: `Automated detection trigger on ${conn.targetName}`, severity: isCrit ? 'CRITICAL' : 'HIGH' })),
        },
        historyIntelligence: {
          aadhaar: { number: `•••• •••• ${4000 + (conn.riskScore * 41) % 5000}`, status: isCrit ? 'FLAGGED' : 'VERIFIED', linkedMobilesCount: 3, linkedAccountsCount: 4, identityConflicts: isCrit ? 2 : 0, conflictDetail: isCrit ? 'Suspect CKYC record' : 'None', reputationSignals: isCrit ? 4 : 0 },
          pan: { number: `••••• ${7000 + (conn.riskScore * 29) % 2000}X`, status: isCrit ? 'FLAGGED' : 'VERIFIED', nameConsistency: isCrit ? '62% Match' : '98% Match', kycTier: 'Tier-1', linkedAccountsCount: 3, flags: conn.signals || [] },
          mobiles: [
            { number: `+91 ••••• ${1000 + (conn.riskScore * 37) % 8999}`, type: 'PRIMARY', status: isCrit ? 'SUSPICIOUS' : 'VERIFIED', simAge: '1.2 yrs', simOperator: 'Airtel', psp: 'GPay', reputation: isCrit ? 'SUSPICIOUS' : 'CLEAN', note: 'Observed in transaction trails' },
          ],
          accounts: [
            { number: `•••• ${2000 + (conn.riskScore * 61) % 7999}`, bank: 'Axis Bank', type: 'Current Account', status: isCrit ? 'SUSPECTED MULE' : 'ACTIVE', age: '4 months', velocity: 'High turnover', balanceRange: '₹4,200', note: 'Transit node' },
          ],
          devices: [
            { id: `DEVICE-${(conn.riskScore * 13).toString(16).toUpperCase().slice(0, 4)}`, model: 'Android 14 (Generic)', accountsAssociated: isCrit ? 3 : 1, firstObserved: 'Aug 2026', status: isCrit ? 'UNUSUAL REUSE' : 'NORMAL', riskLevel: isCrit ? 'HIGH' : 'LOW', note: 'Telemetry node', connectedEntities: ['rahul-sharma'] },
          ],
          reputation: { source: 'Synthetic Reputation Intelligence', riskScore: conn.riskScore, communityReportsCount: isCrit ? 5 : 0, cfcfrms1930Match: isCrit, lastReportDate: '12 Sep 2026', reputationTags: conn.signals || [] },
        },
        connections: [
          {
            targetId: 'rahul-sharma',
            targetName: 'Rahul Sharma',
            targetRole: 'Target Entity',
            targetType: 'Retail Account',
            degree: 1,
            riskLevel: 'HIGH',
            riskScore: 78,
            accent: '#fdba74',
            relation: conn.relation,
            direction: conn.direction === 'OUTFLOW' ? 'INFLOW' : 'OUTFLOW',
            amount: conn.amount,
            txnCount: conn.txnCount,
            recentTxn: conn.recentTxn,
          },
        ],
      };
    }
  });

  // 3. Fill up to 105 entities for dense 3D universe exploration
  // Note: (fName, lName) pairs cycle with period lcm(FIRST_NAMES.length, LAST_NAMES.length),
  // so the number of unique generated ids is bounded — cap genIndex to that period
  // (times a small safety margin) to guarantee termination instead of looping on a
  // target entity count that may be unreachable.
  const maxGenIndex = FIRST_NAMES.length * LAST_NAMES.length;
  let genIndex = 0;
  while (Object.keys(registry).length < 108 && genIndex < maxGenIndex) {
    const fName = FIRST_NAMES[genIndex % FIRST_NAMES.length];
    const lName = LAST_NAMES[(genIndex * 3 + 7) % LAST_NAMES.length];
    const name = `${fName} ${lName}`;
    const id = name.toLowerCase().replace(/\s+/g, '-');

    if (!registry[id]) {
      const bank = BANKS[genIndex % BANKS.length];
      const city = CITIES[genIndex % CITIES.length];
      const riskScore = Math.min(96, Math.max(12, ((genIndex * 19 + 7) % 85) + 12));
      const isCrit = riskScore >= 80;
      const isHigh = riskScore >= 65;
      const isMed = riskScore >= 35;
      const riskLevel = isCrit ? 'CRITICAL' : isHigh ? 'HIGH' : isMed ? 'MEDIUM' : 'LOW';
      const accent = isCrit ? RISK_COLORS.FREEZE : isHigh ? RISK_COLORS.COACH : isMed ? RISK_COLORS.STEP_UP : RISK_COLORS.ALLOW;

      const isMerchant = genIndex % 4 === 0;
      const role = isMerchant ? 'Merchant' : isCrit ? 'Mule Account' : 'User';
      const category = isMerchant ? 'Verified Merchant' : isCrit ? 'Suspicious Mule Pass-Through' : 'Retail Banking Customer';

      const baseAmt = isCrit ? 3500000 + (genIndex * 450000) : 450000 + (genIndex * 95000);

      registry[id] = {
        id,
        name: isMerchant ? `${name} General Store` : name,
        aliases: [`${fName[0]}. ${lName}`],
        type: isMerchant ? 'Merchant' : 'Individual',
        role,
        category,
        riskScore,
        riskLevel,
        kycStatus: isCrit ? 'Suspect Address Proof' : 'Aadhaar & PAN KYC Verified',
        upiId: `${fName.toLowerCase()}.${lName.toLowerCase()}@${bank.toLowerCase().split(' ')[0]}`,
        phone: `+91 ••••• ${1000 + (genIndex * 73) % 8999}`,
        accountNumber: `•••• •••• ${1000 + (genIndex * 89) % 8999}`,
        bank,
        city,
        totalInflow: baseAmt,
        totalOutflow: Math.floor(baseAmt * (isCrit ? 0.98 : 0.88)),
        accent,
        activeAlerts: isCrit
          ? ['Velocity spike 3.8× above baseline', 'Instant cash drainage detected']
          : isHigh
          ? ['Unusual counterparty concentration']
          : [],
        trustProfile: {
          overall: 100 - riskScore,
          identity: Math.max(30, 95 - (riskScore > 70 ? 35 : 5)),
          kyc: isCrit ? 40 : 100,
          contact: Math.max(35, 90 - (riskScore > 60 ? 30 : 5)),
          devices: Math.max(30, 92 - (riskScore > 60 ? 40 : 0)),
          reputation: Math.max(20, 95 - riskScore),
          transactions: 100 - riskScore,
          elevatedSignals: isCrit
            ? [
                { title: 'High Inflow Velocity', detail: 'Rapid aggregation pattern observed across multiple senders.', severity: 'CRITICAL' },
                { title: 'Pass-Through Drain', detail: 'Funds transferred out in under 180 seconds of receipt.', severity: 'HIGH' },
              ]
            : [],
        },
        historyIntelligence: {
          aadhaar: { number: `•••• •••• ${1000 + (genIndex * 43) % 8999}`, status: isCrit ? 'FLAGGED' : 'VERIFIED', linkedMobilesCount: isCrit ? 4 : 1, linkedAccountsCount: isCrit ? 5 : 2, identityConflicts: isCrit ? 1 : 0, conflictDetail: isCrit ? 'Name variation in bank PAN record' : 'None', reputationSignals: isCrit ? 3 : 0 },
          pan: { number: `••••• ${1000 + (genIndex * 31) % 8999}P`, status: isCrit ? 'FLAGGED' : 'VERIFIED', nameConsistency: isCrit ? '74% Match' : '99% Match', kycTier: 'Tier-2', linkedAccountsCount: 2, flags: [] },
          mobiles: [
            { number: `+91 ••••• ${1000 + (genIndex * 73) % 8999}`, type: 'PRIMARY', status: 'VERIFIED', simAge: '2.5 yrs', simOperator: 'Jio', psp: 'UPI', reputation: isCrit ? 'SUSPICIOUS' : 'CLEAN', note: 'Registered mobile' },
          ],
          accounts: [
            { number: `•••• ${1000 + (genIndex * 89) % 8999}`, bank, type: 'Savings', status: 'ACTIVE', age: '3 yrs', velocity: 'Normal', balanceRange: '₹35,000', note: 'Standard retail account' },
          ],
          devices: [
            { id: `DEVICE-${(genIndex * 29).toString(16).toUpperCase().padStart(4, '0')}`, model: 'Android Phone', accountsAssociated: isCrit ? 3 : 1, firstObserved: 'Aug 2026', status: isCrit ? 'UNUSUAL REUSE' : 'CLEAN', riskLevel: isCrit ? 'HIGH' : 'LOW', note: 'Primary terminal', connectedEntities: [] },
          ],
          reputation: { source: 'Synthetic Reputation Intelligence', riskScore, communityReportsCount: isCrit ? 3 : 0, cfcfrms1930Match: isCrit, lastReportDate: '10 Sep 2026', reputationTags: isCrit ? ['Elevated Risk Telemetry'] : ['Normal Baseline'] },
        },
        connections: [],
      };
    }
    genIndex++;
  }

  // Connect procedural entities to 3-6 neighbors
  const allIds = Object.keys(registry);
  allIds.forEach((srcId, idx) => {
    const src = registry[srcId];
    if (src.connections.length > 0) return;

    const connCount = 3 + (idx % 4);
    const chosen = new Set();
    for (let c = 0; chosen.size < connCount && c < 20; c++) {
      const tgtId = allIds[(idx + c * 7 + 1) % allIds.length];
      if (tgtId !== srcId) chosen.add(tgtId);
    }

    src.connections = Array.from(chosen).map((tgtId, cIdx) => {
      const tgt = registry[tgtId] || registry['rahul-sharma'];
      const amt = 12000 + ((idx + cIdx) * 8500) % 75000;
      const isSusp = tgt.riskScore >= 75 || src.riskScore >= 75;
      const dir = (idx + cIdx) % 2 === 0 ? 'OUTFLOW' : 'INFLOW';

      return {
        targetId: tgt.id,
        targetName: tgt.name,
        targetRole: tgt.role,
        targetType: tgt.category,
        degree: 1,
        riskLevel: tgt.riskLevel,
        riskScore: tgt.riskScore,
        accent: tgt.accent,
        relation: tgt.role === 'Merchant' ? 'Merchant Payment' : isSusp ? 'Suspect Relay Conduit' : 'Routine Peer Transfer',
        direction: dir,
        amount: amt,
        txnCount: 2 + ((idx + cIdx) % 7),
        isSuspicious: isSusp,
        signals: isSusp ? ['Unusual velocity surge', 'Counterparty alert'] : ['Routine peer exchange'],
        recentTxn: {
          id: `TXN-UPI-${10000 + (idx * 23 + cIdx * 19) % 89999}`,
          amount: amt,
          type: 'UPI',
          timestamp: '12 Sep 2026 12:45:00',
          riskScore: tgt.riskScore,
          status: isSusp ? 'FLAGGED' : 'VERIFIED',
          direction: dir,
          signals: isSusp ? ['Velocity surge'] : ['Routine verified'],
          sender: dir === 'OUTFLOW' ? src.name : tgt.name,
          receiver: dir === 'OUTFLOW' ? tgt.name : src.name,
          narrative: isSusp ? 'Elevated velocity transaction flagged for review.' : 'Routine verified transfer.',
        },
      };
    });
  });

  return registry;
}

// Populate self-contained rich synthetic entities synchronously at module load
export const SYNTHETIC_ENTITIES = buildSyntheticEcosystem();

// ---------------------------------------------------------------------------
// 4. LIVE EVENT / BACKEND OVERLAY (SSE)
// ---------------------------------------------------------------------------
const liveEventListeners = new Set();
let streamOpened = false;

export function onLiveEvent(fn) {
  liveEventListeners.add(fn);
  return () => liveEventListeners.delete(fn);
}

export function applyEvent(ev, { silent = false } = {}) {
  if (!ev || !ev.node) return;
  const node = ev.node;
  const entity = SYNTHETIC_ENTITIES[node.id] || SYNTHETIC_ENTITIES['deepak-layering-account'];
  if (entity) {
    if (node.risk_score !== undefined) {
      entity.riskScore = Math.round(node.risk_score * 100);
      entity.riskLevel = entity.riskScore >= 80 ? 'CRITICAL' : entity.riskScore >= 65 ? 'HIGH' : entity.riskScore >= 35 ? 'MEDIUM' : 'LOW';
      entity.accent = entity.riskLevel === 'CRITICAL' ? RISK_COLORS.FREEZE : entity.riskLevel === 'HIGH' ? RISK_COLORS.COACH : RISK_COLORS.ALLOW;
    }
  }

  if (!silent) {
    for (const fn of liveEventListeners) {
      try {
        fn(ev);
      } catch {}
    }
  }
}

export function openLiveStream() {
  if (streamOpened || typeof EventSource === 'undefined') return;
  streamOpened = true;
  try {
    const source = new EventSource('http://localhost:8000/api/ecosystem/stream/events');
    source.onmessage = (msg) => {
      try {
        applyEvent(JSON.parse(msg.data));
      } catch {}
    };
    source.onerror = () => {};
    return () => source.close();
  } catch {}
}

export function loadRegistrySnapshot() {
  return Promise.resolve(SYNTHETIC_ENTITIES);
}

// ---------------------------------------------------------------------------
// 5. QUERY & SEARCH UTILITIES
// ---------------------------------------------------------------------------

export function getNetworkForEntity(query) {
  const all = SYNTHETIC_ENTITIES;
  const keys = Object.keys(all);
  if (keys.length === 0) return null;

  if (!query || typeof query !== 'string') {
    return all['rahul-sharma'] || all[keys[0]];
  }

  const clean = query.trim().toLowerCase();

  if (all[clean]) return all[clean];

  for (const key of keys) {
    const e = all[key];
    if (e.name.toLowerCase() === clean) return e;
  }

  for (const key of keys) {
    const e = all[key];
    if (e.upiId && e.upiId.toLowerCase() === clean) return e;
  }

  for (const key of keys) {
    const e = all[key];
    if (
      e.name.toLowerCase().includes(clean) ||
      e.id.toLowerCase().includes(clean) ||
      (e.upiId && e.upiId.toLowerCase().includes(clean)) ||
      (e.aliases && e.aliases.some((a) => a.toLowerCase().includes(clean)))
    ) {
      return e;
    }
  }

  return all['rahul-sharma'] || all[keys[0]];
}

export function searchEntities(query) {
  const all = Object.values(SYNTHETIC_ENTITIES);

  if (!query || query.trim().length === 0) {
    return [
      all.find((e) => e.id === 'rahul-sharma'),
      all.find((e) => e.id === 'account-x'),
      all.find((e) => e.id === 'deepak-layering-account'),
      all.find((e) => e.id === 'kabir-singhania'),
      all.find((e) => e.id === 'aarav-sharma'),
      ...all.slice(5, 12),
    ]
      .filter(Boolean)
      .map(toSuggestion);
  }

  const q = query.toLowerCase().trim();
  return all
    .filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.upiId && e.upiId.toLowerCase().includes(q)) ||
        (e.city && e.city.toLowerCase().includes(q)) ||
        (e.aliases && e.aliases.some((a) => a.toLowerCase().includes(q)))
    )
    .slice(0, 12)
    .map(toSuggestion);
}

function toSuggestion(e) {
  return {
    id: e.id,
    name: e.name,
    role: e.role,
    category: e.category,
    riskLevel: e.riskLevel,
    riskScore: e.riskScore,
    totalInflow: e.totalInflow,
    accent: e.accent,
  };
}
