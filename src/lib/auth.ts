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

// ── Generic HMAC token helpers ──

function createSignedToken<T>(payload: T): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', SECRET()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifySignedToken<T>(token: string): T | null {
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;

  const expected = createHmac('sha256', SECRET()).update(data).digest('base64url');
  if (sig !== expected) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString()) as T & { exp: number };
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function getTokenFromCookie<T>(cookieHeader: string | null, cookieName: string): T | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${cookieName}=([^;]+)`));
  if (!match) return null;
  return verifySignedToken<T>(match[1]);
}

function makeCookie(name: string, token: string): string {
  return `${name}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}; Secure`;
}

function clearCookie(name: string): string {
  return `${name}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

// ── Editor Auth ──

export function createSessionToken(email: string): string {
  return createSignedToken<SessionPayload>({ email, exp: Date.now() + MAX_AGE * 1000 });
}

export function getSessionFromCookie(cookieHeader: string | null): SessionPayload | null {
  return getTokenFromCookie<SessionPayload>(cookieHeader, EDITOR_COOKIE);
}

export function isEmailAllowed(email: string): boolean {
  const allowed = import.meta.env.ALLOWED_EMAILS || '';
  if (!allowed) return false;
  const list = allowed.split(',').map((e: string) => e.trim().toLowerCase());
  return list.includes(email.toLowerCase());
}

export function sessionCookie(token: string): string {
  return makeCookie(EDITOR_COOKIE, token);
}

export function clearSessionCookie(): string {
  return clearCookie(EDITOR_COOKIE);
}

/** Check editor auth on a request. Returns session or null. Skips check in dev. */
export function requireEditorAuth(request: Request): SessionPayload | null {
  if (!import.meta.env.PROD) return { email: 'dev@local', exp: Infinity };
  const session = getSessionFromCookie(request.headers.get('Cookie'));
  if (!session || !isEmailAllowed(session.email)) return null;
  return session;
}

// ── Listener Auth ──

export function createUserSessionToken(userId: string, email: string): string {
  return createSignedToken<UserSessionPayload>({ userId, email, exp: Date.now() + MAX_AGE * 1000 });
}

export function getUserSessionFromCookie(cookieHeader: string | null): UserSessionPayload | null {
  return getTokenFromCookie<UserSessionPayload>(cookieHeader, USER_COOKIE);
}

export function userSessionCookie(token: string): string {
  return makeCookie(USER_COOKIE, token);
}

export function clearUserSessionCookie(): string {
  return clearCookie(USER_COOKIE);
}

export function generateState(): string {
  return randomBytes(16).toString('hex');
}
