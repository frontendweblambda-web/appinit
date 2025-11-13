import type { CommandModule } from "@appinit/types";
import { loadTemplateMeta } from "../template/loader"; // if you have template resolvers
import { runPromptEngine } from "@appinit/prompt"; // main entry

export const meta = {
	name: "new",
	description: "Scaffold a new AppInit project",
	usage: "appinit new [name] [--template <template>] [--yes]",
	flags: {
		yes: { alias: "y", type: "boolean", description: "Skip prompts" },
		template: { alias: "t", type: "string", description: "Template name" },
	},
};

export async function action(args, flags) {
	const projectName = args[0] ?? flags.name ?? null;
	const templateName = flags.template ?? null;

	const templateMeta = templateName
		? await loadTemplateMeta(templateName)
		: null;

	// build prompt context
	const ctx = {
		flags,
		defaultName: projectName,
		templateName,
		templateMeta,
		runtime: "cli",
	};

	// run engine
	const answers = await runPromptEngine(ctx);

	console.log("Final Answers:", answers);

	// call scaffold next
	// scaffoldProject(answers);
}
