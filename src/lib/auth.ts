import { createHmac, randomBytes } from 'node:crypto';

const SECRET = () => import.meta.env.SESSION_SECRET || 'dev-secret-change-me';
const EDITOR_COOKIE = 'editor_session';
const USER_COOKIE = 'user_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  email: string;
  exp: number;
}

export interface UserSessionPayload {
  userId: string;
  email: string;
  exp: number;
}

export function createSessionToken(email: string): string {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + MAX_AGE * 1000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', SECRET()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;

  const expected = createHmac('sha256', SECRET()).update(data).digest('base64url');
  if (sig !== expected) return null;

  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function isEmailAllowed(email: string): boolean {
  const allowed = import.meta.env.ALLOWED_EMAILS || '';
  if (!allowed) return false;
  const list = allowed.split(',').map((e) => e.trim().toLowerCase());
  return list.includes(email.toLowerCase());
}

export function getSessionFromCookie(cookieHeader: string | null): SessionPayload | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${EDITOR_COOKIE}=([^;]+)`));
  if (!match) return null;
  return verifySessionToken(match[1]);
}

export function sessionCookie(token: string): string {
  return `${EDITOR_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}; Secure`;
}

export function clearSessionCookie(): string {
  return `${EDITOR_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

// ── Listener Auth ──
// Separate session for public users (any Google account, no whitelist)

export function createUserSessionToken(userId: string, email: string): string {
  const payload: UserSessionPayload = {
    userId,
    email,
    exp: Date.now() + MAX_AGE * 1000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', SECRET()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function getUserSessionFromCookie(cookieHeader: string | null): UserSessionPayload | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${USER_COOKIE}=([^;]+)`));
  if (!match) return null;

  const [data, sig] = match[1].split('.');
  if (!data || !sig) return null;

  const expected = createHmac('sha256', SECRET()).update(data).digest('base64url');
  if (sig !== expected) return null;

  try {
    const payload: UserSessionPayload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function userSessionCookie(token: string): string {
  return `${USER_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}; Secure`;
}

export function clearUserSessionCookie(): string {
  return `${USER_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export function generateState(): string {
  return randomBytes(16).toString('hex');
}
