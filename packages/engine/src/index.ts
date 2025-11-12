// packages/engine
import { setupGracefulExit } from "./common/exit.js";
import { isFrontend, isBackend } from "@appinit/types/infer";
import path from "path";
import fs from "fs-extra";
import { logger, runStep } from "./common/logger.js";
import { generateReactTemplate } from "./generator.js";
import { runInstaller } from "./common/install.js";
import { cleanupRegisteredPaths } from "./common/cleanup.js";
import { initGit } from "./common/git.js";
import { Answers } from "@appinit/types";
import { generateBackend } from "./backend-generate.js";
import { generateFrontend } from "./frontend-generate.js";

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

	logger.info(`🚀 Starting Appinit Engine for: ${answers.projectName}`);

	await runStep("Generate React Template", async () => {
		await generateReactTemplate(projectDir, answers.ui!);
	});

	// ==============================
	// 🧱 Scaffold core structure
	// ==============================
	if (isFrontend(answers)) {
		await runStep(`Generate Frontend (${answers.framework})`, async () => {
			await generateFrontend(answers);
		});
	}

	if (isBackend(answers)) {
		await runStep(
			`Generate Backend (${answers.backendFramework})`,
			async () => {
				await generateBackend(answers);
			},
		);
	}

	// ==============================
	// 🔐 Initialize Git
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
	// 🧰 Optional: Setup CI/CD
	// ==============================
	if (answers.setupCI || answers.setupCD) {
		await runStep("Setup CI/CD", async () => {
			const provider = answers.ciProvider ?? "none";
			if (provider !== "none") {
				const ciTemplate = `common/ci/${provider}`;
				await fs.copy(
					path.resolve(process.cwd(), "templates", ciTemplate),
					projectDir,
				);
				logger.info(`⚙️ Added CI configuration for ${provider}`);
			}
		});
	}

	// ==============================
	// ☁️ Optional: Deploy Config
	// ==============================
	if (answers.deploy) {
		await runStep("Configure Deployment", async () => {
			const target =
				isFrontend(answers) && answers.frontendDeployTarget
					? `deploy/frontend/${answers.frontendDeployTarget}`
					: isBackend(answers) && answers.backendDeployTarget
						? `deploy/backend/${answers.backendDeployTarget}`
						: null;

			if (target) {
				await fs.copy(
					path.resolve(process.cwd(), "templates", target),
					projectDir,
				);
				logger.info(`☁️ Added deployment config: ${target}`);
			}
		});
	}

	// ==============================
	// 🧠 Optional: Auth Integration
	// ==============================
	if (answers.auth && answers.authProvider && answers.authProvider !== "none") {
		await runStep("Configure Authentication", async () => {
			const authPath = isFrontend(answers)
				? `auth/frontend/${answers.authProvider}`
				: `auth/backend/${answers.authProvider}`;

			const src = path.resolve(process.cwd(), "templates", authPath);
			if (await fs.pathExists(src)) {
				await fs.copy(src, projectDir);
				logger.info(`🔐 Added ${answers.authProvider} authentication`);
			} else {
				logger.warn(`⚠️ Auth provider ${answers.authProvider} not found.`);
			}
		});
	}

	// if (answers.useAI) {
	// 	await runStep("🤖 Configure AI Assistant", async () => {
	// 		await setupAIAgent(answers);
	// 	});
	// }
	logger.success(`✅ Project ${answers.projectName} scaffolded successfully.`);
	cleanupRegisteredPaths();
}
