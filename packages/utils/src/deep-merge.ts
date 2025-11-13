export function isObject(v: unknown): v is Record<string, any> {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function deepMerge<T extends object, U extends object>(
	target: T,
	source: U,
): T & U {
	const out: any = Array.isArray(target)
		? [...(target as any)]
		: { ...(target as any) };

	for (const key of Object.keys(source) as (keyof U)[]) {
		const s = (source as any)[key];
		const t = (target as any)[key];

		if (isObject(s) && isObject(t)) {
			out[key] = deepMerge(t, s);
		} else {
			out[key] = s;
		}
	}

	return out as T & U;
}
