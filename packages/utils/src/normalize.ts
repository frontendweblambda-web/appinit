import path from "path";

export function normalizeSlashes(p: string) {
	return p.split("\\").join("/");
}

export function resolvePaths(...parts: string[]) {
	return path.posix.join(...parts.map((p) => normalizeSlashes(p)));
}
