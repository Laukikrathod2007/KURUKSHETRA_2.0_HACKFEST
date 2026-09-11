import * as THREE from 'three';

/**
 * Cinematic 3D Camera Controller with Smooth Hyperspace Glide,
 * Dynamic Parallax, and Full 360-Degree Interactive 3D Orbit.
 */
export class CinematicCamera {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    // Modes: 'CINEMATIC_ORBIT' | 'GLIDE_TO_GRAPH' | 'GLIDE_TO_GLOBE' | 'INTERACTIVE'
    this.mode = 'CINEMATIC_ORBIT';

    // Target lookAt point
    this.target = new THREE.Vector3(0, 0, 0);
    this.currentTarget = new THREE.Vector3(0, 0, 0);

    // Dynamic lateral framing offset (shifts camera along right axis, moving graph to the left on screen)
    this.targetLateralOffset = 0.78;
    this.currentLateralOffset = 0.0;
    this.isGraphActive = false;
    this.sidebarOpen = true;
    this.sidebarExpanded = false;

    // Spherical coordinates
    this.radius = 5.6;
    this.targetRadius = 5.6;
    this.theta = 0.2; // Horizontal angle (radians)
    this.phi = Math.PI * 0.45; // Vertical elevation angle

    // Interactive Drag & Momentum
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.velocity = { theta: 0, phi: 0 };

    // Hyperspace Glide Animation State
    this.glideProgress = 0;
    this.glideDuration = 1.35; // seconds
    this.glideFrom = { theta: 0, phi: 0, radius: 5.6 };
    this.glideTo = { theta: 0.38, phi: 1.38, radius: 4.5 };
    this.onGlideComplete = null;

    this.bindEvents();
  }

  setSidebarOffset(isOpen, isExpanded = false) {
    this.sidebarOpen = isOpen;
    this.sidebarExpanded = isExpanded;
    if (!isOpen) {
      this.targetLateralOffset = 0.0;
    } else if (isExpanded) {
      this.targetLateralOffset = 1.15;
    } else {
      this.targetLateralOffset = 0.78;
    }
  }

  setMode(newMode) {
    this.mode = newMode;
    if (newMode === 'CINEMATIC_ORBIT') {
      this.targetRadius = 5.6;
    } else if (newMode === 'INTERACTIVE') {
      this.velocity = { theta: 0, phi: 0 };
    }
  }

  startGlideToGraph(onStart, onComplete) {
    this.mode = 'GLIDE_TO_GRAPH';
    this.isGraphActive = true;
    this.glideProgress = 0;

    this.glideFrom = {
      theta: this.theta,
      phi: this.phi,
      radius: this.radius,
    };

    // Engaging 3D perspective angle: slightly tilted down & angled from the right
    this.setSidebarOffset(this.sidebarOpen, this.sidebarExpanded);

    this.glideTo = {
      theta: 0.38,
      phi: 1.36,
      radius: 4.5,
    };

    if (onStart) onStart();
    this.onGlideComplete = onComplete;
  }

  resetToGlobe() {
    this.mode = 'GLIDE_TO_GLOBE';
    this.isGraphActive = false;
    this.glideProgress = 0;
    this.targetLateralOffset = 0.0;
    this.target.set(0, 0, 0);
    this.glideFrom = {
      theta: this.theta,
      phi: this.phi,
      radius: this.radius,
    };
    this.glideTo = {
      theta: 0.15,
      phi: Math.PI * 0.45,
      radius: 5.6,
    };
  }

  bindEvents() {
    const el = this.domElement;

    const onPointerDown = (e) => {
      // Don't drag if clicking UI buttons or input
      if (e.target.closest('button, input, .entity-dossier-drawer, .search-suggestions-dropdown')) {
        return;
      }
      this.isDragging = true;
      this.prevMouse.x = e.clientX;
      this.prevMouse.y = e.clientY;
      this.mode = 'INTERACTIVE';
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this.prevMouse.x = e.clientX;
      this.prevMouse.y = e.clientY;

      const rotSpeed = 0.0058;
      this.velocity.theta -= dx * rotSpeed;
      this.velocity.phi -= dy * rotSpeed;
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    const onWheel = (e) => {
      // Allow scrolling inside dossier drawer without zooming 3D canvas
      if (e.target.closest('.entity-dossier-drawer, .search-suggestions-dropdown')) {
        return;
      }
      e.preventDefault();
      this.mode = 'INTERACTIVE';
      const zoomSpeed = 0.0028;
      this.targetRadius += e.deltaY * zoomSpeed;
      this.targetRadius = THREE.MathUtils.clamp(this.targetRadius, 2.2, 9.2);
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    this.cleanup = () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('wheel', onWheel);
    };
  }

  update(dt, elapsed) {
    if (this.mode === 'CINEMATIC_ORBIT') {
      // Majestic slow 3D orbit around the globe
      this.theta += 0.12 * dt;
      const targetPhi = Math.PI * 0.45 + Math.sin(elapsed * 0.25) * 0.12;
      this.phi += (targetPhi - this.phi) * (dt * 1.5);
      this.targetRadius = 5.4 + Math.sin(elapsed * 0.3) * 0.4;

    } else if (this.mode === 'GLIDE_TO_GRAPH') {
      // Seamless cinematic glide directly into 3D network view
      this.glideProgress += dt / this.glideDuration;
      const p = Math.min(this.glideProgress, 1.0);
      // Smooth cubic ease-out: starts with momentum, decelerates like silk
      const ease = 1 - Math.pow(1 - p, 3);

      this.theta = THREE.MathUtils.lerp(this.glideFrom.theta, this.glideTo.theta, ease);
      this.phi = THREE.MathUtils.lerp(this.glideFrom.phi, this.glideTo.phi, ease);
      this.targetRadius = THREE.MathUtils.lerp(this.glideFrom.radius, this.glideTo.radius, ease);

      if (p >= 1.0) {
        this.mode = 'INTERACTIVE';
        if (this.onGlideComplete) {
          this.onGlideComplete();
          this.onGlideComplete = null;
        }
      }

    } else if (this.mode === 'GLIDE_TO_GLOBE') {
      this.glideProgress += dt / 1.2;
      const p = Math.min(this.glideProgress, 1.0);
      const ease = 1 - Math.pow(1 - p, 3);

      this.theta = THREE.MathUtils.lerp(this.glideFrom.theta, this.glideTo.theta, ease);
      this.phi = THREE.MathUtils.lerp(this.glideFrom.phi, this.glideTo.phi, ease);
      this.targetRadius = THREE.MathUtils.lerp(this.glideFrom.radius, this.glideTo.radius, ease);

      if (p >= 1.0) {
        this.mode = 'CINEMATIC_ORBIT';
      }

    } else if (this.mode === 'INTERACTIVE') {
      // User 3D Orbit navigation with inertia and damping
      this.theta += this.velocity.theta;
      this.phi += this.velocity.phi;

      // Inertial friction
      this.velocity.theta *= 0.90;
      this.velocity.phi *= 0.90;

      // Clamp vertical elevation to prevent upside-down flip
      this.phi = THREE.MathUtils.clamp(this.phi, 0.12, Math.PI - 0.12);

      // Subtle atmospheric idle drift when user isn't actively rotating
      if (!this.isDragging && Math.abs(this.velocity.theta) < 0.001) {
        this.theta += 0.025 * dt; // gentle continuous rotation showing 3D depth
      }
    }

    // Smooth radius interpolation
    this.radius += (this.targetRadius - this.radius) * (dt * 5.0);

    // Spherical to Cartesian 3D coordinates
    const x = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
    const y = this.radius * Math.cos(this.phi);
    const z = this.radius * Math.sin(this.phi) * Math.cos(this.theta);

    const baseCamPos = new THREE.Vector3(x, y, z);
    const baseTarget = new THREE.Vector3(0, 0, 0);

    // Dynamic lateral framing shift:
    // Compute camera forward, right, and up directions
    const forward = new THREE.Vector3().subVectors(baseTarget, baseCamPos).normalize();
    const worldUp = new THREE.Vector3(0, 1, 0);
    let right = new THREE.Vector3().crossVectors(forward, worldUp).normalize();
    if (right.lengthSq() < 0.0001) {
      right = new THREE.Vector3(1, 0, 0);
    }
    const camUp = new THREE.Vector3().crossVectors(right, forward).normalize();

    // Determine target lateral offset based on active graph mode
    const targetOffset = this.isGraphActive ? this.targetLateralOffset : 0.0;
    this.currentLateralOffset = THREE.MathUtils.lerp(
      this.currentLateralOffset,
      targetOffset,
      Math.min(1.0, dt * 5.5)
    );

    // Shifting along the camera's local right vector moves the rendered 3D scene to the left on the user's screen
    const lateralShift = right.clone().multiplyScalar(this.currentLateralOffset);

    this.camera.position.copy(baseCamPos).add(lateralShift);
    this.currentTarget.copy(baseTarget).add(lateralShift);
    this.camera.up.copy(camUp);
    this.camera.lookAt(this.currentTarget);
  }

  destroy() {
    if (this.cleanup) this.cleanup();
  }
}
