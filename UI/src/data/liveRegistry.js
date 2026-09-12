/**
 * Live registry adapter -- replaces the synthetic in-browser dataset with
 * the real Kurukshetra backend's accounts/VPAs/transactions.
 *
 * Keeps the exact same export surface as syntheticDataset.js
 * (SYNTHETIC_ENTITIES, getNetworkForEntity, searchEntities, RISK_COLORS,
 * formatINR) so core/EntityNetworkSystem.js and core/ParticleFieldGenerator.js
 * need only change their import path, not their logic -- they already work
 * generically over "entity + connections[]" shaped data.
 *
 * SYNTHETIC_ENTITIES is fetched once at module load (registry/graph snapshot)
 * and then kept live via Server-Sent Events (stream/events): every fired
 * DetectionSignal from the real deterministic engine mutates this same
 * object in place, so any code already holding a reference to it (the
 * particle field, an open dossier) sees updates without re-importing.
 */

export const RISK_COLORS = {
  FREEZE: '#fb7185',   // globe outer-rose, saturated -- matches CRITICAL
  COACH: '#fdba74',    // warm amber-peach -- matches HIGH
  STEP_UP: '#fed7aa',  // globe's own peach-gold accent -- matches MEDIUM
  ALLOW: '#5eead4',    // globe's cyan-teal pulse color -- matches LOW
};

const ZONE_TO_LEVEL = {
  FREEZE: 'CRITICAL',
  COACH: 'HIGH',
  STEP_UP: 'MEDIUM',
  ALLOW: 'LOW',
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export function formatINR(amountPaise) {
  const amount = amountPaise / 100;
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function zoneAccent(zone) {
  return RISK_COLORS[zone] || RISK_COLORS.ALLOW;
}

function scoreFromZone(zone, riskScore) {
  // Backend risk_score is 0.0-1.0; the dossier UI expects a 0-100 gauge.
  if (typeof riskScore === 'number' && riskScore > 0) return Math.round(riskScore * 100);
  return { FREEZE: 92, COACH: 72, STEP_UP: 45, ALLOW: 12 }[zone] ?? 12;
}

function nodeToEntity(node) {
  const riskLevel = ZONE_TO_LEVEL[node.risk_zone] || 'LOW';
  const riskScore = scoreFromZone(node.risk_zone, node.risk_score);
  return {
    id: node.id,
    name: node.label || node.vpa || node.id,
    aliases: node.vpa ? [node.vpa] : [],
    type: node.type === 'MERCHANT' ? 'Merchant' : node.type === 'CAMPAIGN' ? 'Account' : 'Individual',
    role: node.type === 'MERCHANT' ? 'Merchant' : node.is_active === false ? 'Mule Account' : 'User',
    category: node.type === 'MERCHANT' ? 'Verified Merchant' : node.risk_zone === 'FREEZE' ? 'Frozen / Kill-Switched Account' : 'Retail Account',
    riskScore,
    riskLevel,
    kycStatus: node.is_active === false ? 'Nationwide Suspended' : 'KYC On File',
    upiId: node.vpa || node.id,
    phone: '',
    accountNumber: node.id,
    bank: node.bank_id || 'Unknown Bank',
    city: '',
    totalInflow: 0,
    totalOutflow: 0,
    activeAlerts: [],
    accent: zoneAccent(node.risk_zone),
    connections: [],
  };
}

// Populated by loadRegistrySnapshot() before the Three.js scene mounts.
export const SYNTHETIC_ENTITIES = {};

let nodesById = new Map();

function rebuildConnectionsFor(entityId) {
  const entity = SYNTHETIC_ENTITIES[entityId];
  if (!entity) return;
  const edgesTouching = Array.from(nodesById.values())
    .filter((n) => n._edges && n._edges.some((e) => e.from === entityId || e.to === entityId));
  // Connections are derived on ingest (see ingestGraph/applyEvent) directly
  // into entity.connections -- this helper exists for callers that only
  // have an id and want the current derived list re-read.
  return entity.connections;
}

function upsertEntity(node) {
  const existing = SYNTHETIC_ENTITIES[node.id];
  const entity = nodeToEntity(node);
  if (existing) {
    entity.connections = existing.connections;
    entity.totalInflow = existing.totalInflow;
    entity.totalOutflow = existing.totalOutflow;
  }
  SYNTHETIC_ENTITIES[node.id] = entity;
  nodesById.set(node.id, node);
  return entity;
}

function addConnection(fromId, toId, amountPaise, direction, meta = {}) {
  const from = SYNTHETIC_ENTITIES[fromId];
  const to = SYNTHETIC_ENTITIES[toId];
  if (!from || !to) return;

  from.totalOutflow += amountPaise || 0;
  to.totalInflow += amountPaise || 0;

  const existingIdx = from.connections.findIndex((c) => c.targetId === toId);
  const connection = {
    targetId: to.id,
    targetName: to.name,
    targetRole: to.role,
    targetType: to.category,
    riskLevel: to.riskLevel,
    riskScore: to.riskScore,
    accent: to.accent,
    relation: to.role === 'Merchant' ? 'Payment Settlement' : 'Financial Conduit',
    direction: direction || 'OUTFLOW',
    amount: amountPaise || 0,
    txnCount: existingIdx >= 0 ? from.connections[existingIdx].txnCount + 1 : 1,
    recentTxn: {
      id: meta.txnId || `TXN-${Date.now()}`,
      amount: amountPaise || 0,
      type: 'UPI',
      timestamp: 'just now',
      status: to.riskLevel === 'CRITICAL' ? 'Critical: Live Fraud Interception' : to.riskLevel === 'HIGH' ? 'Flagged: Coaching Intervention' : 'Verified Transaction',
      direction: direction || 'OUTFLOW',
    },
  };

  if (existingIdx >= 0) {
    from.connections[existingIdx] = connection;
  } else {
    from.connections.push(connection);
  }
}

function ingestGraph(graph) {
  for (const node of graph.nodes || []) {
    upsertEntity(node);
  }
  for (const edge of graph.edges || []) {
    if (SYNTHETIC_ENTITIES[edge.from] && SYNTHETIC_ENTITIES[edge.to]) {
      // Every edge is wired onto BOTH endpoints' connections[] -- the 3D
      // graph renders whichever entity is currently centered, so a mule
      // account that is mostly the credit side of its edges (edge.to) must
      // still see those counterparties when it's the one being viewed.
      addConnection(edge.from, edge.to, edge.amount_paise, 'OUTFLOW');
      addConnection(edge.to, edge.from, edge.amount_paise, 'INFLOW');
    }
  }
  for (const ev of graph.recent_events || []) {
    applyEvent(ev, { silent: true });
  }
}

const liveEventListeners = new Set();

export function onLiveEvent(fn) {
  liveEventListeners.add(fn);
  return () => liveEventListeners.delete(fn);
}

export function applyEvent(ev, { silent = false } = {}) {
  if (!ev || !ev.node) return;
  const node = ev.node;
  if (!SYNTHETIC_ENTITIES[node.id]) {
    upsertEntity({ id: node.id, label: node.label, type: node.type, risk_zone: node.risk_zone, risk_score: node.risk_score });
  } else {
    const entity = SYNTHETIC_ENTITIES[node.id];
    entity.riskLevel = ZONE_TO_LEVEL[node.risk_zone] || entity.riskLevel;
    entity.riskScore = scoreFromZone(node.risk_zone, node.risk_score);
    entity.accent = zoneAccent(node.risk_zone);
    if (node.risk_zone === 'FREEZE' || node.risk_zone === 'COACH') {
      entity.activeAlerts = (ev.signals || [])
        .filter((s) => s.triggered)
        .map((s) => s.feature_name);
    }
  }

  for (const edge of ev.edges || []) {
    if (SYNTHETIC_ENTITIES[edge.from] && SYNTHETIC_ENTITIES[edge.to]) {
      addConnection(edge.from, edge.to, edge.amount_paise, edge.direction || 'OUTFLOW', { txnId: ev.txn_id });
      addConnection(edge.to, edge.from, edge.amount_paise, 'INFLOW', { txnId: ev.txn_id });
    }
  }

  if (!silent) {
    for (const fn of liveEventListeners) {
      try {
        fn(ev);
      } catch {
        // a listener throwing must never break the live feed for others
      }
    }
  }
}

let streamOpened = false;

export function openLiveStream() {
  if (streamOpened || typeof EventSource === 'undefined') return;
  streamOpened = true;
  const source = new EventSource(`${BACKEND_URL}/api/ecosystem/stream/events`);
  source.onmessage = (msg) => {
    try {
      applyEvent(JSON.parse(msg.data));
    } catch {
      // malformed/heartbeat payloads are ignored, never crash the viewer
    }
  };
  source.onerror = () => {
    // EventSource retries automatically; nothing to do but let it.
  };
  return () => source.close();
}

let loadPromise = null;

export function loadRegistrySnapshot() {
  if (loadPromise) return loadPromise;
  loadPromise = fetch(`${BACKEND_URL}/api/ecosystem/registry/graph`)
    .then((res) => res.json())
    .then((graph) => {
      ingestGraph(graph);
      return SYNTHETIC_ENTITIES;
    })
    .catch(() => {
      // Backend unreachable -- leave SYNTHETIC_ENTITIES empty rather than
      // silently fabricating fictional entities; the UI shell still renders,
      // just with nothing to search until the backend comes up.
      return SYNTHETIC_ENTITIES;
    });
  return loadPromise;
}

export function getNetworkForEntity(query) {
  const all = SYNTHETIC_ENTITIES;
  const keys = Object.keys(all);
  if (keys.length === 0) return null;

  if (!query || typeof query !== 'string') {
    return all[keys[0]];
  }
  const clean = query.trim().toLowerCase();

  if (all[clean]) return all[clean];

  for (const key of keys) {
    const e = all[key];
    if (e.name.toLowerCase() === clean || (e.upiId && e.upiId.toLowerCase() === clean)) return e;
  }
  for (const key of keys) {
    const e = all[key];
    if (
      e.name.toLowerCase().includes(clean) ||
      e.id.toLowerCase().includes(clean) ||
      (e.upiId && e.upiId.toLowerCase().includes(clean))
    ) {
      return e;
    }
  }
  return all[keys[0]];
}

export function searchEntities(query) {
  const all = Object.values(SYNTHETIC_ENTITIES);
  if (!query || query.trim().length === 0) {
    return all.slice(0, 15).map(toSuggestion);
  }
  const q = query.toLowerCase().trim();
  return all
    .filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.upiId && e.upiId.toLowerCase().includes(q))
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
