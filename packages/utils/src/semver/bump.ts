import { parseVersion } from "./compare";

export function bumpVersion(v: string, kind: "major" | "minor" | "patch") {
	const parts = parseVersion(v);
	let [maj, min, pat] = parts;
	if (kind === "major") {
		maj += 1;
		min = 0;
		pat = 0;
	} else if (kind === "minor") {
		min += 1;
		pat = 0;
	} else {
		pat += 1;
	}
	return `${maj}.${min}.${pat}`;
}
