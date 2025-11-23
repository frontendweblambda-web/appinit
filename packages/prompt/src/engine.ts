// @appinit/prompt/engine.ts
import type {
	AppinitConfig,
	PromptContext,
	PromptPack,
	PromptResult,
} from "@appinit/types";

import { logger, theme } from "@appinit/core";
import {
	backendPack,
	environmentPack,
	frameworkPack,
	languagePack,
	metaPack,
	previousConfigPack,
	projectTypePack,
} from "./packs";
import { architecturePack } from "./packs/architecture";
import { database } from "./packs/database";
import { frontendPack } from "./packs/frontend";

// --------------------------------------------------------
// DEFAULT PIPELINE (used only when skipDefaultPacks is false)
// --------------------------------------------------------
const DEFAULT_PIPELINE: PromptPack[] = [
	previousConfigPack, // MUST RUN FIRST
	metaPack,
	projectTypePack,
	frameworkPack,
	languagePack,
	architecturePack,
	frontendPack,
	backendPack,
	database,
	// authPack,
	environmentPack,
	// qualityPack,
	// infraPack,
	// deployPack,
	// gitPack,
];

// --------------------------------------------------------
// runPromptEngine()
// --------------------------------------------------------
export async function runPromptEngine(
	config: AppinitConfig,
	packs?: PromptPack[],
): Promise<PromptResult> {
	// intro("create-appinit-app");
	// logger.step("Starting prompt engine...");

	const promptConfig: PromptContext = {
		projectName: config.cliCommand?.args[1],
	};
	const final: PromptResult = {};

	let pipeline: PromptPack[] = [];

	// 1️⃣ Build Pipeline (Default)
	if (!config.skipDefaultPacks) pipeline = [...DEFAULT_PIPELINE];
	if (Array.isArray(packs)) pipeline = [...pipeline, ...packs];

	// Sort by priority and freeze for safety
	pipeline.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
	Object.freeze(pipeline);

	// logger.info(`📦 Pipeline Loaded (${pipeline.length} packs)`);

	// 2️⃣ Global beforeAll hook
	if (promptConfig.hooks?.beforeAll)
		await promptConfig.hooks.beforeAll(promptConfig, final);

	for (const pack of pipeline) {
		// logger.info(`➡️  Running pack: ${pack.name}`);
		try {
			// 🚫 Skip if conditional function returns false
			if (pack.condition && !(await pack.condition(promptConfig, final))) {
				logger.info(`⏭️  Skipping pack: ${pack.name}`);
				continue;
			}

			// global beforeEach
			if (promptConfig.hooks?.beforeEach)
				await promptConfig.hooks.beforeEach(pack, promptConfig, final);
			if (pack.before) await pack.before(config, promptConfig, final);

			const res = await pack.handler(config, promptConfig, final);
			// Merge pack output safely
			if (res && typeof res === "object") Object.assign(final, res);

			// pack local after
			if (pack.after) await pack.after(config, promptConfig, final);
			if (promptConfig.hooks?.afterEach)
				await promptConfig.hooks.afterEach(pack, promptConfig, final);
		} catch (err) {
			logger.error(`❌ Pack failed: "${pack.name}"`);
			logger.error(`Reason: ${(err as Error).message}`);
			throw err;
		}
	}

	// 4️⃣ Global afterAll
	if (promptConfig.hooks?.afterAll)
		await promptConfig.hooks.afterAll(promptConfig, final);

	theme.success("🎉 Prompt engine complete.");
	logger.debug("🧩 Final Answers:", final);

	// --------------------------------------------------------
	// 🔥 Resolve Template (this is the missing final step!)
	// --------------------------------------------------------

	return final;
}
