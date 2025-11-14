import fs from "fs-extra";
import os from "os";
import path from "path";

const CONFIG_DIR = path.join(os.homedir(), ".appinit");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export async function loadUserConfig(): Promise<any | null> {
	try {
		if (await fs.pathExists(CONFIG_FILE)) {
			const data = await fs.readJSON(CONFIG_FILE);
			return data;
		}
		return null;
	} catch (err) {
		console.warn("Failed to load Appinit config:", err);
		return null;
	}
}

export async function saveUserConfig(data: Record<string, any>) {
	try {
		await fs.ensureDir(CONFIG_DIR);
		await fs.writeJSON(CONFIG_FILE, { lastCreate: data }, { spaces: 2 });
	} catch (err) {
		console.warn("Failed to save Appinit config:", err);
	}
}
