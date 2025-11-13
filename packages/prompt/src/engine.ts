import type { PromptContext, PromptResult, PromptPack } from "@appinit/types";
import { gitPack } from "./packs/git";
import { metaPack } from "./packs/meta";
import { languagePack } from "./packs/language";
import { environmentPack } from "./packs/environment";
import { frameworkPack } from "./packs/framework";
import { qualityPack } from "./packs/quality";
import { infraPack } from "./packs/infra";
import { automationPack } from "./packs/automation";
import { logger } from "@appinit/utils";

const DEFAULT_PIPELINE: PromptPack[] = [
	gitPack,
	metaPack,
	languagePack,
	environmentPack,
	frameworkPack,
	qualityPack,
	infraPack,
	automationPack,
];
export async function runPromptEngine(
	ctx: PromptContext,
	packs?: PromptPack[],
): Promise<PromptResult> {
	const pipeline = packs ?? DEFAULT_PIPELINE;
	const final: PromptResult = {};

	logger.step("Starting prompt engine...");

	for (const pack of pipeline) {
		try {
			// ✔ NEW: packs are objects → call handler()
			const res = await pack.handler(ctx, final);

			Object.assign(final, res ?? {});
		} catch (err) {
			logger.error(
				`Prompt pack "${pack.name}" failed:`,
				(err as Error).message,
			);
			throw err;
		}
	}

	logger.info("Prompt engine complete");
	return final;
}
