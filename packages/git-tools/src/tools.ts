import { exec } from "node:child_process";
import { promisify } from "node:util";
import { logger } from "@appinit/utils";
import { GitOpContext } from "@appinit/types";

const run = promisify(exec);

export async function undoLastCommit(ctx: GitOpContext) {
	logger.step("Undoing last commit (soft)...");
	await run("git reset --soft HEAD~1", { cwd: ctx.cwd });
}

export async function undoLastCommitHard(ctx: GitOpContext) {
	logger.step("Undoing last commit (hard)...");
	await run("git reset --hard HEAD~1", { cwd: ctx.cwd });
}

export async function resetToCommit(ctx: GitOpContext) {
	if (!ctx.commit) throw new Error("commit hash is required");
	logger.step(`Resetting to commit: ${ctx.commit}`);
	await run(`git reset --hard ${ctx.commit}`, { cwd: ctx.cwd });
}

export async function revertCommit(ctx: GitOpContext) {
	if (!ctx.commit) throw new Error("commit hash is required");
	logger.step(`Reverting commit: ${ctx.commit}`);
	await run(`git revert ${ctx.commit} --no-edit`, { cwd: ctx.cwd });
}

export async function dropHistory(ctx: GitOpContext) {
	logger.step("Dropping all Git history but keeping files...");
	await run("git checkout --orphan latest", { cwd: ctx.cwd });
	await run("git add -A", { cwd: ctx.cwd });
	await run("git commit -m 'Reinitialize repository'", { cwd: ctx.cwd });
	await run("git branch -D main || true", { cwd: ctx.cwd });
	await run("git branch -m main", { cwd: ctx.cwd });
}

export async function cleanWorkingTree(ctx: GitOpContext) {
	logger.step("Cleaning working tree...");
	await run("git restore .", { cwd: ctx.cwd });
	await run("git clean -fd", { cwd: ctx.cwd });
}
