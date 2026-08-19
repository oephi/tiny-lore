import { hexToRgba, setupHiDpiCanvas, WORLD_SIZE, type ExistingConstellation, type Track } from './shared';

const canvas = document.getElementById('editor-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Load all existing constellations from the embedded JSON (used for minimap and load buttons)
const existingData: ExistingConstellation[] = JSON.parse(
  document.getElementById('existing-data')!.textContent!
);

// ── State ──
// Stars and lines use [x, y] tuples internally for canvas operations.
// Converted to/from object format {x, y} / {from, to} on load/save.
let stars: [number, number][] = [];
let lines: [number, number][] = [];
let mode: 'star' | 'line' | 'delete' = 'star';
let lineStart: number | null = null;  // Index of the first star when drawing a line
let hoveredStar: number | null = null;
let history: { stars: [number, number][]; lines: [number, number][] }[] = [];
let mouseX = 0;
let mouseY = 0;

// ── Grid / Snap ──
let snapEnabled = true;
let gridSize = 20;

const snapToggle = document.getElementById('snap-toggle') as HTMLInputElement;
const gridSizeInput = document.getElementById('grid-size') as HTMLInputElement;
const gridSizeDisplay = document.getElementById('grid-size-display')!;

snapToggle.addEventListener('change', () => {
  snapEnabled = snapToggle.checked;
  draw();
});

gridSizeInput.addEventListener('input', () => {
  gridSize = parseInt(gridSizeInput.value, 10);
  gridSizeDisplay.textContent = `${gridSize}px`;
  draw();
});

// Snap a coordinate to the nearest grid point (relative to canvas center)
function snapToGrid(x: number, y: number): [number, number] {
  if (!snapEnabled) return [Math.round(x), Math.round(y)];
  return [
    Math.round(x / gridSize) * gridSize,
    Math.round(y / gridSize) * gridSize,
  ];
}

// ── DOM References ──
const nameInput = document.getElementById('name') as HTMLInputElement;
const subtitleInput = document.getElementById('subtitle') as HTMLInputElement;
const colorInput = document.getElementById('color') as HTMLInputElement;
const filenameInput = document.getElementById('filename') as HTMLInputElement;
const storyInput = document.getElementById('story') as HTMLTextAreaElement;
const imageInput = document.getElementById('image') as HTMLInputElement;
const imagePreview = document.getElementById('image-preview')!;
const hiddenToggle = document.getElementById('hidden-toggle') as HTMLInputElement;
const starCount = document.getElementById('star-count')!;
const lineCount = document.getElementById('line-count')!;
const saveFeedback = document.getElementById('save-feedback')!;
const deleteBtn = document.getElementById('btn-delete')!;
let currentLoadedId = '';  // Tracks which constellation is loaded (empty = new)

const modeStarBtn = document.getElementById('mode-star')!;
const modeLineBtn = document.getElementById('mode-line')!;
const modeDeleteBtn = document.getElementById('mode-delete')!;

// ── Tracks ──
const tracksList = document.getElementById('tracks-list')!;
const addTrackBtn = document.getElementById('btn-add-track')!;
let tracks: Track[] = [];

// Create a track entry row in the sidebar UI
function createTrackEntry(track: Track, index: number): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'track-entry';
  el.innerHTML = `
    <div class="track-row">
      <input type="text" placeholder="Track title" value="${track.title.replace(/"/g, '&quot;')}" data-field="title" />
      <input type="text" placeholder="3:42" value="${track.duration}" data-field="duration" />
    </div>
    <input type="text" placeholder="bear/01-filename.mp3" value="${track.file.replace(/"/g, '&quot;')}" data-field="file" />
    <button class="track-remove" title="Remove track">&times;</button>
  `;

  // Sync input changes back to the tracks array
  el.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => {
      const field = input.dataset.field as keyof Track;
      tracks[index][field] = input.value;
    });
  });

  // Remove track button
  el.querySelector('.track-remove')!.addEventListener('click', () => {
    tracks.splice(index, 1);
    renderTracks();
  });

  return el;
}

// Re-render all track entries in the sidebar
function renderTracks() {
  tracksList.innerHTML = '';
  tracks.forEach((track, i) => {
    tracksList.appendChild(createTrackEntry(track, i));
  });
}

// Add a blank track
addTrackBtn.addEventListener('click', () => {
  tracks.push({ title: '', duration: '', file: '' });
  renderTracks();
  // Focus the title input of the new track
  const lastEntry = tracksList.lastElementChild;
  if (lastEntry) {
    (lastEntry.querySelector('input[data-field="title"]') as HTMLInputElement)?.focus();
  }
});

// ── Minimap ──
const minimap = document.getElementById('minimap') as HTMLCanvasElement;
const minimapCtx = minimap.getContext('2d')!;
const centerCoordsEl = document.getElementById('center-coords')!;
let centerX = 0;  // World-space X position where this constellation will be placed
let centerY = 0;  // World-space Y position where this constellation will be placed

// ── Coordinate Transforms ──
// The editor canvas has its origin at center. Stars are stored as offsets from center.

// Returns the pixel position of the canvas center (the origin point)
function getCenter(): [number, number] {
  return [canvas.width / devicePixelRatio / 2, canvas.height / devicePixelRatio / 2];
}

// Convert a screen pixel position to a star coordinate (offset from canvas center)
function pixelToCoord(px: number, py: number): [number, number] {
  const [cx, cy] = getCenter();
  return snapToGrid(px - cx, py - cy);
}

// Convert a star coordinate back to screen pixel position
function coordToPixel(x: number, y: number): [number, number] {
  const [cx, cy] = getCenter();
  return [cx + x, cy + y];
}

// ── Canvas Resize ──
// Re-scales the editor canvas for the current element size and DPI
function resize() {
  setupHiDpiCanvas(canvas, ctx, true);
  draw();
}
window.addEventListener('resize', resize);
resize();

// ── Undo History ──
// Pushes a deep copy of the current stars/lines state onto the history stack (max 50 entries)
function saveHistory() {
  history.push({
    stars: stars.map(s => [...s] as [number, number]),
    lines: lines.map(l => [...l] as [number, number]),
  });
  if (history.length > 50) history.shift();
}

// ── Hit Testing ──

// Find the index of a star within a pixel threshold of the given screen position.
// Returns null if no star is close enough. Searches in reverse so topmost stars are found first.
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

// Find the index of a line within a pixel threshold of the given screen position.
// Uses point-to-line-segment projection for accurate distance testing.
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

// ── Mouse Input ──
// Track mouse position and update hover state + cursor based on current tool mode
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

// Handle click actions based on current tool mode:
// - Star mode: place a new star at the clicked position
// - Line mode: select two stars to draw a line between them
// - Delete mode: remove a star (and its connected lines) or a line
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
      // Remove all lines connected to this star
      lines = lines.filter(([a, b]) => a !== star && b !== star);
      // Re-index lines to account for the removed star
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

// ── Tool Switching ──
// Switch between Place Stars (1), Draw Lines (2), and Delete (3) modes
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

// ── Undo Button ──
// Restores the previous stars/lines state from the history stack
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

// ── Clear Button ──
// Removes all stars and lines (can be undone)
document.getElementById('btn-clear')!.addEventListener('click', () => {
  saveHistory();
  stars = [];
  lines = [];
  lineStart = null;
  updateCounts();
  draw();
});

// ── Save Feedback ──
// Show a temporary success/error message in the sidebar
function showFeedback(message: string, isError = false) {
  saveFeedback.textContent = message;
  saveFeedback.classList.toggle('error', isError);
  saveFeedback.classList.remove('hidden');
  setTimeout(() => saveFeedback.classList.add('hidden'), 3000);
}

// ── Save Button ──
// POST the constellation data to the save API endpoint.
// In dev: writes a .md file to disk. In prod: commits via GitHub API.
document.getElementById('btn-save')!.addEventListener('click', async () => {
  const name = nameInput.value;
  const filename = filenameInput.value;

  if (!name || !filename) {
    showFeedback('Name and filename are required.', true);
    return;
  }

  // Convert internal tuple format to object format for the API
  // Filter out empty tracks (no title or file)
  const validTracks = tracks.filter(t => t.title.trim() || t.file.trim());
  const image = imageInput.value.trim();
  const hidden = hiddenToggle.checked;
  const payload = {
    filename,
    name,
    subtitle: subtitleInput.value,
    color: colorInput.value,
    hidden: hidden || undefined,
    image: image || undefined,
    center: { x: centerX, y: centerY },
    stars: stars.map(([x, y]) => ({ x, y })),
    lines: lines.map(([a, b]) => ({ from: a, to: b })),
    tracks: validTracks,
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

// ── Copy Markdown Button ──
// Generate the full .md file content (YAML frontmatter + story body) and copy to clipboard
document.getElementById('btn-export')!.addEventListener('click', () => {
  const name = nameInput.value || 'Unnamed';
  const subtitle = subtitleInput.value || 'A new constellation';
  const color = colorInput.value;
  const story = storyInput.value || 'Write your story here.';

  const starsStr = stars.map(([x, y]) => `  - x: ${x}\n    y: ${y}`).join('\n');
  const linesStr = lines.map(([a, b]) => `  - from: ${a}\n    to: ${b}`).join('\n');
  const validTracks = tracks.filter(t => t.title.trim() || t.file.trim());
  const tracksStr = validTracks.map(t =>
    `  - title: "${t.title}"\n    duration: "${t.duration}"\n    file: "${t.file}"`
  ).join('\n');

  const image = imageInput.value.trim();
  const hidden = hiddenToggle.checked;
  const md = `---
name: ${name}
subtitle: ${subtitle}
color: "${color}"${hidden ? `\nhidden: true` : ''}${image ? `\nimage: "${image}"` : ''}
center:
  x: ${centerX}
  y: ${centerY}
${stars.length ? `stars:\n${starsStr}` : 'stars: []'}
${lines.length ? `lines:\n${linesStr}` : 'lines: []'}
${validTracks.length ? `tracks:\n${tracksStr}` : 'tracks: []'}
---

${story}
`;

  navigator.clipboard.writeText(md).then(() => {
    showFeedback('Copied to clipboard!');
  });
});

// ── Delete Button ──
// DELETE the current constellation via the API (with confirmation).
// In dev: deletes the .md file from disk. In prod: deletes via GitHub API.
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
      loadConstellation('');
      // Remove the sidebar button for the deleted constellation
      document.querySelector(`.load-btn[data-id="${currentLoadedId}"]`)?.remove();
    } else {
      showFeedback(result.error || 'Delete failed.', true);
    }
  } catch (err) {
    showFeedback('Network error.', true);
  }
});

// ── Status Display ──
// Update the star/line count labels in the sidebar and refresh the minimap
function updateCounts() {
  starCount.textContent = `Stars: ${stars.length}`;
  lineCount.textContent = `Lines: ${lines.length}`;
  drawMinimap();
}

// ── Load Constellation ──
// Populate the editor with an existing constellation's data, or reset to blank if id is empty.
// Converts from object format {x, y} to internal tuple format [x, y].
function loadConstellation(id: string) {
  currentLoadedId = id;
  deleteBtn.classList.toggle('hidden', !id);

  const c = existingData.find((e) => e.id === id);
  if (!c) {
    stars = [];
    lines = [];
    tracks = [];
    nameInput.value = '';
    subtitleInput.value = '';
    colorInput.value = '#c9a84c';
    filenameInput.value = '';
    storyInput.value = '';
    imageInput.value = '';
    hiddenToggle.checked = false;
    updateImagePreview();
    centerX = 0;
    centerY = 0;
    history = [];
    lineStart = null;
    renderTracks();
    updateCounts();
    draw();
    drawMinimap();
    return;
  }

  stars = c.stars.map((s) => [s.x, s.y] as [number, number]);
  lines = c.lines.map((l) => [l.from, l.to] as [number, number]);
  tracks = c.tracks.map((t) => ({ ...t }));
  nameInput.value = c.name;
  subtitleInput.value = c.subtitle;
  colorInput.value = c.color;
  filenameInput.value = c.id;
  storyInput.value = c.body.trim();
  imageInput.value = c.image || '';
  hiddenToggle.checked = c.hidden || false;
  updateImagePreview();
  centerX = c.center.x;
  centerY = c.center.y;
  history = [];
  lineStart = null;
  renderTracks();
  updateCounts();
  draw();
  drawMinimap();
}

// ── Sidebar Load Buttons ──
// Each button loads an existing constellation into the editor
document.querySelectorAll<HTMLButtonElement>('.load-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.load-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    loadConstellation(btn.dataset.id || '');
  });
});

// Redraw canvas and minimap when the color picker changes
colorInput.addEventListener('input', () => { draw(); drawMinimap(); });

// Redraw canvas when name/subtitle change (for the preview label)
nameInput.addEventListener('input', () => draw());
subtitleInput.addEventListener('input', () => draw());

// Image preview
function updateImagePreview(cacheBust = false) {
  const url = imageInput.value.trim();
  if (url) {
    const src = cacheBust ? `${url}?t=${Date.now()}` : url;
    imagePreview.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Preview';
    img.style.cssText = 'width:100%;height:auto;display:block;object-fit:contain;max-height:120px;border-radius:4px;';
    imagePreview.appendChild(img);
  } else {
    imagePreview.innerHTML = '';
  }
}
imageInput.addEventListener('input', updateImagePreview);

// Image upload
const imageFileInput = document.getElementById('image-file') as HTMLInputElement;
const imageFeedback = document.getElementById('image-feedback')!;

function showImageFeedback(msg: string, isError = false) {
  imageFeedback.textContent = msg;
  imageFeedback.classList.toggle('error', isError);
  imageFeedback.classList.remove('hidden');
  setTimeout(() => imageFeedback.classList.add('hidden'), 3000);
}

imageFileInput.addEventListener('change', async () => {
  const file = imageFileInput.files?.[0];
  if (!file) return;

  // Use the constellation filename as the image name, or fall back to the file name
  const name = filenameInput.value.trim() || file.name.replace(/\.[^.]+$/, '');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);

  showImageFeedback('Uploading...');

  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    if (res.ok) {
      imageInput.value = data.url;
      updateImagePreview(true);
      showImageFeedback('Uploaded!');
    } else {
      showImageFeedback(data.error || 'Upload failed.', true);
    }
  } catch {
    showImageFeedback('Network error.', true);
  }

  // Reset the file input so the same file can be re-uploaded
  imageFileInput.value = '';
});

// ── Main Canvas Drawing ──
// Renders the editor view: grid, constellation lines, pending line, stars with labels,
// and coordinate display under the cursor in star mode
function draw() {
  const w = canvas.width / devicePixelRatio;
  const h = canvas.height / devicePixelRatio;
  const color = colorInput.value;

  ctx.clearRect(0, 0, w, h);

  // Grid crosshair at center (shows the origin point)
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
  const dotAlpha = snapEnabled ? 0.1 : 0.03;
  const dotSize = snapEnabled ? 1.5 : 1;
  ctx.fillStyle = `rgba(245, 239, 224, ${dotAlpha})`;
  for (let x = cx % gridSize; x < w; x += gridSize) {
    for (let y = cy % gridSize; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Snap preview: show where the star would be placed
  if (mode === 'star' && snapEnabled && mouseX > 0) {
    const [snapX, snapY] = pixelToCoord(mouseX, mouseY);
    const [spx, spy] = coordToPixel(snapX, snapY);
    ctx.beginPath();
    ctx.arc(spx, spy, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 239, 224, 0.15)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(spx, spy, 4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 239, 224, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw constellation lines
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

  // Draw dashed line from first selected star to cursor (line tool preview)
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

  // Draw stars with index labels and hover/selection glow
  for (let i = 0; i < stars.length; i++) {
    const [px, py] = coordToPixel(stars[i][0], stars[i][1]);
    const isHovered = hoveredStar === i;
    const isLineStart = lineStart === i;
    const r = isHovered || isLineStart ? 5 : 3;

    // Radial glow around hovered or selected stars
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

    // Star index label
    ctx.fillStyle = 'rgba(245, 239, 224, 0.35)';
    ctx.font = '10px Quicksand, sans-serif';
    ctx.fillText(String(i), px + 8, py - 6);
  }

  // Show coordinate under cursor in star placement mode
  if (mode === 'star') {
    const [mx, my] = pixelToCoord(mouseX, mouseY);
    ctx.fillStyle = 'rgba(245, 239, 224, 0.3)';
    ctx.font = '11px Quicksand, sans-serif';
    ctx.fillText(`${mx}, ${my}`, mouseX + 14, mouseY - 8);
  }

  // ── Title / Subtitle Preview ──
  // Matches the constellation map: label anchored 120px above center,
  // name on top, subtitle below, bottom edge at the anchor point.
  const name = nameInput.value;
  const subtitle = subtitleInput.value;
  if (name || subtitle) {
    // Anchor point: 120px above canvas center (matches worldToScreen(center.y - 120))
    const anchorY = cy - 120;
    ctx.textAlign = 'center';

    // Name sits above the anchor, subtitle just below the name
    if (name) {
      ctx.fillStyle = '#f5efe0';
      ctx.font = '18px "Tan Mon Cheri", serif';
      ctx.shadowColor = 'rgba(201, 168, 76, 0.5)';
      ctx.shadowBlur = 20;
      ctx.fillText(name, cx, anchorY);
      ctx.shadowBlur = 0;
    }

    if (subtitle) {
      ctx.fillStyle = hexToRgba(color, 0.7);
      ctx.font = '300 10px Quicksand, sans-serif';
      // Manual letter spacing
      const upper = subtitle.toUpperCase();
      const spacing = 3;
      const totalWidth = ctx.measureText(upper).width + spacing * (upper.length - 1);
      let tx = cx - totalWidth / 2;
      for (const ch of upper) {
        ctx.fillText(ch, tx, anchorY + 16);
        tx += ctx.measureText(ch).width + spacing;
      }
    }

    ctx.textAlign = 'start';
  }
}

// ── Minimap ──
// Shows a bird's-eye view of the entire world space with all constellations.
// The current constellation is shown in white at its center position.

// Re-scale the minimap canvas for the current element size and DPI
function resizeMinimap() {
  setupHiDpiCanvas(minimap, minimapCtx, true);
  drawMinimap();
}
window.addEventListener('resize', resizeMinimap);
resizeMinimap();

// Render the minimap: all existing constellations, the current constellation, and a crosshair
function drawMinimap() {
  const w = minimap.width / devicePixelRatio;
  const h = minimap.height / devicePixelRatio;
  const scale = w / WORLD_SIZE;

  minimapCtx.clearRect(0, 0, w, h);

  // Background
  minimapCtx.fillStyle = '#072e2c';
  minimapCtx.fillRect(0, 0, w, h);

  // Origin crosshair
  minimapCtx.strokeStyle = 'rgba(245, 239, 224, 0.08)';
  minimapCtx.lineWidth = 1;
  minimapCtx.beginPath();
  minimapCtx.moveTo(w / 2, 0);
  minimapCtx.lineTo(w / 2, h);
  minimapCtx.moveTo(0, h / 2);
  minimapCtx.lineTo(w, h / 2);
  minimapCtx.stroke();

  // Draw all existing constellations (lines, stars, and name labels)
  for (const c of existingData) {
    const cx = w / 2 + c.center.x * scale;
    const cy = h / 2 + c.center.y * scale;

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

    for (const s of c.stars) {
      minimapCtx.beginPath();
      minimapCtx.arc(cx + s.x * scale, cy + s.y * scale, 1.5, 0, Math.PI * 2);
      minimapCtx.fillStyle = hexToRgba(c.color, 0.7);
      minimapCtx.fill();
    }

    minimapCtx.fillStyle = hexToRgba(c.color, 0.5);
    minimapCtx.font = '8px Quicksand, sans-serif';
    minimapCtx.textAlign = 'center';
    minimapCtx.fillText(c.name, cx, cy - 12 * scale - 6);
    minimapCtx.textAlign = 'start';
  }

  // Draw the current constellation being edited (in white, at its center position)
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

  // Draw placement crosshair at the current center position
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

// Click on minimap to set the constellation's world-space center position
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

// ── Keyboard Shortcuts ──
// 1/2/3 to switch tools, Ctrl+Z to undo. Disabled when typing in input fields.
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
