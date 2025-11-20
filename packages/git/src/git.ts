import { logger } from "@appinit/core";
import { GitInitOptions } from "@appinit/types";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { hasGitIgnore, isGitInstalled, isInsideGitRepo } from "./detect";
import { createGitIgnore } from "./ignore";

const run = promisify(exec);

export async function initializeGit(opts: GitInitOptions) {
	const { cwd, enable, initialCommitMessage = "Initial commit" } = opts;

	if (!enable) {
		logger.info("User opted out: Git initialization skipped.");
		return;
	}

	if (!(await isGitInstalled())) {
		logger.warn("Git is not installed. Skipping git initialization.");
		return;
	}

	if (await isInsideGitRepo(cwd)) {
		logger.info("Project is already inside a Git repository. Skipping init.");
		return;
	}

	logger.step("Initializing Git repository...");
	await run("git init", { cwd });

	if (!(await hasGitIgnore(cwd))) {
		await createGitIgnore(cwd);
	}

	// stage all
	await run("git add .", { cwd });

	// commit
	try {
		await run(`git commit -m "${initialCommitMessage}"`, { cwd });
		logger.info("Git repo initialized and initial commit created.");
	} catch (err) {
		logger.warn("Initial commit failed. Repo created but commit skipped.", err);
	}
}
