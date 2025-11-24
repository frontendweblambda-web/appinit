// packages/engine/src/write-files.ts

import { AppEngineContext } from "@appinit/types";
import fs from "fs-extra";
import path from "path";

/**
 * Write the resolved VFS (virtual file system) to disk.
 * This is the ONLY place the engine touches the filesystem.
 */
export async function writeFilesToDisk(
	ctx: AppEngineContext,
	files: Map<string, string>,
): Promise<{ written: number; skipped: number }> {
	const { targetRoot } = ctx.paths;
	const { dryRun, force } = ctx.flags;
	const logger = ctx.logger;

	let written = 0;
	let skipped = 0;

	logger.info("📝 Writing template files...");

	for (const [relativePath, content] of files.entries()) {
		const outputPath = path.join(targetRoot, relativePath);

		// Check if file exists
		const exists = await fs.pathExists(outputPath);

		if (exists && !force) {
			logger.warn(`⚠️ Skipped existing file: ${relativePath}`);
			skipped++;
			continue;
		}

		if (dryRun) {
			logger.info(`🔍 [dry-run] Would write: ${relativePath}`);
			skipped++;
			continue;
		}

		// Ensure directory exists
		await fs.ensureDir(path.dirname(outputPath));

		// Write content
		await fs.writeFile(outputPath, content, "utf8");

		logger.info(`📄 Wrote: ${relativePath}`);
		written++;
	}

	logger.success?.(`✨ Files written: ${written}, skipped: ${skipped}`);

	return { written, skipped };
}
