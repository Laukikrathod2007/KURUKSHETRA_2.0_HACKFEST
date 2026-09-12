/**
 * Custom GLSL Shaders for the 3D Particle Universe Globe
 * Features GPU Simplex 3D noise, traveling shockwave pulses, organic breathing,
 * multi-shell differential rotation, depth-aware sizing, and circular radiant glow.
 */

export const particleVertexShader = /* glsl */ `
precision highp float;

attribute vec3 a_target;
attribute float a_size;
attribute float a_layer;
attribute float a_type;
attribute float a_phase;
attribute float a_speed;
attribute vec3 a_customColor;
attribute float a_hasCustomColor;

uniform float u_time;
uniform float u_pointSize;
uniform float u_pulseProgress;
uniform float u_pulseIntensity;
uniform float u_expand;
uniform float u_compress;
uniform float u_waveStrength;
uniform float u_burst;
uniform float u_noiseStrength;
uniform float u_ambientDrift;

varying float v_layer;
varying float v_type;
varying float v_depth;
varying float v_pulseGlow;
varying float v_brightness;
varying float v_eyeDist;
varying vec3 v_customColor;
varying float v_hasCustomColor;

// --- Simplex 3D Noise for GPU-accelerated volumetric organic motion ---
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec3 pos = position;
  float origDist = length(pos);
  vec3 dir = normalize(pos);

  // 1. Organic Breathing & Differential Layer Motion
  float t = u_time * (0.65 * a_speed + 0.35);
  float breathing = 1.0 + sin(t + a_phase) * 0.028;
  pos *= breathing;

  // 2. Continuous 3D GPU Simplex Noise Field
  vec3 noiseCoord = pos * 0.85 + vec3(0.0, 0.0, u_time * 0.12);
  vec3 noiseDisplacement = vec3(
    snoise(noiseCoord),
    snoise(noiseCoord + vec3(31.41, 15.92, 65.35)),
    snoise(noiseCoord + vec3(89.79, 32.38, 46.26))
  );
  pos += noiseDisplacement * (0.045 * u_noiseStrength * (0.5 + 0.5 * a_layer));

  // 3. Radial Expansion State (Elastic spring dispersion)
  if (u_expand > 0.001) {
    float expandFactor = u_expand * (1.2 + 0.8 * a_layer);
    pos += dir * expandFactor * (1.0 + snoise(pos * 0.5 + vec3(u_time * 0.5)) * 0.4);
  }

  // 4. Singularity Compression State
  if (u_compress > 0.001) {
    float compressFactor = smoothstep(0.0, 1.0, u_compress);
    pos = mix(pos, dir * 0.22 * (0.3 + 0.7 * a_layer), compressFactor * 0.85);
  }

  // 5. Traveling 3D Wave Distortion
  if (u_waveStrength > 0.001) {
    float wave = sin(origDist * 4.5 - u_time * 3.2 + pos.y * 2.0) * u_waveStrength * 0.18;
    pos += dir * wave;
  }

  // 6. Particle Burst & Reformation
  if (u_burst > 0.001) {
    vec3 burstDest = a_target * (1.6 + 0.8 * a_layer);
    pos = mix(pos, burstDest, u_burst);
  }

  // 7. Spherical Shockwave / Energy Pulse
  float pulseGlow = 0.0;
  if (u_pulseProgress > 0.001 && u_pulseProgress < 1.0) {
    float pulseRadius = u_pulseProgress * 2.5;
    float distFromWave = abs(origDist - pulseRadius);
    float pulseBand = smoothstep(0.35, 0.0, distFromWave);
    
    // Physical displacement outward during pulse passage
    pos += dir * (pulseBand * 0.12 * u_pulseIntensity);
    pulseGlow = pulseBand * u_pulseIntensity;
  }

  // Transform to View Space
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  float eyeDist = -mvPosition.z;

  // Depth-aware Perspective Point Sizing
  float sizeFactor = u_pointSize * a_size;
  if (a_type > 0.8) {
    sizeFactor *= 1.85; // Anchor nodes stand out consistently
  }
  if (pulseGlow > 0.01) {
    sizeFactor *= (1.0 + pulseGlow * 0.7);
  }

  gl_PointSize = sizeFactor * (1.0 / max(0.22, eyeDist * 0.32));

  // Balanced clamp for consistent big dots matching reference
  gl_PointSize = clamp(gl_PointSize, 1.2, 42.0);

  gl_Position = projectionMatrix * mvPosition;

  // Varyings for fragment shader
  v_layer = a_layer;
  v_type = a_type;
  v_depth = smoothstep(-2.2, 2.2, pos.z);
  v_pulseGlow = pulseGlow;
  v_eyeDist = eyeDist;
  v_customColor = a_customColor;
  v_hasCustomColor = a_hasCustomColor;

  // Base brightness hierarchy
  float baseBright = 0.8 + 0.25 * sin(u_time * 1.5 + a_phase * 6.28);
  if (a_type > 0.8) {
    baseBright = 1.8; // Radiant anchor nodes
  } else if (a_layer > 0.88) {
    baseBright *= 0.65; // Outer dust
  }
  v_brightness = baseBright;
}
`;

export const particleFragmentShader = /* glsl */ `
precision highp float;

uniform vec3 u_colorCore;
uniform vec3 u_colorAccent;
uniform vec3 u_colorOuter;
uniform vec3 u_colorHighlight;
uniform float u_morphProgress;

varying float v_layer;
varying float v_type;
varying float v_depth;
varying float v_pulseGlow;
varying float v_brightness;
varying float v_eyeDist;
varying vec3 v_customColor;
varying float v_hasCustomColor;

void main() {
  // When morphing to entity graph, cleanly fade background globe particles to ZERO!
  float networkFade = 1.0 - smoothstep(0.01, 0.45, u_morphProgress);
  if (networkFade < 0.005) {
    discard;
  }

  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);

  if (dist > 0.5) {
    discard;
  }

  // Multi-tier Gaussian glow profile: sharp central point + soft luminous envelope
  float coreIntensity = smoothstep(0.24, 0.0, dist);
  float haloIntensity = smoothstep(0.5, 0.0, dist);
  float shape = coreIntensity * 0.65 + haloIntensity * 0.35;

  // Color gradient hierarchy:
  vec3 color = mix(u_colorCore, u_colorAccent, smoothstep(0.18, 0.68, v_layer));
  color = mix(color, u_colorOuter, smoothstep(0.68, 1.0, v_layer));

  // Luminous anchor nodes and scattered seeded entities in the jungle:
  if (v_hasCustomColor > 0.5) {
    color = mix(color, v_customColor, 0.85);
    color += v_customColor * coreIntensity * 0.55;
    shape = coreIntensity * 0.7 + haloIntensity * 0.4;
  } else if (v_type > 0.8) {
    color = mix(color, u_colorHighlight, 0.88);
    color += vec3(0.6, 0.7, 0.9) * coreIntensity * 0.65;
    shape = coreIntensity * 0.7 + haloIntensity * 0.4;
  }

  // Traveling pulse wave illumination
  if (v_pulseGlow > 0.01) {
    vec3 pulseColor = vec3(0.92, 0.96, 1.0);
    color = mix(color, pulseColor, v_pulseGlow * 0.85);
    shape += v_pulseGlow * 0.4;
  }

  // Depth-based subtle atmospheric falloff
  float depthDim = smoothstep(9.5, 2.8, v_eyeDist);
  color *= (v_brightness * (0.7 + 0.3 * v_depth));

  // Balanced alpha hierarchy: solid prominent big dots + airy background dust
  float alphaScale = (v_type > 0.8 || v_hasCustomColor > 0.5) ? 0.98 : (v_layer > 0.85 ? 0.40 : 0.58);
  float alpha = shape * clamp(depthDim, 0.3, 1.0) * alphaScale * networkFade;

  gl_FragColor = vec4(color * alpha, alpha);
}
`;

export const filamentVertexShader = /* glsl */ `
precision highp float;

attribute float a_alpha;
attribute float a_activity;

uniform float u_time;
uniform float u_pulseProgress;
uniform float u_pulseIntensity;

varying float v_alpha;
varying float v_activity;
varying float v_pulse;

void main() {
  vec3 pos = position;
  float origDist = length(pos);

  // Pulse interaction with filaments
  float pulseBand = 0.0;
  if (u_pulseProgress > 0.001 && u_pulseProgress < 1.0) {
    float pulseRadius = u_pulseProgress * 2.5;
    float distFromWave = abs(origDist - pulseRadius);
    pulseBand = smoothstep(0.3, 0.0, distFromWave) * u_pulseIntensity;
  }

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  v_alpha = a_alpha;
  v_activity = a_activity;
  v_pulse = pulseBand;
}
`;

export const filamentFragmentShader = /* glsl */ `
precision highp float;

uniform vec3 u_lineColor;
uniform vec3 u_pulseColor;
uniform float u_time;
uniform float u_morphProgress;

varying float v_alpha;
varying float v_activity;
varying float v_pulse;

void main() {
  float networkFade = 1.0 - smoothstep(0.01, 0.35, u_morphProgress);
  if (networkFade < 0.005) {
    discard;
  }

  // Subtle energetic flicker traveling along filaments
  float flicker = 0.85 + 0.15 * sin(u_time * 4.0 + v_activity * 6.28);
  vec3 color = u_lineColor;

  if (v_pulse > 0.01) {
    color = mix(color, u_pulseColor, v_pulse * 0.9);
  }

  float alpha = v_alpha * flicker * (0.35 + v_pulse * 0.65) * networkFade;
  gl_FragColor = vec4(color, alpha);
}
`;
