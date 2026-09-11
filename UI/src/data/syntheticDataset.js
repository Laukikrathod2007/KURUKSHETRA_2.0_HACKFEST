/**
 * Kurukshetra Synthetic Transaction Intelligence Dataset
 * 100+ interconnected entities with multi-crore transactions, money mule syndicates,
 * shell corporations, crypto OTC desks, payment aggregators, and high-net-worth individuals.
 */

// Curated Primary Nodes with rich custom AML topologies
const PRIMARY_ENTITIES = [
  {
    id: 'kabir-singhania',
    name: 'Kabir Singhania',
    aliases: ['Singhania Global', 'K.S. Holdings'],
    type: 'Individual',
    role: 'Target Entity',
    category: 'Hawala Coordinator / Shell Director',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    kycStatus: 'Forged Identity Documents (Flagged)',
    upiId: 'singhania.trust@axisbank',
    phone: '+91 98200 91823',
    accountNumber: '•••• •••• 9102',
    bank: 'Axis Bank Corp',
    city: 'Mumbai, MH',
    totalInflow: 485000000, // ₹48.5 Crore
    totalOutflow: 481000000,
    activeAlerts: [
      'Multi-tier layering across 12 offshore shell entities',
      'Rapid transfer of ₹14.8 Crore to Dubai OTC crypto desk',
      'High-velocity structuring across 8 mule accounts within 1 hour',
    ],
    accent: '#ef4444',
  },
  {
    id: 'rahul-sharma',
    name: 'Rahul Sharma',
    aliases: ['Rahul S.', 'RS Tech Trading'],
    type: 'Individual',
    role: 'Target Entity',
    category: 'Mule Nexus / High Velocity Hub',
    riskScore: 86,
    riskLevel: 'HIGH',
    kycStatus: 'Tier-1 Verified (Suspect Device ID)',
    upiId: 'rahul.sharma@okaxis',
    phone: '+91 98201 44829',
    accountNumber: '•••• •••• 4092',
    bank: 'Axis Bank',
    city: 'Mumbai, MH',
    totalInflow: 48200000, // ₹4.82 Crore
    totalOutflow: 47950000,
    activeAlerts: [
      'Rapid velocity: 18 transactions within 20 minutes',
      'Smurfing pattern detected: Multi-account batch splitting',
      'Direct pipeline link to high-risk Crypto Desk',
    ],
    accent: '#f43f5e',
  },
  {
    id: 'vikram-malhotra',
    name: 'Vikram Malhotra',
    aliases: ['V. Malhotra', 'Zenith Logistics Director'],
    type: 'Individual',
    role: 'Target Entity',
    category: 'Shell Company Director / Layering',
    riskScore: 91,
    riskLevel: 'CRITICAL',
    kycStatus: 'Discrepancy (Shell Company Address)',
    upiId: 'zenith.corp@hdfcbank',
    phone: '+91 97118 90311',
    accountNumber: '•••• •••• 8812',
    bank: 'HDFC Bank',
    city: 'New Delhi, DL',
    totalInflow: 189000000, // ₹18.9 Crore
    totalOutflow: 187500000,
    activeAlerts: [
      'Circular funds movement through 6 intermediate holding accounts',
      'Dormant corporate account sudden volume surge (>12,000%)',
    ],
    accent: '#ef4444',
  },
  {
    id: 'priya-shah',
    name: 'Priya Shah',
    aliases: ['Priya S.'],
    type: 'Individual',
    role: 'User',
    category: 'Salaried Tech Lead',
    riskScore: 12,
    riskLevel: 'LOW',
    kycStatus: 'Fully Verified (Aadhaar & PAN Linked)',
    upiId: 'priya.shah@okhdfcbank',
    phone: '+91 99870 12345',
    accountNumber: '•••• •••• 1928',
    bank: 'HDFC Bank',
    city: 'Bengaluru, KA',
    totalInflow: 4200000, // ₹42 Lakhs
    totalOutflow: 3850000,
    activeAlerts: [],
    accent: '#10b981',
  },
  {
    id: 'crypto-otc-vault',
    name: 'Dubai OTC Vault Alpha',
    aliases: ['Prime OTC Liquidity', 'Vault 9X'],
    type: 'Corporate',
    role: 'Crypto Gateway',
    category: 'Offshore P2P Liquidation Desk',
    riskScore: 98,
    riskLevel: 'CRITICAL',
    kycStatus: 'Offshore Free-Zone Entity (No Indian KYC)',
    upiId: 'otc.settle@uaebank',
    phone: '+971 4 881 9200',
    accountNumber: '•••• •••• 0091',
    bank: 'Emirates NBD Escrow',
    city: 'Dubai, UAE',
    totalInflow: 850000000, // ₹85 Crore
    totalOutflow: 849000000,
    activeAlerts: [
      'Mixer-derived USDT liquidations',
      'Cross-border high-frequency INR to crypto conduit',
    ],
    accent: '#ec4899',
  },
  {
    id: 'zenith-logistics',
    name: 'Zenith Global Logistics Ltd',
    aliases: ['Zenith Cargo', 'ZGL Trust'],
    type: 'Corporate',
    role: 'Shell Entity',
    category: 'Trade-Based Money Laundering',
    riskScore: 89,
    riskLevel: 'HIGH',
    kycStatus: 'GST Registered (Ghost Invoicing Flag)',
    upiId: 'zenith.ops@icici',
    phone: '+91 11 4109 2200',
    accountNumber: '•••• •••• 7719',
    bank: 'ICICI Commercial',
    city: 'Gurugram, HR',
    totalInflow: 142000000, // ₹14.2 Crore
    totalOutflow: 141000000,
    activeAlerts: ['Over-invoicing export remittance pattern'],
    accent: '#f59e0b',
  },
  {
    id: 'merchant-a',
    name: 'Merchant A (KwikPay Corp)',
    aliases: ['KwikPay Aggregator', 'M-A Digital'],
    type: 'Merchant',
    role: 'Payment Aggregator',
    category: 'High-Volume Aggregator',
    riskScore: 45,
    riskLevel: 'MEDIUM',
    kycStatus: 'Corporate GST & RBI PA License',
    upiId: 'settle@kwikpaycorp',
    phone: '+91 22 6601 8800',
    accountNumber: '•••• •••• 9931',
    bank: 'Kotak Mahindra Bank',
    city: 'Mumbai, MH',
    totalInflow: 640000000, // ₹64 Crore
    totalOutflow: 638000000,
    activeAlerts: ['High chargeback ratio in sub-merchant cohort'],
    accent: '#f59e0b',
  },
  {
    id: 'surat-mule-hub',
    name: 'Surat Smurfing Syndicate #03',
    aliases: ['Diamond Trading Acct 4', 'Surat Cash Hop'],
    type: 'Account',
    role: 'Mule Account',
    category: 'Layering Ring Node',
    riskScore: 95,
    riskLevel: 'CRITICAL',
    kycStatus: 'Mule Profile (Identity Theft)',
    upiId: 'surat.hop@yesbank',
    phone: '+91 94281 55012',
    accountNumber: '•••• •••• 3340',
    bank: 'Yes Bank',
    city: 'Surat, GJ',
    totalInflow: 92000000, // ₹9.2 Crore
    totalOutflow: 91900000,
    activeAlerts: ['Zero balance retention with sub-30-second pass-through velocity'],
    accent: '#ef4444',
  },
  {
    id: 'aarav-mehta',
    name: 'Aarav Mehta',
    aliases: ['Aarav M.', 'Mehta Angel Ventures'],
    type: 'Individual',
    role: 'User',
    category: 'HNI Tech Investor',
    riskScore: 18,
    riskLevel: 'LOW',
    kycStatus: 'High Net Worth Verified (HNW Tier-A)',
    upiId: 'aarav.mehta@scb',
    phone: '+91 98110 33490',
    accountNumber: '•••• •••• 6610',
    bank: 'Standard Chartered',
    city: 'Mumbai, MH',
    totalInflow: 125000000, // ₹12.5 Crore
    totalOutflow: 95000000,
    activeAlerts: [],
    accent: '#38bdf8',
  },
];

// Names database for procedurally generated network entities
const FIRST_NAMES = [
  'Amit', 'Neha', 'Rohan', 'Ananya', 'Sameer', 'Pooja', 'Deepak', 'Sneha',
  'Aditya', 'Meera', 'Kavita', 'Rajesh', 'Suresh', 'Manish', 'Divya', 'Kunal',
  'Alok', 'Swati', 'Gaurav', 'Ishita', 'Arjun', 'Tanvi', 'Varun', 'Shweta',
  'Kiran', 'Nikhil', 'Pankaj', 'Ritu', 'Mohit', 'Preeti', 'Harish', 'Sunita',
  'Vikas', 'Rashmi', 'Sanjay', 'Geeta', 'Anand', 'Shilpa', 'Chetan', 'Jyoti',
  'Pradeep', 'Bhavna', 'Mayank', 'Simran', 'Ashok', 'Komal', 'Tushar', 'Ruchi',
  'Bhavesh', 'Monika', 'Lalit', 'Aarti', 'Mukesh', 'Pallavi', 'Hemant', 'Seema',
  'Tarun', 'Archana', 'Naveen', 'Payal', 'Dharmesh', 'Richa', 'Sachin', 'Urmila',
];

const LAST_NAMES = [
  'Verma', 'Patil', 'Gupta', 'Singh', 'Deshmukh', 'Chopra', 'Kapoor', 'Reddy',
  'Iyer', 'Bansal', 'Nair', 'Agarwal', 'Jain', 'Mehta', 'Kulkarni', 'Joshi',
  'Saxena', 'Mishra', 'Pandey', 'Bhatia', 'Malik', 'Khanna', 'Gill', 'Thakur',
  'Rao', 'Dubey', 'Trivedi', 'Yadav', 'Goyal', 'Bose', 'Chatterjee', 'Mukherjee',
  'Sengupta', 'Pillai', 'Ranganathan', 'Shetty', 'Hegde', 'Kamath', 'Pai', 'Kamat',
];

const ROLES = [
  { role: 'User', type: 'Individual', category: 'Retail P2P User', riskLevel: 'LOW', riskBase: 15, accent: '#c084fc' },
  { role: 'User', type: 'Individual', category: 'Layering Associate', riskLevel: 'HIGH', riskBase: 76, accent: '#f43f5e' },
  { role: 'Merchant', type: 'Merchant', category: 'Digital Aggregator', riskLevel: 'MEDIUM', riskBase: 44, accent: '#f59e0b' },
  { role: 'Account', type: 'Account', category: 'Mule Holding Account', riskLevel: 'CRITICAL', riskBase: 92, accent: '#ef4444' },
  { role: 'Account', type: 'Account', category: 'Escrow Account', riskLevel: 'MEDIUM', riskBase: 50, accent: '#38bdf8' },
  { role: 'Corporate', type: 'Corporate', category: 'Export Shell Firm', riskLevel: 'HIGH', riskBase: 82, accent: '#fb923c' },
  { role: 'Gateway', type: 'Gateway', category: 'Crypto P2P Bridge', riskLevel: 'CRITICAL', riskBase: 96, accent: '#ec4899' },
  { role: 'User', type: 'Individual', category: 'Salaried Professional', riskLevel: 'LOW', riskBase: 10, accent: '#10b981' },
];

const BANKS = [
  'HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra',
  'Yes Bank', 'IndusInd Bank', 'Punjab National Bank', 'Standard Chartered', 'HSBC India',
];

const CITIES = [
  'Mumbai, MH', 'New Delhi, DL', 'Bengaluru, KA', 'Surat, GJ', 'Hyderabad, TG',
  'Pune, MH', 'Chennai, TN', 'Kolkata, WB', 'Ahmedabad, GJ', 'Jaipur, RJ',
];

// Helper to format currency
export function formatINR(amount) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Procedurally generate comprehensive dataset up to 105 entities
function generateSyntheticDatabase() {
  const db = {};

  // 1. Insert primary hand-crafted nodes first
  PRIMARY_ENTITIES.forEach((e) => {
    db[e.id] = { ...e, connections: [] };
  });

  // 2. Generate remaining up to 105 entities
  let genIndex = 0;
  while (Object.keys(db).length < 105) {
    const fName = FIRST_NAMES[genIndex % FIRST_NAMES.length];
    const lName = LAST_NAMES[(genIndex * 3 + 7) % LAST_NAMES.length];
    const name = `${fName} ${lName}`;
    const id = name.toLowerCase().replace(/\s+/g, '-');

    if (!db[id]) {
      const roleObj = ROLES[genIndex % ROLES.length];
      const bank = BANKS[genIndex % BANKS.length];
      const city = CITIES[genIndex % CITIES.length];
      const riskScore = Math.min(99, Math.max(8, roleObj.riskBase + ((genIndex * 7) % 15) - 7));
      const riskLevel = riskScore >= 85 ? 'CRITICAL' : riskScore >= 70 ? 'HIGH' : riskScore >= 35 ? 'MEDIUM' : 'LOW';

      // Realistic volumes: multi-crore for high-risk / corporate, lakhs for normal users
      const isHighVol = roleObj.type === 'Corporate' || roleObj.type === 'Gateway' || riskScore >= 80;
      const baseAmt = isHighVol ? 15000000 + (genIndex * 4500000) : 800000 + (genIndex * 250000);
      const inflow = baseAmt;
      const outflow = Math.floor(baseAmt * (0.94 + Math.random() * 0.05));

      const alerts = [];
      if (riskScore >= 85) {
        alerts.push('Rapid multi-hop funds dissipation detected');
        alerts.push('Account flagged in National Cybercrime Registry');
      } else if (riskScore >= 70) {
        alerts.push('Abnormal velocity surge compared to historical baseline');
      }

      db[id] = {
        id,
        name,
        aliases: [`${fName[0]}. ${lName}`, `${name} Ent`],
        type: roleObj.type,
        role: roleObj.role,
        category: roleObj.category,
        riskScore,
        riskLevel,
        kycStatus: riskScore >= 80 ? 'Suspect Address Proof / Tier-1 Only' : 'Aadhaar & PAN KYC Verified',
        upiId: `${fName.toLowerCase()}.${lName.toLowerCase()}@${bank.toLowerCase().split(' ')[0]}`,
        phone: `+91 ${98000 + (genIndex * 13) % 1000} ${10000 + (genIndex * 41) % 89999}`,
        accountNumber: `•••• •••• ${1000 + (genIndex * 87) % 8999}`,
        bank,
        city,
        totalInflow: inflow,
        totalOutflow: outflow,
        activeAlerts: alerts,
        accent: roleObj.accent,
        connections: [],
      };
    }
    genIndex++;
  }

  // 3. Establish rich cross-network connections with huge realistic transactions
  const allIds = Object.keys(db);

  allIds.forEach((sourceId, idx) => {
    const source = db[sourceId];
    // Each entity connects to 5 to 9 counterparties in the dataset
    const connectionCount = 5 + (idx % 5);
    const chosenTargets = new Set();

    // Priority connections for key hubs
    if (sourceId === 'kabir-singhania') {
      ['crypto-otc-vault', 'zenith-logistics', 'surat-mule-hub', 'rahul-sharma', 'vikram-malhotra'].forEach(t => chosenTargets.add(t));
    } else if (sourceId === 'rahul-sharma') {
      ['merchant-a', 'amit-verma', 'priya-shah', 'neha-patil', 'account-x', 'crypto-otc-vault', 'surat-mule-hub'].forEach(t => {
        if (db[t]) chosenTargets.add(t);
      });
    }

    // Fill remaining connections with adjacent and random entities
    for (let c = 0; chosenTargets.size < connectionCount && c < 25; c++) {
      const targetId = allIds[(idx + c * 7 + 3) % allIds.length];
      if (targetId !== sourceId) {
        chosenTargets.add(targetId);
      }
    }

    // Build connections array
    source.connections = Array.from(chosenTargets).map((targetId, cIdx) => {
      const target = db[targetId] || db['priya-shah'];
      const isHighVol = source.totalInflow > 50000000 || target.totalInflow > 50000000;

      // Realistic transaction amounts: up to ₹4.5 Crores
      const txnAmt = isHighVol
        ? 15000000 + ((idx + cIdx) * 3500000) % 35000000
        : 250000 + ((idx + cIdx) * 120000) % 2200000;

      const directions = ['OUTFLOW', 'INFLOW', 'BIDIRECTIONAL'];
      const direction = directions[(idx + cIdx) % directions.length];
      const channels = ['RTGS', 'IMPS', 'UPI', 'NEFT'];
      const channel = channels[(idx + cIdx) % channels.length];

      const statuses = [
        'Critical: Suspected Hawala Smurfing',
        'Flagged: Multi-Hop Layering Burst',
        'High Volume Settlement Hop',
        'Verified Trade Transaction',
        'Clean Corporate Payroll',
      ];
      const status = target.riskScore >= 80 ? statuses[0] : target.riskScore >= 65 ? statuses[1] : statuses[3];

      return {
        targetId: target.id,
        targetName: target.name,
        targetRole: target.role,
        targetType: target.category,
        riskLevel: target.riskLevel,
        riskScore: target.riskScore,
        accent: target.accent,
        relation: target.role === 'Merchant' ? 'Payment Settlement' : target.role === 'Gateway' ? 'Crypto Liquidation' : 'Financial Conduit',
        direction,
        amount: txnAmt,
        txnCount: 3 + ((idx + cIdx) % 18),
        recentTxn: {
          id: `TXN-${channel}-${10000 + (idx * 31 + cIdx * 17) % 89999}`,
          amount: Math.floor(txnAmt * 0.45),
          type: channel,
          timestamp: `${(idx + cIdx * 3) % 55 + 2} mins ago`,
          status,
          direction,
        },
      };
    });
  });

  return db;
}

export const SYNTHETIC_ENTITIES = generateSyntheticDatabase();

/**
 * Returns network graph for a given query or ID
 */
export function getNetworkForEntity(query) {
  if (!query || typeof query !== 'string') {
    return SYNTHETIC_ENTITIES['kabir-singhania'] || SYNTHETIC_ENTITIES['rahul-sharma'];
  }

  const clean = query.trim().toLowerCase();

  // Direct ID match
  if (SYNTHETIC_ENTITIES[clean]) {
    return SYNTHETIC_ENTITIES[clean];
  }

  // Exact Name match
  for (const key of Object.keys(SYNTHETIC_ENTITIES)) {
    const e = SYNTHETIC_ENTITIES[key];
    if (e.name.toLowerCase() === clean) {
      return e;
    }
  }

  // Fuzzy Substring search
  for (const key of Object.keys(SYNTHETIC_ENTITIES)) {
    const e = SYNTHETIC_ENTITIES[key];
    if (
      e.name.toLowerCase().includes(clean) ||
      e.id.toLowerCase().includes(clean) ||
      (e.aliases && e.aliases.some((a) => a.toLowerCase().includes(clean)))
    ) {
      return e;
    }
  }

  // Fallback to top primary entity
  return SYNTHETIC_ENTITIES['rahul-sharma'];
}

/**
 * Search autocomplete across all 100+ synthetic entities
 */
export function searchEntities(query) {
  const all = Object.values(SYNTHETIC_ENTITIES);

  if (!query || query.trim().length === 0) {
    // Return curated high-interest nodes first
    return all.slice(0, 15).map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
      category: e.category,
      riskLevel: e.riskLevel,
      riskScore: e.riskScore,
      totalInflow: e.totalInflow,
      accent: e.accent,
    }));
  }

  const q = query.toLowerCase().trim();
  return all
    .filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        (e.aliases && e.aliases.some((a) => a.toLowerCase().includes(q)))
    )
    .slice(0, 12)
    .map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
      category: e.category,
      riskLevel: e.riskLevel,
      riskScore: e.riskScore,
      totalInflow: e.totalInflow,
      accent: e.accent,
    }));
}
