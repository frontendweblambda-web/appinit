import { runPromptEngine } from "@appinit/prompt";
import { Flags, PromptContext, PromptResult } from "@appinit/types";
import {
	ensureDir,
	pathExists,
	readJson,
	remove,
	removeDir,
	writeJson,
} from "@appinit/utils";
import chalk from "chalk";

import os from "os";
import path from "path";

const CONFIG_DIR = path.join(os.homedir(), ".appinit");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export async function loadUserConfig(): Promise<any | null> {
	try {
		if (await pathExists(CONFIG_FILE)) {
			const data = await readJson(CONFIG_FILE);
			if (data.projectName && data.framework && data.ui && data.registry) {
				return data;
			} else {
				console.warn(
					chalk.yellow(
						"⚠️ Saved config is missing required fields — ignoring.",
					),
				);
				return null;
			}
		}
		return null;
	} catch (err) {
		console.warn("Failed to load Appinit config:", err);
		return null;
	}
}

export async function saveUserConfig(data: Record<string, any>) {
	try {
		await ensureDir(CONFIG_DIR);
		await writeJson(CONFIG_FILE, data);
	} catch (err) {
		console.warn("Failed to save Appinit config:", err);
	}
}

/**
 * Clear saved configuration
 */
export const clearUserConfig = async (): Promise<void> => {
	if (await pathExists(CONFIG_FILE)) {
		await removeDir(CONFIG_FILE);
		console.log(chalk.yellow("🧹 Cleared saved Codex config."));
	} else {
		console.log(chalk.gray("No saved config found."));
	}
};
