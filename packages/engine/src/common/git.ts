import fs from "fs-extra";
import path from "path";
import { spinner } from "@clack/prompts";
import { runCommand } from "@appinit/core";

export const initGit = async (cwd: string) => {
	const s = spinner();
	s.start("Initializing local git repository...");

	try {
		// Step 1 — Init repo
		// 1) Check if .git already exists
		const gitFolder = path.join(cwd, ".git");
		const alreadyInit = await fs.pathExists(gitFolder);

		if (!alreadyInit) {
			await runCommand("git", ["init"], { cwd });
		}

		// Step 2 — Write a default .gitignore if missing
		const gitignorePath = path.join(cwd, ".gitignore");

		if (!(await fs.pathExists(gitignorePath))) {
			await fs.writeFile(gitignorePath, "node_modules/\ndist/\n.env\n");
		}

		// Step 3 — Stage and commit
		await runCommand("git", ["add", "-A"], { cwd });
		await runCommand("git", ["commit", "-m", "🎉 Initial commit from Codex"], {
			cwd,
		});

		s.message("✅ Local git repo initialized successfully");
	} catch (err: any) {
		s.message("⚠️ Git initialization failed or skipped");
		console.error(err.message || err);
	} finally {
		s.stop();
	}
};
