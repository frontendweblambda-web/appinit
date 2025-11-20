import { Answers, AppInitSavedUserConfig } from "@appinit/types";
import {
	ensureDir,
	pathExists,
	readJson,
	removeDir,
	writeJsonSafe,
} from "@appinit/utils";
import k from "kleur";

import os from "os";
import path from "path";

const CONFIG_DIR = path.join(os.homedir(), ".appinit");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export async function loadUserConfig(): Promise<AppInitSavedUserConfig | null> {
	try {
		if (await pathExists(CONFIG_FILE)) {
			const data = await readJson(CONFIG_FILE);
			console.log("Data", data, data.projectName && data.framework && data.ui);
			if (data.projectName && data.framework && data.ui) {
				return data;
			} else {
				console.warn(
					k.yellow("⚠️ Saved config is missing required fields — ignoring."),
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

export async function saveUserConfig(data: Answers) {
	try {
		const config: AppInitSavedUserConfig = {
			lastCreate: data,
			date: new Date().toISOString(),
			hostname: os.hostname(),
			ipAddress: getLocalIpAddress(), // We'll define this function below
		};
		await ensureDir(CONFIG_DIR);
		await writeJsonSafe(CONFIG_FILE, data);
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
		console.log(k.yellow("🧹 Cleared saved Codex config."));
	} else {
		console.log(k.gray("No saved config found."));
	}
};
// Helper to get the local IP address
function getLocalIpAddress(): string | undefined {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]!) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return undefined;
}
