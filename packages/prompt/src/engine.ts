// @appinit/prompt/engine.ts
import type {
	PromptContext,
	PromptResult,
	PromptPack,
	ResolvedTemplate,
	Language,
	Answers,
} from "@appinit/types";
import { gitPack } from "./packs/git";
import { metaPack } from "./packs/meta";
import { languagePack } from "./packs/language";
import { environmentPack } from "./packs/environment";
import { frameworkPack } from "./packs/framework";
import { qualityPack } from "./packs/quality";
import { infraPack } from "./packs/infra";
import { automationPack } from "./packs/automation";
import os from "os";
import { templateResolver } from "@appinit/template-resolver";
import { logger } from "@appinit/utils";
import {
	backendPack,
	deployPack,
	previousConfigPack,
	projectTypePack,
	uiPack,
} from "./packs";
import path from "path";

// --------------------------------------------------------
// DEFAULT PIPELINE (used only when skipDefaultPacks is false)
// --------------------------------------------------------
const DEFAULT_PIPELINE: PromptPack[] = [
	// previousConfigPack, // MUST RUN FIRST
	// projectTypePack,
	// metaPack,
	// environmentPack,
	// languagePack,
	// frameworkPack,
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
): Promise<{ answers: PromptResult; template: ResolvedTemplate }> {
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

	// --------------------------------------------------------
	// Execute each pack
	// --------------------------------------------------------
	// for (const pack of pipeline) {
	// 	try {
	// 		logger.info(`➡️  Running pack: ${pack.name}`);

	// 		// Optional: beforePrompt hook
	// 		if (ctx.hooks?.beforePrompt) {
	// 			await ctx.hooks.beforePrompt(ctx, final);
	// 		}

	// 		const res = await pack.handler(ctx, final);

	// 		// Merge pack output safely
	// 		if (res && typeof res === "object") {
	// 			Object.assign(final, res);
	// 		}

	// 		// Optional: afterPrompt hook
	// 		if (ctx.hooks?.afterPrompt) {
	// 			await ctx.hooks.afterPrompt(ctx, final);
	// 		}
	// 	} catch (err) {
	// 		logger.error(
	// 			`❌ Prompt pack "${pack.name}" failed:`,
	// 			(err as Error).message,
	// 		);
	// 		throw err;
	// 	}
	// }

	logger.info("Prompt engine complete.");

	// --------------------------------------------------------
	// 🔥 Resolve Template (this is the missing final step!)
	// --------------------------------------------------------
	// const template = await templateResolver(
	// 	final.templateSource ?? `${final.framework}-${final.ui}`, // or explicit template name
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

	console.log("TEMPLATE", final);
	return { answers: final, template: {} as any };
}
