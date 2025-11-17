// @appinit/prompt/engine.ts
import type {
	PromptContext,
	PromptResult,
	PromptPack,
	ResolvedTemplate,
	Language,
	Answers,
} from "@appinit/types";
import os from "os";
import { templateResolver } from "@appinit/template-resolver";
import { logger } from "@appinit/utils";
import {
	backendPack,
	environmentPack,
	frameworkPack,
	metaPack,
	previousConfigPack,
	projectTypePack,
} from "./packs";
import path from "path";
import { frontendPack } from "./packs/frontend";

// --------------------------------------------------------
// DEFAULT PIPELINE (used only when skipDefaultPacks is false)
// --------------------------------------------------------
const DEFAULT_PIPELINE: PromptPack[] = [
	previousConfigPack, // MUST RUN FIRST
	metaPack,
	projectTypePack,
	frameworkPack,
	frontendPack,
	environmentPack,
	backendPack,
	// languagePack,
	// uiPack,
	// backendPack,
	// infraPack,
	// qualityPack,
	// gitPack,
	// automationPack,
	// deployPack,
];

// --------------------------------------------------------
// runPromptEngine()
// --------------------------------------------------------
export async function runPromptEngine(
	ctx: PromptContext,
	packs?: PromptPack[],
): Promise<{ answers: PromptResult; template?: ResolvedTemplate }> {
	logger.step("Starting prompt engine...");

	const final: PromptResult = {};

	// 1️⃣ Load default packs unless user/template disables them
	let pipeline: PromptPack[] = [];
	if (!ctx.skipDefaultPacks) {
		pipeline = [...DEFAULT_PIPELINE];
	}

	// 2️⃣ Load dynamic packs (plugin/template/JSON-based)
	// const dynamicPacks = await loadDynamicPromptPacks(ctx);
	// if (dynamicPacks.length) {
	// 	pipeline = [...pipeline, ...dynamicPacks];
	// }

	// 3️⃣ User-supplied packs (API/CLI override) take highest priority
	if (Array.isArray(packs)) {
		pipeline = [...pipeline, ...packs];
	}

	// 4️⃣ Sort all packs by priority
	pipeline.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));

	console.log("PIPELINE", pipeline);

	// 2️⃣ Global before-all hook
	if (ctx.hooks?.beforeAll) {
		await ctx.hooks.beforeAll(ctx, final);
	}
	for (const pack of pipeline) {
		try {
			// 🚫 Skip if conditional function returns false
			if (pack.condition && !(await pack.condition(ctx, final))) {
				logger.info(`⏭️  Skipping pack: ${pack.name}`);
				continue;
			}

			logger.info(`➡️  Running pack: ${pack.name}`);

			// global beforeEach
			if (ctx.hooks?.beforeEach) await ctx.hooks.beforeEach(pack, ctx, final);
			if (pack.before) await pack.before(ctx, final);

			const res = await pack.handler(ctx, final);
			// Merge pack output safely
			if (res && typeof res === "object") Object.assign(final, res);

			// pack local after
			if (pack.after) await pack.after(ctx, final);
			if (ctx.hooks?.afterEach) await ctx.hooks.afterEach(pack, ctx, final);
		} catch (err) {
			logger.error(
				`❌ Prompt pack "${pack.name}" failed:`,
				(err as Error).message,
			);
			throw err;
		}
	}

	// 4️⃣ Global afterAll
	if (ctx.hooks?.afterAll) {
		await ctx.hooks.afterAll(ctx, final);
	}

	console.log(`Prompt engine complete.`, final, ctx, packs);

	// --------------------------------------------------------
	// 🔥 Resolve Template (this is the missing final step!)
	// --------------------------------------------------------

	// const template = await templateResolver(
	// 	(final.templateSource ?? `${final.framework}-${final.ui}`) as string, // or explicit template name
	// 	{
	// 		cwd: process.cwd(),
	// 		projectName: final.projectName!,
	// 		framework: final.framework,
	// 		ui: final.ui,
	// 		language: final.language as Language,
	// 		answers: final as Answers,
	// 		cacheDir: path.join(os.homedir(), ".appinit/cache"),
	// 	},
	// );
	return { answers: final };
}
