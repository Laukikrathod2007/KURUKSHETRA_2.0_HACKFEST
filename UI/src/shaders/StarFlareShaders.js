/**
 * Star Flare & Lens Diffraction Shaders
 * Creates radiant 4-point/6-point diffraction spikes on anchor nodes,
 * matching astronomical imagery and the reference concept visual.
 */

export const starFlareVertexShader = /* glsl */ `
precision highp float;

attribute float a_size;
attribute float a_rot;
attribute vec3 a_color;

uniform float u_time;
uniform float u_pointSize;
uniform float u_morphProgress; // 0 = globe, 1 = graph

varying vec3 v_color;
varying float v_rot;
varying float v_twinkle;
varying float v_eyeDist;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float eyeDist = -mvPosition.z;

  float twinkle = 0.82 + 0.18 * sin(u_time * 3.5 + a_rot * 6.28);
  float size = u_pointSize * a_size * twinkle;

  // In graph mode, flares scale smoothly
  if (u_morphProgress > 0.01) {
    size *= (1.0 + u_morphProgress * 0.4);
  }

  gl_PointSize = size * (1.0 / max(0.25, eyeDist * 0.32));
  gl_PointSize = clamp(gl_PointSize, 2.0, 36.0);

  gl_Position = projectionMatrix * mvPosition;

  v_color = a_color;
  v_rot = a_rot;
  v_twinkle = twinkle;
  v_eyeDist = eyeDist;
}
`;

export const starFlareFragmentShader = /* glsl */ `
precision highp float;

uniform float u_time;
uniform float u_morphProgress;

varying vec3 v_color;
varying float v_rot;
varying float v_twinkle;
varying float v_eyeDist;

vec2 rotateUV(vec2 uv, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
}

void main() {
  // In graph mode, completely eliminate star flares so only active nodes exist
  float flareFade = 1.0 - smoothstep(0.01, 0.22, u_morphProgress);
  if (flareFade < 0.005) {
    discard;
  }

  vec2 uv = gl_PointCoord - vec2(0.5);
  uv = rotateUV(uv, v_rot);

  float dist = length(uv);
  if (dist > 0.5) discard;

  // Soft central starlight core
  float core = exp(-dist * 18.0);

  // Soft, delicate cross diffraction spikes
  float spikeH = exp(-abs(uv.y) * 64.0) * exp(-abs(uv.x) * 6.5);
  float spikeV = exp(-abs(uv.x) * 64.0) * exp(-abs(uv.y) * 6.5);

  float flare = core * 1.1 + (spikeH + spikeV) * 0.55;

  // Atmospheric falloff
  float depthFade = smoothstep(12.0, 2.5, v_eyeDist);

  vec3 finalColor = v_color * flare * v_twinkle;
  float alpha = clamp(flare * depthFade * 0.7, 0.0, 0.85) * flareFade;

  gl_FragColor = vec4(finalColor, alpha);
}
`;
