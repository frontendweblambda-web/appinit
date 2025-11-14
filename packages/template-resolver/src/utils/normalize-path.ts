// packages/template-resolver/src/utils/normalizePath.ts

export function normalizePath(p: string) {
	return p.replace(/\\/g, "/").replace(/^\.?\//, "");
}
