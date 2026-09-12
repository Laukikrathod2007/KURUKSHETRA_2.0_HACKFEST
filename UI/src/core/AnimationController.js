/**
 * Physics-based Animation State Controller for the 3D Particle Universe.
 * Drives spring mechanics, smooth cubic easing, and cinematic transitions.
 */
export class AnimationController {
  constructor(particleMaterial, filamentMaterial, particleGroup) {
    this.particleMaterial = particleMaterial;
    this.filamentMaterial = filamentMaterial;
    this.particleGroup = particleGroup;

    // Uniform references
    this.pUniforms = particleMaterial.uniforms;
    this.fUniforms = filamentMaterial.uniforms;

    // State Variables & Physics Springs
    this.activeState = 'LIVING_IDLE';

    // Pulse
    this.pulseActive = false;
    this.pulseTime = 0;
    this.pulseDuration = 1.6;

    // Expand
    this.expandVal = 0;
    this.expandTarget = 0;
    this.expandVelocity = 0;

    // Compress
    this.compressVal = 0;
    this.compressTarget = 0;
    this.compressVelocity = 0;

    // Wave
    this.waveVal = 0;
    this.waveTarget = 0;
    this.waveTime = 0;
    this.waveActive = false;

    // Burst
    this.burstVal = 0;
    this.burstTarget = 0;
    this.burstVelocity = 0;

    // Rotation Boost
    this.extraRotationVelocity = 0;
    this.baseRotationSpeed = 0.08;

    // Noise strength
    this.noiseVal = 1.0;
  }

  // --- STATE TRIGGERS ---

  triggerPulse(intensity = 1.8) {
    this.activeState = 'ENERGY_PULSE';
    this.pulseActive = true;
    this.pulseTime = 0;
    this.pUniforms.u_pulseIntensity.value = intensity;
    this.fUniforms.u_pulseIntensity.value = intensity;
  }

  triggerExpand(magnitude = 1.25) {
    this.activeState = 'RADIAL_EXPANSION';
    this.expandTarget = magnitude;
    this.expandVelocity = 3.5;
    // Auto rebound back to 0 after apex
    setTimeout(() => {
      this.expandTarget = 0;
      this.activeState = 'LIVING_IDLE';
    }, 1100);
  }

  triggerCompress() {
    this.activeState = 'SINGULARITY_COMPRESSION';
    this.compressTarget = 1.0;
    this.compressVelocity = 2.8;
    // Auto release and rebound
    setTimeout(() => {
      this.compressTarget = 0;
      this.activeState = 'LIVING_IDLE';
    }, 950);
  }

  triggerWave() {
    this.activeState = 'WAVE_DISTORTION';
    this.waveActive = true;
    this.waveTime = 0;
    this.waveTarget = 1.0;
    setTimeout(() => {
      this.waveTarget = 0;
      this.waveActive = false;
      this.activeState = 'LIVING_IDLE';
    }, 2200);
  }

  triggerBurst() {
    this.activeState = 'PARTICLE_BURST';
    this.burstTarget = 1.0;
    this.burstVelocity = 4.0;
    this.triggerPulse(2.4);

    // After apex, automatically trigger reformation
    setTimeout(() => {
      this.triggerReform();
    }, 1400);
  }

  triggerReform() {
    this.activeState = 'REFORMATION';
    this.burstTarget = 0;
    this.expandTarget = 0;
    this.compressTarget = 0;
    this.waveTarget = 0;
    setTimeout(() => {
      this.activeState = 'LIVING_IDLE';
    }, 1200);
  }

  triggerRotationBoost() {
    this.extraRotationVelocity = 0.85;
  }

  reset() {
    this.activeState = 'LIVING_IDLE';
    this.pulseActive = false;
    this.pulseTime = 0;
    this.expandVal = 0;
    this.expandTarget = 0;
    this.expandVelocity = 0;
    this.compressVal = 0;
    this.compressTarget = 0;
    this.compressVelocity = 0;
    this.waveVal = 0;
    this.waveTarget = 0;
    this.burstVal = 0;
    this.burstTarget = 0;
    this.burstVelocity = 0;
    this.extraRotationVelocity = 0;

    this.pUniforms.u_pulseProgress.value = 0;
    this.fUniforms.u_pulseProgress.value = 0;
    this.pUniforms.u_expand.value = 0;
    this.pUniforms.u_compress.value = 0;
    this.pUniforms.u_waveStrength.value = 0;
    this.pUniforms.u_burst.value = 0;
  }

  // --- FRAME UPDATE ---

  update(dt, elapsed) {
    // 1. Time propagation
    this.pUniforms.u_time.value = elapsed;
    this.fUniforms.u_time.value = elapsed;

    // 2. Pulse propagation (Spherical shockwave wave-front)
    if (this.pulseActive) {
      this.pulseTime += dt;
      const progress = this.pulseTime / this.pulseDuration;
      if (progress >= 1.0) {
        this.pulseActive = false;
        this.pUniforms.u_pulseProgress.value = 0;
        this.fUniforms.u_pulseProgress.value = 0;
      } else {
        // Smooth cubic ease-out
        const easeProgress = 1 - Math.pow(1 - progress, 2.5);
        this.pUniforms.u_pulseProgress.value = easeProgress;
        this.fUniforms.u_pulseProgress.value = easeProgress;
      }
    }

    // 3. Spring physics for Expansion
    const springK = 24.0;
    const damping = 6.8;
    const expandForce = (this.expandTarget - this.expandVal) * springK;
    this.expandVelocity += (expandForce - this.expandVelocity * damping) * dt;
    this.expandVal += this.expandVelocity * dt;
    this.pUniforms.u_expand.value = Math.max(0, this.expandVal);

    // 4. Spring physics for Compression
    const compForce = (this.compressTarget - this.compressVal) * 32.0;
    this.compressVelocity += (compForce - this.compressVelocity * 8.2) * dt;
    this.compressVal += this.compressVelocity * dt;
    this.pUniforms.u_compress.value = Math.max(0, this.compressVal);

    // 5. Wave distortion interpolation
    this.waveVal += (this.waveTarget - this.waveVal) * (dt * 3.5);
    this.pUniforms.u_waveStrength.value = this.waveVal;

    // 6. Burst & Reformation spring
    const burstForce = (this.burstTarget - this.burstVal) * 20.0;
    this.burstVelocity += (burstForce - this.burstVelocity * 6.0) * dt;
    this.burstVal += this.burstVelocity * dt;
    this.pUniforms.u_burst.value = Math.max(0, this.burstVal);

    // 7. Continuous Living Differential Rotation & Inertia
    this.extraRotationVelocity += (0 - this.extraRotationVelocity) * (dt * 1.8);
    const currentSpeed = this.baseRotationSpeed + this.extraRotationVelocity;

    if (this.particleGroup) {
      this.particleGroup.rotation.y += currentSpeed * dt;
      // Gentle multi-axis precession
      this.particleGroup.rotation.x = -0.18 + Math.sin(elapsed * 0.35) * 0.06;
      this.particleGroup.rotation.z = 0.12 + Math.cos(elapsed * 0.28) * 0.05;
    }
  }
}
