import { CLICommand } from "@appinit/types";
import { kebabToCamelCase } from "@appinit/utils";
import mri from "mri";

// -------------- FLAG DEFINITIONS -------------------
const BOOLEAN_FLAGS = [
	"help",
	"version",
	"nonInteractive",
	"skipInstall",
	"skipGit",
	"skipDefaultPacks",
];
const STRING_FLAGS = ["template", "json", "projectType"];
const MULTI_FLAGS = new Set(["modules", "plugin", "authProvider"]);

export const ALIASES = {
	// Core
	help: "help",
	h: "help",
	version: "version",
	v: "version",
	json: "json",

	"non-interactive": "nonInteractive",
	"skip-install": "skipInstall",
	"skip-git": "skipGit",
	"project-type": "projectType",
} as const;

// Map normalized camelCase <-> dashed form
const NORMALIZE_MAP = {
	"non-interactive": "nonInteractive",
	"skip-install": "skipInstall",
	"skip-git": "skipGit",
	"project-type": "projectType",
	"skip-default-packs": "skipDefaultPacks",
} as const;

const DEFAULTS = {
	quiet: false,
	verbose: false,
	debug: false,
	nonInteractive: false,
	skipInstall: false,
	skipGit: false,
	json: "",
	projectType: "frontend",
	skipDefaultPacks: false,
};

export function parseFlags(argv: string[]): CLICommand {
	const args = argv.slice(2);

	const raw = mri(args, {
		boolean: BOOLEAN_FLAGS.map((k) => k.toLowerCase()),
		string: STRING_FLAGS.map((k) => k.toLowerCase()),
		default: DEFAULTS,
	});

	const commandName = String(raw._?.[0] ?? "help");
	const flags = normalizeFlags(raw);

	return { name: commandName, args: args, flags };
}

/**
 * Normalize
 * @param parsed
 * @returns
 */
function normalizeFlags(parsed: Record<string, any>) {
	const out: any = { ...DEFAULTS };

	for (const [rawKey, rawValue] of Object.entries(parsed)) {
		if (rawKey === "_" || typeof rawKey !== "string") continue;

		const canonical = getCanonicalKey(rawKey);
		if (!canonical) continue;

		// -----------------------------
		// NEGATION FLAG: --no-*
		// -----------------------------
		if (rawKey.startsWith("no-")) {
			out[canonical] = false;
			continue;
		}

		// -----------------------------
		// MULTI-FLAGS
		// -----------------------------
		if (MULTI_FLAGS.has(canonical)) {
			if (!out[canonical]) out[canonical] = [];
			const arr = Array.isArray(rawValue) ? rawValue : [rawValue];
			for (const v of arr) {
				if (v !== "" && v != null) out[canonical].push(v);
			}
			continue;
		}

		// -----------------------------
		// STANDARD ASSIGNMENT
		// -----------------------------
		out[canonical] = rawValue;
	}

	return out;
}

function getCanonicalKey(rawKey: string): string {
	if (!rawKey) return "";

	// mri lowercases and strips "--"
	rawKey = rawKey.replace(/^--?/, "").toLowerCase();

	// 1) Aliases
	if (ALIASES[rawKey as keyof typeof ALIASES])
		return ALIASES[rawKey as keyof typeof ALIASES];

	// 2) Normalize map
	if (rawKey in NORMALIZE_MAP)
		return NORMALIZE_MAP[rawKey as keyof typeof NORMALIZE_MAP];

	// 3) Convert kebab → camel
	const camel = kebabToCamelCase(rawKey);

	// 4) Only allow known flags
	if (
		camel in DEFAULTS ||
		BOOLEAN_FLAGS.includes(camel) ||
		STRING_FLAGS.includes(camel) ||
		MULTI_FLAGS.has(camel)
	) {
		return camel;
	}

	return "";
}
