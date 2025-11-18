// isObject
export const isObject = (v: unknown): v is Record<string, any> =>
	v !== null && typeof v === "object" && !Array.isArray(v);

// isArray
export const isArray = (v: unknown): v is any[] => Array.isArray(v);

// camel("hello-world") → "helloWorld"
export const camel = (str: string) =>
	str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// normalizeScope("@x") → "@x"
export const normalizeScope = (v: any): string | null => {
	if (typeof v !== "string") return null;
	const cleaned = v.trim().replace(/^@/, "");
	return cleaned ? `@${cleaned}` : null;
};

// formatName
export const formatName = (name: string) =>
	String(name)
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-_]/g, "")
		.replace(/^-+|-+$/g, "");

// merge shallow
export function merge(
	target: Record<string, any>,
	source?: Record<string, any>,
) {
	if (!source) return;
	for (const key in source)
		if (target[key] === undefined) target[key] = source[key];
}
