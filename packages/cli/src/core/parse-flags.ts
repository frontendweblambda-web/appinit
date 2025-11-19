import { CLICommand, FlagOption } from "@appinit/types";
import mri from "mri";

// -------------- FLAG DEFINITIONS -------------------
const BOOLEAN_FLAGS = [
	"help",
	"version",
	"verbose",
	"quiet",
	"json",
	"debug",
	"nonInteractive",
	"noConsole",
	"install",
	"skipInstall",
	"git",
	"noGit",
	"pwa",
	"i18n",
	"docker",
	"logging",
	"monitoring",
	"strict",
	"ci",
	"monitor",
	"analytics",
	"ai",
	"aiEnhance",
	"aiScaffold",
	"ignoreConfig",
	"commit",
	"market",
	"registryAuth",
	"multiTenant",
	"mfa",
];

const STRING_FLAGS = [
	"projectName",
	"targetDir",
	"projectType",
	"workspace",
	"lang",
	"architecture",
	"packageManager",
	"template",

	"framework",
	"ui",
	"routing",
	"store",
	"forms",
	"animation",
	"validation",

	"runtime",
	"backend",
	"apiStyle",
	"database",
	"orm",
	"cache",
	"queue",
	"serverless",

	"auth",

	"deployStrategy",
	"deployFrontend",
	"deployBackend",

	"formatter",
	"linter",
	"test",
	"buildTool",
	"editor",

	"features",

	"aiMode",

	"plugin",
	"removePlugin",
	"authProvider",

	"modules",

	"registry",
	"source",

	"env",
	"upgrade",
	"machine",
	"prompt",
];

const MULTI_FLAGS = new Set(["modules", "plugin", "authProvider"]);

export const ALIASES: Record<string, keyof FlagOption> = {
	// Core
	help: "help",
	h: "help",
	version: "version",
	v: "version",
	json: "json",
	verbose: "verbose",
	q: "quiet",
	quiet: "quiet",
	debug: "debug",
	d: "debug",

	"non-interactive": "nonInteractive",
	"no-console": "noConsole",
	"ignore-config": "ignoreConfig",

	// Project
	"project-name": "projectName",
	"target-dir": "targetDir",
	"project-type": "projectType",
	"package-manager": "packageManager",

	// Frontend
	pwa: "pwa",
	i18n: "i18n",

	// Backend
	docker: "docker",
	logging: "logging",
	monitoring: "monitoring",
	strict: "strict",

	// Auth
	auth: "auth",

	// Deploy
	"deploy-strategy": "deployStrategy",
	"deploy-frontend": "deployFrontend",
	"deploy-backend": "deployBackend",

	ci: "ci",
	monitor: "monitor",
	analytics: "analytics",

	// AI
	"ai-mode": "aiMode",
	"ai-enhance": "aiEnhance",
	"ai-scaffold": "aiScaffold",

	// Install / Git
	"skip-install": "skipInstall",
	"no-git": "noGit",

	// Plugins
	"remove-plugin": "removePlugin",
	"auth-provider": "authProvider",
	"multi-tenant": "multiTenant",

	// Marketplace
	"registry-auth": "registryAuth",
};

// Map normalized camelCase <-> dashed form
const NORMALIZE_MAP = {
	"non-interactive": "nonInteractive",
	"package-manager": "packageManager",
	"skip-install": "skipInstall",
	"no-console": "noConsole",
	"no-git": "noGit",
	"ai-mode": "aiMode",
	"ai-enhance": "aiEnhance",
	"ai-scaffold": "aiScaffold",
} as const;

const DEFAULTS = {
	install: true,
	git: true,
	noGit: false,
	noConsole: false,
	quiet: false,
	verbose: false,
	debug: false,
	nonInteractive: false,
	skipInstall: false,
	json: false,
	ci: false,
	market: false,
};

// ------------------ KEY NORMALIZER ------------------
function normalizeKey(key: string): string {
	key = key.replace(/^--?/, "").toLowerCase();

	if (ALIASES[key]) return ALIASES[key];
	if (NORMALIZE_MAP[key as keyof typeof NORMALIZE_MAP])
		return NORMALIZE_MAP[key as keyof typeof NORMALIZE_MAP];

	// kebab → camelCase
	return key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export function parseFlags(argv: string[]): CLICommand {
	const args = argv.slice(2);

	const raw = mri(args, {
		boolean: BOOLEAN_FLAGS.map((k) => k.toLowerCase()),
		string: STRING_FLAGS.map((k) => k.toLowerCase()),
		default: DEFAULTS,
	});

	const commandName = String(raw._?.[0] ?? "help");
	const positional = raw._.slice(1).map(String);

	const flags = normalizeFlags(raw);

	return { name: commandName, args: positional, flags };
}

function normalizeFlags(parsed: Record<string, any>): FlagOption {
	const out: any = { ...DEFAULTS };

	for (const [rawKey, rawValue] of Object.entries(parsed)) {
		if (rawKey === "_" || typeof rawKey !== "string") continue;

		// Determine canonical flag key
		const key = getCanonicalKey(rawKey);

		// ❌ Unknown / non-canonical flags MUST be ignored
		if (
			!key ||
			!(
				key in DEFAULTS ||
				STRING_FLAGS.includes(key) ||
				BOOLEAN_FLAGS.includes(key)
			)
		) {
			continue;
		}

		// -----------------------------
		// NEGATED FLAG HANDLING --no-*
		// -----------------------------
		if (rawKey.startsWith("no-") && typeof rawValue === "boolean") {
			out[key] = rawValue;
			continue;
		}

		// -----------------------------
		// MULTI-FLAG HANDLING
		// -----------------------------
		if (MULTI_FLAGS.has(key)) {
			if (!out[key]) out[key] = [];
			const arr = Array.isArray(rawValue) ? rawValue : [rawValue];
			out[key].push(...arr);
			continue;
		}

		// Standard assignment
		out[key] = rawValue;
	}

	return out as FlagOption;
}

function getCanonicalKey(rawKey: string): string {
	if (!rawKey || typeof rawKey !== "string") return "";

	// strip -- or -
	rawKey = rawKey.replace(/^--?/, "").toLowerCase();

	// 1) If rawKey is an alias → canonical
	if (ALIASES[rawKey]) {
		return ALIASES[rawKey];
	}

	// 2) If rawKey is in normalize map → canonical
	if (NORMALIZE_MAP[rawKey as keyof typeof NORMALIZE_MAP]) {
		return NORMALIZE_MAP[rawKey as keyof typeof NORMALIZE_MAP];
	}

	// 3) Convert kebab-case → camelCase
	const camel = rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

	// 4) Only accept if camelCase is a known flag
	if (
		BOOLEAN_FLAGS.includes(camel) ||
		STRING_FLAGS.includes(camel) ||
		camel in DEFAULTS ||
		MULTI_FLAGS.has(camel)
	) {
		return camel;
	}

	// 5) Otherwise → ignore the raw key
	return "";
}
