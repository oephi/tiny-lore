interface Constellation {
  id: string;
  name: string;
  subtitle: string;
  stars: { x: number; y: number }[];
  lines: { from: number; to: number }[];
  center: { x: number; y: number };
  color: string;
}

const constellations: Constellation[] = JSON.parse(
  document.getElementById('constellation-data')!.textContent!
);

// ── Constants ──
const WORLD_SIZE = 4000;
const BG_STAR_COUNT = 3000;
const STAR_RADIUS = 2.2;
const LINE_ALPHA_DIM = 0.08;
const LINE_ALPHA_BRIGHT = 0.55;
const STAR_ALPHA_DIM = 0.2;
const STAR_ALPHA_BRIGHT = 0.9;
const HOVER_RADIUS = 120;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 3;
const REVEAL_SPEED = 0.06;

// ── State ──
const canvas = document.getElementById('sky-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const label = document.getElementById('constellation-label')!;
const labelName = label.querySelector('.label-name') as HTMLElement;
const labelSub = label.querySelector('.label-subtitle') as HTMLElement;
const hint = document.getElementById('hint')!;

let camera = { x: 0, y: 0, zoom: 0.45 };
let targetCamera = { x: 0, y: 0, zoom: 0.45 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let cameraStart = { x: 0, y: 0 };
let mouseScreen = { x: -9999, y: -9999 };
let hoveredConstellation: Constellation | null = null;
let interacted = false;
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
let transitioning = false;
let transitionTarget: Constellation | null = null;
let transitionProgress = 0;
let transitionFade = 0; // 0-1, how much non-target elements have faded
let fadeOverlay: HTMLDivElement | null = null;

// Per-constellation reveal progress (0 = dim, 1 = bright)
const revealProgress: Record<string, number> = {};
for (const c of constellations) revealProgress[c.id] = 0;

// ── Background stars (fixed in world space) ──
interface BgStar {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const bgStars: BgStar[] = [];
for (let i = 0; i < BG_STAR_COUNT; i++) {
  bgStars.push({
    x: (Math.random() - 0.5) * WORLD_SIZE,
    y: (Math.random() - 0.5) * WORLD_SIZE,
    r: Math.random() * 1.6 + 0.3,
    baseAlpha: Math.random() * 0.6 + 0.1,
    twinkleSpeed: Math.random() * 0.4 + 0.1,
    twinklePhase: Math.random() * Math.PI * 2,
  });
}

// ── Coordinate transforms ──
function worldToScreen(wx: number, wy: number): [number, number] {
  const sx = (wx - camera.x) * camera.zoom + canvas.width / devicePixelRatio / 2;
  const sy = (wy - camera.y) * camera.zoom + canvas.height / devicePixelRatio / 2;
  return [sx, sy];
}

function screenToWorld(sx: number, sy: number): [number, number] {
  const wx = (sx - canvas.width / devicePixelRatio / 2) / camera.zoom + camera.x;
  const wy = (sy - canvas.height / devicePixelRatio / 2) / camera.zoom + camera.y;
  return [wx, wy];
}

// ── Resize ──
function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener('resize', resize);
resize();

// ── Input: Drag ──
canvas.addEventListener('pointerdown', (e) => {
  isDragging = true;
  dragStart = { x: e.clientX, y: e.clientY };
  cameraStart = { x: targetCamera.x, y: targetCamera.y };
  canvas.setPointerCapture(e.pointerId);
  if (!interacted) {
    interacted = true;
    hint.style.opacity = '0';
  }
});

canvas.addEventListener('pointermove', (e) => {
  mouseScreen = { x: e.clientX, y: e.clientY };
  if (isDragging) {
    const dx = (e.clientX - dragStart.x) / camera.zoom;
    const dy = (e.clientY - dragStart.y) / camera.zoom;
    targetCamera.x = cameraStart.x - dx;
    targetCamera.y = cameraStart.y - dy;
  }
});

canvas.addEventListener('pointerup', (e) => {
  if (isDragging && !transitioning) {
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 5) {
      // Update mouseScreen so getHoveredConstellation works on touch (no pointermove on tap)
      mouseScreen = { x: e.clientX, y: e.clientY };
      const hovered = getHoveredConstellation();
      if (hovered) {
        startTransition(hovered);
      }
    }
  }
  isDragging = false;
});
canvas.addEventListener('pointerleave', () => {
  mouseScreen = { x: -9999, y: -9999 };
});

// ── Input: Zoom ──
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const factor = e.deltaY > 0 ? 0.985 : 1.015;
  targetCamera.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, targetCamera.zoom * factor));

  // Zoom toward mouse position
  const [wx, wy] = screenToWorld(e.clientX, e.clientY);
  targetCamera.x += (wx - targetCamera.x) * (1 - 1 / factor) * 0.3;
  targetCamera.y += (wy - targetCamera.y) * (1 - 1 / factor) * 0.3;

  if (!interacted) {
    interacted = true;
    hint.style.opacity = '0';
  }
}, { passive: false });

// ── Touch pinch zoom ──
let lastPinchDist = 0;
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    lastPinchDist = Math.sqrt(dx * dx + dy * dy);
  }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (lastPinchDist > 0) {
      const factor = dist / lastPinchDist;
      targetCamera.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, targetCamera.zoom * factor));
    }
    lastPinchDist = dist;
  }
}, { passive: false });

canvas.addEventListener('touchend', () => { lastPinchDist = 0; }, { passive: true });

// ── Hover detection ──
function getHoveredConstellation(): Constellation | null {
  const [mx, my] = screenToWorld(mouseScreen.x, mouseScreen.y);
  let closest: Constellation | null = null;
  let closestDist = Infinity;

  for (const c of constellations) {
    const dx = mx - c.center.x;
    const dy = my - c.center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const threshold = HOVER_RADIUS / camera.zoom;
    if (dist < threshold && dist < closestDist) {
      closest = c;
      closestDist = dist;
    }
  }
  return closest;
}

// ── Helpers ──
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── Drawing ──
let time = 0;

function drawBgStars() {
  const w = canvas.width / devicePixelRatio;
  const h = canvas.height / devicePixelRatio;
  const margin = 50;

  for (const s of bgStars) {
    const [sx, sy] = worldToScreen(s.x, s.y);
    if (sx < -margin || sx > w + margin || sy < -margin || sy > h + margin) continue;

    const twinkle = 0.4 + 0.6 * Math.sin(time * s.twinkleSpeed + s.twinklePhase);
    const alpha = s.baseAlpha * twinkle * (1 - transitionFade);
    ctx.beginPath();
    ctx.arc(sx, sy, s.r * Math.min(camera.zoom, 1.2), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 230, 255, ${alpha})`;
    ctx.fill();
  }
}

function drawConstellation(c: Constellation) {
  // During transition, fade out non-target constellations
  const isTarget = transitionTarget?.id === c.id;
  const dimFactor = transitioning && !isTarget ? (1 - transitionFade) : 1;
  if (dimFactor < 0.01) return; // skip fully faded constellations

  const progress = revealProgress[c.id];
  const lineAlpha = (LINE_ALPHA_DIM + (LINE_ALPHA_BRIGHT - LINE_ALPHA_DIM) * progress) * dimFactor;
  const starAlpha = (STAR_ALPHA_DIM + (STAR_ALPHA_BRIGHT - STAR_ALPHA_DIM) * progress) * dimFactor;
  const glowAmount = progress * dimFactor;

  const screenStars: [number, number][] = c.stars.map((s) =>
    worldToScreen(c.center.x + s.x, c.center.y + s.y)
  );

  // Glow behind constellation — centered on star centroid, sized to contain all stars
  if (glowAmount > 0.05) {
    // Compute centroid of stars in world space
    let avgX = 0, avgY = 0;
    for (const s of c.stars) { avgX += s.x; avgY += s.y; }
    avgX = c.center.x + avgX / c.stars.length;
    avgY = c.center.y + avgY / c.stars.length;

    // Compute max distance from centroid to any star
    let maxDist = 0;
    for (const s of c.stars) {
      const dx = (c.center.x + s.x) - avgX;
      const dy = (c.center.y + s.y) - avgY;
      maxDist = Math.max(maxDist, Math.sqrt(dx * dx + dy * dy));
    }

    const [cx, cy] = worldToScreen(avgX, avgY);
    const glowRadius = (maxDist + 60) * camera.zoom * glowAmount;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
    gradient.addColorStop(0, hexToRgba(c.color, 0.15 * glowAmount));
    gradient.addColorStop(0.5, hexToRgba(c.color, 0.06 * glowAmount));
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(cx - glowRadius, cy - glowRadius, glowRadius * 2, glowRadius * 2);
  }

  // Lines
  ctx.strokeStyle = hexToRgba(c.color, lineAlpha);
  ctx.lineWidth = 1 + progress * 0.5;
  ctx.lineCap = 'round';

  for (const line of c.lines) {
    if (line.from >= screenStars.length || line.to >= screenStars.length) continue;
    const [x1, y1] = screenStars[line.from];
    const [x2, y2] = screenStars[line.to];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Stars
  for (const [sx, sy] of screenStars) {
    const r = STAR_RADIUS * Math.min(camera.zoom + 0.3, 1.5);

    // Star glow
    if (glowAmount > 0.1) {
      const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4);
      gradient.addColorStop(0, hexToRgba(c.color, 0.4 * glowAmount));
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(sx - r * 4, sy - r * 4, r * 8, r * 8);
    }

    // Star dot
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
    ctx.fill();
  }

  // Filled shape on reveal
  if (progress > 0.1) {
    drawConstellationFill(c, screenStars, progress);
  }
}

function convexHull(points: [number, number][]): [number, number][] {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length <= 2) return pts;

  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

  const lower: [number, number][] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }

  const upper: [number, number][] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pts[i]) <= 0)
      upper.pop();
    upper.push(pts[i]);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function drawConstellationFill(c: Constellation, screenStars: [number, number][], progress: number) {
  if (screenStars.length < 3) return;
  ctx.save();

  const hull = convexHull(screenStars);

  // Compute centroid of hull
  let cx = 0, cy = 0;
  for (const [sx, sy] of hull) { cx += sx; cy += sy; }
  cx /= hull.length;
  cy /= hull.length;

  // Max distance from centroid to any star
  let maxDist = 0;
  for (const [sx, sy] of screenStars) {
    const dist = Math.sqrt((sx - cx) ** 2 + (sy - cy) ** 2);
    maxDist = Math.max(maxDist, dist);
  }

  ctx.beginPath();
  ctx.moveTo(hull[0][0], hull[0][1]);
  for (let i = 1; i < hull.length; i++) {
    ctx.lineTo(hull[i][0], hull[i][1]);
  }
  ctx.closePath();

  const gradRadius = maxDist + 30 * camera.zoom;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, gradRadius);
  gradient.addColorStop(0, hexToRgba(c.color, 0.2 * progress));
  gradient.addColorStop(0.6, hexToRgba(c.color, 0.08 * progress));
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawNebulae() {
  const nebulae = [
    { x: -400, y: -300, r: 500, color: [30, 60, 90] as const },
    { x: 600, y: 200, r: 400, color: [50, 30, 70] as const },
    { x: -200, y: 500, r: 350, color: [20, 50, 60] as const },
    { x: 800, y: -500, r: 300, color: [70, 50, 20] as const },
  ];

  for (const n of nebulae) {
    const [sx, sy] = worldToScreen(n.x, n.y);
    const r = n.r * camera.zoom;
    const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
    const nebAlpha = 1 - transitionFade;
    gradient.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${0.06 * nebAlpha})`);
    gradient.addColorStop(0.5, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${0.02 * nebAlpha})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
  }
}

function getMobileClosest(): Constellation | null {
  const w = canvas.width / devicePixelRatio;
  const h = canvas.height / devicePixelRatio;
  const radius = Math.min(w, h) * 0.35;
  let closest: Constellation | null = null;
  let closestDist = Infinity;

  for (const c of constellations) {
    const [sx, sy] = worldToScreen(c.center.x, c.center.y);
    const dx = sx - w / 2;
    const dy = sy - h / 2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius && dist < closestDist) {
      closest = c;
      closestDist = dist;
    }
  }
  return closest;
}

function updateLabel() {
  const active = isMobile ? getMobileClosest() : hoveredConstellation;
  if (active) {
    const [sx, sy] = worldToScreen(
      active.center.x,
      active.center.y - 120
    );
    label.style.left = sx + 'px';
    label.style.top = sy + 'px';
    labelName.textContent = active.name;
    labelSub.textContent = active.subtitle;
    label.classList.remove('hidden');
  } else {
    label.classList.add('hidden');
  }
}

// ── Transition ──
// Continuous accelerating zoom through the constellation.
// Stars fade, color washes in, story page emerges from the "distance".

let navigated = false;

function startTransition(c: Constellation) {
  transitioning = true;
  transitionTarget = c;
  transitionProgress = 0;
  transitionFade = 0;
  navigated = false;

  label.classList.add('hidden');
  hint.style.opacity = '0';
  canvas.style.cursor = 'default';
  const brand = document.getElementById('brand');
  if (brand) brand.style.opacity = '0';

  fadeOverlay = document.createElement('div');
  fadeOverlay.style.cssText = `
    position: fixed; inset: 0; z-index: 100;
    pointer-events: none; opacity: 0;
    background: radial-gradient(circle at 50% 50%, ${c.color}40, #072e2c);
    transition: none;
  `;
  document.body.appendChild(fadeOverlay);

  // Eagerly fetch the story page so it's cached when we navigate
  fetch(`/constellations/${c.id}`).catch(() => {});

  targetCamera.x = c.center.x;
  targetCamera.y = c.center.y;
}

function updateTransition() {
  if (!transitioning || !transitionTarget || !fadeOverlay) return;

  // Accelerating progress — starts slow, speeds up
  transitionProgress += 0.003 + transitionProgress * 0.008;
  transitionProgress = Math.min(transitionProgress, 1);

  revealProgress[transitionTarget.id] = 1;

  // Continuously accelerating zoom — never stops
  const zoomEase = Math.pow(transitionProgress, 2.2);
  const targetZoom = 0.45 + zoomEase * 30;
  camera.zoom += (targetZoom - camera.zoom) * 0.04;

  // Pan to center — fast approach that locks on
  const panSpeed = 0.02 + transitionProgress * 0.08;
  camera.x += (targetCamera.x - camera.x) * panSpeed;
  camera.y += (targetCamera.y - camera.y) * panSpeed;

  // Fade out everything else (stars, nebulae, other constellations)
  const fadeCurve = Math.min(1, transitionProgress * 2.5);
  transitionFade = 1 - Math.pow(1 - fadeCurve, 2);

  for (const c of constellations) {
    if (c.id !== transitionTarget.id) {
      revealProgress[c.id] *= 0.92;
    }
  }

  // Color wash overlay fades in during the second half
  const overlayStart = 0.4;
  if (transitionProgress > overlayStart) {
    const p = (transitionProgress - overlayStart) / (1 - overlayStart);
    const overlayAlpha = Math.pow(p, 1.5);
    fadeOverlay.style.opacity = String(overlayAlpha);
  }

  // Navigate once overlay is opaque enough to hide the page swap
  if (transitionProgress > 0.7 && !navigated) {
    navigated = true;
    window.location.href = `/constellations/${transitionTarget.id}`;
  }
}

// ── Main loop ──
function frame() {
  time += 0.012;

  if (transitioning) {
    updateTransition();
  } else {
    // Smooth camera
    camera.x += (targetCamera.x - camera.x) * 0.12;
    camera.y += (targetCamera.y - camera.y) * 0.12;
    camera.zoom += (targetCamera.zoom - camera.zoom) * 0.12;

    // Hover detection
    hoveredConstellation = isDragging ? null : getHoveredConstellation();
    canvas.style.cursor = hoveredConstellation ? 'pointer' : isDragging ? 'grabbing' : 'grab';

    // Update reveal progress
    for (const c of constellations) {
      let target: number;
      if (isMobile) {
        // On mobile, reveal constellations near the center of the screen
        const [sx, sy] = worldToScreen(c.center.x, c.center.y);
        const w = canvas.width / devicePixelRatio;
        const h = canvas.height / devicePixelRatio;
        const dx = sx - w / 2;
        const dy = sy - h / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = Math.min(w, h) * 0.35;
        target = dist < radius ? Math.max(0.15, 1 - dist / radius) : 0;
      } else {
        target = hoveredConstellation?.id === c.id ? 1 : 0;
      }
      revealProgress[c.id] += (target - revealProgress[c.id]) * REVEAL_SPEED;
    }
  }

  // Clear
  const w = canvas.width / devicePixelRatio;
  const h = canvas.height / devicePixelRatio;
  ctx.clearRect(0, 0, w, h);

  // Draw layers
  drawNebulae();
  drawBgStars();
  for (const c of constellations) {
    drawConstellation(c);
  }
  if (!transitioning) updateLabel();

  requestAnimationFrame(frame);
}

frame();
