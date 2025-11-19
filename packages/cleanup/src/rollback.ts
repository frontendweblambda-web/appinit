import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "@appinit/core";
import { RollbackContext } from "@appinit/types";

export async function rollback(context: RollbackContext) {
	logger.step("Rolling back generated files...");

	for (const file of context.createdFiles) {
		try {
			await fs.rm(path.join(context.cwd, file), { force: true });
		} catch (err) {
			logger.warn(`Failed to remove file during rollback: ${file}`, err);
		}
	}

	for (const dir of context.createdDirs) {
		try {
			await fs.rm(path.join(context.cwd, dir), {
				recursive: true,
				force: true,
			});
		} catch (err) {
			logger.warn(`Failed to remove directory during rollback: ${dir}`, err);
		}
	}

	logger.info("Rollback complete.");
}
