import path from "node:path";
import tmp from "tmp";
import fs from "fs-extra";
import { execa } from "execa";
import { resolveLocalTemplate } from "./local.js";

/**
 * Downloads an npm package to a temp dir using `npm pack` then extracts.
 * This keeps resolution offline-friendly and cacheable.
 */
export async function resolveNpmPackage(pkgName: string) {
	const tmpDir = tmp.dirSync({ unsafeCleanup: true });
	try {
		const cwd = tmpDir.name;
		// run `npm pack <pkg>` and get tarball
		const { stdout } = await execa("npm", ["pack", pkgName], { cwd });
		const tarball = stdout.trim().split(/\r?\n/).pop();
		if (!tarball) throw new Error("npm pack failed");
		await execa("tar", ["-xzf", tarball], { cwd });
		// npm pack extracts to package/ by default
		const pkgRoot = path.join(cwd, "package");
		return await resolveLocalTemplate(pkgRoot);
	} finally {
		// keep temp dir for debugging; caller may remove
	}
}
