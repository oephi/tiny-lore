interface Constellation {
  id: string;
  name: string;
  subtitle: string;
  stars: [number, number][];
  lines: [number, number][];
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

let camera = { x: 0, y: 0, zoom: 0.7 };
let targetCamera = { x: 0, y: 0, zoom: 0.7 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let cameraStart = { x: 0, y: 0 };
let mouseScreen = { x: -9999, y: -9999 };
let hoveredConstellation: Constellation | null = null;
let interacted = false;
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
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    lastPinchDist = Math.sqrt(dx * dx + dy * dy);
  }
}, { passive: true });

canvas.addEventListener('touchmove', (e) => {
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
}, { passive: true });

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

  const screenStars: [number, number][] = c.stars.map(([sx, sy]) =>
    worldToScreen(c.center.x + sx, c.center.y + sy)
  );

  // Glow behind constellation
  if (glowAmount > 0.05) {
    const [cx, cy] = worldToScreen(c.center.x, c.center.y);
    const glowRadius = 140 * camera.zoom * glowAmount;
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

  for (const [a, b] of c.lines) {
    if (a >= screenStars.length || b >= screenStars.length) continue;
    const [x1, y1] = screenStars[a];
    const [x2, y2] = screenStars[b];
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

function drawConstellationFill(c: Constellation, screenStars: [number, number][], progress: number) {
  if (screenStars.length < 3) return;
  ctx.save();

  const [cx, cy] = worldToScreen(c.center.x, c.center.y);
  const sorted = [...screenStars].sort((a, b) => {
    return Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx);
  });

  ctx.beginPath();
  ctx.moveTo(sorted[0][0], sorted[0][1]);
  for (let i = 1; i < sorted.length; i++) {
    ctx.lineTo(sorted[i][0], sorted[i][1]);
  }
  ctx.closePath();

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150 * camera.zoom);
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

function updateLabel() {
  if (hoveredConstellation) {
    const [sx, sy] = worldToScreen(
      hoveredConstellation.center.x,
      hoveredConstellation.center.y - 120
    );
    label.style.left = sx + 'px';
    label.style.top = sy + 'px';
    labelName.textContent = hoveredConstellation.name;
    labelSub.textContent = hoveredConstellation.subtitle;
    label.classList.remove('hidden');
  } else {
    label.classList.add('hidden');
  }
}

// ── Transition ──
// Phase 1 (0–0.4):   Center constellation, highlight it, fade everything else
// Phase 2 (0.4–0.85): Slowly zoom into the constellation
// Phase 3 (0.85–1):   Final color wash, then navigate

function startTransition(c: Constellation) {
  transitioning = true;
  transitionTarget = c;
  transitionProgress = 0;
  transitionFade = 0;

  // Hide label, hint, and branding
  label.classList.add('hidden');
  hint.style.opacity = '0';
  canvas.style.cursor = 'default';
  const brand = document.getElementById('brand');
  if (brand) brand.style.opacity = '0';

  // Create fade overlay (used in phase 3)
  fadeOverlay = document.createElement('div');
  fadeOverlay.style.cssText = `
    position: fixed; inset: 0; z-index: 100;
    pointer-events: none; opacity: 0;
    background: radial-gradient(circle at 50% 50%, ${c.color}40, #072e2c);
    transition: none;
  `;
  document.body.appendChild(fadeOverlay);

  // Prefetch the story page so it's ready when the animation finishes
  const prefetchLink = document.createElement('link');
  prefetchLink.rel = 'prefetch';
  prefetchLink.href = `/stories/${c.id}`;
  document.head.appendChild(prefetchLink);

  // Phase 1 target: center on constellation at a comfortable zoom
  targetCamera.x = c.center.x;
  targetCamera.y = c.center.y;
  targetCamera.zoom = 1.8;
}

function updateTransition() {
  if (!transitioning || !transitionTarget || !fadeOverlay) return;

  transitionProgress += 0.005;

  // Keep the clicked constellation fully lit
  revealProgress[transitionTarget.id] = 1;

  if (transitionProgress < 0.55) {
    // Phase 1: Pan to center, fade out everything else
    const p = transitionProgress / 0.55; // 0–1 within phase
    const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic

    camera.x += (targetCamera.x - camera.x) * (0.015 + ease * 0.035);
    camera.y += (targetCamera.y - camera.y) * (0.015 + ease * 0.035);
    camera.zoom += (targetCamera.zoom - camera.zoom) * (0.015 + ease * 0.035);

    transitionFade = ease;

    // Fade other constellations out
    for (const c of constellations) {
      if (c.id !== transitionTarget.id) {
        revealProgress[c.id] *= 0.93;
      }
    }
  } else if (transitionProgress < 0.85) {
    // Phase 2: Slowly zoom deeper into the constellation
    const p = (transitionProgress - 0.55) / 0.3; // 0–1 within phase
    const ease = p * p; // ease-in quadratic — accelerating zoom

    transitionFade = 1;

    // Ramp zoom target up gradually
    targetCamera.zoom = 1.8 + ease * 8;
    camera.x += (targetCamera.x - camera.x) * 0.08;
    camera.y += (targetCamera.y - camera.y) * 0.08;
    camera.zoom += (targetCamera.zoom - camera.zoom) * 0.06;
  } else {
    // Phase 3: Color wash and navigate
    const p = Math.min(1, (transitionProgress - 0.85) / 0.15);
    const ease = p * p;

    transitionFade = 1;
    fadeOverlay.style.opacity = String(ease);

    // Keep zooming
    camera.zoom += (targetCamera.zoom - camera.zoom) * 0.06;
    camera.x += (targetCamera.x - camera.x) * 0.08;
    camera.y += (targetCamera.y - camera.y) * 0.08;

    // Navigate as soon as overlay is opaque
    if (p >= 1) {
      window.location.href = `/stories/${transitionTarget.id}`;
    }
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
      const target = hoveredConstellation?.id === c.id ? 1 : 0;
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
