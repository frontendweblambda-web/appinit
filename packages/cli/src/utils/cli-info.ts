import pkg from "../../package.json" assert { type: "json" };
/**
 * Returns the CLI binary name.
 * Falls back to "appinit" if it cannot be determined.
 */
export function getCliName(): string {
	const binPath = process.argv[1] ?? "";
	const fileName = binPath.split(/[/\\]/).pop() ?? "";
	const name = fileName.replace(/\.(js|ts|mjs|cjs)$/i, "");
	return name || "appinit";
}

/**
 * Returns the CLI version from package.json.
 * Falls back to "0.0.0" if not found.
 */
export function getCliVersion(): string {
	return pkg?.version ?? "0.0.0";
}
