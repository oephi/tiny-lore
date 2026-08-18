// Total size of the world coordinate space (4000x4000, centered at 0,0)
export const WORLD_SIZE = 4000;

// Base constellation data shape used across the app
export interface Constellation {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  center: { x: number; y: number };
  stars: { x: number; y: number }[];
  lines: { from: number; to: number }[];
}

export interface Track {
  title: string;
  duration: string;
  file: string;
}

// Extended with story body text and tracks, used by the editor when loading existing constellations
export interface ExistingConstellation extends Constellation {
  tracks: Track[];
  body: string;
}

// Convert a hex color (e.g. "#c9a84c") to an rgba() string with the given alpha
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Scale a canvas for high-DPI displays. When useOffset is true, sizes to the
// element's CSS dimensions (for inline canvases like the editor/minimap).
// When false, sizes to the full viewport (for the fullscreen constellation map).
export function setupHiDpiCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  useOffset = false,
) {
  if (useOffset) {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
  } else {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
