import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { a as sessionCookie, i as isEmailAllowed, t as createSessionToken } from "./auth_CQ1BvJH4.mjs";
//#region src/pages/api/auth/callback.ts
var callback_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ request, redirect, url }) => {
	const code = new URL(request.url).searchParams.get("code");
	if (!code) return new Response("Missing authorization code", { status: 400 });
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	if (!clientId || !clientSecret) return new Response("Google OAuth not configured", { status: 500 });
	const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: `${url.origin}/api/auth/callback`,
			grant_type: "authorization_code"
		})
	});
	if (!tokenRes.ok) return new Response("Failed to exchange authorization code", { status: 500 });
	const { access_token } = await tokenRes.json();
	const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${access_token}` } });
	if (!userRes.ok) return new Response("Failed to get user info", { status: 500 });
	const { email } = await userRes.json();
	if (!email || !isEmailAllowed(email)) return new Response(`<html><body style="background:#072e2c;color:#f5efe0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
        <div style="text-align:center">
          <h1 style="font-size:1.2rem;color:#c9a84c">Access Denied</h1>
          <p style="opacity:0.6;font-size:0.9rem">${email} is not authorized to use the editor.</p>
          <a href="/" style="color:#c9a84c;font-size:0.8rem">Return home</a>
        </div>
      </body></html>`, {
		status: 403,
		headers: { "Content-Type": "text/html" }
	});
	const token = createSessionToken(email);
	const response = redirect("/editor", 302);
	return new Response(response.body, {
		status: 302,
		headers: {
			Location: "/editor",
			"Set-Cookie": sessionCookie(token)
		}
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/callback@_@ts
var page = () => callback_exports;
//#endregion
export { page };
