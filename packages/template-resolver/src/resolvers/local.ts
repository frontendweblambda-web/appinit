import path from "node:path";
import fs from "node:fs/promises";
import { makeTempDir, readJson } from "../utils";
import { ResolvedTemplate } from "@appinit/types";
import { copyDir } from "fs-extra";

// Note: we use fs-extra copyDir for simplicity — but not adding dependency here; implement simple recursive copy if needed

export async function resolveLocal(locator: string): Promise<ResolvedTemplate> {
	const full = path.resolve(locator);
	const stat = await fs.stat(full);
	if (!stat.isDirectory())
		throw new Error("Local template must be a directory");

	const temp = await makeTempDir();

	// simple recursive copy
	await copyRecursive(full, temp);

	const meta = await readJson(path.join(temp, "template.json"));

	return { source: "local", sourceLocator: full, tempDir: temp, meta };
}

async function copyRecursive(src: string, dest: string) {
	await fs.mkdir(dest, { recursive: true });
	const entries = await fs.readdir(src, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);
		if (entry.isDirectory()) {
			await copyRecursive(srcPath, destPath);
		} else if (entry.isFile()) {
			await fs.copyFile(srcPath, destPath);
		}
	}
}
