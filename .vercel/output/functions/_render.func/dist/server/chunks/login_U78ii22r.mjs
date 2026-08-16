import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { n as generateState } from "./auth_CQ1BvJH4.mjs";
//#region src/pages/api/auth/login.ts
var login_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ redirect, url }) => {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	if (!clientId) return new Response("Google OAuth not configured", { status: 500 });
	const state = generateState();
	const redirectUri = `${url.origin}/api/auth/callback`;
	return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: "code",
		scope: "openid email",
		state,
		access_type: "online",
		prompt: "select_account"
	})}`);
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/login@_@ts
var page = () => login_exports;
//#endregion
export { page };
