import { buildContext } from "../core/context.js";

import { isFrontend } from "@appinit/core";
import { startEngine } from "@appinit/engine";
import {
	selectBaseTemplate,
	templateResolver,
} from "@appinit/template-resolver";
import { CLICommand } from "@appinit/types";
import os from "node:os";
import path from "path";
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

	// 2. Resolve answers (prompt engine inside this)
	const answers = await resolveAnswers(ctx);
	ctx.answers = answers;

	// 3. Resolve template
	const templateId = selectBaseTemplate(answers);
	const cacheDir = path.join(os.homedir(), ".appinit/cache");
	const targetDir = path.join(ctx.cwd, answers.projectName!);
	const resolvedTemplate = await templateResolver(templateId, {
		cwd: ctx.cwd,
		cacheDir,
		projectName: answers.projectName!,
		framework: isFrontend(answers.projectType!) ? answers.framework : "",
		language: answers.language!,
		answers,
		targetDir,
	});

	await startEngine(targetDir, ctx, resolvedTemplate);

	console.log("\n✅ Project created. Next steps:", answers);
	console.log("  npm install");
	console.log("  npm run dev\n");
}
