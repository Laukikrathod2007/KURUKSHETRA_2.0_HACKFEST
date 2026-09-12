import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {
  particleVertexShader,
  particleFragmentShader,
  filamentVertexShader,
  filamentFragmentShader,
} from '../shaders/ParticleShaders.js';
import {
  createParticleUniverseGeometry,
  createFilamentGeometry,
} from './ParticleFieldGenerator.js';
import { AnimationController } from './AnimationController.js';
import { CinematicCamera } from './CinematicCamera.js';
import { StarFlareSystem } from './StarFlareSystem.js';
import { EntityNetworkSystem } from './EntityNetworkSystem.js';

/**
 * Master Scene Controller for the 3D Particle Universe Globe & Entity Network.
 * Coordinates WebGL rendering, custom GPU shaders, post-processing bloom,
 * star diffraction spikes, Bezier entity graphs,
 * and cinematic camera choreography.
 */
export class ParticleUniverseScene {
  constructor(canvasContainer, onTelemetry, onLabelsUpdate, onEntityHover, onEntitySelect, onGraphSettled) {
    this.container = canvasContainer;
    this.onTelemetry = onTelemetry || (() => {});
    this.onLabelsUpdate = onLabelsUpdate || (() => {});
    this.onEntityHover = onEntityHover || (() => {});
    this.onEntitySelect = onEntitySelect || (() => {});
    this.onGraphSettled = onGraphSettled || (() => {});

    this.initScene();
    this.initPostProcessing();
    this.initObjects();
    this.initControllers();
    this.initEvents();

    this.startTime = performance.now();
    this.lastTime = performance.now();
    this.fpsCounter = { frames: 0, lastTime: performance.now(), fps: 60 };
    this.isRunning = true;

    this.animate = this.animate.bind(this);
    this.animate();
  }

  initScene() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene & Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#020206');

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 5.4);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: false,
      alpha: false,
      stencil: false,
      depth: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);
  }

  initPostProcessing() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Sophisticated UnrealBloomPass: luminous radiance without blowing out structure
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.92, // Strength: radiant celestial glow
      0.52, // Radius: tight, focused bloom
      0.44  // Threshold: keeps faint particles sharp, selectively blooms flares and hubs
    );
    this.composer.addPass(this.bloomPass);
  }

  initObjects() {
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    // 1. Generate Multi-Layer Volumetric Particles (~25,400 points) with 100+ Seeded Entities
    const { geometry, totalCount, anchorPositions, entityNodes } = createParticleUniverseGeometry({
      coreCount: 6000,
      shellCount: 11000,
      secondaryShellCount: 5200,
      haloCount: 3200,
      radius: 1.35,
    });
    this.totalParticleCount = totalCount;
    this.entityNodes = entityNodes || [];

    // 2. Particle Shader Material
    this.particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        u_time: { value: 0 },
        u_pointSize: { value: 8.4 },
        u_pulseProgress: { value: 0 },
        u_pulseIntensity: { value: 1.0 },
        u_expand: { value: 0 },
        u_compress: { value: 0 },
        u_waveStrength: { value: 0 },
        u_burst: { value: 0 },
        u_noiseStrength: { value: 1.0 },
        u_ambientDrift: { value: 0.12 },
        u_morphProgress: { value: 0.0 },
        u_colorCore: { value: new THREE.Color('#ffffff') },       // White-hot core
        u_colorAccent: { value: new THREE.Color('#fed7aa') },     // Warm peach/gold starlight
        u_colorOuter: { value: new THREE.Color('#fb7185') },      // Radiant outer perimeter
        u_colorHighlight: { value: new THREE.Color('#ffffff') },  // Diamond white big dots
      },
    });

    this.particleMesh = new THREE.Points(geometry, this.particleMaterial);
    this.rootGroup.add(this.particleMesh);

    // 3. Generate Neural Network Filaments matching reference image
    const { geometry: filamentGeo, filamentCount } = createFilamentGeometry(anchorPositions, {
      maxDistance: 0.46,
      maxConnectionsPerNode: 4,
    });
    this.totalFilamentCount = filamentCount;

    this.filamentMaterial = new THREE.ShaderMaterial({
      vertexShader: filamentVertexShader,
      fragmentShader: filamentFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        u_time: { value: 0 },
        u_pulseProgress: { value: 0 },
        u_pulseIntensity: { value: 1.0 },
        u_morphProgress: { value: 0.0 },
        u_lineColor: { value: new THREE.Color('#0d9488') },      // Deep emerald-teal neural web
        u_pulseColor: { value: new THREE.Color('#5eead4') },     // Luminous cyan-teal pulse
      },
    });

    this.filamentMesh = new THREE.LineSegments(filamentGeo, this.filamentMaterial);
    this.rootGroup.add(this.filamentMesh);

    // 4. Star Diffraction Flares (Optical cross spikes on key anchor hubs, matching Image 1)
    this.starFlares = new StarFlareSystem(anchorPositions);
    this.rootGroup.add(this.starFlares.group);

    // 5. Entity Network System (Central target hub + volumetric 3D counterparty nodes)
    this.entityNetwork = new EntityNetworkSystem(this.scene);
  }

  initControllers() {
    this.animator = new AnimationController(
      this.particleMaterial,
      this.filamentMaterial,
      this.rootGroup
    );

    this.cinematicCamera = new CinematicCamera(this.camera, this.renderer.domElement);
  }

  initEvents() {
    this.handleResize = () => {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.composer.setSize(width, height);
    };

    window.addEventListener('resize', this.handleResize);

    // Screen-space pointer detection on scattered entity nodes in the particle jungle
    let downPos = { x: 0, y: 0, time: 0 };
    this.hoveredEntity = null;

    const findHoveredEntity = (clientX, clientY) => {
      if (!this.entityNodes || this.entityNodes.length === 0) return null;
      if (this.entityNetwork.morphProgress > 0.05) return null;

      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;

      const v = new THREE.Vector3();
      const worldMatrix = this.rootGroup.matrixWorld;
      const camPos = this.camera.position;

      for (let i = 0; i < this.entityNodes.length; i++) {
        const item = this.entityNodes[i];
        v.copy(item.position).applyMatrix4(worldMatrix);

        // Check if facing camera (front hemisphere only)
        const toCam = camPos.clone().sub(v).normalize();
        const normal = v.clone().normalize();
        if (toCam.dot(normal) < 0.18) continue;

        // Project 3D coordinate to 2D screen pixels
        v.project(this.camera);
        const sx = ((v.x + 1) / 2) * width;
        const sy = ((-v.y + 1) / 2) * height;

        const dist = Math.hypot(clientX - sx, clientY - sy);
        if (dist < 18) {
          return { entity: item.entity, screenX: sx, screenY: sy };
        }
      }
      return null;
    };

    this.handlePointerDown = (e) => {
      downPos = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    this.handlePointerMove = (e) => {
      if (this.entityNetwork.morphProgress > 0.05) {
        if (this.hoveredEntity) {
          this.hoveredEntity = null;
          this.renderer.domElement.style.cursor = '';
          this.onEntityHover(null);
        }
        return;
      }

      const hit = findHoveredEntity(e.clientX, e.clientY);
      if (hit) {
        this.hoveredEntity = hit.entity;
        this.renderer.domElement.style.cursor = 'pointer';
        this.onEntityHover({
          entity: hit.entity,
          screenX: hit.screenX,
          screenY: hit.screenY,
          clientX: e.clientX,
          clientY: e.clientY,
        });
      } else if (this.hoveredEntity) {
        this.hoveredEntity = null;
        this.renderer.domElement.style.cursor = '';
        this.onEntityHover(null);
      }
    };

    this.handlePointerUp = (e) => {
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      const duration = Date.now() - downPos.time;

      if (dist < 8 && duration < 500 && this.hoveredEntity) {
        const targetName = this.hoveredEntity.name;
        this.hoveredEntity = null;
        this.renderer.domElement.style.cursor = '';
        this.onEntityHover(null);
        this.onEntitySelect(targetName);
        this.searchEntity(targetName);
      }
    };

    const canvasEl = this.renderer.domElement;
    canvasEl.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
  }

  // --- External Search & Morph Workflow ---

  searchEntity(name = 'Rahul Sharma') {
    // 1. Set entity dataset
    this.entityNetwork.setEntity(name);
    const entity = this.entityNetwork.currentEntity;

    // If already in 3D graph mode, smooth transition without full camera replay -
    // UI can update immediately since there's no big camera dive happening.
    if (this.entityNetwork.morphProgress > 0.5) {
      this.onGraphSettled();
      return;
    }

    const targetPos = entity?.globePosition || null;

    // 2. Seamless cinematic hyperspace glide directly into 3D network view
    this.cinematicCamera.startGlideToGraph(
      () => {
        // Start 3D node constellation unfurling simultaneously on frame 1 -
        // no separate pulse/glow effect, the camera flyby itself carries the motion.
        this.entityNetwork.morphToGraph();
      },
      () => {
        // Glide finished - camera is now in interactive 3D orbit mode.
        // Only now does the dossier UI appear, so it doesn't compete with the dive.
        this.onGraphSettled();
      },
      targetPos
    );
  }

  setLensMode(mode) {
    if (this.entityNetwork) {
      this.entityNetwork.setLensMode(mode);
    }
  }

  setDegreeLevel(degree) {
    if (this.entityNetwork) {
      this.entityNetwork.setDegreeLevel(degree);
    }
    if (this.cinematicCamera) {
      this.cinematicCamera.setDegreeLevel(degree);
    }
  }

  setSelectedEdge(edgeId) {
    if (this.entityNetwork) {
      this.entityNetwork.setSelectedEdge(edgeId);
    }
  }

  setSelectedEvidence(evidenceType) {
    if (this.entityNetwork) {
      this.entityNetwork.setSelectedEvidence(evidenceType);
    }
  }

  spotlightEntities(entityIds) {
    if (this.entityNetwork) {
      this.entityNetwork.spotlightEntities(entityIds);
    }
  }

  resetToGlobe() {
    this.entityNetwork.morphToGlobe();
    this.animator.reset();
    this.cinematicCamera.resetToGlobe();
  }

  setSidebarState(isOpen, isExpanded = false) {
    if (this.cinematicCamera) {
      this.cinematicCamera.setSidebarOffset(isOpen, isExpanded);
    }
  }

  // --- External API for Animation States ---

  pulse() {
    this.animator.triggerPulse();
  }

  expand() {
    this.animator.triggerExpand();
  }

  compress() {
    this.animator.triggerCompress();
  }

  wave() {
    this.animator.triggerWave();
  }

  burst() {
    this.animator.triggerBurst();
  }

  reform() {
    this.animator.triggerReform();
  }

  boostRotation() {
    this.animator.triggerRotationBoost();
  }

  reset() {
    this.resetToGlobe();
  }

  setCameraMode(mode) {
    this.cinematicCamera.setMode(mode);
  }

  // --- Animation Loop ---

  animate() {
    if (!this.isRunning) return;

    requestAnimationFrame(this.animate);

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) * 0.001, 0.1);
    const elapsed = (now - this.startTime) * 0.001;
    this.lastTime = now;

    // 1. Update Animation & Physics
    this.animator.update(dt, elapsed);

    // 2. Update Camera Choreography
    this.cinematicCamera.update(dt, elapsed);

    // 3. Update Subsystems
    const morphT = this.entityNetwork.morphProgress;

    // Smoothly update shader uniforms for complete backdrop fade
    if (this.particleMaterial) {
      this.particleMaterial.uniforms.u_morphProgress.value = morphT;
    }
    if (this.filamentMaterial) {
      this.filamentMaterial.uniforms.u_morphProgress.value = morphT;
    }

    // Dynamic bloom tuning: in globe mode 0.85, in graph mode 0.26 (crisp, zero whiteout)
    if (this.bloomPass) {
      this.bloomPass.strength = THREE.MathUtils.lerp(0.85, 0.26, morphT);
    }

    this.starFlares.update(elapsed, morphT);
    this.entityNetwork.update(dt, elapsed, this.camera, this.renderer);

    // 4. Update 2D Screen Projected Node Labels
    if (this.onLabelsUpdate && morphT > 0.05) {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      const labels = this.entityNetwork.getNodeScreenPositions(this.camera, width, height);
      this.onLabelsUpdate(labels);
    } else if (this.onLabelsUpdate) {
      this.onLabelsUpdate([]);
    }

    // 5. Post-Processed Render
    this.composer.render();

    // 6. Telemetry (FPS calculation)
    this.fpsCounter.frames++;
    if (now - this.fpsCounter.lastTime >= 500) {
      this.fpsCounter.fps = Math.round((this.fpsCounter.frames * 1000) / (now - this.fpsCounter.lastTime));
      this.fpsCounter.frames = 0;
      this.fpsCounter.lastTime = now;

      this.onTelemetry({
        fps: this.fpsCounter.fps,
        particles: this.totalParticleCount,
        filaments: this.totalFilamentCount,
        state: morphT > 0.5 ? 'ENTITY_GRAPH_ACTIVE' : this.animator.activeState,
        cameraMode: this.cinematicCamera.mode,
        isGraphMode: morphT > 0.5,
      });
    }
  }

  destroy() {
    this.isRunning = false;
    window.removeEventListener('resize', this.handleResize);
    this.cinematicCamera.destroy();

    if (this.particleMesh) {
      this.particleMesh.geometry.dispose();
      this.particleMaterial.dispose();
    }
    if (this.filamentMesh) {
      this.filamentMesh.geometry.dispose();
      this.filamentMaterial.dispose();
    }
    if (this.starFlares) {
      this.starFlares.destroy();
    }
    if (this.entityNetwork) {
      this.entityNetwork.destroy();
    }
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
    }
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('pointerdown', this.handlePointerDown);
      window.removeEventListener('pointermove', this.handlePointerMove);
      window.removeEventListener('pointerup', this.handlePointerUp);
    }
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
