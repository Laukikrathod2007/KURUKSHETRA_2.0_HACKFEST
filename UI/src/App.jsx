import { useEffect, useRef, useState, useCallback } from 'react';
import { ParticleUniverseScene } from './core/ParticleUniverseScene';
import {
  getNetworkForEntity,
  searchEntities,
  formatINR,
  loadRegistrySnapshot,
  openLiveStream,
  onLiveEvent,
} from './data/liveRegistry';
import './App.css';

export default function App() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  const [registryReady, setRegistryReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGraphMode, setIsGraphMode] = useState(false);
  const [nodeLabels, setNodeLabels] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isDossierExpanded, setIsDossierExpanded] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [hoveredEntity, setHoveredEntity] = useState(null);

  // --- Investigation Lens & Degree State ---
  const [lensMode, setLensMode] = useState('TRANSACTIONS'); // 'TRANSACTIONS' | 'HISTORY'
  const [degreeLevel, setDegreeLevel] = useState(1); // 1 = Direct, 2 = Extended, 3 = Ecosystem
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedEvidenceType, setSelectedEvidenceType] = useState('DEVICES'); // 'DEVICES' | 'AADHAAR' | 'PHONE' | 'ACCOUNTS' | 'PAN' | 'REPUTATION'

  const [telemetry, setTelemetry] = useState({
    fps: 60,
    particles: 43000,
    filaments: 450,
    state: 'LIVING_IDLE',
    cameraMode: 'CINEMATIC_ORBIT',
    isGraphMode: false,
  });

  const pendingEntityRef = useRef(null);

  // Load self-contained rich synthetic registry and open SSE feed
  useEffect(() => {
    let cancelled = false;
    loadRegistrySnapshot().then((entities) => {
      if (cancelled) return;
      // Default initial search query to Rahul Sharma
      setSearchQuery('Rahul Sharma');
      setRegistryReady(true);
      openLiveStream();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize Three.js scene once ready
  useEffect(() => {
    if (!containerRef.current || !registryReady) return;

    const scene = new ParticleUniverseScene(
      containerRef.current,
      (tData) => {
        setTelemetry((prev) => ({ ...prev, ...tData }));
        if (tData.isGraphMode !== undefined) {
          setIsGraphMode(tData.isGraphMode);
        }
      },
      (labels) => {
        setNodeLabels(labels);
      },
      (hoverData) => {
        setHoveredEntity(hoverData);
      },
      (selectedName) => {
        setSearchQuery(selectedName);
        pendingEntityRef.current = getNetworkForEntity(selectedName);
      },
      () => {
        // Camera glide settled
        if (pendingEntityRef.current) {
          setSelectedEntity(pendingEntityRef.current);
          pendingEntityRef.current = null;
        }
      }
    );
    sceneRef.current = scene;

    const unsubscribe = onLiveEvent((ev) => {
      scene.pulse();
      setSelectedEntity((prev) => (prev && prev.id === ev.node.id ? getNetworkForEntity(ev.node.id) : prev));
    });

    return () => {
      unsubscribe();
      scene.destroy();
    };
  }, [registryReady]);

  // Synchronize sidebar state to Three.js camera framing
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setSidebarState(!!selectedEntity || !!selectedTransaction, isDossierExpanded);
    }
  }, [selectedEntity, selectedTransaction, isDossierExpanded]);

  // Handle Search Execution
  const handleSearch = (e, targetName) => {
    if (e) e.preventDefault();
    const query = targetName || searchQuery || 'Rahul Sharma';
    setShowSuggestions(false);
    setSelectedTransaction(null);

    if (sceneRef.current) {
      pendingEntityRef.current = getNetworkForEntity(query);
      sceneRef.current.searchEntity(query);
    }
  };

  const handleResetToGlobe = useCallback(() => {
    if (!sceneRef.current) return;
    sceneRef.current.resetToGlobe();
    setSelectedEntity(null);
    setSelectedTransaction(null);
    setIsDossierExpanded(false);
    setHoveredEntity(null);
    setShowSuggestions(false);
    setLensMode('TRANSACTIONS');
    setDegreeLevel(1);
  }, []);

  // Lens Switcher Handler
  const handleLensChange = (mode) => {
    setLensMode(mode);
    setSelectedTransaction(null);
    if (sceneRef.current) {
      sceneRef.current.setLensMode(mode);
    }
  };

  // Degree Level Switcher Handler
  const handleDegreeChange = (deg) => {
    setDegreeLevel(deg);
    setSelectedTransaction(null);
    if (sceneRef.current) {
      sceneRef.current.setDegreeLevel(deg);
    }
  };

  // 3D Node & Edge Selection Handler
  const handleSelectNode = (node) => {
    if (node.isEvidence) {
      setSelectedEvidenceType(node.evidenceType || 'DEVICES');
      if (sceneRef.current) {
        sceneRef.current.setSelectedEvidence(node.evidenceType);
      }
      return;
    }

    if (node.isCenter) {
      setSelectedEntity(getNetworkForEntity(node.name));
      setSelectedTransaction(null);
      if (sceneRef.current) sceneRef.current.setSelectedEdge(null);
    } else if (node.connection) {
      const fullTarget = getNetworkForEntity(node.name);
      setSelectedEntity({
        ...fullTarget,
        name: node.name,
        role: node.role,
        category: node.type,
        accent: node.color,
        directConnection: node.connection,
      });

      if (node.connection.recentTxn) {
        setSelectedTransaction(node.connection.recentTxn);
        if (sceneRef.current) sceneRef.current.setSelectedEdge(node.connection.recentTxn.id || node.id);
      }
    }
  };

  const handleSelectTransactionPath = (conn) => {
    if (!conn) return;
    const fullTarget = getNetworkForEntity(conn.targetName);
    setSelectedEntity({
      ...fullTarget,
      name: conn.targetName,
      role: conn.targetRole,
      category: conn.targetType,
      accent: conn.accent,
      directConnection: conn,
    });

    if (conn.recentTxn) {
      setSelectedTransaction(conn.recentTxn);
      if (sceneRef.current) sceneRef.current.setSelectedEdge(conn.recentTxn.id || conn.targetId);
    }
  };

  const handlePivotEntity = (entityName) => {
    setSearchQuery(entityName);
    setSelectedTransaction(null);
    handleSearch(null, entityName);
  };

  // Cross-lens Navigation: from Device in History to Transaction Network
  const handleShowInTransactionNetwork = (connectedIds) => {
    handleLensChange('TRANSACTIONS');
    handleDegreeChange(2);
    if (sceneRef.current) {
      sceneRef.current.spotlightEntities(connectedIds || ['account-x', 'account-y', 'surat-mule-hub']);
    }
  };

  // Cross-lens Navigation: from Suspicious Counterparty to History View
  const handleInvestigateInHistory = (counterpartyName) => {
    setSearchQuery(counterpartyName);
    handleLensChange('HISTORY');
    handleSearch(null, counterpartyName);
  };

  // Keyboard Shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      if (!sceneRef.current) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          sceneRef.current.pulse();
          break;
        case 'KeyR':
          handleResetToGlobe();
          break;
        case 'KeyH':
          setShowControls((prev) => !prev);
          break;
        case 'Digit1':
          handleDegreeChange(1);
          break;
        case 'Digit2':
          handleDegreeChange(2);
          break;
        case 'Digit3':
          handleDegreeChange(3);
          break;
        default:
          break;
      }
    },
    [handleResetToGlobe]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const suggestions = searchEntities(searchQuery);

  const filteredLabels = nodeLabels.filter((node) => {
    if (lensMode === 'HISTORY') return true;
    if (filterType === 'ALL') return true;
    if (filterType === 'HIGH_RISK') return node.riskLevel === 'HIGH' || node.riskLevel === 'CRITICAL';
    if (filterType === 'PEOPLE') return node.role === 'User' || node.role === 'Target Entity';
    if (filterType === 'MERCHANTS') return node.role === 'Merchant';
    if (filterType === 'ACCOUNTS') return node.role === 'Account' || node.role === 'Gateway';
    return true;
  });

  if (!registryReady) {
    return (
      <div className="universe-root">
        <div className="registry-loading-gate">
          <span className="registry-loading-title">KURUKSHETRA</span>
          <span className="registry-loading-sub">Initializing intelligence universe…</span>
        </div>
      </div>
    );
  }

  const currentAnchor = selectedEntity || getNetworkForEntity('Rahul Sharma');
  const hIntel = currentAnchor.historyIntelligence || {};
  const trustProf = currentAnchor.trustProfile || {
    overall: 72,
    identity: 91,
    kyc: 100,
    contact: 68,
    devices: 57,
    reputation: 44,
    transactions: 71,
    elevatedSignals: [],
  };

  return (
    <div className={`universe-root ${isGraphMode ? 'graph-mode-active' : ''}`}>
      {/* 3D WebGL Viewport */}
      <div ref={containerRef} className="universe-canvas-container" />

      {/* Atmospheric depth vignette */}
      <div className="universe-vignette" />

      {/* --- TOP HEADER --- */}
      <header className="kurukshetra-header">
        {/* Brand Title Top-Left */}
        <div className="header-brand" onClick={handleResetToGlobe} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
          <h1 className="kurukshetra-title">K U R U K S H E T R A</h1>
          <span className="kurukshetra-sub">TRANSACTION INTELLIGENCE UNIVERSE</span>
        </div>

        {/* Center Section: Search & Primary Lens Switcher */}
        <div className="header-center-container">
          <div className="search-wrapper">
            <form className="search-pill-container" onSubmit={(e) => handleSearch(e)}>
              <div className="search-pill">
                <span className="search-icon">⚲</span>
                <input
                  type="text"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search entity (e.g. Rahul Sharma)"
                />
                {isGraphMode ? (
                  <button
                    type="button"
                    className="search-submit-btn reset-btn"
                    onClick={handleResetToGlobe}
                    title="Reset to 3D Universe"
                  >
                    ✕
                  </button>
                ) : (
                  <button type="submit" className="search-submit-btn" title="Search entity">
                    →
                  </button>
                )}
              </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions-dropdown">
                <div className="suggestions-header">ACTIVE INVESTIGATION DIRECTORY</div>
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery(s.name);
                      handleSearch(null, s.name);
                    }}
                  >
                    <div className="suggestion-dot" style={{ backgroundColor: s.accent }} />
                    <div className="suggestion-meta">
                      <span className="suggestion-name">{s.name}</span>
                      <span className="suggestion-role">{s.role} • {s.category}</span>
                    </div>
                    <div className="suggestion-right">
                      <span className="suggestion-vol">{formatINR(s.totalInflow)}</span>
                      <span className={`risk-pill risk-${s.riskLevel.toLowerCase()}`}>
                        {s.riskLevel} ({s.riskScore})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Primary Lens Switcher: TRANSACTIONS <-> HISTORY */}
          {isGraphMode && (
            <div className="primary-lens-switcher">
              <button
                className={`lens-switch-btn ${lensMode === 'TRANSACTIONS' ? 'active' : ''}`}
                onClick={() => handleLensChange('TRANSACTIONS')}
                title="Suspicious Transaction Network Lens"
              >
                <span className="lens-btn-icon">⇄</span>
                <span>TRANSACTIONS</span>
              </button>
              <button
                className={`lens-switch-btn ${lensMode === 'HISTORY' ? 'active' : ''}`}
                onClick={() => handleLensChange('HISTORY')}
                title="Entity Digital Footprint & Evidence Constellation Lens"
              >
                <span className="lens-btn-icon">🛡</span>
                <span>HISTORY</span>
              </button>
            </div>
          )}
        </div>

        {/* Top Right: Degree Explorer (Transactions Lens) or Footprint Tag (History Lens) */}
        <div className="header-meta-right">
          {isGraphMode && lensMode === 'TRANSACTIONS' && (
            <div className="degree-explorer-group">
              <span className="degree-label">TOPOLOGY:</span>
              <button
                className={`degree-pill ${degreeLevel === 1 ? 'active' : ''}`}
                onClick={() => handleDegreeChange(1)}
                title="Degree 1: Direct suspicious relationships"
              >
                DEGREE 1
              </button>
              <button
                className={`degree-pill ${degreeLevel === 2 ? 'active' : ''}`}
                onClick={() => handleDegreeChange(2)}
                title="Degree 2: Extended multi-hop relationships"
              >
                DEGREE 2
              </button>
              <button
                className={`degree-pill ${degreeLevel === 3 ? 'active' : ''}`}
                onClick={() => handleDegreeChange(3)}
                title="Degree 3: Broader syndicate ecosystem"
              >
                DEGREE 3
              </button>
            </div>
          )}

          {isGraphMode && lensMode === 'HISTORY' && (
            <div className="history-mode-badge">
              <span className="badge-pulse-dot" />
              <span>DIGITAL FOOTPRINT CONSTELLATION</span>
            </div>
          )}

          {!isGraphMode && (
            <div className="ecosystem-tag">
              <span>GLOBAL 3D UNIVERSE</span>
              <span>SYNTHETIC ECOSYSTEM</span>
            </div>
          )}
        </div>
      </header>

      {/* --- 3D INTERACTIVE ORBIT NAVIGATION HINT --- */}
      {isGraphMode && (
        <div className="spatial-nav-hint">
          <span className="hint-icon">✦</span>
          <span>
            {lensMode === 'TRANSACTIONS'
              ? 'Drag to orbit • Scroll to zoom • Click nodes or flows to inspect'
              : 'Constellation Mode • Click evidence anchors to inspect telemetry'}
          </span>
        </div>
      )}

      {/* --- GLOBE SEEDED ENTITY HOVER TAG --- */}
      {!isGraphMode && hoveredEntity && (
        <div
          className="globe-entity-tag"
          style={{
            left: `${hoveredEntity.clientX + 14}px`,
            top: `${hoveredEntity.clientY - 16}px`,
            borderColor: `${hoveredEntity.entity.accent || '#38bdf8'}60`,
          }}
        >
          <span
            className="globe-tag-dot"
            style={{ backgroundColor: hoveredEntity.entity.accent || '#ef4444' }}
          />
          <span className="globe-tag-name">{hoveredEntity.entity.name}</span>
          <span
            className="globe-tag-risk"
            style={{ color: hoveredEntity.entity.accent || '#f87171' }}
          >
            {hoveredEntity.entity.riskLevel}
          </span>
        </div>
      )}

      {/* --- 3D PROJECTED SCREEN LABELS WITH DEPTH SCALING --- */}
      {isGraphMode && (
        <div className="entity-labels-overlay">
          {filteredLabels.map((node) => {
            if (!node.visible) return null;
            const isCenter = node.isCenter;
            const conn = node.connection;
            const isEvidence = node.isEvidence;
            const depthScale = node.depthScale || 1.0;

            return (
              <div
                key={node.id}
                className={`entity-node-label ${isCenter ? 'center-label' : ''} ${isEvidence ? 'evidence-label' : ''}`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: `translate(${isCenter ? 26 : 22}px, -50%) scale(${depthScale})`,
                  opacity: node.opacity,
                  zIndex: Math.round(depthScale * 10),
                }}
                onClick={() => handleSelectNode(node)}
              >
                <div className="label-dot-indicator" style={{ backgroundColor: node.color }} />
                <div className="label-content">
                  <div className="label-title-row">
                    <span className="entity-name" style={{ color: node.color }}>
                      {node.name}
                    </span>
                    {!isEvidence && (
                      <span className={`risk-tag-inline risk-${(node.riskLevel || 'LOW').toLowerCase()}`}>
                        {node.riskScore}
                      </span>
                    )}
                  </div>

                  {!isCenter && !isEvidence && conn ? (
                    <div
                      className="label-txn-badge"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTransactionPath(conn);
                      }}
                      title="Click to inspect transaction path"
                    >
                      <span className="txn-amount">{formatINR(conn.amount)}</span>
                      <span className="txn-flow">{conn.direction === 'OUTFLOW' ? '➔ OUT' : '➔ IN'}</span>
                    </div>
                  ) : (
                    <span className="entity-role">{node.category || node.role}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- FLOATING 3D TRANSACTION INSPECTION HUD CARD (Item 10 of requirements) --- */}
      {isGraphMode && selectedTransaction && (
        <div className="txn-floating-hud">
          <div className="txn-hud-header">
            <div className="txn-hud-tag-group">
              <span className="txn-hud-pulse-dot" />
              <span className="txn-hud-title">SUSPICIOUS TRANSACTION INSPECTION</span>
            </div>
            <button
              className="txn-hud-close"
              onClick={() => {
                setSelectedTransaction(null);
                sceneRef.current?.setSelectedEdge(null);
              }}
            >
              ✕
            </button>
          </div>

          <div className="txn-hud-body">
            <div className="txn-hud-amount-row">
              <div className="txn-hud-amount-val">{formatINR(selectedTransaction.amount)}</div>
              <span className={`txn-status-badge status-${(selectedTransaction.status || 'PAUSED').toLowerCase()}`}>
                {selectedTransaction.status || 'PAUSED'}
              </span>
            </div>

            <div className="txn-hud-path-box">
              <div className="path-endpoint">
                <span className="endpoint-role">ORIGIN</span>
                <span className="endpoint-name">{selectedTransaction.sender || currentAnchor.name}</span>
              </div>
              <div className="path-arrow">➔</div>
              <div className="path-endpoint">
                <span className="endpoint-role">BENEFICIARY</span>
                <span className="endpoint-name">{selectedTransaction.receiver || 'Account X'}</span>
              </div>
            </div>

            <div className="txn-hud-meta-grid">
              <div className="meta-col">
                <span className="meta-lbl">TIMESTAMP</span>
                <span className="meta-val">{selectedTransaction.timestamp || '12 Sep 2026 14:32:08'}</span>
              </div>
              <div className="meta-col">
                <span className="meta-lbl">RISK SCORE</span>
                <span className="meta-val risk-val-high">{selectedTransaction.riskScore || 82} / 100</span>
              </div>
            </div>

            <div className="txn-hud-signals">
              <span className="signals-lbl">DETECTION SIGNALS</span>
              <div className="signals-list">
                {(selectedTransaction.signals || ['New recipient', 'Amount anomaly', 'Velocity spike']).map((s, idx) => (
                  <span key={idx} className="signal-pill">
                    ⚠ {s}
                  </span>
                ))}
              </div>
            </div>

            <p className="txn-hud-narrative">{selectedTransaction.narrative}</p>

            <button
              className="txn-cross-nav-btn"
              onClick={() => handleInvestigateInHistory(selectedTransaction.receiver || 'Account X')}
            >
              🔍 Investigate Beneficiary in History Lens
            </button>
          </div>
        </div>
      )}

      {/* --- ENTITY INTELLIGENCE & DOSSIER DRAWER (HISTORY & TRANSACTIONS) --- */}
      {isGraphMode && selectedEntity && (
        <aside className={`entity-dossier-drawer ${isDossierExpanded ? 'expanded' : ''}`}>
          <div className="dossier-header">
            <div className="dossier-title-group">
              <div className="dossier-dot" style={{ backgroundColor: selectedEntity.accent }} />
              <div>
                <h3 className="dossier-name">{selectedEntity.name}</h3>
                <span className="dossier-type">
                  {lensMode === 'HISTORY' ? 'Digital Identity Footprint' : `${selectedEntity.role} • ${selectedEntity.category}`}
                </span>
              </div>
            </div>
            <div className="dossier-actions">
              <button
                className="dossier-expand-btn"
                onClick={() => setIsDossierExpanded((prev) => !prev)}
                title={isDossierExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
              >
                {isDossierExpanded ? '⤡' : '⤢'}
              </button>
              <button
                className="dossier-close-btn"
                onClick={() => {
                  setSelectedEntity(null);
                  setSelectedTransaction(null);
                  setIsDossierExpanded(false);
                }}
                title="Close Sidebar"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="dossier-body">
            {/* LENS 1: TRANSACTIONS LENS VIEW */}
            {lensMode === 'TRANSACTIONS' && (
              <>
                {/* Risk Gauge Card */}
                <div className={`risk-gauge-card risk-${(selectedEntity.riskLevel || 'LOW').toLowerCase()}`}>
                  <div className="gauge-score-row">
                    <span className="gauge-label">RISK THREAT SCORE</span>
                    <span className="gauge-value">{selectedEntity.riskScore || 50}/100</span>
                  </div>
                  <div className="gauge-bar-track">
                    <div className="gauge-bar-fill" style={{ width: `${selectedEntity.riskScore || 50}%` }} />
                  </div>
                  <span className="gauge-status">{selectedEntity.riskLevel || 'MEDIUM'} RISK LEVEL</span>
                </div>

                {/* Direct Transaction Details if counterparty */}
                {selectedEntity.directConnection && (
                  <div className="direct-txn-card">
                    <div className="direct-txn-header">DIRECT RELATIONSHIP</div>
                    <div className="direct-txn-metric">
                      <span className="metric-label">Volume Exchanged</span>
                      <span className="metric-val">{formatINR(selectedEntity.directConnection.amount)}</span>
                    </div>
                    <div className="direct-txn-tags">
                      <span className="tag-flow">{selectedEntity.directConnection.direction}</span>
                      <span className="tag-count">{selectedEntity.directConnection.txnCount} Transactions</span>
                    </div>
                    <button
                      className="inspect-edge-btn"
                      onClick={() => handleSelectTransactionPath(selectedEntity.directConnection)}
                    >
                      Inspect Transaction Flow
                    </button>
                    <button
                      className="pivot-network-btn"
                      onClick={() => handleInvestigateInHistory(selectedEntity.name)}
                    >
                      🛡 Investigate Entity in History
                    </button>
                  </div>
                )}

                {/* Financial Multi-Crore Volume Summary */}
                <div className="volume-summary-row">
                  <div className="volume-box inflow">
                    <span className="vol-lbl">TOTAL INFLOW</span>
                    <span className="vol-val">{formatINR(selectedEntity.totalInflow || 1200000)}</span>
                  </div>
                  <div className="volume-box outflow">
                    <span className="vol-lbl">TOTAL OUTFLOW</span>
                    <span className="vol-val">{formatINR(selectedEntity.totalOutflow || 1180000)}</span>
                  </div>
                </div>

                {/* Account & Profile Metadata */}
                <div className="dossier-grid">
                  <div className="dossier-field">
                    <span className="field-lbl">UPI VPA</span>
                    <span className="field-val">{selectedEntity.upiId || 'N/A'}</span>
                  </div>
                  <div className="dossier-field">
                    <span className="field-lbl">Account</span>
                    <span className="field-val">{selectedEntity.accountNumber || '•••• •••• 9031'}</span>
                  </div>
                  <div className="dossier-field">
                    <span className="field-lbl">Bank / Hub</span>
                    <span className="field-val">{selectedEntity.bank || 'State Bank of India'}</span>
                  </div>
                  <div className="dossier-field">
                    <span className="field-lbl">Location</span>
                    <span className="field-val">{selectedEntity.city || 'India'}</span>
                  </div>
                </div>

                {/* Active Alerts */}
                {selectedEntity.activeAlerts && selectedEntity.activeAlerts.length > 0 && (
                  <div className="alerts-section">
                    <div className="alerts-title">SYSTEM SUSPICIOUS ACTIVITY ALERTS</div>
                    {selectedEntity.activeAlerts.map((alert, i) => (
                      <div key={i} className="alert-item">
                        <span className="alert-icon">⚠</span>
                        <span className="alert-text">{alert}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suspicious Connections List */}
                {selectedEntity.connections && (
                  <div className="connections-section">
                    <div className="connections-header-row">
                      <div className="connections-title">
                        SUSPICIOUS COUNTERPARTIES ({selectedEntity.connections.length})
                      </div>
                      <div className="connections-filter-pills">
                        {['ALL', 'HIGH_RISK', 'ACCOUNTS', 'MERCHANTS'].map((ft) => (
                          <button
                            key={ft}
                            type="button"
                            className={`filter-pill-btn ${filterType === ft ? 'active' : ''}`}
                            onClick={() => setFilterType(ft)}
                          >
                            {ft === 'HIGH_RISK' ? 'HIGH RISK' : ft}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="connections-list">
                      {selectedEntity.connections
                        .filter((c) => {
                          if (filterType === 'ALL') return true;
                          if (filterType === 'HIGH_RISK') return (c.riskScore || 50) >= 70;
                          if (filterType === 'ACCOUNTS') return c.targetRole === 'Account' || c.targetRole === 'Gateway';
                          if (filterType === 'MERCHANTS') return c.targetRole === 'Merchant';
                          return true;
                        })
                        .map((c, i) => (
                          <div
                            key={i}
                            className="connection-row"
                            onClick={() => handleSelectTransactionPath(c)}
                            title="Click to inspect transaction"
                          >
                            <span className="conn-dot" style={{ backgroundColor: c.accent }} />
                            <div className="conn-info">
                              <span className="conn-name">{c.targetName}</span>
                              <span className="conn-sub">{c.targetRole} • Deg {c.degree || 1}</span>
                            </div>
                            <div className="conn-actions-col">
                              <span className="conn-amt">{formatINR(c.amount)}</span>
                              <button
                                type="button"
                                className="conn-pivot-action"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePivotEntity(c.targetName);
                                }}
                                title={`Pivot central anchor to ${c.targetName}`}
                              >
                                Pivot ➔
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* LENS 2: HISTORY LENS VIEW (ENTITY CLEANLINESS & IDENTITY CONSTELLATION) */}
            {lensMode === 'HISTORY' && (
              <div className="history-intelligence-view">
                {/* 1. Entity Cleanliness & Trust Profile (Items 16 & 17 of requirements) */}
                <div className="trust-profile-card">
                  <div className="trust-score-header">
                    <div>
                      <span className="trust-card-lbl">ENTITY HEALTH & TRUST PROFILE</span>
                      <h4 className="trust-score-big">{trustProf.overall} <span className="trust-total">/ 100</span></h4>
                    </div>
                    <span className={`trust-status-tag ${trustProf.overall < 50 ? 'tag-critical' : trustProf.overall < 75 ? 'tag-concerning' : 'tag-clean'}`}>
                      {trustProf.overall < 50 ? 'HIGH SUSPICION' : trustProf.overall < 75 ? '3 ELEVATED SIGNALS' : 'VERIFIED CLEAN'}
                    </span>
                  </div>

                  {/* Cleanliness Breakdown */}
                  <div className="trust-meter-grid">
                    <div className="trust-meter-col">
                      <span className="m-lbl">IDENTITY</span>
                      <span className="m-score">{trustProf.identity}%</span>
                      <div className="m-bar"><div className="m-fill" style={{ width: `${trustProf.identity}%` }} /></div>
                    </div>
                    <div className="trust-meter-col">
                      <span className="m-lbl">KYC</span>
                      <span className="m-score">{trustProf.kyc}%</span>
                      <div className="m-bar"><div className="m-fill" style={{ width: `${trustProf.kyc}%` }} /></div>
                    </div>
                    <div className="trust-meter-col">
                      <span className="m-lbl">CONTACT</span>
                      <span className="m-score">{trustProf.contact}%</span>
                      <div className="m-bar"><div className="m-fill" style={{ width: `${trustProf.contact}%` }} /></div>
                    </div>
                    <div className="trust-meter-col">
                      <span className="m-lbl">DEVICES</span>
                      <span className="m-score">{trustProf.devices}%</span>
                      <div className="m-bar"><div className="m-fill" style={{ width: `${trustProf.devices}%` }} /></div>
                    </div>
                    <div className="trust-meter-col">
                      <span className="m-lbl">REPUTATION</span>
                      <span className="m-score">{trustProf.reputation}%</span>
                      <div className="m-bar"><div className="m-fill" style={{ width: `${trustProf.reputation}%` }} /></div>
                    </div>
                    <div className="trust-meter-col">
                      <span className="m-lbl">TRANSACTIONS</span>
                      <span className="m-score">{trustProf.transactions}%</span>
                      <div className="m-bar"><div className="m-fill" style={{ width: `${trustProf.transactions}%` }} /></div>
                    </div>
                  </div>

                  {/* Evidence Over Verdicts Section */}
                  <div className="elevated-signals-box">
                    <span className="signals-box-title">EVALUATED INVESTIGATIVE SIGNALS</span>
                    {(trustProf.elevatedSignals || []).map((sig, sIdx) => (
                      <div key={sIdx} className="signal-reason-row">
                        <span className="reason-dot">⚠</span>
                        <div>
                          <strong className="reason-title">{sig.title}</strong>
                          <p className="reason-desc">{sig.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Evidence Navigation Tabs */}
                <div className="evidence-nav-tabs">
                  {[
                    { key: 'DEVICES', label: 'Hardware Devices' },
                    { key: 'AADHAAR', label: 'Aadhaar' },
                    { key: 'PHONE', label: 'Mobiles' },
                    { key: 'ACCOUNTS', label: 'Accounts' },
                    { key: 'PAN', label: 'PAN' },
                    { key: 'REPUTATION', label: 'Reputation' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      className={`evidence-tab-btn ${selectedEvidenceType === tab.key ? 'active' : ''}`}
                      onClick={() => setSelectedEvidenceType(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 3. Detailed Evidence Card for Selected Category */}
                <div className="evidence-detail-card">
                  {selectedEvidenceType === 'DEVICES' && (
                    <div className="evidence-sub-pane">
                      <div className="pane-header-row">
                        <span className="pane-title">TELEMETRY: HARDWARE REUSE</span>
                        <span className="status-pill-crit">UNUSUAL REUSE</span>
                      </div>
                      {(hIntel.devices || []).map((dev, dIdx) => (
                        <div key={dIdx} className="device-item-card">
                          <div className="dev-name-row">
                            <span className="dev-id">{dev.id}</span>
                            <span className="dev-model">{dev.model}</span>
                          </div>
                          <div className="dev-metric-row">
                            <span>Accounts Associated: <strong>{dev.accountsAssociated}</strong></span>
                            <span>First Observed: <strong>{dev.firstObserved}</strong></span>
                          </div>
                          <p className="dev-note">{dev.note}</p>

                          {dev.connectedEntities && dev.connectedEntities.length > 0 && (
                            <button
                              className="cross-nav-action-btn"
                              onClick={() => handleShowInTransactionNetwork(dev.connectedEntities)}
                            >
                              ⚡ SHOW IN TRANSACTION NETWORK
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedEvidenceType === 'AADHAAR' && (
                    <div className="evidence-sub-pane">
                      <div className="pane-header-row">
                        <span className="pane-title">AADHAAR LINKAGE</span>
                        <span className="status-pill-clean">{hIntel.aadhaar?.status || 'VERIFIED'}</span>
                      </div>
                      <div className="aadhaar-data-grid">
                        <div className="data-item">
                          <span className="lbl">AADHAAR IDENTIFIER</span>
                          <span className="val masked-num">{hIntel.aadhaar?.number || '•••• •••• 4821'}</span>
                        </div>
                        <div className="data-item">
                          <span className="lbl">LINKED MOBILES</span>
                          <span className="val">{hIntel.aadhaar?.linkedMobilesCount || 4}</span>
                        </div>
                        <div className="data-item">
                          <span className="lbl">LINKED BANK ACCOUNTS</span>
                          <span className="val">{hIntel.aadhaar?.linkedAccountsCount || 3}</span>
                        </div>
                        <div className="data-item">
                          <span className="lbl">IDENTITY CONFLICTS</span>
                          <span className="val">{hIntel.aadhaar?.identityConflicts || 1}</span>
                        </div>
                      </div>
                      {hIntel.aadhaar?.conflictDetail && (
                        <div className="conflict-alert-box">
                          <span>⚠ Conflict Flag: {hIntel.aadhaar.conflictDetail}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedEvidenceType === 'PHONE' && (
                    <div className="evidence-sub-pane">
                      <div className="pane-header-row">
                        <span className="pane-title">MOBILE IDENTIFIERS</span>
                        <span className="status-pill-concerning">{(hIntel.mobiles || []).length} SIMs DETECTED</span>
                      </div>
                      {(hIntel.mobiles || []).map((mob, mIdx) => (
                        <div key={mIdx} className="mobile-item-card">
                          <div className="mob-top-row">
                            <span className="mob-num masked-num">{mob.number}</span>
                            <span className={`mob-status ${mob.status === 'VERIFIED' ? 'clean' : 'suspicious'}`}>
                              {mob.type} • {mob.status}
                            </span>
                          </div>
                          <div className="mob-meta">
                            <span>Operator: {mob.simOperator}</span>
                            <span>Age: {mob.simAge}</span>
                            <span>PSP: {mob.psp}</span>
                          </div>
                          <p className="mob-note">{mob.note}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedEvidenceType === 'ACCOUNTS' && (
                    <div className="evidence-sub-pane">
                      <div className="pane-header-row">
                        <span className="pane-title">CORE BANKING ACCOUNTS</span>
                        <span className="status-pill-concerning">{(hIntel.accounts || []).length} ACCOUNTS</span>
                      </div>
                      {(hIntel.accounts || []).map((acc, aIdx) => (
                        <div key={aIdx} className="account-item-card">
                          <div className="acc-name-row">
                            <span className="acc-num masked-num">{acc.number}</span>
                            <span className="acc-bank">{acc.bank}</span>
                          </div>
                          <div className="acc-meta-row">
                            <span>Type: {acc.type}</span>
                            <span>Status: {acc.status}</span>
                            <span>Age: {acc.age}</span>
                          </div>
                          <div className="acc-velocity-row">
                            <span>Velocity: {acc.velocity}</span>
                            <span>Balance: {acc.balanceRange}</span>
                          </div>
                          <p className="acc-note">{acc.note}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedEvidenceType === 'PAN' && (
                    <div className="evidence-sub-pane">
                      <div className="pane-header-row">
                        <span className="pane-title">PERMANENT ACCOUNT NUMBER (PAN)</span>
                        <span className="status-pill-clean">{hIntel.pan?.status || 'VERIFIED'}</span>
                      </div>
                      <div className="pan-data-grid">
                        <div className="data-item">
                          <span className="lbl">PAN IDENTIFIER</span>
                          <span className="val masked-num">{hIntel.pan?.number || '••••• 8842G'}</span>
                        </div>
                        <div className="data-item">
                          <span className="lbl">NAME CONSISTENCY</span>
                          <span className="val">{hIntel.pan?.nameConsistency || '98% Match'}</span>
                        </div>
                        <div className="data-item">
                          <span className="lbl">KYC TIER</span>
                          <span className="val">{hIntel.pan?.kycTier || 'Tier-2 Verified'}</span>
                        </div>
                        <div className="data-item">
                          <span className="lbl">LINKED ACCOUNTS</span>
                          <span className="val">{hIntel.pan?.linkedAccountsCount || 4}</span>
                        </div>
                      </div>
                      {(hIntel.pan?.flags || []).map((flag, fIdx) => (
                        <div key={fIdx} className="conflict-alert-box">
                          <span>⚠ Directorship Flag: {flag}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedEvidenceType === 'REPUTATION' && (
                    <div className="evidence-sub-pane">
                      <div className="pane-header-row">
                        <span className="pane-title">EXTERNAL REPUTATION INTELLIGENCE</span>
                        <span className="status-pill-crit">SECTION 1930 MATCH</span>
                      </div>
                      <div className="rep-data-card">
                        <div className="rep-score-row">
                          <span className="rep-src">{hIntel.reputation?.source || 'Synthetic Reputation Intelligence'}</span>
                          <span className="rep-val">{hIntel.reputation?.riskScore || 78} / 100</span>
                        </div>
                        <div className="rep-stats-row">
                          <span>Community Reports: <strong>{hIntel.reputation?.communityReportsCount || 6}</strong></span>
                          <span>CFCFRMS Registry: <strong>Active Flag</strong></span>
                        </div>
                        <div className="rep-tags-list">
                          {(hIntel.reputation?.reputationTags || []).map((tag, tIdx) => (
                            <span key={tIdx} className="rep-tag-item">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="rep-desc">{hIntel.reputation?.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* --- CORNER METADATA --- */}
      <div className="corner-meta bottom-left">
        {isGraphMode ? (
          <>
            <span>LENS: {lensMode}</span>
            <span>{lensMode === 'TRANSACTIONS' ? `DEGREE ${degreeLevel} TOPOLOGY` : 'DIGITAL IDENTITY CONSTELLATION'}</span>
          </>
        ) : (
          <>
            <span>GLOBAL 3D UNIVERSE</span>
            <span>ENTER DIGITAL FOOTPRINT</span>
          </>
        )}
      </div>

      <div className="corner-meta bottom-right">
        {isGraphMode ? (
          <>
            <span>DATA-DRIVEN INVESTIGATION GRAPH</span>
            <span>EVIDENCE OVER VERDICTS</span>
          </>
        ) : (
          <>
            <span>100+ ENTITIES LOADED</span>
            <span>SEARCH TO DIVE</span>
          </>
        )}
      </div>

      {/* Dev Diagnostic Toggle Button */}
      <button
        className="dev-hud-toggle"
        onClick={() => setShowControls((prev) => !prev)}
        title="Toggle Diagnostic HUD [H]"
      >
        HUD [H]
      </button>

      {/* Diagnostics HUD Overlay */}
      {showControls && (
        <div className="diagnostics-panel">
          <div className="diag-header">
            <h3>TELEMETRY</h3>
            <button onClick={() => setShowControls(false)}>✕</button>
          </div>
          <div className="diag-metrics">
            <div className="diag-row">
              <span>FPS:</span>
              <span className="metric">{telemetry.fps}</span>
            </div>
            <div className="diag-row">
              <span>LENS:</span>
              <span className="metric">{lensMode}</span>
            </div>
            <div className="diag-row">
              <span>DEGREE:</span>
              <span className="metric">{degreeLevel}</span>
            </div>
            <div className="diag-row">
              <span>CAMERA:</span>
              <span className="metric">{telemetry.cameraMode}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
