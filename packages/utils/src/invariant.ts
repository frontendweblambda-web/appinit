export function invariant(condition: unknown, message = "Invariant failed") {
	if (!condition) {
		throw new Error(message);
	}
}
