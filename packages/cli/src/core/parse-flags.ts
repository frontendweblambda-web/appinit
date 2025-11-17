import { Flags } from "@appinit/types";
import mri from "mri";

export type FlagOption = Flags & {
	modules?: string | string[];
	env?: string;
	market?: boolean;
	upgrade?: string | boolean;
	cloud?: boolean;
	sync?: boolean;
	machine?: string;
	prompt?: string;
};

export type CLICommand = {
	name: string;
	args: string[];
	flags: FlagOption;
};

const booleanFlags = [
	"help",
	"version",
	"verbose",
	"quiet",
	"json",
	"debug",

	"install",
	"skip-install",
	"git",
	"no-git",
	"non-interactive",
	"auth",
	"market",

	"docker",
	"ci",
	"registry-auth",
	"cloud",
	"sync",

	"ai",
	"experimental",
	"trace",
	"dry-run",
] as const;

const alias = {
	h: "help",
	v: "version",
	f: "framework",
	t: "template",
	l: "lang",
	p: "package-manager",
	y: "non-interactive",
};

export function parseFlags(argv: string[]): CLICommand {
	const args = argv.slice(2);

	// Parse raw flags
	const parsed = mri(args, {
		boolean: booleanFlags as unknown as string[],
		alias,
	});

	// Extract command name + positional args
	const name = String(parsed._?.[0] ?? "help");
	const cmdArgs = parsed._.slice(1).map(String);

	// Transform keys: kebab-case & aliases into camelCase
	const flags = normalizeFlags(parsed);

	return {
		name,
		args: cmdArgs,
		flags,
	};
}

function normalizeFlags(parsed: Record<string, any>): FlagOption {
	const out: any = {};

	for (const [key, value] of Object.entries(parsed)) {
		if (key === "_") continue;

		// Convert kebab-case -> camelCase
		const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

		// Handle array flags for modules, plugin, etc.
		if (out[camelKey] !== undefined) {
			out[camelKey] = Array.isArray(out[camelKey])
				? [...out[camelKey], value]
				: [out[camelKey], value];
		} else {
			out[camelKey] = value;
		}
	}

	return out as FlagOption;
}
