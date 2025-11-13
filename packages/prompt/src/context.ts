import type { PromptContext } from "@appinit/types";

export function createPromptContext(
	flags: Record<string, any> = {},
	config: Record<string, any> | null = null,
	templateName?: string,
	templateMeta?: Record<string, any> | null,
	defaultName?: string,
) {
	return {
		flags,
		config,
		templateName: templateName ?? null,
		templateMeta: templateMeta ?? null,
		defaultName: defaultName ?? null,
	} as PromptContext;
}
