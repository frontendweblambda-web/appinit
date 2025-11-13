export async function retry<T>(
	fn: () => Promise<T>,
	times = 3,
	delay = 200,
): Promise<T> {
	let lastErr: unknown;
	for (let i = 0; i < times; i++) {
		try {
			return await fn();
		} catch (err) {
			lastErr = err;
			if (i < times - 1) await new Promise((r) => setTimeout(r, delay));
		}
	}
	throw lastErr;
}
