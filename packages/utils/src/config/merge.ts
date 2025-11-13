import { deepMerge } from "../deep-merge";

export function mergeWithDefaults<T extends object>(
	defaults: T,
	incoming?: Partial<T>,
) {
	if (!incoming) return defaults;
	return deepMerge(defaults, incoming as any) as T;
}
