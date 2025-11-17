import { buildContext } from "../core/context.js";
import { runPromptEngine } from "@appinit/prompt";
import { scaffoldProject } from "../core/scaffold.js";
import { saveUserConfig } from "../core/config-store";

import { CLICommand } from "../core/parse-flags.js";
import { startEngine } from "@appinit/engine";
import { Answers } from "@appinit/types";
import { applyTemplate } from "@appinit/template-resolver";
import path from "path";
import { ensureDir, logger } from "@appinit/utils";
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

	const answers = await resolveAnswers(ctx);
	ctx.answers = answers;

	console.log("ANSWERS", ctx);

	console.log("\n✅ Project created. Next steps:", answers);
	//console.log(`  cd ${answers.projectName}`);
	console.log("  npm install");
	console.log("  npm run dev\n");
}
