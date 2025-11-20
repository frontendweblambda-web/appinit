import { getPackageManager, logger, runCommand } from "@appinit/core";
import { EngineContext, PromptContext, ResolvedTemplate } from "@appinit/types";
import * as utils from "@appinit/utils";

export async function engineContext(
	targetDir: string,
	ctx: PromptContext,
	template: ResolvedTemplate,
): Promise<EngineContext> {
	// user selected package manager OR default to npm
	const pmName = ctx.answers.packageManager ?? "npm";

	const packageManager = await getPackageManager(pmName, targetDir);

	return {
		...ctx,
		targetDir,
		variables: template.variables ?? {},
		template: template,
		files: template.files,
		log: logger,
		utils: utils,
		run: runCommand, // utility wrapper
		pkg: packageManager,
		answers: ctx.answers,
	};
}
