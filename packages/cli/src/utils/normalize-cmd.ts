export function normalizeCommand(name?: string | null) {
	if (!name) return "help";
	if (["init", "new"].includes(name)) return "create";
	return name.toLowerCase();
}
