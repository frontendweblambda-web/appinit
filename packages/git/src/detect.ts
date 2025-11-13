import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";

const run = promisify(exec);

export async function isGitInstalled(): Promise<boolean> {
	try {
		await run("git --version");
		return true;
	} catch {
		return false;
	}
}

export async function isInsideGitRepo(cwd: string): Promise<boolean> {
	try {
		await run("git rev-parse --is-inside-work-tree", { cwd });
		return true;
	} catch {
		return false;
	}
}

export async function hasGitIgnore(cwd: string): Promise<boolean> {
	try {
		await fs.access(path.join(cwd, ".gitignore"));
		return true;
	} catch {
		return false;
	}
}
