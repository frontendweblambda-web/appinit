export const kebabToCamelCase = (name: string): string =>
	name.replace(/-([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());

export const normalizeFlagName = (name: string): string =>
	name
		.replace(/^-+/, "") // remove any number of leading hyphens
		.replace(/-([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());
