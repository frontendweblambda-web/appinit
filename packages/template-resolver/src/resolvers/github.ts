import fs from "fs-extra";
import path from "node:path";
import { execa } from "execa";
import tmp from "tmp";
import { resolveLocalTemplate } from "./local.js";

export async function resolveGitTemplate(
	url: string,
	ref?: string,
	subpath?: string,
) {
	const tmpDir = tmp.dirSync({ unsafeCleanup: true });
	try {
		const cloneArgs = ["clone", "--depth", "1", url, tmpDir.name];
		if (ref) {
			cloneArgs.splice(2, 0, "--branch", ref);
		}
		await execa("git", cloneArgs, { stdio: "ignore" });
		const root = subpath ? path.join(tmpDir.name, subpath) : tmpDir.name;
		return await resolveLocalTemplate(root);
	} catch (err) {
		throw new Error(`Failed to fetch git template: ${String(err)}`);
	} finally {
		// NOTE: let caller decide when to cleanup if they want caching
		// tmpDir.removeCallback();
	}
}
