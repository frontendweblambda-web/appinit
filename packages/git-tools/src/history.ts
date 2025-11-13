import { exec } from "node:child_process";
import { promisify } from "node:util";
import { CommitInfo } from "@appinit/types";

const run = promisify(exec);

export async function listCommits(cwd: string): Promise<CommitInfo[]> {
	const { stdout } = await run(`git log --pretty=format:'%H||%an||%ad||%s'`, {
		cwd,
	});

	return stdout
		.split("\n")
		.filter(Boolean)
		.map((line) => {
			const [hash, author, date, message] = line.split("||");
			return { hash, author, date, message } as CommitInfo;
		});
}
