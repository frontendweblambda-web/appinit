import { registerTemp } from "@appinit/cleanup";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export async function makeTempDir(prefix = "appinit-tpl-") {
	const p = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
	// register for cleanup
	try {
		registerTemp({ path: p, type: "dir" });
	} catch {}
	return p;
}

export async function readJson<T = any>(filePath: string): Promise<T | null> {
	try {
		const raw = await fs.readFile(filePath, "utf8");
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}
