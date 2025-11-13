export function parseVersion(v: string) {
	const parts = v
		.replace(/^v/, "")
		.split(".")
		.map((p) => parseInt(p, 10) || 0);
	return parts;
}

export function compareVersions(a: string, b: string) {
	const A = parseVersion(a);
	const B = parseVersion(b);
	for (let i = 0; i < 3; i++) {
		if ((A[i] || 0) > (B[i] || 0)) return 1;
		if ((A[i] || 0) < (B[i] || 0)) return -1;
	}
	return 0;
}

export function isValidVersion(v: string) {
	return /^v?\d+\.\d+\.\d+$/.test(v);
}
