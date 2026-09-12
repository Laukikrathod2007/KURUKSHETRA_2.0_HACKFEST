/**
 * MorphingShield.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Scroll-driven 3D morphing geometry — Three.js + GSAP ScrollTrigger
 *
 * How it works (same pattern as Tempo.xyz):
 *  1. THREE.BufferGeometry with a fixed vertex budget (VERT_COUNT vertices)
 *  2. Three "target" shapes pre-baked as Float32Arrays of identical length
 *  3. GSAP ScrollTrigger drives a `progress` uniform/value 0 → 1
 *  4. requestAnimationFrame LERP blends position arrays each frame
 *  5. Custom GLSL: additive-blended glowing particles + per-point jitter
 *  6. Mouse parallax adds organic life
 *
 * Morph stages:
 *   0.0 – 0.5   Sphere  → Icosahedron
 *   0.5 – 1.0   Icosahedron → TorusKnot
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Constants ─────────────────────────────────────────────────── */
const VERT_COUNT = 4000   // total particle count — uniform across all shapes
const RADIUS     = 1.6    // normalised radius

/* ── Helpers ───────────────────────────────────────────────────── */

/**
 * Flatten a BufferGeometry's position attribute into a plain Float32Array,
 * resampled to exactly `count` vertices (wraps around if source is smaller).
 */
function bakePositions(geo, count) {
  geo.computeVertexNormals()
  const src  = geo.attributes.position.array
  const srcN = src.length / 3
  const out  = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const j = (i % srcN) * 3
    out[i * 3]     = src[j]
    out[i * 3 + 1] = src[j + 1]
    out[i * 3 + 2] = src[j + 2]
  }
  return out
}

/** Smooth cubic ease – same curve GSAP uses for 'power2.inOut' */
function smoothstep(t) {
  t = Math.max(0, Math.min(1, t))
  return t * t * (3 - 2 * t)
}

/* ── Component ─────────────────────────────────────────────────── */
export default function MorphingShield({ scrollContainerId = 'hero-scroll-container' }) {
  const canvasRef   = useRef(null)
  const rafRef      = useRef(null)
  const stateRef    = useRef(null)
  const progressRef = useRef(0)   // driven by GSAP ScrollTrigger, 0 → 1

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /* ── Renderer ──────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0x000000, 0)

    /* ── Scene / Camera ─────────────────────────────────────────── */
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45, canvas.clientWidth / canvas.clientHeight, 0.1, 100
    )
    camera.position.set(0, 0, 5.5)

    /* ── Target shape positions ─────────────────────────────────── */
    const gA = new THREE.SphereGeometry(RADIUS, 80, 80)
    const gB = new THREE.IcosahedronGeometry(RADIUS * 1.05, 7)
    const gC = new THREE.TorusKnotGeometry(RADIUS * 0.65, 0.32, 256, 32, 2, 3)

    const posA = bakePositions(gA, VERT_COUNT)
    const posB = bakePositions(gB, VERT_COUNT)
    const posC = bakePositions(gC, VERT_COUNT)

    // Scratch buffer for LERP output each frame
    const liveBuf = new Float32Array(VERT_COUNT * 3)
    liveBuf.set(posA)

    // Dispose source geometries — we only need the arrays
    ;[gA, gB, gC].forEach(g => g.dispose())

    /* ── Point cloud geometry ───────────────────────────────────── */
    const geo = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(liveBuf, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', posAttr)

    /* ── Shader material ────────────────────────────────────────── */
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:    { value: 0 },
        uColor0:  { value: new THREE.Color('#0ea5e9') },  // sky
        uColor1:  { value: new THREE.Color('#8b5cf6') },  // violet
        uColor2:  { value: new THREE.Color('#06b6d4') },  // cyan
        uMorph:   { value: 0 },                           // 0–2 mirrors progressRef×2
      },
      vertexShader: /* glsl */`
        uniform float uTime;

        varying float vDepth;
        varying float vRadius;

        void main() {
          vec3 p = position;

          // Per-vertex breathing jitter
          float jitter = 0.025 * sin(p.x * 4.2 + uTime * 1.1)
                       + 0.018 * cos(p.y * 3.7 + uTime * 0.8)
                       + 0.012 * sin(p.z * 5.1 + uTime * 1.4);
          p += normalize(p + 0.001) * jitter;

          vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvPos;

          vDepth  = -mvPos.z;
          vRadius = length(p);

          // Perspective-correct point size
          float sz = mix(2.5, 5.5, 1.0 - clamp(vDepth / 8.0, 0.0, 1.0));
          sz += 1.2 * sin(uTime * 1.8 + vRadius * 2.0);
          gl_PointSize = clamp(sz, 1.2, 7.0);
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3  uColor0;
        uniform vec3  uColor1;
        uniform vec3  uColor2;
        uniform float uMorph;

        varying float vDepth;
        varying float vRadius;

        void main() {
          // Circular soft disc
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.25, 0.5, d);

          // Tri-lerp colour through morph stages
          vec3 col;
          if (uMorph < 1.0) {
            col = mix(uColor0, uColor1, uMorph);
          } else {
            col = mix(uColor1, uColor2, uMorph - 1.0);
          }

          // Depth fade — particles further away are dimmer
          float depthFade = 1.0 - clamp((vDepth - 3.0) / 5.0, 0.0, 0.55);

          gl_FragColor = vec4(col, alpha * depthFade * 0.88);
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    /* ── Glow sprite behind the shape ───────────────────────────── */
    const glowCanvas = document.createElement('canvas')
    glowCanvas.width = glowCanvas.height = 512
    const gctx = glowCanvas.getContext('2d')
    const grad = gctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    grad.addColorStop(0,    'rgba(14,165,233,0.45)')
    grad.addColorStop(0.35, 'rgba(139,92,246,0.18)')
    grad.addColorStop(1,    'rgba(0,0,0,0)')
    gctx.fillStyle = grad
    gctx.fillRect(0, 0, 512, 512)

    const glowTex  = new THREE.CanvasTexture(glowCanvas)
    const glowMat  = new THREE.SpriteMaterial({
      map: glowTex, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const glow = new THREE.Sprite(glowMat)
    glow.scale.setScalar(7.5)
    scene.add(glow)

    /* ── Mouse parallax state ───────────────────────────────────── */
    const mouse    = { x: 0, y: 0 }
    const targetRot = { x: 0, y: 0 }

    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    /* ── GSAP ScrollTrigger ─────────────────────────────────────── */
    // We read `hero-scroll-container` — a tall wrapper div on the Hero page.
    // When the user scrolls through it, progress goes 0 → 1.
    const scrollTrigger = ScrollTrigger.create({
      trigger: `#${scrollContainerId}`,
      start:   'top top',
      end:     'bottom bottom',
      scrub:   1.2,    // smooth lag identical to Tempo
      onUpdate: (self) => {
        progressRef.current = self.progress   // 0 → 1
      },
    })

    /* ── Resize ─────────────────────────────────────────────────── */
    const onResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    /* ── Animation loop ─────────────────────────────────────────── */
    const clock = new THREE.Clock()

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)
      const elapsed = clock.getElapsedTime()
      mat.uniforms.uTime.value = elapsed

      /* Morph LERP */
      const p = progressRef.current        // 0 → 1
      const morphVal = p * 2               // 0 → 2  (two transitions)

      let from, to, t
      if (morphVal <= 1) {
        from = posA; to = posB; t = smoothstep(morphVal)
      } else {
        from = posB; to = posC; t = smoothstep(morphVal - 1)
      }

      for (let i = 0; i < liveBuf.length; i++) {
        liveBuf[i] = from[i] + (to[i] - from[i]) * t
      }
      posAttr.needsUpdate = true
      mat.uniforms.uMorph.value = morphVal

      /* Rotation: constant spin + mouse parallax */
      targetRot.x += (mouse.y * 0.25 - targetRot.x) * 0.04
      targetRot.y += (mouse.x * 0.35 - targetRot.y) * 0.04

      points.rotation.x = targetRot.x + elapsed * 0.04
      points.rotation.y = targetRot.y + elapsed * 0.15

      renderer.render(scene, camera)
    }
    tick()

    /* ── Store refs for cleanup ─────────────────────────────────── */
    stateRef.current = { renderer, geo, mat, glowTex, glowMat, scrollTrigger }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      scrollTrigger.kill()
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      glowTex.dispose()
      glowMat.dispose()
    }
  }, [scrollContainerId])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
