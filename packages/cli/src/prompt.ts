// packages/cli
import { Command } from "commander";

import * as engine from "@appinit/engine";

import { askQuestions } from "./questions/index.js";
import { logger } from "./core/logger.js";
import chalk from "chalk";

const program = new Command();

async function main() {
	program
		.description("🧱 Create a new full-stack project with Appinit")
		.argument("[name]", "project name")
		.option("--force", "overwrite existing directory")
		.option("--no-install", "skip dependency installation")
		.action(async (name, options) => {
			try {
				logger.info("🚀 Appinit - Create Project");

				// const userConfig = await loadUserConfig();
				const answers = await askQuestions(name, options);

				await engine.startEngine(answers);

				logger.success(`✅ Project ${name} created successfully!`);
			} catch (err) {
				const message = err instanceof Error ? err.message : "";
				logger.error(`❌ Failed to create project:"${message}`);
				process.exit(1);
			}
		});

	await program.parseAsync(process.argv);
}

main().catch((err) => {
	if (err?.name === "ExitPromptError") {
		console.log(chalk.yellow("\n\n👋 Cancelled by user.\n"));
		process.exit(0);
	}

	console.error(chalk.red("❌ Fatal error:"), err);
	process.exit(1);
});
