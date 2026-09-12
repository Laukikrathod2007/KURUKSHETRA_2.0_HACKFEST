import * as THREE from 'three';
import { starFlareVertexShader, starFlareFragmentShader } from '../shaders/StarFlareShaders.js';

/**
 * Creates 4-point optical diffraction star spikes on primary celestial anchor hubs,
 * directly matching Reference Image 1 & 2.
 */
export class StarFlareSystem {
  constructor(anchorPositions) {
    this.group = new THREE.Group();
    this.initFlares(anchorPositions);
  }

  initFlares(anchorPositions) {
    // Select top 8 key anchor hubs (tasteful, subtle shimmer)
    const count = Math.min(anchorPositions.length, 8);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const rots = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#ffffff'), // Pure soft white
      new THREE.Color('#e2e8f0'), // Muted silver
      new THREE.Color('#fed7aa'), // Pale peach-gold (matches globe accent)
      new THREE.Color('#ffe4e1'), // Faint warm blush white
    ];

    for (let i = 0; i < count; i++) {
      const pos = anchorPositions[i];
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      // Subtle, refined flare sizes
      sizes[i] = 1.0 + Math.random() * 0.4;
      rots[i] = (Math.PI / 4) * (Math.random() * 0.4 - 0.2);

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('a_size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('a_rot', new THREE.BufferAttribute(rots, 1));
    geometry.setAttribute('a_color', new THREE.BufferAttribute(colors, 3));

    this.material = new THREE.ShaderMaterial({
      vertexShader: starFlareVertexShader,
      fragmentShader: starFlareFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        u_time: { value: 0 },
        u_pointSize: { value: 18.0 },
        u_morphProgress: { value: 0.0 },
      },
    });

    this.points = new THREE.Points(geometry, this.material);
    this.group.add(this.points);
  }

  update(elapsed, morphProgress = 0) {
    if (this.material) {
      this.material.uniforms.u_time.value = elapsed;
      this.material.uniforms.u_morphProgress.value = morphProgress;
    }
  }

  destroy() {
    if (this.points) {
      this.points.geometry.dispose();
      this.material.dispose();
    }
  }
}
