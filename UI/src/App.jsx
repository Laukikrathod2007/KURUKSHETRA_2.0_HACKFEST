import { useEffect, useRef, useState, useCallback } from 'react';
import { ParticleUniverseScene } from './core/ParticleUniverseScene';
import { getNetworkForEntity, searchEntities, formatINR } from './data/syntheticDataset';
import './App.css';

export default function App() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('Kabir Singhania');
  const [isGraphMode, setIsGraphMode] = useState(false);
  const [nodeLabels, setNodeLabels] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isDossierExpanded, setIsDossierExpanded] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [hoveredEntity, setHoveredEntity] = useState(null);

  const [telemetry, setTelemetry] = useState({
    fps: 60,
    particles: 43000,
    filaments: 450,
    state: 'LIVING_IDLE',
    cameraMode: 'CINEMATIC_ORBIT',
    isGraphMode: false,
  });

  // Holds the entity that should become the dossier once the cinematic dive settles,
  // so the panel doesn't pop in and compete with the camera glide for attention.
  const pendingEntityRef = useRef(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

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
        // Camera dive has settled (or we were already in graph mode) - reveal the dossier now.
        if (pendingEntityRef.current) {
          setSelectedEntity(pendingEntityRef.current);
          pendingEntityRef.current = null;
        }
      }
    );
    sceneRef.current = scene;

    return () => {
      scene.destroy();
    };
  }, []);

  // Synchronize sidebar open/expanded state to Three.js camera framing
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setSidebarState(!!selectedEntity, isDossierExpanded);
    }
  }, [selectedEntity, isDossierExpanded]);

  // Execute Search
  const handleSearch = (e, targetName) => {
    if (e) e.preventDefault();
    const query = targetName || searchQuery || 'Kabir Singhania';
    setShowSuggestions(false);

    if (sceneRef.current) {
      // Dossier reveal is deferred to the scene's onGraphSettled callback so it
      // appears once the cinematic dive resolves, not before.
      pendingEntityRef.current = getNetworkForEntity(query);
      sceneRef.current.searchEntity(query);
    }
  };

  const handleResetToGlobe = useCallback(() => {
    if (!sceneRef.current) return;
    sceneRef.current.resetToGlobe();
    setSelectedEntity(null);
    setIsDossierExpanded(false);
    setHoveredEntity(null);
    setShowSuggestions(false);
  }, []);

  const handleSelectNode = (node) => {
    if (node.isCenter) {
      setSelectedEntity(getNetworkForEntity(node.name));
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
    }
  };

  const handlePivotEntity = (entityName) => {
    setSearchQuery(entityName);
    handleSearch(null, entityName);
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
    if (filterType === 'ALL') return true;
    if (filterType === 'HIGH_RISK') return node.riskLevel === 'HIGH' || node.riskLevel === 'CRITICAL';
    if (filterType === 'PEOPLE') return node.role === 'User' || node.role === 'Target Entity';
    if (filterType === 'MERCHANTS') return node.role === 'Merchant';
    if (filterType === 'ACCOUNTS') return node.role === 'Account' || node.role === 'Gateway';
    return true;
  });

  return (
    <div className={`universe-root ${isGraphMode ? 'graph-mode-active' : ''}`}>
      {/* 3D WebGL Canvas Viewport */}
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

        {/* Search Pill Top-Center with Autocomplete */}
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
                placeholder="Search 100+ entities (e.g. Kabir Singhania)"
              />
              {isGraphMode ? (
                <button
                  type="button"
                  className="search-submit-btn reset-btn"
                  onClick={handleResetToGlobe}
                  title="Reset back to Globe"
                >
                  ✕
                </button>
              ) : (
                <button
                  type="submit"
                  className="search-submit-btn"
                  title="Search entity"
                >
                  →
                </button>
              )}
            </div>
          </form>

          {/* Autocomplete Suggestions Dropdown across 100+ entities */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions-dropdown">
              <div className="suggestions-header">ACTIVE DATA DICTIONARY (100+ ENTITIES)</div>
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

        {/* Top Right Taglines & Filter Pills */}
        <div className="header-meta-right">
          {isGraphMode ? (
            <div className="category-breadcrumbs">
              <span
                className={`filter-pill ${filterType === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilterType('ALL')}
              >
                ALL
              </span>
              <span className="sep">•</span>
              <span
                className={`filter-pill ${filterType === 'PEOPLE' ? 'active' : ''}`}
                onClick={() => setFilterType('PEOPLE')}
              >
                PEOPLE
              </span>
              <span className="sep">•</span>
              <span
                className={`filter-pill ${filterType === 'MERCHANTS' ? 'active' : ''}`}
                onClick={() => setFilterType('MERCHANTS')}
              >
                MERCHANTS
              </span>
              <span className="sep">•</span>
              <span
                className={`filter-pill ${filterType === 'ACCOUNTS' ? 'active' : ''}`}
                onClick={() => setFilterType('ACCOUNTS')}
              >
                ACCOUNTS
              </span>
              <span className="sep">•</span>
              <span
                className={`filter-pill risk-filter ${filterType === 'HIGH_RISK' ? 'active' : ''}`}
                onClick={() => setFilterType('HIGH_RISK')}
              >
                HIGH RISK
              </span>
            </div>
          ) : (
            <div className="ecosystem-tag">
              <span>A SAFER</span>
              <span>PAYMENT</span>
              <span>ECOSYSTEM</span>
            </div>
          )}
        </div>
      </header>

      {/* --- 3D INTERACTIVE ORBIT NAVIGATION HINT --- */}
      {isGraphMode && (
        <div className="spatial-nav-hint">
          <span className="hint-icon">✦</span>
          <span>Drag to orbit in 3D • Scroll to zoom</span>
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

      {/* --- 3D PROJECTED ENTITY LABELS WITH DEPTH SCALING --- */}
      {isGraphMode && (
        <div className="entity-labels-overlay">
          {filteredLabels.map((node) => {
            if (!node.visible) return null;
            const isCenter = node.isCenter;
            const conn = node.connection;
            const depthScale = node.depthScale || 1.0;

            return (
              <div
                key={node.id}
                className={`entity-node-label ${isCenter ? 'center-label' : ''}`}
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
                    <span className={`risk-tag-inline risk-${(node.riskLevel || 'LOW').toLowerCase()}`}>
                      {node.riskScore}
                    </span>
                  </div>
                  {!isCenter && conn ? (
                    <div className="label-txn-badge">
                      <span className="txn-amount">{formatINR(conn.amount)}</span>
                      <span className="txn-flow">{conn.direction === 'OUTFLOW' ? '➔ OUT' : conn.direction === 'INFLOW' ? '➔ IN' : '⇄ P2P'}</span>
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

      {/* --- ENTITY DOSSIER & MULTI-CRORE TRANSACTION INSPECTOR DRAWER --- */}
      {isGraphMode && selectedEntity && (
        <aside className={`entity-dossier-drawer ${isDossierExpanded ? 'expanded' : ''}`}>
          <div className="dossier-header">
            <div className="dossier-title-group">
              <div className="dossier-dot" style={{ backgroundColor: selectedEntity.accent }} />
              <div>
                <h3 className="dossier-name">{selectedEntity.name}</h3>
                <span className="dossier-type">{selectedEntity.role} • {selectedEntity.category}</span>
              </div>
            </div>
            <div className="dossier-actions">
              <button
                className="dossier-expand-btn"
                onClick={() => setIsDossierExpanded((prev) => !prev)}
                title={isDossierExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                {isDossierExpanded ? '⤡' : '⤢'}
              </button>
              <button
                className="dossier-close-btn"
                onClick={() => {
                  setSelectedEntity(null);
                  setIsDossierExpanded(false);
                }}
                title="Close Sidebar"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="dossier-body">
            {/* Risk Threat Gauge */}
            <div className={`risk-gauge-card risk-${(selectedEntity.riskLevel || 'LOW').toLowerCase()}`}>
              <div className="gauge-score-row">
                <span className="gauge-label">RISK THREAT SCORE</span>
                <span className="gauge-value">{selectedEntity.riskScore || 50}/100</span>
              </div>
              <div className="gauge-bar-track">
                <div
                  className="gauge-bar-fill"
                  style={{ width: `${selectedEntity.riskScore || 50}%` }}
                />
              </div>
              <span className="gauge-status">{selectedEntity.riskLevel || 'MEDIUM'} RISK LEVEL</span>
            </div>

            {/* Direct Transaction Details if counterparty */}
            {selectedEntity.directConnection && (
              <div className="direct-txn-card">
                <div className="direct-txn-header">DIRECT RELATIONSHIP</div>
                <div className="direct-txn-metric">
                  <span className="metric-label">Total Volume Exchanged</span>
                  <span className="metric-val">{formatINR(selectedEntity.directConnection.amount)}</span>
                </div>
                <div className="direct-txn-tags">
                  <span className="tag-flow">{selectedEntity.directConnection.direction}</span>
                  <span className="tag-count">{selectedEntity.directConnection.txnCount} Transactions</span>
                </div>
                {selectedEntity.directConnection.recentTxn && (
                  <div className="recent-txn-box">
                    <span className="recent-label">Latest: {selectedEntity.directConnection.recentTxn.id} ({selectedEntity.directConnection.recentTxn.type})</span>
                    <span className="recent-status">{selectedEntity.directConnection.recentTxn.status}</span>
                  </div>
                )}
                <button
                  className="pivot-network-btn"
                  onClick={() => handlePivotEntity(selectedEntity.name)}
                >
                  ⚡ Pivot 3D Space to {selectedEntity.name}
                </button>
              </div>
            )}

            {/* Financial Multi-Crore Volume Summary */}
            <div className="volume-summary-row">
              <div className="volume-box inflow">
                <span className="vol-lbl">TOTAL INFLOW</span>
                <span className="vol-val">{formatINR(selectedEntity.totalInflow || 12000000)}</span>
              </div>
              <div className="volume-box outflow">
                <span className="vol-lbl">TOTAL OUTFLOW</span>
                <span className="vol-val">{formatINR(selectedEntity.totalOutflow || 11800000)}</span>
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
                <span className="field-val">{selectedEntity.accountNumber || '•••• •••• 4092'}</span>
              </div>
              <div className="dossier-field">
                <span className="field-lbl">Bank / Hub</span>
                <span className="field-val">{selectedEntity.bank || 'HDFC Bank'}</span>
              </div>
              <div className="dossier-field">
                <span className="field-lbl">Location</span>
                <span className="field-val">{selectedEntity.city || 'India'}</span>
              </div>
            </div>

            {/* Active AML / Fraud Alerts */}
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

            {/* Connected Counterparties with 1-click 3D Pivot */}
            {selectedEntity.connections && (
              <div className="connections-section">
                <div className="connections-title">CONNECTED PARTIES ({selectedEntity.connections.length})</div>
                <div className="connections-list">
                  {selectedEntity.connections.map((c, i) => (
                    <div
                      key={i}
                      className="connection-row"
                      onClick={() => handlePivotEntity(c.targetName)}
                      title="Click to pivot 3D space"
                    >
                      <span className="conn-dot" style={{ backgroundColor: c.accent }} />
                      <div className="conn-info">
                        <span className="conn-name">{c.targetName}</span>
                        <span className="conn-sub">{c.targetRole} • {c.relation}</span>
                      </div>
                      <span className="conn-amt">{formatINR(c.amount)}</span>
                    </div>
                  ))}
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
            <span>3D SPATIAL CONSTELLATION</span>
            <span>MULTI-CRORE TRANSACTION TOPOLOGY</span>
          </>
        ) : (
          <>
            <span>MILLIONS OF CONNECTIONS</span>
            <span>ONE BIGGER PICTURE</span>
          </>
        )}
      </div>

      <div className="corner-meta bottom-right">
        {isGraphMode ? (
          <>
            <span>100+ ENTITIES LOADED</span>
            <span>TRUE 3D DEPTH MODE</span>
          </>
        ) : (
          <>
            <span>EXPLORE</span>
            <span>INVESTIGATE</span>
            <span>PREVENT</span>
          </>
        )}
      </div>

      {/* Dev Diagnostic Toggle Button */}
      <button
        className="dev-hud-toggle"
        onClick={() => setShowControls((prev) => !prev)}
        title="Toggle Diagnostic HUD [H]"
      >
        DEV HUD [H]
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
              <span>3D GRAPH:</span>
              <span className="metric">{isGraphMode ? 'ACTIVE' : 'IDLE'}</span>
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
