import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { i as isEmailAllowed, r as getSessionFromCookie } from "./auth_CQ1BvJH4.mjs";
//#region src/pages/api/save-constellation.ts
var save_constellation_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var REPO = "oephi/tiny-lore";
var BRANCH = "main";
function buildMarkdown(data) {
	const { name, subtitle, color, center, stars, lines, story } = data;
	const starsYaml = stars.length ? `stars:
${stars.map((s) => `  - x: ${s.x}
    y: ${s.y}`).join("\n")}` : "stars: []";
	const linesYaml = lines.length ? `lines:
${lines.map((l) => `  - from: ${l.from}
    to: ${l.to}`).join("\n")}` : "lines: []";
	return `---
name: ${name}
subtitle: ${subtitle || "A new constellation"}
color: "${color || "#c9a84c"}"
center:
  x: ${center?.x ?? 0}
  y: ${center?.y ?? 0}
${starsYaml}
${linesYaml}
---

${story || "Write your story here."}
`;
}
async function saveToGitHub(slug, content) {
	const token = process.env.GITHUB_TOKEN;
	if (!token) throw new Error("GITHUB_TOKEN environment variable is not set");
	const apiUrl = `https://api.github.com/repos/${REPO}/contents/${`src/content/constellations/${slug}.md`}`;
	let sha;
	const existing = await fetch(apiUrl, { headers: {
		Authorization: `Bearer ${token}`,
		Accept: "application/vnd.github.v3+json"
	} });
	if (existing.ok) sha = (await existing.json()).sha;
	const body = {
		message: sha ? `Update constellation: ${slug}` : `Add constellation: ${slug}`,
		content: btoa(unescape(encodeURIComponent(content))),
		branch: BRANCH
	};
	if (sha) body.sha = sha;
	const res = await fetch(apiUrl, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github.v3+json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || `GitHub API error: ${res.status}`);
	}
}
var POST = async ({ request }) => {
	const isProd = true;
	{
		const session = getSessionFromCookie(request.headers.get("Cookie"));
		if (!session || !isEmailAllowed(session.email)) return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
	}
	const data = await request.json();
	const { filename, name } = data;
	if (!filename || !name) return new Response(JSON.stringify({ error: "Filename and name are required" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	const slug = filename.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
	const md = buildMarkdown(data);
	try {
		await saveToGitHub(slug, md);
		return new Response(JSON.stringify({
			ok: true,
			slug,
			rebuilt: isProd
		}), { headers: { "Content-Type": "application/json" } });
	} catch (err) {
		return new Response(JSON.stringify({ error: String(err) }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/save-constellation@_@ts
var page = () => save_constellation_exports;
//#endregion
export { page };
