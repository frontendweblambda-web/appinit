import { buildContext } from "../core/context.js";
import { runPromptEngine } from "@appinit/prompt";
import { scaffoldProject } from "../core/scaffold.js";
import { saveUserConfig } from "../core/config-store";

import { CLICommand } from "../core/flags";
import { startEngine } from "@appinit/engine";
import { Answers } from "@appinit/types";
import { applyTemplate } from "@appinit/template-resolver";
import path from "path";
import { ensureDir } from "@appinit/utils";

export async function createProject(cmd: CLICommand) {
	console.clear();
	console.log("\n🚀 Appinit — Create a project\n");

	const ctx = await buildContext(cmd);

	// run prompt engine (your existing @appinit/prompt)
	const { answers, template } = await runPromptEngine(ctx);
	ctx.answers = answers;
	ctx.template = template;

	// 1. Write template files
	const projectName = answers.projectName;
	const targetDir = path.resolve(ctx.cwd, projectName!);
	ctx.targetDir = targetDir;
	await ensureDir(targetDir);
	await applyTemplate(template, targetDir, {
		projectName: answers.projectName!,
		framework: answers.framework,
		language: answers.language!,
		ui: answers.ui,
		answers: answers as Answers,
		inlineVariables: ctx.flags ?? {},
		mergeStrategy: "overwrite",
	});
	await startEngine(ctx.targetDir!, answers as Answers);

	// save last answers
	await saveUserConfig(answers);

	console.log("\n✅ Project created. Next steps:");
	console.log(`  cd ${answers.projectName}`);
	console.log("  npm install");
	console.log("  npm run dev\n");
}
