import { PromptContext, PromptPack } from "@appinit/types";

export async function loadDynamicPromptPacks(
	ctx: PromptContext,
): Promise<PromptPack[]> {
	const packs: PromptPack[] = [];

	// 1. Template-level packs
	if (ctx.templateMeta?.promptPacks) {
		for (const file of ctx.templateMeta.promptPacks) {
			const mod = await import(file);
			packs.push(mod.default ?? mod.pack);
		}
	}

	// 2. Plugin-level packs
	if (ctx.templateMeta?.plugins) {
		for (const plugin of ctx.templateMeta.plugins) {
			const mod = await import(`${plugin}/prompt-pack.js`);
			packs.push(mod.default ?? mod.pack);
		}
	}

	return packs;
}
