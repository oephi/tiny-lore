import { hexToRgba, setupHiDpiCanvas, WORLD_SIZE, type ExistingConstellation } from './shared';

const canvas = document.getElementById('editor-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const existingData: ExistingConstellation[] = JSON.parse(
  document.getElementById('existing-data')!.textContent!
);

// State
let stars: [number, number][] = [];
let lines: [number, number][] = [];
let mode: 'star' | 'line' | 'delete' = 'star';
let lineStart: number | null = null;
let hoveredStar: number | null = null;
let history: { stars: [number, number][]; lines: [number, number][] }[] = [];
let mouseX = 0;
let mouseY = 0;

// DOM
const nameInput = document.getElementById('name') as HTMLInputElement;
const subtitleInput = document.getElementById('subtitle') as HTMLInputElement;
const colorInput = document.getElementById('color') as HTMLInputElement;
const filenameInput = document.getElementById('filename') as HTMLInputElement;
const storyInput = document.getElementById('story') as HTMLTextAreaElement;
const starCount = document.getElementById('star-count')!;
const lineCount = document.getElementById('line-count')!;
const saveFeedback = document.getElementById('save-feedback')!;
const deleteBtn = document.getElementById('btn-delete')!;
let currentLoadedId = '';

const modeStarBtn = document.getElementById('mode-star')!;
const modeLineBtn = document.getElementById('mode-line')!;
const modeDeleteBtn = document.getElementById('mode-delete')!;

// Minimap
const minimap = document.getElementById('minimap') as HTMLCanvasElement;
const minimapCtx = minimap.getContext('2d')!;
const centerCoordsEl = document.getElementById('center-coords')!;
let centerX = 0;
let centerY = 0;

// Center of canvas in pixels (origin point)
function getCenter(): [number, number] {
  return [canvas.width / devicePixelRatio / 2, canvas.height / devicePixelRatio / 2];
}

function pixelToCoord(px: number, py: number): [number, number] {
  const [cx, cy] = getCenter();
  return [Math.round(px - cx), Math.round(py - cy)];
}

function coordToPixel(x: number, y: number): [number, number] {
  const [cx, cy] = getCenter();
  return [cx + x, cy + y];
}

// Resize
function resize() {
  setupHiDpiCanvas(canvas, ctx, true);
  draw();
}
window.addEventListener('resize', resize);
resize();

// Save state for undo
function saveHistory() {
  history.push({
    stars: stars.map(s => [...s] as [number, number]),
    lines: lines.map(l => [...l] as [number, number]),
  });
  if (history.length > 50) history.shift();
}

function findStarAt(px: number, py: number): number | null {
  const threshold = 12;
  for (let i = stars.length - 1; i >= 0; i--) {
    const [sx, sy] = coordToPixel(stars[i][0], stars[i][1]);
    const dx = px - sx;
    const dy = py - sy;
    if (Math.sqrt(dx * dx + dy * dy) < threshold) return i;
  }
  return null;
}

function findLineAt(px: number, py: number): number | null {
  const threshold = 8;
  for (let i = lines.length - 1; i >= 0; i--) {
    const [a, b] = lines[i];
    if (a >= stars.length || b >= stars.length) continue;
    const [x1, y1] = coordToPixel(stars[a][0], stars[a][1]);
    const [x2, y2] = coordToPixel(stars[b][0], stars[b][1]);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) continue;
    let t = ((px - x1) * dx + (py - y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    const dist = Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
    if (dist < threshold) return i;
  }
  return null;
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  hoveredStar = findStarAt(mouseX, mouseY);

  if (mode === 'star') {
    canvas.style.cursor = 'crosshair';
  } else if (mode === 'line') {
    canvas.style.cursor = hoveredStar !== null ? 'pointer' : 'default';
  } else {
    const overStar = hoveredStar !== null;
    const overLine = !overStar && findLineAt(mouseX, mouseY) !== null;
    canvas.style.cursor = overStar || overLine ? 'pointer' : 'default';
  }

  draw();
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;

  if (mode === 'star') {
    saveHistory();
    const [x, y] = pixelToCoord(px, py);
    stars.push([x, y]);
  } else if (mode === 'line') {
    const star = findStarAt(px, py);
    if (star === null) return;
    if (lineStart === null) {
      lineStart = star;
    } else {
      if (lineStart !== star) {
        const exists = lines.some(
          ([a, b]) => (a === lineStart && b === star) || (a === star && b === lineStart)
        );
        if (!exists) {
          saveHistory();
          lines.push([lineStart, star]);
        }
      }
      lineStart = null;
    }
  } else if (mode === 'delete') {
    const star = findStarAt(px, py);
    if (star !== null) {
      saveHistory();
      lines = lines.filter(([a, b]) => a !== star && b !== star);
      lines = lines.map(([a, b]) => [
        a > star ? a - 1 : a,
        b > star ? b - 1 : b,
      ] as [number, number]);
      stars.splice(star, 1);
    } else {
      const line = findLineAt(px, py);
      if (line !== null) {
        saveHistory();
        lines.splice(line, 1);
      }
    }
  }

  updateCounts();
  draw();
});

// Tool switching
function setMode(m: 'star' | 'line' | 'delete') {
  mode = m;
  lineStart = null;
  modeStarBtn.classList.toggle('active', m === 'star');
  modeLineBtn.classList.toggle('active', m === 'line');
  modeDeleteBtn.classList.toggle('active', m === 'delete');
}

modeStarBtn.addEventListener('click', () => setMode('star'));
modeLineBtn.addEventListener('click', () => setMode('line'));
modeDeleteBtn.addEventListener('click', () => setMode('delete'));

// Undo
document.getElementById('btn-undo')!.addEventListener('click', () => {
  const prev = history.pop();
  if (prev) {
    stars = prev.stars;
    lines = prev.lines;
    lineStart = null;
    updateCounts();
    draw();
  }
});

// Clear
document.getElementById('btn-clear')!.addEventListener('click', () => {
  saveHistory();
  stars = [];
  lines = [];
  lineStart = null;
  updateCounts();
  draw();
});

// Save
function showFeedback(message: string, isError = false) {
  saveFeedback.textContent = message;
  saveFeedback.classList.toggle('error', isError);
  saveFeedback.classList.remove('hidden');
  setTimeout(() => saveFeedback.classList.add('hidden'), 3000);
}

document.getElementById('btn-save')!.addEventListener('click', async () => {
  const name = nameInput.value;
  const filename = filenameInput.value;

  if (!name || !filename) {
    showFeedback('Name and filename are required.', true);
    return;
  }

  const payload = {
    filename,
    name,
    subtitle: subtitleInput.value,
    color: colorInput.value,
    center: { x: centerX, y: centerY },
    stars: stars.map(([x, y]) => ({ x, y })),
    lines: lines.map(([a, b]) => ({ from: a, to: b })),
    story: storyInput.value,
  };

  try {
    const res = await fetch('/api/save-constellation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (res.ok) {
      showFeedback(result.rebuilt
        ? `Saved ${result.slug}.md — site will rebuild shortly.`
        : `Saved ${result.slug}.md`);
    } else {
      showFeedback(result.error || 'Save failed.', true);
    }
  } catch (err) {
    showFeedback('Network error.', true);
  }
});

// Copy Markdown
document.getElementById('btn-export')!.addEventListener('click', () => {
  const name = nameInput.value || 'Unnamed';
  const subtitle = subtitleInput.value || 'A new constellation';
  const color = colorInput.value;
  const story = storyInput.value || 'Write your story here.';

  const starsStr = stars.map(([x, y]) => `  - x: ${x}\n    y: ${y}`).join('\n');
  const linesStr = lines.map(([a, b]) => `  - from: ${a}\n    to: ${b}`).join('\n');

  const md = `---
name: ${name}
subtitle: ${subtitle}
color: "${color}"
center:
  x: ${centerX}
  y: ${centerY}
${stars.length ? `stars:\n${starsStr}` : 'stars: []'}
${lines.length ? `lines:\n${linesStr}` : 'lines: []'}
---

${story}
`;

  navigator.clipboard.writeText(md).then(() => {
    showFeedback('Copied to clipboard!');
  });
});

// Delete
deleteBtn.addEventListener('click', async () => {
  if (!currentLoadedId) return;
  if (!confirm(`Delete "${nameInput.value || currentLoadedId}"? This cannot be undone.`)) return;

  try {
    const res = await fetch('/api/delete-constellation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: currentLoadedId }),
    });
    const result = await res.json();
    if (res.ok) {
      showFeedback(`Deleted ${result.slug}.md`);
      // Reset to new constellation state
      loadConstellation('');
      // Remove the load button for deleted constellation
      document.querySelector(`.load-btn[data-id="${currentLoadedId}"]`)?.remove();
    } else {
      showFeedback(result.error || 'Delete failed.', true);
    }
  } catch (err) {
    showFeedback('Network error.', true);
  }
});

function updateCounts() {
  starCount.textContent = `Stars: ${stars.length}`;
  lineCount.textContent = `Lines: ${lines.length}`;
  drawMinimap();
}

// Load existing constellation
function loadConstellation(id: string) {
  currentLoadedId = id;
  deleteBtn.classList.toggle('hidden', !id);

  const c = existingData.find((e) => e.id === id);
  if (!c) {
    stars = [];
    lines = [];
    nameInput.value = '';
    subtitleInput.value = '';
    colorInput.value = '#c9a84c';
    filenameInput.value = '';
    storyInput.value = '';
    centerX = 0;
    centerY = 0;
    history = [];
    lineStart = null;
    updateCounts();
    draw();
    drawMinimap();
    return;
  }

  stars = c.stars.map((s) => [s.x, s.y] as [number, number]);
  lines = c.lines.map((l) => [l.from, l.to] as [number, number]);
  nameInput.value = c.name;
  subtitleInput.value = c.subtitle;
  colorInput.value = c.color;
  filenameInput.value = c.id;
  storyInput.value = c.body.trim();
  centerX = c.center.x;
  centerY = c.center.y;
  history = [];
  lineStart = null;
  updateCounts();
  draw();
  drawMinimap();
}

// Load buttons
document.querySelectorAll<HTMLButtonElement>('.load-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.load-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    loadConstellation(btn.dataset.id || '');
  });
});

// Redraw when color changes
colorInput.addEventListener('input', () => { draw(); drawMinimap(); });

// Drawing
function draw() {
  const w = canvas.width / devicePixelRatio;
  const h = canvas.height / devicePixelRatio;
  const color = colorInput.value;

  ctx.clearRect(0, 0, w, h);

  // Grid crosshair at center
  const [cx, cy] = getCenter();
  ctx.strokeStyle = 'rgba(245, 239, 224, 0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, h);
  ctx.moveTo(0, cy);
  ctx.lineTo(w, cy);
  ctx.stroke();

  // Grid dots
  const gridSize = 20;
  ctx.fillStyle = 'rgba(245, 239, 224, 0.03)';
  for (let x = cx % gridSize; x < w; x += gridSize) {
    for (let y = cy % gridSize; y < h; y += gridSize) {
      ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
    }
  }

  // Lines
  for (let i = 0; i < lines.length; i++) {
    const [a, b] = lines[i];
    if (a >= stars.length || b >= stars.length) continue;
    const [x1, y1] = coordToPixel(stars[a][0], stars[a][1]);
    const [x2, y2] = coordToPixel(stars[b][0], stars[b][1]);
    ctx.strokeStyle = hexToRgba(color, 0.5);
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Pending line
  if (mode === 'line' && lineStart !== null) {
    const [x1, y1] = coordToPixel(stars[lineStart][0], stars[lineStart][1]);
    ctx.strokeStyle = hexToRgba(color, 0.3);
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Stars
  for (let i = 0; i < stars.length; i++) {
    const [px, py] = coordToPixel(stars[i][0], stars[i][1]);
    const isHovered = hoveredStar === i;
    const isLineStart = lineStart === i;
    const r = isHovered || isLineStart ? 5 : 3;

    if (isHovered || isLineStart) {
      const grad = ctx.createRadialGradient(px, py, 0, px, py, 15);
      grad.addColorStop(0, hexToRgba(color, 0.4));
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(px - 15, py - 15, 30, 30);
    }

    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = isHovered || isLineStart ? '#ffffff' : hexToRgba(color, 0.9);
    ctx.fill();

    ctx.fillStyle = 'rgba(245, 239, 224, 0.35)';
    ctx.font = '10px Lato, sans-serif';
    ctx.fillText(String(i), px + 8, py - 6);
  }

  // Coordinate display
  if (mode === 'star') {
    const [mx, my] = pixelToCoord(mouseX, mouseY);
    ctx.fillStyle = 'rgba(245, 239, 224, 0.3)';
    ctx.font = '11px Lato, sans-serif';
    ctx.fillText(`${mx}, ${my}`, mouseX + 14, mouseY - 8);
  }
}

// Minimap drawing
function resizeMinimap() {
  setupHiDpiCanvas(minimap, minimapCtx, true);
  drawMinimap();
}
window.addEventListener('resize', resizeMinimap);
resizeMinimap();

function drawMinimap() {
  const w = minimap.width / devicePixelRatio;
  const h = minimap.height / devicePixelRatio;
  const scale = w / WORLD_SIZE;

  minimapCtx.clearRect(0, 0, w, h);

  // Background
  minimapCtx.fillStyle = '#072e2c';
  minimapCtx.fillRect(0, 0, w, h);

  // Grid lines at origin
  minimapCtx.strokeStyle = 'rgba(245, 239, 224, 0.08)';
  minimapCtx.lineWidth = 1;
  minimapCtx.beginPath();
  minimapCtx.moveTo(w / 2, 0);
  minimapCtx.lineTo(w / 2, h);
  minimapCtx.moveTo(0, h / 2);
  minimapCtx.lineTo(w, h / 2);
  minimapCtx.stroke();

  // Draw existing constellations
  for (const c of existingData) {
    const cx = w / 2 + c.center.x * scale;
    const cy = h / 2 + c.center.y * scale;

    // Draw constellation lines
    for (const line of c.lines) {
      if (line.from >= c.stars.length || line.to >= c.stars.length) continue;
      const x1 = cx + c.stars[line.from].x * scale;
      const y1 = cy + c.stars[line.from].y * scale;
      const x2 = cx + c.stars[line.to].x * scale;
      const y2 = cy + c.stars[line.to].y * scale;
      minimapCtx.strokeStyle = hexToRgba(c.color, 0.4);
      minimapCtx.lineWidth = 1;
      minimapCtx.beginPath();
      minimapCtx.moveTo(x1, y1);
      minimapCtx.lineTo(x2, y2);
      minimapCtx.stroke();
    }

    // Draw constellation stars
    for (const s of c.stars) {
      minimapCtx.beginPath();
      minimapCtx.arc(cx + s.x * scale, cy + s.y * scale, 1.5, 0, Math.PI * 2);
      minimapCtx.fillStyle = hexToRgba(c.color, 0.7);
      minimapCtx.fill();
    }

    // Label
    minimapCtx.fillStyle = hexToRgba(c.color, 0.5);
    minimapCtx.font = '8px Lato, sans-serif';
    minimapCtx.textAlign = 'center';
    minimapCtx.fillText(c.name, cx, cy - 12 * scale - 6);
    minimapCtx.textAlign = 'start';
  }

  // Draw current constellation at its center position
  if (stars.length > 0) {
    const color = colorInput.value;
    const cx = w / 2 + centerX * scale;
    const cy = h / 2 + centerY * scale;

    for (const [a, b] of lines) {
      if (a >= stars.length || b >= stars.length) continue;
      const x1 = cx + stars[a][0] * scale;
      const y1 = cy + stars[a][1] * scale;
      const x2 = cx + stars[b][0] * scale;
      const y2 = cy + stars[b][1] * scale;
      minimapCtx.strokeStyle = hexToRgba(color, 0.6);
      minimapCtx.lineWidth = 1;
      minimapCtx.beginPath();
      minimapCtx.moveTo(x1, y1);
      minimapCtx.lineTo(x2, y2);
      minimapCtx.stroke();
    }

    for (const [sx, sy] of stars) {
      minimapCtx.beginPath();
      minimapCtx.arc(cx + sx * scale, cy + sy * scale, 2, 0, Math.PI * 2);
      minimapCtx.fillStyle = '#ffffff';
      minimapCtx.fill();
    }
  }

  // Draw placement crosshair
  const px = w / 2 + centerX * scale;
  const py = h / 2 + centerY * scale;
  minimapCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  minimapCtx.lineWidth = 1;
  minimapCtx.beginPath();
  minimapCtx.moveTo(px - 6, py);
  minimapCtx.lineTo(px + 6, py);
  minimapCtx.moveTo(px, py - 6);
  minimapCtx.lineTo(px, py + 6);
  minimapCtx.stroke();

  centerCoordsEl.textContent = `(${centerX}, ${centerY})`;
}

minimap.addEventListener('click', (e) => {
  const rect = minimap.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const w = minimap.offsetWidth;
  const h = minimap.offsetHeight;
  const scale = w / WORLD_SIZE;

  centerX = Math.round((mx - w / 2) / scale);
  centerY = Math.round((my - h / 2) / scale);
  drawMinimap();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
  if (e.key === '1') setMode('star');
  if (e.key === '2') setMode('line');
  if (e.key === '3') setMode('delete');
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
    e.preventDefault();
    document.getElementById('btn-undo')!.click();
  }
});
