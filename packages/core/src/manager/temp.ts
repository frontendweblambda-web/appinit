import { ensureDir, removeDir } from "@appinit/utils";
import { log } from "@clack/prompts";
import os from "node:os";
import path from "node:path";

export class TempManager {
	private tempDir: string;
	private debug: boolean;

	constructor(debug = false) {
		this.debug = debug;

		this.tempDir = path.join(
			os.homedir(),
			".appinit",
			"temp",
			"scaffold-" + crypto.randomUUID(),
		);
	}

	async create() {
		await ensureDir(this.tempDir);
	}

	async cleanup() {
		if (this.debug) {
			log.info(`🟡 Debug mode ON — Temp preserved at: ${this.tempDir}`);
			return;
		}

		await removeDir(this.tempDir);
	}

	get path() {
		return this.tempDir;
	}
}
