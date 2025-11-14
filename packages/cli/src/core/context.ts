import type { PromptContext } from "@appinit/types";
import { loadUserConfig } from "./config-store.js";

export async function buildContext(cmd: {
	name: string;
	args: string[];
	flags: Record<string, any>;
}): Promise<PromptContext> {
	const config = await loadUserConfig();

	const ctx: PromptContext = {
		command: cmd.name,
		cliName: cmd.args[0] ?? null,
		flags: cmd.flags ?? {},
		cwd: process.cwd(),
		config: config?.lastCreate ?? null,
		previousConfigLoaded: !!config,
		runtime: "cli",
		outputMode: "text",
		answers: {},
		extra: {},
	};

	// Prefill templateId if passed via flags
	if (cmd.flags && cmd.flags.template) {
		ctx.templateId = cmd.flags.template;
	}

	return ctx;
}
