import * as THREE from 'three';
import { getNetworkForEntity } from '../data/syntheticDataset.js';

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

    this.morphProgress = 0; // 0 = Globe, 1 = 3D Graph
    this.targetMorph = 0;
    this.currentEntity = null;

    this.nodeMeshes = [];
    this.filamentObjects = [];
    this.beadStreams = [];

    // Initialize with Kabir Singhania or default primary
    this.setEntity('kabir-singhania');
  }

  setEntity(queryOrId) {
    const entityData = typeof queryOrId === 'string' ? getNetworkForEntity(queryOrId) : queryOrId;
    this.currentEntity = entityData;
    this.rebuildNetwork(entityData);
  }

  rebuildNetwork(entityData) {
    this.clearObjects();

    this.nodes = [];

    // 1. Central Target Node at 3D Origin
    this.nodes.push({
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
      accent: entityData.accent || '#ef4444',
      size: 0.088,
      globePos: new THREE.Vector3(0, 0, 1.35),
      graphPos: new THREE.Vector3(0, 0, 0),
      currentPos: new THREE.Vector3(0, 0, 1.35),
      isCenter: true,
      data: entityData,
    });

    // 2. Connected Counterparties in Volumetric 3D Space
    const connections = entityData.connections || [];
    const count = connections.length;

    // Golden spiral / spherical distribution for rich 3D constellation depth
    const phiRatio = (1 + Math.sqrt(5)) / 2;

    connections.forEach((conn, index) => {
      // 3D Spherical angles
      const theta = 2 * Math.PI * index / phiRatio;
      const yNorm = 1 - (index / (count - 1 || 1)) * 2; // -1 to +1
      const radiusAtY = Math.sqrt(Math.max(0.18, 1 - yNorm * yNorm));

      // Expand into true volumetric 3D coordinates
      // Varied radii create depth layers: some foreground, some mid, some background
      const tierDistance = 1.65 + ((index * 2) % 4) * 0.26;
      const gx = Math.cos(theta) * radiusAtY * (tierDistance * 1.02);
      const gy = yNorm * (tierDistance * 0.70);
      // Dramatic Z depth ranging from -1.8 (deep background) to +1.7 (foreground)
      const gz = Math.sin(theta) * radiusAtY * (tierDistance * 0.92);

      // Spherical seed position on the globe before morph
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
        size: 0.056,
        globePos: globeSeed,
        graphPos: new THREE.Vector3(gx, gy, gz),
        currentPos: globeSeed.clone(),
        isCenter: false,
        connection: conn,
      });
    });

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
    const centerNode = this.nodes[0];

    for (let i = 1; i < this.nodes.length; i++) {
      const targetNode = this.nodes[i];
      const curve = this.createVolumetricBezier(centerNode.currentPos, targetNode.currentPos, i);
      const points = curve.getPoints(50);
      const geo = new THREE.BufferGeometry().setFromPoints(points);

      const edgeColor = targetNode.accent || '#818cf8';
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
        source: centerNode,
        target: targetNode,
        index: i,
        curve,
        connection: targetNode.connection,
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
      // Elegant number of light packets: 4 to 6 beads per filament
      const beadsPerFilament = 5;
      const beadPositions = new Float32Array(beadsPerFilament * 3);
      const beadGeo = new THREE.BufferGeometry();
      beadGeo.setAttribute('position', new THREE.BufferAttribute(beadPositions, 3));

      const beadColor = conn.accent || '#c084fc';

      // Refined fiber-optic shader: constant smooth light beads without blinding strobe
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
            // Steady 3D perspective sizing
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
            // Smooth Gaussian profile without harsh core glare
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
    // Smooth cubic easing interpolation for 3D explosion
    this.morphProgress += (this.targetMorph - this.morphProgress) * (dt * 3.6);
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

      // Gentle scale transition
      const morphScale = THREE.MathUtils.smoothstep(t, 0.02, 0.95);
      mesh.scale.setScalar(Math.max(0.0001, node.size * morphScale));

      // Core opacity without harsh strobe
      if (mat) {
        mat.opacity = THREE.MathUtils.clamp(morphScale * 0.98, 0.0, 0.98);
      }
      if (ringMat) {
        ringMat.opacity = THREE.MathUtils.clamp(morphScale * 0.70, 0.0, 0.70);
      }
    });

    // 2. Update 3D Filaments
    this.filamentObjects.forEach((fil) => {
      const curve = this.createVolumetricBezier(fil.source.currentPos, fil.target.currentPos, fil.index);
      const points = curve.getPoints(50);
      fil.geo.setFromPoints(points);

      fil.mat.opacity = THREE.MathUtils.clamp((t - 0.05) * 1.25, 0.0, 0.60);
      fil.curve = curve;
    });

    // 3. Update Steady Fiber-Optic Photon Streams
    this.beadStreams.forEach((bs) => {
      bs.beadMat.uniforms.u_opacity.value = THREE.MathUtils.clamp((t - 0.1) * 1.3, 0.0, 0.88);

      if (t > 0.1 && bs.fil.curve) {
        const posAttr = bs.beadGeo.attributes.position;
        // Smooth, dignified constant speed: 0.22/sec
        const speed = 0.22;

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
        x,
        y,
        depthScale,
        depthOpacity,
        visible: isVisible,
        opacity: THREE.MathUtils.smoothstep(this.morphProgress, 0.15, 0.95) * depthOpacity,
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
