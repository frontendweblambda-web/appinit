import { printFooter, printHeader } from "@appinit/core";
import { runTemplateEngine } from "@appinit/engine";
import { templateResolver } from "@appinit/template-resolver";
import { CLICommand } from "@appinit/types";
import { removeDir, validateProjectPath } from "@appinit/utils";
import { buildContext } from "../core/context.js";
import { resolveAnswers } from "../core/resolve-answers";
import { getCliVersion } from "../utils/cli-info";
/**
 * Start creating project
 * @param cmd
 */
export async function createProject(cmd: CLICommand) {
	console.clear();
	// 1. if user provided --template template-name
	await printHeader({ version: getCliVersion() });

	// 2. Build initial context
	const ctx = await buildContext(cmd);

	const pathError = validateProjectPath(ctx.cwd!);

	if (pathError) {
		ctx.log?.error(`❌ Invalid project path: ${ctx.cwd!}`);
		ctx.log?.error(`Reason: ${pathError}`);
		process.exit(1);
	}

	// 2. Resolve answers (prompt engine inside this)
	const config = await resolveAnswers(ctx);

	const resolvedTemplate = await templateResolver(config);

	await runTemplateEngine(resolvedTemplate, {
		dryRun: config.cliCommand?.flags.skipInstall,
		force: config.cliCommand?.flags.force ?? false,
		logger: config.log!,
		flags: config.cliCommand?.flags,
		answers: config.answers!,
	});

	console.log("\n✅ Project created. Next steps:");
	console.log("  npm install");
	console.log("  npm run dev\n");

	// remove directry after successfull
	await removeDir(resolvedTemplate.tempDir);
	printFooter(config.answers?.projectName!);
}
