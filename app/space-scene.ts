import * as THREE from "three";

/**
 * The WebGL "space" behind the site: a starfield the camera flies through as
 * the page scrolls (over a CSS nebula), a ringed gas giant, a star-gate of
 * particles, a wireframe network planet and a wormhole at the end of the
 * journey. Pure three.js + small GLSL shaders, no textures to download.
 *
 * Browser-only: import it dynamically after first paint.
 */

export type SceneAnchor = { scroll: number; z: number };
export type SceneFrame = { z: number; velocity: number };
export type SpaceSceneOptions = { lowPower: boolean; reducedMotion: boolean; onFrame?: (frame: SceneFrame) => void };

const PINK = new THREE.Color("#ff84ba");
const YELLOW = new THREE.Color("#ffdf82");
const BLUE = new THREE.Color("#99c2ff");
const CREAM = new THREE.Color("#ffefe3");
const VOID = new THREE.Color("#07060b");

export const JOURNEY = { planet: -84, gate: -250, network: -372, portal: -668, end: -570 } as const;

// Ashima 3D simplex noise (MIT) — shared by the planet, ring and portal shaders.
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float f=0.0;float a=0.5;for(int i=0;i<3;i++){f+=a*snoise(p);p*=2.02;a*=0.5;}return f;}
`;

// Deterministic PRNG so the universe is identical on every visit.
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickStarColor(value: number) {
  if (value < 0.7) return CREAM;
  if (value < 0.83) return BLUE;
  if (value < 0.94) return PINK;
  return YELLOW;
}

function createStarfield(count: number, rand: () => number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    const radius = 10 + Math.pow(rand(), 0.55) * 340;
    const angle = rand() * Math.PI * 2;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle) * radius * 0.72;
    positions[index * 3 + 2] = 80 - rand() * 1400;
    const color = pickStarColor(rand());
    colors.set([color.r, color.g, color.b], index * 3);
    sizes[index] = rand() < 0.035 ? 3.4 + rand() * 2.4 : 0.7 + rand() * 1.7;
    seeds[index] = rand();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uBoost: { value: 0 }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uPixelRatio; uniform float uBoost;
      attribute vec3 aColor; attribute float aSize; attribute float aSeed;
      varying vec3 vColor; varying float vAlpha;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float twinkle = 0.6 + 0.4 * sin(uTime * (0.5 + aSeed * 2.2) + aSeed * 60.0);
        float fade = smoothstep(-1100.0, -620.0, mv.z) * smoothstep(0.5, 6.0, -mv.z);
        vColor = aColor;
        vAlpha = twinkle * fade;
        gl_PointSize = clamp(aSize * (1.0 + uBoost) * uPixelRatio * (230.0 / -mv.z), 0.0, 44.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying vec3 vColor; varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float core = smoothstep(0.5, 0.0, d);
        float glow = core * core * core;
        float alpha = (core * 0.28 + glow) * vAlpha * uOpacity;
        if (alpha < 0.012) discard;
        gl_FragColor = vec4(vColor * (0.75 + glow * 0.9), alpha);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
}

/** Line segments whose tails stretch along the flight path with scroll speed. */
function createWarpStreaks(count: number, rand: () => number) {
  const positions = new Float32Array(count * 6);
  const ends = new Float32Array(count * 2);
  const colors = new Float32Array(count * 6);
  for (let index = 0; index < count; index += 1) {
    const radius = 5 + Math.pow(rand(), 0.8) * 70;
    const angle = rand() * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.75;
    const z = 60 - rand() * 800;
    positions.set([x, y, z, x, y, z], index * 6);
    ends.set([0, 1], index * 2);
    const color = rand() < 0.5 ? BLUE : rand() < 0.5 ? PINK : CREAM;
    colors.set([color.r, color.g, color.b, color.r, color.g, color.b], index * 6);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aEnd", new THREE.BufferAttribute(ends, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.ShaderMaterial({
    uniforms: { uStretch: { value: 0 }, uStrength: { value: 0 } },
    vertexShader: /* glsl */ `
      uniform float uStretch;
      attribute float aEnd; attribute vec3 aColor;
      varying vec3 vColor; varying float vEnd;
      void main() {
        vec3 p = position;
        p.z += aEnd * uStretch;
        vColor = aColor; vEnd = aEnd;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uStrength;
      varying vec3 vColor; varying float vEnd;
      void main() { gl_FragColor = vec4(vColor, (1.0 - vEnd) * uStrength); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.LineSegments(geometry, material);
}

const planetVertex = /* glsl */ `
  varying vec3 vPos; varying vec3 vViewNormal; varying vec3 vWorldNormal;
  void main() {
    vPos = position;
    vViewNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

function planetMaterial(colors: [THREE.Color, THREE.Color, THREE.Color], rim: THREE.Color, scale: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uA: { value: colors[0] }, uB: { value: colors[1] }, uC: { value: colors[2] },
      uRim: { value: rim },
      uLight: { value: new THREE.Vector3(-0.8, 0.55, 0.6).normalize() },
      uScale: { value: scale },
    },
    vertexShader: planetVertex,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform vec3 uRim; uniform vec3 uLight; uniform float uScale;
      varying vec3 vPos; varying vec3 vViewNormal; varying vec3 vWorldNormal;
      ${NOISE}
      void main() {
        vec3 p = vPos * uScale;
        float turbulence = fbm(vec3(p.x * 0.6, p.y * 2.4, p.z * 0.6) + vec3(uTime * 0.018, 0.0, 0.0));
        float bands = sin(p.y * 3.2 + turbulence * 3.4) * 0.5 + 0.5;
        vec3 col = mix(uA, uB, bands);
        col = mix(col, uC, smoothstep(0.35, 0.9, turbulence) * 0.55);
        float light = clamp(dot(normalize(vWorldNormal), uLight), 0.0, 1.0);
        float terminator = smoothstep(0.0, 0.55, light);
        float rim = pow(1.0 - clamp(dot(vViewNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.6);
        col = col * (0.05 + terminator * 1.1) + uRim * rim * (0.25 + light * 0.9);
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
}

function atmosphere(radius: number, color: THREE.Color, power: number) {
  const material = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: color }, uPower: { value: power } },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uPower; varying vec3 vNormal;
      void main() { float i = pow(clamp(0.74 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), uPower); gl_FragColor = vec4(uColor, 1.0) * i * 1.6; }`,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 48), material);
}

function createRing(inner: number, outer: number) {
  const material = new THREE.ShaderMaterial({
    uniforms: { uInner: { value: inner }, uOuter: { value: outer }, uPink: { value: PINK }, uCream: { value: CREAM }, uBlue: { value: BLUE } },
    vertexShader: /* glsl */ `
      varying float vR; varying vec2 vXY;
      void main() { vR = length(position.xy); vXY = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uInner; uniform float uOuter; uniform vec3 uPink; uniform vec3 uCream; uniform vec3 uBlue;
      varying float vR; varying vec2 vXY;
      ${NOISE}
      void main() {
        float t = (vR - uInner) / (uOuter - uInner);
        float bands = snoise(vec3(t * 26.0, 0.0, 0.0)) * 0.5 + 0.5;
        float fine = snoise(vec3(t * 90.0, 1.0, 0.0)) * 0.5 + 0.5;
        float alpha = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.82, t) * (0.25 + bands * 0.55) * (0.6 + fine * 0.4);
        float gap = smoothstep(0.52, 0.55, t) * smoothstep(0.6, 0.57, t);
        alpha *= 1.0 - gap * 0.85;
        float shadow = smoothstep(-0.2, 0.35, vXY.x / uOuter + 0.25);
        vec3 col = mix(uCream, uPink, t) + uBlue * 0.15 * (1.0 - t);
        gl_FragColor = vec4(col * (0.35 + 0.65 * shadow), alpha * 0.8);
      }`,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  });
  return new THREE.Mesh(new THREE.RingGeometry(inner, outer, 180, 1), material);
}

/** A ring of drifting particles the camera flies through. */
function createParticleRing(count: number, radius: number, spread: number, rand: () => number, palette: THREE.Color[]) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    const angle = rand() * Math.PI * 2;
    const r = radius + (rand() - 0.5) * spread * (0.4 + rand());
    positions.set([Math.cos(angle) * r, Math.sin(angle) * r, (rand() - 0.5) * spread * 0.5], index * 3);
    const color = palette[Math.floor(rand() * palette.length)];
    colors.set([color.r, color.g, color.b], index * 3);
    sizes[index] = 0.6 + rand() * 1.8;
    seeds[index] = rand();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const starfield = createStarfield(1, rand);
  const points = new THREE.Points(geometry, starfield.material as THREE.ShaderMaterial);
  starfield.geometry.dispose();
  return points;
}

function createNetworkPlanet(radius: number) {
  const group = new THREE.Group();
  const icosahedron = new THREE.IcosahedronGeometry(radius, 2);
  const edges = new THREE.EdgesGeometry(icosahedron, 1);
  const lineMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPink: { value: PINK }, uBlue: { value: BLUE }, uRadius: { value: radius }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec3 vPos; varying float vFacing;
      void main() {
        vPos = position;
        vec3 n = normalize(normalMatrix * normalize(position));
        vFacing = n.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uPink; uniform vec3 uBlue; uniform float uRadius; uniform float uOpacity;
      varying vec3 vPos; varying float vFacing;
      void main() {
        float sweep = sin(vPos.y / uRadius * 3.0 - uTime * 1.4) * 0.5 + 0.5;
        vec3 col = mix(uBlue, uPink, sweep);
        float alpha = mix(0.08, 0.55, smoothstep(-0.4, 0.6, vFacing)) * (0.55 + sweep * 0.6);
        gl_FragColor = vec4(col, alpha * uOpacity);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  group.add(new THREE.LineSegments(edges, lineMaterial));

  // Glowing "nodes" at every vertex, pulsing like traffic across a network.
  const vertices = icosahedron.getAttribute("position");
  const seen = new Map<string, THREE.Vector3>();
  for (let index = 0; index < vertices.count; index += 1) {
    const vertex = new THREE.Vector3().fromBufferAttribute(vertices, index);
    seen.set(vertex.toArray().map((value) => value.toFixed(2)).join(","), vertex);
  }
  const nodes = Array.from(seen.values());
  const rand = random(91);
  const positions = new Float32Array(nodes.length * 3);
  const colors = new Float32Array(nodes.length * 3);
  const sizes = new Float32Array(nodes.length);
  const seeds = new Float32Array(nodes.length);
  nodes.forEach((node, index) => {
    positions.set(node.toArray(), index * 3);
    const color = rand() < 0.2 ? YELLOW : rand() < 0.5 ? PINK : BLUE;
    colors.set([color.r, color.g, color.b], index * 3);
    sizes[index] = 1.6 + rand() * 2.6;
    seeds[index] = rand();
  });
  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  nodeGeometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  nodeGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  nodeGeometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const donor = createStarfield(1, rand);
  const nodePoints = new THREE.Points(nodeGeometry, donor.material as THREE.ShaderMaterial);
  donor.geometry.dispose();
  group.add(nodePoints);

  // A dark core so back-facing lines read as depth, not clutter.
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 0.94, 48, 32),
    new THREE.MeshBasicMaterial({ color: VOID, transparent: true, opacity: 0.72, depthWrite: false }),
  );
  group.add(core);
  icosahedron.dispose();
  return { group, lineMaterial, nodeMaterial: nodePoints.material as THREE.ShaderMaterial, coreMaterial: core.material };
}

function createPortal() {
  const group = new THREE.Group();
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPink: { value: PINK }, uBlue: { value: BLUE }, uYellow: { value: YELLOW }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uPink; uniform vec3 uBlue; uniform vec3 uYellow; uniform float uOpacity;
      varying vec2 vUv;
      ${NOISE}
      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        float a = atan(p.y, p.x);
        float swirl = snoise(vec3(cos(a) * 1.5 + r * 4.0, sin(a) * 1.5 - r * 3.0, uTime * 0.25 - r * 2.0));
        float ring = exp(-pow((r - 0.42 - swirl * 0.03) * 9.0, 2.0));
        float disk = smoothstep(1.0, 0.35, r) * smoothstep(0.18, 0.5, r) * (0.35 + 0.65 * (swirl * 0.5 + 0.5));
        float hole = smoothstep(0.3, 0.36, r);
        vec3 col = mix(uBlue, uPink, smoothstep(0.3, 0.9, r + swirl * 0.2)) * disk * 0.55 + mix(uYellow, uPink, 0.35) * ring * 0.85;
        float alpha = (disk * 0.85 + ring) * hole;
        gl_FragColor = vec4(col * hole * uOpacity, alpha * uOpacity);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  group.add(new THREE.Mesh(new THREE.PlaneGeometry(90, 90), material));
  return { group, material };
}

export function createSpaceScene(canvas: HTMLCanvasElement, { lowPower, reducedMotion, onFrame }: SpaceSceneOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  // Resolution is the biggest cost of a full-screen scene: cap it, then adapt to the device.
  const maxPixelRatio = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5);
  let pixelRatio = maxPixelRatio;
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(VOID, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 3000);
  const rand = random(2026);

  const stars = createStarfield(lowPower ? 2600 : 6800, rand);
  const starMaterial = stars.material as THREE.ShaderMaterial;
  starMaterial.uniforms.uPixelRatio.value = pixelRatio;
  scene.add(stars);

  const streaks = createWarpStreaks(lowPower ? 260 : 720, rand);
  const streakMaterial = streaks.material as THREE.ShaderMaterial;
  scene.add(streaks);

  // Hero planet: a banded gas giant with a moon, rings and atmosphere.
  const planet = new THREE.Group();
  const planetRadius = 19;
  const giantMaterial = planetMaterial([new THREE.Color("#1d1640"), new THREE.Color("#b85a8f"), new THREE.Color("#8fb4ff")], BLUE, 0.085);
  planet.add(new THREE.Mesh(new THREE.SphereGeometry(planetRadius, lowPower ? 64 : 112, lowPower ? 48 : 84), giantMaterial));
  planet.add(atmosphere(planetRadius * 1.14, new THREE.Color("#8fb0ff"), 3.2));
  const ring = createRing(planetRadius * 1.42, planetRadius * 2.35);
  ring.rotation.set(-Math.PI / 2 + 0.34, 0.18, 0.28);
  planet.add(ring);
  const moonMaterial = planetMaterial([new THREE.Color("#3b3346"), new THREE.Color("#ffefe3"), new THREE.Color("#ffdf82")], PINK, 0.6);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(2.3, 40, 30), moonMaterial);
  planet.add(moon);
  scene.add(planet);

  // Star-gate the camera passes through during the work section.
  const gate = createParticleRing(lowPower ? 900 : 2200, 26, 10, rand, [YELLOW, CREAM, PINK, BLUE]);
  gate.position.set(0, 0, JOURNEY.gate);
  scene.add(gate);

  // Network planet beside the stack section: infrastructure as a globe.
  const network = createNetworkPlanet(15);
  scene.add(network.group);

  // Wormhole at the end of the journey, framing the contact section.
  const portal = createPortal();
  portal.group.position.set(14, 4, JOURNEY.portal);
  scene.add(portal.group);
  const portalRing = createParticleRing(lowPower ? 500 : 1300, 34, 16, rand, [PINK, BLUE, CREAM]);
  portalRing.position.copy(portal.group.position);
  scene.add(portalRing);

  // Every point cloud shares the star shader; keep their uniforms in step.
  const pointMaterials = [starMaterial, gate.material, portalRing.material, network.nodeMaterial] as THREE.ShaderMaterial[];
  pointMaterials.forEach((material) => { material.uniforms.uPixelRatio.value = pixelRatio; });

  let anchors: SceneAnchor[] = [{ scroll: 0, z: 0 }, { scroll: 1, z: JOURNEY.end }];
  let mode: "home" | "work" = "home";
  let scrollY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let smoothX = 0;
  let smoothY = 0;
  let cameraZ = 0;
  let velocity = 0;
  let width = 1;
  let height = 1;
  let frame = 0;
  let running = false;
  const clock = new THREE.Clock();

  const layout = () => {
    const narrow = width < 900;
    // Keep the planet clear of the headline on wide screens, behind it on phones.
    // The work index is for reading, so it flies through open space instead.
    planet.visible = mode === "home";
    planet.position.set(narrow ? 11 : 31, narrow ? 15 : -2, narrow ? JOURNEY.planet - 30 : JOURNEY.planet);
    network.group.position.set(narrow ? 0 : -24, narrow ? 8 : 3, JOURNEY.network);
    camera.fov = narrow ? 68 : 55;
  };

  const targetZ = () => {
    if (reducedMotion) return 0;
    if (scrollY <= anchors[0].scroll) return anchors[0].z;
    for (let index = 1; index < anchors.length; index += 1) {
      const previous = anchors[index - 1];
      const next = anchors[index];
      if (scrollY <= next.scroll) {
        const span = Math.max(next.scroll - previous.scroll, 1);
        const t = (scrollY - previous.scroll) / span;
        const eased = t * t * (3 - 2 * t);
        return previous.z + (next.z - previous.z) * (0.35 * t + 0.65 * eased);
      }
    }
    return anchors[anchors.length - 1].z;
  };

  const render = () => {
    const delta = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;
    const target = targetZ();
    const previousZ = cameraZ;
    cameraZ += (target - cameraZ) * (reducedMotion ? 1 : 1 - Math.pow(0.0009, delta));
    const frameVelocity = delta > 0 ? (cameraZ - previousZ) / delta : 0;
    velocity += (frameVelocity - velocity) * 0.12;
    const speed = Math.min(Math.abs(velocity), 400);

    smoothX += (pointerX - smoothX) * 0.05;
    smoothY += (pointerY - smoothY) * 0.05;
    camera.position.set(Math.sin(cameraZ * 0.011) * 3.2 + smoothX * 2.2, Math.cos(cameraZ * 0.008) * 1.6 - smoothY * 1.4, cameraZ);
    camera.rotation.set(-smoothY * 0.05, -smoothX * 0.075, Math.sin(cameraZ * 0.006) * 0.035);
    const fov = (width < 900 ? 68 : 55) + Math.min(speed * 0.045, 14);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    const t = reducedMotion ? 0 : time;
    pointMaterials.forEach((material) => { material.uniforms.uTime.value = t; });
    starMaterial.uniforms.uBoost.value = Math.min(speed * 0.004, 0.9);
    streakMaterial.uniforms.uStretch.value = Math.min(speed * 0.12, 42);
    streakMaterial.uniforms.uStrength.value = Math.min(Math.max(speed - 12, 0) * 0.006, 0.75);
    giantMaterial.uniforms.uTime.value = t;
    moonMaterial.uniforms.uTime.value = t;
    network.lineMaterial.uniforms.uTime.value = t;
    portal.material.uniforms.uTime.value = t;

    // Landmarks fade in as the camera approaches, so the corridor ahead stays clean.
    const approach = (targetZ: number, far: number, near: number) => {
      const distance = cameraZ - targetZ;
      return Math.min(Math.max((far - distance) / (far - near), 0), 1);
    };
    const networkFade = approach(JOURNEY.network, 230, 110);
    network.lineMaterial.uniforms.uOpacity.value = networkFade;
    network.nodeMaterial.uniforms.uOpacity.value = networkFade;
    network.coreMaterial.opacity = 0.72 * networkFade;
    network.group.visible = networkFade > 0.001;
    const portalFade = approach(JOURNEY.portal, 260, 90);
    portal.material.uniforms.uOpacity.value = portalFade;
    (portalRing.material as THREE.ShaderMaterial).uniforms.uOpacity.value = portalFade;
    portal.group.visible = portalRing.visible = portalFade > 0.001;
    const gateFade = approach(JOURNEY.gate, 240, 80) * (cameraZ < JOURNEY.gate - 60 ? Math.max(1 - (JOURNEY.gate - 60 - cameraZ) / 80, 0) : 1);
    (gate.material as THREE.ShaderMaterial).uniforms.uOpacity.value = gateFade;
    gate.visible = gateFade > 0.001;

    planet.rotation.y = t * 0.035;
    moon.position.set(Math.cos(t * 0.22) * planetRadius * 2.7, Math.sin(t * 0.22) * 5, Math.sin(t * 0.22) * planetRadius * 2.7);
    gate.rotation.z = t * 0.05 + cameraZ * 0.002;
    network.group.rotation.set(t * 0.04, t * 0.09, 0);
    portalRing.rotation.z = -t * 0.12;

    renderer.render(scene, camera);
    onFrame?.({ z: cameraZ, velocity });
  };

  // Frame pacing: full rate while the user is flying, half rate when idle, and
  // resolution steps down (then back up) if frames run long on this device.
  let lastInput = performance.now();
  let skip = false;
  let sampleTime = 0;
  let sampleFrames = 0;
  const setPixelRatio = (next: number) => {
    if (Math.abs(next - pixelRatio) < 0.01) return;
    pixelRatio = next;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    pointMaterials.forEach((material) => { material.uniforms.uPixelRatio.value = pixelRatio; });
  };
  const adapt = (frameMs: number) => {
    sampleTime += frameMs;
    sampleFrames += 1;
    if (sampleFrames < 40) return;
    const average = sampleTime / sampleFrames;
    sampleTime = 0;
    sampleFrames = 0;
    if (average > 24) setPixelRatio(Math.max(0.75, pixelRatio - 0.15));
    else if (average < 15) setPixelRatio(Math.min(maxPixelRatio, pixelRatio + 0.1));
  };

  let previousFrame = performance.now();
  const loop = (now: number) => {
    frame = running ? window.requestAnimationFrame(loop) : 0;
    const idle = now - lastInput > 2500;
    skip = idle ? !skip : false;
    if (skip) return;
    adapt(now - previousFrame);
    previousFrame = now;
    render();
  };

  return {
    resize(nextWidth: number, nextHeight: number) {
      width = Math.max(nextWidth, 1);
      height = Math.max(nextHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      layout();
      camera.updateProjectionMatrix();
      if (!running) render();
    },
    setMode(next: "home" | "work") {
      mode = next;
      layout();
      if (!running) render();
    },
    setAnchors(next: SceneAnchor[]) {
      if (next.length >= 2) anchors = next;
      if (!running) render();
    },
    setScroll(value: number) {
      scrollY = value;
      lastInput = performance.now();
      if (!running) render();
    },
    setPointer(x: number, y: number) {
      pointerX = x;
      pointerY = y;
      lastInput = performance.now();
    },
    start() {
      if (running || reducedMotion) {
        render();
        return;
      }
      running = true;
      clock.getDelta();
      previousFrame = performance.now();
      frame = window.requestAnimationFrame(loop);
    },
    stop() {
      running = false;
      window.cancelAnimationFrame(frame);
    },
    dispose() {
      running = false;
      window.cancelAnimationFrame(frame);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
      renderer.dispose();
    },
  };
}

export type SpaceScene = ReturnType<typeof createSpaceScene>;
