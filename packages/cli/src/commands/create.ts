import { buildContext } from "../core/context.js";
import { runPromptEngine } from "@appinit/prompt";
import { scaffoldProject } from "../core/scaffold.js";
import { saveUserConfig } from "../core/config-store.js";

export async function createProject(cmd: {
	name: string;
	args: string[];
	flags: Record<string, any>;
}) {
	console.clear();
	console.log("\n🚀 Appinit — Create a project\n");

	const ctx = await buildContext(cmd);

	// run prompt engine (your existing @appinit/prompt)
	const answers = await runPromptEngine(ctx as any);
	ctx.answers = answers;

	// scaffold minimal project
	await scaffoldProject(ctx, answers);

	// save last answers
	await saveUserConfig(answers);

	console.log("\n✅ Project created. Next steps:");
	console.log(`  cd ${answers.projectName}`);
	console.log("  npm install");
	console.log("  npm run dev\n");
}
