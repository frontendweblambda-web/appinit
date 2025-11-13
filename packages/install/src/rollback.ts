import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "@appinit/utils";

export async function rollbackOnFailure(opts: {
	cwd?: string;
	deps?: string[];
	devDeps?: string[];
}) {
	const cwd = opts.cwd ?? process.cwd();

	logger.step("Running rollback after failed install...");

	try {
		// Best-effort cleanup: remove node_modules and lockfiles if they exist.
		const nm = path.join(cwd, "node_modules");
		await fs.rm(nm, { force: true, recursive: true }).catch(() => {});

		// remove lockfiles
		const lockfiles = [
			"pnpm-lock.yaml",
			"package-lock.json",
			"yarn.lock",
			"bun.lockb",
		];
		await Promise.all(
			lockfiles.map((f) =>
				fs.rm(path.join(cwd, f), { force: true }).catch(() => {}),
			),
		);

		logger.info("Rollback complete");
	} catch (err) {
		logger.error("Rollback encountered an error", err);
		throw err;
	}
}
