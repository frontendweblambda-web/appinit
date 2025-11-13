import { getPM } from "@appinit/package-manager";
import { InstallOptions, InstallResult } from "@appinit/types";

import { rollbackOnFailure } from "./rollback";
import { logger, retry } from "@appinit/utils";
export async function installDependencies(
	opts: InstallOptions,
): Promise<InstallResult> {
	const cwd = opts.cwd ?? process.cwd();
	const deps = opts.deps ?? [];
	const devDeps = opts.devDeps ?? [];
	const retryCount = typeof opts.retry === "number" ? opts.retry : 3;

	const pm = await getPM(cwd);

	try {
		if (deps.length) {
			logger.step(`Installing dependencies: ${deps.join(", ")}`);
			await retry(() => pm.install(deps), retryCount, 500);
		}

		if (devDeps.length) {
			logger.step(`Installing devDependencies: ${devDeps.join(", ")}`);
			await retry(() => pm.installDev(devDeps), retryCount, 500);
		}

		return { success: true, installedDeps: deps, installedDevDeps: devDeps };
	} catch (err) {
		logger.error("Install failed", err);
		try {
			await rollbackOnFailure({ cwd, deps, devDeps });
		} catch (rbErr) {
			logger.error("Rollback failed", rbErr);
		}
		return { success: false };
	}
}
