"use client";

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useVisibility, useAfterSettled, usePrefersReducedMotion } from '../hooks/useVisible';

import './MagicRings.css';

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255
  ];
}

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform float uMouseInfluence, uHoverAmount, uHoverScale, uParallax, uBurst;
uniform vec2 uResolution, uMouse;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fade(float t) {
  return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;
  p -= uMouse * uMouseInfluence;
  float sc = mix(1.0, uHoverScale, uHoverAmount) + uBurst * 0.3;
  p /= sc;
  vec3 c = vec3(0.0);
  float rcf = max(float(uRingCount) - 1.0, 1.0);
  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec2 pr = p - fi * uParallax * uMouse;
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    c = mix(c, rc, vec3(ring(pr, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), i == 0 ? 0.0 : 2.95 * fi, px)));
  }
  c *= 1.0 + uBurst * 2.0;
  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) * uNoiseAmount;
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)) * uOpacity);
}
`;

export interface MagicRingsProps {
  color?: string;
  colorTwo?: string;
  speed?: number;
  ringCount?: number;
  attenuation?: number;
  lineThickness?: number;
  baseRadius?: number;
  radiusStep?: number;
  scaleRate?: number;
  opacity?: number;
  blur?: number;
  noiseAmount?: number;
  rotation?: number;
  ringGap?: number;
  fadeIn?: number;
  fadeOut?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  hoverScale?: number;
  parallax?: number;
  clickBurst?: boolean;
}

export default function MagicRings({
  color = '#fc42ff',
  colorTwo = '#42fcff',
  speed = 1,
  ringCount = 6,
  attenuation = 10,
  lineThickness = 2,
  baseRadius = 0.35,
  radiusStep = 0.1,
  scaleRate = 0.1,
  opacity = 1,
  blur = 0,
  noiseAmount = 0.1,
  rotation = 0,
  ringGap = 1.5,
  fadeIn = 0.7,
  fadeOut = 0.5,
  followMouse = false,
  mouseInfluence = 0.2,
  hoverScale = 1.2,
  parallax = 0.05,
  clickBurst = false,
}: MagicRingsProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);
  const startLoopRef = useRef<(() => void) | null>(null);
  const { visible, hasBeenVisible } = useVisibility(mountRef);
  // Wait past first paint/hydration, then attach. Short enough to feel instant;
  // long enough that FCP/LCP aren't blocked by shader compile.
  const settled = useAfterSettled(500, 1200);
  const reducedMotion = usePrefersReducedMotion();
  const active = visible && !reducedMotion;

  // Shader compilation is synchronous and dominates Total Blocking Time under
  // CPU throttle. Keep the hero looking finished first; attach WebGL after.
  const shouldInit = hasBeenVisible && settled && !reducedMotion;

  // Values read inside the frame loop; kept in refs so the GL context is
  // never rebuilt when a prop (e.g. theme colour) changes.
  const activeRef = useRef(active);
  const speedRef = useRef(speed);
  const followMouseRef = useRef(followMouse);
  const mouseInfluenceRef = useRef(mouseInfluence);
  const clickBurstRef = useRef(clickBurst);

  useEffect(() => {
    if (!shouldInit) return;
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: Renderer;
    try {
      // Cap DPR — 2× retina fills 4× the pixels for a soft ambient overlay.
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        dpr: Math.min(window.devicePixelRatio || 1, 1.25),
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uAttenuation: { value: 0 },
        uResolution: { value: new Float32Array([0, 0]) },
        uColor: { value: new Float32Array([0, 0, 0]) },
        uColorTwo: { value: new Float32Array([0, 0, 0]) },
        uLineThickness: { value: 0 },
        uBaseRadius: { value: 0 },
        uRadiusStep: { value: 0 },
        uScaleRate: { value: 0 },
        uRingCount: { value: 0 },
        uOpacity: { value: 1 },
        uNoiseAmount: { value: 0 },
        uRotation: { value: 0 },
        uRingGap: { value: 1.6 },
        uFadeIn: { value: 0.5 },
        uFadeOut: { value: 0.75 },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInfluence: { value: 0 },
        uHoverAmount: { value: 0 },
        uHoverScale: { value: 1 },
        uParallax: { value: 0 },
        uBurst: { value: 0 },
      }
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    mount.appendChild(gl.canvas);

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      renderer.setSize(w, h);
      const res = program.uniforms.uResolution.value as Float32Array;
      res[0] = gl.canvas.width;
      res[1] = gl.canvas.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const mouse: [number, number] = [0, 0];
    const smoothMouse: [number, number] = [0, 0];
    let hoverAmount = 0;
    let isHovered = false;
    let burst = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!activeRef.current) return;
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = -((e.clientY - rect.top) / rect.height - 0.5);
      mouse[0] = x;
      mouse[1] = y;

      // Rings are centred, so hover is a radial distance test.
      isHovered = Math.sqrt(x * x + y * y) < 0.35;
    };
    const onClick = (e: MouseEvent) => {
      if (!activeRef.current) return;
      const rect = mount.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        burst = 1;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    let frameId = 0;
    const animate = (t: number) => {
      if (!activeRef.current) {
        frameId = 0;
        return;
      }
      frameId = requestAnimationFrame(animate);

      smoothMouse[0] += (mouse[0] - smoothMouse[0]) * 0.08;
      smoothMouse[1] += (mouse[1] - smoothMouse[1]) * 0.08;
      hoverAmount += ((isHovered ? 1 : 0) - hoverAmount) * 0.08;
      burst *= 0.95;
      if (burst < 0.001) burst = 0;

      const u = program.uniforms;
      u.uTime.value = t * 0.001 * speedRef.current;
      const m = u.uMouse.value as Float32Array;
      m[0] = smoothMouse[0];
      m[1] = smoothMouse[1];
      u.uMouseInfluence.value = followMouseRef.current ? mouseInfluenceRef.current : 0;
      u.uHoverAmount.value = hoverAmount;
      u.uBurst.value = clickBurstRef.current ? burst : 0;

      renderer.render({ scene: mesh });
    };

    startLoopRef.current = () => {
      if (!frameId && activeRef.current) frameId = requestAnimationFrame(animate);
    };
    startLoopRef.current();

    return () => {
      startLoopRef.current = null;
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      if (mount.contains(gl.canvas)) mount.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      programRef.current = null;
    };
  }, [shouldInit]);

  useEffect(() => {
    activeRef.current = active;
    speedRef.current = speed;
    followMouseRef.current = followMouse;
    mouseInfluenceRef.current = mouseInfluence;
    clickBurstRef.current = clickBurst;
    if (active) startLoopRef.current?.();
  });

  // Static uniforms are written only when the corresponding prop changes,
  // instead of being re-parsed and re-uploaded on every frame. `shouldInit` is
  // a dependency so these land on the program the moment it is created — the
  // setup effect above is declared first, so it has already run by now.
  useEffect(() => {
    const program = programRef.current;
    if (!program) return;
    const u = program.uniforms;

    const c1 = hexToRgb(color);
    (u.uColor.value as Float32Array).set(c1);
    const c2 = hexToRgb(colorTwo);
    (u.uColorTwo.value as Float32Array).set(c2);

    u.uAttenuation.value = attenuation;
    u.uLineThickness.value = lineThickness;
    u.uBaseRadius.value = baseRadius;
    u.uRadiusStep.value = radiusStep;
    u.uScaleRate.value = scaleRate;
    u.uRingCount.value = ringCount;
    u.uOpacity.value = opacity;
    u.uNoiseAmount.value = noiseAmount;
    u.uRotation.value = (rotation * Math.PI) / 180;
    u.uRingGap.value = ringGap;
    u.uFadeIn.value = fadeIn;
    u.uFadeOut.value = fadeOut;
    u.uHoverScale.value = hoverScale;
    u.uParallax.value = parallax;
  }, [
    shouldInit,
    color, colorTwo, attenuation, lineThickness, baseRadius, radiusStep,
    scaleRate, ringCount, opacity, noiseAmount, rotation, ringGap,
    fadeIn, fadeOut, hoverScale, parallax
  ]);

  return <div ref={mountRef} className="magic-rings-container" style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined} />;
}
