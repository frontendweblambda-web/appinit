import { Command } from "commander";
import { createProject } from "../bootstrap/project";
import { loadUserConfig } from "@appinit/engine";

import { askQuestions } from "./questions/index.js";
import { logger } from "./core/logger.js";

export const create = new Command("create")
	.description("🧱 Create a new full-stack project with Appinit")
	.argument("[name]", "project name")
	.option("--force", "overwrite existing directory")
	.option("--no-install", "skip dependency installation")
	.action(async (name, options) => {
		try {
			logger.info("🚀 Appinit - Create Project");

			// const userConfig = await loadUserConfig();
			const answers = await askQuestions(name, options);

			await createProject({
				...answers,
				name,
				install: options.install !== false,
			});

			logger.success(`✅ Project ${name} created successfully!`);
		} catch (err) {
			const message = err instanceof Error ? err.message : "";
			logger.error(`❌ Failed to create project:"${message}`);
			process.exit(1);
		}
	});
