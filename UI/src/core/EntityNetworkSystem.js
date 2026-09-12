import * as THREE from 'three';
import { getNetworkForEntity } from '../data/liveRegistry.js';

// Matches CinematicCamera's glide easing so the node constellation unfurls
// in lockstep with the camera dive instead of drifting independently.
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * 3D Spatial Constellation Network System
 * Places nodes in true 3D space with rich volumetric depth,
 * multi-tier 3D Bezier arcs, and smooth fiber-optic photon streams.
 */
export class EntityNetworkSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.morphProgress = 0; // 0 = Globe, 1 = 3D Graph (eased, what everything renders from)
    this.morphLinear = 0; // raw linear progress driving the ease curve
    this.targetMorph = 0;
    this.morphDuration = 1.9; // seconds - matches CinematicCamera's glide duration
    this.currentEntity = null;

    this.currentDegree = 1; // 1 = Direct, 2 = Extended, 3 = Ecosystem
    this.lensMode = 'TRANSACTIONS'; // 'TRANSACTIONS' | 'HISTORY'
    this.selectedEdgeId = null;
    this.selectedEvidenceType = null;
    this.spotlightedEntityIds = new Set();

    this.nodeMeshes = [];
    this.filamentObjects = [];
    this.beadStreams = [];

    // Default entity is resolved lazily via getNetworkForEntity(undefined)
    this.setEntity(undefined);
  }

  setLensMode(mode) {
    if (this.lensMode === mode) return;
    this.lensMode = mode;
    if (this.currentEntity) {
      this.rebuildNetwork(this.currentEntity);
    }
  }

  setDegreeLevel(degree) {
    if (this.currentDegree === degree) return;
    this.currentDegree = degree;
    if (this.currentEntity && this.lensMode === 'TRANSACTIONS') {
      this.rebuildNetwork(this.currentEntity);
    }
  }

  setSelectedEdge(edgeId) {
    this.selectedEdgeId = edgeId;
  }

  setSelectedEvidence(evidenceType) {
    this.selectedEvidenceType = evidenceType;
  }

  spotlightEntities(entityIds = []) {
    this.spotlightedEntityIds = new Set(entityIds);
  }

  setEntity(queryOrId) {
    const entityData =
      typeof queryOrId === 'string' || queryOrId === undefined
        ? getNetworkForEntity(queryOrId)
        : queryOrId;
    if (!entityData) return;
    this.currentEntity = entityData;
    this.rebuildNetwork(entityData);
  }

  rebuildNetwork(entityData) {
    this.clearObjects();
    this.nodes = [];

    // 1. Central Target Node at 3D Origin
    const centerNode = {
      id: 'center',
      entityId: entityData.id,
      name: entityData.name,
      role: entityData.role || 'Target Entity',
      type: entityData.type,
      category: entityData.category,
      riskLevel: entityData.riskLevel,
      riskScore: entityData.riskScore,
      totalInflow: entityData.totalInflow,
      totalOutflow: entityData.totalOutflow,
      color: '#ffffff',
      accent: entityData.accent || '#fb7185',
      size: 0.092,
      globePos: entityData.globePosition ? entityData.globePosition.clone() : new THREE.Vector3(0, 0, 1.35),
      graphPos: new THREE.Vector3(0, 0, 0),
      currentPos: entityData.globePosition ? entityData.globePosition.clone() : new THREE.Vector3(0, 0, 1.35),
      isCenter: true,
      data: entityData,
    };
    this.nodes.push(centerNode);

    if (this.lensMode === 'HISTORY') {
      // -------------------------------------------------------------
      // HISTORY LENS: 3D IDENTITY & EVIDENCE CONSTELLATION
      // -------------------------------------------------------------
      const hData = entityData.historyIntelligence || {};

      const evidenceDefinitions = [
        {
          id: 'evidence-aadhaar',
          entityId: 'evidence-aadhaar',
          name: 'Aadhaar Linkage',
          role: hData.aadhaar?.status || 'VERIFIED',
          type: 'Identity Anchor',
          category: `Linked SIMs: ${hData.aadhaar?.linkedMobilesCount || 4} • Accounts: ${hData.aadhaar?.linkedAccountsCount || 3}`,
          riskLevel: hData.aadhaar?.identityConflicts > 0 ? 'HIGH' : 'LOW',
          riskScore: hData.aadhaar?.identityConflicts > 0 ? 68 : 12,
          color: hData.aadhaar?.identityConflicts > 0 ? '#fdba74' : '#38bdf8',
          accent: '#38bdf8',
          size: 0.068,
          evidenceType: 'AADHAAR',
          graphPos: new THREE.Vector3(-1.75, 1.15, 0.45),
          evidenceData: hData.aadhaar,
        },
        {
          id: 'evidence-phone',
          entityId: 'evidence-phone',
          name: 'Mobile Identifiers',
          role: `${(hData.mobiles || []).length} SIMs Detected`,
          type: 'Telecom Cluster',
          category: 'Shared association observed on 2 SIMs',
          riskLevel: 'HIGH',
          riskScore: 74,
          color: '#fb7185',
          accent: '#fb7185',
          size: 0.072,
          evidenceType: 'PHONE',
          graphPos: new THREE.Vector3(0.0, 1.85, -0.35),
          evidenceData: hData.mobiles,
        },
        {
          id: 'evidence-accounts',
          entityId: 'evidence-accounts',
          name: 'Banking Identifiers',
          role: `${(hData.accounts || []).length} Bank Accounts`,
          type: 'Core Banking',
          category: 'Velocity surge 4.2× baseline',
          riskLevel: 'HIGH',
          riskScore: 72,
          color: '#fdba74',
          accent: '#fdba74',
          size: 0.070,
          evidenceType: 'ACCOUNTS',
          graphPos: new THREE.Vector3(1.85, 1.05, 0.35),
          evidenceData: hData.accounts,
        },
        {
          id: 'evidence-devices',
          entityId: 'evidence-devices',
          name: 'Hardware Telemetry',
          role: 'DEVICE-9B42 (4 Accounts)',
          type: 'Device Cluster',
          category: 'Unusual multi-banking reuse',
          riskLevel: 'CRITICAL',
          riskScore: 88,
          color: '#fb7185',
          accent: '#fb7185',
          size: 0.076,
          evidenceType: 'DEVICES',
          graphPos: new THREE.Vector3(-1.80, -1.10, -0.40),
          evidenceData: hData.devices,
        },
        {
          id: 'evidence-pan',
          entityId: 'evidence-pan',
          name: 'PAN & Tax Registry',
          role: hData.pan?.nameConsistency || '98% Consistency',
          type: 'Directorship Record',
          category: hData.pan?.flags?.[0] || 'Tier-2 Comprehensive',
          riskLevel: (hData.pan?.flags || []).length > 0 ? 'HIGH' : 'LOW',
          riskScore: 62,
          color: '#fed7aa',
          accent: '#fed7aa',
          size: 0.064,
          evidenceType: 'PAN',
          graphPos: new THREE.Vector3(0.0, -1.65, 0.40),
          evidenceData: hData.pan,
        },
        {
          id: 'evidence-reputation',
          entityId: 'evidence-reputation',
          name: 'Reputation Signals',
          role: `${hData.reputation?.communityReportsCount || 6} 1930 Reports`,
          type: 'External Intelligence',
          category: 'CFCFRMS Cybercrime Match',
          riskLevel: 'CRITICAL',
          riskScore: hData.reputation?.riskScore || 78,
          color: '#fb7185',
          accent: '#fb7185',
          size: 0.074,
          evidenceType: 'REPUTATION',
          graphPos: new THREE.Vector3(1.75, -1.15, -0.25),
          evidenceData: hData.reputation,
        },
      ];

      evidenceDefinitions.forEach((ev) => {
        const globeSeed = ev.graphPos.clone().normalize().multiplyScalar(1.35);
        this.nodes.push({
          ...ev,
          globePos: globeSeed,
          currentPos: globeSeed.clone(),
          isCenter: false,
          isEvidence: true,
        });
      });

    } else {
      // -------------------------------------------------------------
      // TRANSACTIONS LENS: PROGRESSIVE MULTI-DEGREE SUSPICIOUS GRAPH
      // -------------------------------------------------------------
      const allConnections = entityData.connections || [];
      // Filter by active degree level (Degree 1, 2, or 3)
      const connections = allConnections.filter((c) => (c.degree || 1) <= this.currentDegree);
      const count = connections.length;
      const phiRatio = (1 + Math.sqrt(5)) / 2;

      connections.forEach((conn, index) => {
        const deg = conn.degree || 1;
        const theta = (2 * Math.PI * index) / phiRatio;
        const yNorm = 1 - (index / (count - 1 || 1)) * 2;
        const radiusAtY = Math.sqrt(Math.max(0.18, 1 - yNorm * yNorm));

        // Spatial scaling per degree:
        // Degree 1: ~1.5 - 1.8
        // Degree 2: ~2.4 - 2.8
        // Degree 3: ~3.3 - 3.8
        const baseTier = deg === 1 ? 1.60 : deg === 2 ? 2.55 : 3.45;
        const tierDistance = baseTier + ((index * 3) % 4) * 0.18;

        const gx = Math.cos(theta) * radiusAtY * (tierDistance * 1.04);
        const gy = yNorm * (tierDistance * 0.72);
        const gz = Math.sin(theta) * radiusAtY * (tierDistance * 0.94);

        const globeSeed = new THREE.Vector3(gx, gy, gz).normalize().multiplyScalar(1.35);

        this.nodes.push({
          id: conn.targetId,
          entityId: conn.targetId,
          name: conn.targetName,
          role: conn.targetRole,
          type: conn.targetType,
          riskLevel: conn.riskLevel,
          riskScore: conn.riskScore,
          color: conn.accent,
          accent: conn.accent,
          size: deg === 1 ? 0.060 : deg === 2 ? 0.052 : 0.046,
          globePos: globeSeed,
          graphPos: new THREE.Vector3(gx, gy, gz),
          currentPos: globeSeed.clone(),
          isCenter: false,
          degree: deg,
          parentEntityId: conn.parentEntityId || null,
          connection: conn,
        });
      });
    }

    // 3. Build Meshes, 3D Filaments, and Fiber-Optic Pulses
    this.initMeshes();
    this.initFilaments();
    this.initBeadStreams();
  }

  clearObjects() {
    this.nodeMeshes.forEach((item) => {
      item.mesh.geometry.dispose();
      item.mesh.material.dispose();
      if (item.ringMesh) {
        item.ringMesh.geometry.dispose();
        item.ringMesh.material.dispose();
      }
      this.group.remove(item.mesh);
    });
    this.nodeMeshes = [];

    this.filamentObjects.forEach((fil) => {
      fil.geo.dispose();
      fil.mat.dispose();
      this.group.remove(fil.line);
    });
    this.filamentObjects = [];

    this.beadStreams.forEach((bs) => {
      bs.beadGeo.dispose();
      bs.beadMat.dispose();
      this.group.remove(bs.points);
    });
    this.beadStreams = [];
  }

  initMeshes() {
    const sphereGeo = new THREE.SphereGeometry(1, 28, 28);
    const ringGeo = new THREE.RingGeometry(1.28, 1.48, 32);

    this.nodes.forEach((node) => {
      // Crisp emissive sphere
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        transparent: true,
        opacity: 0.0,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.scale.setScalar(node.size);
      mesh.position.copy(node.currentPos);
      this.group.add(mesh);

      // Concentric tactical orbital ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.accent),
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.scale.setScalar(node.isCenter ? 1.4 : 1.3);
      mesh.add(ringMesh);

      this.nodeMeshes.push({ mesh, ringMesh, node, mat, ringMat });
    });
  }

  initFilaments() {
    const nodeMap = new Map();
    this.nodes.forEach((n) => nodeMap.set(n.id, n));
    const centerNode = this.nodes[0];

    for (let i = 1; i < this.nodes.length; i++) {
      const targetNode = this.nodes[i];
      const parentNode = targetNode.parentEntityId ? nodeMap.get(targetNode.parentEntityId) : null;
      const sourceNode = parentNode || centerNode;

      const curve = this.createVolumetricBezier(sourceNode.currentPos, targetNode.currentPos, i);
      const points = curve.getPoints(50);
      const geo = new THREE.BufferGeometry().setFromPoints(points);

      const edgeColor = targetNode.accent || '#fed7aa';
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(edgeColor),
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geo, mat);
      this.group.add(line);

      this.filamentObjects.push({
        line,
        geo,
        mat,
        source: sourceNode,
        target: targetNode,
        index: i,
        curve,
        connection: targetNode.connection,
        edgeId: targetNode.connection?.recentTxn?.id || targetNode.id,
      });
    }

    // In HISTORY mode: also connect cross-evidence filaments
    if (this.lensMode === 'HISTORY') {
      const crossLinks = [
        ['evidence-devices', 'evidence-accounts'],
        ['evidence-aadhaar', 'evidence-phone'],
        ['evidence-phone', 'evidence-accounts'],
        ['evidence-aadhaar', 'evidence-pan'],
      ];
      crossLinks.forEach(([srcId, tgtId], idx) => {
        const src = nodeMap.get(srcId);
        const tgt = nodeMap.get(tgtId);
        if (src && tgt) {
          const curve = this.createVolumetricBezier(src.currentPos, tgt.currentPos, 50 + idx);
          const points = curve.getPoints(50);
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          const mat = new THREE.LineBasicMaterial({
            color: new THREE.Color('#38bdf8'),
            transparent: true,
            opacity: 0.0,
            blending: THREE.AdditiveBlending,
          });
          const line = new THREE.Line(geo, mat);
          this.group.add(line);
          this.filamentObjects.push({
            line,
            geo,
            mat,
            source: src,
            target: tgt,
            index: 50 + idx,
            curve,
            isCrossLink: true,
          });
        }
      });
    }
  }

  createVolumetricBezier(p1, p2, seed) {
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(p2, p1);

    // Compute a 3D perpendicular arc vector
    const perp = new THREE.Vector3(-dir.y, dir.x + dir.z * 0.3, -dir.x * 0.3).normalize();
    const arcHeight = Math.sin(seed * 1.6) * 0.35 + 0.15;
    mid.addScaledVector(perp, arcHeight);

    return new THREE.QuadraticBezierCurve3(p1.clone(), mid, p2.clone());
  }

  initBeadStreams() {
    this.beadStreams = [];

    this.filamentObjects.forEach((fil) => {
      const conn = fil.connection || {};
      const beadsPerFilament = 5;
      const beadPositions = new Float32Array(beadsPerFilament * 3);
      const beadGeo = new THREE.BufferGeometry();
      beadGeo.setAttribute('position', new THREE.BufferAttribute(beadPositions, 3));

      const beadColor = conn.accent || '#fed7aa';

      const beadMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          u_opacity: { value: 0.0 },
          u_color: { value: new THREE.Color(beadColor) },
        },
        vertexShader: /* glsl */ `
          uniform float u_opacity;
          varying float v_alpha;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            float dist = max(0.5, -mvPosition.z);
            gl_PointSize = 11.0 * (1.0 / (dist * 0.32));
            gl_PointSize = clamp(gl_PointSize, 3.5, 18.0);
            gl_Position = projectionMatrix * mvPosition;
            v_alpha = u_opacity;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 u_color;
          varying float v_alpha;
          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float d = length(uv);
            if (d > 0.5) discard;
            float shape = exp(-d * 6.5);
            gl_FragColor = vec4(u_color, shape * v_alpha * 0.85);
          }
        `,
      });

      const points = new THREE.Points(beadGeo, beadMat);
      this.group.add(points);

      const progressOffsets = [];
      for (let b = 0; b < beadsPerFilament; b++) {
        progressOffsets.push(b / beadsPerFilament);
      }

      this.beadStreams.push({
        points,
        beadGeo,
        beadMat,
        fil,
        progressOffsets,
        beadsPerFilament,
        direction: conn.direction || 'OUTFLOW',
      });
    });
  }

  morphToGraph() {
    this.targetMorph = 1.0;
  }

  morphToGlobe() {
    this.targetMorph = 0.0;
  }

  update(dt, elapsed, _camera) {
    // Advance the raw (linear) progress at a fixed rate tied to morphDuration, then apply
    // the same ease-in-out curve the camera glide uses - so the constellation unfurls over
    // the full cinematic dive instead of racing to completion via exponential decay.
    const morphStep = dt / this.morphDuration;
    if (this.targetMorph > this.morphLinear) {
      this.morphLinear = Math.min(this.targetMorph, this.morphLinear + morphStep);
    } else if (this.targetMorph < this.morphLinear) {
      this.morphLinear = Math.max(this.targetMorph, this.morphLinear - morphStep);
    }
    this.morphProgress = easeInOutCubic(THREE.MathUtils.clamp(this.morphLinear, 0, 1));
    const t = this.morphProgress;

    // 1. Update Node Positions & Subtle 3D Float
    this.nodeMeshes.forEach((item) => {
      const { mesh, ringMesh, node, mat, ringMat } = item;
      node.currentPos.lerpVectors(node.globePos, node.graphPos, t);

      // Subtle, elegant 3D organic breathing float
      if (t > 0.05) {
        const floatY = Math.sin(elapsed * 1.2 + node.graphPos.x) * 0.02 * t;
        const floatZ = Math.cos(elapsed * 1.1 + node.graphPos.y) * 0.02 * t;
        mesh.position.set(node.currentPos.x, node.currentPos.y + floatY, node.currentPos.z + floatZ);
      } else {
        mesh.position.copy(node.currentPos);
      }

      // Continuous slow orbital ring rotation
      if (ringMesh) {
        ringMesh.rotation.z = elapsed * (node.isCenter ? 0.6 : -0.4);
      }

      // Gentle scale transition, tracking the full glide instead of finishing early
      const morphScale = THREE.MathUtils.smoothstep(t, 0.0, 1.0);
      const isSpotlighted = this.spotlightedEntityIds.size > 0 && (this.spotlightedEntityIds.has(node.entityId) || node.isCenter);
      const spotlightScale = isSpotlighted ? 1.25 : 1.0;
      mesh.scale.setScalar(Math.max(0.0001, node.size * morphScale * spotlightScale));

      // Core opacity without harsh strobe
      if (mat) {
        const targetOpacity = isSpotlighted || this.spotlightedEntityIds.size === 0 ? 0.98 : 0.35;
        mat.opacity = THREE.MathUtils.clamp(morphScale * targetOpacity, 0.0, 0.98);
      }
      if (ringMat) {
        const targetRingOpacity = isSpotlighted || this.spotlightedEntityIds.size === 0 ? 0.70 : 0.20;
        ringMat.opacity = THREE.MathUtils.clamp(morphScale * targetRingOpacity, 0.0, 0.70);
      }
    });

    // 2. Update 3D Filaments
    this.filamentObjects.forEach((fil) => {
      const curve = this.createVolumetricBezier(fil.source.currentPos, fil.target.currentPos, fil.index);
      const points = curve.getPoints(50);
      fil.geo.setFromPoints(points);

      const isSelected = this.selectedEdgeId && (fil.edgeId === this.selectedEdgeId || fil.target.id === this.selectedEdgeId);
      const baseOpacity = isSelected ? 0.95 : this.selectedEdgeId ? 0.12 : 0.60;

      fil.mat.opacity = THREE.MathUtils.clamp((t - 0.05) * (baseOpacity / 0.60 * 1.25), 0.0, baseOpacity);
      fil.curve = curve;
    });

    // 3. Update Steady Fiber-Optic Photon Streams
    this.beadStreams.forEach((bs) => {
      const isSelected = this.selectedEdgeId && (bs.fil.edgeId === this.selectedEdgeId || bs.fil.target.id === this.selectedEdgeId);
      const streamOpacity = isSelected ? 0.98 : this.selectedEdgeId ? 0.15 : 0.88;
      bs.beadMat.uniforms.u_opacity.value = THREE.MathUtils.clamp((t - 0.1) * 1.3, 0.0, streamOpacity);

      if (t > 0.1 && bs.fil.curve) {
        const posAttr = bs.beadGeo.attributes.position;
        const speed = isSelected ? 0.35 : 0.22;

        for (let b = 0; b < bs.beadsPerFilament; b++) {
          let u;
          if (bs.direction === 'INFLOW') {
            u = (bs.progressOffsets[b] - elapsed * speed) % 1.0;
            if (u < 0) u += 1.0;
          } else {
            u = (bs.progressOffsets[b] + elapsed * speed) % 1.0;
          }

          const pt = bs.fil.curve.getPoint(u);
          posAttr.setXYZ(b, pt.x, pt.y, pt.z);
        }
        posAttr.needsUpdate = true;
      }
    });
  }

  /**
   * Projects 3D node world coordinates into 2D screen coordinates with 3D Depth Scaling
   */
  getNodeScreenPositions(camera, width, height) {
    if (this.morphProgress < 0.05) return [];

    const projected = [];
    const tempV = new THREE.Vector3();

    this.nodes.forEach((node) => {
      tempV.copy(node.currentPos);
      const worldDist = camera.position.distanceTo(tempV);
      tempV.project(camera);

      // Node must be in front of the camera
      const isVisible = tempV.z < 1.0 && tempV.z > -1.0;
      const x = ((tempV.x + 1) * width) / 2;
      const y = ((-tempV.y + 1) * height) / 2;

      // Depth perception scale: closer nodes appear larger, background nodes appear smaller
      const depthScale = THREE.MathUtils.clamp(4.8 / Math.max(1.5, worldDist), 0.65, 1.25);
      const depthOpacity = THREE.MathUtils.clamp(5.8 / Math.max(2.0, worldDist), 0.45, 1.0);

      projected.push({
        id: node.id,
        entityId: node.entityId,
        name: node.name,
        role: node.role,
        type: node.type,
        category: node.category,
        riskLevel: node.riskLevel,
        riskScore: node.riskScore,
        totalInflow: node.totalInflow,
        totalOutflow: node.totalOutflow,
        color: node.accent,
        isCenter: node.isCenter,
        degree: node.degree || 1,
        isEvidence: node.isEvidence || false,
        evidenceType: node.evidenceType || null,
        evidenceData: node.evidenceData || null,
        x,
        y,
        depthScale,
        depthOpacity,
        visible: isVisible,
        opacity: THREE.MathUtils.smoothstep(this.morphProgress, 0.0, 1.0) * depthOpacity,
        connection: node.connection,
        data: node.data,
      });
    });

    return projected;
  }

  destroy() {
    this.clearObjects();
    if (this.group.parent) {
      this.group.parent.remove(this.group);
    }
  }
}
