import { printFooter, printHeader } from "@appinit/core";
import { startEngine } from "@appinit/engine";
import { templateResolver } from "@appinit/template-resolver";
import { CLICommand } from "@appinit/types";
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

	// 2. Resolve answers (prompt engine inside this)
	const config = await resolveAnswers(ctx);

	const resolvedTemplate = await templateResolver(config);

	await startEngine(config, resolvedTemplate);

	console.log("\n✅ Project created. Next steps:");
	console.log("  npm install");
	console.log("  npm run dev\n");

	printFooter(config.answers?.projectName!);
}
