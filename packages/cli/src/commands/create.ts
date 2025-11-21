import { printFooter } from "@appinit/core";
import { buildContext } from "../core/context.js";

import { CLICommand } from "@appinit/types";
import { resolveAnswers } from "../core/resolve-answers";
/**
 * Start creating project
 * @param cmd
 */
export async function createProject(cmd: CLICommand) {
	console.clear();
	console.log("\n🚀 Appinit — Create a project\n");

	// 1. if user provided --template template-name

	// 2. Build initial context
	const config = await buildContext(cmd);

	// 2. Resolve answers (prompt engine inside this)
	const answers = await resolveAnswers(config);
	// ctx.answers = answers;

	// // 3. Resolve template
	// const templateId = selectBaseTemplate(answers);
	// const cacheDir = path.join(os.homedir(), ".appinit/cache");
	// const targetDir = path.join(ctx.cwd, answers.projectName!);
	// const resolvedTemplate = await templateResolver(templateId, {
	// 	cwd: ctx.cwd,
	// 	cacheDir,
	// 	projectName: answers.projectName!,
	// 	framework: isFrontend(answers.projectType!) ? answers.framework : "",
	// 	language: answers.language!,
	// 	answers,
	// 	targetDir,
	// });

	// await startEngine(targetDir, ctx, resolvedTemplate);

	console.log("\n✅ Project created. Next steps:", config);
	console.log("  npm install");
	console.log("  npm run dev\n");

	printFooter(cmd.args[1]);
}
