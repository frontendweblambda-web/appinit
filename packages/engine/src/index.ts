// packages/engine
import { setupGracefulExit } from "./common/exit.js";

import { Answers } from "@appinit/types";
import { ensureDir, pathExists } from "@appinit/utils";
import path from "path";
import fs from "fs-extra";
import { generateReactTemplate } from "./generator.js";
import { runInstaller } from "./common/install.js";
import { cleanupRegisteredPaths } from "./common/cleanup.js";
import { initGit } from "./common/git.js";
import { generateBackend } from "./backend-generate.js";
import { generateFrontend } from "./frontend-generate.js";
import {
	isBackend,
	isFrontend,
	isFullstack,
	isLibrary,
	logger,
	runStep,
} from "@appinit/core";
/**
 * Start engine
 * @param answers
 */ export async function startEngine(
	targetDir: string,
	answers: Answers,
): Promise<void> {
	setupGracefulExit();

	const projectName = answers.projectName;
	const projectDir = path.resolve(process.cwd(), projectName);

	if (await pathExists(projectDir)) {
		logger.error(`❌ Directory ${projectName} already exists.`);
		process.exit(1);
	}

	await ensureDir(projectDir);

	logger.info(`🚀 Starting Appinit Engine for: ${projectName}`);

	// ==============================
	// 🔷 Only frontend or fullstack needs React template
	// ==============================
	if (
		answers.projectType === "frontend" ||
		answers.projectType === "fullstack"
	) {
		await runStep("Generate UI Template", async () => {
			await generateReactTemplate(projectDir, answers.framework);
		});
	}

	// ==============================
	// 🧱 Frontend scaffold
	// ==============================
	if (isFrontend(answers) || isFullstack(answers)) {
		await runStep(`Generate Frontend (${answers.framework})`, async () => {
			await generateFrontend(answers);
		});
	}

	// ==============================
	// 🧱 Backend scaffold
	// ==============================
	if (isBackend(answers) || isFullstack(answers)) {
		await runStep(`Generate Backend (${answers.backend})`, async () => {
			await generateBackend(answers);
		});
	}

	// ==============================
	// 🔐 Auth (only for FE, BE, FS)
	// ==============================
	if (answers.auth && !isLibrary(answers)) {
		await runStep("Configure Authentication", async () => {
			const authPath =
				isFrontend(answers) || isFullstack(answers)
					? `auth/frontend/${answers.auth}`
					: `auth/backend/${answers.auth}`;

			const src = path.resolve(process.cwd(), "templates", authPath);

			if (await fs.pathExists(src)) {
				await fs.copy(src, projectDir);
				logger.info(`🔐 Added ${answers.auth} authentication`);
			} else {
				logger.warn(`⚠️ Auth provider ${answers.auth} not found.`);
			}
		});
	}

	// ==============================
	// 🔧 Git
	// ==============================
	if (answers.initGit) {
		await runStep("Initialize Git Repository", async () => {
			await initGit(projectDir);
		});
	}

	// ==============================
	// 📦 Install Dependencies
	// ==============================
	if (answers.autoInstall) {
		await runStep("Install Dependencies", async () => {
			await runInstaller(projectDir);
		});
	}

	// ==============================
	// ☁ Deploy (frontend & backend separate)
	// ==============================
	if (answers.deploy?.deploy) {
		await runStep("Configure Deployment", async () => {
			let target: string | null = null;

			if (isFrontend(answers) || isFullstack(answers)) {
				target = `deploy/frontend/${answers.frontendDeployTarget}`;
			}

			if (isBackend(answers) || isFullstack(answers)) {
				target = `deploy/backend/${answers.backendDeployTarget}`;
			}

			if (target) {
				const src = path.resolve(process.cwd(), "templates", target);
				await fs.copy(src, projectDir);
				logger.info(`☁ Added deployment config: ${target}`);
			}
		});
	}

	logger.success(`✅ Project ${answers.projectName} scaffolded successfully.`);
	cleanupRegisteredPaths();
}
