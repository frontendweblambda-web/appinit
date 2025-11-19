import { buildContext } from "../core/context.js";

import os from "node:os";

import {
	selectBaseTemplate,
	templateResolver,
} from "@appinit/template-resolver";
import path from "path";

import { isFrontend } from "@appinit/core";
import { CLICommand } from "@appinit/types";
import { resolveAnswers } from "../core/resolve-answers.js";

/**
 * Start creating project
 * @param cmd
 */
export async function createProject(cmd: CLICommand) {
	console.clear();
	console.log("\n🚀 Appinit — Create a project\n");

	// 1. Build initial context
	const ctx = await buildContext(cmd);

	console.log("CTX", ctx);
	const answers = await resolveAnswers(ctx);
	ctx.answers = answers;

	const templateId = selectBaseTemplate(answers);
	// console.log("ANSWERS", ctx, templateId);

	const cacheDir = path.join(os.homedir(), ".appinit/cache");
	const targetDir = path.join(ctx.cwd, answers.projectName);

	console.log("targetDir", targetDir);
	const resolvedTemplate = await templateResolver(templateId, {
		cwd: ctx.cwd,
		cacheDir,
		projectName: answers.projectName!,
		framework: isFrontend(answers) ? answers.framework : "",
		language: answers.language!,
		answers,
	});
	console.log("\n✅ Project created. Next steps:", answers, resolvedTemplate);
	//console.log(`  cd ${answers.projectName}`);
	console.log("  npm install");
	console.log("  npm run dev\n");
}
