import { i as __require, n as __esmMin, o as __toESM, r as __exportAll, t as __commonJSMin } from "./chunks/rolldown-runtime_BMI-E3GI.mjs";
import { B as PrerenderClientAddressNotAvailable, D as MiddlewareNoDataOrNextCalled, E as LocalsReassigned, G as RewriteWithBodyUsed, K as StaticClientAddressNotAvailable, L as NoMatchingStaticPathFound, O as MiddlewareNotAResponse, Q as AstroError, S as InvalidGetStaticPathsReturn, T as LocalsNotAnObject, U as ReservedSlotName, V as PrerenderDynamicEndpointPathCollide, W as ResponseSentError, Z as i18nNoLocaleFoundInPath, _ as GetStaticPathsRequired, a as ClientAddressNotAvailable, g as GetStaticPathsInvalidRouteParam, h as GetStaticPathsExpectedParams, i as CacheNotEnabled, n as ActionsReturnedInvalidDataError, p as ForbiddenRewrite, r as AstroResponseHeadersReassigned, t as ActionNotFoundError, x as InvalidGetStaticPathsEntry, z as PageNumberParamNotFound } from "./chunks/errors-data_BL3JF-UK.mjs";
import { a as matchPattern } from "./chunks/remoteProbe_BTYCCPub.mjs";
import { a as fileExtension, f as removeLeadingForwardSlash, g as trimSlashes, h as slash, i as collapseDuplicateTrailingSlashes, l as joinPaths, m as removeTrailingForwardSlash, n as collapseDuplicateLeadingSlashes, o as hasFileExtension, r as collapseDuplicateSlashes, s as isInternalPath, t as appendForwardSlash, u as prependForwardSlash } from "./chunks/path_CsjwVQRw.mjs";
import { A as renderEndpoint, B as appSymbol, D as pushDirective, E as normalizeCspResourceEntry, F as ASTRO_ERROR_HEADER, G as responseSentSymbol$1, H as fetchStateSymbol, I as ASTRO_GENERATOR, K as s, L as DEFAULT_404_COMPONENT, M as isRoute404, N as isRoute500, O as isAstroComponentFactory, P as escape, R as REDIRECT_STATUS_CODES, T as isRenderInstruction, U as originPathnameSymbol, V as clientAddressSymbol, W as pipelineSymbol, a as chunkToString, c as renderSlotToString, d as decodeKey, f as decryptString, i as renderComponent, l as isRenderTemplateResult, n as renderPage, o as createSlotValueFromString, p as generateCspDigest, r as renderJSX, u as renderTemplate, z as REROUTABLE_STATUS_CODES } from "./chunks/server_DmrQpqP_.mjs";
import { a as encode64, c as stringify_string, i as merge_operations, o as DevalueError, r as default_stringify_operations, s as stringify_key, t as parse$2 } from "./chunks/parse_DN83ZD-A.mjs";
import nodePath from "node:path";
import React, { createElement, memo } from "react";
import ReactDOM from "react-dom/server";
//#endregion
//#region node_modules/.pnpm/path-to-regexp@6.1.0/node_modules/path-to-regexp/dist.es2015/index.js
var dist_es2015_exports$1 = /* @__PURE__ */ __exportAll({
	compile: () => compile$1,
	match: () => match$1,
	parse: () => parse$1,
	pathToRegexp: () => pathToRegexp$1,
	regexpToFunction: () => regexpToFunction$1,
	tokensToFunction: () => tokensToFunction$1,
	tokensToRegexp: () => tokensToRegexp$1
});
/**
* Tokenize input string.
*/
function lexer$1(str) {
	var tokens = [];
	var i = 0;
	while (i < str.length) {
		var char = str[i];
		if (char === "*" || char === "+" || char === "?") {
			tokens.push({
				type: "MODIFIER",
				index: i,
				value: str[i++]
			});
			continue;
		}
		if (char === "\\") {
			tokens.push({
				type: "ESCAPED_CHAR",
				index: i++,
				value: str[i++]
			});
			continue;
		}
		if (char === "{") {
			tokens.push({
				type: "OPEN",
				index: i,
				value: str[i++]
			});
			continue;
		}
		if (char === "}") {
			tokens.push({
				type: "CLOSE",
				index: i,
				value: str[i++]
			});
			continue;
		}
		if (char === ":") {
			var name = "";
			var j = i + 1;
			while (j < str.length) {
				var code = str.charCodeAt(j);
				if (code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 95) {
					name += str[j++];
					continue;
				}
				break;
			}
			if (!name) throw new TypeError("Missing parameter name at " + i);
			tokens.push({
				type: "NAME",
				index: i,
				value: name
			});
			i = j;
			continue;
		}
		if (char === "(") {
			var count = 1;
			var pattern = "";
			var j = i + 1;
			if (str[j] === "?") throw new TypeError("Pattern cannot start with \"?\" at " + j);
			while (j < str.length) {
				if (str[j] === "\\") {
					pattern += str[j++] + str[j++];
					continue;
				}
				if (str[j] === ")") {
					count--;
					if (count === 0) {
						j++;
						break;
					}
				} else if (str[j] === "(") {
					count++;
					if (str[j + 1] !== "?") throw new TypeError("Capturing groups are not allowed at " + j);
				}
				pattern += str[j++];
			}
			if (count) throw new TypeError("Unbalanced pattern at " + i);
			if (!pattern) throw new TypeError("Missing pattern at " + i);
			tokens.push({
				type: "PATTERN",
				index: i,
				value: pattern
			});
			i = j;
			continue;
		}
		tokens.push({
			type: "CHAR",
			index: i,
			value: str[i++]
		});
	}
	tokens.push({
		type: "END",
		index: i,
		value: ""
	});
	return tokens;
}
/**
* Parse a string for the raw tokens.
*/
function parse$1(str, options) {
	if (options === void 0) options = {};
	var tokens = lexer$1(str);
	var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
	var defaultPattern = "[^" + escapeString$1(options.delimiter || "/#?") + "]+?";
	var result = [];
	var key = 0;
	var i = 0;
	var path = "";
	var tryConsume = function(type) {
		if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
	};
	var mustConsume = function(type) {
		var value = tryConsume(type);
		if (value !== void 0) return value;
		var _a = tokens[i], nextType = _a.type, index = _a.index;
		throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
	};
	var consumeText = function() {
		var result = "";
		var value;
		while (value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) result += value;
		return result;
	};
	while (i < tokens.length) {
		var char = tryConsume("CHAR");
		var name = tryConsume("NAME");
		var pattern = tryConsume("PATTERN");
		if (name || pattern) {
			var prefix = char || "";
			if (prefixes.indexOf(prefix) === -1) {
				path += prefix;
				prefix = "";
			}
			if (path) {
				result.push(path);
				path = "";
			}
			result.push({
				name: name || key++,
				prefix,
				suffix: "",
				pattern: pattern || defaultPattern,
				modifier: tryConsume("MODIFIER") || ""
			});
			continue;
		}
		var value = char || tryConsume("ESCAPED_CHAR");
		if (value) {
			path += value;
			continue;
		}
		if (path) {
			result.push(path);
			path = "";
		}
		if (tryConsume("OPEN")) {
			var prefix = consumeText();
			var name_1 = tryConsume("NAME") || "";
			var pattern_1 = tryConsume("PATTERN") || "";
			var suffix = consumeText();
			mustConsume("CLOSE");
			result.push({
				name: name_1 || (pattern_1 ? key++ : ""),
				pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
				prefix,
				suffix,
				modifier: tryConsume("MODIFIER") || ""
			});
			continue;
		}
		mustConsume("END");
	}
	return result;
}
/**
* Compile a string to a template function for the path.
*/
function compile$1(str, options) {
	return tokensToFunction$1(parse$1(str, options), options);
}
/**
* Expose a method for transforming tokens into the path function.
*/
function tokensToFunction$1(tokens, options) {
	if (options === void 0) options = {};
	var reFlags = flags$1(options);
	var _a = options.encode, encode = _a === void 0 ? function(x) {
		return x;
	} : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
	var matches = tokens.map(function(token) {
		if (typeof token === "object") return new RegExp("^(?:" + token.pattern + ")$", reFlags);
	});
	return function(data) {
		var path = "";
		for (var i = 0; i < tokens.length; i++) {
			var token = tokens[i];
			if (typeof token === "string") {
				path += token;
				continue;
			}
			var value = data ? data[token.name] : void 0;
			var optional = token.modifier === "?" || token.modifier === "*";
			var repeat = token.modifier === "*" || token.modifier === "+";
			if (Array.isArray(value)) {
				if (!repeat) throw new TypeError("Expected \"" + token.name + "\" to not repeat, but got an array");
				if (value.length === 0) {
					if (optional) continue;
					throw new TypeError("Expected \"" + token.name + "\" to not be empty");
				}
				for (var j = 0; j < value.length; j++) {
					var segment = encode(value[j], token);
					if (validate && !matches[i].test(segment)) throw new TypeError("Expected all \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
					path += token.prefix + segment + token.suffix;
				}
				continue;
			}
			if (typeof value === "string" || typeof value === "number") {
				var segment = encode(String(value), token);
				if (validate && !matches[i].test(segment)) throw new TypeError("Expected \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
				path += token.prefix + segment + token.suffix;
				continue;
			}
			if (optional) continue;
			var typeOfMessage = repeat ? "an array" : "a string";
			throw new TypeError("Expected \"" + token.name + "\" to be " + typeOfMessage);
		}
		return path;
	};
}
/**
* Create path match function from `path-to-regexp` spec.
*/
function match$1(str, options) {
	var keys = [];
	return regexpToFunction$1(pathToRegexp$1(str, keys, options), keys, options);
}
/**
* Create a path match function from `path-to-regexp` output.
*/
function regexpToFunction$1(re, keys, options) {
	if (options === void 0) options = {};
	var _a = options.decode, decode = _a === void 0 ? function(x) {
		return x;
	} : _a;
	return function(pathname) {
		var m = re.exec(pathname);
		if (!m) return false;
		var path = m[0], index = m.index;
		var params = Object.create(null);
		var _loop_1 = function(i) {
			if (m[i] === void 0) return "continue";
			var key = keys[i - 1];
			if (key.modifier === "*" || key.modifier === "+") params[key.name] = m[i].split(key.prefix + key.suffix).map(function(value) {
				return decode(value, key);
			});
			else params[key.name] = decode(m[i], key);
		};
		for (var i = 1; i < m.length; i++) _loop_1(i);
		return {
			path,
			index,
			params
		};
	};
}
/**
* Escape a regular expression string.
*/
function escapeString$1(str) {
	return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
* Get the flags for a regexp from the options.
*/
function flags$1(options) {
	return options && options.sensitive ? "" : "i";
}
/**
* Pull out keys from a regexp.
*/
function regexpToRegexp$1(path, keys) {
	if (!keys) return path;
	var groups = path.source.match(/\((?!\?)/g);
	if (groups) for (var i = 0; i < groups.length; i++) keys.push({
		name: i,
		prefix: "",
		suffix: "",
		modifier: "",
		pattern: ""
	});
	return path;
}
/**
* Transform an array into a regexp.
*/
function arrayToRegexp$1(paths, keys, options) {
	var parts = paths.map(function(path) {
		return pathToRegexp$1(path, keys, options).source;
	});
	return new RegExp("(?:" + parts.join("|") + ")", flags$1(options));
}
/**
* Create a path regexp from string input.
*/
function stringToRegexp$1(path, keys, options) {
	return tokensToRegexp$1(parse$1(path, options), keys, options);
}
/**
* Expose a function for taking tokens and returning a RegExp.
*/
function tokensToRegexp$1(tokens, keys, options) {
	if (options === void 0) options = {};
	var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
		return x;
	} : _d;
	var endsWith = "[" + escapeString$1(options.endsWith || "") + "]|$";
	var delimiter = "[" + escapeString$1(options.delimiter || "/#?") + "]";
	var route = start ? "^" : "";
	for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
		var token = tokens_1[_i];
		if (typeof token === "string") route += escapeString$1(encode(token));
		else {
			var prefix = escapeString$1(encode(token.prefix));
			var suffix = escapeString$1(encode(token.suffix));
			if (token.pattern) {
				if (keys) keys.push(token);
				if (prefix || suffix) {
					if (token.modifier === "+" || token.modifier === "*") {
						var mod = token.modifier === "*" ? "?" : "";
						route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
					} else route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
				} else route += "(" + token.pattern + ")" + token.modifier;
			} else route += "(?:" + prefix + suffix + ")" + token.modifier;
		}
	}
	if (end) {
		if (!strict) route += delimiter + "?";
		route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
	} else {
		var endToken = tokens[tokens.length - 1];
		var isEndDelimited = typeof endToken === "string" ? delimiter.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
		if (!strict) route += "(?:" + delimiter + "(?=" + endsWith + "))?";
		if (!isEndDelimited) route += "(?=" + delimiter + "|" + endsWith + ")";
	}
	return new RegExp(route, flags$1(options));
}
/**
* Normalize the given path string, returning a regular expression.
*
* An empty array can be passed in for the keys, which will hold the
* placeholder key descriptions. For example, using `/user/:id`, `keys` will
* contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
*/
function pathToRegexp$1(path, keys, options) {
	if (path instanceof RegExp) return regexpToRegexp$1(path, keys);
	if (Array.isArray(path)) return arrayToRegexp$1(path, keys, options);
	return stringToRegexp$1(path, keys, options);
}
__esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/path-to-regexp@6.3.0/node_modules/path-to-regexp/dist.es2015/index.js
var dist_es2015_exports = /* @__PURE__ */ __exportAll({
	compile: () => compile,
	match: () => match,
	parse: () => parse,
	pathToRegexp: () => pathToRegexp,
	regexpToFunction: () => regexpToFunction,
	tokensToFunction: () => tokensToFunction,
	tokensToRegexp: () => tokensToRegexp
});
/**
* Tokenize input string.
*/
function lexer(str) {
	var tokens = [];
	var i = 0;
	while (i < str.length) {
		var char = str[i];
		if (char === "*" || char === "+" || char === "?") {
			tokens.push({
				type: "MODIFIER",
				index: i,
				value: str[i++]
			});
			continue;
		}
		if (char === "\\") {
			tokens.push({
				type: "ESCAPED_CHAR",
				index: i++,
				value: str[i++]
			});
			continue;
		}
		if (char === "{") {
			tokens.push({
				type: "OPEN",
				index: i,
				value: str[i++]
			});
			continue;
		}
		if (char === "}") {
			tokens.push({
				type: "CLOSE",
				index: i,
				value: str[i++]
			});
			continue;
		}
		if (char === ":") {
			var name = "";
			var j = i + 1;
			while (j < str.length) {
				var code = str.charCodeAt(j);
				if (code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 95) {
					name += str[j++];
					continue;
				}
				break;
			}
			if (!name) throw new TypeError("Missing parameter name at ".concat(i));
			tokens.push({
				type: "NAME",
				index: i,
				value: name
			});
			i = j;
			continue;
		}
		if (char === "(") {
			var count = 1;
			var pattern = "";
			var j = i + 1;
			if (str[j] === "?") throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
			while (j < str.length) {
				if (str[j] === "\\") {
					pattern += str[j++] + str[j++];
					continue;
				}
				if (str[j] === ")") {
					count--;
					if (count === 0) {
						j++;
						break;
					}
				} else if (str[j] === "(") {
					count++;
					if (str[j + 1] !== "?") throw new TypeError("Capturing groups are not allowed at ".concat(j));
				}
				pattern += str[j++];
			}
			if (count) throw new TypeError("Unbalanced pattern at ".concat(i));
			if (!pattern) throw new TypeError("Missing pattern at ".concat(i));
			tokens.push({
				type: "PATTERN",
				index: i,
				value: pattern
			});
			i = j;
			continue;
		}
		tokens.push({
			type: "CHAR",
			index: i,
			value: str[i++]
		});
	}
	tokens.push({
		type: "END",
		index: i,
		value: ""
	});
	return tokens;
}
/**
* Parse a string for the raw tokens.
*/
function parse(str, options) {
	if (options === void 0) options = {};
	var tokens = lexer(str);
	var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
	var result = [];
	var key = 0;
	var i = 0;
	var path = "";
	var tryConsume = function(type) {
		if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
	};
	var mustConsume = function(type) {
		var value = tryConsume(type);
		if (value !== void 0) return value;
		var _a = tokens[i], nextType = _a.type, index = _a.index;
		throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
	};
	var consumeText = function() {
		var result = "";
		var value;
		while (value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) result += value;
		return result;
	};
	var isSafe = function(value) {
		for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
			var char = delimiter_1[_i];
			if (value.indexOf(char) > -1) return true;
		}
		return false;
	};
	var safePattern = function(prefix) {
		var prev = result[result.length - 1];
		var prevText = prefix || (prev && typeof prev === "string" ? prev : "");
		if (prev && !prevText) throw new TypeError("Must have text between two parameters, missing text after \"".concat(prev.name, "\""));
		if (!prevText || isSafe(prevText)) return "[^".concat(escapeString(delimiter), "]+?");
		return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
	};
	while (i < tokens.length) {
		var char = tryConsume("CHAR");
		var name = tryConsume("NAME");
		var pattern = tryConsume("PATTERN");
		if (name || pattern) {
			var prefix = char || "";
			if (prefixes.indexOf(prefix) === -1) {
				path += prefix;
				prefix = "";
			}
			if (path) {
				result.push(path);
				path = "";
			}
			result.push({
				name: name || key++,
				prefix,
				suffix: "",
				pattern: pattern || safePattern(prefix),
				modifier: tryConsume("MODIFIER") || ""
			});
			continue;
		}
		var value = char || tryConsume("ESCAPED_CHAR");
		if (value) {
			path += value;
			continue;
		}
		if (path) {
			result.push(path);
			path = "";
		}
		if (tryConsume("OPEN")) {
			var prefix = consumeText();
			var name_1 = tryConsume("NAME") || "";
			var pattern_1 = tryConsume("PATTERN") || "";
			var suffix = consumeText();
			mustConsume("CLOSE");
			result.push({
				name: name_1 || (pattern_1 ? key++ : ""),
				pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
				prefix,
				suffix,
				modifier: tryConsume("MODIFIER") || ""
			});
			continue;
		}
		mustConsume("END");
	}
	return result;
}
/**
* Compile a string to a template function for the path.
*/
function compile(str, options) {
	return tokensToFunction(parse(str, options), options);
}
/**
* Expose a method for transforming tokens into the path function.
*/
function tokensToFunction(tokens, options) {
	if (options === void 0) options = {};
	var reFlags = flags(options);
	var _a = options.encode, encode = _a === void 0 ? function(x) {
		return x;
	} : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
	var matches = tokens.map(function(token) {
		if (typeof token === "object") return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
	});
	return function(data) {
		var path = "";
		for (var i = 0; i < tokens.length; i++) {
			var token = tokens[i];
			if (typeof token === "string") {
				path += token;
				continue;
			}
			var value = data ? data[token.name] : void 0;
			var optional = token.modifier === "?" || token.modifier === "*";
			var repeat = token.modifier === "*" || token.modifier === "+";
			if (Array.isArray(value)) {
				if (!repeat) throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
				if (value.length === 0) {
					if (optional) continue;
					throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
				}
				for (var j = 0; j < value.length; j++) {
					var segment = encode(value[j], token);
					if (validate && !matches[i].test(segment)) throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
					path += token.prefix + segment + token.suffix;
				}
				continue;
			}
			if (typeof value === "string" || typeof value === "number") {
				var segment = encode(String(value), token);
				if (validate && !matches[i].test(segment)) throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
				path += token.prefix + segment + token.suffix;
				continue;
			}
			if (optional) continue;
			var typeOfMessage = repeat ? "an array" : "a string";
			throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
		}
		return path;
	};
}
/**
* Create path match function from `path-to-regexp` spec.
*/
function match(str, options) {
	var keys = [];
	return regexpToFunction(pathToRegexp(str, keys, options), keys, options);
}
/**
* Create a path match function from `path-to-regexp` output.
*/
function regexpToFunction(re, keys, options) {
	if (options === void 0) options = {};
	var _a = options.decode, decode = _a === void 0 ? function(x) {
		return x;
	} : _a;
	return function(pathname) {
		var m = re.exec(pathname);
		if (!m) return false;
		var path = m[0], index = m.index;
		var params = Object.create(null);
		var _loop_1 = function(i) {
			if (m[i] === void 0) return "continue";
			var key = keys[i - 1];
			if (key.modifier === "*" || key.modifier === "+") params[key.name] = m[i].split(key.prefix + key.suffix).map(function(value) {
				return decode(value, key);
			});
			else params[key.name] = decode(m[i], key);
		};
		for (var i = 1; i < m.length; i++) _loop_1(i);
		return {
			path,
			index,
			params
		};
	};
}
/**
* Escape a regular expression string.
*/
function escapeString(str) {
	return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
* Get the flags for a regexp from the options.
*/
function flags(options) {
	return options && options.sensitive ? "" : "i";
}
/**
* Pull out keys from a regexp.
*/
function regexpToRegexp(path, keys) {
	if (!keys) return path;
	var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
	var index = 0;
	var execResult = groupsRegex.exec(path.source);
	while (execResult) {
		keys.push({
			name: execResult[1] || index++,
			prefix: "",
			suffix: "",
			modifier: "",
			pattern: ""
		});
		execResult = groupsRegex.exec(path.source);
	}
	return path;
}
/**
* Transform an array into a regexp.
*/
function arrayToRegexp(paths, keys, options) {
	var parts = paths.map(function(path) {
		return pathToRegexp(path, keys, options).source;
	});
	return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
/**
* Create a path regexp from string input.
*/
function stringToRegexp(path, keys, options) {
	return tokensToRegexp(parse(path, options), keys, options);
}
/**
* Expose a function for taking tokens and returning a RegExp.
*/
function tokensToRegexp(tokens, keys, options) {
	if (options === void 0) options = {};
	var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
		return x;
	} : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
	var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
	var delimiterRe = "[".concat(escapeString(delimiter), "]");
	var route = start ? "^" : "";
	for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
		var token = tokens_1[_i];
		if (typeof token === "string") route += escapeString(encode(token));
		else {
			var prefix = escapeString(encode(token.prefix));
			var suffix = escapeString(encode(token.suffix));
			if (token.pattern) {
				if (keys) keys.push(token);
				if (prefix || suffix) {
					if (token.modifier === "+" || token.modifier === "*") {
						var mod = token.modifier === "*" ? "?" : "";
						route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
					} else route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
				} else {
					if (token.modifier === "+" || token.modifier === "*") throw new TypeError("Can not repeat \"".concat(token.name, "\" without a prefix and suffix"));
					route += "(".concat(token.pattern, ")").concat(token.modifier);
				}
			} else route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
		}
	}
	if (end) {
		if (!strict) route += "".concat(delimiterRe, "?");
		route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
	} else {
		var endToken = tokens[tokens.length - 1];
		var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
		if (!strict) route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
		if (!isEndDelimited) route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
	}
	return new RegExp(route, flags(options));
}
/**
* Normalize the given path string, returning a regular expression.
*
* An empty array can be passed in for the keys, which will hold the
* placeholder key descriptions. For example, using `/user/:id`, `keys` will
* contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
*/
function pathToRegexp(path, keys, options) {
	if (path instanceof RegExp) return regexpToRegexp(path, keys);
	if (Array.isArray(path)) return arrayToRegexp(path, keys, options);
	return stringToRegexp(path, keys, options);
}
__esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/@vercel+routing-utils@5.3.3/node_modules/@vercel/routing-utils/dist/superstatic.js
var require_superstatic = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var superstatic_exports = {};
	__export(superstatic_exports, {
		collectHasSegments: () => collectHasSegments,
		convertCleanUrls: () => convertCleanUrls,
		convertHeaders: () => convertHeaders,
		convertRedirects: () => convertRedirects,
		convertRewrites: () => convertRewrites,
		convertTrailingSlash: () => convertTrailingSlash,
		getCleanUrls: () => getCleanUrls,
		pathToRegexp: () => pathToRegexp,
		sourceToRegex: () => sourceToRegex
	});
	module.exports = __toCommonJS(superstatic_exports);
	var import_url$1 = __require("url");
	var import_path_to_regexp = __toCommonJS(dist_es2015_exports$1);
	var import_path_to_regexp_updated = __toCommonJS(dist_es2015_exports);
	function cloneKeys(keys) {
		if (typeof keys === "undefined") return;
		return keys.slice(0);
	}
	function compareKeys(left, right) {
		return (typeof left === "undefined" ? "undefined" : left.toString()) === (typeof right === "undefined" ? "undefined" : right.toString());
	}
	function pathToRegexp(callerId, path, keys, options) {
		const newKeys = cloneKeys(keys);
		const currentRegExp = (0, import_path_to_regexp.pathToRegexp)(path, keys, options);
		try {
			const currentKeys = keys;
			const newRegExp = (0, import_path_to_regexp_updated.pathToRegexp)(path, newKeys, options);
			const isDiffRegExp = currentRegExp.toString() !== newRegExp.toString();
			if (process.env.FORCE_PATH_TO_REGEXP_LOG || isDiffRegExp) {
				const message = JSON.stringify({
					path,
					currentRegExp: currentRegExp.toString(),
					newRegExp: newRegExp.toString()
				});
				console.error(`[vc] PATH TO REGEXP PATH DIFF @ #${callerId}: ${message}`);
			}
			const isDiffKeys = !compareKeys(keys, newKeys);
			if (process.env.FORCE_PATH_TO_REGEXP_LOG || isDiffKeys) {
				const message = JSON.stringify({
					isDiffKeys,
					currentKeys,
					newKeys
				});
				console.error(`[vc] PATH TO REGEXP KEYS DIFF @ #${callerId}: ${message}`);
			}
		} catch (err) {
			const message = JSON.stringify({
				path,
				error: err.message
			});
			console.error(`[vc] PATH TO REGEXP ERROR @ #${callerId}: ${message}`);
		}
		return currentRegExp;
	}
	var UN_NAMED_SEGMENT = "__UN_NAMED_SEGMENT__";
	function getCleanUrls(filePaths) {
		return filePaths.map(toRoute).filter((f) => f.endsWith(".html")).map((f) => ({
			html: f,
			clean: f.slice(0, -5)
		}));
	}
	function convertCleanUrls(cleanUrls, trailingSlash, status = 308) {
		const routes = [];
		if (cleanUrls) {
			const loc = trailingSlash ? "/$1/" : "/$1";
			routes.push({
				src: "^/(?:(.+)/)?index(?:\\.html)?/?$",
				headers: { Location: loc },
				status
			});
			routes.push({
				src: "^/(.*)\\.html/?$",
				headers: { Location: loc },
				status
			});
		}
		return routes;
	}
	function convertRedirects(redirects, defaultStatus = 308) {
		return redirects.map((r) => {
			const { src, segments } = sourceToRegex(r.source);
			const hasSegments = collectHasSegments(r.has);
			normalizeHasKeys(r.has);
			normalizeHasKeys(r.missing);
			try {
				const loc = replaceSegments(segments, hasSegments, r.destination, true);
				let status;
				if (typeof r.permanent === "boolean") status = r.permanent ? 308 : 307;
				else if (r.statusCode) status = r.statusCode;
				else status = defaultStatus;
				const route = {
					src,
					headers: { Location: loc },
					status
				};
				if (typeof r.env !== "undefined") route.env = r.env;
				if (r.has) route.has = r.has;
				if (r.missing) route.missing = r.missing;
				return route;
			} catch (e) {
				throw new Error(`Failed to parse redirect: ${JSON.stringify(r)}`);
			}
		});
	}
	function convertRewrites(rewrites, internalParamNames) {
		return rewrites.map((r) => {
			const { src, segments } = sourceToRegex(r.source);
			const hasSegments = collectHasSegments(r.has);
			normalizeHasKeys(r.has);
			normalizeHasKeys(r.missing);
			try {
				const route = {
					src,
					dest: replaceSegments(segments, hasSegments, r.destination, false, internalParamNames),
					check: true
				};
				if (typeof r.env !== "undefined") route.env = r.env;
				if (r.has) route.has = r.has;
				if (r.missing) route.missing = r.missing;
				if (r.statusCode) route.status = r.statusCode;
				return route;
			} catch (e) {
				throw new Error(`Failed to parse rewrite: ${JSON.stringify(r)}`);
			}
		});
	}
	function convertHeaders(headers) {
		return headers.map((h) => {
			const obj = {};
			const { src, segments } = sourceToRegex(h.source);
			const hasSegments = collectHasSegments(h.has);
			normalizeHasKeys(h.has);
			normalizeHasKeys(h.missing);
			const namedSegments = segments.filter((name) => name !== UN_NAMED_SEGMENT);
			const indexes = {};
			segments.forEach((name, index) => {
				indexes[name] = toSegmentDest(index);
			});
			hasSegments.forEach((name) => {
				indexes[name] = "$" + name;
			});
			h.headers.forEach(({ key, value }) => {
				if (namedSegments.length > 0 || hasSegments.length > 0) {
					if (key.includes(":")) key = safelyCompile(key, indexes);
					if (value.includes(":")) value = safelyCompile(value, indexes);
				}
				obj[key] = value;
			});
			const route = {
				src,
				headers: obj,
				continue: true
			};
			if (h.has) route.has = h.has;
			if (h.missing) route.missing = h.missing;
			return route;
		});
	}
	function convertTrailingSlash(enable, status = 308) {
		const routes = [];
		if (enable) {
			routes.push({ src: "^/\\.well-known(?:/.*)?$" });
			routes.push({
				src: "^/((?:[^/]+/)*[^/\\.]+)$",
				headers: { Location: "/$1/" },
				status
			});
			routes.push({
				src: "^/((?:[^/]+/)*[^/]+\\.\\w+)/$",
				headers: { Location: "/$1" },
				status
			});
		} else routes.push({
			src: "^/(.*)\\/$",
			headers: { Location: "/$1" },
			status
		});
		return routes;
	}
	function sourceToRegex(source) {
		const keys = [];
		const r = pathToRegexp("632", source, keys, {
			strict: true,
			sensitive: true,
			delimiter: "/"
		});
		const segments = keys.map((k) => k.name).map((name) => {
			if (typeof name !== "string") return UN_NAMED_SEGMENT;
			return name;
		});
		return {
			src: r.source,
			segments
		};
	}
	var namedGroupsRegex = /\(\?<([a-zA-Z][a-zA-Z0-9_]*)>/g;
	var normalizeHasKeys = (hasItems = []) => {
		for (const hasItem of hasItems) if ("key" in hasItem && hasItem.type === "header") hasItem.key = hasItem.key.toLowerCase();
		return hasItems;
	};
	function getStringValueForRegex(value) {
		if (typeof value === "string") return value;
		if (value && typeof value === "object" && value !== null) {
			if ("re" in value && typeof value.re === "string") return value.re;
		}
		return null;
	}
	function collectHasSegments(has) {
		const hasSegments = /* @__PURE__ */ new Set();
		for (const hasItem of has || []) {
			if (!hasItem.value && "key" in hasItem) hasSegments.add(hasItem.key);
			const stringValue = getStringValueForRegex(hasItem.value);
			if (stringValue) {
				for (const match of stringValue.matchAll(namedGroupsRegex)) if (match[1]) hasSegments.add(match[1]);
				if (hasItem.type === "host") hasSegments.add("host");
			}
		}
		return [...hasSegments];
	}
	var escapeSegment = (str, segmentName) => str.replace(new RegExp(`:${segmentName}`, "g"), `__ESC_COLON_${segmentName}`);
	var unescapeSegments = (str) => str.replace(/__ESC_COLON_/gi, ":");
	function replaceSegments(segments, hasItemSegments, destination, isRedirect, internalParamNames) {
		const namedSegments = segments.filter((name) => name !== UN_NAMED_SEGMENT);
		if (!(destination.includes(":") && namedSegments.length > 0 || hasItemSegments.length > 0 || !isRedirect)) return destination;
		let escapedDestination = destination;
		const indexes = {};
		segments.forEach((name, index) => {
			indexes[name] = toSegmentDest(index);
			escapedDestination = escapeSegment(escapedDestination, name);
		});
		hasItemSegments.forEach((name) => {
			indexes[name] = "$" + name;
			escapedDestination = escapeSegment(escapedDestination, name);
		});
		const parsedDestination = (0, import_url$1.parse)(escapedDestination, true);
		delete parsedDestination.href;
		delete parsedDestination.path;
		delete parsedDestination.search;
		delete parsedDestination.host;
		let { pathname, hash, query, hostname, ...rest } = parsedDestination;
		pathname = unescapeSegments(pathname || "");
		hash = unescapeSegments(hash || "");
		hostname = unescapeSegments(hostname || "");
		let destParams = /* @__PURE__ */ new Set();
		const pathnameKeys = [];
		const hashKeys = [];
		const hostnameKeys = [];
		try {
			pathToRegexp("528", pathname, pathnameKeys);
			pathToRegexp("834", hash || "", hashKeys);
			pathToRegexp("712", hostname || "", hostnameKeys);
		} catch (_) {}
		destParams = new Set([
			...pathnameKeys,
			...hashKeys,
			...hostnameKeys
		].map((key) => key.name).filter((val) => typeof val === "string"));
		pathname = safelyCompile(pathname, indexes, true);
		hash = hash ? safelyCompile(hash, indexes, true) : null;
		hostname = hostname ? safelyCompile(hostname, indexes, true) : null;
		for (const [key, strOrArray] of Object.entries(query)) if (Array.isArray(strOrArray)) query[key] = strOrArray.map((str) => safelyCompile(unescapeSegments(str), indexes, true));
		else query[key] = safelyCompile(unescapeSegments(strOrArray), indexes, true);
		const paramKeys = Object.keys(indexes);
		if (!isRedirect && !paramKeys.some((param) => !(internalParamNames && internalParamNames.includes(param)) && destParams.has(param))) {
			for (const param of paramKeys) if (!(param in query) && param !== UN_NAMED_SEGMENT) query[param] = indexes[param];
		}
		destination = (0, import_url$1.format)({
			...rest,
			hostname,
			pathname,
			query,
			hash
		});
		return destination.replace(/%24/g, "$");
	}
	function safelyCompile(value, indexes, attemptDirectCompile) {
		if (!value) return value;
		if (attemptDirectCompile) try {
			return (0, import_path_to_regexp.compile)(value, { validate: false })(indexes);
		} catch (e) {}
		for (const key of Object.keys(indexes)) if (value.includes(`:${key}`)) value = value.replace(new RegExp(`:${key}\\*`, "g"), `:${key}--ESCAPED_PARAM_ASTERISK`).replace(new RegExp(`:${key}\\?`, "g"), `:${key}--ESCAPED_PARAM_QUESTION`).replace(new RegExp(`:${key}\\+`, "g"), `:${key}--ESCAPED_PARAM_PLUS`).replace(new RegExp(`:${key}(?!\\w)`, "g"), `--ESCAPED_PARAM_COLON${key}`);
		value = value.replace(/(:|\*|\?|\+|\(|\)|\{|\})/g, "\\$1").replace(/--ESCAPED_PARAM_PLUS/g, "+").replace(/--ESCAPED_PARAM_COLON/g, ":").replace(/--ESCAPED_PARAM_QUESTION/g, "?").replace(/--ESCAPED_PARAM_ASTERISK/g, "*");
		return (0, import_path_to_regexp.compile)(`/${value}`, { validate: false })(indexes).slice(1);
	}
	function toSegmentDest(index) {
		return "$" + (index + 1).toString();
	}
	function toRoute(filePath) {
		return filePath.startsWith("/") ? filePath : "/" + filePath;
	}
	0 && (module.exports = {
		collectHasSegments,
		convertCleanUrls,
		convertHeaders,
		convertRedirects,
		convertRewrites,
		convertTrailingSlash,
		getCleanUrls,
		pathToRegexp,
		sourceToRegex
	});
}));
//#endregion
//#region node_modules/.pnpm/@vercel+routing-utils@5.3.3/node_modules/@vercel/routing-utils/dist/append.js
var require_append = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var append_exports = {};
	__export(append_exports, { appendRoutesToPhase: () => appendRoutesToPhase });
	module.exports = __toCommonJS(append_exports);
	var import_index = require_dist();
	function appendRoutesToPhase({ routes: prevRoutes, newRoutes, phase }) {
		const routes = prevRoutes ? [...prevRoutes] : [];
		if (newRoutes === null || newRoutes.length === 0) return routes;
		let isInPhase = false;
		let insertIndex = -1;
		routes.forEach((r, i) => {
			if ((0, import_index.isHandler)(r)) {
				if (r.handle === phase) isInPhase = true;
				else if (isInPhase) {
					insertIndex = i;
					isInPhase = false;
				}
			}
		});
		if (isInPhase) routes.push(...newRoutes);
		else if (phase === null) {
			const lastPhase = routes.findIndex((r) => (0, import_index.isHandler)(r) && r.handle);
			if (lastPhase === -1) routes.push(...newRoutes);
			else routes.splice(lastPhase, 0, ...newRoutes);
		} else if (insertIndex > -1) routes.splice(insertIndex, 0, ...newRoutes);
		else {
			routes.push({ handle: phase });
			routes.push(...newRoutes);
		}
		return routes;
	}
	0 && (module.exports = { appendRoutesToPhase });
}));
//#endregion
//#region node_modules/.pnpm/@vercel+routing-utils@5.3.3/node_modules/@vercel/routing-utils/dist/merge.js
var require_merge = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var merge_exports = {};
	__export(merge_exports, { mergeRoutes: () => mergeRoutes });
	module.exports = __toCommonJS(merge_exports);
	var import_index = require_dist();
	function getBuilderRoutesMapping(builds) {
		const builderRoutes = {};
		for (const { entrypoint, routes, use } of builds) if (routes) {
			if (!builderRoutes[entrypoint]) builderRoutes[entrypoint] = {};
			builderRoutes[entrypoint][use] = routes;
		}
		return builderRoutes;
	}
	function getCheckAndContinue(routes) {
		const checks = [];
		const continues = [];
		const others = [];
		for (const route of routes) if ((0, import_index.isHandler)(route)) throw new Error(`Unexpected route found in getCheckAndContinue(): ${JSON.stringify(route)}`);
		else if (route.check && !route.override) checks.push(route);
		else if (route.continue && !route.override) continues.push(route);
		else others.push(route);
		return {
			checks,
			continues,
			others
		};
	}
	function mergeRoutes({ userRoutes, builds }) {
		const userHandleMap = /* @__PURE__ */ new Map();
		let userPrevHandle = null;
		(userRoutes || []).forEach((route) => {
			if ((0, import_index.isHandler)(route)) userPrevHandle = route.handle;
			else {
				const routes = userHandleMap.get(userPrevHandle);
				if (!routes) userHandleMap.set(userPrevHandle, [route]);
				else routes.push(route);
			}
		});
		const builderHandleMap = /* @__PURE__ */ new Map();
		const builderRoutes = getBuilderRoutesMapping(builds);
		Object.keys(builderRoutes).sort().forEach((path) => {
			const br = builderRoutes[path];
			Object.keys(br).sort().forEach((use) => {
				let builderPrevHandle = null;
				br[use].forEach((route) => {
					if ((0, import_index.isHandler)(route)) builderPrevHandle = route.handle;
					else {
						const routes = builderHandleMap.get(builderPrevHandle);
						if (!routes) builderHandleMap.set(builderPrevHandle, [route]);
						else routes.push(route);
					}
				});
			});
		});
		const outputRoutes = [];
		const uniqueHandleValues = /* @__PURE__ */ new Set([
			null,
			...userHandleMap.keys(),
			...builderHandleMap.keys()
		]);
		for (const handle of uniqueHandleValues) {
			const userRoutes2 = userHandleMap.get(handle) || [];
			const builderRoutes2 = builderHandleMap.get(handle) || [];
			const builderSorted = getCheckAndContinue(builderRoutes2);
			if (handle !== null && (userRoutes2.length > 0 || builderRoutes2.length > 0)) outputRoutes.push({ handle });
			outputRoutes.push(...builderSorted.continues);
			outputRoutes.push(...userRoutes2);
			outputRoutes.push(...builderSorted.checks);
			outputRoutes.push(...builderSorted.others);
		}
		return outputRoutes;
	}
	0 && (module.exports = { mergeRoutes });
}));
//#endregion
//#region node_modules/.pnpm/@vercel+routing-utils@5.3.3/node_modules/@vercel/routing-utils/dist/service-route-ownership.js
var require_service_route_ownership = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var service_route_ownership_exports = {};
	__export(service_route_ownership_exports, {
		getOwnershipGuard: () => getOwnershipGuard,
		normalizeRoutePrefix: () => normalizeRoutePrefix,
		scopeRouteSourceToOwnership: () => scopeRouteSourceToOwnership
	});
	module.exports = __toCommonJS(service_route_ownership_exports);
	function normalizeRoutePrefix(routePrefix) {
		let normalized = routePrefix.startsWith("/") ? routePrefix : `/${routePrefix}`;
		if (normalized !== "/" && normalized.endsWith("/")) normalized = normalized.slice(0, -1);
		return normalized || "/";
	}
	function escapeForRegex(value) {
		return value.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
	}
	function toPrefixMatcher(routePrefix) {
		return `${escapeForRegex(routePrefix)}(?:/|$)`;
	}
	function isDescendantPrefix(candidate, prefix) {
		return candidate !== prefix && candidate.startsWith(`${prefix}/`);
	}
	function getOwnershipGuard(ownerPrefix, allRoutePrefixes) {
		const owner = normalizeRoutePrefix(ownerPrefix);
		const nonRootPrefixes = Array.from(new Set(allRoutePrefixes.map(normalizeRoutePrefix))).filter((prefix) => prefix !== "/").sort((a, b) => b.length - a.length);
		if (owner === "/") return nonRootPrefixes.map((prefix) => `(?!${toPrefixMatcher(prefix)})`).join("");
		const descendants = nonRootPrefixes.filter((prefix) => isDescendantPrefix(prefix, owner));
		return `${`(?=${toPrefixMatcher(owner)})`}${descendants.map((prefix) => `(?!${toPrefixMatcher(prefix)})`).join("")}`;
	}
	function scopeRouteSourceToOwnership(source, ownershipGuard) {
		if (!ownershipGuard) return source;
		return `^${ownershipGuard}(?:${source.startsWith("^") ? source.slice(1) : source})`;
	}
	0 && (module.exports = {
		getOwnershipGuard,
		normalizeRoutePrefix,
		scopeRouteSourceToOwnership
	});
}));
//#endregion
//#region node_modules/.pnpm/@vercel+routing-utils@5.3.3/node_modules/@vercel/routing-utils/dist/schemas.js
var require_schemas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var schemas_exports = {};
	__export(schemas_exports, {
		bulkRedirectsSchema: () => bulkRedirectsSchema,
		cleanUrlsSchema: () => cleanUrlsSchema,
		hasSchema: () => hasSchema,
		headersSchema: () => headersSchema,
		redirectsSchema: () => redirectsSchema,
		rewritesSchema: () => rewritesSchema,
		routesSchema: () => routesSchema,
		trailingSlashSchema: () => trailingSlashSchema
	});
	module.exports = __toCommonJS(schemas_exports);
	var mitigateSchema = {
		description: "Mitigation action to take on a route",
		type: "object",
		additionalProperties: false,
		required: ["action"],
		properties: { action: {
			description: "The mitigation action to take",
			type: "string",
			enum: ["challenge", "deny"]
		} }
	};
	var matchableValueSchema = {
		description: "A value to match against. Can be a string (regex) or a condition operation object",
		anyOf: [{
			description: "A regular expression used to match thev value. Named groups can be used in the destination.",
			type: "string",
			maxLength: 4096
		}, {
			description: "A condition operation object",
			type: "object",
			additionalProperties: false,
			minProperties: 1,
			properties: {
				eq: {
					description: "Equal to",
					anyOf: [{
						type: "string",
						maxLength: 4096
					}, { type: "number" }]
				},
				neq: {
					description: "Not equal",
					type: "string",
					maxLength: 4096
				},
				inc: {
					description: "In array",
					type: "array",
					items: {
						type: "string",
						maxLength: 4096
					}
				},
				ninc: {
					description: "Not in array",
					type: "array",
					items: {
						type: "string",
						maxLength: 4096
					}
				},
				pre: {
					description: "Starts with",
					type: "string",
					maxLength: 4096
				},
				suf: {
					description: "Ends with",
					type: "string",
					maxLength: 4096
				},
				re: {
					description: "Regex",
					type: "string",
					maxLength: 4096
				},
				gt: {
					description: "Greater than",
					type: "number"
				},
				gte: {
					description: "Greater than or equal to",
					type: "number"
				},
				lt: {
					description: "Less than",
					type: "number"
				},
				lte: {
					description: "Less than or equal to",
					type: "number"
				}
			}
		}]
	};
	var hasSchema = {
		description: "An array of requirements that are needed to match",
		type: "array",
		maxItems: 16,
		items: { anyOf: [{
			type: "object",
			additionalProperties: false,
			required: ["type", "value"],
			properties: {
				type: {
					description: "The type of request element to check",
					type: "string",
					enum: ["host"]
				},
				value: matchableValueSchema
			}
		}, {
			type: "object",
			additionalProperties: false,
			required: ["type", "key"],
			properties: {
				type: {
					description: "The type of request element to check",
					type: "string",
					enum: [
						"header",
						"cookie",
						"query"
					]
				},
				key: {
					description: "The name of the element contained in the particular type",
					type: "string",
					maxLength: 4096
				},
				value: matchableValueSchema
			}
		}] }
	};
	var routesSchema = {
		type: "array",
		deprecated: true,
		description: "A list of routes objects used to rewrite paths to point towards other internal or external paths",
		example: [{
			dest: "https://docs.example.com",
			src: "/docs"
		}],
		items: { anyOf: [{
			type: "object",
			required: ["src"],
			additionalProperties: false,
			properties: {
				src: {
					type: "string",
					maxLength: 4096
				},
				dest: {
					type: "string",
					maxLength: 4096
				},
				headers: {
					type: "object",
					additionalProperties: false,
					minProperties: 1,
					maxProperties: 100,
					patternProperties: { "^.{1,256}$": {
						type: "string",
						maxLength: 32768
					} }
				},
				methods: {
					type: "array",
					maxItems: 10,
					items: {
						type: "string",
						maxLength: 32
					}
				},
				caseSensitive: { type: "boolean" },
				important: { type: "boolean" },
				user: { type: "boolean" },
				continue: { type: "boolean" },
				override: { type: "boolean" },
				check: { type: "boolean" },
				isInternal: { type: "boolean" },
				status: {
					type: "integer",
					minimum: 100,
					maximum: 999
				},
				locale: {
					type: "object",
					additionalProperties: false,
					minProperties: 1,
					properties: {
						redirect: {
							type: "object",
							additionalProperties: false,
							minProperties: 1,
							maxProperties: 100,
							patternProperties: { "^.{1,256}$": {
								type: "string",
								maxLength: 4096
							} }
						},
						value: {
							type: "string",
							maxLength: 4096
						},
						path: {
							type: "string",
							maxLength: 4096
						},
						cookie: {
							type: "string",
							maxLength: 4096
						},
						default: {
							type: "string",
							maxLength: 4096
						}
					}
				},
				middleware: { type: "number" },
				middlewarePath: { type: "string" },
				middlewareRawSrc: {
					type: "array",
					items: { type: "string" }
				},
				has: hasSchema,
				missing: hasSchema,
				mitigate: mitigateSchema,
				transforms: {
					description: "A list of transform rules to adjust the query parameters of a request or HTTP headers of request or response",
					type: "array",
					minItems: 1,
					items: {
						type: "object",
						additionalProperties: false,
						required: [
							"type",
							"op",
							"target"
						],
						properties: {
							type: {
								description: "The scope of the transform to apply",
								type: "string",
								enum: [
									"request.headers",
									"request.query",
									"response.headers"
								]
							},
							op: {
								description: "The operation to perform on the target",
								type: "string",
								enum: [
									"append",
									"set",
									"delete"
								]
							},
							target: {
								description: "The target of the transform",
								type: "object",
								required: ["key"],
								properties: { key: {
									description: "A value to match against. Can be a string or a condition operation object (without regex support)",
									anyOf: [{
										description: "A valid header name (letters, numbers, hyphens, underscores)",
										type: "string",
										maxLength: 4096
									}, {
										description: "A condition operation object",
										type: "object",
										additionalProperties: false,
										minProperties: 1,
										properties: {
											eq: {
												description: "Equal to",
												anyOf: [{
													type: "string",
													maxLength: 4096
												}, { type: "number" }]
											},
											neq: {
												description: "Not equal",
												type: "string",
												maxLength: 4096
											},
											inc: {
												description: "In array",
												type: "array",
												items: {
													type: "string",
													maxLength: 4096
												}
											},
											ninc: {
												description: "Not in array",
												type: "array",
												items: {
													type: "string",
													maxLength: 4096
												}
											},
											pre: {
												description: "Starts with",
												type: "string",
												maxLength: 4096
											},
											suf: {
												description: "Ends with",
												type: "string",
												maxLength: 4096
											},
											gt: {
												description: "Greater than",
												type: "number"
											},
											gte: {
												description: "Greater than or equal to",
												type: "number"
											},
											lt: {
												description: "Less than",
												type: "number"
											},
											lte: {
												description: "Less than or equal to",
												type: "number"
											}
										}
									}]
								} }
							},
							args: {
								description: "The arguments to the operation",
								anyOf: [{
									type: "string",
									maxLength: 4096
								}, {
									type: "array",
									minItems: 1,
									items: {
										type: "string",
										maxLength: 4096
									}
								}]
							},
							env: {
								description: "An array of environment variable names that should be replaced at runtime in the args value",
								type: "array",
								minItems: 1,
								maxItems: 64,
								items: {
									type: "string",
									maxLength: 256
								}
							}
						},
						allOf: [{
							if: { properties: { op: { enum: ["append", "set"] } } },
							then: { required: ["args"] }
						}, {
							if: { allOf: [{ properties: { type: { enum: ["request.headers", "response.headers"] } } }, { properties: { op: { enum: ["set", "append"] } } }] },
							then: { properties: {
								target: { properties: { key: {
									if: { type: "string" },
									then: { pattern: "^[a-zA-Z0-9_-]+$" }
								} } },
								args: { anyOf: [{
									type: "string",
									pattern: "^[a-zA-Z0-9_ :;.,\"'?!(){}\\[\\]@<>=+*#$&`|~\\^%/-]+$"
								}, {
									type: "array",
									items: {
										type: "string",
										pattern: "^[a-zA-Z0-9_ :;.,\"'?!(){}\\[\\]@<>=+*#$&`|~\\^%/-]+$"
									}
								}] }
							} }
						}]
					}
				},
				env: {
					description: "An array of environment variable names that should be replaced at runtime in the destination or headers",
					type: "array",
					minItems: 1,
					maxItems: 64,
					items: {
						type: "string",
						maxLength: 256
					}
				},
				respectOriginCacheControl: {
					description: "When set to true (default), external rewrites will respect the Cache-Control header from the origin. When false, caching is disabled for this rewrite.",
					type: "boolean"
				}
			}
		}, {
			type: "object",
			required: ["handle"],
			additionalProperties: false,
			properties: { handle: {
				type: "string",
				maxLength: 32,
				enum: [
					"error",
					"filesystem",
					"hit",
					"miss",
					"resource",
					"rewrite"
				]
			} }
		}] }
	};
	var rewritesSchema = {
		type: "array",
		maxItems: 2048,
		description: "A list of rewrite definitions.",
		items: {
			type: "object",
			additionalProperties: false,
			required: ["source", "destination"],
			properties: {
				source: {
					description: "A pattern that matches each incoming pathname (excluding querystring).",
					type: "string",
					maxLength: 4096
				},
				destination: {
					description: "An absolute pathname to an existing resource or an external URL.",
					type: "string",
					maxLength: 4096
				},
				has: hasSchema,
				missing: hasSchema,
				statusCode: {
					description: "An optional integer to override the status code of the response.",
					type: "integer",
					minimum: 100,
					maximum: 999
				},
				env: {
					description: "An array of environment variable names that should be replaced at runtime in the destination",
					type: "array",
					minItems: 1,
					maxItems: 64,
					items: {
						type: "string",
						maxLength: 256
					}
				},
				respectOriginCacheControl: {
					description: "When set to true (default), external rewrites will respect the Cache-Control header from the origin. When false, caching is disabled for this rewrite.",
					type: "boolean"
				}
			}
		}
	};
	var redirectsSchema = {
		title: "Redirects",
		type: "array",
		maxItems: 2048,
		description: "A list of redirect definitions.",
		items: {
			type: "object",
			additionalProperties: false,
			required: ["source", "destination"],
			properties: {
				source: {
					description: "A pattern that matches each incoming pathname (excluding querystring).",
					type: "string",
					maxLength: 4096
				},
				destination: {
					description: "A location destination defined as an absolute pathname or external URL.",
					type: "string",
					maxLength: 4096
				},
				permanent: {
					description: "A boolean to toggle between permanent and temporary redirect. When `true`, the status code is `308`. When `false` the status code is `307`.",
					type: "boolean"
				},
				statusCode: {
					description: "An optional integer to define the status code of the redirect.",
					private: true,
					type: "integer",
					minimum: 100,
					maximum: 999
				},
				has: hasSchema,
				missing: hasSchema,
				env: {
					description: "An array of environment variable names that should be replaced at runtime in the destination",
					type: "array",
					minItems: 1,
					maxItems: 64,
					items: {
						type: "string",
						maxLength: 256
					}
				}
			}
		}
	};
	var headersSchema = {
		type: "array",
		maxItems: 2048,
		description: "A list of header definitions.",
		items: {
			type: "object",
			additionalProperties: false,
			required: ["source", "headers"],
			properties: {
				source: {
					description: "A pattern that matches each incoming pathname (excluding querystring)",
					type: "string",
					maxLength: 4096
				},
				headers: {
					description: "An array of key/value pairs representing each response header.",
					type: "array",
					maxItems: 1024,
					items: {
						type: "object",
						additionalProperties: false,
						required: ["key", "value"],
						properties: {
							key: {
								type: "string",
								maxLength: 4096
							},
							value: {
								type: "string",
								maxLength: 32768
							}
						}
					}
				},
				has: hasSchema,
				missing: hasSchema
			}
		}
	};
	var cleanUrlsSchema = {
		description: "When set to `true`, all HTML files and Serverless Functions will have their extension removed. When visiting a path that ends with the extension, a 308 response will redirect the client to the extensionless path.",
		type: "boolean"
	};
	var trailingSlashSchema = {
		description: "When `false`, visiting a path that ends with a forward slash will respond with a `308` status code and redirect to the path without the trailing slash.",
		type: "boolean"
	};
	var bulkRedirectsSchema = {
		type: "array",
		description: "A list of bulk redirect definitions.",
		items: {
			type: "object",
			additionalProperties: false,
			required: ["source", "destination"],
			properties: {
				source: {
					description: "The exact URL path or pattern to match.",
					type: "string",
					maxLength: 2048
				},
				destination: {
					description: "The target URL path where traffic should be redirected.",
					type: "string",
					maxLength: 2048
				},
				permanent: {
					description: "A boolean to toggle between permanent and temporary redirect. When `true`, the status code is `308`. When `false` the status code is `307`.",
					type: "boolean"
				},
				statusCode: {
					description: "An optional integer to define the status code of the redirect.",
					type: "integer",
					enum: [
						301,
						302,
						307,
						308
					]
				},
				sensitive: {
					description: "A boolean to toggle between case-sensitive and case-insensitive redirect. When `true`, the redirect is case-sensitive. When `false` the redirect is case-insensitive.",
					type: "boolean"
				},
				query: {
					description: "Whether the query string should be preserved by the redirect. The default is `false`.",
					type: "boolean"
				}
			}
		}
	};
	0 && (module.exports = {
		bulkRedirectsSchema,
		cleanUrlsSchema,
		hasSchema,
		headersSchema,
		redirectsSchema,
		rewritesSchema,
		routesSchema,
		trailingSlashSchema
	});
}));
//#endregion
//#region node_modules/.pnpm/@vercel+routing-utils@5.3.3/node_modules/@vercel/routing-utils/dist/types.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	module.exports = __toCommonJS({});
}));
//#endregion
//#region node_modules/.pnpm/@vercel+routing-utils@5.3.3/node_modules/@vercel/routing-utils/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var src_exports = {};
	__export(src_exports, {
		appendRoutesToPhase: () => import_append.appendRoutesToPhase,
		getCleanUrls: () => import_superstatic2.getCleanUrls,
		getOwnershipGuard: () => import_service_route_ownership.getOwnershipGuard,
		getTransformedRoutes: () => getTransformedRoutes,
		isHandler: () => isHandler,
		isValidHandleValue: () => isValidHandleValue,
		mergeRoutes: () => import_merge.mergeRoutes,
		normalizeRoutePrefix: () => import_service_route_ownership.normalizeRoutePrefix,
		normalizeRoutes: () => normalizeRoutes,
		scopeRouteSourceToOwnership: () => import_service_route_ownership.scopeRouteSourceToOwnership,
		sourceToRegex: () => import_superstatic2.sourceToRegex
	});
	module.exports = __toCommonJS(src_exports);
	var import_url = __require("url");
	var import_superstatic = require_superstatic();
	var import_append = require_append();
	var import_merge = require_merge();
	var import_service_route_ownership = require_service_route_ownership();
	__reExport(src_exports, require_schemas(), module.exports);
	var import_superstatic2 = require_superstatic();
	__reExport(src_exports, require_types(), module.exports);
	var validHandleValues = /* @__PURE__ */ new Set([
		"filesystem",
		"hit",
		"miss",
		"rewrite",
		"error",
		"resource"
	]);
	function isHandler(route) {
		return typeof route.handle !== "undefined";
	}
	function isValidHandleValue(handle) {
		return validHandleValues.has(handle);
	}
	function normalizeRoutes(inputRoutes) {
		if (!inputRoutes || inputRoutes.length === 0) return {
			routes: inputRoutes,
			error: null
		};
		const routes = [];
		const handling = [];
		const errors = [];
		inputRoutes.forEach((r, i) => {
			const route = { ...r };
			routes.push(route);
			const keys = Object.keys(route);
			if (isHandler(route)) {
				const { handle } = route;
				if (keys.length !== 1) {
					const unknownProp = keys.find((prop) => prop !== "handle");
					errors.push(`Route at index ${i} has unknown property \`${unknownProp}\`.`);
				} else if (!isValidHandleValue(handle)) errors.push(`Route at index ${i} has unknown handle value \`handle: ${handle}\`.`);
				else if (handling.includes(handle)) errors.push(`Route at index ${i} is a duplicate. Please use one \`handle: ${handle}\` at most.`);
				else handling.push(handle);
			} else if (route.src) {
				if (!route.src.startsWith("^")) route.src = `^${route.src}`;
				if (!route.src.endsWith("$")) route.src = `${route.src}$`;
				route.src = route.src.replace(/\\\//g, "/");
				const regError = checkRegexSyntax("Route", i, route.src);
				if (regError) errors.push(regError);
				const handleValue = handling[handling.length - 1];
				if (handleValue === "hit") {
					if (route.dest) errors.push(`Route at index ${i} cannot define \`dest\` after \`handle: hit\`.`);
					if (route.status) errors.push(`Route at index ${i} cannot define \`status\` after \`handle: hit\`.`);
					if (!route.continue) errors.push(`Route at index ${i} must define \`continue: true\` after \`handle: hit\`.`);
				} else if (handleValue === "miss") {
					if (route.dest && !route.check) errors.push(`Route at index ${i} must define \`check: true\` after \`handle: miss\`.`);
					else if (!route.dest && !route.continue) errors.push(`Route at index ${i} must define \`continue: true\` after \`handle: miss\`.`);
				}
			} else errors.push(`Route at index ${i} must define either \`handle\` or \`src\` property.`);
		});
		return {
			routes,
			error: errors.length > 0 ? createError("invalid_route", errors, "https://vercel.link/routes-json", "Learn More") : null
		};
	}
	function checkRegexSyntax(type, index, src) {
		try {
			new RegExp(src);
		} catch (err) {
			return `${type} at index ${index} has invalid \`${type === "Route" ? "src" : "source"}\` regular expression "${src}".`;
		}
		return null;
	}
	function checkPatternSyntax(type, index, { source, destination, has }) {
		let sourceSegments = /* @__PURE__ */ new Set();
		const destinationSegments = /* @__PURE__ */ new Set();
		try {
			sourceSegments = new Set((0, import_superstatic.sourceToRegex)(source).segments);
		} catch (err) {
			return {
				message: `${type} at index ${index} has invalid \`source\` pattern "${source}".`,
				link: "https://vercel.link/invalid-route-source-pattern"
			};
		}
		if (destination) {
			try {
				const { hostname, pathname, query } = (0, import_url.parse)(destination, true);
				(0, import_superstatic.sourceToRegex)(hostname || "").segments.forEach((name) => destinationSegments.add(name));
				(0, import_superstatic.sourceToRegex)(pathname || "").segments.forEach((name) => destinationSegments.add(name));
				for (const strOrArray of Object.values(query)) {
					const value = Array.isArray(strOrArray) ? strOrArray[0] : strOrArray;
					(0, import_superstatic.sourceToRegex)(value || "").segments.forEach((name) => destinationSegments.add(name));
				}
			} catch (err) {}
			const hasSegments = (0, import_superstatic.collectHasSegments)(has);
			for (const segment of destinationSegments) if (!sourceSegments.has(segment) && !hasSegments.includes(segment)) return {
				message: `${type} at index ${index} has segment ":${segment}" in \`destination\` property but not in \`source\` or \`has\` property.`,
				link: "https://vercel.link/invalid-route-destination-segment"
			};
		}
		return null;
	}
	function checkRedirect(r, index) {
		if (typeof r.permanent !== "undefined" && typeof r.statusCode !== "undefined") return `Redirect at index ${index} cannot define both \`permanent\` and \`statusCode\` properties.`;
		return null;
	}
	function createError(code, allErrors, link, action) {
		const errors = Array.isArray(allErrors) ? allErrors : [allErrors];
		return {
			name: "RouteApiError",
			code,
			message: errors[0],
			link,
			action,
			errors
		};
	}
	function notEmpty(value) {
		return value !== null && value !== void 0;
	}
	function getTransformedRoutes(vercelConfig) {
		const { cleanUrls, rewrites, redirects, headers, trailingSlash } = vercelConfig;
		let { routes = null } = vercelConfig;
		if (routes) {
			if (typeof cleanUrls !== "undefined" || typeof trailingSlash !== "undefined" || typeof redirects !== "undefined" || typeof headers !== "undefined" || typeof rewrites !== "undefined") {
				const error = createError("invalid_mixed_routes", "If `rewrites`, `redirects`, `headers`, `cleanUrls` or `trailingSlash` are used, then `routes` cannot be present.", "https://vercel.link/mix-routing-props", "Learn More");
				return {
					routes,
					error
				};
			}
			return normalizeRoutes(routes);
		}
		if (typeof cleanUrls !== "undefined") {
			const normalized = normalizeRoutes((0, import_superstatic.convertCleanUrls)(cleanUrls, trailingSlash));
			if (normalized.error) {
				normalized.error.code = "invalid_clean_urls";
				return {
					routes,
					error: normalized.error
				};
			}
			routes = routes || [];
			routes.push(...normalized.routes || []);
		}
		if (typeof trailingSlash !== "undefined") {
			const normalized = normalizeRoutes((0, import_superstatic.convertTrailingSlash)(trailingSlash));
			if (normalized.error) {
				normalized.error.code = "invalid_trailing_slash";
				return {
					routes,
					error: normalized.error
				};
			}
			routes = routes || [];
			routes.push(...normalized.routes || []);
		}
		if (typeof redirects !== "undefined") {
			const code = "invalid_redirect";
			const regexErrorMessage = redirects.map((r, i) => checkRegexSyntax("Redirect", i, r.source)).find(notEmpty);
			if (regexErrorMessage) return {
				routes,
				error: createError("invalid_redirect", regexErrorMessage, "https://vercel.link/invalid-route-source-pattern", "Learn More")
			};
			const patternError = redirects.map((r, i) => checkPatternSyntax("Redirect", i, r)).find(notEmpty);
			if (patternError) return {
				routes,
				error: createError(code, patternError.message, patternError.link, "Learn More")
			};
			const redirectErrorMessage = redirects.map(checkRedirect).find(notEmpty);
			if (redirectErrorMessage) return {
				routes,
				error: createError(code, redirectErrorMessage, "https://vercel.link/redirects-json", "Learn More")
			};
			const normalized = normalizeRoutes((0, import_superstatic.convertRedirects)(redirects));
			if (normalized.error) {
				normalized.error.code = code;
				return {
					routes,
					error: normalized.error
				};
			}
			routes = routes || [];
			routes.push(...normalized.routes || []);
		}
		if (typeof headers !== "undefined") {
			const code = "invalid_header";
			const regexErrorMessage = headers.map((r, i) => checkRegexSyntax("Header", i, r.source)).find(notEmpty);
			if (regexErrorMessage) return {
				routes,
				error: createError(code, regexErrorMessage, "https://vercel.link/invalid-route-source-pattern", "Learn More")
			};
			const patternError = headers.map((r, i) => checkPatternSyntax("Header", i, r)).find(notEmpty);
			if (patternError) return {
				routes,
				error: createError(code, patternError.message, patternError.link, "Learn More")
			};
			const normalized = normalizeRoutes((0, import_superstatic.convertHeaders)(headers));
			if (normalized.error) {
				normalized.error.code = code;
				return {
					routes,
					error: normalized.error
				};
			}
			routes = routes || [];
			routes.push(...normalized.routes || []);
		}
		if (typeof rewrites !== "undefined") {
			const code = "invalid_rewrite";
			const regexErrorMessage = rewrites.map((r, i) => checkRegexSyntax("Rewrite", i, r.source)).find(notEmpty);
			if (regexErrorMessage) return {
				routes,
				error: createError(code, regexErrorMessage, "https://vercel.link/invalid-route-source-pattern", "Learn More")
			};
			const patternError = rewrites.map((r, i) => checkPatternSyntax("Rewrite", i, r)).find(notEmpty);
			if (patternError) return {
				routes,
				error: createError(code, patternError.message, patternError.link, "Learn More")
			};
			const normalized = normalizeRoutes((0, import_superstatic.convertRewrites)(rewrites));
			if (normalized.error) {
				normalized.error.code = code;
				return {
					routes,
					error: normalized.error
				};
			}
			routes = routes || [];
			routes.push({ handle: "filesystem" });
			routes.push(...normalized.routes || []);
		}
		return {
			routes,
			error: null
		};
	}
	0 && (module.exports = {
		appendRoutesToPhase,
		getCleanUrls,
		getOwnershipGuard,
		getTransformedRoutes,
		isHandler,
		isValidHandleValue,
		mergeRoutes,
		normalizeRoutePrefix,
		normalizeRoutes,
		scopeRouteSourceToOwnership,
		sourceToRegex,
		...require_schemas(),
		...require_types()
	});
}));
//#endregion
//#region node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var WIN_SLASH = "\\\\/";
	var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
	var DEFAULT_MAX_EXTGLOB_RECURSION = 0;
	/**
	* Posix glob regex
	*/
	var DOT_LITERAL = "\\.";
	var PLUS_LITERAL = "\\+";
	var QMARK_LITERAL = "\\?";
	var SLASH_LITERAL = "\\/";
	var ONE_CHAR = "(?=.)";
	var QMARK = "[^/]";
	var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
	var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
	var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
	var POSIX_CHARS = {
		DOT_LITERAL,
		PLUS_LITERAL,
		QMARK_LITERAL,
		SLASH_LITERAL,
		ONE_CHAR,
		QMARK,
		END_ANCHOR,
		DOTS_SLASH,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!${START_ANCHOR}${DOTS_SLASH})`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`,
		NO_DOTS_SLASH: `(?!${DOTS_SLASH})`,
		QMARK_NO_DOT: `[^.${SLASH_LITERAL}]`,
		STAR: `${QMARK}*?`,
		START_ANCHOR,
		SEP: "/"
	};
	/**
	* Windows glob regex
	*/
	var WINDOWS_CHARS = {
		...POSIX_CHARS,
		SLASH_LITERAL: `[${WIN_SLASH}]`,
		QMARK: WIN_NO_SLASH,
		STAR: `${WIN_NO_SLASH}*?`,
		DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
		NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
		START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
		END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
		SEP: "\\"
	};
	module.exports = {
		DEFAULT_MAX_EXTGLOB_RECURSION,
		MAX_LENGTH: 65536,
		POSIX_REGEX_SOURCE: {
			__proto__: null,
			alnum: "a-zA-Z0-9",
			alpha: "a-zA-Z",
			ascii: "\\x00-\\x7F",
			blank: " \\t",
			cntrl: "\\x00-\\x1F\\x7F",
			digit: "0-9",
			graph: "\\x21-\\x7E",
			lower: "a-z",
			print: "\\x20-\\x7E ",
			punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
			space: " \\t\\r\\n\\v\\f",
			upper: "A-Z",
			word: "A-Za-z0-9_",
			xdigit: "A-Fa-f0-9"
		},
		REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
		REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
		REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
		REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
		REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
		REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
		REPLACEMENTS: {
			__proto__: null,
			"***": "*",
			"**/**": "**",
			"**/**/**": "**"
		},
		CHAR_0: 48,
		CHAR_9: 57,
		CHAR_UPPERCASE_A: 65,
		CHAR_LOWERCASE_A: 97,
		CHAR_UPPERCASE_Z: 90,
		CHAR_LOWERCASE_Z: 122,
		CHAR_LEFT_PARENTHESES: 40,
		CHAR_RIGHT_PARENTHESES: 41,
		CHAR_ASTERISK: 42,
		CHAR_AMPERSAND: 38,
		CHAR_AT: 64,
		CHAR_BACKWARD_SLASH: 92,
		CHAR_CARRIAGE_RETURN: 13,
		CHAR_CIRCUMFLEX_ACCENT: 94,
		CHAR_COLON: 58,
		CHAR_COMMA: 44,
		CHAR_DOT: 46,
		CHAR_DOUBLE_QUOTE: 34,
		CHAR_EQUAL: 61,
		CHAR_EXCLAMATION_MARK: 33,
		CHAR_FORM_FEED: 12,
		CHAR_FORWARD_SLASH: 47,
		CHAR_GRAVE_ACCENT: 96,
		CHAR_HASH: 35,
		CHAR_HYPHEN_MINUS: 45,
		CHAR_LEFT_ANGLE_BRACKET: 60,
		CHAR_LEFT_CURLY_BRACE: 123,
		CHAR_LEFT_SQUARE_BRACKET: 91,
		CHAR_LINE_FEED: 10,
		CHAR_NO_BREAK_SPACE: 160,
		CHAR_PERCENT: 37,
		CHAR_PLUS: 43,
		CHAR_QUESTION_MARK: 63,
		CHAR_RIGHT_ANGLE_BRACKET: 62,
		CHAR_RIGHT_CURLY_BRACE: 125,
		CHAR_RIGHT_SQUARE_BRACKET: 93,
		CHAR_SEMICOLON: 59,
		CHAR_SINGLE_QUOTE: 39,
		CHAR_SPACE: 32,
		CHAR_TAB: 9,
		CHAR_UNDERSCORE: 95,
		CHAR_VERTICAL_LINE: 124,
		CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
		/**
		* Create EXTGLOB_CHARS
		*/
		extglobChars(chars) {
			return {
				"!": {
					type: "negate",
					open: "(?:(?!(?:",
					close: `))${chars.STAR})`
				},
				"?": {
					type: "qmark",
					open: "(?:",
					close: ")?"
				},
				"+": {
					type: "plus",
					open: "(?:",
					close: ")+"
				},
				"*": {
					type: "star",
					open: "(?:",
					close: ")*"
				},
				"@": {
					type: "at",
					open: "(?:",
					close: ")"
				}
			};
		},
		/**
		* Create GLOB_CHARS
		*/
		globChars(win32) {
			return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { REGEX_BACKSLASH, REGEX_REMOVE_BACKSLASH, REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL } = require_constants();
	exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
	exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
	exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
	exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
	exports.isWindows = () => {
		if (typeof navigator !== "undefined" && navigator.platform) {
			const platform = navigator.platform.toLowerCase();
			return platform === "win32" || platform === "windows";
		}
		if (typeof process !== "undefined" && process.platform) return process.platform === "win32";
		return false;
	};
	exports.removeBackslashes = (str) => {
		return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
			return match === "\\" ? "" : match;
		});
	};
	exports.escapeLast = (input, char, lastIdx) => {
		const idx = input.lastIndexOf(char, lastIdx);
		if (idx === -1) return input;
		if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
		return `${input.slice(0, idx)}\\${input.slice(idx)}`;
	};
	exports.removePrefix = (input, state = {}) => {
		let output = input;
		if (output.startsWith("./")) {
			output = output.slice(2);
			state.prefix = "./";
		}
		return output;
	};
	exports.wrapOutput = (input, state = {}, options = {}) => {
		let output = `${options.contains ? "" : "^"}(?:${input})${options.contains ? "" : "$"}`;
		if (state.negated === true) output = `(?:^(?!${output}).*$)`;
		return output;
	};
	exports.basename = (path, { windows } = {}) => {
		const segs = path.split(windows ? /[\\/]/ : "/");
		const last = segs[segs.length - 1];
		if (last === "") return segs[segs.length - 2];
		return last;
	};
}));
//#endregion
//#region node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/scan.js
var require_scan = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils();
	var { CHAR_ASTERISK, CHAR_AT, CHAR_BACKWARD_SLASH, CHAR_COMMA, CHAR_DOT, CHAR_EXCLAMATION_MARK, CHAR_FORWARD_SLASH, CHAR_LEFT_CURLY_BRACE, CHAR_LEFT_PARENTHESES, CHAR_LEFT_SQUARE_BRACKET, CHAR_PLUS, CHAR_QUESTION_MARK, CHAR_RIGHT_CURLY_BRACE, CHAR_RIGHT_PARENTHESES, CHAR_RIGHT_SQUARE_BRACKET } = require_constants();
	var isPathSeparator = (code) => {
		return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
	};
	var depth = (token) => {
		if (token.isPrefix !== true) token.depth = token.isGlobstar ? Infinity : 1;
	};
	/**
	* Quickly scans a glob pattern and returns an object with a handful of
	* useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
	* `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
	* with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
	*
	* ```js
	* const pm = require('picomatch');
	* console.log(pm.scan('foo/bar/*.js'));
	* { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
	* ```
	* @param {String} `str`
	* @param {Object} `options`
	* @return {Object} Returns an object with tokens and regex source string.
	* @api public
	*/
	var scan = (input, options) => {
		const opts = options || {};
		const length = input.length - 1;
		const scanToEnd = opts.parts === true || opts.scanToEnd === true;
		const slashes = [];
		const tokens = [];
		const parts = [];
		let str = input;
		let index = -1;
		let start = 0;
		let lastIndex = 0;
		let isBrace = false;
		let isBracket = false;
		let isGlob = false;
		let isExtglob = false;
		let isGlobstar = false;
		let braceEscaped = false;
		let backslashes = false;
		let negated = false;
		let negatedExtglob = false;
		let finished = false;
		let braces = 0;
		let prev;
		let code;
		let token = {
			value: "",
			depth: 0,
			isGlob: false
		};
		const eos = () => index >= length;
		const peek = () => str.charCodeAt(index + 1);
		const advance = () => {
			prev = code;
			return str.charCodeAt(++index);
		};
		while (index < length) {
			code = advance();
			let next;
			if (code === CHAR_BACKWARD_SLASH) {
				backslashes = token.backslashes = true;
				code = advance();
				if (code === CHAR_LEFT_CURLY_BRACE) braceEscaped = true;
				continue;
			}
			if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
				braces++;
				while (eos() !== true && (code = advance())) {
					if (code === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (code === CHAR_LEFT_CURLY_BRACE) {
						braces++;
						continue;
					}
					if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (braceEscaped !== true && code === CHAR_COMMA) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (code === CHAR_RIGHT_CURLY_BRACE) {
						braces--;
						if (braces === 0) {
							braceEscaped = false;
							isBrace = token.isBrace = true;
							finished = true;
							break;
						}
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_FORWARD_SLASH) {
				slashes.push(index);
				tokens.push(token);
				token = {
					value: "",
					depth: 0,
					isGlob: false
				};
				if (finished === true) continue;
				if (prev === CHAR_DOT && index === start + 1) {
					start += 2;
					continue;
				}
				lastIndex = index + 1;
				continue;
			}
			if (opts.noext !== true) {
				if ((code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK) === true && peek() === CHAR_LEFT_PARENTHESES) {
					isGlob = token.isGlob = true;
					isExtglob = token.isExtglob = true;
					finished = true;
					if (code === CHAR_EXCLAMATION_MARK && index === start) negatedExtglob = true;
					if (scanToEnd === true) {
						while (eos() !== true && (code = advance())) {
							if (code === CHAR_BACKWARD_SLASH) {
								backslashes = token.backslashes = true;
								code = advance();
								continue;
							}
							if (code === CHAR_RIGHT_PARENTHESES) {
								isGlob = token.isGlob = true;
								finished = true;
								break;
							}
						}
						continue;
					}
					break;
				}
			}
			if (code === CHAR_ASTERISK) {
				if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_QUESTION_MARK) {
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_LEFT_SQUARE_BRACKET) {
				while (eos() !== true && (next = advance())) {
					if (next === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (next === CHAR_RIGHT_SQUARE_BRACKET) {
						isBracket = token.isBracket = true;
						isGlob = token.isGlob = true;
						finished = true;
						break;
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
				negated = token.negated = true;
				start++;
				continue;
			}
			if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
				isGlob = token.isGlob = true;
				if (scanToEnd === true) {
					while (eos() !== true && (code = advance())) {
						if (code === CHAR_LEFT_PARENTHESES) {
							backslashes = token.backslashes = true;
							code = advance();
							continue;
						}
						if (code === CHAR_RIGHT_PARENTHESES) {
							finished = true;
							break;
						}
					}
					continue;
				}
				break;
			}
			if (isGlob === true) {
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
		}
		if (opts.noext === true) {
			isExtglob = false;
			isGlob = false;
		}
		let base = str;
		let prefix = "";
		let glob = "";
		if (start > 0) {
			prefix = str.slice(0, start);
			str = str.slice(start);
			lastIndex -= start;
		}
		if (base && isGlob === true && lastIndex > 0) {
			base = str.slice(0, lastIndex);
			glob = str.slice(lastIndex);
		} else if (isGlob === true) {
			base = "";
			glob = str;
		} else base = str;
		if (base && base !== "" && base !== "/" && base !== str) {
			if (isPathSeparator(base.charCodeAt(base.length - 1))) base = base.slice(0, -1);
		}
		if (opts.unescape === true) {
			if (glob) glob = utils.removeBackslashes(glob);
			if (base && backslashes === true) base = utils.removeBackslashes(base);
		}
		const state = {
			prefix,
			input,
			start,
			base,
			glob,
			isBrace,
			isBracket,
			isGlob,
			isExtglob,
			isGlobstar,
			negated,
			negatedExtglob
		};
		if (opts.tokens === true) {
			state.maxDepth = 0;
			if (!isPathSeparator(code)) tokens.push(token);
			state.tokens = tokens;
		}
		if (opts.parts === true || opts.tokens === true) {
			let prevIndex;
			for (let idx = 0; idx < slashes.length; idx++) {
				const n = prevIndex ? prevIndex + 1 : start;
				const i = slashes[idx];
				const value = input.slice(n, i);
				if (opts.tokens) {
					if (idx === 0 && start !== 0) {
						tokens[idx].isPrefix = true;
						tokens[idx].value = prefix;
					} else tokens[idx].value = value;
					depth(tokens[idx]);
					state.maxDepth += tokens[idx].depth;
				}
				if (idx !== 0 || value !== "") parts.push(value);
				prevIndex = i;
			}
			if (prevIndex && prevIndex + 1 < input.length) {
				const value = input.slice(prevIndex + 1);
				parts.push(value);
				if (opts.tokens) {
					tokens[tokens.length - 1].value = value;
					depth(tokens[tokens.length - 1]);
					state.maxDepth += tokens[tokens.length - 1].depth;
				}
			}
			state.slashes = slashes;
			state.parts = parts;
		}
		return state;
	};
	module.exports = scan;
}));
//#endregion
//#region node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var constants = require_constants();
	var utils = require_utils();
	/**
	* Constants
	*/
	var { MAX_LENGTH, POSIX_REGEX_SOURCE, REGEX_NON_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_BACKREF, REPLACEMENTS } = constants;
	/**
	* Helpers
	*/
	var expandRange = (args, options) => {
		if (typeof options.expandRange === "function") return options.expandRange(...args, options);
		args.sort();
		const value = `[${args.join("-")}]`;
		try {
			new RegExp(value);
		} catch (ex) {
			return args.map((v) => utils.escapeRegex(v)).join("..");
		}
		return value;
	};
	/**
	* Create the message for a syntax error
	*/
	var syntaxError = (type, char) => {
		return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
	};
	var splitTopLevel = (input) => {
		const parts = [];
		let bracket = 0;
		let paren = 0;
		let quote = 0;
		let value = "";
		let escaped = false;
		for (const ch of input) {
			if (escaped === true) {
				value += ch;
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				value += ch;
				escaped = true;
				continue;
			}
			if (ch === "\"") {
				quote = quote === 1 ? 0 : 1;
				value += ch;
				continue;
			}
			if (quote === 0) {
				if (ch === "[") bracket++;
				else if (ch === "]" && bracket > 0) bracket--;
				else if (bracket === 0) {
					if (ch === "(") paren++;
					else if (ch === ")" && paren > 0) paren--;
					else if (ch === "|" && paren === 0) {
						parts.push(value);
						value = "";
						continue;
					}
				}
			}
			value += ch;
		}
		parts.push(value);
		return parts;
	};
	var isPlainBranch = (branch) => {
		let escaped = false;
		for (const ch of branch) {
			if (escaped === true) {
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				escaped = true;
				continue;
			}
			if (/[?*+@!()[\]{}]/.test(ch)) return false;
		}
		return true;
	};
	var normalizeSimpleBranch = (branch) => {
		let value = branch.trim();
		let changed = true;
		while (changed === true) {
			changed = false;
			if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
				value = value.slice(2, -1);
				changed = true;
			}
		}
		if (!isPlainBranch(value)) return;
		return value.replace(/\\(.)/g, "$1");
	};
	var hasRepeatedCharPrefixOverlap = (branches) => {
		const values = branches.map(normalizeSimpleBranch).filter(Boolean);
		for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) {
			const a = values[i];
			const b = values[j];
			const char = a[0];
			if (!char || a !== char.repeat(a.length) || b !== char.repeat(b.length)) continue;
			if (a === b || a.startsWith(b) || b.startsWith(a)) return true;
		}
		return false;
	};
	var parseRepeatedExtglob = (pattern, requireEnd = true) => {
		if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") return;
		let bracket = 0;
		let paren = 0;
		let quote = 0;
		let escaped = false;
		for (let i = 1; i < pattern.length; i++) {
			const ch = pattern[i];
			if (escaped === true) {
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				escaped = true;
				continue;
			}
			if (ch === "\"") {
				quote = quote === 1 ? 0 : 1;
				continue;
			}
			if (quote === 1) continue;
			if (ch === "[") {
				bracket++;
				continue;
			}
			if (ch === "]" && bracket > 0) {
				bracket--;
				continue;
			}
			if (bracket > 0) continue;
			if (ch === "(") {
				paren++;
				continue;
			}
			if (ch === ")") {
				paren--;
				if (paren === 0) {
					if (requireEnd === true && i !== pattern.length - 1) return;
					return {
						type: pattern[0],
						body: pattern.slice(2, i),
						end: i
					};
				}
			}
		}
	};
	var buildCharClassStar = (chars) => {
		return `${chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`}*`;
	};
	var getStarExtglobSequenceChars = (pattern) => {
		let index = 0;
		const chars = [];
		while (index < pattern.length) {
			const match = parseRepeatedExtglob(pattern.slice(index), false);
			if (!match || match.type !== "*") return;
			const branches = splitTopLevel(match.body).map((branch) => branch.trim());
			if (branches.length !== 1) return;
			const branch = normalizeSimpleBranch(branches[0]);
			if (!branch || branch.length !== 1) return;
			chars.push(branch);
			index += match.end + 1;
		}
		if (chars.length < 1) return;
		return chars;
	};
	var repeatedExtglobRecursion = (pattern) => {
		let depth = 0;
		let value = pattern.trim();
		let match = parseRepeatedExtglob(value);
		while (match) {
			depth++;
			value = match.body.trim();
			match = parseRepeatedExtglob(value);
		}
		return depth;
	};
	var analyzeRepeatedExtglob = (body, options) => {
		if (options.maxExtglobRecursion === false) return { risky: false };
		const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
		const branches = splitTopLevel(body).map((branch) => branch.trim());
		if (branches.length > 1) {
			if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) return { risky: true };
		}
		const safeChars = [];
		let sawStarSequence = false;
		let combinable = true;
		for (const branch of branches) {
			const chars = getStarExtglobSequenceChars(branch);
			if (chars) {
				sawStarSequence = true;
				safeChars.push(...chars);
				continue;
			}
			const literal = normalizeSimpleBranch(branch);
			if (literal && literal.length === 1) {
				safeChars.push(literal);
				continue;
			}
			combinable = false;
			if (repeatedExtglobRecursion(branch) > max) return { risky: true };
		}
		if (sawStarSequence) return combinable ? {
			risky: true,
			safeOutput: buildCharClassStar([...new Set(safeChars)])
		} : { risky: true };
		return { risky: false };
	};
	/**
	* Parse the given input string.
	* @param {String} input
	* @param {Object} options
	* @return {Object}
	*/
	var parse = (input, options) => {
		if (typeof input !== "string") throw new TypeError("Expected a string");
		input = REPLACEMENTS[input] || input;
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		let len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		const bos = {
			type: "bos",
			value: "",
			output: opts.prepend || ""
		};
		const tokens = [bos];
		const capture = opts.capture ? "" : "?:";
		const PLATFORM_CHARS = constants.globChars(opts.windows);
		const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
		const { DOT_LITERAL, PLUS_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOT_SLASH, NO_DOTS_SLASH, QMARK, QMARK_NO_DOT, STAR, START_ANCHOR } = PLATFORM_CHARS;
		const globstar = (opts) => {
			return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const nodot = opts.dot ? "" : NO_DOT;
		const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
		let star = opts.bash === true ? globstar(opts) : STAR;
		if (opts.capture) star = `(${star})`;
		if (typeof opts.noext === "boolean") opts.noextglob = opts.noext;
		const state = {
			input,
			index: -1,
			start: 0,
			dot: opts.dot === true,
			consumed: "",
			output: "",
			prefix: "",
			backtrack: false,
			negated: false,
			brackets: 0,
			braces: 0,
			parens: 0,
			quotes: 0,
			globstar: false,
			tokens
		};
		input = utils.removePrefix(input, state);
		len = input.length;
		const extglobs = [];
		const braces = [];
		const stack = [];
		let prev = bos;
		let value;
		/**
		* Tokenizing helpers
		*/
		const eos = () => state.index === len - 1;
		const peek = state.peek = (n = 1) => input[state.index + n];
		const advance = state.advance = () => input[++state.index] || "";
		const remaining = () => input.slice(state.index + 1);
		const consume = (value = "", num = 0) => {
			state.consumed += value;
			state.index += num;
		};
		const append = (token) => {
			state.output += token.output != null ? token.output : token.value;
			consume(token.value);
		};
		const negate = () => {
			let count = 1;
			while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
				advance();
				state.start++;
				count++;
			}
			if (count % 2 === 0) return false;
			state.negated = true;
			state.start++;
			return true;
		};
		const increment = (type) => {
			state[type]++;
			stack.push(type);
		};
		const decrement = (type) => {
			state[type]--;
			stack.pop();
		};
		/**
		* Push tokens onto the tokens array. This helper speeds up
		* tokenizing by 1) helping us avoid backtracking as much as possible,
		* and 2) helping us avoid creating extra tokens when consecutive
		* characters are plain text. This improves performance and simplifies
		* lookbehinds.
		*/
		const push = (tok) => {
			if (prev.type === "globstar") {
				const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
				const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
				if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
					state.output = state.output.slice(0, -prev.output.length);
					prev.type = "star";
					prev.value = "*";
					prev.output = star;
					state.output += prev.output;
				}
			}
			if (extglobs.length && tok.type !== "paren") extglobs[extglobs.length - 1].inner += tok.value;
			if (tok.value || tok.output) append(tok);
			if (prev && prev.type === "text" && tok.type === "text") {
				prev.output = (prev.output || prev.value) + tok.value;
				prev.value += tok.value;
				return;
			}
			tok.prev = prev;
			tokens.push(tok);
			prev = tok;
		};
		const extglobOpen = (type, value) => {
			const token = {
				...EXTGLOB_CHARS[value],
				conditions: 1,
				inner: ""
			};
			token.prev = prev;
			token.parens = state.parens;
			token.output = state.output;
			token.startIndex = state.index;
			token.tokensIndex = tokens.length;
			const output = (opts.capture ? "(" : "") + token.open;
			increment("parens");
			push({
				type,
				value,
				output: state.output ? "" : ONE_CHAR
			});
			push({
				type: "paren",
				extglob: true,
				value: advance(),
				output
			});
			extglobs.push(token);
		};
		const extglobClose = (token) => {
			const literal = input.slice(token.startIndex, state.index + 1);
			const analysis = analyzeRepeatedExtglob(input.slice(token.startIndex + 2, state.index), opts);
			if ((token.type === "plus" || token.type === "star") && analysis.risky) {
				const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
				const open = tokens[token.tokensIndex];
				open.type = "text";
				open.value = literal;
				open.output = safeOutput || utils.escapeRegex(literal);
				for (let i = token.tokensIndex + 1; i < tokens.length; i++) {
					tokens[i].value = "";
					tokens[i].output = "";
					delete tokens[i].suffix;
				}
				state.output = token.output + open.output;
				state.backtrack = true;
				push({
					type: "paren",
					extglob: true,
					value,
					output: ""
				});
				decrement("parens");
				return;
			}
			let output = token.close + (opts.capture ? ")" : "");
			let rest;
			if (token.type === "negate") {
				let extglobStar = star;
				if (token.inner && token.inner.length > 1 && token.inner.includes("/")) extglobStar = globstar(opts);
				if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) output = token.close = `)$))${extglobStar}`;
				if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) output = token.close = `)${parse(rest, {
					...options,
					fastpaths: false
				}).output})${extglobStar})`;
				if (token.prev.type === "bos") state.negatedExtglob = true;
			}
			push({
				type: "paren",
				extglob: true,
				value,
				output
			});
			decrement("parens");
		};
		/**
		* Fast paths
		*/
		if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
			let backslashes = false;
			let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
				if (first === "\\") {
					backslashes = true;
					return m;
				}
				if (first === "?") {
					if (esc) return esc + first + (rest ? QMARK.repeat(rest.length) : "");
					if (index === 0) return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
					return QMARK.repeat(chars.length);
				}
				if (first === ".") return DOT_LITERAL.repeat(chars.length);
				if (first === "*") {
					if (esc) return esc + first + (rest ? star : "");
					return star;
				}
				return esc ? m : `\\${m}`;
			});
			if (backslashes === true) {
				if (opts.unescape === true) output = output.replace(/\\/g, "");
				else output = output.replace(/\\+/g, (m) => {
					return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
				});
			}
			if (output === input && opts.contains === true) {
				state.output = input;
				return state;
			}
			state.output = utils.wrapOutput(output, state, options);
			return state;
		}
		/**
		* Tokenize input until we reach end-of-string
		*/
		while (!eos()) {
			value = advance();
			if (value === "\0") continue;
			/**
			* Escaped characters
			*/
			if (value === "\\") {
				const next = peek();
				if (next === "/" && opts.bash !== true) continue;
				if (next === "." || next === ";") continue;
				if (!next) {
					value += "\\";
					push({
						type: "text",
						value
					});
					continue;
				}
				const match = /^\\+/.exec(remaining());
				let slashes = 0;
				if (match && match[0].length > 2) {
					slashes = match[0].length;
					state.index += slashes;
					if (slashes % 2 !== 0) value += "\\";
				}
				if (opts.unescape === true) value = advance();
				else value += advance();
				if (state.brackets === 0) {
					push({
						type: "text",
						value
					});
					continue;
				}
			}
			/**
			* If we're inside a regex character class, continue
			* until we reach the closing bracket.
			*/
			if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
				if (opts.posix !== false && value === ":") {
					const inner = prev.value.slice(1);
					if (inner.includes("[")) {
						prev.posix = true;
						if (inner.includes(":")) {
							const idx = prev.value.lastIndexOf("[");
							const pre = prev.value.slice(0, idx);
							const posix = POSIX_REGEX_SOURCE[prev.value.slice(idx + 2)];
							if (posix) {
								prev.value = pre + posix;
								state.backtrack = true;
								advance();
								if (!bos.output && tokens.indexOf(prev) === 1) bos.output = ONE_CHAR;
								continue;
							}
						}
					}
				}
				if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") value = `\\${value}`;
				if (value === "]" && (prev.value === "[" || prev.value === "[^")) value = `\\${value}`;
				if (opts.posix === true && value === "!" && prev.value === "[") value = "^";
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* If we're inside a quoted string, continue
			* until we reach the closing double quote.
			*/
			if (state.quotes === 1 && value !== "\"") {
				value = utils.escapeRegex(value);
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* Double quotes
			*/
			if (value === "\"") {
				state.quotes = state.quotes === 1 ? 0 : 1;
				if (opts.keepQuotes === true) push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Parentheses
			*/
			if (value === "(") {
				increment("parens");
				push({
					type: "paren",
					value
				});
				continue;
			}
			if (value === ")") {
				if (state.parens === 0 && opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "("));
				const extglob = extglobs[extglobs.length - 1];
				if (extglob && state.parens === extglob.parens + 1) {
					extglobClose(extglobs.pop());
					continue;
				}
				push({
					type: "paren",
					value,
					output: state.parens ? ")" : "\\)"
				});
				decrement("parens");
				continue;
			}
			/**
			* Square brackets
			*/
			if (value === "[") {
				if (opts.nobracket === true || !remaining().includes("]")) {
					if (opts.nobracket !== true && opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
					value = `\\${value}`;
				} else increment("brackets");
				push({
					type: "bracket",
					value
				});
				continue;
			}
			if (value === "]") {
				if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				if (state.brackets === 0) {
					if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "["));
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				decrement("brackets");
				const prevValue = prev.value.slice(1);
				if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) value = `/${value}`;
				prev.value += value;
				append({ value });
				if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) continue;
				const escaped = utils.escapeRegex(prev.value);
				state.output = state.output.slice(0, -prev.value.length);
				if (opts.literalBrackets === true) {
					state.output += escaped;
					prev.value = escaped;
					continue;
				}
				prev.value = `(${capture}${escaped}|${prev.value})`;
				state.output += prev.value;
				continue;
			}
			/**
			* Braces
			*/
			if (value === "{" && opts.nobrace !== true) {
				increment("braces");
				const open = {
					type: "brace",
					value,
					output: "(",
					outputIndex: state.output.length,
					tokensIndex: state.tokens.length
				};
				braces.push(open);
				push(open);
				continue;
			}
			if (value === "}") {
				const brace = braces[braces.length - 1];
				if (opts.nobrace === true || !brace) {
					push({
						type: "text",
						value,
						output: value
					});
					continue;
				}
				let output = ")";
				if (brace.dots === true) {
					const arr = tokens.slice();
					const range = [];
					for (let i = arr.length - 1; i >= 0; i--) {
						tokens.pop();
						if (arr[i].type === "brace") break;
						if (arr[i].type !== "dots") range.unshift(arr[i].value);
					}
					output = expandRange(range, opts);
					state.backtrack = true;
				}
				if (brace.comma !== true && brace.dots !== true) {
					const out = state.output.slice(0, brace.outputIndex);
					const toks = state.tokens.slice(brace.tokensIndex);
					brace.value = brace.output = "\\{";
					value = output = "\\}";
					state.output = out;
					for (const t of toks) state.output += t.output || t.value;
				}
				push({
					type: "brace",
					value,
					output
				});
				decrement("braces");
				braces.pop();
				continue;
			}
			/**
			* Pipes
			*/
			if (value === "|") {
				if (extglobs.length > 0) extglobs[extglobs.length - 1].conditions++;
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Commas
			*/
			if (value === ",") {
				let output = value;
				const brace = braces[braces.length - 1];
				if (brace && stack[stack.length - 1] === "braces") {
					brace.comma = true;
					output = "|";
				}
				push({
					type: "comma",
					value,
					output
				});
				continue;
			}
			/**
			* Slashes
			*/
			if (value === "/") {
				if (prev.type === "dot" && state.index === state.start + 1) {
					state.start = state.index + 1;
					state.consumed = "";
					state.output = "";
					tokens.pop();
					prev = bos;
					continue;
				}
				push({
					type: "slash",
					value,
					output: SLASH_LITERAL
				});
				continue;
			}
			/**
			* Dots
			*/
			if (value === ".") {
				if (state.braces > 0 && prev.type === "dot") {
					if (prev.value === ".") prev.output = DOT_LITERAL;
					const brace = braces[braces.length - 1];
					prev.type = "dots";
					prev.output += value;
					prev.value += value;
					brace.dots = true;
					continue;
				}
				if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
					push({
						type: "text",
						value,
						output: DOT_LITERAL
					});
					continue;
				}
				push({
					type: "dot",
					value,
					output: DOT_LITERAL
				});
				continue;
			}
			/**
			* Question marks
			*/
			if (value === "?") {
				if (!(prev && prev.value === "(") && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("qmark", value);
					continue;
				}
				if (prev && prev.type === "paren") {
					const next = peek();
					let output = value;
					if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) output = `\\${value}`;
					push({
						type: "text",
						value,
						output
					});
					continue;
				}
				if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
					push({
						type: "qmark",
						value,
						output: QMARK_NO_DOT
					});
					continue;
				}
				push({
					type: "qmark",
					value,
					output: QMARK
				});
				continue;
			}
			/**
			* Exclamation
			*/
			if (value === "!") {
				if (opts.noextglob !== true && peek() === "(") {
					if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
						extglobOpen("negate", value);
						continue;
					}
				}
				if (opts.nonegate !== true && state.index === 0) {
					negate();
					continue;
				}
			}
			/**
			* Plus
			*/
			if (value === "+") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("plus", value);
					continue;
				}
				if (prev && prev.value === "(" || opts.regex === false) {
					push({
						type: "plus",
						value,
						output: PLUS_LITERAL
					});
					continue;
				}
				if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
					push({
						type: "plus",
						value
					});
					continue;
				}
				push({
					type: "plus",
					value: PLUS_LITERAL
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value === "@") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					push({
						type: "at",
						extglob: true,
						value,
						output: ""
					});
					continue;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value !== "*") {
				if (value === "$" || value === "^") value = `\\${value}`;
				const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
				if (match) {
					value += match[0];
					state.index += match[0].length;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Stars
			*/
			if (prev && (prev.type === "globstar" || prev.star === true)) {
				prev.type = "star";
				prev.star = true;
				prev.value += value;
				prev.output = star;
				state.backtrack = true;
				state.globstar = true;
				consume(value);
				continue;
			}
			let rest = remaining();
			if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
				extglobOpen("star", value);
				continue;
			}
			if (prev.type === "star") {
				if (opts.noglobstar === true) {
					consume(value);
					continue;
				}
				const prior = prev.prev;
				const before = prior.prev;
				const isStart = prior.type === "slash" || prior.type === "bos";
				const afterStar = before && (before.type === "star" || before.type === "globstar");
				if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
				const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
				if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				while (rest.slice(0, 3) === "/**") {
					const after = input[state.index + 4];
					if (after && after !== "/") break;
					rest = rest.slice(3);
					consume("/**", 3);
				}
				if (prior.type === "bos" && eos()) {
					prev.type = "globstar";
					prev.value += value;
					prev.output = globstar(opts);
					state.output = prev.output;
					state.globstar = true;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
					prev.value += value;
					state.globstar = true;
					state.output += prior.output + prev.output;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
					const end = rest[1] !== void 0 ? "|$" : "";
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
					prev.value += value;
					state.output += prior.output + prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				if (prior.type === "bos" && rest[0] === "/") {
					prev.type = "globstar";
					prev.value += value;
					prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
					state.output = prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				state.output = state.output.slice(0, -prev.output.length);
				prev.type = "globstar";
				prev.output = globstar(opts);
				prev.value += value;
				state.output += prev.output;
				state.globstar = true;
				consume(value);
				continue;
			}
			const token = {
				type: "star",
				value,
				output: star
			};
			if (opts.bash === true) {
				token.output = ".*?";
				if (prev.type === "bos" || prev.type === "slash") token.output = nodot + token.output;
				push(token);
				continue;
			}
			if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
				token.output = value;
				push(token);
				continue;
			}
			if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
				if (prev.type === "dot") {
					state.output += NO_DOT_SLASH;
					prev.output += NO_DOT_SLASH;
				} else if (opts.dot === true) {
					state.output += NO_DOTS_SLASH;
					prev.output += NO_DOTS_SLASH;
				} else {
					state.output += nodot;
					prev.output += nodot;
				}
				if (peek() !== "*") {
					state.output += ONE_CHAR;
					prev.output += ONE_CHAR;
				}
			}
			push(token);
		}
		while (state.brackets > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
			state.output = utils.escapeLast(state.output, "[");
			decrement("brackets");
		}
		while (state.parens > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
			state.output = utils.escapeLast(state.output, "(");
			decrement("parens");
		}
		while (state.braces > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
			state.output = utils.escapeLast(state.output, "{");
			decrement("braces");
		}
		if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) push({
			type: "maybe_slash",
			value: "",
			output: `${SLASH_LITERAL}?`
		});
		if (state.backtrack === true) {
			state.output = "";
			for (const token of state.tokens) {
				state.output += token.output != null ? token.output : token.value;
				if (token.suffix) state.output += token.suffix;
			}
		}
		return state;
	};
	/**
	* Fast paths for creating regular expressions for common glob patterns.
	* This can significantly speed up processing and has very little downside
	* impact when none of the fast paths match.
	*/
	parse.fastpaths = (input, options) => {
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		const len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		input = REPLACEMENTS[input] || input;
		const { DOT_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOTS, NO_DOTS_SLASH, STAR, START_ANCHOR } = constants.globChars(opts.windows);
		const nodot = opts.dot ? NO_DOTS : NO_DOT;
		const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
		const capture = opts.capture ? "" : "?:";
		const state = {
			negated: false,
			prefix: ""
		};
		let star = opts.bash === true ? ".*?" : STAR;
		if (opts.capture) star = `(${star})`;
		const globstar = (opts) => {
			if (opts.noglobstar === true) return star;
			return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const create = (str) => {
			switch (str) {
				case "*": return `${nodot}${ONE_CHAR}${star}`;
				case ".*": return `${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*.*": return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*/*": return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
				case "**": return nodot + globstar(opts);
				case "**/*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
				case "**/*.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "**/.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
				default: {
					const match = /^(.*?)\.(\w+)$/.exec(str);
					if (!match) return;
					const source = create(match[1]);
					if (!source) return;
					return source + DOT_LITERAL + match[2];
				}
			}
		};
		let source = create(utils.removePrefix(input, state));
		if (source && opts.strictSlashes !== true) source += `${SLASH_LITERAL}?`;
		return source;
	};
	module.exports = parse;
}));
//#endregion
//#region node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/picomatch.js
var require_picomatch$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var scan = require_scan();
	var parse = require_parse();
	var utils = require_utils();
	var constants = require_constants();
	var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
	/**
	* Creates a matcher function from one or more glob patterns. The
	* returned function takes a string to match as its first argument,
	* and returns true if the string is a match. The returned matcher
	* function also takes a boolean as the second argument that, when true,
	* returns an object with additional information.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch(glob[, options]);
	*
	* const isMatch = picomatch('*.!(*a)');
	* console.log(isMatch('a.a')); //=> false
	* console.log(isMatch('a.b')); //=> true
	*
	* // For environments without `node.js`, `picomatch/posix` provides you a dependency-free matcher, without automatic OS detection.
	* const picomatch = require('picomatch/posix');
	* // the same API, defaulting to posix paths
	* const isMatch = picomatch('a/*');
	* console.log(isMatch('a\\b')); //=> false
	* console.log(isMatch('a/b')); //=> true
	*
	* // you can still configure the matcher function to accept windows paths
	* const isMatch = picomatch('a/*', { options: windows });
	* console.log(isMatch('a\\b')); //=> true
	* console.log(isMatch('a/b')); //=> true
	* ```
	* @name picomatch
	* @param {String|Array} `globs` One or more glob patterns.
	* @param {Object=} `options`
	* @return {Function=} Returns a matcher function.
	* @api public
	*/
	var picomatch = (glob, options, returnState = false) => {
		if (Array.isArray(glob)) {
			const fns = glob.map((input) => picomatch(input, options, returnState));
			const arrayMatcher = (str) => {
				for (const isMatch of fns) {
					const state = isMatch(str);
					if (state) return state;
				}
				return false;
			};
			return arrayMatcher;
		}
		const isState = isObject(glob) && glob.tokens && glob.input;
		if (glob === "" || typeof glob !== "string" && !isState) throw new TypeError("Expected pattern to be a non-empty string");
		const opts = options || {};
		const posix = opts.windows;
		const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
		const state = regex.state;
		delete regex.state;
		let isIgnored = () => false;
		if (opts.ignore) {
			const ignoreOpts = {
				...options,
				ignore: null,
				onMatch: null,
				onResult: null
			};
			isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
		}
		const matcher = (input, returnObject = false) => {
			const { isMatch, match, output } = picomatch.test(input, regex, options, {
				glob,
				posix
			});
			const result = {
				glob,
				state,
				regex,
				posix,
				input,
				output,
				match,
				isMatch
			};
			if (typeof opts.onResult === "function") opts.onResult(result);
			if (isMatch === false) {
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (isIgnored(input)) {
				if (typeof opts.onIgnore === "function") opts.onIgnore(result);
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (typeof opts.onMatch === "function") opts.onMatch(result);
			return returnObject ? result : true;
		};
		if (returnState) matcher.state = state;
		return matcher;
	};
	/**
	* Test `input` with the given `regex`. This is used by the main
	* `picomatch()` function to test the input string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.test(input, regex[, options]);
	*
	* console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
	* // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp} `regex`
	* @return {Object} Returns an object with matching info.
	* @api public
	*/
	picomatch.test = (input, regex, options, { glob, posix } = {}) => {
		if (typeof input !== "string") throw new TypeError("Expected input to be a string");
		if (input === "") return {
			isMatch: false,
			output: ""
		};
		const opts = options || {};
		const format = opts.format || (posix ? utils.toPosixSlashes : null);
		let match = input === glob;
		let output = match && format ? format(input) : input;
		if (match === false) {
			output = format ? format(input) : input;
			match = output === glob;
		}
		if (match === false || opts.capture === true) {
			if (opts.matchBase === true || opts.basename === true) match = picomatch.matchBase(input, regex, options, posix);
			else match = regex.exec(output);
		}
		return {
			isMatch: Boolean(match),
			match,
			output
		};
	};
	/**
	* Match the basename of a filepath.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.matchBase(input, glob[, options]);
	* console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
	* @return {Boolean}
	* @api public
	*/
	picomatch.matchBase = (input, glob, options, posix = options && options.windows) => {
		return (glob instanceof RegExp ? glob : picomatch.makeRe(glob, options)).test(utils.basename(input, { windows: posix }));
	};
	/**
	* Returns true if **any** of the given glob `patterns` match the specified `string`.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.isMatch(string, patterns[, options]);
	*
	* console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
	* console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
	* ```
	* @param {String|Array} str The string to test.
	* @param {String|Array} patterns One or more glob patterns to use for matching.
	* @param {Object} [options] See available [options](#options).
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
	/**
	* Parse a glob pattern to create the source string for a regular
	* expression.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const result = picomatch.parse(pattern[, options]);
	* ```
	* @param {String} `pattern`
	* @param {Object} `options`
	* @return {Object} Returns an object with useful properties and output to be used as a regex source string.
	* @api public
	*/
	picomatch.parse = (pattern, options) => {
		if (Array.isArray(pattern)) return pattern.map((p) => picomatch.parse(p, options));
		return parse(pattern, {
			...options,
			fastpaths: false
		});
	};
	/**
	* Scan a glob pattern to separate the pattern into segments.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.scan(input[, options]);
	*
	* const result = picomatch.scan('!./foo/*.js');
	* console.log(result);
	* { prefix: '!./',
	*   input: '!./foo/*.js',
	*   start: 3,
	*   base: 'foo',
	*   glob: '*.js',
	*   isBrace: false,
	*   isBracket: false,
	*   isGlob: true,
	*   isExtglob: false,
	*   isGlobstar: false,
	*   negated: true }
	* ```
	* @param {String} `input` Glob pattern to scan.
	* @param {Object} `options`
	* @return {Object} Returns an object with
	* @api public
	*/
	picomatch.scan = (input, options) => scan(input, options);
	/**
	* Compile a regular expression from the `state` object returned by the
	* [parse()](#parse) method.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const state = picomatch.parse('*.js');
	* // picomatch.compileRe(state[, options]);
	*
	* console.log(picomatch.compileRe(state));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {Object} `state`
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
	* @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
	* @return {RegExp}
	* @api public
	*/
	picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
		if (returnOutput === true) return state.output;
		const opts = options || {};
		const prepend = opts.contains ? "" : "^";
		const append = opts.contains ? "" : "$";
		let source = `${prepend}(?:${state.output})${append}`;
		if (state && state.negated === true) source = `^(?!${source}).*$`;
		const regex = picomatch.toRegex(source, options);
		if (returnState === true) regex.state = state;
		return regex;
	};
	/**
	* Create a regular expression from a parsed glob pattern.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.makeRe(state[, options]);
	*
	* const result = picomatch.makeRe('*.js');
	* console.log(result);
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `state` The object returned from the `.parse` method.
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
	* @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
	* @return {RegExp} Returns a regex created from the given pattern.
	* @api public
	*/
	picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
		if (!input || typeof input !== "string") throw new TypeError("Expected a non-empty string");
		let parsed = {
			negated: false,
			fastpaths: true
		};
		if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) parsed.output = parse.fastpaths(input, options);
		if (!parsed.output) parsed = parse(input, options);
		return picomatch.compileRe(parsed, options, returnOutput, returnState);
	};
	/**
	* Create a regular expression from the given regex source string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.toRegex(source[, options]);
	*
	* const { output } = picomatch.parse('*.js');
	* console.log(picomatch.toRegex(output));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `source` Regular expression source string.
	* @param {Object} `options`
	* @return {RegExp}
	* @api public
	*/
	picomatch.toRegex = (source, options) => {
		try {
			const opts = options || {};
			return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
		} catch (err) {
			if (options && options.debug === true) throw err;
			return /$^/;
		}
	};
	/**
	* Picomatch constants.
	* @return {Object}
	*/
	picomatch.constants = constants;
	/**
	* Expose "picomatch"
	*/
	module.exports = picomatch;
}));
//#endregion
//#region node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/index.js
var require_picomatch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var pico = require_picomatch$1();
	var utils = require_utils();
	function picomatch(glob, options, returnState = false) {
		if (options && (options.windows === null || options.windows === void 0)) options = {
			...options,
			windows: utils.isWindows()
		};
		return pico(glob, options, returnState);
	}
	Object.assign(picomatch, pico);
	module.exports = picomatch;
}));
require_dist();
nodePath.posix.join;
//#endregion
//#region node_modules/.pnpm/@astrojs+vercel@11.0.5_astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+f_91f9c84786cb40228a54c6ef04e0081e/node_modules/@astrojs/vercel/dist/index.js
var ASTRO_PATH_HEADER = "x-astro-path";
var ASTRO_PATH_PARAM = "x_astro_path";
var ASTRO_PATH_TOKEN_PARAM = "x_astro_path_token";
var ASTRO_LOCALS_HEADER = "x-astro-locals";
var ASTRO_MIDDLEWARE_SECRET_HEADER = "x-astro-middleware-secret";
//#endregion
//#region \0virtual:astro-vercel:config
var middlewareSecret = "b7cacb24-cd0b-4e3b-a2b2-fafd3d989ec6";
//#endregion
//#region node_modules/.pnpm/devalue@5.9.0/node_modules/devalue/src/stringify.js
/**
* Turn a value into a JSON string that can be parsed with `devalue.parse`
* @param {any} value
* @param {Record<string, (value: any) => any>} [reducers]
* @param {import('./types.js').StringifyOptions} [options]
*/
function stringify(value, reducers, options) {
	const stringified = run(false, value, reducers, options);
	return typeof stringified === "string" ? stringified : `[${stringified.join(",")}]`;
}
/**
* @param {boolean} async
* @param {any} value
* @param {Record<string, (value: any) => any>} [reducers]
* @param {import('./types.js').StringifyOptions} [options]
*/
function run(async, value, reducers, options) {
	const ops = merge_operations(default_stringify_operations, options?.operations);
	/** @type {any[]} */
	const stringified = [];
	/** @type {Map<any, number>} */
	const indexes = /* @__PURE__ */ new Map();
	/** @type {Array<{ key: string, fn: (value: any) => any }>} */
	const custom = [];
	if (reducers) for (const key of Object.getOwnPropertyNames(reducers)) custom.push({
		key,
		fn: reducers[key]
	});
	/** @type {string[]} */
	const keys = [];
	let p = 0;
	/**
	* @param {any} thing
	* @param {number} [index]
	*/
	function flatten(thing, index) {
		const type = ops.typeOf(thing);
		if (type === "undefined") return -1;
		/** @type {number | undefined} */
		let number;
		if (type === "number") {
			number = ops.toPrimitive(thing);
			if (Number.isNaN(number)) return -3;
			if (number === Infinity) return -4;
			if (number === -Infinity) return -5;
			if (number === 0 && 1 / number < 0) return -6;
		}
		const id = ops.identify(thing);
		if (indexes.has(id)) return indexes.get(id);
		index ??= p++;
		indexes.set(id, index);
		for (const { key, fn } of custom) {
			const value = fn(thing);
			if (value) {
				stringified[index] = `["${key}",${flatten(value)}]`;
				return index;
			}
		}
		if (type === "function") throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
		else if (type === "symbol") throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
		/** @type {string | Promise<any>} */
		let str = "";
		if (type !== "object") str = stringify_primitive(type === "number" ? number : ops.toPrimitive(thing));
		else if (ops.isThenable(thing)) {
			if (!async) throw new DevalueError(`Cannot stringify a Promise or thenable — use stringifyAsync instead`, keys, thing, value);
			str = ops.toPromise(thing).then((value) => {
				const i = flatten(value, index);
				if (i < 0) stringified[index] = i;
			});
		} else {
			const tag = ops.tagOf(thing);
			switch (tag) {
				case "Number":
				case "String":
				case "Boolean":
				case "BigInt":
					str = `["Object",${flatten(ops.unbox(thing))}]`;
					break;
				case "Date":
					str = `["Date","${ops.toISOString(thing)}"]`;
					break;
				case "URL":
					str = `["URL",${stringify_string(ops.toStringValue(thing))}]`;
					break;
				case "URLSearchParams":
					str = `["URLSearchParams",${stringify_string(ops.toStringValue(thing))}]`;
					break;
				case "RegExp":
					const { source, flags } = ops.regExpInfo(thing);
					str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
					break;
				case "Array": {
					let mostly_dense = false;
					const length = ops.lengthOf(thing);
					str = "[";
					for (let i = 0; i < length; i += 1) {
						if (i > 0) str += ",";
						if (ops.hasOwn(thing, i)) {
							keys.push(`[${i}]`);
							str += flatten(ops.get(thing, i));
							keys.pop();
						} else if (mostly_dense) str += -2;
						else {
							const populated_keys = ops.indicesOf(thing);
							const population = populated_keys.length;
							const d = String(length).length;
							if ((length - population) * 3 > 4 + d + population * (d + 1)) {
								str = "[-7," + length;
								for (let j = 0; j < populated_keys.length; j++) {
									const key = populated_keys[j];
									keys.push(`[${key}]`);
									str += "," + key + "," + flatten(ops.get(thing, key));
									keys.pop();
								}
								break;
							} else {
								mostly_dense = true;
								str += -2;
							}
						}
					}
					str += "]";
					break;
				}
				case "Set":
					str = "[\"Set\"";
					for (const value of ops.valuesOf(thing)) str += `,${flatten(value)}`;
					str += "]";
					break;
				case "Map":
					str = "[\"Map\"";
					for (const [key, value] of ops.entriesOf(thing)) {
						const key_type = ops.typeOf(key);
						const key_is_primitive = key_type !== "object" && key_type !== "function" && key_type !== "symbol";
						keys.push(`.get(${key_is_primitive ? stringify_primitive(ops.toPrimitive(key)) : "..."})`);
						str += `,${flatten(key)},${flatten(value)}`;
						keys.pop();
					}
					str += "]";
					break;
				case "Int8Array":
				case "Uint8Array":
				case "Uint8ClampedArray":
				case "Int16Array":
				case "Uint16Array":
				case "Float16Array":
				case "Int32Array":
				case "Uint32Array":
				case "Float32Array":
				case "Float64Array":
				case "BigInt64Array":
				case "BigUint64Array": {
					const info = ops.viewInfo(thing);
					str = "[\"" + tag + "\"," + flatten(info.buffer);
					if (info.byteLength !== info.bufferByteLength) str += `,${info.byteOffset},${info.length}`;
					str += "]";
					break;
				}
				case "DataView": {
					const info = ops.viewInfo(thing);
					str = "[\"" + tag + "\"," + flatten(info.buffer);
					if (info.byteLength !== info.bufferByteLength) str += `,${info.byteOffset},${info.byteLength}`;
					str += "]";
					break;
				}
				case "ArrayBuffer":
					str = `["ArrayBuffer","${encode64(ops.toArrayBuffer(thing))}"]`;
					break;
				case "Temporal.Duration":
				case "Temporal.Instant":
				case "Temporal.PlainDate":
				case "Temporal.PlainTime":
				case "Temporal.PlainDateTime":
				case "Temporal.PlainMonthDay":
				case "Temporal.PlainYearMonth":
				case "Temporal.ZonedDateTime":
					str = `["${tag}",${stringify_string(ops.toStringValue(thing))}]`;
					break;
				default: {
					const shape = ops.shapeOf(thing);
					if (shape.kind === "not-plain") throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
					if (shape.kind === "symbol-keys") throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
					if (shape.kind === "null-proto") {
						str = "[\"null\"";
						for (const key of shape.keys) {
							if (key === "__proto__") throw new DevalueError(`Cannot stringify objects with __proto__ keys`, keys, thing, value);
							keys.push(stringify_key(key));
							str += `,${stringify_string(key)},${flatten(ops.get(thing, key))}`;
							keys.pop();
						}
						str += "]";
					} else {
						str = "{";
						let started = false;
						for (const key of shape.keys) {
							if (key === "__proto__") throw new DevalueError(`Cannot stringify objects with __proto__ keys`, keys, thing, value);
							if (started) str += ",";
							started = true;
							keys.push(stringify_key(key));
							str += `${stringify_string(key)}:${flatten(ops.get(thing, key))}`;
							keys.pop();
						}
						str += "}";
					}
				}
			}
		}
		stringified[index] = str;
		return index;
	}
	const index = flatten(value);
	if (index < 0) return `${index}`;
	return stringified;
}
/**
* @param {any} thing
* @returns {string}
*/
function stringify_primitive(thing) {
	const type = typeof thing;
	if (type === "string") return stringify_string(thing);
	if (thing === void 0) return (-1).toString();
	if (thing === 0 && 1 / thing < 0) return (-6).toString();
	if (type === "bigint") return `["BigInt","${thing}"]`;
	return String(thing);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/actions/consts.js
var ACTION_QUERY_PARAMS = {
	actionName: "_action",
	actionPayload: "_astroActionPayload"
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/actions/runtime/client.js
var codeToStatusMap = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	PROXY_AUTHENTICATION_REQUIRED: 407,
	REQUEST_TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	CONTENT_TOO_LARGE: 413,
	URI_TOO_LONG: 414,
	UNSUPPORTED_MEDIA_TYPE: 415,
	RANGE_NOT_SATISFIABLE: 416,
	EXPECTATION_FAILED: 417,
	MISDIRECTED_REQUEST: 421,
	UNPROCESSABLE_CONTENT: 422,
	LOCKED: 423,
	FAILED_DEPENDENCY: 424,
	TOO_EARLY: 425,
	UPGRADE_REQUIRED: 426,
	PRECONDITION_REQUIRED: 428,
	TOO_MANY_REQUESTS: 429,
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
	HTTP_VERSION_NOT_SUPPORTED: 505,
	VARIANT_ALSO_NEGOTIATES: 506,
	INSUFFICIENT_STORAGE: 507,
	LOOP_DETECTED: 508,
	NETWORK_AUTHENTICATION_REQUIRED: 511
};
var statusToCodeMap = Object.fromEntries(Object.entries(codeToStatusMap).map(([key, value]) => [value, key]));
var ActionError = class ActionError extends Error {
	type = "AstroActionError";
	code = "INTERNAL_SERVER_ERROR";
	status = 500;
	constructor(params) {
		super(params.message);
		this.code = params.code;
		this.status = ActionError.codeToStatus(params.code);
		if (params.stack) this.stack = params.stack;
	}
	static codeToStatus(code) {
		return codeToStatusMap[code];
	}
	static statusToCode(status) {
		return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
	}
	static fromJson(body) {
		if (isInputError(body)) return new ActionInputError(body.issues);
		if (isActionError(body)) return new ActionError(body);
		return new ActionError({ code: "INTERNAL_SERVER_ERROR" });
	}
};
function isActionError(error) {
	return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionError";
}
function isInputError(error) {
	return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionInputError" && "issues" in error && Array.isArray(error.issues);
}
var ActionInputError = class extends ActionError {
	type = "AstroActionInputError";
	issues;
	fields;
	constructor(issues) {
		super({
			message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
			code: "BAD_REQUEST"
		});
		this.issues = issues;
		this.fields = {};
		for (const issue of issues) if (issue.path.length > 0) {
			const key = issue.path[0].toString();
			this.fields[key] ??= [];
			this.fields[key]?.push(issue.message);
		}
	}
};
function deserializeActionResult(res) {
	if (res.type === "error") {
		let json;
		try {
			json = JSON.parse(res.body);
		} catch {
			return {
				data: void 0,
				error: new ActionError({
					message: res.body,
					code: "INTERNAL_SERVER_ERROR"
				})
			};
		}
		if (Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SITE": void 0,
			"SSR": true
		}, {})?.PROD) return {
			error: ActionError.fromJson(json),
			data: void 0
		};
		else {
			const error = ActionError.fromJson(json);
			error.stack = actionResultErrorStack.get();
			return {
				error,
				data: void 0
			};
		}
	}
	if (res.type === "empty") return {
		data: void 0,
		error: void 0
	};
	return {
		data: parse$2(res.body, { URL: (href) => new URL(href) }),
		error: void 0
	};
}
var actionResultErrorStack = /* @__PURE__ */ (function actionResultErrorStackFn() {
	let errorStack;
	return {
		set(stack) {
			errorStack = stack;
		},
		get() {
			return errorStack;
		}
	};
})();
function getActionQueryString(name) {
	return `?${new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name }).toString()}`;
}
(function(A) {
	return A[A.Static = 1] = "Static", A[A.Dynamic = 2] = "Dynamic", A[A.ImportMeta = 3] = "ImportMeta", A[A.StaticSourcePhase = 4] = "StaticSourcePhase", A[A.DynamicSourcePhase = 5] = "DynamicSourcePhase", A[A.StaticDeferPhase = 6] = "StaticDeferPhase", A[A.DynamicDeferPhase = 7] = "DynamicDeferPhase", A;
})({});
new Uint8Array(new Uint16Array([1]).buffer)[0];
var C = () => {
	return A = "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", "undefined" != typeof Buffer ? Buffer.from(A, "base64") : Uint8Array.from(atob(A), (A) => A.charCodeAt(0));
	var A;
};
WebAssembly.compile(C()).then(WebAssembly.instantiate).then(({ exports: A }) => {});
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/build/util.js
function shouldAppendForwardSlash(trailingSlash, buildFormat) {
	switch (trailingSlash) {
		case "always": return true;
		case "never": return false;
		case "ignore": switch (buildFormat) {
			case "directory": return true;
			case "preserve":
			case "file": return false;
		}
	}
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/request-body.js
async function readBodyWithLimit(request, limit) {
	const contentLengthHeader = request.headers.get("content-length");
	if (contentLengthHeader) {
		const contentLength = Number.parseInt(contentLengthHeader, 10);
		if (Number.isFinite(contentLength) && contentLength > limit) throw new BodySizeLimitError(limit);
	}
	if (!request.body) return /* @__PURE__ */ new Uint8Array();
	const reader = request.body.getReader();
	const chunks = [];
	let received = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		if (value) {
			received += value.byteLength;
			if (received > limit) throw new BodySizeLimitError(limit);
			chunks.push(value);
		}
	}
	const buffer = new Uint8Array(received);
	let offset = 0;
	for (const chunk of chunks) {
		buffer.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return buffer;
}
var BodySizeLimitError = class extends Error {
	limit;
	constructor(limit) {
		super(`Request body exceeds the configured limit of ${limit} bytes`);
		this.name = "BodySizeLimitError";
		this.limit = limit;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/actions/runtime/server.js
function getActionContext(context) {
	const callerInfo = getCallerInfo(context);
	const actionResultAlreadySet = Boolean(context.locals._actionPayload);
	let action = void 0;
	if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) action = {
		calledFrom: callerInfo.from,
		name: callerInfo.name,
		handler: async () => {
			const pipeline = Reflect.get(context, pipelineSymbol);
			const callerInfoName = shouldAppendForwardSlash(pipeline.manifest.trailingSlash, pipeline.manifest.buildFormat) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
			let baseAction;
			try {
				baseAction = await pipeline.getAction(callerInfoName);
			} catch (error) {
				if (error instanceof Error && "name" in error && typeof error.name === "string" && error.name === ActionNotFoundError.name) return {
					data: void 0,
					error: new ActionError({ code: "NOT_FOUND" })
				};
				throw error;
			}
			const bodySizeLimit = pipeline.manifest.actionBodySizeLimit;
			let input;
			try {
				input = await parseRequestBody(context.request, bodySizeLimit);
			} catch (e) {
				if (e instanceof ActionError) return {
					data: void 0,
					error: e
				};
				if (e instanceof TypeError) return {
					data: void 0,
					error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" })
				};
				throw e;
			}
			const omitKeys = [
				"props",
				"getActionResult",
				"callAction",
				"redirect"
			];
			const actionAPIContext = Object.create(Object.getPrototypeOf(context), Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(context)).filter(([key]) => !omitKeys.includes(key))));
			Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
			return baseAction.bind(actionAPIContext)(input);
		}
	};
	function setActionResult(actionName, actionResult) {
		context.locals._actionPayload = {
			actionResult,
			actionName
		};
	}
	return {
		action,
		setActionResult,
		serializeActionResult,
		deserializeActionResult
	};
}
function getCallerInfo(ctx) {
	if (ctx.routePattern === "/_actions/[...path]") return {
		from: "rpc",
		name: ctx.url.pathname.replace(/^.*\/_actions\//, "")
	};
	const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
	if (queryParam) return {
		from: "form",
		name: queryParam
	};
}
async function parseRequestBody(request, bodySizeLimit) {
	const contentType = request.headers.get("content-type");
	const contentLengthHeader = request.headers.get("content-length");
	const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
	const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
	if (!contentType) return void 0;
	if (hasContentLength && contentLength > bodySizeLimit) throw new ActionError({
		code: "CONTENT_TOO_LARGE",
		message: `Request body exceeds ${bodySizeLimit} bytes`
	});
	try {
		if (hasContentType(contentType, formContentTypes$1)) {
			if (!hasContentLength) {
				const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
				return await new Request(request.url, {
					method: request.method,
					headers: request.headers,
					body: toArrayBuffer(body)
				}).formData();
			}
			return await request.clone().formData();
		}
		if (hasContentType(contentType, ["application/json"])) {
			if (contentLength === 0) return void 0;
			if (!hasContentLength) {
				const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
				if (body.byteLength === 0) return void 0;
				return JSON.parse(new TextDecoder().decode(body));
			}
			return await request.clone().json();
		}
	} catch (e) {
		if (e instanceof BodySizeLimitError) throw new ActionError({
			code: "CONTENT_TOO_LARGE",
			message: `Request body exceeds ${bodySizeLimit} bytes`
		});
		throw e;
	}
	throw new TypeError("Unsupported content type");
}
var ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
var formContentTypes$1 = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
	const type = contentType.split(";")[0].toLowerCase();
	return expected.some((t) => type === t);
}
function serializeActionResult(res) {
	if (res.error) {
		if (Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SITE": void 0,
			"SSR": true
		}, {})?.DEV) actionResultErrorStack.set(res.error.stack);
		let body2;
		if (res.error instanceof ActionInputError) body2 = {
			type: res.error.type,
			issues: res.error.issues,
			fields: res.error.fields
		};
		else body2 = {
			...res.error,
			message: res.error.message
		};
		return {
			type: "error",
			status: res.error.status,
			contentType: "application/json",
			body: JSON.stringify(body2)
		};
	}
	if (res.data === void 0) return {
		type: "empty",
		status: 204
	};
	let body;
	try {
		body = stringify(res.data, { URL: (value) => value instanceof URL && value.href });
	} catch (e) {
		let hint = ActionsReturnedInvalidDataError.hint;
		if (res.data instanceof Response) hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
		throw new AstroError({
			...ActionsReturnedInvalidDataError,
			message: ActionsReturnedInvalidDataError.message(String(e)),
			hint
		});
	}
	return {
		type: "data",
		status: 200,
		contentType: "application/json+devalue",
		body
	};
}
function toArrayBuffer(buffer) {
	const copy = new Uint8Array(buffer.byteLength);
	copy.set(buffer);
	return copy.buffer;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/actions/utils.js
function hasActionPayload(locals) {
	return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
	return (actionFn) => {
		if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) return;
		return deserializeActionResult(locals._actionPayload.actionResult);
	};
}
function createCallAction(context) {
	return (baseAction, input) => {
		Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
		return baseAction.bind(context)(input);
	};
}
//#endregion
//#region node_modules/.pnpm/cookie@2.0.1/node_modules/cookie/dist/index.js
/**
* RegExp to match cookie-name in RFC 6265 sec 4.1.1
* This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
* which has been replaced by the token definition in RFC 7230 appendix B.
*
* cookie-name       = token
* token             = 1*tchar
* tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
*                     "*" / "+" / "-" / "." / "^" / "_" /
*                     "`" / "|" / "~" / DIGIT / ALPHA
*
* Note: Allowing more characters - https://github.com/jshttp/cookie/issues/191
* Allow same range as cookie value, except `=`, which delimits end of name.
*/
var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
/**
* RegExp to match cookie-value in RFC 6265 sec 4.1.1
*
* cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
* cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
*                     ; US-ASCII characters excluding CTLs,
*                     ; whitespace DQUOTE, comma, semicolon,
*                     ; and backslash
*
* Allowing more characters: https://github.com/jshttp/cookie/issues/191
* Comma, backslash, and DQUOTE are not part of the parsing algorithm.
*/
var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
/**
* RegExp to match domain-value in RFC 6265 sec 4.1.1
*
* domain-value      = <subdomain>
*                     ; defined in [RFC1034], Section 3.5, as
*                     ; enhanced by [RFC1123], Section 2.1
* <subdomain>       = <label> | <subdomain> "." <label>
* <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
*                     Labels must be 63 characters or less.
*                     'let-dig' not 'letter' in the first char, per RFC1123
* <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
* <let-dig-hyp>     = <let-dig> | "-"
* <let-dig>         = <letter> | <digit>
* <letter>          = any one of the 52 alphabetic characters A through Z in
*                     upper case and a through z in lower case
* <digit>           = any one of the ten digits 0 through 9
*
* Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
*
* > (Note that a leading %x2E ("."), if present, is ignored even though that
* character is not permitted, but a trailing %x2E ("."), if present, will
* cause the user agent to ignore the attribute.)
*/
var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
/**
* RegExp to match path-value in RFC 6265 sec 4.1.1
*
* path-value        = <any CHAR except CTLs or ";">
* CHAR              = %x01-7F
*                     ; defined in RFC 5234 appendix B.1
*/
var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
/**
* RegExp to match RFC 6265 cookie-octet values (without % to preserve roundtrip) that need no URL encoding.
*/
var cookieOctetRegExp = /^[!#$&'()*+\-.\/0-9:<=>?@A-Z[\]\^_`a-z{|}~]*$/;
var NullObject = /* @__PURE__ */ (() => {
	const C = function() {};
	C.prototype = Object.create(null);
	return C;
})();
/**
* Parse a `Cookie` header.
*
* Parse the given cookie header string into an object
* The object has the various cookies as keys(names) => values
*/
function parseCookie(str, options) {
	const obj = new NullObject();
	const len = str.length;
	if (len < 2) return obj;
	const dec = options?.decode || decode;
	let index = 0;
	do {
		const eqIdx = eqIndex(str, index, len);
		if (eqIdx === len) break;
		const endIdx = endIndex(str, index, len);
		if (eqIdx > endIdx) {
			index = str.lastIndexOf(";", eqIdx - 1) + 1;
			continue;
		}
		const key = valueSlice(str, index, eqIdx);
		if (obj[key] === void 0) obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
		index = endIdx + 1;
	} while (index < len);
	return obj;
}
/**
* Serialize data into a cookie header.
*
* Serialize a name value pair into a cookie string suitable for
* http headers. An optional options object specifies cookie parameters.
*
* stringifySetCookie({ name: 'foo', value: 'bar', httpOnly: true })
*   => "foo=bar; HttpOnly"
*/
function stringifySetCookie(cookie, options) {
	const enc = options?.encode || defaultEncode;
	if (!cookieNameRegExp.test(cookie.name)) throw new TypeError(`argument name is invalid: ${cookie.name}`);
	const value = cookie.value == null ? "" : enc(cookie.value);
	if (!cookieValueRegExp.test(value)) throw new TypeError(`argument val is invalid: ${cookie.value}`);
	let str = cookie.name + "=" + value;
	if (cookie.maxAge !== void 0) {
		if (!Number.isInteger(cookie.maxAge)) throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
		str += "; Max-Age=" + cookie.maxAge;
	}
	if (cookie.domain) {
		if (!domainValueRegExp.test(cookie.domain)) throw new TypeError(`option domain is invalid: ${cookie.domain}`);
		str += "; Domain=" + cookie.domain;
	}
	if (cookie.path) {
		if (!pathValueRegExp.test(cookie.path)) throw new TypeError(`option path is invalid: ${cookie.path}`);
		str += "; Path=" + cookie.path;
	}
	if (cookie.expires) {
		if (!Number.isFinite(cookie.expires.valueOf())) throw new TypeError(`option expires is invalid: ${cookie.expires}`);
		str += "; Expires=" + cookie.expires.toUTCString();
	}
	if (cookie.httpOnly) str += "; HttpOnly";
	if (cookie.secure) str += "; Secure";
	if (cookie.partitioned) str += "; Partitioned";
	if (cookie.priority) switch (typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0) {
		case "low":
			str += "; Priority=Low";
			break;
		case "medium":
			str += "; Priority=Medium";
			break;
		case "high":
			str += "; Priority=High";
			break;
		default: throw new TypeError(`option priority is invalid: ${cookie.priority}`);
	}
	if (cookie.sameSite) switch (typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite) {
		case true:
		case "strict":
			str += "; SameSite=Strict";
			break;
		case "lax":
			str += "; SameSite=Lax";
			break;
		case "none":
			str += "; SameSite=None";
			break;
		default: throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
	}
	return str;
}
/**
* Find the next `;` character, or return `len`.
*/
function endIndex(str, min, len) {
	const index = str.indexOf(";", min);
	return index === -1 ? len : index;
}
/**
* Find the next `=` character, or return `len`.
*/
function eqIndex(str, min, len) {
	const index = str.indexOf("=", min);
	return index === -1 ? len : index;
}
/**
* Slice out a value between startPod to max.
*/
function valueSlice(str, min, max) {
	if (min === max) return "";
	let start = min;
	let end = max;
	do {
		const code = str.charCodeAt(start);
		if (code !== 32 && code !== 9) break;
	} while (++start < end);
	while (end > start) {
		const code = str.charCodeAt(end - 1);
		if (code !== 32 && code !== 9) break;
		end--;
	}
	return str.slice(start, end);
}
/**
* URL-decode string value. Optimized to skip native call when no %.
*/
function decode(str) {
	if (str.indexOf("%") === -1) return str;
	try {
		return decodeURIComponent(str);
	} catch (e) {
		return str;
	}
}
/**
* URL-encode string value. Optimized to skip native call for roundtrip-safe cookie-octet values.
*/
function defaultEncode(str) {
	return cookieOctetRegExp.test(str) ? str : encodeURIComponent(str);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/cookies/cookies.js
var DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
var DELETED_VALUE = "deleted";
var responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
var identity = (value) => value;
var AstroCookie = class {
	value;
	constructor(value) {
		this.value = value;
	}
	json() {
		if (this.value === void 0) throw new Error(`Cannot convert undefined to an object.`);
		return JSON.parse(this.value);
	}
	number() {
		return Number(this.value);
	}
	boolean() {
		if (this.value === "false") return false;
		if (this.value === "0") return false;
		return Boolean(this.value);
	}
};
var AstroCookies = class {
	#request;
	#requestValues;
	#outgoing;
	#consumed;
	constructor(request) {
		this.#request = request;
		this.#requestValues = null;
		this.#outgoing = null;
		this.#consumed = false;
	}
	/**
	* Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
	* in a Set-Cookie header added to the response.
	* @param key The cookie to delete
	* @param options Options related to this deletion, such as the path of the cookie.
	*/
	delete(key, options) {
		this.#ensureOutgoingMap().set(key, [
			DELETED_VALUE,
			stringifySetCookie({
				...options,
				name: key,
				value: DELETED_VALUE,
				expires: DELETED_EXPIRATION,
				maxAge: void 0
			}),
			false
		]);
	}
	/**
	* Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
	* request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
	* from that set call, overriding any values already part of the request.
	* @param key The cookie to get.
	* @returns An object containing the cookie value as well as convenience methods for converting its value.
	*/
	get(key, options = void 0) {
		if (this.#outgoing?.has(key)) {
			let [serializedValue, , isSetValue] = this.#outgoing.get(key);
			if (isSetValue) return new AstroCookie(serializedValue);
			else return;
		}
		const decode = options?.decode ?? decodeURIComponent;
		const values = this.#ensureParsed();
		if (key in values) {
			const value = values[key];
			if (value) {
				let decodedValue;
				try {
					decodedValue = decode(value);
				} catch (_error) {
					decodedValue = value;
				}
				return new AstroCookie(decodedValue);
			}
		}
	}
	/**
	* Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
	* part of the initial request or set via Astro.cookies.set(key)
	* @param key The cookie to check for.
	* @param _options This parameter is no longer used.
	* @returns
	*/
	has(key, _options) {
		if (this.#outgoing?.has(key)) {
			let [, , isSetValue] = this.#outgoing.get(key);
			return isSetValue;
		}
		return this.#ensureParsed()[key] !== void 0;
	}
	/**
	* Astro.cookies.set(key, value) is used to set a cookie's value. If provided
	* an object it will be stringified via JSON.stringify(value). Additionally you
	* can provide options customizing how this cookie will be set, such as setting httpOnly
	* in order to prevent the cookie from being read in client-side JavaScript.
	* @param key The name of the cookie to set.
	* @param value A value, either a string or other primitive or an object.
	* @param options Options for the cookie, such as the path and security settings.
	*/
	set(key, value, options) {
		if (this.#consumed) {
			const warning = /* @__PURE__ */ new Error("Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page.");
			warning.name = "Warning";
			console.warn(warning);
		}
		let serializedValue;
		if (typeof value === "string") serializedValue = value;
		else {
			let toStringValue = value.toString();
			if (toStringValue === Object.prototype.toString.call(value)) serializedValue = JSON.stringify(value);
			else serializedValue = toStringValue;
		}
		const { encode, ...attributes } = options ?? {};
		this.#ensureOutgoingMap().set(key, [
			serializedValue,
			stringifySetCookie({
				...attributes,
				name: key,
				value: serializedValue
			}, { encode }),
			true
		]);
		if (this.#request[responseSentSymbol]) throw new AstroError({ ...ResponseSentError });
	}
	/**
	* Merges a new AstroCookies instance into the current instance. Any new cookies
	* will be added to the current instance, overwriting any existing cookies with the same name.
	*/
	merge(cookies) {
		const outgoing = cookies.#outgoing;
		if (outgoing) for (const [key, value] of outgoing) this.#ensureOutgoingMap().set(key, value);
	}
	/**
	* Astro.cookies.header() returns an iterator for the cookies that have previously
	* been set by either Astro.cookies.set() or Astro.cookies.delete().
	* This method is primarily used by adapters to set the header on outgoing responses.
	* @returns
	*/
	*headers() {
		if (this.#outgoing == null) return;
		for (const [, value] of this.#outgoing) yield value[1];
	}
	/**
	* Marks the cookies as consumed and returns the header values.
	* After consumption, any subsequent `set()` calls will warn.
	*/
	consume() {
		this.#consumed = true;
		return this.headers();
	}
	/**
	* @deprecated Use the instance method `cookies.consume()` instead.
	* Kept for backward compatibility with adapters.
	*/
	static consume(cookies) {
		return cookies.consume();
	}
	#ensureParsed() {
		if (!this.#requestValues) this.#parse();
		if (!this.#requestValues) this.#requestValues = /* @__PURE__ */ Object.create(null);
		return this.#requestValues;
	}
	#ensureOutgoingMap() {
		if (!this.#outgoing) this.#outgoing = /* @__PURE__ */ new Map();
		return this.#outgoing;
	}
	#parse() {
		const raw = this.#request.headers.get("cookie");
		if (!raw) return;
		this.#requestValues = parseCookie(raw, { decode: identity });
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/cookies/response.js
var astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
	Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
	let cookies = Reflect.get(response, astroCookiesSymbol);
	if (cookies != null) return cookies;
	else return;
}
function* getSetCookiesFromResponse(response) {
	const cookies = getCookiesFromResponse(response);
	if (!cookies) return [];
	for (const headerValue of cookies.consume()) yield headerValue;
	return [];
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/actions/noop-actions.js
var NOOP_ACTIONS_MOD = { server: {} };
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/middleware/defineMiddleware.js
function defineMiddleware(fn) {
	return fn;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/app/origin-check.js
var FORM_CONTENT_TYPES = [
	"application/x-www-form-urlencoded",
	"multipart/form-data",
	"text/plain"
];
var SAFE_METHODS = [
	"GET",
	"HEAD",
	"OPTIONS"
];
function isForbiddenCrossOriginRequest(request, url, isPrerendered) {
	if (isPrerendered) return false;
	if (SAFE_METHODS.includes(request.method)) return false;
	const isSameOrigin = request.headers.get("origin") === url.origin;
	if (request.headers.has("content-type")) return hasFormLikeHeader(request.headers.get("content-type")) && !isSameOrigin;
	return !isSameOrigin;
}
function createCrossOriginForbiddenResponse(request) {
	return new Response(`Cross-site ${request.method} form submissions are forbidden`, { status: 403 });
}
function createOriginCheckMiddleware() {
	return defineMiddleware((context, next) => {
		const { request, url, isPrerendered } = context;
		if (isForbiddenCrossOriginRequest(request, url, isPrerendered)) return createCrossOriginForbiddenResponse(request);
		return next();
	});
}
function hasFormLikeHeader(contentType) {
	if (contentType) {
		for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) return true;
	}
	return false;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/logger/core.js
var dateTimeFormat = new Intl.DateTimeFormat([], {
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: false
});
var levels = {
	debug: 20,
	info: 30,
	warn: 40,
	error: 50,
	silent: 90
};
function log(opts, level, label, message, newLine = true) {
	const logLevel = opts.level;
	const dest = opts.destination;
	const event = {
		label,
		level,
		message,
		newLine
	};
	if (!isLogLevelEnabled(logLevel, level)) return;
	dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
	return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
	return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
	return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
	return log(opts, "error", label, message, newLine);
}
function debug(...args) {
	if ("_astroGlobalDebug" in globalThis) globalThis._astroGlobalDebug(...args);
}
function getEventPrefix({ level, label }) {
	const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
	const prefix = [];
	if (level === "error" || level === "warn") {
		prefix.push(s.bold(timestamp));
		prefix.push(`[${level.toUpperCase()}]`);
	} else prefix.push(timestamp);
	if (label) prefix.push(`[${label}]`);
	if (level === "error") return s.red(prefix.join(" "));
	if (level === "warn") return s.yellow(prefix.join(" "));
	if (prefix.length === 1) return s.dim(prefix[0]);
	return s.dim(prefix[0]) + " " + s.blue(prefix.splice(1).join(" "));
}
var AstroLogger = class {
	options;
	constructor(options) {
		this.options = options;
	}
	info(label, message, newLine = true) {
		info(this.options, label, message, newLine);
	}
	warn(label, message, newLine = true) {
		warn(this.options, label, message, newLine);
	}
	error(label, message, newLine = true) {
		error(this.options, label, message, newLine);
	}
	debug(label, ...messages) {
		debug(label, ...messages);
	}
	level() {
		return this.options.level;
	}
	forkIntegrationLogger(label) {
		return new AstroIntegrationLogger(this.options, label);
	}
	setDestination(destination) {
		this.options.destination = destination;
	}
	/**
	* It calls the `close` function of the provided destination, if it exists.
	*/
	close() {
		if (this.options.destination.close) this.options.destination.close();
	}
	/**
	* It calls the `flush` function of the provided destination, if it exists.
	*/
	flush() {
		if (this.options.destination.flush) this.options.destination.flush();
	}
};
var AstroIntegrationLogger = class AstroIntegrationLogger {
	options;
	label;
	constructor(logging, label) {
		this.options = logging;
		this.label = label;
	}
	/**
	* Creates a new logger instance with a new label, but the same log options.
	*/
	fork(label) {
		return new AstroIntegrationLogger(this.options, label);
	}
	info(message) {
		info(this.options, this.label, message);
	}
	warn(message) {
		warn(this.options, this.label, message);
	}
	error(message) {
		error(this.options, this.label, message);
	}
	debug(message) {
		debug(this.label, message);
	}
	/**
	* It calls the `flush` function of the provided destination, if it exists.
	*/
	flush() {
		if (this.options.destination.flush) this.options.destination.flush();
	}
	/**
	* It calls the `close` function of the provided destination, if it exists.
	*/
	close() {
		if (this.options.destination.close) this.options.destination.close();
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/middleware/noop-middleware.js
var NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
	return await next();
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/request.js
function createRequest({ url, headers, method = "GET", body = void 0, logger, isPrerendered = false, routePattern, init }) {
	const headersObj = isPrerendered ? void 0 : headers instanceof Headers ? headers : new Headers(Object.entries(headers).filter(([name]) => !name.startsWith(":")));
	if (typeof url === "string") url = new URL(url);
	if (isPrerendered) url.search = "";
	const request = new Request(url, {
		method,
		headers: headersObj,
		body: isPrerendered ? null : body,
		...init
	});
	if (isPrerendered) {
		let _headers = request.headers;
		const { value, writable, ...headersDesc } = Object.getOwnPropertyDescriptor(request, "headers") || {};
		Object.defineProperty(request, "headers", {
			...headersDesc,
			get() {
				logger.warn(null, `\`Astro.request.headers\` was used when rendering the route \`${routePattern}'\`. \`Astro.request.headers\` is not available on prerendered pages. If you need access to request headers, make sure that the page is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your pages server-rendered by default.`);
				return _headers;
			},
			set(newHeaders) {
				_headers = newHeaders;
			}
		});
	}
	return request;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/util/pathname.js
var MultiLevelEncodingError = class extends Error {
	constructor() {
		super("URL encoding depth exceeded the maximum number of decode iterations");
		this.name = "MultiLevelEncodingError";
	}
};
var MAX_DECODE_ITERATIONS = 10;
function validateAndDecodePathname(pathname) {
	let decoded;
	try {
		decoded = decodeURI(pathname);
	} catch (_e) {
		throw new Error("Invalid URL encoding");
	}
	let iterations = 0;
	while (decoded !== pathname) {
		if (iterations >= MAX_DECODE_ITERATIONS) throw new MultiLevelEncodingError();
		pathname = decoded;
		try {
			decoded = decodeURI(pathname);
		} catch {
			break;
		}
		iterations++;
	}
	return decoded;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/template/4xx.js
function template({ title, pathname, statusCode = 404, tabTitle, body }) {
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>${tabTitle}</title>
		<style>
			:root {
				--gray-10: hsl(258, 7%, 10%);
				--gray-20: hsl(258, 7%, 20%);
				--gray-30: hsl(258, 7%, 30%);
				--gray-40: hsl(258, 7%, 40%);
				--gray-50: hsl(258, 7%, 50%);
				--gray-60: hsl(258, 7%, 60%);
				--gray-70: hsl(258, 7%, 70%);
				--gray-80: hsl(258, 7%, 80%);
				--gray-90: hsl(258, 7%, 90%);
				--black: #13151A;
				--accent-light: #E0CCFA;
			}

			* {
				box-sizing: border-box;
			}

			html {
				background: var(--black);
				color-scheme: dark;
				accent-color: var(--accent-light);
			}

			body {
				background-color: var(--gray-10);
				color: var(--gray-80);
				font-family: ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace;
				line-height: 1.5;
				margin: 0;
			}

			a {
				color: var(--accent-light);
			}

			.center {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 100vh;
				width: 100vw;
			}

			h1 {
				margin-bottom: 8px;
				color: white;
				font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
				font-weight: 700;
				margin-top: 1rem;
				margin-bottom: 0;
			}

			.statusCode {
				color: var(--accent-light);
			}

			.astro-icon {
				height: 124px;
				width: 124px;
			}

			pre, code {
				padding: 2px 8px;
				background: rgba(0,0,0, 0.25);
				border: 1px solid rgba(255,255,255, 0.25);
				border-radius: 4px;
				font-size: 1.2em;
				margin-top: 0;
				max-width: 60em;
			}
		</style>
	</head>
	<body>
		<main class="center">
			<svg class="astro-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="80" viewBox="0 0 64 80" fill="none"> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="white"/> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="url(#paint0_linear_738_686)"/> <path d="M0 51.6401C0 51.6401 10.6488 46.4654 21.3274 46.4654L29.3786 21.6102C29.6801 20.4082 30.5602 19.5913 31.5538 19.5913C32.5474 19.5913 33.4275 20.4082 33.7289 21.6102L41.7802 46.4654C54.4274 46.4654 63.1076 51.6401 63.1076 51.6401C63.1076 51.6401 45.0197 2.48776 44.9843 2.38914C44.4652 0.935933 43.5888 0 42.4073 0H20.7022C19.5206 0 18.6796 0.935933 18.1251 2.38914C18.086 2.4859 0 51.6401 0 51.6401Z" fill="white"/> <defs> <linearGradient id="paint0_linear_738_686" x1="31.554" y1="75.4423" x2="39.7462" y2="48.376" gradientUnits="userSpaceOnUse"> <stop stop-color="#D83333"/> <stop offset="1" stop-color="#F041FF"/> </linearGradient> </defs> </svg>
			<h1>${statusCode ? `<span class="statusCode">${statusCode}: </span> ` : ""}<span class="statusMessage">${title}</span></h1>
			${body || `
				<pre>Path: ${escape(pathname)}</pre>
			`}
			</main>
	</body>
</html>`;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/internal/astro-designed-error-pages.js
var DEFAULT_404_ROUTE = {
	component: DEFAULT_404_COMPONENT,
	params: [],
	pattern: /^\/404\/?$/,
	prerender: false,
	pathname: "/404",
	segments: [[{
		content: "404",
		dynamic: false,
		spread: false
	}]],
	type: "page",
	route: "/404",
	fallbackRoutes: [],
	isIndex: false,
	origin: "internal",
	distURL: []
};
async function default404Page({ pathname }) {
	return new Response(template({
		statusCode: 404,
		title: "Not found",
		tabTitle: "404: Not Found",
		pathname
	}), {
		status: 404,
		headers: { "Content-Type": "text/html" }
	});
}
default404Page.isAstroComponentFactory = true;
var default404Instance = { default: default404Page };
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/rewrite.js
function findRouteToRewrite({ payload, routes, request, trailingSlash, buildFormat, base, outDir }) {
	let newUrl = void 0;
	if (payload instanceof URL) newUrl = payload;
	else if (payload instanceof Request) newUrl = new URL(payload.url);
	else newUrl = new URL(collapseDuplicateSlashes(payload), new URL(request.url).origin);
	const { pathname, resolvedUrlPathname } = normalizeRewritePathname(newUrl.pathname, base, trailingSlash, buildFormat);
	newUrl.pathname = resolvedUrlPathname;
	const decodedPathname = validateAndDecodePathname(pathname);
	if (isRoute404(decodedPathname)) {
		const errorRoute = routes.find((route) => route.route === "/404");
		if (errorRoute) return {
			routeData: errorRoute,
			newUrl,
			pathname: decodedPathname
		};
	}
	if (isRoute500(decodedPathname)) {
		const errorRoute = routes.find((route) => route.route === "/500");
		if (errorRoute) return {
			routeData: errorRoute,
			newUrl,
			pathname: decodedPathname
		};
	}
	let foundRoute;
	for (const route of routes) if (route.pattern.test(decodedPathname)) {
		if (route.params && route.params.length !== 0 && route.distURL && route.distURL.length !== 0) {
			if (!route.distURL.find((url) => url.href.replace(outDir.toString(), "").replace(/(?:\/index\.html|\.html)$/, "") === trimSlashes(pathname))) continue;
		}
		foundRoute = route;
		break;
	}
	if (foundRoute) return {
		routeData: foundRoute,
		newUrl,
		pathname: decodedPathname
	};
	else {
		const custom404 = routes.find((route) => route.route === "/404");
		if (custom404) return {
			routeData: custom404,
			newUrl,
			pathname
		};
		else return {
			routeData: DEFAULT_404_ROUTE,
			newUrl,
			pathname
		};
	}
}
function copyRequest(newUrl, oldRequest, isPrerendered, logger, routePattern) {
	if (oldRequest.bodyUsed) throw new AstroError(RewriteWithBodyUsed);
	return createRequest({
		url: newUrl,
		method: oldRequest.method,
		body: oldRequest.body,
		isPrerendered,
		logger,
		headers: isPrerendered ? {} : oldRequest.headers,
		routePattern,
		init: {
			referrer: oldRequest.referrer,
			referrerPolicy: oldRequest.referrerPolicy,
			mode: oldRequest.mode,
			credentials: oldRequest.credentials,
			cache: oldRequest.cache,
			redirect: oldRequest.redirect,
			integrity: oldRequest.integrity,
			signal: oldRequest.signal,
			keepalive: oldRequest.keepalive,
			duplex: "half"
		}
	});
}
function setOriginPathname(request, pathname, trailingSlash, buildFormat) {
	if (!pathname) pathname = "/";
	const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
	let finalPathname;
	if (pathname === "/") finalPathname = "/";
	else if (shouldAppendSlash) finalPathname = appendForwardSlash(pathname);
	else finalPathname = removeTrailingForwardSlash(pathname);
	Reflect.set(request, originPathnameSymbol, encodeURIComponent(finalPathname));
}
function getOriginPathname(request) {
	const origin = Reflect.get(request, originPathnameSymbol);
	if (origin) return decodeURIComponent(origin);
	return new URL(request.url).pathname;
}
function normalizeRewritePathname(urlPathname, base, trailingSlash, buildFormat) {
	let pathname = collapseDuplicateSlashes(urlPathname);
	const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
	if (base !== "/") {
		if (urlPathname === base || urlPathname === removeTrailingForwardSlash(base)) pathname = "/";
		else if (urlPathname.startsWith(base)) {
			pathname = shouldAppendSlash ? appendForwardSlash(urlPathname) : removeTrailingForwardSlash(urlPathname);
			pathname = pathname.slice(base.length);
		}
	}
	if (!pathname.startsWith("/") && shouldAppendSlash && urlPathname.endsWith("/")) pathname = prependForwardSlash(pathname);
	if (buildFormat === "file") pathname = pathname.replace(/\.html$/, "");
	let resolvedUrlPathname;
	if (base !== "/" && (pathname === "" || pathname === "/") && !shouldAppendSlash) resolvedUrlPathname = removeTrailingForwardSlash(base);
	else resolvedUrlPathname = joinPaths(...[base, pathname].filter(Boolean));
	return {
		pathname,
		resolvedUrlPathname
	};
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/middleware/sequence.js
function sequence(...handlers) {
	const filtered = handlers.filter((h) => !!h);
	const length = filtered.length;
	if (!length) return defineMiddleware((_context, next) => {
		return next();
	});
	return defineMiddleware((context, next) => {
		let carriedPayload = void 0;
		return applyHandle(0, context);
		function applyHandle(i, handleContext) {
			const handle = filtered[i];
			return handle(handleContext, async (payload) => {
				if (i < length - 1) {
					if (payload) {
						let newRequest;
						if (payload instanceof Request) newRequest = payload;
						else if (payload instanceof URL) newRequest = new Request(payload, handleContext.request.clone());
						else newRequest = new Request(new URL(payload, handleContext.url.origin), handleContext.request.clone());
						const oldPathname = handleContext.url.pathname;
						const pipeline = Reflect.get(handleContext, pipelineSymbol);
						const { routeData, pathname } = await pipeline.tryRewrite(payload, handleContext.request);
						if (pipeline.manifest.serverLike === true && handleContext.isPrerendered === false && routeData.prerender === true) throw new AstroError({
							...ForbiddenRewrite,
							message: ForbiddenRewrite.message(handleContext.url.pathname, pathname, routeData.component),
							hint: ForbiddenRewrite.hint(routeData.component)
						});
						carriedPayload = payload;
						handleContext.request = newRequest;
						handleContext.url = new URL(newRequest.url);
						handleContext.params = getParams(routeData, pathname);
						handleContext.routePattern = routeData.route;
						setOriginPathname(handleContext.request, oldPathname, pipeline.manifest.trailingSlash, pipeline.manifest.buildFormat);
					}
					return applyHandle(i + 1, handleContext);
				} else return next(payload ?? carriedPayload);
			});
		}
	});
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/redirects/component.js
var RedirectComponentInstance = { default() {
	return new Response(null, { status: 301 });
} };
var RedirectSinglePageBuiltModule = {
	page: () => Promise.resolve(RedirectComponentInstance),
	onRequest: (_, next) => next()
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/generator.js
function sanitizeParams(params) {
	return Object.fromEntries(Object.entries(params).map(([key, value]) => {
		if (typeof value === "string") return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
		return [key, value];
	}));
}
function getParameter(part, params) {
	if (part.spread) return params[part.content.slice(3)] ?? "";
	if (part.dynamic) {
		if (params[part.content] === void 0) throw new TypeError(`Missing parameter: ${part.content}`);
		return params[part.content];
	}
	return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
	const segmentPath = segment.map((part) => getParameter(part, params)).join("");
	return segmentPath ? collapseDuplicateLeadingSlashes("/" + segmentPath) : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
	return (params) => {
		const sanitizedParams = sanitizeParams(params);
		let trailing = "";
		if (addTrailingSlash === "always" && segments.length) trailing = "/";
		return segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing || "/";
	};
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/internal/validation.js
var VALID_PARAM_TYPES = ["string", "undefined"];
function validateGetStaticPathsParameter([key, value], route) {
	if (!VALID_PARAM_TYPES.includes(typeof value)) throw new AstroError({
		...GetStaticPathsInvalidRouteParam,
		message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
		location: { file: route }
	});
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/params.js
function stringifyParams(params, route, trailingSlash) {
	if (route.type === "endpoint" && hasFileExtension(route.route)) trailingSlash = "never";
	const validatedParams = {};
	for (const [key, value] of Object.entries(params)) {
		validateGetStaticPathsParameter([key, value], route.component);
		if (value !== void 0) validatedParams[key] = trimSlashes(value);
	}
	return getRouteGenerator(route.segments, trailingSlash)(validatedParams);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/validation.js
function validateDynamicRouteModule(mod, { ssr, route }) {
	if ((!ssr || route.prerender) && route.origin !== "internal" && !mod.getStaticPaths) throw new AstroError({
		...GetStaticPathsRequired,
		location: { file: route.component }
	});
}
function validateGetStaticPathsResult(result, route) {
	if (!Array.isArray(result)) throw new AstroError({
		...InvalidGetStaticPathsReturn,
		message: InvalidGetStaticPathsReturn.message(typeof result),
		location: { file: route.component }
	});
	result.forEach((pathObject) => {
		if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) throw new AstroError({
			...InvalidGetStaticPathsEntry,
			message: InvalidGetStaticPathsEntry.message(Array.isArray(pathObject) ? "array" : typeof pathObject)
		});
		if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) throw new AstroError({
			...GetStaticPathsExpectedParams,
			location: { file: route.component }
		});
	});
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/render/paginate.js
function generatePaginateFunction(routeMatch, base, trailingSlash) {
	return function paginateUtility(data, args = {}) {
		const generate = getRouteGenerator(routeMatch.segments, trailingSlash);
		let { pageSize: _pageSize, params: _params, props: _props, format: _format } = args;
		const pageSize = _pageSize || 10;
		const paramName = "page";
		const additionalParams = _params || {};
		const additionalProps = _props || {};
		const formatUrl = _format || ((url) => url);
		let includesFirstPageNumber;
		if (routeMatch.params.includes(`...${paramName}`)) includesFirstPageNumber = false;
		else if (routeMatch.params.includes(`${paramName}`)) includesFirstPageNumber = true;
		else throw new AstroError({
			...PageNumberParamNotFound,
			message: PageNumberParamNotFound.message(paramName)
		});
		const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
		return [...Array(lastPage).keys()].map((num) => {
			const pageNum = num + 1;
			const start = pageSize === Number.POSITIVE_INFINITY ? 0 : (pageNum - 1) * pageSize;
			const end = Math.min(start + pageSize, data.length);
			const params = {
				...additionalParams,
				[paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
			};
			const current = formatUrl(addRouteBase(generate({ ...params }), base));
			const next = pageNum === lastPage ? void 0 : formatUrl(addRouteBase(generate({
				...params,
				page: String(pageNum + 1)
			}), base));
			const prev = pageNum === 1 ? void 0 : formatUrl(addRouteBase(generate({
				...params,
				page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
			}), base));
			const first = pageNum === 1 ? void 0 : formatUrl(addRouteBase(generate({
				...params,
				page: includesFirstPageNumber ? "1" : void 0
			}), base));
			const last = pageNum === lastPage ? void 0 : formatUrl(addRouteBase(generate({
				...params,
				page: String(lastPage)
			}), base));
			return {
				params,
				props: {
					...additionalProps,
					page: {
						data: data.slice(start, end),
						start,
						end: end - 1,
						size: pageSize,
						total: data.length,
						currentPage: pageNum,
						lastPage,
						url: {
							current,
							next,
							prev,
							first,
							last
						}
					}
				}
			};
		});
	};
}
function addRouteBase(route, base) {
	let routeWithBase = joinPaths(base, route);
	if (routeWithBase === "") routeWithBase = "/";
	return routeWithBase;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/render/route-cache.js
async function callGetStaticPaths({ mod, route, routeCache, ssr, base, trailingSlash }) {
	const cached = routeCache.get(route);
	if (!mod) throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
	if (cached?.staticPaths && cached.mod === mod) return cached.staticPaths;
	validateDynamicRouteModule(mod, {
		ssr,
		route
	});
	if (ssr && !route.prerender || route.origin === "internal") {
		const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
		routeCache.set(route, {
			...cached,
			mod,
			staticPaths: entry
		});
		return entry;
	}
	let staticPaths = [];
	if (!mod.getStaticPaths) throw new Error("Unexpected Error.");
	staticPaths = await mod.getStaticPaths({
		paginate: generatePaginateFunction(route, base, trailingSlash),
		routePattern: route.route
	});
	validateGetStaticPathsResult(staticPaths, route);
	const keyedStaticPaths = staticPaths;
	keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
	for (const sp of keyedStaticPaths) {
		const paramsKey = stringifyParams(sp.params, route, trailingSlash);
		keyedStaticPaths.keyed.set(paramsKey, sp);
	}
	routeCache.set(route, {
		...cached,
		mod,
		staticPaths: keyedStaticPaths
	});
	return keyedStaticPaths;
}
var RouteCache = class {
	logger;
	cache = {};
	runtimeMode;
	constructor(logger, runtimeMode = "production") {
		this.logger = logger;
		this.runtimeMode = runtimeMode;
	}
	/** Clear the cache. */
	clearAll() {
		this.cache = {};
	}
	set(route, entry) {
		const key = this.key(route);
		if (this.runtimeMode === "production" && this.cache[key]?.staticPaths) this.logger.warn(null, `Internal Warning: route cache overwritten. (${key})`);
		this.cache[key] = entry;
	}
	get(route) {
		return this.cache[this.key(route)];
	}
	key(route) {
		return `${route.route}_${route.component}`;
	}
};
function findPathItemByKey(staticPaths, params, route, logger, trailingSlash) {
	const paramsKey = stringifyParams(params, route, trailingSlash);
	const matchedStaticPath = staticPaths.keyed.get(paramsKey);
	if (matchedStaticPath) return matchedStaticPath;
	logger.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${paramsKey}`);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/pattern.js
function getPattern(segments, base, addTrailingSlash) {
	const pathname = segments.map((segment) => {
		if (segment.length === 1 && segment[0].spread) return "(?:\\/(.*?))?";
		else return "\\/" + segment.map((part) => {
			if (part.spread) return "(.*?)";
			else if (part.dynamic) return "([^/]+?)";
			else return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}).join("");
	}).join("");
	const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
	let initial = "\\/";
	if (addTrailingSlash === "never" && base !== "/" && pathname !== "") initial = "";
	return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
	if (addTrailingSlash === "always") return "\\/$";
	if (addTrailingSlash === "never") return "$";
	return "\\/?$";
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/server-islands/endpoint.js
var SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
var SERVER_ISLAND_COMPONENT = "_server-islands.astro";
function badRequest(reason) {
	return new Response(null, {
		status: 400,
		statusText: "Bad request: " + reason
	});
}
var DEFAULT_BODY_SIZE_LIMIT = 1048576;
async function getRequestData(request, bodySizeLimit = DEFAULT_BODY_SIZE_LIMIT) {
	switch (request.method) {
		case "GET": {
			const params = new URL(request.url).searchParams;
			if (!params.has("s") || !params.has("e") || !params.has("p")) return badRequest("Missing required query parameters.");
			const encryptedSlots = params.get("s");
			return {
				encryptedComponentExport: params.get("e"),
				encryptedProps: params.get("p"),
				encryptedSlots
			};
		}
		case "POST": try {
			const body = await readBodyWithLimit(request, bodySizeLimit);
			const raw = new TextDecoder().decode(body);
			const data = JSON.parse(raw);
			if (Object.hasOwn(data, "slots") && typeof data.slots === "object") return badRequest("Plaintext slots are not allowed. Slots must be encrypted.");
			if (Object.hasOwn(data, "componentExport") && typeof data.componentExport === "string") return badRequest("Plaintext componentExport is not allowed. componentExport must be encrypted.");
			return data;
		} catch (e) {
			if (e instanceof BodySizeLimitError) return new Response(null, {
				status: 413,
				statusText: e.message
			});
			if (e instanceof SyntaxError) return badRequest("Request format is invalid.");
			throw e;
		}
		default: return new Response(null, { status: 405 });
	}
}
function createEndpoint(manifest) {
	const page = async (result) => {
		const params = result.params;
		if (!params.name) return new Response(null, {
			status: 400,
			statusText: "Bad request"
		});
		const componentId = params.name;
		const data = await getRequestData(result.request, manifest.serverIslandBodySizeLimit);
		if (data instanceof Response) return data;
		let imp = (await (await manifest.serverIslandMappings?.())?.serverIslandMap)?.get(componentId);
		if (!imp) return new Response(null, {
			status: 404,
			statusText: "Not found"
		});
		const key = await manifest.key;
		let componentExport;
		try {
			componentExport = await decryptString(key, data.encryptedComponentExport, `export:${componentId}`);
		} catch (_e) {
			return badRequest("Encrypted componentExport value is invalid.");
		}
		const encryptedProps = data.encryptedProps;
		let props = {};
		if (encryptedProps !== "") try {
			const propString = await decryptString(key, encryptedProps, `props:${componentId}`);
			props = JSON.parse(propString);
		} catch (_e) {
			return badRequest("Encrypted props value is invalid.");
		}
		let decryptedSlots = {};
		const encryptedSlots = data.encryptedSlots;
		if (encryptedSlots !== "") try {
			const slotsString = await decryptString(key, encryptedSlots, `slots:${componentId}`);
			decryptedSlots = JSON.parse(slotsString);
		} catch (_e) {
			return badRequest("Encrypted slots value is invalid.");
		}
		let Component = (await imp())[componentExport];
		const slots = {};
		for (const prop in decryptedSlots) slots[prop] = createSlotValueFromString(decryptedSlots[prop]);
		result.response.headers.set("X-Robots-Tag", "noindex");
		if (isAstroComponentFactory(Component)) {
			const ServerIsland = Component;
			Component = function(...args) {
				return ServerIsland.apply(this, args);
			};
			Object.assign(Component, ServerIsland);
			Component.propagation = "self";
		}
		return renderTemplate`${renderComponent(result, "Component", Component, props, slots)}`;
	};
	page.isAstroComponentFactory = true;
	return {
		default: page,
		partial: true
	};
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/default.js
function createDefaultRoutes(manifest) {
	const root = new URL(manifest.rootDir);
	return [{
		instance: default404Instance,
		matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
		route: DEFAULT_404_ROUTE.route,
		component: DEFAULT_404_COMPONENT
	}, {
		instance: createEndpoint(manifest),
		matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
		route: SERVER_ISLAND_ROUTE,
		component: SERVER_ISLAND_COMPONENT
	}];
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/astro-designed-error-pages.js
function ensure404Route(manifest) {
	if (!manifest.routes.some((route) => route.route === "/404")) manifest.routes.push(DEFAULT_404_ROUTE);
	return manifest;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/helpers.js
function routeIsRedirect(route) {
	return route?.type === "redirect";
}
function routeIsFallback(route) {
	return route?.type === "fallback";
}
function getFallbackRoute(route, routeList) {
	const fallbackRoute = routeList.find((r) => {
		if (route.route === "/" && r.routeData.route === "/") return true;
		return r.routeData.fallbackRoutes.find((f) => {
			return f.route === route.route;
		});
	});
	if (!fallbackRoute) throw new Error(`No fallback route found for route ${route.route}`);
	return fallbackRoute.routeData;
}
function getCustom404Route(manifestData) {
	return manifestData.routes.find((r) => isRoute404(r.route));
}
function routeHasHtmlExtension(route) {
	return route.segments.some((segment) => segment.some((part) => !part.dynamic && part.content.includes(".html")));
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/render/params-and-props.js
async function getProps(opts) {
	const { logger, mod, routeData: route, routeCache, pathname, serverLike, base, trailingSlash } = opts;
	if (!route || route.pathname) return {};
	if (routeIsRedirect(route) || routeIsFallback(route) || route.component === "astro-default-404.astro") return {};
	const staticPaths = await callGetStaticPaths({
		mod,
		route,
		routeCache,
		ssr: serverLike,
		base,
		trailingSlash
	});
	const params = getParams(route, pathname);
	const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger, trailingSlash);
	if (!matchedStaticPath && route.origin !== "internal" && (serverLike ? route.prerender : true)) throw new AstroError({
		...NoMatchingStaticPathFound,
		message: NoMatchingStaticPathFound.message(pathname),
		hint: NoMatchingStaticPathFound.hint([route.component])
	});
	if (mod) validatePrerenderEndpointCollision(route, mod, params);
	return matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
}
function getParams(route, pathname) {
	if (!route.params.length) return {};
	const hasHtmlSuffix = pathname.endsWith(".html") && !routeHasHtmlExtension(route);
	const path = hasHtmlSuffix && route.type === "page" ? pathname.slice(0, -5) : pathname;
	const allPatterns = [route, ...route.fallbackRoutes].map((r) => r.pattern);
	let paramsMatch = allPatterns.map((pattern) => pattern.exec(path)).find((x) => x);
	if (!paramsMatch && hasHtmlSuffix && route.type !== "page") {
		const strippedPath = pathname.endsWith("/index.html") ? pathname.slice(0, -11) || "/" : pathname.slice(0, -5);
		paramsMatch = allPatterns.map((pattern) => pattern.exec(strippedPath)).find((x) => x);
	}
	if (!paramsMatch) return {};
	const params = {};
	route.params.forEach((key, i) => {
		if (key.startsWith("...")) params[key.slice(3)] = paramsMatch[i + 1] ? paramsMatch[i + 1] : void 0;
		else params[key] = paramsMatch[i + 1];
	});
	return params;
}
function validatePrerenderEndpointCollision(route, mod, params) {
	if (route.type === "endpoint" && mod.getStaticPaths) {
		const lastSegment = route.segments[route.segments.length - 1];
		const paramValues = Object.values(params);
		const lastParam = paramValues[paramValues.length - 1];
		if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) throw new AstroError({
			...PrerenderDynamicEndpointPathCollide,
			message: PrerenderDynamicEndpointPathCollide.message(route.route),
			hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
			location: { file: route.component }
		});
	}
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/priority.js
function routeComparator(a, b) {
	const commonLength = Math.min(a.segments.length, b.segments.length);
	for (let index = 0; index < commonLength; index++) {
		const aSegment = a.segments[index];
		const bSegment = b.segments[index];
		const aIsStatic = aSegment.every((part) => !part.dynamic && !part.spread);
		const bIsStatic = bSegment.every((part) => !part.dynamic && !part.spread);
		if (aIsStatic && bIsStatic) {
			const aContent = aSegment.map((part) => part.content).join("");
			const bContent = bSegment.map((part) => part.content).join("");
			if (aContent !== bContent) return aContent.localeCompare(bContent);
		}
		if (aIsStatic !== bIsStatic) return aIsStatic ? -1 : 1;
		const aAllDynamic = aSegment.every((part) => part.dynamic);
		if (aAllDynamic !== bSegment.every((part) => part.dynamic)) return aAllDynamic ? 1 : -1;
		const aHasSpread = aSegment.some((part) => part.spread);
		if (aHasSpread !== bSegment.some((part) => part.spread)) return aHasSpread ? 1 : -1;
	}
	const aLength = a.segments.length;
	const bLength = b.segments.length;
	if (aLength !== bLength) {
		const aEndsInRest = a.segments.at(-1)?.some((part) => part.spread);
		const bEndsInRest = b.segments.at(-1)?.some((part) => part.spread);
		if (aEndsInRest !== bEndsInRest && Math.abs(aLength - bLength) === 1) {
			if (aLength > bLength && aEndsInRest) return 1;
			if (bLength > aLength && bEndsInRest) return -1;
		}
		return aLength > bLength ? -1 : 1;
	}
	if (a.type === "endpoint" !== (b.type === "endpoint")) return a.type === "endpoint" ? -1 : 1;
	return a.route.localeCompare(b.route);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/router.js
var Router = class {
	#routes;
	#base;
	#baseWithoutTrailingSlash;
	#buildFormat;
	#trailingSlash;
	constructor(routes, options) {
		this.#routes = [...routes].sort(routeComparator);
		this.#base = normalizeBase(options.base);
		this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#base);
		this.#buildFormat = options.buildFormat;
		this.#trailingSlash = options.trailingSlash;
	}
	/**
	* Match an input pathname against the route list.
	* If allowWithoutBase is true, a non-base-prefixed path is still considered.
	*/
	match(inputPathname, { allowWithoutBase = false } = {}) {
		const normalized = getRedirectForPathname(inputPathname);
		if (normalized.redirect) return {
			type: "redirect",
			location: normalized.redirect,
			status: 301
		};
		if (this.#base !== "/") {
			const baseWithSlash = `${this.#baseWithoutTrailingSlash}/`;
			if (this.#trailingSlash === "always" && (normalized.pathname === this.#baseWithoutTrailingSlash || normalized.pathname === this.#base)) return {
				type: "redirect",
				location: baseWithSlash,
				status: 301
			};
			if (this.#trailingSlash === "never" && normalized.pathname === baseWithSlash) return {
				type: "redirect",
				location: this.#baseWithoutTrailingSlash,
				status: 301
			};
		}
		const baseResult = stripBase(normalized.pathname, this.#base, this.#baseWithoutTrailingSlash, this.#trailingSlash);
		if (!baseResult) {
			if (!allowWithoutBase) return {
				type: "none",
				reason: "outside-base"
			};
		}
		let pathname = baseResult ?? normalized.pathname;
		if (this.#buildFormat === "file") pathname = normalizeFileFormatPathname(pathname);
		const route = this.#routes.find((candidate) => {
			if (candidate.pattern.test(pathname)) return true;
			return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
		});
		if (!route) return {
			type: "none",
			reason: "no-match"
		};
		return {
			type: "match",
			route,
			params: getParams(route, pathname),
			pathname
		};
	}
	/**
	* Returns all routes that match the given pathname, in priority order.
	* Used when the first match (e.g. a prerendered route) cannot serve
	* the request and subsequent matches need to be tried.
	*/
	matchAll(inputPathname, { allowWithoutBase = false } = {}) {
		const normalized = getRedirectForPathname(inputPathname);
		if (normalized.redirect) return [];
		const baseResult = stripBase(normalized.pathname, this.#base, this.#baseWithoutTrailingSlash, this.#trailingSlash);
		if (!baseResult && !allowWithoutBase) return [];
		let pathname = baseResult ?? normalized.pathname;
		if (this.#buildFormat === "file") pathname = normalizeFileFormatPathname(pathname);
		return this.#routes.filter((candidate) => {
			if (candidate.pattern.test(pathname)) return true;
			return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
		});
	}
};
function normalizeBase(base) {
	if (!base) return "/";
	if (base === "/") return base;
	return prependForwardSlash(base);
}
function getRedirectForPathname(pathname) {
	let value = prependForwardSlash(pathname);
	if (value.startsWith("//")) return {
		pathname: value,
		redirect: `/${value.replace(/^\/+/, "")}`
	};
	return { pathname: value };
}
function stripBase(pathname, base, baseWithoutTrailingSlash, trailingSlash) {
	if (base === "/") return pathname;
	const baseWithSlash = `${baseWithoutTrailingSlash}/`;
	if (pathname === baseWithoutTrailingSlash || pathname === base) return trailingSlash === "always" ? null : "/";
	if (pathname === baseWithSlash) return trailingSlash === "never" ? null : "/";
	if (pathname.startsWith(baseWithSlash)) return pathname.slice(baseWithoutTrailingSlash.length);
	return null;
}
function normalizeFileFormatPathname(pathname) {
	if (pathname.endsWith("/index.html")) {
		const trimmed = pathname.slice(0, -11);
		return trimmed === "" ? "/" : trimmed;
	}
	if (pathname.endsWith(".html")) {
		const trimmed = pathname.slice(0, -5);
		return trimmed === "" ? "/" : trimmed;
	}
	return pathname;
}
//#endregion
//#region node_modules/.pnpm/@astrojs+internal-helpers@0.10.2/node_modules/@astrojs/internal-helpers/dist/object.js
var FORBIDDEN_PATH_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/base-pipeline.js
var PipelineFeatures = {
	redirects: 1,
	sessions: 2,
	actions: 4,
	middleware: 8,
	i18n: 16,
	cache: 32
};
var ALL_PIPELINE_FEATURES = PipelineFeatures.redirects | PipelineFeatures.sessions | PipelineFeatures.actions | PipelineFeatures.middleware | PipelineFeatures.i18n | PipelineFeatures.cache;
var Pipeline = class {
	internalMiddleware;
	resolvedMiddleware = void 0;
	resolvedLogger = false;
	resolvedActions = void 0;
	resolvedSessionDriver = void 0;
	resolvedCacheProvider = void 0;
	compiledCacheRoutes = void 0;
	/**
	* Bit mask of pipeline features activated by handler classes.
	* Each handler sets its bit via `|=`. Only meaningful when a
	* custom `src/fetch.ts` fetch handler is in use.
	*/
	usedFeatures = 0;
	logger;
	manifest;
	/**
	* "development" or "production" only
	*/
	runtimeMode;
	renderers;
	resolve;
	streaming;
	/**
	* Used to provide better error messages for `Astro.clientAddress`
	*/
	adapterName;
	clientDirectives;
	inlinedScripts;
	compressHTML;
	i18n;
	middleware;
	routeCache;
	/**
	* Used for `Astro.site`.
	*/
	site;
	/**
	* Array of built-in, internal, routes.
	* Used to find the route module
	*/
	defaultRoutes;
	actions;
	sessionDriver;
	cacheProvider;
	cacheConfig;
	serverIslands;
	/** Route data derived from the manifest, used for route matching. */
	manifestData;
	/** Pattern-matching router built from manifestData. */
	#router;
	constructor(logger, manifest, runtimeMode, renderers, resolve, streaming, adapterName = manifest.adapterName, clientDirectives = manifest.clientDirectives, inlinedScripts = manifest.inlinedScripts, compressHTML = manifest.compressHTML, i18n = manifest.i18n, middleware = manifest.middleware, routeCache = new RouteCache(logger, runtimeMode), site = manifest.site ? new URL(manifest.site) : void 0, defaultRoutes = createDefaultRoutes(manifest), actions = manifest.actions, sessionDriver = manifest.sessionDriver, cacheProvider = manifest.cacheProvider, cacheConfig = manifest.cacheConfig, serverIslands = manifest.serverIslandMappings) {
		this.logger = logger;
		this.manifest = manifest;
		this.runtimeMode = runtimeMode;
		this.renderers = renderers;
		this.resolve = resolve;
		this.streaming = streaming;
		this.adapterName = adapterName;
		this.clientDirectives = clientDirectives;
		this.inlinedScripts = inlinedScripts;
		this.compressHTML = compressHTML;
		this.i18n = i18n;
		this.middleware = middleware;
		this.routeCache = routeCache;
		this.site = site;
		this.defaultRoutes = defaultRoutes;
		this.actions = actions;
		this.sessionDriver = sessionDriver;
		this.cacheProvider = cacheProvider;
		this.cacheConfig = cacheConfig;
		this.serverIslands = serverIslands;
		this.manifestData = { routes: (manifest.routes ?? []).map((route) => route.routeData) };
		ensure404Route(this.manifestData);
		this.#router = new Router(this.manifestData.routes, {
			base: manifest.base,
			trailingSlash: manifest.trailingSlash,
			buildFormat: manifest.buildFormat
		});
		this.internalMiddleware = [];
	}
	/**
	* Low-level route matching against the manifest routes. Returns the
	* matched `RouteData` or `undefined`. Does not filter prerendered
	* routes or check public assets — use `BaseApp.match()` for that.
	*/
	matchRoute(pathname) {
		const match = this.#router.match(pathname, { allowWithoutBase: true });
		if (match.type !== "match") return void 0;
		return match.route;
	}
	/**
	* Returns all routes matching the given pathname, in priority order.
	* Used when the first match cannot serve the request (e.g. a
	* prerendered dynamic route that doesn't cover this specific path)
	* and the caller needs to try subsequent matches.
	*/
	matchAllRoutes(pathname) {
		return this.#router.matchAll(pathname, { allowWithoutBase: true });
	}
	/**
	* Rebuilds the internal router after routes have been added or
	* removed (e.g. by the dev server on HMR).
	*/
	rebuildRouter() {
		this.#router = new Router(this.manifestData.routes, {
			base: this.manifest.base,
			trailingSlash: this.manifest.trailingSlash,
			buildFormat: this.manifest.buildFormat
		});
	}
	/**
	* Resolves the middleware from the manifest, and returns the `onRequest` function. If `onRequest` isn't there,
	* it returns a no-op function
	*/
	async getMiddleware() {
		if (this.resolvedMiddleware) return this.resolvedMiddleware;
		if (this.middleware) {
			const internalMiddlewares = [(await this.middleware()).onRequest ?? NOOP_MIDDLEWARE_FN];
			if (this.manifest.checkOrigin) internalMiddlewares.unshift(createOriginCheckMiddleware());
			this.resolvedMiddleware = sequence(...internalMiddlewares);
			return this.resolvedMiddleware;
		} else {
			this.resolvedMiddleware = NOOP_MIDDLEWARE_FN;
			return this.resolvedMiddleware;
		}
	}
	/**
	* Clears the cached middleware so it is re-resolved on the next request.
	* Called via HMR when middleware files change during development.
	*/
	clearMiddleware() {
		this.resolvedMiddleware = void 0;
	}
	/**
	* Resolves the logger destination from the manifest and updates the pipeline logger.
	* If the user configured `logger`, the bundled logger factory is loaded
	* and replaces the default console destination. This is lazy and only resolves once.
	*/
	async getLogger() {
		if (this.resolvedLogger) return this.logger;
		this.resolvedLogger = true;
		const destination = (await this.manifest.logger?.())?.default;
		if (destination) this.logger = new AstroLogger({
			destination,
			level: this.manifest.logLevel
		});
		return this.logger;
	}
	async getActions() {
		if (this.resolvedActions) return this.resolvedActions;
		else if (this.actions) {
			this.resolvedActions = await this.actions();
			return this.resolvedActions;
		}
		return NOOP_ACTIONS_MOD;
	}
	async getSessionDriver() {
		if (this.resolvedSessionDriver !== void 0) return this.resolvedSessionDriver;
		if (this.sessionDriver) {
			const driverModule = await this.sessionDriver();
			this.resolvedSessionDriver = driverModule?.default || null;
			return this.resolvedSessionDriver;
		}
		this.resolvedSessionDriver = null;
		return null;
	}
	async getCacheProvider() {
		if (this.resolvedCacheProvider !== void 0) return this.resolvedCacheProvider;
		if (this.cacheProvider) {
			const factory = (await this.cacheProvider())?.default || null;
			this.resolvedCacheProvider = factory ? factory(this.cacheConfig?.options) : null;
			return this.resolvedCacheProvider;
		}
		this.resolvedCacheProvider = null;
		return null;
	}
	async getServerIslands() {
		if (this.serverIslands) return this.serverIslands();
		return {
			serverIslandMap: /* @__PURE__ */ new Map(),
			serverIslandNameMap: /* @__PURE__ */ new Map()
		};
	}
	async getAction(path) {
		const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
		let { server } = await this.getActions();
		if (!server || !(typeof server === "object")) throw new TypeError(`Expected \`server\` export in actions file to be an object. Received ${typeof server}.`);
		for (const key of pathKeys) {
			if (typeof server === "function") throw new AstroError({
				...ActionNotFoundError,
				message: ActionNotFoundError.message(pathKeys.join("."))
			});
			if (FORBIDDEN_PATH_KEYS.has(key)) throw new AstroError({
				...ActionNotFoundError,
				message: ActionNotFoundError.message(pathKeys.join("."))
			});
			if (!Object.hasOwn(server, key)) throw new AstroError({
				...ActionNotFoundError,
				message: ActionNotFoundError.message(pathKeys.join("."))
			});
			server = server[key];
		}
		if (typeof server !== "function") throw new TypeError(`Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server}.`);
		return server;
	}
	async getModuleForRoute(route) {
		for (const defaultRoute of this.defaultRoutes) if (route.component === defaultRoute.component) return { page: () => Promise.resolve(defaultRoute.instance) };
		if (route.type === "redirect") return RedirectSinglePageBuiltModule;
		else {
			if (this.manifest.pageMap) {
				const importComponentInstance = this.manifest.pageMap.get(route.component);
				if (!importComponentInstance) throw new Error(`Unexpectedly unable to find a component instance for route ${route.route}`);
				return await importComponentInstance();
			} else if (this.manifest.pageModule) return this.manifest.pageModule;
			throw new Error("Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue.");
		}
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/render/slots.js
function getFunctionExpression(slot) {
	if (!slot) return;
	const expressions = slot?.expressions?.filter((e) => isRenderInstruction(e) === false || isRenderTemplateResult(e));
	if (expressions?.length !== 1) return;
	const expression = expressions[0];
	if (isRenderTemplateResult(expression)) return getFunctionExpression(expression);
	return expression;
}
var Slots = class {
	#result;
	#slots;
	#logger;
	constructor(result, slots, logger) {
		this.#result = result;
		this.#slots = slots;
		this.#logger = logger;
		if (slots) for (const key of Object.keys(slots)) {
			if (this[key] !== void 0) throw new AstroError({
				...ReservedSlotName,
				message: ReservedSlotName.message(key)
			});
			Object.defineProperty(this, key, {
				get() {
					return true;
				},
				enumerable: true
			});
		}
	}
	has(name) {
		if (!this.#slots) return false;
		return Boolean(this.#slots[name]);
	}
	async render(name, args = []) {
		if (!this.#slots || !this.has(name)) return;
		const result = this.#result;
		if (!Array.isArray(args)) this.#logger.warn(null, `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as an item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`);
		else if (args.length > 0) {
			const slotValue = this.#slots[name];
			const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
			const expression = getFunctionExpression(component);
			if (expression) {
				const slot = async () => typeof expression === "function" ? expression(...args) : expression;
				return await renderSlotToString(result, slot).then((res) => {
					return res;
				});
			}
			if (typeof component === "function") return await renderJSX(result, component(...args)).then((res) => res != null ? String(res) : res);
		}
		const content = await renderSlotToString(result, this.#slots[name]);
		return chunkToString(result, content);
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/i18n/fallback.js
function computeFallbackRoute(options) {
	const { pathname, responseStatus, fallback, fallbackType, locales, defaultLocale, strategy, base } = options;
	if (responseStatus !== 404) return { type: "none" };
	if (!fallback || Object.keys(fallback).length === 0) return { type: "none" };
	const urlLocale = pathname.split("/").find((segment) => {
		for (const locale of locales) if (typeof locale === "string") {
			if (locale === segment) return true;
		} else if (locale.path === segment) return true;
		return false;
	});
	if (!urlLocale) return { type: "none" };
	if (!Object.keys(fallback).includes(urlLocale)) return { type: "none" };
	const fallbackLocale = fallback[urlLocale];
	const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
	let newPathname;
	if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
		if (pathname.includes(`${base}`)) newPathname = pathname.replace(`/${urlLocale}`, ``);
		else newPathname = pathname.replace(`/${urlLocale}`, `/`);
	} else newPathname = pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
	return {
		type: fallbackType,
		pathname: newPathname
	};
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/i18n/path.js
function pathHasLocale(path, locales) {
	const segments = path.split("/").map(normalizeThePath);
	for (const segment of segments) for (const locale of locales) if (typeof locale === "string") {
		if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) return true;
	} else if (segment === locale.path) return true;
	return false;
}
function normalizeTheLocale(locale) {
	return locale.replaceAll("_", "-").toLowerCase();
}
function normalizeThePath(path) {
	return path.endsWith(".html") ? path.slice(0, -5) : path;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/i18n/router.js
var I18nRouter = class {
	#strategy;
	#defaultLocale;
	#locales;
	#base;
	#domains;
	constructor(options) {
		this.#strategy = options.strategy;
		this.#defaultLocale = options.defaultLocale;
		this.#locales = options.locales;
		this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
		this.#domains = options.domains;
	}
	/**
	* Evaluate routing strategy for a pathname.
	* Returns decision object (not HTTP Response).
	*/
	match(pathname, context) {
		if (this.shouldSkipProcessing(pathname, context)) return { type: "continue" };
		switch (this.#strategy) {
			case "manual": return { type: "continue" };
			case "pathname-prefix-always": return this.matchPrefixAlways(pathname, context);
			case "domains-prefix-always":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixAlways(pathname, context);
			case "pathname-prefix-other-locales": return this.matchPrefixOtherLocales(pathname, context);
			case "domains-prefix-other-locales":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixOtherLocales(pathname, context);
			case "pathname-prefix-always-no-redirect": return this.matchPrefixAlwaysNoRedirect(pathname, context);
			case "domains-prefix-always-no-redirect":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixAlwaysNoRedirect(pathname, context);
			default: return { type: "continue" };
		}
	}
	/**
	* Check if i18n processing should be skipped for this request
	*/
	shouldSkipProcessing(pathname, context) {
		if (pathname.includes("/404") || pathname.includes("/500")) return true;
		if (pathname.includes("/_server-islands/")) return true;
		if (context.isReroute) return true;
		if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") return true;
		return false;
	}
	/**
	* Strategy: pathname-prefix-always
	* All locales must have a prefix, including the default locale.
	*/
	matchPrefixAlways(pathname, _context) {
		if (pathname === this.#base + "/" || pathname === this.#base) return {
			type: "redirect",
			location: `${this.#base === "/" ? "" : this.#base}/${this.#defaultLocale}`
		};
		if (!pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
		return { type: "continue" };
	}
	/**
	* Strategy: pathname-prefix-other-locales
	* Default locale has no prefix, other locales must have a prefix.
	*/
	matchPrefixOtherLocales(pathname, _context) {
		let pathnameContainsDefaultLocale = false;
		for (const segment of pathname.split("/")) if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
			pathnameContainsDefaultLocale = true;
			break;
		}
		if (pathnameContainsDefaultLocale) return {
			type: "notFound",
			location: pathname.replace(`/${this.#defaultLocale}`, "")
		};
		return { type: "continue" };
	}
	/**
	* Strategy: pathname-prefix-always-no-redirect
	* Like prefix-always but allows root to serve instead of redirecting
	*/
	matchPrefixAlwaysNoRedirect(pathname, _context) {
		if (pathname === this.#base + "/" || pathname === this.#base) return { type: "continue" };
		if (!pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
		return { type: "continue" };
	}
	/**
	* Check if the current locale doesn't belong to the configured domain.
	* Used for domain-based routing strategies.
	*/
	localeHasntDomain(currentLocale, currentDomain) {
		if (!this.#domains || !currentDomain) return false;
		if (!currentLocale) return false;
		const localesForDomain = this.#domains[currentDomain];
		if (!localesForDomain) return true;
		return !localesForDomain.includes(currentLocale);
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/i18n/handler.js
var I18n = class {
	#i18n;
	#base;
	#trailingSlash;
	#format;
	#router;
	constructor(i18n, base, trailingSlash, format) {
		this.#i18n = i18n;
		this.#base = base;
		this.#trailingSlash = trailingSlash;
		this.#format = format;
		this.#router = new I18nRouter({
			strategy: i18n.strategy,
			defaultLocale: i18n.defaultLocale,
			locales: i18n.locales,
			base,
			domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce((acc, domain) => {
				const locale = i18n.domainLookupTable[domain];
				if (!acc[domain]) acc[domain] = [];
				acc[domain].push(locale);
				return acc;
			}, {}) : void 0
		});
	}
	async finalize(state, response) {
		state.pipeline.usedFeatures |= PipelineFeatures.i18n;
		const i18n = this.#i18n;
		if (state.skipErrorReroute && typeof i18n.fallback === "undefined") return response;
		if (state.responseRouteType !== "page" && state.responseRouteType !== "fallback") return response;
		const url = state.url;
		const currentLocale = state.computeCurrentLocale();
		const isPrerendered = state.routeData.prerender;
		const routerContext = {
			currentLocale,
			currentDomain: url.hostname,
			routeType: state.responseRouteType,
			isReroute: false
		};
		const routeDecision = this.#router.match(url.pathname, routerContext);
		switch (routeDecision.type) {
			case "redirect": {
				let location = routeDecision.location;
				if (shouldAppendForwardSlash(this.#trailingSlash, this.#format)) location = appendForwardSlash(location);
				return new Response(null, {
					status: routeDecision.status ?? 302,
					headers: { Location: location }
				});
			}
			case "notFound": {
				if (isPrerendered) {
					const prerenderedRes = new Response(response.body, {
						status: 404,
						headers: response.headers
					});
					state.skipErrorReroute = true;
					if (routeDecision.location) prerenderedRes.headers.set("Location", routeDecision.location);
					return prerenderedRes;
				}
				const headers = new Headers();
				if (routeDecision.location) headers.set("Location", routeDecision.location);
				return new Response(null, {
					status: 404,
					headers
				});
			}
		}
		if (i18n.fallback && i18n.fallbackType) {
			const effectiveStatus = state.responseRouteType === "fallback" ? 404 : response.status;
			const fallbackDecision = computeFallbackRoute({
				pathname: url.pathname,
				responseStatus: effectiveStatus,
				currentLocale,
				fallback: i18n.fallback,
				fallbackType: i18n.fallbackType,
				locales: i18n.locales,
				defaultLocale: i18n.defaultLocale,
				strategy: i18n.strategy,
				base: this.#base
			});
			switch (fallbackDecision.type) {
				case "redirect": return new Response(null, {
					status: 302,
					headers: { Location: fallbackDecision.pathname + url.search }
				});
				case "rewrite": return await state.rewrite(fallbackDecision.pathname + url.search);
			}
		}
		return response;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/i18n/index.js
function getPathByLocale(locale, locales) {
	for (const loopLocale of locales) if (typeof loopLocale === "string") {
		if (loopLocale === locale) return loopLocale;
	} else for (const code of loopLocale.codes) if (code === locale) return loopLocale.path;
	throw new AstroError(i18nNoLocaleFoundInPath);
}
function getAllCodes(locales) {
	const result = [];
	for (const loopLocale of locales) if (typeof loopLocale === "string") result.push(loopLocale);
	else result.push(...loopLocale.codes);
	return result;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/i18n/utils.js
function parseLocale(header) {
	if (header === "*") return [{
		locale: header,
		qualityValue: void 0
	}];
	const result = [];
	const localeValues = header.split(",").map((str) => str.trim());
	for (const localeValue of localeValues) {
		const split = localeValue.split(";").map((str) => str.trim());
		const localeName = split[0];
		const qualityValue = split[1];
		if (!split) continue;
		if (qualityValue && qualityValue.startsWith("q=")) {
			const qualityValueAsFloat = Number.parseFloat(qualityValue.slice(2));
			if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) result.push({
				locale: localeName,
				qualityValue: void 0
			});
			else result.push({
				locale: localeName,
				qualityValue: qualityValueAsFloat
			});
		} else result.push({
			locale: localeName,
			qualityValue: void 0
		});
	}
	return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
	const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
	return browserLocaleList.filter((browserLocale) => {
		if (browserLocale.locale !== "*") return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
		return true;
	}).sort((a, b) => {
		if (a.qualityValue && b.qualityValue) return Math.sign(b.qualityValue - a.qualityValue);
		return 0;
	});
}
function computePreferredLocale(request, locales) {
	const acceptHeader = request.headers.get("Accept-Language");
	let result = void 0;
	if (acceptHeader) {
		const firstResult = sortAndFilterLocales(parseLocale(acceptHeader), locales).at(0);
		if (firstResult && firstResult.locale !== "*") {
			outer: for (const currentLocale of locales) if (typeof currentLocale === "string") {
				if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
					result = currentLocale;
					break;
				}
			} else for (const currentCode of currentLocale.codes) if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
				result = currentCode;
				break outer;
			}
		}
	}
	return result;
}
function computePreferredLocaleList(request, locales) {
	const acceptHeader = request.headers.get("Accept-Language");
	let result = [];
	if (acceptHeader) {
		const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
		if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") return getAllCodes(locales);
		else if (browserLocaleList.length > 0) {
			for (const browserLocale of browserLocaleList) for (const loopLocale of locales) if (typeof loopLocale === "string") {
				if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) result.push(loopLocale);
			} else for (const code of loopLocale.codes) if (code === browserLocale.locale) result.push(code);
		}
	}
	return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
	for (const segment of pathname.split("/").map(normalizeThePath)) for (const locale of locales) if (typeof locale === "string") {
		if (!segment.includes(locale)) continue;
		if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) return locale;
	} else if (locale.path === segment) return locale.codes.at(0);
	else for (const code of locale.codes) if (normalizeTheLocale(code) === normalizeTheLocale(segment)) return code;
	for (const locale of locales) if (typeof locale === "string") {
		if (locale === defaultLocale) return locale;
	} else if (locale.path === defaultLocale) return locale.codes.at(0);
}
function computeCurrentLocaleFromParams(params, locales) {
	const byNormalizedCode = /* @__PURE__ */ new Map();
	const byPath = /* @__PURE__ */ new Map();
	for (const locale of locales) if (typeof locale === "string") byNormalizedCode.set(normalizeTheLocale(locale), locale);
	else {
		byPath.set(locale.path, locale.codes[0]);
		for (const code of locale.codes) byNormalizedCode.set(normalizeTheLocale(code), code);
	}
	for (const value of Object.values(params)) {
		if (!value) continue;
		const pathMatch = byPath.get(value);
		if (pathMatch) return pathMatch;
		const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
		if (codeMatch) return codeMatch;
	}
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/middleware/callMiddleware.js
async function callMiddleware(onRequest, apiContext, responseFunction) {
	let nextCalled = false;
	let responseFunctionPromise = void 0;
	const next = async (payload) => {
		nextCalled = true;
		responseFunctionPromise = responseFunction(apiContext, payload);
		return responseFunctionPromise;
	};
	const middlewarePromise = onRequest(apiContext, next);
	return await Promise.resolve(middlewarePromise).then(async (value) => {
		if (nextCalled) {
			if (typeof value !== "undefined") {
				if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
				return value;
			} else if (responseFunctionPromise) return responseFunctionPromise;
			else throw new AstroError(MiddlewareNotAResponse);
		} else if (typeof value === "undefined") throw new AstroError(MiddlewareNoDataOrNextCalled);
		else if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
		else return value;
	});
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/cache/runtime/noop.js
var EMPTY_OPTIONS = Object.freeze({ tags: [] });
var NoopAstroCache = class {
	enabled = false;
	set() {}
	get tags() {
		return [];
	}
	get options() {
		return EMPTY_OPTIONS;
	}
	async invalidate() {}
};
var hasWarned = false;
var DisabledAstroCache = class {
	enabled = false;
	#logger;
	constructor(logger) {
		this.#logger = logger;
	}
	#warn() {
		if (!hasWarned) {
			hasWarned = true;
			this.#logger?.warn("cache", "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `cache` to enable caching.");
		}
	}
	set() {
		this.#warn();
	}
	get tags() {
		return [];
	}
	get options() {
		return EMPTY_OPTIONS;
	}
	async invalidate() {
		throw new AstroError(CacheNotEnabled);
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/middleware/astro-middleware.js
var AstroMiddleware = class {
	#pipeline;
	constructor(pipeline) {
		this.#pipeline = pipeline;
	}
	async handle(state, renderRouteCallback) {
		state.pipeline.usedFeatures |= PipelineFeatures.middleware;
		const pipeline = this.#pipeline;
		await state.getProps();
		const apiContext = state.getAPIContext();
		state.counter++;
		if (state.counter === 4) return new Response("Loop Detected", {
			status: 508,
			statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
		});
		const next = async (ctx, payload) => {
			if (payload) {
				pipeline.logger.debug("router", "Called rewriting to:", payload);
				applyRewriteToState(state, payload, await pipeline.tryRewrite(payload, state.request));
			}
			return renderRouteCallback(state, ctx);
		};
		let response;
		if (state.skipMiddleware) response = await next(apiContext);
		else {
			const pipelineMiddleware = await pipeline.getMiddleware();
			response = await callMiddleware(sequence(...pipeline.internalMiddleware, pipelineMiddleware), apiContext, next);
		}
		response = this.#finalize(state, response);
		state.response = response;
		return response;
	}
	/**
	* Like `handle`, but mirrors the app-level error handling that
	* `AstroHandler` provides on the standard path, the same way
	* `PagesHandler.handleWithErrorFallback` does for `pages()`. When no
	* route matched it returns a 404 marked with `X-Astro-Error` for the
	* app's post-check; when Astro's own middleware chain throws it logs the
	* error and renders the custom `500.astro`.
	*
	* Errors surfaced through `renderRouteCallback` (the host framework's
	* `next`, e.g. host middleware mounted below `middleware()`) are
	* re-thrown instead, so the host's own error handling still runs rather
	* than being swallowed into Astro's 500 page. A sentinel tells the two
	* apart.
	*
	* Used by the composable `astro/fetch` `middleware()` entry point, where
	* there is no surrounding `AstroHandler` to supply this fallback.
	*/
	async handleWithErrorFallback(app, state, renderRouteCallback) {
		if (!state.routeData) return new Response(null, {
			status: 404,
			headers: { [ASTRO_ERROR_HEADER]: "true" }
		});
		let nextError;
		try {
			return await this.handle(state, async (s, ctx) => {
				try {
					return await renderRouteCallback(s, ctx);
				} catch (err) {
					nextError = err;
					throw err;
				}
			});
		} catch (err) {
			if (err === nextError) throw err;
			app.logger.error(null, err.stack || err.message || String(err));
			return app.renderError(state.request, {
				...state.renderOptions,
				status: 500,
				error: err,
				pathname: state.pathname
			});
		}
	}
	#finalize(state, response) {
		attachCookiesToResponse(response, state.cookies);
		return response;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/pages/handler.js
var EMPTY_SLOTS = Object.freeze({});
var PagesHandler = class {
	#pipeline;
	constructor(pipeline) {
		this.#pipeline = pipeline;
	}
	async handle(state, ctx) {
		const { logger, streaming } = this.#pipeline;
		state.resetResponseMetadata();
		let response;
		const componentInstance = await state.loadComponentInstance();
		switch (state.routeData.type) {
			case "endpoint":
				response = await renderEndpoint(componentInstance, ctx, state.routeData.prerender, logger, state);
				break;
			case "page": {
				const props = await state.getProps();
				const actionApiContext = state.getActionAPIContext();
				const result = await state.createResult(componentInstance, actionApiContext);
				try {
					response = await renderPage(result, componentInstance?.default, props, state.slots ?? EMPTY_SLOTS, streaming, state.routeData);
				} catch (e) {
					result.cancelled = true;
					throw e;
				}
				state.responseRouteType = "page";
				if (state.routeData.route === "/404" || state.routeData.route === "/500") state.skipErrorReroute = true;
				break;
			}
			case "redirect": return new Response(null, {
				status: 404,
				headers: { [ASTRO_ERROR_HEADER]: "true" }
			});
			case "fallback":
				state.responseRouteType = "fallback";
				return new Response(null, { status: 500 });
		}
		const responseCookies = getCookiesFromResponse(response);
		if (responseCookies) state.cookies.merge(responseCookies);
		state.response = response;
		return response;
	}
	/**
	* Like `handle`, but mirrors the app-level error handling that
	* `AstroHandler` provides on the standard path: unmatched routes
	* return a 404 marked with `X-Astro-Error` for the app's post-check
	* to render the 404 error page, and render-time errors are logged
	* and render the 500 error page instead of propagating to the host
	* framework.
	*
	* Used by the composable `astro/fetch` `pages()` entry point, where
	* there is no surrounding `AstroHandler` to supply this fallback.
	*/
	async handleWithErrorFallback(app, state) {
		if (!state.routeData) return new Response(null, {
			status: 404,
			headers: { [ASTRO_ERROR_HEADER]: "true" }
		});
		const ctx = state.getAPIContext();
		if (this.#pipeline.manifest.checkOrigin && isForbiddenCrossOriginRequest(ctx.request, ctx.url, ctx.isPrerendered)) return createCrossOriginForbiddenResponse(ctx.request);
		try {
			return await this.handle(state, ctx);
		} catch (err) {
			app.logger.error(null, err.stack || err.message || String(err));
			return app.renderError(state.request, {
				...state.renderOptions,
				status: 500,
				error: err,
				pathname: state.pathname
			});
		}
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/util/normalized-url.js
function createNormalizedUrl(requestUrl) {
	return normalizeUrl(new URL(requestUrl));
}
function normalizeUrl(url) {
	try {
		url.pathname = validateAndDecodePathname(url.pathname);
	} catch {
		try {
			url.pathname = decodeURI(url.pathname);
		} catch {}
	}
	url.pathname = collapseDuplicateSlashes(url.pathname);
	return url;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/rewrites/handler.js
function applyRewriteToState(state, payload, { routeData, componentInstance, newUrl, pathname }, { mergeCookies = false } = {}) {
	const pipeline = state.pipeline;
	const oldPathname = state.pathname;
	const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
	if (pipeline.manifest.serverLike && !state.routeData.prerender && routeData.prerender && !isI18nFallback) throw new AstroError({
		...ForbiddenRewrite,
		message: ForbiddenRewrite.message(state.pathname, pathname, routeData.component),
		hint: ForbiddenRewrite.hint(routeData.component)
	});
	state.routeData = routeData;
	state.componentInstance = componentInstance;
	if (payload instanceof Request) state.request = payload;
	else state.request = copyRequest(newUrl, state.request, routeData.prerender, pipeline.logger, state.routeData.route);
	state.url = createNormalizedUrl(state.request.url);
	if (mergeCookies) {
		const newCookies = new AstroCookies(state.request);
		if (state.cookies) newCookies.merge(state.cookies);
		state.cookies = newCookies;
	}
	state.params = getParams(routeData, pathname);
	state.pathname = pathname;
	state.isRewriting = true;
	state.status = 200;
	setOriginPathname(state.request, oldPathname, pipeline.manifest.trailingSlash, pipeline.manifest.buildFormat);
	state.invalidateContexts();
}
var Rewrites = class {
	async execute(state, payload) {
		const pipeline = state.pipeline;
		pipeline.logger.debug("router", "Calling rewrite: ", payload);
		applyRewriteToState(state, payload, await pipeline.tryRewrite(payload, state.request), { mergeCookies: true });
		const middleware = new AstroMiddleware(pipeline);
		const pagesHandler = new PagesHandler(pipeline);
		return middleware.handle(state, pagesHandler.handle.bind(pagesHandler));
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/match.js
function matchRoute(pathname, manifest) {
	if (isRoute404(pathname)) {
		const errorRoute = manifest.routes.find((route) => isRoute404(route.route));
		if (errorRoute) return errorRoute;
	}
	if (isRoute500(pathname)) {
		const errorRoute = manifest.routes.find((route) => isRoute500(route.route));
		if (errorRoute) return errorRoute;
	}
	return manifest.routes.find((route) => {
		return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
	});
}
function isRoute404or500(route) {
	return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
	return route.component === SERVER_ISLAND_COMPONENT;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/i18n/domain.js
function computePathnameFromDomain(request, url, i18n, base, trailingSlash, logger, pathnameFromRequest) {
	let pathname = void 0;
	if (i18n && (i18n.strategy === "domains-prefix-always" || i18n.strategy === "domains-prefix-other-locales" || i18n.strategy === "domains-prefix-always-no-redirect")) {
		let host = request.headers.get("X-Forwarded-Host");
		let protocol = request.headers.get("X-Forwarded-Proto");
		if (protocol) protocol = protocol + ":";
		else protocol = url.protocol;
		if (!host) host = request.headers.get("Host");
		if (host && protocol) {
			host = host.split(":")[0];
			try {
				let locale;
				const hostAsUrl = new URL(`${protocol}//${host}`);
				for (const [domainKey, localeValue] of Object.entries(i18n.domainLookupTable)) {
					const domainKeyAsUrl = new URL(domainKey);
					if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
						locale = localeValue;
						break;
					}
				}
				if (locale) {
					const requestPathname = pathnameFromRequest ?? removeBase(url.pathname, base);
					pathname = prependForwardSlash(joinPaths(normalizeTheLocale(locale), requestPathname));
					if (trailingSlash === "always") pathname = appendForwardSlash(pathname);
					else if (trailingSlash === "never") pathname = removeTrailingForwardSlash(pathname);
					else if (requestPathname.endsWith("/")) pathname = appendForwardSlash(pathname);
				}
			} catch (e) {
				logger.error("router", `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`);
				logger.error("router", `Error: ${e}`);
			}
		}
	}
	return pathname;
}
function removeBase(pathname, base) {
	pathname = collapseDuplicateLeadingSlashes(pathname);
	if (pathname.startsWith(base)) return pathname.slice(removeTrailingForwardSlash(base).length + 1);
	return pathname;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/app/render-options.js
var renderOptionsSymbol = /* @__PURE__ */ Symbol.for("astro.renderOptions");
function getRenderOptions(request) {
	return Reflect.get(request, renderOptionsSymbol);
}
function setRenderOptions(request, options) {
	Reflect.set(request, renderOptionsSymbol, options);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/app/validate-headers.js
function getFirstForwardedValue$1(multiValueHeader) {
	return multiValueHeader?.toString().split(",").map((e) => e.trim())[0];
}
function sanitizeHost(hostname) {
	if (!hostname) return void 0;
	if (/[/\\]/.test(hostname)) return void 0;
	return hostname;
}
function parseHost(host) {
	const parts = host.split(":");
	return {
		hostname: parts[0],
		port: parts[1]
	};
}
function matchesAllowedDomains(hostname, protocol, port, allowedDomains) {
	const urlString = `${protocol}://${port ? `${hostname}:${port}` : hostname}`;
	if (!URL.canParse(urlString)) return false;
	const testUrl = new URL(urlString);
	return allowedDomains.some((pattern) => matchPattern(testUrl, pattern));
}
function validateHost(host, protocol, allowedDomains) {
	if (!host || host.length === 0) return void 0;
	if (!allowedDomains || allowedDomains.length === 0) return void 0;
	const sanitized = sanitizeHost(host);
	if (!sanitized) return void 0;
	const { hostname, port } = parseHost(sanitized);
	if (matchesAllowedDomains(hostname, protocol, port, allowedDomains)) return sanitized;
}
function validateForwardedHeaders(forwardedProtocol, forwardedHost, forwardedPort, allowedDomains) {
	const result = {};
	if (forwardedProtocol) {
		if (allowedDomains && allowedDomains.length > 0) {
			if (allowedDomains.some((pattern) => pattern.protocol !== void 0)) try {
				const testUrl = new URL(`${forwardedProtocol}://example.com`);
				if (allowedDomains.some((pattern) => matchPattern(testUrl, { protocol: pattern.protocol }))) result.protocol = forwardedProtocol;
			} catch {}
			else if (/^https?$/.test(forwardedProtocol)) result.protocol = forwardedProtocol;
		}
	}
	if (forwardedPort && allowedDomains && allowedDomains.length > 0) {
		if (allowedDomains.some((pattern) => pattern.port !== void 0)) {
			if (allowedDomains.some((pattern) => pattern.port === forwardedPort)) result.port = forwardedPort;
		}
	}
	if (forwardedHost && forwardedHost.length > 0 && allowedDomains && allowedDomains.length > 0) {
		const protoForValidation = result.protocol || "https";
		const sanitized = sanitizeHost(forwardedHost);
		if (sanitized) {
			const { hostname, port: portFromHost } = parseHost(sanitized);
			if (matchesAllowedDomains(hostname, protoForValidation, result.port || portFromHost, allowedDomains)) result.host = sanitized;
		}
	}
	return result;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/fetch/fetch-state.js
var FetchState = class {
	pipeline;
	/**
	* The request to render. Mutated during rewrites so subsequent renders
	* see the rewritten URL.
	*/
	request;
	routeData;
	/**
	* The pathname to use for routing and rendering. Starts out as the raw,
	* base-stripped, decoded pathname from the request. May be further
	* normalized by `AstroHandler` after routeData is known (in dev, when
	* the matched route has no `.html` extension, `.html` / `/index.html`
	* suffixes are stripped).
	*/
	pathname;
	/** Resolved render options (addCookieHeader, clientAddress, locals, etc.). */
	renderOptions;
	/** When the request started, used to log duration. */
	timeStart;
	/**
	* The route's loaded component module. Set before middleware runs; may
	* be swapped during in-flight rewrites from inside the middleware chain.
	*/
	componentInstance;
	/**
	* Slot overrides supplied by the container API. `undefined` for HTTP
	* requests — `PagesHandler` coalesces to `{}` on read so we don't
	* allocate an empty object per request.
	*/
	slots;
	/**
	* The `Response` produced by handlers, if any. Set after page
	* rendering or middleware completes.
	*/
	response;
	/**
	* Default HTTP status for the rendered response. Callers override
	* before rendering runs (e.g. `AstroHandler` sets this from
	* `BaseApp.getDefaultStatusCode`; error handlers set `404` / `500`).
	*/
	status = 200;
	/** Whether user middleware should be skipped for this request. */
	skipMiddleware = false;
	/**
	* Set to `true` when the request path was encoded too many times to fully
	* decode (see {@link validateAndDecodePathname}). These requests are
	* rejected with a `400` before middleware or routing run.
	*/
	invalidEncoding = false;
	/** A flag that tells the render content if the rewriting was triggered. */
	isRewriting = false;
	/** A safety net in case of loops (rewrite counter). */
	counter = 0;
	/** Cookies for this request. Created lazily on first access. */
	cookies;
	/** Route params derived from routeData + pathname. Computed lazily. */
	#params;
	get params() {
		if (!this.#params && this.routeData) this.#params = getParams(this.routeData, this.pathname);
		return this.#params;
	}
	set params(value) {
		this.#params = value;
	}
	/** Normalized URL for this request. */
	url;
	/** Client address for this request. */
	clientAddress;
	/** Whether this is a partial render (container API). */
	partial;
	/** Internal metadata about the current response route type. */
	responseRouteType;
	/** Internal flag to prevent rerouting this response to an error page. */
	skipErrorReroute = false;
	/** Whether to inject CSP meta tags. */
	shouldInjectCspMetaTags;
	/** Request-scoped locals object, shared with user middleware. */
	locals = {};
	/**
	* Memoized `props` (see `getProps`). `null` means "not yet computed"
	* — using `null` (rather than `undefined`) keeps the hidden class
	* stable and distinct from a valid-but-empty result.
	*/
	props = null;
	/** Memoized `ActionAPIContext` (see `getActionAPIContext`). */
	actionApiContext = null;
	/** Memoized `APIContext` (see `getAPIContext`). */
	apiContext = null;
	/** Registered context providers keyed by name. Lazy-initialized on first provide(). */
	#providers;
	/** Cached values from resolved providers. Lazy-initialized on first resolve(). */
	#providersResolvedValues;
	/** Cached promise for lazy component instance loading. */
	#componentInstancePromise;
	/** SSR result for the current page render. */
	result;
	/** Initial props (from container/error handler). */
	initialProps = {};
	/** Rewrites handler instance. Lazy-initialized on first rewrite(). */
	#rewrites;
	/** Memoized Astro page partial. */
	#astroPagePartial;
	/**
	* Locale-prefixed pathname derived from the Host header for domain-based
	* i18n routing (e.g. `/en/boats/1/foo`), or `undefined` when the request
	* isn't served from a locale-mapped domain. When set, `this.pathname` is
	* derived from it so locale/param resolution match the route pattern.
	*/
	#domainPathname;
	/** Memoized current locale. */
	#currentLocale;
	/** Memoized preferred locale. */
	#preferredLocale;
	/** Memoized preferred locale list. */
	#preferredLocaleList;
	constructor(pipeline, request, options) {
		this.pipeline = pipeline;
		this.request = request;
		options ??= getRenderOptions(request);
		this.routeData = options?.routeData;
		const self = this;
		this.renderOptions = {
			...options ?? {
				addCookieHeader: false,
				clientAddress: void 0,
				prerenderedErrorPageFetch: fetch,
				routeData: void 0,
				waitUntil: void 0
			},
			get locals() {
				return self.locals;
			}
		};
		this.componentInstance = void 0;
		this.slots = void 0;
		const url = new URL(request.url);
		const publicPathname = this.#normalizePathname(url.pathname);
		const pathname = this.#computePathname(publicPathname);
		url.pathname = publicPathname;
		url.pathname = collapseDuplicateSlashes(url.pathname);
		const domainPathname = computePathnameFromDomain(request, url, pipeline.manifest.i18n, pipeline.manifest.base, pipeline.manifest.trailingSlash, pipeline.logger, pathname);
		if (domainPathname) {
			this.#domainPathname = domainPathname;
			this.pathname = domainPathname;
		} else this.pathname = pathname;
		this.timeStart = performance.now();
		this.clientAddress = options?.clientAddress;
		this.locals = options?.locals ?? {};
		this.url = url;
		this.cookies = new AstroCookies(request);
		if (pipeline.manifest.allowedDomains && pipeline.manifest.allowedDomains.length > 0 && !this.routeData?.prerender) this.#applyForwardedHeaders();
		if (!Reflect.get(this.request, originPathnameSymbol)) setOriginPathname(this.request, this.pathname, pipeline.manifest.trailingSlash, pipeline.manifest.buildFormat);
		this.#resolveRouteData();
	}
	/**
	* Triggers a rewrite. Delegates to the Rewrites handler.
	*/
	rewrite(payload) {
		return (this.#rewrites ??= new Rewrites()).execute(this, payload);
	}
	/**
	* Creates the SSR result for the current page render.
	*/
	async createResult(mod, ctx) {
		const pipeline = this.pipeline;
		const { clientDirectives, inlinedScripts, compressHTML, manifest, renderers, resolve } = pipeline;
		const routeData = this.routeData;
		const { links, scripts, styles } = await pipeline.headElements(routeData);
		const extraStyleHashes = [];
		const extraScriptHashes = [];
		const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags ?? manifest.shouldInjectCspMetaTags;
		const cspAlgorithm = manifest.csp?.algorithm ?? "SHA-256";
		if (shouldInjectCspMetaTags) {
			for (const style of styles) extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
			for (const script of scripts) extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
		}
		const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest.componentMetadata;
		const headers = new Headers({ "Content-Type": "text/html" });
		const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
		const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
		const status = this.status;
		const response = {
			status: actionResult?.error ? actionResult?.error.status : status,
			statusText: actionResult?.error ? actionResult?.error.type : "OK",
			get headers() {
				return headers;
			},
			set headers(_) {
				throw new AstroError(AstroResponseHeadersReassigned);
			}
		};
		const state = this;
		const result = {
			base: manifest.base,
			userAssetsBase: manifest.userAssetsBase,
			cancelled: false,
			clientDirectives,
			inlinedScripts,
			componentMetadata,
			compressHTML,
			cookies: this.cookies,
			createAstro: (props, slots) => state.createAstro(result, props, slots, ctx),
			links,
			params: this.params,
			partial,
			pathname: this.pathname,
			renderers,
			resolve,
			response,
			request: this.request,
			scripts,
			styles,
			actionResult,
			async getServerIslandNameMap() {
				return (await pipeline.getServerIslands()).serverIslandNameMap ?? /* @__PURE__ */ new Map();
			},
			key: manifest.key,
			trailingSlash: manifest.trailingSlash,
			_metadata: {
				hasHydrationScript: false,
				rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
				hasRenderedHead: false,
				renderedScripts: /* @__PURE__ */ new Set(),
				hasDirectives: /* @__PURE__ */ new Set(),
				hasRenderedServerIslandRuntime: false,
				headInTree: false,
				extraHead: [],
				extraStyleHashes,
				extraScriptHashes,
				propagators: /* @__PURE__ */ new Set(),
				routeHasPropagation: false,
				pendingSlotEvaluations: [],
				templateDepth: 0
			},
			cspDestination: manifest.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
			shouldInjectCspMetaTags,
			cspAlgorithm,
			directives: manifest.csp?.directives ? [...manifest.csp.directives] : [],
			scriptHashes: manifest.csp?.scriptHashes ? [...manifest.csp.scriptHashes] : [],
			scriptResources: manifest.csp?.scriptResources ? [...manifest.csp.scriptResources] : [],
			styleHashes: manifest.csp?.styleHashes ? [...manifest.csp.styleHashes] : [],
			styleResources: manifest.csp?.styleResources ? [...manifest.csp.styleResources] : [],
			isStrictDynamic: manifest.csp?.isStrictDynamic ?? false,
			scriptDirective: {
				resources: manifest.csp?.scriptDirective ? [...manifest.csp.scriptDirective.resources] : [],
				hashes: manifest.csp?.scriptDirective ? [...manifest.csp.scriptDirective.hashes] : [],
				strictDynamic: manifest.csp?.scriptDirective?.strictDynamic ?? false
			},
			styleDirective: {
				resources: manifest.csp?.styleDirective ? [...manifest.csp.styleDirective.resources] : [],
				hashes: manifest.csp?.styleDirective ? [...manifest.csp.styleDirective.hashes] : []
			},
			speculationRulesContent: manifest.csp?.speculationRulesContent,
			internalFetchHeaders: manifest.internalFetchHeaders
		};
		this.result = result;
		return result;
	}
	/**
	* Creates the Astro global object for a component render.
	*/
	createAstro(result, props, slotValues, apiContext) {
		let astroPagePartial;
		if (this.isRewriting) this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
		this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
		astroPagePartial = this.#astroPagePartial;
		const astroComponentPartial = {
			props,
			self: null
		};
		const Astro = Object.assign(Object.create(astroPagePartial), astroComponentPartial);
		let _slots;
		Object.defineProperty(Astro, "slots", { get: () => {
			if (!_slots) _slots = new Slots(result, slotValues, this.pipeline.logger);
			return _slots;
		} });
		return Astro;
	}
	/**
	* Creates the Astro page-level partial (prototype for Astro global).
	*/
	createAstroPagePartial(result, apiContext) {
		const state = this;
		const { cookies, locals, params, pipeline, url } = this;
		const { response } = result;
		const redirect = (path, status = 302) => {
			if (state.request[responseSentSymbol$1]) throw new AstroError({ ...ResponseSentError });
			return new Response(null, {
				status,
				headers: { Location: path }
			});
		};
		const rewrite = async (reroutePayload) => {
			return await state.rewrite(reroutePayload);
		};
		const callAction = createCallAction(apiContext);
		const partial = {
			generator: ASTRO_GENERATOR,
			routePattern: this.routeData.route,
			isPrerendered: this.routeData.prerender,
			cookies,
			get clientAddress() {
				return state.getClientAddress();
			},
			get currentLocale() {
				return state.computeCurrentLocale();
			},
			params,
			get preferredLocale() {
				return state.computePreferredLocale();
			},
			get preferredLocaleList() {
				return state.computePreferredLocaleList();
			},
			locals,
			redirect,
			rewrite,
			request: this.request,
			response,
			site: pipeline.site,
			getActionResult: createGetActionResult(locals),
			get callAction() {
				return callAction;
			},
			url,
			get originPathname() {
				return getOriginPathname(state.request);
			},
			get csp() {
				return state.getCsp();
			},
			get logger() {
				return {
					info(msg) {
						pipeline.logger.info(null, msg);
					},
					warn(msg) {
						pipeline.logger.warn(null, msg);
					},
					error(msg) {
						pipeline.logger.error(null, msg);
					}
				};
			}
		};
		this.defineProviderGetters(partial);
		return partial;
	}
	getClientAddress() {
		const { pipeline, clientAddress } = this;
		const routeData = this.routeData;
		if (routeData.prerender) throw new AstroError({
			...PrerenderClientAddressNotAvailable,
			message: PrerenderClientAddressNotAvailable.message(routeData.component)
		});
		if (clientAddress) return clientAddress;
		if (pipeline.adapterName) throw new AstroError({
			...ClientAddressNotAvailable,
			message: ClientAddressNotAvailable.message(pipeline.adapterName)
		});
		throw new AstroError(StaticClientAddressNotAvailable);
	}
	getCookies() {
		return this.cookies;
	}
	getCsp() {
		const state = this;
		const { pipeline } = this;
		if (!pipeline.manifest.csp) {
			if (pipeline.runtimeMode === "production") pipeline.logger.warn("csp", `context.csp was used when rendering the route ${s.green(state.routeData.route)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/configuration-reference/#securitycsp`);
			return;
		}
		const warnedFallback = /* @__PURE__ */ new Set();
		const warnFallback = (family, kind) => {
			if (kind === "default" || !state.result) return;
			const defaultResources = (family === "script" ? state.result.scriptDirective : state.result.styleDirective).resources.map(normalizeCspResourceEntry).filter((entry) => entry.kind === "default").map((entry) => entry.resource);
			if (defaultResources.length === 0) return;
			const key = `${family}:${kind}`;
			if (warnedFallback.has(key)) return;
			warnedFallback.add(key);
			const general = `${family}-src`;
			const specific = `${general}-${kind === "element" ? "elem" : "attr"}`;
			pipeline.logger.warn("csp", `A resource was added to \`${specific}\`, but \`${general}\` also defines custom resources (${defaultResources.join(" ")}). Because \`${specific}\` overrides \`${general}\` for its scope (browsers do not fall back), those resources will not apply there. Add them to \`${specific}\` as well if needed.`);
		};
		return {
			insertDirective(payload) {
				if (state.result) state.result.directives = pushDirective(state.result.directives, payload);
			},
			insertScriptResource(payload) {
				if (!state.result) return;
				warnFallback("script", normalizeCspResourceEntry(payload).kind);
				state.result.scriptDirective.resources.push(payload);
			},
			insertStyleResource(payload) {
				if (!state.result) return;
				warnFallback("style", normalizeCspResourceEntry(payload).kind);
				state.result.styleDirective.resources.push(payload);
			},
			insertStyleHash(payload) {
				state.result?.styleDirective.hashes.push(payload);
			},
			insertScriptHash(payload) {
				state.result?.scriptDirective.hashes.push(payload);
			}
		};
	}
	computeCurrentLocale() {
		const { url, pipeline: { i18n }, routeData } = this;
		if (!i18n || !routeData) return;
		const { defaultLocale, locales, strategy } = i18n;
		const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
		if (this.#currentLocale) return this.#currentLocale;
		let computedLocale;
		if (isRouteServerIsland(routeData)) {
			let referer = this.request.headers.get("referer");
			if (referer) {
				if (URL.canParse(referer)) referer = new URL(referer).pathname;
				computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
			}
		} else {
			let pathname = routeData.pathname;
			if (this.#domainPathname) pathname = this.pathname;
			else if (url && !routeData.pattern.test(url.pathname)) {
				for (const fallbackRoute of routeData.fallbackRoutes) if (fallbackRoute.pattern.test(url.pathname)) {
					pathname = fallbackRoute.pathname;
					break;
				}
			}
			pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname ?? this.pathname;
			computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
			if (routeData.params.length > 0) {
				const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
				if (localeFromParams) computedLocale = localeFromParams;
			}
		}
		this.#currentLocale = computedLocale ?? fallbackTo;
		return this.#currentLocale;
	}
	computePreferredLocale() {
		const { pipeline: { i18n }, request } = this;
		if (!i18n) return;
		return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
	}
	computePreferredLocaleList() {
		const { pipeline: { i18n }, request } = this;
		if (!i18n) return;
		return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
	}
	/**
	* Lazily loads the route's component module. Returns the cached
	* instance if already loaded. The promise is cached so concurrent
	* callers share the same load.
	*/
	async loadComponentInstance() {
		if (this.componentInstance) return this.componentInstance;
		if (this.#componentInstancePromise) return this.#componentInstancePromise;
		this.#componentInstancePromise = this.pipeline.getComponentByRoute(this.routeData).then((mod) => {
			this.componentInstance = mod;
			return mod;
		});
		return this.#componentInstancePromise;
	}
	/**
	* Registers a context provider under the given key. Handlers call
	* this to contribute values to the request context (e.g. sessions).
	* The `create` factory is called lazily on the first `resolve(key)`.
	*/
	provide(key, provider) {
		(this.#providers ??= /* @__PURE__ */ new Map()).set(key, provider);
	}
	/**
	* Lazily resolves a provider registered under `key`. Calls
	* `provider.create()` on first access and caches the result.
	* Returns `undefined` if no provider was registered for the key.
	*/
	resolve(key) {
		if (this.#providersResolvedValues?.has(key)) return this.#providersResolvedValues.get(key);
		const provider = this.#providers?.get(key);
		if (!provider) return void 0;
		const value = provider.create();
		(this.#providersResolvedValues ??= /* @__PURE__ */ new Map()).set(key, value);
		return value;
	}
	/**
	* Runs all registered `finalize` callbacks. Should be called after
	* the response is produced, typically in a `finally` block.
	*
	* Returns synchronously (no promise allocation) when nothing needs
	* finalizing — important for the hot path where sessions are not used.
	*/
	finalizeAll() {
		if (!this.#providersResolvedValues || this.#providersResolvedValues.size === 0) return;
		let chain;
		for (const [key, provider] of this.#providers) if (provider.finalize && this.#providersResolvedValues.has(key)) {
			const result = provider.finalize(this.#providersResolvedValues.get(key));
			if (result) chain = chain ? chain.then(() => result) : result;
		}
		return chain;
	}
	/**
	* Adds lazy getters to `target` for each registered provider key.
	* Used by context creation (APIContext, Astro global) so that
	* provider values like `session` and `cache` appear as properties
	* without hard-coding the keys.
	*
	* Always defines a `session` getter (returning `undefined` when no
	* provider is registered) so `ctx.session` / `Astro.session` is a
	* present property regardless of whether the sessions handler was
	* included in the pipeline.
	*/
	defineProviderGetters(target) {
		const state = this;
		if (this.#providers) for (const key of this.#providers.keys()) Object.defineProperty(target, key, {
			get: () => state.resolve(key),
			enumerable: true,
			configurable: true
		});
		if (!this.#providers?.has("session")) {
			let warned = false;
			Object.defineProperty(target, "session", {
				get() {
					if (!warned) {
						warned = true;
						state.pipeline.logger.warn("session", "`Astro.session` was accessed but no session storage is configured. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/");
					}
				},
				enumerable: true,
				configurable: true
			});
		}
	}
	/**
	* Resolves the route to use for this request and stores it on
	* `this.routeData`. If the adapter (or the dev server) provided a
	* `routeData` via render options it's already set and this is a
	* no-op. Otherwise we use the app's synchronous route matcher and
	* fall back to a `404.astro` route so middleware can still run.
	*
	* Called eagerly from the constructor so individual handlers
	* (actions, pages, middleware, etc.) always see a resolved route
	* without the caller needing an extra setup step.
	*
	* Once routeData is known, finalizes `this.pathname`: in dev, if the
	* matched route has no `.html` extension, strip `.html` / `/index.html`
	* suffixes so the rendering pipeline sees the canonical pathname.
	*/
	/**
	* Strip `.html` / `/index.html` suffixes from the pathname so the
	* rendering pipeline sees the canonical route path. Only applies to
	* page routes where `.html` is framework-injected. Endpoint routes
	* preserve `.html` because any such suffix is user-provided (e.g.
	* from `getStaticPaths` params). Skipped when the matched route
	* itself has an `.html` extension in its definition.
	*/
	#stripHtmlExtension() {
		if (this.routeData && this.routeData.type === "page" && !routeHasHtmlExtension(this.routeData)) this.pathname = this.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
	}
	#resolveRouteData() {
		const pipeline = this.pipeline;
		if (this.routeData) {
			this.#stripHtmlExtension();
			return;
		}
		const matched = pipeline.matchRoute(this.pathname);
		if (matched && matched.prerender && pipeline.manifest.serverLike) {
			if (matched.params.length > 0) {
				const allMatches = pipeline.matchAllRoutes(this.pathname);
				this.routeData = allMatches.find((r) => !r.prerender);
			} else this.routeData = void 0;
		} else this.routeData = matched;
		pipeline.logger.debug("router", "Astro matched the following route for " + this.request.url);
		pipeline.logger.debug("router", "RouteData:\n" + this.routeData);
		if (!this.routeData) {
			const custom404 = getCustom404Route(pipeline.manifestData);
			if (custom404 && !custom404.prerender) this.routeData = custom404;
		}
		if (!this.routeData) {
			pipeline.logger.debug("router", "Astro hasn't found routes that match " + this.request.url);
			pipeline.logger.debug("router", "Here's the available routes:\n", pipeline.manifestData);
			return;
		}
		this.#stripHtmlExtension();
	}
	/**
	* Strips the pipeline's base from a normalized request pathname and prepends
	* a forward slash.
	*
	* Mirrors `BaseApp.removeBase`, including the
	* `collapseDuplicateLeadingSlashes` fix that prevents middleware
	* authorization bypass when the URL starts with `//`.
	*/
	#computePathname(normalizedPathname) {
		let pathname = collapseDuplicateLeadingSlashes(normalizedPathname);
		const base = this.pipeline.manifest.base;
		if (pathname.startsWith(base)) {
			const baseWithoutTrailingSlash = removeTrailingForwardSlash(base);
			pathname = pathname.slice(baseWithoutTrailingSlash.length + 1);
		}
		return prependForwardSlash(pathname);
	}
	/**
	* Decodes and normalizes the public request pathname before deriving the
	* separate pathname used for route matching.
	*/
	#normalizePathname(pathname) {
		try {
			pathname = validateAndDecodePathname(pathname);
		} catch (e) {
			if (e instanceof MultiLevelEncodingError) this.invalidEncoding = true;
			else this.pipeline.logger.error(null, e.toString());
		}
		return collapseDuplicateSlashes(pathname);
	}
	/**
	* Reads X-Forwarded-Proto, X-Forwarded-Host, and X-Forwarded-Port
	* from the request headers, validates them against the manifest's
	* `allowedDomains`, and updates `this.url` accordingly. Also resolves
	* `clientAddress` from X-Forwarded-For when the host is trusted.
	*
	* Only called when `allowedDomains` is configured — without it,
	* forwarded headers are never trusted.
	*/
	#applyForwardedHeaders() {
		const headers = this.request.headers;
		const allowedDomains = this.pipeline.manifest.allowedDomains;
		const validated = validateForwardedHeaders(getFirstForwardedValue$1(headers.get("x-forwarded-proto") ?? void 0), getFirstForwardedValue$1(headers.get("x-forwarded-host") ?? void 0), getFirstForwardedValue$1(headers.get("x-forwarded-port") ?? void 0), allowedDomains);
		if (!validated.protocol && !validated.host && !validated.port) return;
		if (validated.protocol) this.url.protocol = validated.protocol + ":";
		if (validated.host) {
			const colonIdx = validated.host.indexOf(":");
			if (colonIdx !== -1) {
				this.url.hostname = validated.host.slice(0, colonIdx);
				this.url.port = validated.host.slice(colonIdx + 1);
			} else {
				this.url.hostname = validated.host;
				this.url.port = "";
			}
		}
		if (validated.port) this.url.port = validated.port;
		if (validated.host !== void 0 && !this.clientAddress) {
			const forwardedFor = getFirstForwardedValue$1(this.request.headers.get("x-forwarded-for") ?? void 0);
			if (forwardedFor) this.clientAddress = forwardedFor;
		}
		const oldRequest = this.request;
		this.request = new Request(this.url, oldRequest);
		const app = Reflect.get(oldRequest, appSymbol);
		if (app !== void 0) Reflect.set(this.request, appSymbol, app);
	}
	/**
	* Returns the resolved `props` for this render, computing them lazily
	* from the route + component module on first access. If the
	* `initialProps` already carries user-supplied props (e.g. the
	* container API) those are used verbatim.
	*/
	async getProps() {
		if (this.props !== null) return this.props;
		if (Object.keys(this.initialProps).length > 0) {
			this.props = this.initialProps;
			return this.props;
		}
		const pipeline = this.pipeline;
		const mod = await this.loadComponentInstance();
		this.props = await getProps({
			mod,
			routeData: this.routeData,
			routeCache: pipeline.routeCache,
			pathname: this.pathname,
			logger: pipeline.logger,
			serverLike: pipeline.manifest.serverLike,
			base: pipeline.manifest.base,
			trailingSlash: pipeline.manifest.trailingSlash
		});
		return this.props;
	}
	/**
	* Returns the `ActionAPIContext` for this render, creating it lazily.
	* Used by middleware, actions, and page dispatch.
	*/
	getActionAPIContext() {
		if (this.actionApiContext !== null) return this.actionApiContext;
		const state = this;
		const ctx = {
			get cookies() {
				return state.cookies;
			},
			routePattern: this.routeData.route,
			isPrerendered: this.routeData.prerender,
			get clientAddress() {
				return state.getClientAddress();
			},
			get currentLocale() {
				return state.computeCurrentLocale();
			},
			generator: ASTRO_GENERATOR,
			get locals() {
				return state.locals;
			},
			set locals(_) {
				throw new AstroError(LocalsReassigned);
			},
			params: this.params,
			get preferredLocale() {
				return state.computePreferredLocale();
			},
			get preferredLocaleList() {
				return state.computePreferredLocaleList();
			},
			request: this.request,
			site: this.pipeline.site,
			url: this.url,
			get originPathname() {
				return getOriginPathname(state.request);
			},
			get csp() {
				return state.getCsp();
			},
			get logger() {
				return {
					info(msg) {
						state.pipeline.logger.info(null, msg);
					},
					warn(msg) {
						state.pipeline.logger.warn(null, msg);
					},
					error(msg) {
						state.pipeline.logger.error(null, msg);
					}
				};
			}
		};
		this.defineProviderGetters(ctx);
		this.actionApiContext = ctx;
		return this.actionApiContext;
	}
	/**
	* Returns the `APIContext` for this render, creating it lazily from
	* the memoized props + action context.
	*
	* Callers must ensure `getProps()` has resolved at least once before
	* calling this.
	*/
	getAPIContext() {
		if (this.apiContext !== null) return this.apiContext;
		const actionApiContext = this.getActionAPIContext();
		const state = this;
		const redirect = (path, status = 302) => new Response(null, {
			status,
			headers: { Location: path }
		});
		const rewrite = async (reroutePayload) => {
			return await state.rewrite(reroutePayload);
		};
		Reflect.set(actionApiContext, pipelineSymbol, this.pipeline);
		actionApiContext[fetchStateSymbol] = this;
		this.apiContext = Object.assign(actionApiContext, {
			props: this.props,
			redirect,
			rewrite,
			getActionResult: createGetActionResult(actionApiContext.locals),
			callAction: createCallAction(actionApiContext)
		});
		return this.apiContext;
	}
	/**
	* Invalidates the cached `APIContext` so the next `getAPIContext()`
	* call re-derives it from the (possibly mutated) state. Used
	* after an in-flight rewrite swaps the route / request / params.
	*/
	invalidateContexts() {
		this.props = null;
		this.actionApiContext = null;
		this.apiContext = null;
	}
	resetResponseMetadata() {
		this.responseRouteType = void 0;
		this.skipErrorReroute = false;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/actions/handler.js
var ActionHandler = class {
	/**
	* Run action handling for the current request. Expects the APIContext
	* that is already being used by the render pipeline.
	*
	* Returns a `Response` when the action fully handles the request (RPC),
	* or `undefined` when the caller should continue processing the
	* request (form actions or non-action requests).
	*/
	handle(apiContext, state) {
		state.pipeline.usedFeatures |= PipelineFeatures.actions;
		if (apiContext.isPrerendered) return;
		const { action, setActionResult } = getActionContext(apiContext);
		if (!action) return;
		if (state.pipeline.manifest.checkOrigin && isForbiddenCrossOriginRequest(apiContext.request, apiContext.url, apiContext.isPrerendered)) return Promise.resolve(createCrossOriginForbiddenResponse(apiContext.request));
		return this.#executeAction(action, setActionResult);
	}
	async #executeAction(action, setActionResult) {
		const serialized = serializeActionResult(await action.handler());
		if (action.calledFrom === "rpc") {
			if (serialized.type === "empty") return new Response(null, { status: serialized.status });
			return new Response(serialized.body, {
				status: serialized.status,
				headers: { "Content-Type": serialized.contentType }
			});
		}
		setActionResult(action.name, serialized);
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/app/prepare-response.js
function prepareResponse(response, { addCookieHeader }) {
	if (addCookieHeader) for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) response.headers.append("set-cookie", setCookieHeaderValue);
	Reflect.set(response, responseSentSymbol$1, true);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/3xx.js
function redirectTemplate({ status, absoluteLocation, relativeLocation, from }) {
	const delay = status === 302 ? 2 : 0;
	const rel = escape(String(relativeLocation));
	return `<!doctype html>
<title>Redirecting to: ${rel}</title>
<meta http-equiv="refresh" content="${delay};url=${rel}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${escape(String(absoluteLocation))}">
<body>
	<a href="${rel}">Redirecting ${from ? `from <code>${escape(from)}</code> ` : ""}to <code>${rel}</code></a>
</body>`;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/trailing-slash-handler.js
var TrailingSlashHandler = class {
	#app;
	constructor(app) {
		this.#app = app;
	}
	/**
	* Returns a redirect `Response` if the request pathname needs
	* normalization, or `undefined` if no redirect is required.
	*/
	handle(state) {
		const url = new URL(state.request.url);
		const redirect = this.#redirectTrailingSlash(url.pathname);
		if (redirect === url.pathname) return;
		const addCookieHeader = state.renderOptions.addCookieHeader;
		const status = state.request.method === "GET" ? 301 : 308;
		const response = new Response(redirectTemplate({
			status,
			relativeLocation: url.pathname,
			absoluteLocation: redirect,
			from: state.request.url
		}), {
			status,
			headers: { location: redirect + url.search }
		});
		prepareResponse(response, { addCookieHeader });
		return response;
	}
	#redirectTrailingSlash(pathname) {
		const { trailingSlash } = this.#app.manifest;
		if (pathname === "/" || isInternalPath(pathname)) return pathname;
		const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
		if (path !== pathname) return path;
		if (trailingSlash === "ignore") return pathname;
		if (trailingSlash === "always" && !hasFileExtension(pathname)) return appendForwardSlash(pathname);
		if (trailingSlash === "never") return removeTrailingForwardSlash(pathname);
		return pathname;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/cache/runtime/utils.js
function defaultSetHeaders(options) {
	const headers = new Headers();
	const directives = [];
	if (options.maxAge !== void 0) directives.push(`max-age=${options.maxAge}`);
	if (options.swr !== void 0) directives.push(`stale-while-revalidate=${options.swr}`);
	if (directives.length > 0) headers.set("CDN-Cache-Control", directives.join(", "));
	if (options.tags && options.tags.length > 0) headers.set("Cache-Tag", options.tags.join(", "));
	if (options.lastModified) headers.set("Last-Modified", options.lastModified.toUTCString());
	if (options.etag) headers.set("ETag", options.etag);
	return headers;
}
function isLiveDataEntry(value) {
	return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/cache/runtime/cache.js
var APPLY_HEADERS = /* @__PURE__ */ Symbol.for("astro:cache:apply");
var IS_ACTIVE = /* @__PURE__ */ Symbol.for("astro:cache:active");
var AstroCache = class {
	#options = {};
	#tags = /* @__PURE__ */ new Set();
	#disabled = false;
	#provider;
	enabled = true;
	constructor(provider) {
		this.#provider = provider;
	}
	set(input) {
		if (input === false) {
			this.#disabled = true;
			this.#tags.clear();
			this.#options = {};
			return;
		}
		this.#disabled = false;
		let options;
		if (isLiveDataEntry(input)) {
			if (!input.cacheHint) return;
			options = input.cacheHint;
		} else options = input;
		if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
		if ("swr" in options && options.swr !== void 0) this.#options.swr = options.swr;
		if ("etag" in options && options.etag !== void 0) this.#options.etag = options.etag;
		if (options.lastModified !== void 0) {
			if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) this.#options.lastModified = options.lastModified;
		}
		if (options.tags) for (const tag of options.tags) this.#tags.add(tag);
	}
	get tags() {
		return [...this.#tags];
	}
	/**
	* Get the current cache options (read-only snapshot).
	* Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
	*/
	get options() {
		return {
			...this.#options,
			tags: this.tags
		};
	}
	async invalidate(input) {
		if (!this.#provider) throw new AstroError(CacheNotEnabled);
		let options;
		if (isLiveDataEntry(input)) options = { tags: input.cacheHint?.tags ?? [] };
		else options = input;
		return this.#provider.invalidate(options);
	}
	/** @internal */
	[APPLY_HEADERS](response, request) {
		if (this.#disabled) return;
		const finalOptions = {
			...this.#options,
			tags: this.tags
		};
		if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
		const headers = this.#provider?.setHeaders?.(finalOptions, request) ?? defaultSetHeaders(finalOptions);
		for (const [key, value] of headers) response.headers.set(key, value);
	}
	/** @internal */
	get [IS_ACTIVE]() {
		return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
	}
};
function applyCacheHeaders(cache, response, request) {
	if (APPLY_HEADERS in cache) cache[APPLY_HEADERS](response, request);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/parts.js
var ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
var ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
	const result = [];
	part.split(ROUTE_DYNAMIC_SPLIT).map((str, i) => {
		if (!str) return;
		const dynamic = i % 2 === 1;
		const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
		if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) throw new Error(`Invalid route ${file} \u2014 parameter name must match /^[a-zA-Z0-9_$]+$/`);
		result.push({
			content,
			dynamic,
			spread: dynamic && ROUTE_SPREAD.test(content)
		});
	});
	return result;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/cache/runtime/route-matching.js
function compileCacheRoutes(routes, base, trailingSlash) {
	const compiled = Object.entries(routes).map(([path, options]) => {
		const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s) => getParts(s, path));
		return {
			pattern: getPattern(segments, base, trailingSlash),
			options,
			segments,
			route: path
		};
	});
	compiled.sort((a, b) => routeComparator({
		segments: a.segments,
		route: a.route,
		type: "page"
	}, {
		segments: b.segments,
		route: b.route,
		type: "page"
	}));
	return compiled;
}
function matchCacheRoute(pathname, compiledRoutes) {
	for (const route of compiledRoutes) if (route.pattern.test(pathname)) return route.options;
	return null;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/cache/handler.js
var CACHE_KEY = "cache";
function provideCache(state) {
	const pipeline = state.pipeline;
	if (!pipeline.cacheConfig) {
		state.provide(CACHE_KEY, { create: () => new DisabledAstroCache(pipeline.logger) });
		return;
	}
	if (pipeline.runtimeMode === "development") {
		state.provide(CACHE_KEY, { create: () => new NoopAstroCache() });
		return;
	}
	return provideCacheAsync(state, pipeline);
}
async function provideCacheAsync(state, pipeline) {
	const cacheProvider = await pipeline.getCacheProvider();
	state.provide(CACHE_KEY, { create() {
		const cache = new AstroCache(cacheProvider);
		if (pipeline.cacheConfig?.routes) {
			if (!pipeline.compiledCacheRoutes) pipeline.compiledCacheRoutes = compileCacheRoutes(pipeline.cacheConfig.routes, pipeline.manifest.base, pipeline.manifest.trailingSlash);
			const matched = matchCacheRoute(state.pathname, pipeline.compiledCacheRoutes);
			if (matched) cache.set(matched);
		}
		return cache;
	} });
}
var CacheHandler = class {
	#app;
	constructor(app) {
		this.#app = app;
	}
	async handle(state, next) {
		this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
		if (!this.#app.pipeline.cacheProvider) return next();
		const cache = state.resolve(CACHE_KEY);
		const cacheProvider = await this.#app.pipeline.getCacheProvider();
		if (cacheProvider?.onRequest) {
			const response2 = await cacheProvider.onRequest({
				request: state.request,
				url: new URL(state.request.url),
				waitUntil: state.renderOptions.waitUntil
			}, async () => {
				const res = await next();
				applyCacheHeaders(cache, res, state.request);
				return res;
			});
			response2.headers.delete("CDN-Cache-Control");
			response2.headers.delete("Cache-Tag");
			return response2;
		}
		const response = await next();
		applyCacheHeaders(cache, response, state.request);
		return response;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/redirects/render.js
function isExternalURL(url) {
	return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
	if (typeof redirect === "string") return isExternalURL(redirect);
	else return isExternalURL(redirect.destination);
}
function computeRedirectStatus(method, redirect, redirectRoute) {
	return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
	if (typeof redirectRoute !== "undefined") return getRouteGenerator(redirectRoute.segments, trailingSlash)(params) || redirectRoute?.pathname || "/";
	else if (typeof redirect === "string") {
		if (redirectIsExternal(redirect)) return redirect;
		else {
			let target = redirect;
			for (const param of Object.keys(params)) {
				const paramValue = params[param];
				target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
			}
			return target;
		}
	} else if (typeof redirect === "undefined") return "/";
	return redirect.destination;
}
async function renderRedirect(state) {
	state.pipeline.usedFeatures |= PipelineFeatures.redirects;
	const { redirect, redirectRoute } = state.routeData;
	const status = computeRedirectStatus(state.request.method, redirect, redirectRoute);
	const headers = { location: encodeURI(resolveRedirectTarget(state.params, redirect, redirectRoute, state.pipeline.manifest.trailingSlash)) };
	if (redirect && redirectIsExternal(redirect)) {
		if (typeof redirect === "string") return Response.redirect(redirect, status);
		else return Response.redirect(redirect.destination, status);
	}
	return new Response(null, {
		status,
		headers
	});
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/session/provider-disabled.js
function provideSession(state) {
	state.pipeline.usedFeatures |= PipelineFeatures.sessions;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/routing/handler.js
var AstroHandler = class {
	#app;
	#trailingSlashHandler;
	#actionHandler;
	#astroMiddleware;
	#pagesHandler;
	#cacheHandler;
	/** Bound callback for the middleware chain — created once, reused per request. */
	#renderRouteCallback;
	/**
	* i18n post-processor. Only set when the app has i18n configured and
	* the strategy is not `manual` — for the manual strategy users wire
	* `astro:i18n.middleware(...)` into their own `onRequest`.
	*/
	#i18n;
	/** Whether sessions are configured on the manifest. */
	#hasSession;
	constructor(app) {
		this.#app = app;
		this.#trailingSlashHandler = new TrailingSlashHandler(app);
		this.#actionHandler = new ActionHandler();
		this.#astroMiddleware = new AstroMiddleware(app.pipeline);
		this.#pagesHandler = new PagesHandler(app.pipeline);
		this.#cacheHandler = new CacheHandler(app);
		this.#renderRouteCallback = this.#actionsAndPages.bind(this);
		this.#hasSession = !!app.manifest.sessionConfig;
		const i18n = app.manifest.i18n;
		if (i18n && i18n.strategy !== "manual") this.#i18n = new I18n(i18n, app.manifest.base, app.manifest.trailingSlash, app.manifest.buildFormat);
	}
	/**
	* Runs actions then pages — the callback at the bottom of the
	* middleware chain. Bound once in the constructor to avoid
	* per-request closure allocation.
	*/
	#actionsAndPages(state, ctx) {
		if (!state.skipMiddleware) {
			const actionResult = this.#actionHandler.handle(ctx, state);
			if (actionResult) return actionResult.then((response) => response ?? this.#pagesHandler.handle(state, ctx));
		}
		return this.#pagesHandler.handle(state, ctx);
	}
	async handle(state) {
		state.pipeline.usedFeatures |= ALL_PIPELINE_FEATURES;
		if (state.invalidEncoding) return new Response(null, {
			status: 400,
			statusText: "Bad Request"
		});
		const trailingSlashRedirect = this.#trailingSlashHandler.handle(state);
		if (trailingSlashRedirect) return trailingSlashRedirect;
		if (!state.routeData) return this.#app.renderError(state.request, {
			...state.renderOptions,
			status: 404,
			pathname: state.pathname
		});
		return this.render(state);
	}
	/**
	* Renders a response for the given `FetchState`. Assumes
	* trailing-slash redirects and routeData resolution have already run.
	*
	* User-triggered rewrites (`Astro.rewrite` / `ctx.rewrite`) go through
	* `Rewrites.execute` on the current `FetchState` — they mutate the
	* existing state in place and re-run middleware + page dispatch.
	*/
	async render(state) {
		const routeData = state.routeData;
		const pathname = state.pathname;
		const request = state.request;
		const { addCookieHeader } = state.renderOptions;
		state.status = this.#app.getDefaultStatusCode(routeData, pathname);
		let response;
		let finalizeError;
		try {
			const sessionP = this.#hasSession ? provideSession(state) : void 0;
			const cacheP = provideCache(state);
			if (sessionP || cacheP) await Promise.all([sessionP, cacheP]);
			state.pipeline.usedFeatures |= PipelineFeatures.sessions;
			if (routeData.type === "redirect") {
				const redirectResponse = await renderRedirect(state);
				this.#app.logThisRequest({
					pathname,
					method: request.method,
					statusCode: redirectResponse.status,
					isRewrite: false,
					timeStart: state.timeStart
				});
				prepareResponse(redirectResponse, { addCookieHeader });
				this.#app.pipeline.logger.flush();
				return redirectResponse;
			}
			if (!this.#app.pipeline.cacheProvider) {
				this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
				response = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
				if (this.#i18n) response = await this.#i18n.finalize(state, response);
			} else {
				const runPipeline = async () => {
					let res = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
					if (this.#i18n) res = await this.#i18n.finalize(state, res);
					return res;
				};
				response = await this.#cacheHandler.handle(state, runPipeline);
			}
			this.#app.logThisRequest({
				pathname,
				method: request.method,
				statusCode: response.status,
				isRewrite: state.isRewriting,
				timeStart: state.timeStart
			});
		} catch (err) {
			this.#app.logger.error(null, err.stack || err.message || String(err));
			return this.#app.renderError(request, {
				...state.renderOptions,
				status: 500,
				error: err,
				pathname: state.pathname
			});
		} finally {
			try {
				const finalize = state.finalizeAll();
				if (finalize) await finalize;
			} catch (err) {
				finalizeError = err;
				this.#app.logger.error(null, err.stack || err.message || String(err));
			}
		}
		if (finalizeError) return this.#app.renderError(request, {
			...state.renderOptions,
			status: 500,
			error: finalizeError,
			pathname: state.pathname
		});
		if (REROUTABLE_STATUS_CODES.includes(response.status) && response.body === null && !state.skipErrorReroute) return this.#app.renderError(request, {
			...state.renderOptions,
			response,
			status: response.status,
			error: response.status === 500 ? null : void 0,
			pathname: state.pathname
		});
		prepareResponse(response, { addCookieHeader });
		this.#app.pipeline.logger.flush();
		return response;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/fetch/default-handler.js
var DefaultFetchHandler = class {
	#app;
	#handler;
	constructor(app) {
		this.#app = app ?? null;
		this.#handler = app ? new AstroHandler(app) : null;
	}
	/**
	* Fast path: called directly by `BaseApp.render()` with pre-resolved
	* options, avoiding the `Reflect.set/get` round-trip through the request.
	*/
	renderWithOptions(request, options) {
		if (!this.#app) {
			const app = Reflect.get(request, appSymbol);
			if (!app) throw new Error("No fetch handler provided.");
			this.#app = app;
			this.#handler = new AstroHandler(app);
		}
		const state = new FetchState(this.#app.pipeline, request, options);
		return this.#handler.handle(state);
	}
	fetch = (request) => {
		if (!this.#app) {
			const app = Reflect.get(request, appSymbol);
			if (!app) throw new Error("No fetch handler provided.");
			this.#app = app;
			this.#handler = new AstroHandler(app);
		}
		const state = new FetchState(this.#app.pipeline, request);
		if (!this.#handler) throw new Error("No fetch handler provided.");
		return this.#handler.handle(state);
	};
};
//#endregion
//#region \0virtual:astro:fetchable
var _virtual_astro_fetchable_default = new DefaultFetchHandler();
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/i18n/error-routes.js
function isLocalizedErrorRoute(route, status, locales) {
	if (!locales) return false;
	const suffix = `/${status}`;
	if (!route.endsWith(suffix)) return false;
	const localeSegment = route.slice(0, -suffix.length);
	if (!localeSegment || localeSegment.includes("/", 1)) return false;
	return pathHasLocale(localeSegment, locales);
}
function getErrorRoutePath(pathname, status, routes, locales, appendTrailingSlash = false) {
	const suffix = appendTrailingSlash ? "/" : "";
	if (locales) {
		const firstSegment = pathname.split("/").find(Boolean);
		if (firstSegment && pathHasLocale(`/${firstSegment}`, locales)) {
			const localized = `/${firstSegment}/${status}`;
			if (routes.some((route) => route.route === localized)) return `${localized}${suffix}`;
		}
	}
	return `/${status}${suffix}`;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/output-filename.js
var STATUS_CODE_PAGES = /* @__PURE__ */ new Set(["/404", "/500"]);
function getOutputFilename(buildFormat, name, routeData) {
	if (routeData.type === "endpoint") return name;
	if (name === "/" || name === "") return name === "" ? "index.html" : "/index.html";
	if (buildFormat === "file" || STATUS_CODE_PAGES.has(name)) return `${removeTrailingForwardSlash(name || "index")}.html`;
	if (buildFormat === "preserve" && !routeData.isIndex) return `${removeTrailingForwardSlash(name || "index")}.html`;
	return `${removeTrailingForwardSlash(name)}/index.html`;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/errors/handler.js
function rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, renderedRouteData, response) {
	return skipMiddleware === false && renderedRouteData !== errorRouteData && response.body === null && REROUTABLE_STATUS_CODES.includes(response.status);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/errors/default-handler.js
var DefaultErrorHandler = class {
	#app;
	#astroMiddleware;
	#pagesHandler;
	constructor(app) {
		this.#app = app;
		this.#astroMiddleware = new AstroMiddleware(app.pipeline);
		this.#pagesHandler = new PagesHandler(app.pipeline);
	}
	async renderError(request, { status, response: originalResponse, skipMiddleware = false, error, pathname, ...resolvedRenderOptions }) {
		const app = this.#app;
		const resolvedPathname = pathname ?? new FetchState(app.pipeline, request).pathname;
		const errorRouteData = matchRoute(getErrorRoutePath(resolvedPathname, status, app.manifestData.routes, app.manifest.i18n?.locales, app.manifest.trailingSlash === "always"), app.manifestData);
		const url = new URL(request.url);
		if (errorRouteData) {
			if (errorRouteData.prerender) {
				const allowedDomains = app.manifest.allowedDomains;
				const safeOrigin = validateHost(url.host, url.protocol.replace(":", ""), allowedDomains) ? url.origin : `${url.protocol}//localhost`;
				const statusURL = new URL(`${app.baseWithoutTrailingSlash}${getOutputFilename(app.manifest.buildFormat, errorRouteData.route, errorRouteData)}`, safeOrigin);
				if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) try {
					const newResponse = mergeResponses(await resolvedRenderOptions.prerenderedErrorPageFetch(statusURL.toString()), originalResponse, {
						status,
						removeContentEncodingHeaders: true
					});
					prepareResponse(newResponse, resolvedRenderOptions);
					return newResponse;
				} catch {
					const response2 = mergeResponses(new Response(null, { status }), originalResponse);
					prepareResponse(response2, resolvedRenderOptions);
					return response2;
				}
			}
			const mod = await app.pipeline.getComponentByRoute(errorRouteData);
			const errorState = new FetchState(app.pipeline, request);
			errorState.skipMiddleware = skipMiddleware;
			errorState.clientAddress = resolvedRenderOptions.clientAddress;
			errorState.routeData = errorRouteData;
			errorState.pathname = resolvedPathname;
			errorState.status = status;
			errorState.componentInstance = mod;
			errorState.locals = resolvedRenderOptions.locals ?? {};
			errorState.initialProps = { error };
			try {
				await provideSession(errorState);
				const response2 = await this.#astroMiddleware.handle(errorState, this.#pagesHandler.handle.bind(this.#pagesHandler));
				if (rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, errorState.routeData, response2)) return this.renderError(request, {
					...resolvedRenderOptions,
					status,
					error,
					response: originalResponse,
					skipMiddleware: true,
					pathname: resolvedPathname
				});
				const newResponse = mergeResponses(response2, originalResponse);
				prepareResponse(newResponse, resolvedRenderOptions);
				return newResponse;
			} catch {
				if (skipMiddleware === false) return this.renderError(request, {
					...resolvedRenderOptions,
					status,
					error,
					response: originalResponse,
					skipMiddleware: true,
					pathname: resolvedPathname
				});
			} finally {
				await errorState.finalizeAll();
			}
		}
		const response = mergeResponses(new Response(null, { status }), originalResponse);
		prepareResponse(response, resolvedRenderOptions);
		return response;
	}
};
function mergeResponses(newResponse, originalResponse, override) {
	let newResponseHeaders = newResponse.headers;
	if (override?.removeContentEncodingHeaders) {
		newResponseHeaders = new Headers(newResponseHeaders);
		newResponseHeaders.delete("Content-Encoding");
		newResponseHeaders.delete("Content-Length");
	}
	if (!originalResponse) {
		if (override !== void 0) return new Response(newResponse.body, {
			status: override.status,
			statusText: newResponse.statusText,
			headers: newResponseHeaders
		});
		return newResponse;
	}
	const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
	try {
		originalResponse.headers.delete("Content-type");
		originalResponse.headers.delete("Content-Length");
		originalResponse.headers.delete("Transfer-Encoding");
	} catch {}
	const newHeaders = new Headers();
	const seen = /* @__PURE__ */ new Set();
	for (const [name, value] of originalResponse.headers) {
		newHeaders.append(name, value);
		seen.add(name.toLowerCase());
	}
	for (const [name, value] of newResponseHeaders) {
		const lower = name.toLowerCase();
		if (!seen.has(lower) || lower === "set-cookie") newHeaders.append(name, value);
	}
	const mergedResponse = new Response(newResponse.body, {
		status,
		statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
		headers: newHeaders
	});
	const originalCookies = getCookiesFromResponse(originalResponse);
	const newCookies = getCookiesFromResponse(newResponse);
	if (originalCookies) {
		if (newCookies) originalCookies.merge(newCookies);
		attachCookiesToResponse(mergedResponse, originalCookies);
	} else if (newCookies) attachCookiesToResponse(mergedResponse, newCookies);
	return mergedResponse;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/app/base.js
var BaseApp = class BaseApp {
	manifest;
	manifestData;
	pipeline;
	#adapterLogger;
	baseWithoutTrailingSlash;
	/**
	* The handler that turns incoming `Request` objects into `Response`s.
	* Defaults to a `DefaultFetchHandler` pinned to this app and can be
	* overridden via `setFetchHandler` — typically by the bundled
	* entrypoint after importing `virtual:astro:fetchable`.
	*/
	#fetchHandler;
	#errorHandler;
	/**
	* Whether a custom fetch handler (from `src/fetch.ts`) has been set
	* via `setFetchHandler`. When false, the `DefaultFetchHandler` is
	* in use and all features are implicitly active.
	*/
	#hasCustomFetchHandler = false;
	/**
	* Whether the missing-feature check has already run. We only want
	* to warn once — after the first request in dev, or at build end.
	*/
	#featureCheckDone = false;
	get logger() {
		return this.pipeline.logger;
	}
	get adapterLogger() {
		const currentOptions = this.logger.options;
		if (!this.#adapterLogger || this.#adapterLogger.options !== currentOptions) this.#adapterLogger = new AstroIntegrationLogger(currentOptions, this.manifest.adapterName);
		return this.#adapterLogger;
	}
	constructor(manifest, streaming = true, ...args) {
		this.manifest = manifest;
		this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest.base);
		this.pipeline = this.createPipeline(streaming, manifest, ...args);
		this.manifestData = this.pipeline.manifestData;
		this.#fetchHandler = new DefaultFetchHandler(this);
		this.#errorHandler = this.createErrorHandler();
	}
	/**
	* Override the fetch handler used to dispatch requests. Entrypoints
	* call this with the default export of `virtual:astro:fetchable` to
	* plug in a user-authored handler from `src/fetch.ts`.
	*/
	setFetchHandler(handler) {
		this.#fetchHandler = handler;
		this.#hasCustomFetchHandler = !(handler instanceof DefaultFetchHandler);
	}
	/**
	* Returns the error handler strategy used by this app. Override to
	* provide environment-specific behavior (dev overlay, build-time throws, etc.).
	*/
	createErrorHandler() {
		return new DefaultErrorHandler(this);
	}
	/**
	* Resets the cached adapter logger so it picks up a new logger instance.
	* Used by BuildApp when the logger is replaced via setOptions().
	*/
	resetAdapterLogger() {
		this.#adapterLogger = void 0;
	}
	getAllowedDomains() {
		return this.manifest.allowedDomains;
	}
	matchesAllowedDomains(forwardedHost, protocol) {
		return BaseApp.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
	}
	static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
		if (!allowedDomains || allowedDomains.length === 0) return false;
		try {
			const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
			return allowedDomains.some((pattern) => {
				return matchPattern(testUrl, pattern);
			});
		} catch {
			return false;
		}
	}
	set setManifestData(newManifestData) {
		this.manifestData = newManifestData;
		this.pipeline.manifestData = newManifestData;
		this.pipeline.rebuildRouter();
	}
	removeBase(pathname) {
		pathname = collapseDuplicateLeadingSlashes(pathname);
		if (pathname.startsWith(this.manifest.base)) return pathname.slice(this.baseWithoutTrailingSlash.length + 1);
		return pathname;
	}
	/**
	* Decodes a pathname with `decodeURI`, falling back to the raw pathname when it
	* contains an invalid percent-sequence (e.g. `%C0%AF`, an overlong-UTF-8 encoding of
	* `/` commonly sent by path-traversal scanners). A raw `decodeURI()` would throw
	* `URIError: URI malformed`, and because `match()` runs before `render()` that error
	* escapes the adapter's request handler as an uncaught exception (HTTP 500) that user
	* middleware can't catch.
	*/
	safeDecodeURI(pathname) {
		try {
			return decodeURI(pathname);
		} catch (e) {
			this.adapterLogger.debug(e.toString());
			return pathname;
		}
	}
	/**
	* Extracts the base-stripped, decoded pathname from a request.
	* Used by adapters to compute the pathname for dev-mode route matching.
	*/
	getPathnameFromRequest(request) {
		const url = new URL(request.url);
		const pathname = prependForwardSlash(this.removeBase(url.pathname));
		return this.safeDecodeURI(pathname);
	}
	/**
	* Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
	* routes aren't returned, even if they are matched.
	*
	* When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
	* @param request
	* @param allowPrerenderedRoutes
	*/
	match(request, allowPrerenderedRoutes = false) {
		const url = new URL(request.url);
		if (this.manifest.assets.has(url.pathname)) return void 0;
		let pathname = this.computePathnameFromDomain(request);
		if (!pathname) pathname = prependForwardSlash(this.removeBase(url.pathname));
		const routeData = this.pipeline.matchRoute(this.safeDecodeURI(pathname));
		if (!routeData) return void 0;
		if (allowPrerenderedRoutes) return routeData;
		if (routeData.prerender) {
			if (routeData.params.length > 0) return this.pipeline.matchAllRoutes(this.safeDecodeURI(pathname)).find((r) => !r.prerender);
			return;
		}
		return routeData;
	}
	/**
	* A matching route function to use in the development server.
	* Contrary to the `.match` function, this function resolves props and params, returning the correct
	* route based on the priority, segments. It also returns the correct, resolved pathname.
	* @param pathname
	*/
	devMatch(pathname) {}
	computePathnameFromDomain(request) {
		return computePathnameFromDomain(request, new URL(request.url), this.manifest.i18n, this.manifest.base, this.manifest.trailingSlash, this.logger);
	}
	async render(request, { addCookieHeader = false, clientAddress = Reflect.get(request, clientAddressSymbol), locals, prerenderedErrorPageFetch = fetch, routeData, waitUntil } = {}) {
		await this.pipeline.getLogger();
		if (routeData) {
			this.logger.debug("router", "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ", request.url);
			this.logger.debug("router", "RouteData");
			this.logger.debug("router", routeData);
		}
		if (locals) {
			if (typeof locals !== "object") {
				const error = new AstroError(LocalsNotAnObject);
				this.logger.error(null, error.stack);
				return this.renderError(request, {
					addCookieHeader,
					clientAddress,
					prerenderedErrorPageFetch,
					locals: void 0,
					routeData,
					waitUntil,
					status: 500,
					error
				});
			}
		}
		if (!routeData) {
			const domainPathname = this.computePathnameFromDomain(request);
			if (domainPathname) routeData = this.pipeline.matchRoute(this.safeDecodeURI(domainPathname));
		}
		const resolvedOptions = {
			addCookieHeader,
			clientAddress,
			prerenderedErrorPageFetch,
			locals,
			routeData,
			waitUntil
		};
		let response;
		if (this.#fetchHandler instanceof DefaultFetchHandler) {
			Reflect.set(request, appSymbol, this);
			response = await this.#fetchHandler.renderWithOptions(request, resolvedOptions);
		} else {
			setRenderOptions(request, resolvedOptions);
			Reflect.set(request, appSymbol, this);
			response = await this.#fetchHandler.fetch(request);
		}
		this.#warnMissingFeatures();
		if (response.headers.get("X-Astro-Error")) {
			response.headers.delete(ASTRO_ERROR_HEADER);
			return this.renderError(request, {
				addCookieHeader,
				clientAddress,
				prerenderedErrorPageFetch,
				locals,
				routeData,
				waitUntil,
				response,
				status: response.status,
				error: response.status === 500 ? null : void 0
			});
		}
		return response;
	}
	setCookieHeaders(response) {
		return getSetCookiesFromResponse(response);
	}
	/**
	* Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
	* For example,
	* ```ts
	* for (const cookie_ of App.getSetCookieFromResponse(response)) {
	*     const cookie: string = cookie_
	* }
	* ```
	* @param response The response to read cookies from.
	* @returns An iterator that yields key-value pairs as equal-sign-separated strings.
	*/
	static getSetCookieFromResponse = getSetCookiesFromResponse;
	/**
	* If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
	* This also handles pre-rendered /404 or /500 routes.
	*
	* Delegates to the app's configured `ErrorHandler`. To customize behavior
	* for a specific environment, override `createErrorHandler()` rather than
	* this method.
	*/
	async renderError(request, options) {
		return this.#errorHandler.renderError(request, options);
	}
	/**
	* One-shot check: after the first request with a custom `src/fetch.ts`,
	* compare `usedFeatures` against the manifest and warn about any
	* configured features the user's pipeline doesn't call.
	*/
	#warnMissingFeatures() {
		if (this.#featureCheckDone || !this.#hasCustomFetchHandler) return;
		this.#featureCheckDone = true;
		const manifest = this.manifest;
		const missing = [];
		const used = this.pipeline.usedFeatures;
		if (manifest.routes.some((r) => r.routeData.type === "redirect") && !(used & PipelineFeatures.redirects)) missing.push("redirects");
		if (manifest.sessionConfig && !(used & PipelineFeatures.sessions)) missing.push("sessions");
		if (manifest.actions && !(used & PipelineFeatures.actions)) missing.push("actions");
		if (manifest.middleware && !(used & PipelineFeatures.middleware)) missing.push("middleware");
		if (manifest.i18n && manifest.i18n.strategy !== "manual" && !(used & PipelineFeatures.i18n)) missing.push("i18n");
		if (manifest.cacheConfig && !(used & PipelineFeatures.cache)) missing.push("cache");
		for (const feature of missing) this.logger.warn("router", `Your project uses ${feature}, but your custom src/fetch.ts does not call the ${feature}() handler. This feature will not work unless you add it to your fetch.ts pipeline.`);
	}
	getDefaultStatusCode(routeData, pathname) {
		if (!routeData.pattern.test(pathname)) {
			for (const fallbackRoute of routeData.fallbackRoutes) if (fallbackRoute.pattern.test(pathname)) return 302;
		}
		const route = removeTrailingForwardSlash(routeData.route);
		const locales = this.manifest.i18n?.locales;
		if (isRoute404(route) || isLocalizedErrorRoute(route, 404, locales)) return 404;
		if (isRoute500(route) || isLocalizedErrorRoute(route, 500, locales)) return 500;
		return 200;
	}
	getManifest() {
		return this.pipeline.manifest;
	}
	logThisRequest({ pathname, method, statusCode, isRewrite, timeStart }) {
		const timeEnd = performance.now();
		this.logRequest({
			pathname,
			method,
			statusCode,
			isRewrite,
			reqTime: timeEnd - timeStart
		});
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/assets/utils/getAssetsPrefix.js
function getAssetsPrefix(fileExtension, assetsPrefix) {
	let prefix = "";
	if (!assetsPrefix) prefix = "";
	else if (typeof assetsPrefix === "string") prefix = assetsPrefix;
	else prefix = assetsPrefix[fileExtension.slice(1)] || assetsPrefix.fallback;
	return prefix;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/render/ssr-element.js
var URL_PARSE_BASE = "https://astro.build";
function splitAssetPath(path) {
	const parsed = new URL(path, URL_PARSE_BASE);
	return {
		pathname: !URL.canParse(path) && !path.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname,
		suffix: `${parsed.search}${parsed.hash}`
	};
}
function appendQueryParams(path, queryParams) {
	const queryString = queryParams.toString();
	if (!queryString) return path;
	const hashIndex = path.indexOf("#");
	const basePath = hashIndex === -1 ? path : path.slice(0, hashIndex);
	const hash = hashIndex === -1 ? "" : path.slice(hashIndex);
	return `${basePath}${basePath.includes("?") ? "&" : "?"}${queryString}${hash}`;
}
function createAssetLink(href, base, assetsPrefix, queryParams) {
	const { pathname, suffix } = splitAssetPath(href);
	let url = "";
	if (assetsPrefix) {
		const pf = getAssetsPrefix(fileExtension(pathname), assetsPrefix);
		url = joinPaths(pf, slash(pathname)) + suffix;
	} else if (base) url = prependForwardSlash(joinPaths(base, slash(pathname))) + suffix;
	else url = href;
	if (queryParams) url = appendQueryParams(url, queryParams);
	return url;
}
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
	if (stylesheet.type === "inline") return {
		props: {},
		children: stylesheet.content
	};
	else return {
		props: {
			rel: "stylesheet",
			href: createAssetLink(stylesheet.src, base, assetsPrefix, queryParams)
		},
		children: ""
	};
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
	return new Set(stylesheets.map((s) => createStylesheetElement(s, base, assetsPrefix, queryParams)));
}
function createModuleScriptElement(script, base, assetsPrefix, queryParams) {
	if (script.type === "external") return createModuleScriptElementWithSrc(script.value, base, assetsPrefix, queryParams);
	else return {
		props: { type: "module" },
		children: script.value
	};
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix, queryParams) {
	return {
		props: {
			type: "module",
			src: createAssetLink(src, base, assetsPrefix, queryParams)
		},
		children: ""
	};
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/logger/public.js
function matchesLevel(messageLevel, configuredLevel) {
	return levels[messageLevel] >= levels[configuredLevel];
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/logger/impls/console.js
function consoleLogDestination(config = {}) {
	const { level = "info" } = config;
	return { write(event) {
		let dest = console.error;
		if (levels[event.level] < levels["error"]) dest = console.info;
		if (!matchesLevel(event.level, level)) return;
		if (event.label === "SKIP_FORMAT") dest(event.message);
		else dest(getEventPrefix(event) + " " + event.message);
	} };
}
function createConsoleLogger({ level }) {
	return new AstroLogger({
		level,
		destination: consoleLogDestination()
	});
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/app/pipeline.js
var AppPipeline = class AppPipeline extends Pipeline {
	getName() {
		return "AppPipeline";
	}
	static create({ manifest, streaming }) {
		const resolve = async function resolve2(specifier) {
			if (!(specifier in manifest.entryModules)) throw new Error(`Unable to resolve [${specifier}]`);
			const bundlePath = manifest.entryModules[specifier];
			if (bundlePath.startsWith("data:") || bundlePath.length === 0) return bundlePath;
			else return createAssetLink(bundlePath, manifest.base, manifest.assetsPrefix);
		};
		const logger = createConsoleLogger({ level: manifest.logLevel });
		return new AppPipeline(logger, manifest, "production", manifest.renderers, resolve, streaming, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
	}
	async headElements(routeData) {
		const { assetsPrefix, base } = this.manifest;
		const routeInfo = this.manifest.routes.find((route) => route.routeData.route === routeData.route);
		const links = /* @__PURE__ */ new Set();
		const scripts = /* @__PURE__ */ new Set();
		const styles = createStylesheetElementSet(routeInfo?.styles ?? [], base, assetsPrefix);
		for (const script of routeInfo?.scripts ?? []) if ("stage" in script) {
			if (script.stage === "head-inline") scripts.add({
				props: {},
				children: script.children
			});
		} else scripts.add(createModuleScriptElement(script, base, assetsPrefix));
		return {
			links,
			styles,
			scripts
		};
	}
	componentMetadata() {}
	async getComponentByRoute(routeData) {
		return (await this.getModuleForRoute(routeData)).page();
	}
	async getModuleForRoute(route) {
		for (const defaultRoute of this.defaultRoutes) if (route.component === defaultRoute.component) return { page: () => Promise.resolve(defaultRoute.instance) };
		let routeToProcess = route;
		if (routeIsRedirect(route)) {
			if (route.redirectRoute) routeToProcess = route.redirectRoute;
			else return RedirectSinglePageBuiltModule;
		} else if (routeIsFallback(route)) routeToProcess = getFallbackRoute(route, this.manifest.routes);
		if (this.manifest.pageMap) {
			const importComponentInstance = this.manifest.pageMap.get(routeToProcess.component);
			if (!importComponentInstance) throw new Error(`Unexpectedly unable to find a component instance for route ${route.route}`);
			return await importComponentInstance();
		} else if (this.manifest.pageModule) return this.manifest.pageModule;
		throw new Error("Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue.");
	}
	async tryRewrite(payload, request) {
		const { newUrl, pathname, routeData } = findRouteToRewrite({
			payload,
			request,
			routes: this.manifest?.routes.map((r) => r.routeData),
			trailingSlash: this.manifest.trailingSlash,
			buildFormat: this.manifest.buildFormat,
			base: this.manifest.base,
			outDir: this.manifest?.serverLike ? this.manifest.buildClientDir : this.manifest.outDir
		});
		return {
			newUrl,
			pathname,
			componentInstance: await this.getComponentByRoute(routeData),
			routeData
		};
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/app/app.js
var App = class extends BaseApp {
	createPipeline(streaming) {
		return AppPipeline.create({
			manifest: this.manifest,
			streaming
		});
	}
	isDev() {
		return false;
	}
	logRequest(_options) {}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/app/manifest.js
function deserializeManifest(serializedManifest, routesList) {
	const routes = [];
	if (serializedManifest.routes) for (const serializedRoute of serializedManifest.routes) {
		routes.push({
			...serializedRoute,
			routeData: deserializeRouteData(serializedRoute.routeData)
		});
		const route = serializedRoute;
		route.routeData = deserializeRouteData(serializedRoute.routeData);
	}
	if (routesList) for (const route of routesList?.routes) routes.push({
		file: "",
		links: [],
		scripts: [],
		styles: [],
		routeData: route
	});
	const assets = new Set(serializedManifest.assets);
	const componentMetadata = new Map(serializedManifest.componentMetadata);
	const inlinedScripts = new Map(serializedManifest.inlinedScripts);
	const clientDirectives = new Map(serializedManifest.clientDirectives);
	const key = decodeKey(serializedManifest.key);
	return {
		middleware() {
			return { onRequest: NOOP_MIDDLEWARE_FN };
		},
		...serializedManifest,
		rootDir: new URL(serializedManifest.rootDir),
		srcDir: new URL(serializedManifest.srcDir),
		publicDir: new URL(serializedManifest.publicDir),
		outDir: new URL(serializedManifest.outDir),
		cacheDir: new URL(serializedManifest.cacheDir),
		buildClientDir: new URL(serializedManifest.buildClientDir),
		buildServerDir: new URL(serializedManifest.buildServerDir),
		assets,
		componentMetadata,
		inlinedScripts,
		clientDirectives,
		routes,
		key
	};
}
function deserializeRouteData(rawRouteData) {
	return {
		route: rawRouteData.route,
		type: rawRouteData.type,
		pattern: new RegExp(rawRouteData.pattern),
		params: rawRouteData.params,
		component: rawRouteData.component,
		pathname: rawRouteData.pathname || void 0,
		segments: rawRouteData.segments,
		prerender: rawRouteData.prerender,
		redirect: rawRouteData.redirect,
		redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
		fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
			return deserializeRouteData(fallback);
		}),
		isIndex: rawRouteData.isIndex,
		origin: rawRouteData.origin,
		distURL: rawRouteData.distURL
	};
}
function deserializeRouteInfo(rawRouteInfo) {
	return {
		styles: rawRouteInfo.styles,
		file: rawRouteInfo.file,
		links: rawRouteInfo.links,
		scripts: rawRouteInfo.scripts,
		routeData: deserializeRouteData(rawRouteInfo.routeData)
	};
}
//#endregion
//#region \0astro:react:opts
var _astro_react_opts_default = {
	include: void 0,
	exclude: void 0,
	experimentalReactChildren: false,
	experimentalDisableStreaming: false
};
//#endregion
//#region node_modules/.pnpm/@astrojs+react@6.0.2_@types+react-dom@19.2.4_@types+react@19.2.18__@types+react@19.2.18_0a6bd5c2743499b29f74b72f036bb2eb/node_modules/@astrojs/react/dist/context.js
var contexts = /* @__PURE__ */ new WeakMap();
var ID_PREFIX = "r";
function getContext(rendererContextResult) {
	if (contexts.has(rendererContextResult)) return contexts.get(rendererContextResult);
	const ctx = {
		currentIndex: 0,
		get id() {
			return ID_PREFIX + this.currentIndex.toString();
		}
	};
	contexts.set(rendererContextResult, ctx);
	return ctx;
}
function incrementId(rendererContextResult) {
	const ctx = getContext(rendererContextResult);
	const id = ctx.id;
	ctx.currentIndex++;
	return id;
}
//#endregion
//#region node_modules/.pnpm/@astrojs+react@6.0.2_@types+react-dom@19.2.4_@types+react@19.2.18__@types+react@19.2.18_0a6bd5c2743499b29f74b72f036bb2eb/node_modules/@astrojs/react/dist/static-html.js
var StaticHtml = ({ value, name, hydrate = true }) => {
	if (value == null || value.trim() === "") return null;
	return createElement(hydrate ? "astro-slot" : "astro-static-slot", {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value }
	});
};
var static_html_default = memo(StaticHtml, () => true);
//#endregion
//#region node_modules/.pnpm/@astrojs+internal-helpers@0.10.2/node_modules/@astrojs/internal-helpers/dist/create-filter.js
var import_picomatch = /* @__PURE__ */ __toESM(require_picomatch(), 1);
function ensureArray(thing) {
	if (Array.isArray(thing)) return thing;
	if (thing == null) return [];
	return [thing];
}
function toMatcher(pattern) {
	if (pattern instanceof RegExp) return pattern;
	const normalized = slash(pattern);
	const fn = (0, import_picomatch.default)(normalized, { dot: true });
	return { test: (what) => fn(what) };
}
function createFilter(include, exclude) {
	const includeMatchers = ensureArray(include).map(toMatcher);
	const excludeMatchers = ensureArray(exclude).map(toMatcher);
	if (!includeMatchers.length && !excludeMatchers.length) return (id) => typeof id === "string" && !id.includes("\0");
	return function(id) {
		if (typeof id !== "string") return false;
		if (id.includes("\0")) return false;
		const pathId = slash(id);
		for (const matcher of excludeMatchers) {
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return false;
		}
		for (const matcher of includeMatchers) {
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return true;
		}
		return !includeMatchers.length;
	};
}
//#endregion
//#region node_modules/.pnpm/@astrojs+react@6.0.2_@types+react-dom@19.2.4_@types+react@19.2.18__@types+react@19.2.18_0a6bd5c2743499b29f74b72f036bb2eb/node_modules/@astrojs/react/dist/server.js
var slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
var reactTypeof = /* @__PURE__ */ Symbol.for("react.element");
var reactTransitionalTypeof = /* @__PURE__ */ Symbol.for("react.transitional.element");
var filter = _astro_react_opts_default?.include || _astro_react_opts_default?.exclude ? createFilter(_astro_react_opts_default.include, _astro_react_opts_default.exclude) : null;
async function check(Component, props, children, metadata) {
	if (typeof Component === "object") return Component["$$typeof"].toString().slice(7).startsWith("react");
	if (typeof Component !== "function") return false;
	if (Component.name === "QwikComponent") return false;
	if (typeof Component === "function" && Component["$$typeof"] === /* @__PURE__ */ Symbol.for("react.forward_ref")) return false;
	if (Component.prototype != null && typeof Component.prototype.render === "function") return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	if (filter && metadata?.componentUrl && !filter(metadata.componentUrl)) return false;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && (vnode["$$typeof"] === reactTypeof || vnode["$$typeof"] === reactTransitionalTypeof)) isReactComponent = true;
		} catch {}
		return React.createElement("div");
	}
	await renderToStaticMarkup.call(this, Tester, props, children);
	return isReactComponent;
}
async function getNodeWritable() {
	let { Writable } = await import(
		/* @vite-ignore */
		"node:stream"
);
	return Writable;
}
function needsHydration(metadata) {
	return metadata?.astroStaticSlot ? !!metadata.hydrate : true;
}
async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
	let prefix;
	if (this && this.result) prefix = incrementId(this.result);
	const attrs = { prefix };
	delete props["class"];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName(key);
		slots[name] = React.createElement(static_html_default, {
			hydrate: needsHydration(metadata),
			value,
			name
		});
	}
	const newProps = {
		...props,
		...slots
	};
	const newChildren = children ?? props.children;
	if (children && _astro_react_opts_default.experimentalReactChildren) {
		attrs["data-react-children"] = true;
		newProps.children = (await import("./chunks/vnode-children_QW6tUGCY.mjs").then((mod) => mod.default))(children);
	} else if (newChildren != null) newProps.children = React.createElement(static_html_default, {
		hydrate: needsHydration(metadata),
		value: newChildren
	});
	const formState = this ? await getFormState(this) : void 0;
	if (formState) {
		attrs["data-action-result"] = JSON.stringify(formState[0]);
		attrs["data-action-key"] = formState[1];
		attrs["data-action-name"] = formState[2];
	}
	const vnode = React.createElement(Component, newProps);
	const renderOptions = {
		identifierPrefix: prefix,
		formState
	};
	let html;
	if (_astro_react_opts_default.experimentalDisableStreaming) html = ReactDOM.renderToString(vnode);
	else if ("renderToReadableStream" in ReactDOM) html = await renderToReadableStreamAsync(vnode, renderOptions);
	else html = await renderToPipeableStreamAsync(vnode, renderOptions);
	html = html.replace(/<link\s[^>]*rel="(?:preload|modulepreload|stylesheet|preconnect|dns-prefetch)"[^>]*>/g, "");
	return {
		html,
		attrs
	};
}
async function getFormState({ result }) {
	const { request, actionResult } = result;
	if (!actionResult) return void 0;
	if (!isFormRequest(request.headers.get("content-type"))) return void 0;
	const { searchParams } = new URL(request.url);
	const actionKey = (await request.clone().formData()).get("$ACTION_KEY")?.toString();
	const actionName = searchParams.get("_action");
	if (!actionKey || !actionName) return void 0;
	return [
		actionResult,
		actionKey,
		actionName
	];
}
async function renderToPipeableStreamAsync(vnode, options) {
	const Writable = await getNodeWritable();
	let html = "";
	return new Promise((resolve, reject) => {
		let error = void 0;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			...options,
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(new Writable({
					write(chunk, _encoding, callback) {
						html += chunk.toString("utf-8");
						callback();
					},
					destroy() {
						resolve(html);
					}
				}));
			}
		});
	});
}
async function readResult(stream) {
	const reader = stream.getReader();
	let result = "";
	const decoder = new TextDecoder("utf-8");
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) result += decoder.decode(value);
			else decoder.decode(/* @__PURE__ */ new Uint8Array());
			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}
async function renderToReadableStreamAsync(vnode, options) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode, options));
}
var formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function isFormRequest(contentType) {
	const type = contentType?.split(";")[0].toLowerCase();
	return formContentTypes.some((t) => type === t);
}
//#endregion
//#region \0virtual:astro:renderers
var renderers = [Object.assign({
	"name": "@astrojs/react",
	"clientEntrypoint": "@astrojs/react/client.js",
	"serverEntrypoint": "@astrojs/react/server.js"
}, { ssr: {
	name: "@astrojs/react",
	check,
	renderToStaticMarkup,
	supportsAstroStaticSlot: true
} })];
[
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "page",
			"component": "_server-islands.astro",
			"params": ["name"],
			"segments": [[{
				"content": "_server-islands",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "name",
				"dynamic": true,
				"spread": false
			}]],
			"pattern": "^\\/_server-islands\\/([^/]+?)\\/?$",
			"prerender": false,
			"isIndex": false,
			"fallbackRoutes": [],
			"route": "/_server-islands/[name]",
			"origin": "internal",
			"distURL": [],
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/_image",
			"component": "node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/assets/endpoint/generic.js",
			"params": [],
			"pathname": "/_image",
			"pattern": "^\\/_image\\/?$",
			"segments": [[{
				"content": "_image",
				"dynamic": false,
				"spread": false
			}]],
			"type": "endpoint",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"isIndex": false,
			"origin": "internal",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/auth/callback",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/auth\\/callback\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "callback",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/auth/callback.ts",
			"pathname": "/api/auth/callback",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/auth/login",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/auth\\/login\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "login",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/auth/login.ts",
			"pathname": "/api/auth/login",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/api/keystatic/[...params]",
			"pattern": "^\\/api\\/keystatic(?:\\/(.*?))?\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "keystatic",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "...params",
					"dynamic": true,
					"spread": true
				}]
			],
			"params": ["...params"],
			"component": "node_modules/.pnpm/@keystatic+astro@5.2.0_@keystatic+core@0.6.5_@keystar+ui@0.9.3_react-aria@3.50.0_react-_ce0a16a3799dced6de938214e0b0c4dd/node_modules/@keystatic/astro/internal/keystatic-api.js",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/save-constellation",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/save-constellation\\/?$",
			"segments": [[{
				"content": "api",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "save-constellation",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/api/save-constellation.ts",
			"pathname": "/api/save-constellation",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/editor",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/editor\\/?$",
			"segments": [[{
				"content": "editor",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/editor.astro",
			"pathname": "/editor",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "page",
			"isIndex": false,
			"route": "/keystatic/[...params]",
			"pattern": "^\\/keystatic(?:\\/(.*?))?\\/?$",
			"segments": [[{
				"content": "keystatic",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "...params",
				"dynamic": true,
				"spread": true
			}]],
			"params": ["...params"],
			"component": "node_modules/.pnpm/@keystatic+astro@5.2.0_@keystatic+core@0.6.5_@keystar+ui@0.9.3_react-aria@3.50.0_react-_ce0a16a3799dced6de938214e0b0c4dd/node_modules/@keystatic/astro/internal/keystatic-astro-page.astro",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	}
].map(deserializeRouteInfo);
//#endregion
//#region \0virtual:astro:pages
var _page0 = () => import("./chunks/generic_DxT5l9AU.mjs");
var _page1 = () => import("./chunks/callback_DxUYRohy.mjs");
var _page2 = () => import("./chunks/login_U78ii22r.mjs");
var _page3 = () => import("./chunks/keystatic-api_FKbOGCCH.mjs");
var _page4 = () => import("./chunks/save-constellation_nQx-vlHu.mjs");
var _page5 = () => import("./chunks/editor_BiX-ZQP2.mjs");
var _page6 = () => import("./chunks/keystatic-astro-page_KHRJ_e-x.mjs");
var pageMap = /* @__PURE__ */ new Map([
	["node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
	["src/pages/api/auth/callback.ts", _page1],
	["src/pages/api/auth/login.ts", _page2],
	["node_modules/.pnpm/@keystatic+astro@5.2.0_@keystatic+core@0.6.5_@keystar+ui@0.9.3_react-aria@3.50.0_react-_ce0a16a3799dced6de938214e0b0c4dd/node_modules/@keystatic/astro/internal/keystatic-api.js", _page3],
	["src/pages/api/save-constellation.ts", _page4],
	["src/pages/editor.astro", _page5],
	["node_modules/.pnpm/@keystatic+astro@5.2.0_@keystatic+core@0.6.5_@keystar+ui@0.9.3_react-aria@3.50.0_react-_ce0a16a3799dced6de938214e0b0c4dd/node_modules/@keystatic/astro/internal/keystatic-astro-page.astro", _page6]
]);
//#endregion
//#region \0virtual:astro:manifest
var _manifest = deserializeManifest({"rootDir":"file:///Users/ryansickle/dev/personal/tiny-lore/","cacheDir":"file:///Users/ryansickle/dev/personal/tiny-lore/node_modules/.astro/","outDir":"file:///Users/ryansickle/dev/personal/tiny-lore/dist/","srcDir":"file:///Users/ryansickle/dev/personal/tiny-lore/src/","publicDir":"file:///Users/ryansickle/dev/personal/tiny-lore/public/","buildClientDir":"file:///Users/ryansickle/dev/personal/tiny-lore/dist/client/","buildServerDir":"file:///Users/ryansickle/dev/personal/tiny-lore/dist/server/","adapterName":"@astrojs/vercel","assetsDir":"_astro","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","distURL":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/_image","component":"node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/assets/endpoint/generic.js","params":[],"pathname":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"type":"endpoint","prerender":false,"fallbackRoutes":[],"distURL":[],"isIndex":false,"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/callback","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/callback\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"callback","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/callback.ts","pathname":"/api/auth/callback","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/login.ts","pathname":"/api/auth/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/api/keystatic/[...params]","pattern":"^\\/api\\/keystatic(?:\\/(.*?))?\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"keystatic","dynamic":false,"spread":false}],[{"content":"...params","dynamic":true,"spread":true}]],"params":["...params"],"component":"node_modules/.pnpm/@keystatic+astro@5.2.0_@keystatic+core@0.6.5_@keystar+ui@0.9.3_react-aria@3.50.0_react-_ce0a16a3799dced6de938214e0b0c4dd/node_modules/@keystatic/astro/internal/keystatic-api.js","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/save-constellation","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/save-constellation\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"save-constellation","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/save-constellation.ts","pathname":"/api/save-constellation","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/constellations/[id]","isIndex":false,"type":"page","pattern":"^\\/constellations\\/([^/]+?)\\/?$","segments":[[{"content":"constellations","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/constellations/[id].astro","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/constellations","isIndex":true,"type":"page","pattern":"^\\/constellations\\/?$","segments":[[{"content":"constellations","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/constellations/index.astro","pathname":"/constellations","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/editor.D2VffkIO.css"}],"routeData":{"route":"/editor","isIndex":false,"type":"page","pattern":"^\\/editor\\/?$","segments":[[{"content":"editor","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/editor.astro","pathname":"/editor","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","isIndex":false,"route":"/keystatic/[...params]","pattern":"^\\/keystatic(?:\\/(.*?))?\\/?$","segments":[[{"content":"keystatic","dynamic":false,"spread":false}],[{"content":"...params","dynamic":true,"spread":true}]],"params":["...params"],"component":"node_modules/.pnpm/@keystatic+astro@5.2.0_@keystatic+core@0.6.5_@keystar+ui@0.9.3_react-aria@3.50.0_react-_ce0a16a3799dced6de938214e0b0c4dd/node_modules/@keystatic/astro/internal/keystatic-astro-page.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"serverLike":true,"middlewareMode":"classic","base":"/","trailingSlash":"ignore","compressHTML":"jsx","componentMetadata":[["/Users/ryansickle/dev/personal/tiny-lore/src/pages/constellations/[id].astro",{"propagation":"none","containsHead":true}],["/Users/ryansickle/dev/personal/tiny-lore/src/pages/constellations/index.astro",{"propagation":"none","containsHead":true}],["/Users/ryansickle/dev/personal/tiny-lore/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/ryansickle/dev/personal/tiny-lore/src/pages/editor.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"astro/entrypoints/prerender":"prerender-entry.26pUXG8U.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_DGCZHsR4.mjs","\u0000virtual:astro:page:src/pages/constellations/[id]@_@astro":"chunks/_id__DJw57f0C.mjs","\u0000noop-middleware":"virtual_astro_middleware.mjs","\u0000virtual:astro:get-image":"chunks/_virtual_astro_get-image_QsCyHjnR.mjs","\u0000virtual:astro:server-island-manifest":"chunks/_virtual_astro_server-island-manifest_C1Q2srgE.mjs","\u0000virtual:astro:session-driver":"chunks/_virtual_astro_session-driver_C-PI1Pas.mjs","/Users/ryansickle/dev/personal/tiny-lore/.astro/content-assets.mjs":"chunks/content-assets_DXqEyLLP.mjs","/Users/ryansickle/dev/personal/tiny-lore/.astro/content-modules.mjs":"chunks/content-modules_I7QRxwaA.mjs","\u0000virtual:astro:page:src/pages/constellations/index@_@astro":"chunks/index_B4NQCsHR.mjs","\u0000virtual:astro:page:src/pages/index@_@astro":"chunks/index_CPXPhU__.mjs","\u0000virtual:astro:actions/noop-entrypoint":"chunks/noop-entrypoint_Z3zFhrGC.mjs","/Users/ryansickle/dev/personal/tiny-lore/node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_X1sXK-ro.mjs","/Users/ryansickle/dev/personal/tiny-lore/node_modules/.pnpm/@astrojs+react@6.0.2_@types+react-dom@19.2.4_@types+react@19.2.18__@types+react@19.2.18_0a6bd5c2743499b29f74b72f036bb2eb/node_modules/@astrojs/react/dist/vnode-children.js":"chunks/vnode-children_QW6tUGCY.mjs","@astrojs/vercel/entrypoint":"entry.mjs","\u0000virtual:astro:page:src/pages/api/auth/callback@_@ts":"chunks/callback_DxUYRohy.mjs","\u0000virtual:astro:page:src/pages/editor@_@astro":"chunks/editor_BiX-ZQP2.mjs","\u0000virtual:astro:page:node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_DxT5l9AU.mjs","\u0000virtual:astro:page:node_modules/.pnpm/@keystatic+astro@5.2.0_@keystatic+core@0.6.5_@keystar+ui@0.9.3_react-aria@3.50.0_react-_ce0a16a3799dced6de938214e0b0c4dd/node_modules/@keystatic/astro/internal/keystatic-api@_@js":"chunks/keystatic-api_FKbOGCCH.mjs","\u0000virtual:astro:page:node_modules/.pnpm/@keystatic+astro@5.2.0_@keystatic+core@0.6.5_@keystar+ui@0.9.3_react-aria@3.50.0_react-_ce0a16a3799dced6de938214e0b0c4dd/node_modules/@keystatic/astro/internal/keystatic-astro-page@_@astro":"chunks/keystatic-astro-page_KHRJ_e-x.mjs","/Users/ryansickle/dev/personal/tiny-lore/node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js":"chunks/lib_ChdTYj-_.mjs","\u0000virtual:astro:page:src/pages/api/auth/login@_@ts":"chunks/login_U78ii22r.mjs","\u0000virtual:astro:page:src/pages/api/save-constellation@_@ts":"chunks/save-constellation_nQx-vlHu.mjs","/Users/ryansickle/dev/personal/tiny-lore/src/components/ConstellationCanvas.astro?astro&type=script&index=0&lang.ts":"_astro/ConstellationCanvas.astro_astro_type_script_index_0_lang.BOXYbvW6.js","@astrojs/react/client.js":"_astro/client.Bo99cGEz.js","/Users/ryansickle/dev/personal/tiny-lore/src/pages/editor.astro?astro&type=script&index=0&lang.ts":"_astro/editor.astro_astro_type_script_index_0_lang.B80Wryp1.js","/Users/ryansickle/dev/personal/tiny-lore/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.C5PmVpQL.js","/Users/ryansickle/dev/personal/tiny-lore/node_modules/.pnpm/@keystatic+astro@5.2.0_@keystatic+core@0.6.5_@keystar+ui@0.9.3_react-aria@3.50.0_react-_ce0a16a3799dced6de938214e0b0c4dd/node_modules/@keystatic/astro/internal/keystatic-page.js":"_astro/keystatic-page.CKNoWr07.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/ryansickle/dev/personal/tiny-lore/src/pages/index.astro?astro&type=script&index=0&lang.ts","var e=document.getElementById(`landing-stars`),t=e.getContext(`2d`),n=[];function r(){e.width=window.innerWidth*devicePixelRatio,e.height=window.innerHeight*devicePixelRatio,e.style.width=window.innerWidth+`px`,e.style.height=window.innerHeight+`px`,t.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0),i()}function i(){n=[];let e=window.innerWidth,t=window.innerHeight;for(let r=0;r<200;r++)n.push({x:Math.random()*e,y:Math.random()*t,r:Math.random()*1.3+.2,alpha:Math.random()*.5+.05,speed:Math.random()*.4+.1,phase:Math.random()*Math.PI*2})}var a=0;function o(){a+=.01;let e=window.innerWidth,r=window.innerHeight;t.clearRect(0,0,e,r);for(let e of n){let n=e.alpha*(.4+.6*Math.sin(a*e.speed+e.phase));t.beginPath(),t.arc(e.x,e.y,e.r,0,Math.PI*2),t.fillStyle=`rgba(220, 230, 255, ${n})`,t.fill()}requestAnimationFrame(o)}window.addEventListener(`resize`,r),r(),o();var s=document.querySelector(`.landing`);s.addEventListener(`click`,()=>{s.classList.add(`transitioning`);let e=s.querySelector(`.landing-content`);e.style.transition=`opacity 1.2s ease, transform 1.2s ease`,e.style.opacity=`0`,e.style.transform=`translateY(-30px)`,setTimeout(()=>{s.style.transition=`opacity 1.5s ease`,s.style.opacity=`0`},600),setTimeout(()=>{window.location.href=`/constellations`},1800)});"]],"assets":["/_astro/ConstellationCanvas.astro_astro_type_script_index_0_lang.BOXYbvW6.js","/_astro/client.Bo99cGEz.js","/_astro/editor.astro_astro_type_script_index_0_lang.B80Wryp1.js","/_astro/keystatic-page.CKNoWr07.js","/_astro/react-dom.B6JfTo_L.js","/_astro/editor.D2VffkIO.css","/constellations/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"actionBodySizeLimit":1048576,"serverIslandBodySizeLimit":1048576,"allowedDomains":[],"key":"iqq5S9uckxHi8hBKBV2q/5IjQHvDtSk0MP0+eAqdtP4=","image":{},"devToolbar":{"enabled":false,"debugInfoOutput":""},"logLevel":"info","shouldInjectCspMetaTags":false});
var manifestRoutes = _manifest.routes;
var manifest = Object.assign(_manifest, {
	renderers,
	actions: () => import("./chunks/noop-entrypoint_Z3zFhrGC.mjs"),
	middleware: () => import("./virtual_astro_middleware.mjs"),
	sessionDriver: () => import("./chunks/_virtual_astro_session-driver_C-PI1Pas.mjs"),
	serverIslandMappings: () => import("./chunks/_virtual_astro_server-island-manifest_C1Q2srgE.mjs"),
	routes: manifestRoutes,
	pageMap
});
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/app/entrypoints/virtual/prod.js
var createApp$1 = ({ streaming } = {}) => {
	const app = new App(manifest, streaming);
	app.setFetchHandler(_virtual_astro_fetchable_default);
	return app;
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.2_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@vercel+functions@3.9.3_idb-keyval@6.3.0/node_modules/astro/dist/core/app/entrypoints/virtual/index.js
var createApp = createApp$1;
//#endregion
//#region node_modules/.pnpm/@astrojs+internal-helpers@0.10.2/node_modules/@astrojs/internal-helpers/dist/request.js
function getFirstForwardedValue(multiValueHeader) {
	return multiValueHeader?.toString()?.split(",").map((e) => e.trim())?.[0];
}
var IP_RE = /^[0-9a-fA-F.:]{1,45}$/;
function isValidIpAddress(value) {
	return IP_RE.test(value);
}
function getValidatedIpFromHeader(headerValue) {
	const raw = getFirstForwardedValue(headerValue);
	if (raw && isValidIpAddress(raw)) return raw;
}
function getClientIpAddress(request) {
	return getValidatedIpFromHeader(request.headers.get("x-forwarded-for"));
}
var app = createApp();
var entrypoint_default = { async fetch(request) {
	const url = new URL(request.url);
	const hasValidMiddlewareSecret = request.headers.get(ASTRO_MIDDLEWARE_SECRET_HEADER) === middlewareSecret;
	let realPath = void 0;
	if (hasValidMiddlewareSecret) realPath = request.headers.get(ASTRO_PATH_HEADER);
	else if (url.searchParams.get("x_astro_path_token") === "b7cacb24-cd0b-4e3b-a2b2-fafd3d989ec6") realPath = url.searchParams.get(ASTRO_PATH_PARAM);
	if (typeof realPath === "string") {
		url.pathname = realPath;
		url.searchParams.delete(ASTRO_PATH_PARAM);
		url.searchParams.delete(ASTRO_PATH_TOKEN_PARAM);
		request = new Request(url.toString(), {
			method: request.method,
			headers: request.headers,
			...request.body ? {
				body: request.body,
				duplex: "half"
			} : {}
		});
	}
	const routeData = app.match(request);
	let locals = {};
	const astroLocalsHeader = request.headers.get(ASTRO_LOCALS_HEADER);
	if (astroLocalsHeader) {
		if (!hasValidMiddlewareSecret) return new Response("Forbidden", { status: 403 });
		locals = JSON.parse(astroLocalsHeader);
	}
	if (hasValidMiddlewareSecret) request.headers.delete(ASTRO_MIDDLEWARE_SECRET_HEADER);
	const response = await app.render(request, {
		routeData,
		clientAddress: getClientIpAddress(request),
		locals
	});
	if (app.setCookieHeaders) for (const setCookieHeader of app.setCookieHeaders(response)) response.headers.append("Set-Cookie", setCookieHeader);
	return response;
} };
//#endregion
export { entrypoint_default as default };
