// packages/template-resolver/src/utils/mergeVfsMaps.ts

export function mergeVfsMaps(...maps: Map<string, string>[]) {
	const out = new Map<string, string>();

	for (const map of maps) {
		for (const [file, content] of map.entries()) {
			out.set(file, content);
		}
	}

	return out;
}
