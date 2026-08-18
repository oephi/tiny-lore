import { hexToRgba, setupHiDpiCanvas, WORLD_SIZE, type Constellation } from './shared';

// Load constellation data from the embedded JSON element
const constellations: Constellation[] = JSON.parse(
  document.getElementById('constellation-data')!.textContent!
);

// ── Constants ──
const BG_STAR_COUNT = 3000;       // Number of decorative background stars
const STAR_RADIUS = 2.2;          // Base radius of constellation star dots
const LINE_ALPHA_DIM = 0.08;      // Line opacity when not highlighted
const LINE_ALPHA_BRIGHT = 0.55;   // Line opacity when fully highlighted
const STAR_ALPHA_DIM = 0.2;       // Star opacity when not highlighted
const STAR_ALPHA_BRIGHT = 0.9;    // Star opacity when fully highlighted
const HOVER_RADIUS = 120;         // Screen-pixel radius for hover/tap detection
const ZOOM_MIN = 0.25;            // Minimum zoom level
const ZOOM_MAX = 3;               // Maximum zoom level
const REVEAL_SPEED = 0.06;        // Lerp speed for constellation reveal animations

// ── State ──
const canvas = document.getElementById('sky-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const label = document.getElementById('constellation-label')!;
const labelName = label.querySelector('.label-name') as HTMLElement;
const labelSub = label.querySelector('.label-subtitle') as HTMLElement;
const hint = document.getElementById('hint')!;

let camera = { x: 0, y: 0, zoom: 0.45 };          // Current camera position and zoom
let targetCamera = { x: 0, y: 0, zoom: 0.45 };    // Target camera (smoothly interpolated toward)
let isDragging = false;
let dragStart = { x: 0, y: 0 };                    // Screen position where drag started
let cameraStart = { x: 0, y: 0 };                  // Camera position when drag started
let mouseScreen = { x: -9999, y: -9999 };           // Current mouse/touch screen position
let hoveredConstellation: Constellation | null = null;   // Desktop: constellation under cursor
let selectedConstellation: Constellation | null = null;  // Touch: tapped constellation (first tap)
let interacted = false;                              // True after first user interaction

// Touch device detection: true when no fine pointer (mouse/trackpad) is available
const isMobile = !window.matchMedia('(pointer: fine)').matches;

// Intro overlay: only shown on first visit per browser session
const hasVisited = sessionStorage.getItem('tiny-lore-visited');
let introActive = !hasVisited;
if (!hasVisited) sessionStorage.setItem('tiny-lore-visited', '1');
let introTimer = 0;
const INTRO_GLOW_DURATION = 3.5;

// Transition state: used when zooming into a constellation to open its story page
let transitioning = false;
let transitionTarget: Constellation | null = null;
let transitionProgress = 0;
let transitionFade = 0;       // 0–1: how much non-target elements have faded out
let fadeOverlay: HTMLDivElement | null = null;

// Hide the intro overlay element immediately if already visited
if (!introActive) {
  const overlay = document.getElementById('intro-overlay');
  if (overlay) overlay.style.display = 'none';
}

// Per-constellation reveal progress (0 = dim, 1 = fully bright/highlighted)
const revealProgress: Record<string, number> = {};
for (const c of constellations) revealProgress[c.id] = 0;

// ── Background Stars ──
// Decorative twinkling stars scattered across the world space
interface BgStar {
  x: number;          // World-space X
  y: number;          // World-space Y
  r: number;          // Radius
  baseAlpha: number;  // Base opacity (before twinkle)
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

// ── Coordinate Transforms ──

// Convert world-space coordinates to screen-space pixel position
function worldToScreen(wx: number, wy: number): [number, number] {
  const sx = (wx - camera.x) * camera.zoom + canvas.width / devicePixelRatio / 2;
  const sy = (wy - camera.y) * camera.zoom + canvas.height / devicePixelRatio / 2;
  return [sx, sy];
}

// Convert screen-space pixel position to world-space coordinates
function screenToWorld(sx: number, sy: number): [number, number] {
  const wx = (sx - canvas.width / devicePixelRatio / 2) / camera.zoom + camera.x;
  const wy = (sy - canvas.height / devicePixelRatio / 2) / camera.zoom + camera.y;
  return [wx, wy];
}

// ── Canvas Resize ──
// Re-scale canvas to fill viewport at correct DPI
function resize() {
  setupHiDpiCanvas(canvas, ctx);
}
window.addEventListener('resize', resize);
resize();

// ── Input: Drag ──
// Start dragging to pan the camera. Captures pointer for smooth tracking.
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

// Track mouse/touch position and update camera target while dragging
canvas.addEventListener('pointermove', (e) => {
  mouseScreen = { x: e.clientX, y: e.clientY };
  if (isDragging) {
    const dx = (e.clientX - dragStart.x) / camera.zoom;
    const dy = (e.clientY - dragStart.y) / camera.zoom;
    targetCamera.x = cameraStart.x - dx;
    targetCamera.y = cameraStart.y - dy;
  }
});

// Handle click/tap on pointer up.
// Desktop: single click on a constellation opens it.
// Touch: first tap selects (highlights + label), second tap on same opens it.
canvas.addEventListener('pointerup', (e) => {
  if (isDragging && !transitioning) {
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 5) {
      // Small movement = click/tap (not a drag)
      mouseScreen = { x: e.clientX, y: e.clientY };
      const tapped = getHoveredConstellation();
      if (isMobile) {
        if (tapped && selectedConstellation?.id === tapped.id) {
          startTransition(tapped);
        } else {
          selectedConstellation = tapped;
        }
      } else {
        if (tapped) startTransition(tapped);
      }
    } else if (isMobile) {
      // Drag on touch deselects the current constellation
      selectedConstellation = null;
    }
  }
  isDragging = false;
});

// Reset mouse position when pointer leaves the canvas (desktop)
canvas.addEventListener('pointerleave', () => {
  mouseScreen = { x: -9999, y: -9999 };
});

// ── Input: Mouse Wheel Zoom ──
// Zoom toward cursor position on scroll
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const factor = e.deltaY > 0 ? 0.985 : 1.015;
  targetCamera.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, targetCamera.zoom * factor));

  // Shift camera toward mouse so zoom feels anchored to cursor
  const [wx, wy] = screenToWorld(e.clientX, e.clientY);
  targetCamera.x += (wx - targetCamera.x) * (1 - 1 / factor) * 0.3;
  targetCamera.y += (wy - targetCamera.y) * (1 - 1 / factor) * 0.3;

  if (!interacted) {
    interacted = true;
    hint.style.opacity = '0';
  }
}, { passive: false });

// ── Input: Touch Pinch Zoom ──
// Two-finger pinch to zoom on touch devices. preventDefault stops browser zoom/refresh.
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

// ── Hover Detection ──
// Find the constellation closest to the current mouse/touch position (in world space).
// Uses HOVER_RADIUS scaled by zoom level as the detection threshold.
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

// ── Drawing ──
let time = 0;

// Draw decorative background stars with twinkling animation.
// Culls stars outside the viewport for performance. Fades out during transitions.
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

// Draw a single constellation: glow, lines, stars, and fill polygon.
// Brightness is controlled by revealProgress. During transitions, non-target constellations fade out.
function drawConstellation(c: Constellation) {
  const isTarget = transitionTarget?.id === c.id;
  const dimFactor = transitioning && !isTarget ? (1 - transitionFade) : 1;
  if (dimFactor < 0.01) return;

  const progress = revealProgress[c.id];
  const lineAlpha = (LINE_ALPHA_DIM + (LINE_ALPHA_BRIGHT - LINE_ALPHA_DIM) * progress) * dimFactor;
  const starAlpha = (STAR_ALPHA_DIM + (STAR_ALPHA_BRIGHT - STAR_ALPHA_DIM) * progress) * dimFactor;
  const glowAmount = progress * dimFactor;

  // Convert star positions from world space to screen space
  const screenStars: [number, number][] = c.stars.map((s) =>
    worldToScreen(c.center.x + s.x, c.center.y + s.y)
  );

  // Radial glow behind the constellation, centered on the star centroid
  if (glowAmount > 0.05) {
    let avgX = 0, avgY = 0;
    for (const s of c.stars) { avgX += s.x; avgY += s.y; }
    avgX = c.center.x + avgX / c.stars.length;
    avgY = c.center.y + avgY / c.stars.length;

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

  // Draw lines between connected stars
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

  // Draw star dots with individual glow halos
  for (const [sx, sy] of screenStars) {
    const r = STAR_RADIUS * Math.min(camera.zoom + 0.3, 1.5);

    if (glowAmount > 0.1) {
      const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4);
      gradient.addColorStop(0, hexToRgba(c.color, 0.4 * glowAmount));
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(sx - r * 4, sy - r * 4, r * 8, r * 8);
    }

    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
    ctx.fill();
  }

  // Draw a filled convex hull shape behind the constellation on reveal
  if (progress > 0.1) {
    drawConstellationFill(c, screenStars, progress);
  }
}

// Compute the convex hull of a set of 2D points using Andrew's monotone chain algorithm.
// Returns the hull vertices in counter-clockwise order.
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

// Draw a subtle gradient fill inside the convex hull of the constellation's stars.
// Creates the "glowing shape" effect when a constellation is highlighted.
function drawConstellationFill(c: Constellation, screenStars: [number, number][], progress: number) {
  if (screenStars.length < 3) return;
  ctx.save();

  const hull = convexHull(screenStars);

  let cx = 0, cy = 0;
  for (const [sx, sy] of hull) { cx += sx; cy += sy; }
  cx /= hull.length;
  cy /= hull.length;

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

// Draw decorative nebula clouds at fixed world positions.
// These are subtle colored radial gradients that add depth to the sky.
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

// Find the constellation closest to the center of the screen (used for touch proximity glow).
// Only considers constellations within 35% of the smaller screen dimension.
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

// Position and show/hide the floating constellation name label.
// Desktop: follows the hovered constellation. Touch: follows the tapped (selected) constellation.
function updateLabel() {
  const active = isMobile ? selectedConstellation : hoveredConstellation;
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

// Reset transition state when user navigates back (bfcache restore)
window.addEventListener('pageshow', (e) => {
  if (e.persisted || navigated) {
    transitioning = false;
    transitionTarget = null;
    transitionProgress = 0;
    transitionFade = 0;
    navigated = false;
    if (fadeOverlay) {
      fadeOverlay.remove();
      fadeOverlay = null;
    }
    canvas.style.cursor = 'grab';
    label.classList.add('hidden');
    const hint = document.getElementById('hint');
    if (hint) hint.style.opacity = '1';
  }
});

// Begin the zoom-through transition to a constellation's story page.
// Creates a color wash overlay, prefetches the target page, and starts the animation.
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

  // Full-screen overlay that fades in with the constellation's color
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

// Advance the transition animation each frame.
// Uses compound acceleration (progress speeds up as it increases) for a cinematic zoom effect.
// Navigates to the story page once the overlay is opaque enough to hide the page swap.
function updateTransition() {
  if (!transitioning || !transitionTarget || !fadeOverlay) return;

  // Compound acceleration: starts slow, speeds up
  transitionProgress += 0.003 + transitionProgress * 0.008;
  transitionProgress = Math.min(transitionProgress, 1);

  // Keep the target constellation fully lit throughout
  revealProgress[transitionTarget.id] = 1;

  // Continuously accelerating zoom — never stops or plateaus
  const zoomEase = Math.pow(transitionProgress, 2.2);
  const targetZoom = 0.45 + zoomEase * 30;
  camera.zoom += (targetZoom - camera.zoom) * 0.04;

  // Pan to center on the target constellation
  const panSpeed = 0.02 + transitionProgress * 0.08;
  camera.x += (targetCamera.x - camera.x) * panSpeed;
  camera.y += (targetCamera.y - camera.y) * panSpeed;

  // Fade out background stars, nebulae, and other constellations
  const fadeCurve = Math.min(1, transitionProgress * 2.5);
  transitionFade = 1 - Math.pow(1 - fadeCurve, 2);

  for (const c of constellations) {
    if (c.id !== transitionTarget.id) {
      revealProgress[c.id] *= 0.92;
    }
  }

  // Color wash overlay fades in during the second half of the transition
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

// ── Main Loop ──
// Runs every frame via requestAnimationFrame. Handles camera smoothing, hover/reveal state,
// intro animation, and renders all visual layers in order.
function frame() {
  time += 0.012;

  if (transitioning) {
    updateTransition();
  } else {
    // Smooth camera interpolation toward target
    camera.x += (targetCamera.x - camera.x) * 0.12;
    camera.y += (targetCamera.y - camera.y) * 0.12;
    camera.zoom += (targetCamera.zoom - camera.zoom) * 0.12;

    // Desktop hover detection
    hoveredConstellation = isDragging ? null : getHoveredConstellation();
    canvas.style.cursor = hoveredConstellation ? 'pointer' : isDragging ? 'grabbing' : 'grab';

    // Intro glow: all constellations glow together on first visit, then fade out
    if (introActive) {
      introTimer += 0.012;
      const glowIn = Math.min(1, introTimer / 1.2);
      const glowOut = introTimer > 2.0 ? Math.min(1, (introTimer - 2.0) / 1.5) : 0;
      const introGlow = glowIn * (1 - glowOut) * 0.45;
      for (const c of constellations) {
        revealProgress[c.id] = introGlow;
      }
      if (introTimer > INTRO_GLOW_DURATION || interacted) {
        introActive = false;
        const overlay = document.getElementById('intro-overlay');
        if (overlay) overlay.classList.add('fading');
      }
    } else {
      // Update per-constellation reveal progress toward target brightness
      for (const c of constellations) {
        let target: number;
        if (isMobile) {
          if (selectedConstellation?.id === c.id) {
            // Tapped constellation gets full highlight
            target = 1;
          } else {
            // Proximity-based subtle glow for constellations near screen center
            const [sx, sy] = worldToScreen(c.center.x, c.center.y);
            const w = canvas.width / devicePixelRatio;
            const h = canvas.height / devicePixelRatio;
            const dx = sx - w / 2;
            const dy = sy - h / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = Math.min(w, h) * 0.35;
            target = dist < radius ? Math.max(0.15, 1 - dist / radius) : 0;
          }
        } else {
          // Desktop: only the hovered constellation lights up
          target = hoveredConstellation?.id === c.id ? 1 : 0;
        }
        revealProgress[c.id] += (target - revealProgress[c.id]) * REVEAL_SPEED;
      }
    }
  }

  // Clear and draw all layers
  const w = canvas.width / devicePixelRatio;
  const h = canvas.height / devicePixelRatio;
  ctx.clearRect(0, 0, w, h);

  drawNebulae();
  drawBgStars();
  for (const c of constellations) {
    drawConstellation(c);
  }
  if (!transitioning) updateLabel();

  requestAnimationFrame(frame);
}

frame();
