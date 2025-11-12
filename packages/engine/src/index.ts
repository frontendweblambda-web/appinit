// packages/engine
import { setupGracefulExit } from "./exit.js";
import type { Answers } from "@appinit/types";
import path from "path";
import fs from "fs-extra";
import { logger, runStep } from "./logger.js";
import { generateReactTemplate } from "./generator.js";
import { runInstaller } from "./install.js";
import { cleanupRegisteredPaths } from "./cleanup.js";
import { initGit } from "./git.js";

/**
 * Start engine
 * @param answers
 */
export async function startEngine(answers: Answers): Promise<void> {
	setupGracefulExit();

	const projectDir = path.resolve(process.cwd(), answers.projectName!);
	if (await fs.pathExists(projectDir)) {
		logger.error(`❌ Directory ${answers.projectName} already exists.`);
		process.exit(1);
	}

	await fs.ensureDir(projectDir);

	await runStep("Generate React Template", async () => {
		await generateReactTemplate(projectDir, answers.ui!);
	});

	if (answers.initGit) {
		await runStep("Initialize Git", async () => {
			await initGit(projectDir);
		});
	}

	if (answers.autoInstall) {
		await runStep("Install Dependencies", async () => {
			await runInstaller(projectDir);
		});
	}

	logger.success(`✅ Project ${answers.projectName} scaffolded successfully.`);
	cleanupRegisteredPaths();
}
