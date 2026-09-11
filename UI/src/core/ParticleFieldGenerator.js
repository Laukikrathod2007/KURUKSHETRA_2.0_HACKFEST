import * as THREE from 'three';
import { SYNTHETIC_ENTITIES } from '../data/syntheticDataset.js';

/**
 * Builds the volumetric multi-population particle geometry and network filaments.
 * Generates ~42,000 particles across 5 distinct spatial populations:
 * 1. Dense Volumetric Core (interior volume)
 * 2. Dense Outer Shell (crisp spherical boundary)
 * 3. Secondary Outer Shell (ethereal secondary envelope)
 * 4. Drifting Halo Dust (cosmic wandering points beyond silhouette)
 * 5. Primary Anchor / Neural Hub Nodes (luminous anchor points)
 */
export function createParticleUniverseGeometry(options = {}) {
  const coreCount = options.coreCount || 6000;
  const shellCount = options.shellCount || 11000;
  const secondaryShellCount = options.secondaryShellCount || 5200;
  const haloCount = options.haloCount || 3200;
  const totalCount = coreCount + shellCount + secondaryShellCount + haloCount;

  const baseRadius = options.radius || 1.35;

  const positions = new Float32Array(totalCount * 3);
  const targets = new Float32Array(totalCount * 3);
  const sizes = new Float32Array(totalCount);
  const layers = new Float32Array(totalCount);
  const types = new Float32Array(totalCount);
  const phases = new Float32Array(totalCount);
  const speeds = new Float32Array(totalCount);
  const customColors = new Float32Array(totalCount * 3);
  const hasCustomColors = new Float32Array(totalCount);

  let pIdx = 0;
  const anchorPositions = [];
  const entityNodes = [];
  const allEntities = Object.values(SYNTHETIC_ENTITIES);
  const totalEntities = allEntities.length;

  // Helper: Fibonacci sphere point with jitter
  function getFibonacciSpherePoint(i, total, r, jitter = 0.03) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const rad = r + (Math.random() - 0.5) * jitter;
    return new THREE.Vector3(
      rad * Math.sin(phi) * Math.cos(theta),
      rad * Math.sin(phi) * Math.sin(theta),
      rad * Math.cos(phi)
    );
  }

  // 1. DENSE VOLUMETRIC CORE (Interior Volume with volumetric depth)
  for (let i = 0; i < coreCount; i++) {
    const r = (0.18 + Math.pow(Math.random(), 0.72) * 0.78) * baseRadius;
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const sinPhi = Math.sin(phi);

    const x = r * sinPhi * Math.cos(theta);
    const y = r * sinPhi * Math.sin(theta);
    const z = r * Math.cos(phi);

    const i3 = pIdx * 3;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    // Burst destination: scattered outwards along random vectors with turbulence
    const burstDist = baseRadius * (1.8 + Math.random() * 2.2);
    const burstDir = new THREE.Vector3(x, y, z).normalize();
    targets[i3] = burstDir.x * burstDist + (Math.random() - 0.5) * 0.4;
    targets[i3 + 1] = burstDir.y * burstDist + (Math.random() - 0.5) * 0.4;
    targets[i3 + 2] = burstDir.z * burstDist + (Math.random() - 0.5) * 0.4;

    const isAnchor = Math.random() < 0.035;
    sizes[pIdx] = isAnchor ? 2.5 + Math.random() * 0.8 : 0.45 + Math.random() * 0.35;
    layers[pIdx] = (r / baseRadius) * 0.5; // Layer 0.0 - 0.5
    types[pIdx] = isAnchor ? 1.0 : 0.0;
    phases[pIdx] = Math.random() * Math.PI * 2;
    speeds[pIdx] = 0.6 + Math.random() * 0.8;

    if (isAnchor && anchorPositions.length < 450) {
      anchorPositions.push(new THREE.Vector3(x, y, z));
    }
    pIdx++;
  }

  // 2. DENSE OUTER SHELL (Defines the Spherical Silhouette)
  for (let i = 0; i < shellCount; i++) {
    const pt = getFibonacciSpherePoint(i, shellCount, baseRadius, 0.045);
    const i3 = pIdx * 3;
    positions[i3] = pt.x;
    positions[i3 + 1] = pt.y;
    positions[i3 + 2] = pt.z;

    const burstDist = baseRadius * (2.2 + Math.random() * 2.5);
    const burstDir = pt.clone().normalize();
    targets[i3] = burstDir.x * burstDist;
    targets[i3 + 1] = burstDir.y * burstDist;
    targets[i3 + 2] = burstDir.z * burstDist;

    // Evenly scatter the 100+ entities across the shell particles
    const entityInterval = Math.max(1, Math.floor(shellCount / (totalEntities + 2)));
    const isEntity = (i % entityInterval === 0) && (entityNodes.length < totalEntities);

    if (isEntity) {
      const entity = allEntities[entityNodes.length];
      sizes[pIdx] = 2.6 + (entity.riskLevel === 'CRITICAL' ? 0.7 : 0.3);
      layers[pIdx] = 0.72;
      types[pIdx] = 1.0;
      phases[pIdx] = Math.random() * Math.PI * 2;
      speeds[pIdx] = 0.8;

      hasCustomColors[pIdx] = 1.0;
      const col = new THREE.Color(entity.accent || '#fed7aa');
      customColors[pIdx * 3] = col.r;
      customColors[pIdx * 3 + 1] = col.g;
      customColors[pIdx * 3 + 2] = col.b;

      entity.globePosition = pt.clone();
      entityNodes.push({
        entity,
        position: pt.clone(),
        index: pIdx,
      });
      anchorPositions.push(pt.clone());
    } else {
      const isAnchor = Math.random() < 0.042;
      sizes[pIdx] = isAnchor ? 2.3 + Math.random() * 0.9 : 0.55 + Math.random() * 0.35;
      layers[pIdx] = 0.72 + (Math.random() - 0.5) * 0.08;
      types[pIdx] = isAnchor ? 1.0 : 0.0;
      phases[pIdx] = Math.random() * Math.PI * 2;
      speeds[pIdx] = 0.8 + Math.random() * 0.5;

      hasCustomColors[pIdx] = 0.0;

      if (isAnchor && anchorPositions.length < 450) {
        anchorPositions.push(pt);
      }
    }
    pIdx++;
  }

  // 3. SECONDARY OUTER SHELL (Soft ethereal envelope)
  const secondaryRadius = baseRadius * 1.12;
  for (let i = 0; i < secondaryShellCount; i++) {
    const pt = getFibonacciSpherePoint(i, secondaryShellCount, secondaryRadius, 0.08);
    const i3 = pIdx * 3;
    positions[i3] = pt.x;
    positions[i3 + 1] = pt.y;
    positions[i3 + 2] = pt.z;

    const burstDist = secondaryRadius * (2.0 + Math.random() * 2.0);
    const burstDir = pt.clone().normalize();
    targets[i3] = burstDir.x * burstDist;
    targets[i3 + 1] = burstDir.y * burstDist;
    targets[i3 + 2] = burstDir.z * burstDist;

    const isAnchor = Math.random() < 0.032;
    sizes[pIdx] = isAnchor ? 2.2 + Math.random() * 0.8 : 0.45 + Math.random() * 0.35;
    layers[pIdx] = 0.88 + (Math.random() - 0.5) * 0.06;
    types[pIdx] = isAnchor ? 1.0 : 0.0;
    phases[pIdx] = Math.random() * Math.PI * 2;
    speeds[pIdx] = 0.7 + Math.random() * 0.6;

    if (isAnchor && anchorPositions.length < 450) {
      anchorPositions.push(pt);
    }
    pIdx++;
  }

  // 4. DRIFTING COSMIC HALO (Wandering particles outside the sphere)
  for (let i = 0; i < haloCount; i++) {
    const r = baseRadius * (1.25 + Math.pow(Math.random(), 1.6) * 0.85);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const sinPhi = Math.sin(phi);

    const x = r * sinPhi * Math.cos(theta);
    const y = r * sinPhi * Math.sin(theta);
    const z = r * Math.cos(phi);

    const i3 = pIdx * 3;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    const burstDist = r * (1.6 + Math.random() * 1.8);
    const burstDir = new THREE.Vector3(x, y, z).normalize();
    targets[i3] = burstDir.x * burstDist;
    targets[i3 + 1] = burstDir.y * burstDist;
    targets[i3 + 2] = burstDir.z * burstDist;

    sizes[pIdx] = 0.4 + Math.random() * 0.45;
    layers[pIdx] = 1.0;
    types[pIdx] = 0.0;
    phases[pIdx] = Math.random() * Math.PI * 2;
    speeds[pIdx] = 0.4 + Math.random() * 0.5;
    pIdx++;
  }

  // Build BufferGeometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('a_target', new THREE.BufferAttribute(targets, 3));
  geometry.setAttribute('a_size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('a_layer', new THREE.BufferAttribute(layers, 1));
  geometry.setAttribute('a_type', new THREE.BufferAttribute(types, 1));
  geometry.setAttribute('a_phase', new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute('a_speed', new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute('a_customColor', new THREE.BufferAttribute(customColors, 3));
  geometry.setAttribute('a_hasCustomColor', new THREE.BufferAttribute(hasCustomColors, 1));

  return {
    geometry,
    totalCount,
    anchorPositions,
    entityNodes,
  };
}

/**
 * Builds the faint neural connecting filaments between proximate anchor nodes.
 * Creates delicate, depth-aware network connections without cluttering the volume.
 */
export function createFilamentGeometry(anchorPositions, options = {}) {
  const maxDistance = options.maxDistance || 0.48;
  const maxConnectionsPerNode = options.maxConnectionsPerNode || 4;

  const lineCoords = [];
  const lineAlphas = [];
  const lineActivity = [];

  for (let i = 0; i < anchorPositions.length; i++) {
    const p1 = anchorPositions[i];
    let connCount = 0;

    for (let j = i + 1; j < anchorPositions.length; j++) {
      if (connCount >= maxConnectionsPerNode) break;

      const p2 = anchorPositions[j];
      const dist = p1.distanceTo(p2);

      if (dist < maxDistance && dist > 0.05) {
        // Vertex 1
        lineCoords.push(p1.x, p1.y, p1.z);
        // Vertex 2
        lineCoords.push(p2.x, p2.y, p2.z);

        // Alpha scales with proximity: closer = clearer, farther = fainter
        const alpha = Math.pow(1.0 - dist / maxDistance, 1.4) * 0.42;
        lineAlphas.push(alpha, alpha);

        const activity = Math.random();
        lineActivity.push(activity, activity);

        connCount++;
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineCoords), 3));
  geometry.setAttribute('a_alpha', new THREE.BufferAttribute(new Float32Array(lineAlphas), 1));
  geometry.setAttribute('a_activity', new THREE.BufferAttribute(new Float32Array(lineActivity), 1));

  return {
    geometry,
    filamentCount: lineCoords.length / 6,
  };
}
