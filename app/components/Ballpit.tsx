'use client';
import React, { useEffect, useRef } from 'react';
import {
  Vector3,
  MeshPhysicalMaterial,
  InstancedMesh,
  Clock,
  AmbientLight,
  SphereGeometry,
  ShaderChunk,
  Scene,
  Color,
  Object3D,
  SRGBColorSpace,
  MathUtils,
  PMREMGenerator,
  Vector2,
  WebGLRenderer,
  PerspectiveCamera,
  PointLight,
  ACESFilmicToneMapping,
  Plane,
  Raycaster,
  TextureLoader,
  RepeatWrapping
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

class ThreeBase {
  #config: any;
  canvas: any;
  camera: any;
  cameraMinAspect: any;
  cameraMaxAspect: any;
  cameraFov: any;
  maxPixelRatio: any;
  minPixelRatio: any;
  scene: any;
  renderer: any;
  #postprocessing: any;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render = this.#renderInternal;
  onBeforeRender = (time: any) => {};
  onAfterRender = (time: any) => {};
  onAfterResize = (size: any) => {};
  #isIntersecting = false;
  #isAnimating = false;
  isDisposed = false;
  #intersectionObserver: any;
  #resizeObserver: any;
  #resizeTimeout: any;
  #clock = new Clock();
  #time = { elapsed: 0, delta: 0 };
  #animationFrameId: any;

  constructor(e: any) {
    this.#config = { ...e };
    this.#initCamera();
    this.#initScene();
    this.#initRenderer();
    this.resize();
    this.#addEventListeners();
  }

  #initCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  #initScene() {
    this.scene = new Scene();
  }

  #initRenderer() {
    if (this.#config.canvas) {
      this.canvas = this.#config.canvas;
    } else if (this.#config.id) {
      this.canvas = document.getElementById(this.#config.id);
    } else {
      console.error('Three: Missing canvas or id parameter');
    }
    this.canvas.style.display = 'block';
    const e = {
      canvas: this.canvas,
      powerPreference: 'high-performance',
      ...(this.#config.rendererOptions ?? {})
    };
    this.renderer = new WebGLRenderer(e);
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  #addEventListeners() {
    if (!(this.#config.size instanceof Object)) {
      window.addEventListener('resize', this.#handleResize.bind(this));
      if (this.#config.size === 'parent' && this.canvas.parentNode) {
        this.#resizeObserver = new ResizeObserver(this.#handleResize.bind(this));
        this.#resizeObserver.observe(this.canvas.parentNode);
      }
    }
    this.#intersectionObserver = new IntersectionObserver(this.#handleIntersection.bind(this), {
      root: null,
      rootMargin: '0px',
      threshold: 0
    });
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener('visibilitychange', this.#handleVisibilityChange.bind(this));
  }

  #removeEventListeners() {
    window.removeEventListener('resize', this.#handleResize.bind(this));
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.#handleVisibilityChange.bind(this));
  }

  #handleIntersection(e: any) {
    this.#isIntersecting = e[0].isIntersecting;
    this.#isIntersecting ? this.#startAnimation() : this.#stopAnimation();
  }

  #handleVisibilityChange() {
    if (this.#isIntersecting) {
      document.hidden ? this.#stopAnimation() : this.#startAnimation();
    }
  }

  #handleResize() {
    if (this.#resizeTimeout) clearTimeout(this.#resizeTimeout);
    this.#resizeTimeout = setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    let w, h;
    if (this.#config.size instanceof Object) {
      w = this.#config.size.width;
      h = this.#config.size.height;
    } else if (this.#config.size === 'parent' && this.canvas.parentNode) {
      w = this.canvas.parentNode.offsetWidth;
      h = this.canvas.parentNode.offsetHeight;
    } else {
      w = window.innerWidth;
      h = window.innerHeight;
    }
    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;
    this.#updateCamera();
    this.#updateRenderer();
    this.onAfterResize(this.size);
  }

  #updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#adjustFov(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#adjustFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  #adjustFov(aspectRatio: any) {
    const t = Math.tan(MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / aspectRatio);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(t));
  }

  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const e = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(e / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    } else if (this.camera.isOrthographicCamera) {
      this.size.wHeight = this.camera.top - this.camera.bottom;
      this.size.wWidth = this.camera.right - this.camera.left;
    }
  }

  #updateRenderer() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#postprocessing?.setSize(this.size.width, this.size.height);
    let pixelRatio = window.devicePixelRatio;
    if (this.maxPixelRatio && pixelRatio > this.maxPixelRatio) {
      pixelRatio = this.maxPixelRatio;
    } else if (this.minPixelRatio && pixelRatio < this.minPixelRatio) {
      pixelRatio = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;
  }

  get postprocessing() {
    return this.#postprocessing;
  }
  set postprocessing(e) {
    this.#postprocessing = e;
    this.render = e.render.bind(e);
  }

  #startAnimation() {
    if (this.#isAnimating) return;
    const animate = () => {
      this.#animationFrameId = requestAnimationFrame(animate);
      this.#time.delta = this.#clock.getDelta();
      this.#time.elapsed += this.#time.delta;
      this.onBeforeRender(this.#time);
      this.render();
      this.onAfterRender(this.#time);
    };
    this.#isAnimating = true;
    this.#clock.start();
    animate();
  }

  #stopAnimation() {
    if (this.#isAnimating) {
      cancelAnimationFrame(this.#animationFrameId);
      this.#isAnimating = false;
      this.#clock.stop();
    }
  }

  #renderInternal() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse((e: any) => {
      if (e.isMesh && typeof e.material === 'object' && e.material !== null) {
        Object.keys(e.material).forEach(t => {
          const i = e.material[t];
          if (i !== null && typeof i === 'object' && typeof i.dispose === 'function') {
            i.dispose();
          }
        });
        e.material.dispose();
        e.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.#removeEventListeners();
    this.#stopAnimation();
    this.clear();
    this.#postprocessing?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.isDisposed = true;
  }
}

const interactionMap = new Map();
const mousePos = new Vector2();
let isListening = false;

function createInteraction(e: any) {
  const t = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    touching: false,
    onEnter() {},
    onMove() {},
    onClick() {},
    onLeave() {},
    ...e
  };
  if (!interactionMap.has(e.domElement)) {
    interactionMap.set(e.domElement, t);
    if (!isListening) {
      document.body.addEventListener('pointermove', handlePointerMove);
      document.body.addEventListener('pointerleave', handlePointerLeave);
      document.body.addEventListener('click', handleClick);

      document.body.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.body.addEventListener('touchend', handleTouchEnd, { passive: false });
      document.body.addEventListener('touchcancel', handleTouchEnd, { passive: false });

      isListening = true;
    }
  }
  t.dispose = () => {
    interactionMap.delete(e.domElement);
    if (interactionMap.size === 0) {
      document.body.removeEventListener('pointermove', handlePointerMove);
      document.body.removeEventListener('pointerleave', handlePointerLeave);
      document.body.removeEventListener('click', handleClick);

      document.body.removeEventListener('touchstart', handleTouchStart);
      document.body.removeEventListener('touchmove', handleTouchMove);
      document.body.removeEventListener('touchend', handleTouchEnd);
      document.body.removeEventListener('touchcancel', handleTouchEnd);

      isListening = false;
    }
  };
  return t;
}

function handlePointerMove(e: any) {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  processInteraction();
}

function processInteraction() {
  for (const [elem, t] of interactionMap) {
    const rect = elem.getBoundingClientRect();
    if (isInside(rect)) {
      updatePosition(t, rect);
      if (!t.hover) {
        t.hover = true;
        t.onEnter(t);
      }
      t.onMove(t);
    } else if (t.hover && !t.touching) {
      t.hover = false;
      t.onLeave(t);
    }
  }
}

function handleClick(e: any) {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  for (const [elem, t] of interactionMap) {
    const rect = elem.getBoundingClientRect();
    updatePosition(t, rect);
    if (isInside(rect)) t.onClick(t);
  }
}

function handlePointerLeave() {
  for (const t of interactionMap.values()) {
    if (t.hover) {
      t.hover = false;
      t.onLeave(t);
    }
  }
}

function handleTouchStart(e: any) {
  if (e.touches.length > 0) {
    e.preventDefault();
    mousePos.x = e.touches[0].clientX;
    mousePos.y = e.touches[0].clientY;

    for (const [elem, t] of interactionMap) {
      const rect = elem.getBoundingClientRect();
      if (isInside(rect)) {
        t.touching = true;
        updatePosition(t, rect);
        if (!t.hover) {
          t.hover = true;
          t.onEnter(t);
        }
        t.onMove(t);
      }
    }
  }
}

function handleTouchMove(e: any) {
  if (e.touches.length > 0) {
    e.preventDefault();
    mousePos.x = e.touches[0].clientX;
    mousePos.y = e.touches[0].clientY;

    for (const [elem, t] of interactionMap) {
      const rect = elem.getBoundingClientRect();
      updatePosition(t, rect);

      if (isInside(rect)) {
        if (!t.hover) {
          t.hover = true;
          t.touching = true;
          t.onEnter(t);
        }
        t.onMove(t);
      } else if (t.hover && t.touching) {
        t.onMove(t);
      }
    }
  }
}

function handleTouchEnd() {
  for (const [, t] of interactionMap) {
    if (t.touching) {
      t.touching = false;
      if (t.hover) {
        t.hover = false;
        t.onLeave(t);
      }
    }
  }
}

function updatePosition(e: any, t: any) {
  const { position: i, nPosition: s } = e;
  i.x = mousePos.x - t.left;
  i.y = mousePos.y - t.top;
  s.x = (i.x / t.width) * 2 - 1;
  s.y = (-i.y / t.height) * 2 + 1;
}

function isInside(e: any) {
  const { x: t, y: i } = mousePos;
  const { left: s, top: n, width: o, height: r } = e;
  return t >= s && t <= s + o && i >= n && i <= n + r;
}

const { randFloat, randFloatSpread } = MathUtils;
const vecF = new Vector3();
const vecI = new Vector3();
const vecO = new Vector3();
const vecV = new Vector3();
const vecB = new Vector3();
const vecN = new Vector3();
const vec_ = new Vector3();
const vecj = new Vector3();
const vecH = new Vector3();
const vecT = new Vector3();

class PhysicsSimulation {
  config: any;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center: Vector3;

  constructor(e: any) {
    this.config = e;
    this.positionData = new Float32Array(3 * e.count).fill(0);
    this.velocityData = new Float32Array(3 * e.count).fill(0);
    this.sizeData = new Float32Array(e.count).fill(1);
    this.center = new Vector3();
    this.#initPositions();
    this.setSizes();
  }

  #initPositions() {
    const { config: e, positionData: t } = this;
    this.center.toArray(t, 0);
    for (let i = 1; i < e.count; i++) {
      const s = 3 * i;
      t[s] = randFloatSpread(2 * e.maxX);
      t[s + 1] = randFloatSpread(2 * e.maxY);
      t[s + 2] = randFloatSpread(2 * e.maxZ);
    }
  }

  setSizes() {
    const { config: e, sizeData: t } = this;
    t[0] = e.size0;
    for (let i = 1; i < e.count; i++) {
      t[i] = randFloat(e.minSize, e.maxSize);
    }
  }

  update(e: any) {
    const { config: t, center: i, positionData: s, sizeData: n, velocityData: o } = this;
    let r = 0;
    if (t.controlSphere0) {
      r = 1;
      vecF.fromArray(s, 0);
      vecF.lerp(i, 0.1).toArray(s, 0);
      vecV.set(0, 0, 0).toArray(o, 0);
    }
    for (let idx = r; idx < t.count; idx++) {
      const base = 3 * idx;
      vecI.fromArray(s, base);
      vecB.fromArray(o, base);
      vecB.y -= e.delta * t.gravity * n[idx];
      vecB.multiplyScalar(t.friction);
      vecB.clampLength(0, t.maxVelocity);
      vecI.add(vecB);
      vecI.toArray(s, base);
      vecB.toArray(o, base);
    }
    for (let idx = r; idx < t.count; idx++) {
      const base = 3 * idx;
      vecI.fromArray(s, base);
      vecB.fromArray(o, base);
      const radius = n[idx];
      for (let jdx = idx + 1; jdx < t.count; jdx++) {
        const otherBase = 3 * jdx;
        vecO.fromArray(s, otherBase);
        vecN.fromArray(o, otherBase);
        const otherRadius = n[jdx];
        vec_.copy(vecO).sub(vecI);
        const dist = vec_.length();
        const sumRadius = radius + otherRadius;
        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          vecj.copy(vec_)
            .normalize()
            .multiplyScalar(0.5 * overlap);
          vecH.copy(vecj).multiplyScalar(Math.max(vecB.length(), 1));
          vecT.copy(vecj).multiplyScalar(Math.max(vecN.length(), 1));
          vecI.sub(vecj);
          vecB.sub(vecH);
          vecI.toArray(s, base);
          vecB.toArray(o, base);
          vecO.add(vecj);
          vecN.add(vecT);
          vecO.toArray(s, otherBase);
          vecN.toArray(o, otherBase);
        }
      }
      if (t.controlSphere0) {
        vec_.copy(vecF).sub(vecI);
        const dist = vec_.length();
        const sumRadius0 = radius + n[0];
        if (dist < sumRadius0) {
          const diff = sumRadius0 - dist;
          vecj.copy(vec_.normalize()).multiplyScalar(diff);
          vecH.copy(vecj).multiplyScalar(Math.max(vecB.length(), 2));
          vecI.sub(vecj);
          vecB.sub(vecH);
        }
      }
      if (Math.abs(vecI.x) + radius > t.maxX) {
        vecI.x = Math.sign(vecI.x) * (t.maxX - radius);
        vecB.x = -vecB.x * t.wallBounce;
      }
      if (t.obsWorld) {
        const { top, bottom, left, right } = t.obsWorld;
        if (vecI.y - radius < top && vecI.y + radius > bottom && vecI.x + radius > left && vecI.x - radius < right) {
          const penTop = (top + radius) - vecI.y;
          const penBottom = vecI.y - (bottom - radius);
          const penLeft = vecI.x - (left - radius);
          const penRight = (right + radius) - vecI.x;
          
          const minPen = Math.min(penTop, penBottom, penLeft, penRight);
          
          if (minPen === penTop) {
            vecI.y = top + radius;
            vecB.y = -vecB.y * t.wallBounce;
            vecB.x *= t.friction;
            vecB.z *= t.friction;
          } else if (minPen === penBottom) {
            vecI.y = bottom - radius;
            vecB.y = -vecB.y * t.wallBounce;
          } else if (minPen === penLeft) {
            vecI.x = left - radius;
            vecB.x = -vecB.x * t.wallBounce;
          } else if (minPen === penRight) {
            vecI.x = right + radius;
            vecB.x = -vecB.x * t.wallBounce;
          }
        }
      }

      if (t.gravity === 0) {
        if (Math.abs(vecI.y) + radius > t.maxY) {
          vecI.y = Math.sign(vecI.y) * (t.maxY - radius);
          vecB.y = -vecB.y * t.wallBounce;
        }
      } else if (vecI.y - radius < -t.maxY) {
        vecI.y = -t.maxY + radius;
        vecB.y = -vecB.y * t.wallBounce;
        vecB.x *= t.friction;
        vecB.z *= t.friction;
      }
      const maxBoundary = Math.max(t.maxZ, radius);
      if (Math.abs(vecI.z) + radius > maxBoundary) {
        vecI.z = Math.sign(vecI.z) * (maxBoundary - radius);
        vecB.z = -vecB.z * t.wallBounce;
      }
      vecI.toArray(s, base);
      vecB.toArray(o, base);
    }
  }
}

class ScatteringMaterial extends MeshPhysicalMaterial {
  uniforms: any;
  onBeforeCompile2?: any;
  
  constructor(e: any) {
    super(e);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.02 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 2 }
    };
    if (!this.defines) this.defines = {};
    this.defines.USE_UV = '';
    this.onBeforeCompile = (e: any) => {
      Object.assign(e.uniforms, this.uniforms);
      e.fragmentShader =
        '\n        uniform float thicknessPower;\n        uniform float thicknessScale;\n        uniform float thicknessDistortion;\n        uniform float thicknessAmbient;\n        uniform float thicknessAttenuation;\n      ' +
        e.fragmentShader;
      e.fragmentShader = e.fragmentShader.replace(
        'void main() {',
        '\n        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {\n          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));\n          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;\n          #ifdef USE_COLOR\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor.rgb;\n          #else\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;\n          #endif\n          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;\n        }\n\n        void main() {\n      '
      );
      const t = ShaderChunk.lights_fragment_begin.replaceAll(
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        '\n          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);\n        '
      );
      e.fragmentShader = e.fragmentShader.replace('#include <lights_fragment_begin>', t);
      if (this.onBeforeCompile2) this.onBeforeCompile2(e);
    };
  }
}

const defaultConfig = {
  count: 200,
  colors: [0, 0, 0],
  ambientColor: 16777215,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.75,
    clearcoat: 0.5,
    clearcoatRoughness: 0.5
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true
};

const dummyObj = new Object3D();

class BallpitInstancedMesh extends InstancedMesh {
  config: any;
  physics: PhysicsSimulation;
  ambientLight: any;
  light: any;

  constructor(e: any, t = {}) {
    const i = { ...defaultConfig, ...t };
    const s = new RoomEnvironment();
    const n = new PMREMGenerator(e).fromScene(s).texture;
    const o = new SphereGeometry(1, 32, 32);
    
    const textureLoader = new TextureLoader();
    const carbonTexture = textureLoader.load('/images/carbon_texture.png');
    carbonTexture.wrapS = RepeatWrapping;
    carbonTexture.wrapT = RepeatWrapping;
    carbonTexture.repeat.set(0.5, 0.5);

    const r = new ScatteringMaterial({ envMap: n, map: carbonTexture, ...i.materialParams });
    r.envMapRotation.x = -Math.PI / 2;
    super(o, r, i.count);
    this.config = i;
    this.physics = new PhysicsSimulation(i);
    this.#initLights();
    this.setColors(i.colors);
  }

  #initLights() {
    this.ambientLight = new AmbientLight(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(0x39ff14, this.config.lightIntensity); // Hardcode neon green for the cursor light
    this.add(this.light);
  }

  setColors(e: any) {
    if (e && e.length > 0) {
      const t = new (function (this: any, e: any) {
        const t = e.map((e: any) => new Color(e));
        this.getColorAt = function (e: any) {
          const i = Math.max(0, Math.min(1, e)) * (t.length - 1);
          const s = Math.floor(i);
          const n = Math.ceil(i);
          const o = i - s;
          const r = t[s].clone();
          return r.lerp(t[n], o);
        };
      } as any)(e);
      for (let idx = 0; idx < this.count; idx++) {
        let col = t.getColorAt(idx / this.count);
        
        // Randomly make some balls 5% lighter (excluding the main cursor ball at idx 0)
        if (idx > 0 && Math.random() > 0.5) {
          col.lerp(new Color(0xffffff), 0.05);
        }

        this.setColorAt(idx, col);
        // Removed the line that turns the light grey
      }
      if (this.instanceColor) this.instanceColor.needsUpdate = true;
    }
  }

  update(e: any) {
    this.physics.update(e);
    for (let idx = 0; idx < this.count; idx++) {
      dummyObj.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && this.config.followCursor === false) {
        dummyObj.scale.setScalar(0);
      } else {
        dummyObj.scale.setScalar(this.physics.sizeData[idx]);
      }
      dummyObj.updateMatrix();
      this.setMatrixAt(idx, dummyObj.matrix);
      if (idx === 0) this.light.position.copy(dummyObj.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function createBallpit(e: any, t: any = {}) {
  const i = new ThreeBase({
    canvas: e,
    size: 'parent',
    rendererOptions: { antialias: true, alpha: true }
  });
  let s: any;
  i.renderer.toneMapping = ACESFilmicToneMapping;
  i.camera.position.set(0, 0, 20);
  i.camera.lookAt(0, 0, 0);
  i.cameraMaxAspect = 1.5;
  i.resize();
  initialize(t);
  const n = new Raycaster();
  const o = new Plane(new Vector3(0, 0, 1), 0);
  const r = new Vector3();
  let c = false;

  e.style.touchAction = 'none';
  e.style.userSelect = 'none';
  e.style.webkitUserSelect = 'none';

  const h = createInteraction({
    domElement: e,
    onMove() {
      n.setFromCamera((h as any).nPosition, i.camera);
      i.camera.getWorldDirection(o.normal);
      n.ray.intersectPlane(o, r);
      s.physics.center.copy(r);
      s.config.controlSphere0 = true;
    },
    onLeave() {
      s.config.controlSphere0 = false;
    }
  });
  
  function initialize(e: any) {
    if (s) {
      i.clear();
      i.scene.remove(s);
    }
    s = new BallpitInstancedMesh(i.renderer, e);
    i.scene.add(s);
  }
  
  i.onBeforeRender = e => {
    if (!c) s.update(e);
  };
  
  let resizeObserver: ResizeObserver | null = null;
  if (t.obstacleRef && t.obstacleRef.current) {
    resizeObserver = new ResizeObserver(() => i.resize());
    resizeObserver.observe(t.obstacleRef.current);
  }

  i.onAfterResize = (e: any) => {
    s.config.maxX = e.wWidth / 2;
    s.config.maxY = e.wHeight / 2;
    if (t.obstacleRef && t.obstacleRef.current) {
      const oRect = t.obstacleRef.current.getBoundingClientRect();
      const cRect = i.canvas.getBoundingClientRect();
      
      const oW = (oRect.width / cRect.width) * e.wWidth;
      const oH = (oRect.height / cRect.height) * e.wHeight;
      const domCenterY = (oRect.top - cRect.top) + oRect.height / 2 - cRect.height / 2;
      const worldCenterY = -(domCenterY / cRect.height) * e.wHeight;
      const domCenterX = (oRect.left - cRect.left) + oRect.width / 2 - cRect.width / 2;
      const worldCenterX = (domCenterX / cRect.width) * e.wWidth;
      
      s.config.obsWorld = {
        top: worldCenterY + oH / 2,
        bottom: worldCenterY - oH / 2,
        left: worldCenterX - oW / 2,
        right: worldCenterX + oW / 2
      };
    } else {
      s.config.obsWorld = null;
    }
  };
  
  return {
    three: i,
    get spheres() {
      return s;
    },
    setCount(e: any) {
      initialize({ ...s.config, count: e });
    },
    togglePause() {
      c = !c;
    },
    dispose() {
      if (resizeObserver) resizeObserver.disconnect();
      (h as any).dispose();
      i.dispose();
    }
  };
}

const Ballpit = ({ className = '', followCursor = true, ...props }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spheresInstanceRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    spheresInstanceRef.current = createBallpit(canvas, { followCursor, ...props });

    return () => {
      if (spheresInstanceRef.current) {
        spheresInstanceRef.current.dispose();
      }
    };
  }, []);

  return <canvas className={className} ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default Ballpit;
