import fs from "node:fs/promises";

import { logger } from "@appinit/utils";
import { listTemp, clearTemp } from "./temp-registry";

export async function cleanupAll() {
	const items = listTemp();

	logger.step(`Running cleanup for ${items.length} temporary items...`);

	for (const item of items) {
		try {
			if (item.type === "dir") {
				await fs.rm(item.path, { recursive: true, force: true });
			} else if (item.type === "file") {
				await fs.rm(item.path, { force: true });
			} else {
				await fs
					.rm(item.path, { recursive: true, force: true })
					.catch(() => {});
			}
		} catch (err) {
			logger.warn(`Failed to remove: ${item.path}`, err);
		}
	}

	clearTemp();
	logger.info("Cleanup completed.");
}
