import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "@appinit/utils";

const DEFAULT_GITIGNORE = `
# Appinit defaults
node_modules
.env
.env.local
.env.*.local
.next
out
dist
coverage
*.log
*.tmp
.DS_Store
`;

export async function createGitIgnore(cwd: string) {
	const p = path.join(cwd, ".gitignore");

	logger.step("Creating .gitignore...");
	await fs.writeFile(p, DEFAULT_GITIGNORE, "utf8");
}
