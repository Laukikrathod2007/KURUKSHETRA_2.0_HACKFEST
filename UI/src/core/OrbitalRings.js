import * as THREE from 'three';

/**
 * Creates diagonal orbital trajectory rings around the particle universe globe
 * with moving data pulses, matching Reference Image 1.
 */
export class OrbitalRings {
  constructor(radius = 1.45) {
    this.group = new THREE.Group();
    this.radius = radius;
    this.rings = [];
    this.beadSystems = [];

    this.initRings();
  }

  initRings() {
    const ringConfigs = [
      { rX: 1.48, rY: 1.42, tiltX: 0.52, tiltY: 0.2, tiltZ: -0.45, speed: 0.45, color: '#fed7aa' },
      { rX: 1.55, rY: 1.46, tiltX: -0.65, tiltY: 0.35, tiltZ: 0.55, speed: -0.38, color: '#fdba74' },
      { rX: 1.62, rY: 1.50, tiltX: 0.15, tiltY: 0.85, tiltZ: 0.25, speed: 0.52, color: '#fb7185' },
    ];

    ringConfigs.forEach((cfg) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.set(cfg.tiltX, cfg.tiltY, cfg.tiltZ);

      // 1. Continuous thin curved orbital line
      const points = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * cfg.rX, Math.sin(theta) * cfg.rY, 0));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(cfg.color),
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      ringGroup.add(line);

      // 2. Data Packet Beads traveling along the trajectory
      const beadCount = 14;
      const beadPositions = new Float32Array(beadCount * 3);
      const beadSizes = new Float32Array(beadCount);
      const beadOffsets = [];

      for (let i = 0; i < beadCount; i++) {
        beadOffsets.push(i / beadCount);
        beadSizes[i] = 1.5 + Math.random() * 2.0;
      }

      const beadGeo = new THREE.BufferGeometry();
      beadGeo.setAttribute('position', new THREE.BufferAttribute(beadPositions, 3));
      beadGeo.setAttribute('size', new THREE.BufferAttribute(beadSizes, 1));

      // Bead point shader
      const beadMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          u_time: { value: 0 },
          u_opacity: { value: 1.0 },
          u_color: { value: new THREE.Color('#ffffff') },
          u_accent: { value: new THREE.Color(cfg.color) },
        },
        vertexShader: /* glsl */ `
          attribute float size;
          uniform float u_opacity;
          varying float v_alpha;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (1.0 / max(0.2, -mvPosition.z * 0.3)) * 14.0;
            gl_Position = projectionMatrix * mvPosition;
            v_alpha = u_opacity;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 u_color;
          uniform vec3 u_accent;
          varying float v_alpha;
          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float d = length(uv);
            if (d > 0.5) discard;
            float core = smoothstep(0.25, 0.0, d);
            float halo = smoothstep(0.5, 0.0, d) * 0.4;
            vec3 col = mix(u_accent, u_color, core);
            gl_FragColor = vec4(col, (core + halo) * v_alpha);
          }
        `,
      });

      const beadPoints = new THREE.Points(beadGeo, beadMat);
      ringGroup.add(beadPoints);

      this.group.add(ringGroup);
      this.rings.push({ ringGroup, lineMat, beadMat, beadGeo, cfg, beadOffsets, beadCount });
    });
  }

  update(dt, elapsed, morphProgress = 0) {
    const opacity = Math.max(0, 1.0 - morphProgress * 1.5);

    this.rings.forEach((r) => {
      // Rotate ring group slightly
      r.ringGroup.rotation.z += r.cfg.speed * dt * 0.2;

      // Update line & bead opacity
      r.lineMat.opacity = 0.35 * opacity;
      r.beadMat.uniforms.u_opacity.value = opacity;

      // Update bead positions along ellipse
      const posAttr = r.beadGeo.attributes.position;
      for (let i = 0; i < r.beadCount; i++) {
        const offset = (r.beadOffsets[i] + elapsed * r.cfg.speed * 0.15) % 1.0;
        const theta = offset * Math.PI * 2;
        const x = Math.cos(theta) * r.cfg.rX;
        const y = Math.sin(theta) * r.cfg.rY;
        posAttr.setXYZ(i, x, y, 0);
      }
      posAttr.needsUpdate = true;
    });
  }

  destroy() {
    this.rings.forEach((r) => {
      r.lineMat.dispose();
      r.beadMat.dispose();
      r.beadGeo.dispose();
    });
  }
}
