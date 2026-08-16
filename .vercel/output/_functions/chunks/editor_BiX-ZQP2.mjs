import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { J as UnknownContentCollectionError, Q as AstroError } from "./errors-data_BL3JF-UK.mjs";
import { c as isRemotePath, d as removeBase } from "./path_CsjwVQRw.mjs";
import { C as addAttribute, S as renderHead, _ as object, b as safeParseAsync, h as date, i as renderComponent, j as createAstro, k as unescapeHTML, m as array, p as generateCspDigest, s as renderSlot, t as spreadAttributes, u as renderTemplate, v as string, w as createRenderInstruction, x as maybeRenderHead } from "./server_DmrQpqP_.mjs";
import { n as unflatten, t as parse } from "./parse_DN83ZD-A.mjs";
import { t as createComponent } from "./compiler_tqTgMqFJ.mjs";
import { r as VALID_INPUT_FORMATS } from "./consts_CZWONRYp.mjs";
import { i as isEmailAllowed, r as getSessionFromCookie } from "./auth_CQ1BvJH4.mjs";
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "Tiny Lore — Where tiny moments meet infinite worlds" } = Astro.props;
	return renderTemplate`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">${renderHead($$result)}</head><body>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "/Users/ryansickle/dev/personal/tiny-lore/src/layouts/Layout.astro", void 0);
//#endregion
//#region node_modules/.pnpm/neotraverse@1.0.1/node_modules/neotraverse/dist/path-Bxt08XGL.js
var to_string = (obj) => Object.prototype.toString.call(obj);
var is_typed_array = (value) => ArrayBuffer.isView(value) && to_string(value) !== "[object DataView]";
var is_array = Array.isArray;
var is_boxed_primitive = (obj) => {
	const tag = to_string(obj);
	if (tag !== "[object Boolean]" && tag !== "[object Number]" && tag !== "[object String]") return false;
	try {
		return typeof obj.valueOf() !== "object";
	} catch {
		return false;
	}
};
var gopd = Object.getOwnPropertyDescriptor;
var is_property_enumerable = Object.prototype.propertyIsEnumerable;
var get_own_property_symbols = Object.getOwnPropertySymbols;
var has_own_property = Object.prototype.hasOwnProperty;
var object_keys = Object.keys;
var object_proto = Object.prototype;
var get_proto = Object.getPrototypeOf;
function safe_set(dst, key, value) {
	if (typeof key === "object" && key !== null) key = String(key);
	if (key === "__proto__") Object.defineProperty(dst, key, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
	else dst[key] = value;
}
function assert_within_depth(depth, max_depth) {
	if (max_depth !== void 0 && depth > max_depth) throw new RangeError(`neotraverse: maximum traversal depth (${max_depth}) exceeded`);
}
function own_enumerable_keys(obj) {
	const res = object_keys(obj);
	const symbols = get_own_property_symbols(obj);
	for (let i = 0; i < symbols.length; i++) if (is_property_enumerable.call(obj, symbols[i])) res.push(symbols[i]);
	return res;
}
function is_non_writable(object, key) {
	return !gopd(object, key)?.writable;
}
var empty_null = {
	includeSymbols: false,
	immutable: false
};
function clamp_concurrency(c) {
	return typeof c === "number" && c >= 1 ? Math.floor(c) : 1;
}
function array_numeric(keys) {
	for (let i = 0; i < keys.length; i++) {
		const k = keys[i];
		if (typeof k === "string" && "" + +k === k) keys[i] = +k;
	}
	return keys;
}
function array_keys(node, keys) {
	const len = node.length;
	if (keys.length === len) {
		for (let i = 0; i < len; i++) keys[i] = i;
		return keys;
	}
	return array_numeric(keys);
}
function map_set_child_keys(node) {
	if (node instanceof Map) {
		const keys = [];
		for (const k of node.keys()) keys.push(k);
		return keys;
	}
	const keys = [];
	let i = 0;
	for (const _ of node) {
		keys.push(i);
		i++;
	}
	return keys;
}
function get_child_at(node, key, descend_map_set) {
	if (descend_map_set && node instanceof Map) return node.get(key);
	if (descend_map_set && node instanceof Set) return [...node][key];
	return node[key];
}
var shell_keyed = false;
function make_shell(src) {
	if (is_array(src)) {
		shell_keyed = true;
		return new Array(src.length);
	}
	shell_keyed = false;
	if (src instanceof ArrayBuffer) return src.slice(0);
	if (src instanceof DataView) return new DataView(src.buffer.slice(src.byteOffset, src.byteOffset + src.byteLength), 0, src.byteLength);
	if (is_typed_array(src)) return src.slice();
	if (is_boxed_primitive(src)) return Object(src);
	if (src instanceof Map) return new Map(src);
	if (src instanceof Set) return new Set(src);
	if (src instanceof WeakMap || src instanceof WeakSet) return src;
	const tag = to_string(src);
	if (tag === "[object Date]" && typeof src.getTime === "function") {
		shell_keyed = true;
		return new Date(src.getTime());
	}
	if (tag === "[object RegExp]" && typeof src.source === "string") try {
		const re = new RegExp(src.source, src.flags);
		re.lastIndex = src.lastIndex;
		shell_keyed = true;
		return re;
	} catch {}
	if (tag === "[object Error]") {
		const Ctor = typeof src.constructor === "function" ? src.constructor : Error;
		let dst;
		try {
			dst = new Ctor(src.message);
		} catch {
			dst = new Error(src.message);
		}
		if (src.name !== dst.name) dst.name = src.name;
		if (src.stack !== void 0) dst.stack = src.stack;
		if ("cause" in src) dst.cause = src.cause;
		shell_keyed = true;
		return dst;
	}
	if (tag === "[object Map]") {
		shell_keyed = false;
		return new Map(src);
	}
	if (tag === "[object Set]") {
		shell_keyed = false;
		return new Set(src);
	}
	if (tag === "[object ArrayBuffer]") {
		shell_keyed = false;
		return src.slice(0);
	}
	if (tag === "[object DataView]") {
		shell_keyed = false;
		const dv = src;
		return new DataView(dv.buffer.slice(dv.byteOffset, dv.byteOffset + dv.byteLength), 0, dv.byteLength);
	}
	shell_keyed = true;
	const proto = get_proto(src);
	return proto === object_proto ? {} : Object.create(proto);
}
function copy(src, options) {
	if (typeof src === "object" && src !== null) {
		const dst = make_shell(src);
		if (!shell_keyed) return dst;
		const keys = options.includeSymbols ? own_enumerable_keys(src) : object_keys(src);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			safe_set(dst, key, src[key]);
		}
		return dst;
	}
	return src;
}
/**
* The traversal context. Every method lives on the prototype, so visiting a
* node allocates a *single* object — not a context object plus a fresh closure
* for each of `update`/`remove`/`before`/… and a separate `modifiers` object.
* That, plus the lazily-derived {@link path}, is what makes the modern build
* dramatically faster and lighter on the GC than the classic design.
*
* @see https://neotraverse.puruvj.dev/guide/context
*/
var WalkContext = class {
	node;
	node_;
	parent;
	key;
	isRoot;
	isLeaf = false;
	isFirst = false;
	isLast = false;
	level;
	circular = void 0;
	keys = null;
	w;
	keep_going = true;
	removed = false;
	mods = null;
	constructor(w, node_, node) {
		const path = w.path;
		const level = path.length;
		this.w = w;
		this.node = node;
		this.node_ = node_;
		this.parent = w.parents[level - 1];
		this.key = path[level - 1];
		this.isRoot = level === 0;
		this.level = level;
	}
	get parents() {
		return this.w.parents;
	}
	get notRoot() {
		return !this.isRoot;
	}
	get notLeaf() {
		return !this.isLeaf;
	}
	get path() {
		const out = new Array(this.level);
		let c = this;
		for (let i = this.level - 1; i >= 0; i--) {
			out[i] = c.key;
			c = c.parent;
		}
		return out;
	}
	update(x, stopHere = false) {
		if (!this.isRoot) safe_set(this.parent.node, this.key, x);
		this.node = x;
		if (stopHere) this.keep_going = false;
	}
	delete(stopHere) {
		delete this.parent.node[this.key];
		this.removed = true;
		if (stopHere) this.keep_going = false;
	}
	remove(stopHere) {
		const parent = this.parent.node;
		if (is_array(parent)) parent.splice(this.key, 1);
		else delete parent[this.key];
		this.removed = true;
		if (stopHere) this.keep_going = false;
	}
	before(f) {
		(this.mods ??= {}).before = f;
	}
	after(f) {
		(this.mods ??= {}).after = f;
	}
	pre(f) {
		(this.mods ??= {}).pre = f;
	}
	post(f) {
		(this.mods ??= {}).post = f;
	}
	stop() {
		this.w.alive = false;
	}
	block() {
		this.keep_going = false;
	}
	nextSibling() {
		const parent = this.parent;
		if (!parent?.keys || this.key === void 0) return void 0;
		const keys = parent.keys;
		const idx = keys.indexOf(this.key);
		if (idx < 0 || idx >= keys.length - 1) return void 0;
		return make_sibling_ctx(this, keys[idx + 1]);
	}
	prevSibling() {
		const parent = this.parent;
		if (!parent?.keys || this.key === void 0) return void 0;
		const keys = parent.keys;
		const idx = keys.indexOf(this.key);
		if (idx <= 0) return void 0;
		return make_sibling_ctx(this, keys[idx - 1]);
	}
};
function make_sibling_ctx(self, sibKey) {
	const w = self.w;
	const parent = self.parent;
	const sibNode = get_child_at(parent.node, sibKey, w.descend_map_set);
	const sib = new WalkContext(w, sibNode, sibNode);
	sib.parent = parent;
	sib.key = sibKey;
	sib.level = self.level;
	sib.isRoot = self.level === 0;
	if (typeof sibNode === "object" && sibNode !== null) {
		sib.keys = initial_keys(w, sibNode, w.iter);
		sib.isLeaf = sib.keys.length === 0;
	} else sib.isLeaf = true;
	return sib;
}
function make_walk_state(options = empty_null, immutable) {
	return {
		alive: true,
		immutable: immutable ?? !!options.immutable,
		iter: options.includeSymbols ? own_enumerable_keys : object_keys,
		max_depth: options.maxDepth,
		path: [],
		parents: [],
		descend_map_set: !!options.descendIntoMapSet,
		concurrency: clamp_concurrency(options.concurrency)
	};
}
function descend_children(w, ctx, node, walker, immutable, mods, fresh) {
	const { path } = w;
	const pre = mods !== null ? mods.pre : void 0;
	const post = mods !== null ? mods.post : void 0;
	if (w.descend_map_set && node instanceof Map) {
		const entries = [...node.entries()];
		const last = entries.length - 1;
		for (let index = 0; index <= last; index++) {
			if (!w.alive && !immutable) break;
			const [key, val] = entries[index];
			path.push(key);
			if (pre !== void 0) pre(ctx, val, key);
			const child = walker(val);
			if (immutable && child.node !== val) node.set(key, child.node);
			child.isLast = index === last;
			child.isFirst = index === 0;
			if (post !== void 0) post(ctx, child);
			path.pop();
		}
		return;
	}
	if (w.descend_map_set && node instanceof Set) {
		const vals = [...node];
		const last = vals.length - 1;
		for (let index = 0; index <= last; index++) {
			if (!w.alive && !immutable) break;
			path.push(index);
			if (pre !== void 0) pre(ctx, vals[index], index);
			const child = walker(vals[index]);
			if (immutable && child.node !== vals[index]) {
				node.delete(vals[index]);
				node.add(child.node);
			}
			child.isLast = index === last;
			child.isFirst = index === 0;
			if (post !== void 0) post(ctx, child);
			path.pop();
		}
		return;
	}
	const keys = ctx.keys;
	const node_is_array = is_array(node);
	let last = keys.length - 1;
	for (let index = 0; index <= last; index++) {
		if (!w.alive && !immutable) break;
		const key = keys[index];
		const childVal = node[key];
		const len_before = node_is_array ? node.length : 0;
		path.push(key);
		if (pre !== void 0) pre(ctx, childVal, key);
		const child = walker(childVal);
		if (immutable && !child.removed && node[key] !== child.node) {
			if (fresh || has_own_property.call(node, key) && !is_non_writable(node, key)) safe_set(node, key, child.node);
		}
		child.isLast = index === last;
		child.isFirst = index === 0;
		if (post !== void 0) post(ctx, child);
		path.pop();
		if (node_is_array && node.length < len_before) {
			index--;
			last--;
		}
	}
}
function update_state(ctx) {
	const node = ctx.node;
	if (typeof node === "object" && node !== null) {
		if (!ctx.keys || ctx.node_ !== node) if (ctx.w.descend_map_set && node instanceof Map) ctx.keys = map_set_child_keys(node);
		else if (ctx.w.descend_map_set && node instanceof Set) ctx.keys = map_set_child_keys(node);
		else {
			const ks = ctx.w.iter(node);
			ctx.keys = is_array(node) ? array_keys(node, ks) : ks;
		}
		ctx.isLeaf = ctx.keys.length === 0;
	} else {
		ctx.isLeaf = true;
		ctx.keys = null;
	}
}
function initial_keys(w, node0, iter) {
	if (w.descend_map_set && node0 instanceof Map) return map_set_child_keys(node0);
	if (w.descend_map_set && node0 instanceof Set) return map_set_child_keys(node0);
	const keys = iter(node0);
	return is_array(node0) ? array_keys(node0, keys) : keys;
}
/**
* Depth-first walk; {@link forEach} and {@link map} use this internally.
*
* @example
* ```js
* import { walk } from 'neotraverse/modern';
* walk({ a: { b: 1 } }, (ctx) => {
*   if (ctx.path.join('.') === 'a.b') ctx.update(2);
* });
* // => { a: { b: 2 } }
* ```
*
* @see https://neotraverse.puruvj.dev/guide/api/walk#t-walk
*/
function walk(root, cb, options = empty_null) {
	const w = make_walk_state(options);
	const { immutable, max_depth, parents, iter } = w;
	const walker = (node_) => {
		assert_within_depth(w.path.length, max_depth);
		const node0 = immutable ? copy(node_, options) : node_;
		const ctx = new WalkContext(w, node_, node0);
		if (!w.alive) return ctx;
		const node0_is_obj = typeof node0 === "object" && node0 !== null;
		if (node0_is_obj) {
			const keys0 = initial_keys(w, node0, iter);
			ctx.keys = keys0;
			ctx.isLeaf = keys0.length === 0;
			for (let i = 0; i < parents.length; i++) if (parents[i].node_ === node_) {
				ctx.circular = parents[i];
				break;
			}
		} else ctx.isLeaf = true;
		const ret = cb(ctx, node0);
		if (ret !== void 0) ctx.update(ret);
		const mods = ctx.mods;
		if (mods !== null && mods.before !== void 0) mods.before(ctx, ctx.node);
		if (!ctx.keep_going) return ctx;
		const node = ctx.node;
		const fresh = node === node0;
		if ((fresh ? node0_is_obj : typeof node === "object" && node !== null) && ctx.circular === void 0) {
			parents.push(ctx);
			if (!fresh) update_state(ctx);
			descend_children(w, ctx, node, walker, immutable, mods, fresh);
			parents.pop();
		}
		if (mods !== null && mods.after !== void 0) mods.after(ctx, ctx.node);
		return ctx;
	};
	return walker(root).node;
}
/**
* @example
* ```js
* import { forEach } from 'neotraverse/modern';
* forEach([5, -3], (ctx, x) => { if (x < 0) ctx.update(x + 128); });
* // => [5, 125]
* ```
*
* @see https://neotraverse.puruvj.dev/guide/api/core#t-forEach
*/
function forEach(obj, cb, options) {
	return walk(obj, cb, options);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/assets/runtime.js
function createSvgComponent({ meta, attributes, children, styles }) {
	const hasStyles = styles.length > 0;
	const Component = createComponent({
		async factory(result, props) {
			const normalizedProps = normalizeProps(attributes, props);
			if (hasStyles && result.cspDestination) for (const style of styles) {
				const hash = await generateCspDigest(style, result.cspAlgorithm);
				result._metadata.extraStyleHashes.push(hash);
			}
			return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
		},
		propagation: hasStyles ? "self" : "none"
	});
	Object.defineProperty(Component, "toJSON", {
		value: () => meta,
		enumerable: false
	});
	return Object.assign(Component, meta);
}
var ATTRS_TO_DROP = [
	"xmlns",
	"xmlns:xlink",
	"version"
];
var DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
	for (const attr of ATTRS_TO_DROP) delete attributes[attr];
	return attributes;
}
function normalizeProps(attributes, props) {
	return dropAttributes({
		...DEFAULT_ATTRS,
		...attributes,
		...props
	});
}
var CONTENT_IMAGE_FLAG = "astroContentImageFlag";
var DATA_STORE_VIRTUAL_ID = "astro:data-layer-content";
var IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";
`${DATA_STORE_VIRTUAL_ID}`;
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/assets/utils/resolveImports.js
function imageSrcToImportId(imageSrc, filePath) {
	imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
	if (isRemotePath(imageSrc)) return;
	const ext = imageSrc.split(".").at(-1)?.toLowerCase();
	if (!ext || !VALID_INPUT_FORMATS.includes(ext)) return;
	const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
	if (filePath) params.set("importer", filePath);
	return `${imageSrc}?${params.toString()}`;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/content/data-store-source.js
var InMemorySource = class {
	#store;
	constructor(store) {
		this.#store = store;
	}
	hasCollection(collection) {
		return this.#store.hasCollection(collection);
	}
	get(collection, key) {
		return this.#store.get(collection, key);
	}
	entries(collection) {
		return this.#store.entries(collection);
	}
	values(collection) {
		return this.#store.values(collection);
	}
	keys(collection) {
		return this.#store.keys(collection);
	}
	has(collection, key) {
		return this.#store.has(collection, key);
	}
	collections() {
		return this.#store.collections();
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/content/data-store.js
var ImmutableDataStore = class ImmutableDataStore {
	_collections = /* @__PURE__ */ new Map();
	constructor() {
		this._collections = /* @__PURE__ */ new Map();
	}
	get(collectionName, key) {
		return this._collections.get(collectionName)?.get(String(key));
	}
	entries(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).entries()];
	}
	values(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).values()];
	}
	keys(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).keys()];
	}
	has(collectionName, key) {
		const collection = this._collections.get(collectionName);
		if (collection) return collection.has(String(key));
		return false;
	}
	hasCollection(collectionName) {
		return this._collections.has(collectionName);
	}
	collections() {
		return this._collections;
	}
	/**
	* Rebuilds a collections map from a chunked-store manifest whose part file
	* names have already been swapped for their contents.
	*
	* Each collection maps to a list of parts. A part is either a raw string
	* (when the store is loaded from disk) or an ESM namespace from a virtual
	* chunk import (`{ default: string }`, when emitted at runtime). A collection's
	* parts are concatenated back into the exact
	* serialized string, then parsed with devalue. This is the inverse of
	* {@link import('./data-store-writer.js').ChunkedWriter} and stays free of
	* Node built-ins so it can run at runtime.
	*/
	static manifestToMap(manifest) {
		const collections = /* @__PURE__ */ new Map();
		for (const [collectionName, parts] of Object.entries(manifest)) {
			let stringified = "";
			for (const part of parts) stringified += typeof part === "string" ? part : part.default;
			const entries = parse(stringified);
			collections.set(collectionName, entries);
		}
		return collections;
	}
	/**
	* Attempts to load a DataStore from the virtual module.
	* This only works in Vite.
	*/
	static async fromModule() {
		try {
			const data = await import("./_astro_data-layer-content_DGCZHsR4.mjs");
			if (data.default instanceof Map) return ImmutableDataStore.fromMap(data.default);
			if (Array.isArray(data.default)) {
				const map2 = unflatten(data.default);
				return ImmutableDataStore.fromMap(map2);
			}
			const map = ImmutableDataStore.manifestToMap(data.default);
			return ImmutableDataStore.fromMap(map);
		} catch {}
		return new ImmutableDataStore();
	}
	static async fromMap(data) {
		const store = new ImmutableDataStore();
		store._collections = data;
		return store;
	}
};
function dataStoreSingleton() {
	let instance = void 0;
	return {
		get: async () => {
			if (!instance) instance = ImmutableDataStore.fromModule().then((store) => new InMemorySource(store));
			return instance;
		},
		set: (store) => {
			instance = new InMemorySource(store);
		}
	};
}
var globalDataStore = dataStoreSingleton();
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/content/loaders/errors.js
function formatZodError(error) {
	return error.issues.map((issue) => `  **${issue.path.join(".")}**: ${issue.message}`);
}
var LiveCollectionError = class LiveCollectionError extends Error {
	collection;
	message;
	cause;
	constructor(collection, message, cause) {
		super(message);
		this.collection = collection;
		this.message = message;
		this.cause = cause;
		this.name = "LiveCollectionError";
		if (cause?.stack) this.stack = cause.stack;
	}
	static is(error) {
		return error instanceof LiveCollectionError;
	}
};
var LiveEntryNotFoundError = class extends LiveCollectionError {
	constructor(collection, entryFilter) {
		super(collection, `Entry ${collection} \u2192 ${typeof entryFilter === "string" ? entryFilter : JSON.stringify(entryFilter)} was not found.`);
		this.name = "LiveEntryNotFoundError";
	}
	static is(error) {
		return error?.name === "LiveEntryNotFoundError";
	}
};
var LiveCollectionValidationError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${collection} \u2192 ${entryId}** data does not match the collection schema.
`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionValidationError";
	}
	static is(error) {
		return error?.name === "LiveCollectionValidationError";
	}
};
var LiveCollectionCacheHintError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${String(collection)}${entryId ? ` \u2192 ${String(entryId)}` : ""}** returned an invalid cache hint.
`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionCacheHintError";
	}
	static is(error) {
		return error?.name === "LiveCollectionCacheHintError";
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/content/runtime.js
var cacheHintSchema = object({
	tags: array(string()).optional(),
	lastModified: date().optional()
});
async function parseLiveEntry(entry, schema, collection) {
	try {
		const parsed = await safeParseAsync(schema, entry.data);
		if (!parsed.success) return { error: new LiveCollectionValidationError(collection, entry.id, parsed.error) };
		if (entry.cacheHint) {
			const cacheHint = cacheHintSchema.safeParse(entry.cacheHint);
			if (!cacheHint.success) return { error: new LiveCollectionCacheHintError(collection, entry.id, cacheHint.error) };
			entry.cacheHint = cacheHint.data;
		}
		return { entry: {
			...entry,
			data: parsed.data
		} };
	} catch (error) {
		return { error: new LiveCollectionError(collection, `Unexpected error parsing entry ${entry.id} in collection ${collection}`, error) };
	}
}
function createGetCollection({ liveCollections }) {
	return async function getCollection(collection, filter) {
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
		});
		const hasFilter = typeof filter === "function";
		const store = await globalDataStore.get();
		if (await store.hasCollection(collection)) {
			const { default: imageAssetMap } = await import("./content-assets_DXqEyLLP.mjs");
			const result = [];
			for (const rawEntry of await store.values(collection)) {
				const data = resolveEntryData(rawEntry, imageAssetMap);
				let entry = {
					...rawEntry,
					data,
					collection
				};
				if (hasFilter && !filter(entry)) continue;
				result.push(entry);
			}
			return result;
		} else {
			console.warn(`The collection ${JSON.stringify(collection)} does not exist or is empty. Please check your content config file for errors.`);
			return [];
		}
	};
}
function createGetEntry({ liveCollections }) {
	return async function getEntry(collectionOrLookupObject, lookup) {
		let collection, lookupId;
		if (typeof collectionOrLookupObject === "string") {
			collection = collectionOrLookupObject;
			if (!lookup) throw new AstroError({
				...UnknownContentCollectionError,
				message: "`getEntry()` requires an entry identifier as the second argument."
			});
			lookupId = lookup;
		} else {
			collection = collectionOrLookupObject.collection;
			lookupId = "id" in collectionOrLookupObject ? collectionOrLookupObject.id : collectionOrLookupObject.slug;
		}
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveEntry() instead of getEntry().`
		});
		if (typeof lookupId === "object") throw new AstroError({
			...UnknownContentCollectionError,
			message: `The entry identifier must be a string. Received object.`
		});
		const store = await globalDataStore.get();
		if (await store.hasCollection(collection)) {
			const entry = await store.get(collection, lookupId);
			if (!entry) {
				console.warn(`Entry ${collection} → ${lookupId} was not found.`);
				return;
			}
			const { default: imageAssetMap } = await import("./content-assets_DXqEyLLP.mjs");
			const data = resolveEntryData(entry, imageAssetMap);
			const result = {
				...entry,
				data,
				collection
			};
			warnForPropertyAccess(result.data, "slug", `[content] Attempted to access deprecated property on "${collection}" entry.
The "slug" property is no longer automatically added to entries. Please use the "id" property instead.`);
			warnForPropertyAccess(result, "render", `[content] Invalid attempt to access "render()" method on "${collection}" entry.
To render an entry, use "render(entry)" from "astro:content".`);
			return result;
		}
	};
}
function warnForPropertyAccess(entry, prop, message) {
	if (!(prop in entry)) {
		let _value = void 0;
		Object.defineProperty(entry, prop, {
			get() {
				if (_value === void 0) console.error(message);
				return _value;
			},
			set(v) {
				_value = v;
			},
			enumerable: false
		});
	}
}
function createGetLiveCollection({ liveCollections }) {
	return async function getLiveCollection(collection, filter) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveCollection() to load regular content collections.`) };
		try {
			const context = {
				filter,
				collection
			};
			const response = await liveCollections[collection].loader?.loadCollection?.(context);
			if (response && "error" in response) return { error: response.error };
			const { schema } = liveCollections[collection];
			let processedEntries = response.entries;
			if (schema) {
				const entryResults = await Promise.all(response.entries.map((entry) => parseLiveEntry(entry, schema, collection)));
				for (const result of entryResults) if (result.error) return { error: result.error };
				processedEntries = entryResults.map((result) => result.entry);
			}
			let cacheHint = response.cacheHint;
			if (cacheHint) {
				const cacheHintResult = cacheHintSchema.safeParse(cacheHint);
				if (!cacheHintResult.success) return { error: new LiveCollectionCacheHintError(collection, void 0, cacheHintResult.error) };
				cacheHint = cacheHintResult.data;
			}
			if (processedEntries.length > 0) {
				const entryTags = /* @__PURE__ */ new Set();
				let latestModified;
				for (const entry of processedEntries) if (entry.cacheHint) {
					if (entry.cacheHint.tags) entry.cacheHint.tags.forEach((tag) => entryTags.add(tag));
					if (entry.cacheHint.lastModified instanceof Date) {
						if (latestModified === void 0 || entry.cacheHint.lastModified > latestModified) latestModified = entry.cacheHint.lastModified;
					}
				}
				if (entryTags.size > 0 || latestModified || cacheHint) {
					const mergedCacheHint = {};
					if (cacheHint?.tags || entryTags.size > 0) mergedCacheHint.tags = [.../* @__PURE__ */ new Set([...cacheHint?.tags || [], ...entryTags])];
					if (cacheHint?.lastModified && latestModified) mergedCacheHint.lastModified = cacheHint.lastModified > latestModified ? cacheHint.lastModified : latestModified;
					else if (cacheHint?.lastModified || latestModified) mergedCacheHint.lastModified = cacheHint?.lastModified ?? latestModified;
					cacheHint = mergedCacheHint;
				}
			}
			return {
				entries: processedEntries,
				cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading collection ${collection}${error instanceof Error ? `: ${error.message}` : ""}`, error) };
		}
	};
}
function createGetLiveEntry({ liveCollections }) {
	return async function getLiveEntry(collection, lookup) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveEntry() to load regular content collections.`) };
		try {
			const lookupObject = {
				filter: typeof lookup === "string" ? { id: lookup } : lookup,
				collection
			};
			let entry = await liveCollections[collection].loader?.loadEntry?.(lookupObject);
			if (entry && "error" in entry) return { error: entry.error };
			if (!entry) return { error: new LiveEntryNotFoundError(collection, lookup) };
			const { schema } = liveCollections[collection];
			if (schema) {
				const result = await parseLiveEntry(entry, schema, collection);
				if (result.error) return { error: result.error };
				entry = result.entry;
			}
			return {
				entry,
				cacheHint: entry.cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading entry ${collection} → ${typeof lookup === "string" ? lookup : JSON.stringify(lookup)}`, error) };
		}
	};
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
	const copy = structuredClone(data);
	forEach(copy, function(ctx, val) {
		if (typeof val === "string" && val.startsWith("__ASTRO_IMAGE_")) {
			const src = val.replace(IMAGE_IMPORT_PREFIX, "");
			const id = imageSrcToImportId(src, fileName);
			if (!id) {
				ctx.update(src);
				return;
			}
			const imported = imageAssetMap?.get(id);
			if (imported) {
				if (imported.__svgData) {
					const { __svgData: svgData, ...meta } = imported;
					ctx.update(createSvgComponent({
						meta,
						...svgData
					}));
				} else ctx.update(imported);
			} else ctx.update(src);
		}
	});
	return copy;
}
function resolveEntryData(entry, imageAssetMap) {
	return entry.assetImports?.length ? updateImageReferencesInData(entry.data, entry.filePath, imageAssetMap) : structuredClone(entry.data);
}
//#endregion
//#region \0astro:content
var liveCollections = {};
var getCollection = createGetCollection({ liveCollections });
createGetEntry({ liveCollections });
createGetLiveCollection({ liveCollections });
createGetLiveEntry({ liveCollections });
//#endregion
//#region src/pages/editor.astro
var editor_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Editor,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Editor = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Editor;
	{
		const session = getSessionFromCookie(Astro2.request.headers.get("Cookie"));
		if (!session || !isEmailAllowed(session.email)) return Astro2.redirect("/api/auth/login");
	}
	const existing = (await getCollection("constellations")).map((e) => ({
		id: e.id,
		name: e.data.name,
		subtitle: e.data.subtitle,
		color: e.data.color,
		center: e.data.center,
		stars: e.data.stars,
		lines: e.data.lines,
		body: e.body || ""
	}));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Constellation Editor — Tiny Lore",
		"data-astro-cid-h3dqbmh2": true
	}, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="editor-layout" data-astro-cid-h3dqbmh2><aside class="sidebar" data-astro-cid-h3dqbmh2><h1 class="editor-title" data-astro-cid-h3dqbmh2>Constellation Editor</h1><div class="field" data-astro-cid-h3dqbmh2><label data-astro-cid-h3dqbmh2>Load Existing</label><div class="load-buttons" data-astro-cid-h3dqbmh2><button class="load-btn" data-id="" data-astro-cid-h3dqbmh2>New</button>${existing.map((c) => renderTemplate`<button class="load-btn"${addAttribute(c.id, "data-id")} data-astro-cid-h3dqbmh2>${c.name}</button>`)}</div></div><div class="field" data-astro-cid-h3dqbmh2><label for="name" data-astro-cid-h3dqbmh2>Name</label><input type="text" id="name" placeholder="The Bear" data-astro-cid-h3dqbmh2></div><div class="field" data-astro-cid-h3dqbmh2><label for="subtitle" data-astro-cid-h3dqbmh2>Subtitle</label><input type="text" id="subtitle" placeholder="Guardian of the Forest" data-astro-cid-h3dqbmh2></div><div class="field" data-astro-cid-h3dqbmh2><label for="color" data-astro-cid-h3dqbmh2>Color</label><input type="color" id="color" value="#c9a84c" data-astro-cid-h3dqbmh2></div><div class="field" data-astro-cid-h3dqbmh2><label for="filename" data-astro-cid-h3dqbmh2>Filename</label><input type="text" id="filename" placeholder="bear" data-astro-cid-h3dqbmh2></div><div class="field" data-astro-cid-h3dqbmh2><label data-astro-cid-h3dqbmh2>World Position <span id="center-coords" class="center-coords" data-astro-cid-h3dqbmh2>(0, 0)</span></label><canvas id="minimap" width="260" height="260" data-astro-cid-h3dqbmh2></canvas></div><div class="tools" data-astro-cid-h3dqbmh2><h2 data-astro-cid-h3dqbmh2>Tools</h2><div class="tool-buttons" data-astro-cid-h3dqbmh2><button id="mode-star" class="tool-btn active" data-astro-cid-h3dqbmh2>Place Stars</button><button id="mode-line" class="tool-btn" data-astro-cid-h3dqbmh2>Draw Lines</button><button id="mode-delete" class="tool-btn" data-astro-cid-h3dqbmh2>Delete</button></div></div><div class="info" data-astro-cid-h3dqbmh2><p id="star-count" data-astro-cid-h3dqbmh2>Stars: 0</p><p id="line-count" data-astro-cid-h3dqbmh2>Lines: 0</p></div><div class="field" data-astro-cid-h3dqbmh2><label for="story" data-astro-cid-h3dqbmh2>Story</label><textarea id="story" placeholder="Write your story here..." data-astro-cid-h3dqbmh2></textarea></div><div class="actions" data-astro-cid-h3dqbmh2><button id="btn-undo" class="action-btn" data-astro-cid-h3dqbmh2>Undo</button><button id="btn-clear" class="action-btn" data-astro-cid-h3dqbmh2>Clear All</button><button id="btn-save" class="action-btn primary" data-astro-cid-h3dqbmh2>Save Constellation</button><button id="btn-export" class="action-btn" data-astro-cid-h3dqbmh2>Copy Markdown</button></div><div id="save-feedback" class="feedback hidden" data-astro-cid-h3dqbmh2></div><div class="help" data-astro-cid-h3dqbmh2><h2 data-astro-cid-h3dqbmh2>How to use</h2><ul data-astro-cid-h3dqbmh2><li data-astro-cid-h3dqbmh2><strong data-astro-cid-h3dqbmh2>Place Stars</strong> — click on the canvas to add stars</li><li data-astro-cid-h3dqbmh2><strong data-astro-cid-h3dqbmh2>Draw Lines</strong> — click two stars to connect them</li><li data-astro-cid-h3dqbmh2><strong data-astro-cid-h3dqbmh2>Delete</strong> — click a star or line to remove it</li><li data-astro-cid-h3dqbmh2><strong data-astro-cid-h3dqbmh2>World Position</strong> — click the mini-map to place your constellation in the sky</li><li data-astro-cid-h3dqbmh2>The crosshair shows the center (0, 0)</li></ul></div></aside><main class="canvas-area" data-astro-cid-h3dqbmh2><canvas id="editor-canvas" data-astro-cid-h3dqbmh2></canvas></main><script type="application/json" id="existing-data">${unescapeHTML(JSON.stringify(existing))}<\/script></div>` })}${renderScript($$result, "/Users/ryansickle/dev/personal/tiny-lore/src/pages/editor.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/ryansickle/dev/personal/tiny-lore/src/pages/editor.astro", void 0);
var $$file = "/Users/ryansickle/dev/personal/tiny-lore/src/pages/editor.astro";
var $$url = "/editor";
//#endregion
//#region \0virtual:astro:page:src/pages/editor@_@astro
var page = () => editor_exports;
//#endregion
export { page };
