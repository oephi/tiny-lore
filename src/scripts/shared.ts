export const WORLD_SIZE = 4000;

export interface Constellation {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  center: { x: number; y: number };
  stars: { x: number; y: number }[];
  lines: { from: number; to: number }[];
}

export interface ExistingConstellation extends Constellation {
  body: string;
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
