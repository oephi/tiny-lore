import { createHmac, randomBytes } from "node:crypto";
//#region src/lib/auth.ts
var SECRET = () => process.env.SESSION_SECRET || "dev-secret-change-me";
var COOKIE_NAME = "editor_session";
var MAX_AGE = 604800;
function createSessionToken(email) {
	const payload = {
		email,
		exp: Date.now() + MAX_AGE * 1e3
	};
	const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
	return `${data}.${createHmac("sha256", SECRET()).update(data).digest("base64url")}`;
}
function verifySessionToken(token) {
	const [data, sig] = token.split(".");
	if (!data || !sig) return null;
	if (sig !== createHmac("sha256", SECRET()).update(data).digest("base64url")) return null;
	try {
		const payload = JSON.parse(Buffer.from(data, "base64url").toString());
		if (payload.exp < Date.now()) return null;
		return payload;
	} catch {
		return null;
	}
}
function isEmailAllowed(email) {
	const allowed = process.env.ALLOWED_EMAILS || "";
	if (!allowed) return false;
	return allowed.split(",").map((e) => e.trim().toLowerCase()).includes(email.toLowerCase());
}
function getSessionFromCookie(cookieHeader) {
	if (!cookieHeader) return null;
	const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
	if (!match) return null;
	return verifySessionToken(match[1]);
}
function sessionCookie(token) {
	return `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}; Secure`;
}
function generateState() {
	return randomBytes(16).toString("hex");
}
//#endregion
export { sessionCookie as a, isEmailAllowed as i, generateState as n, getSessionFromCookie as r, createSessionToken as t };
