export function getCliName(): string {
	const bin = process.argv[1] ?? "";
	const file = bin.split(/[/\\]/).pop() ?? "";
	return file.replace(/\.(js|ts|mjs|cjs)$/i, "") || "appinit";
}
