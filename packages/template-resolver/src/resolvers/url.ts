import { makeTempDir, readJson } from "../utils";
import { ResolvedTemplate } from "@appinit/types";
import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";

const exec = promisify(_exec);

/**
 * Supports URLs that are either GitHub archive links or .tgz tarballs.
 * Examples:
 * https://github.com/org/repo/archive/refs/tags/v1.0.0.tar.gz
 * https://example.com/template-1.0.0.tgz
 */
export async function resolveUrl(locator: string): Promise<ResolvedTemplate> {
	const temp = await makeTempDir();
	const cwd = temp;

	// try to download via curl (most systems have it) into file
	const filename = path.join(cwd, "archive.tgz");
	await exec(`curl -L ${locator} -o ${filename}`);

	// extract via tar
	const tar = await import("tar");
	await tar.x({ file: filename, cwd });

	// find template.json under cwd (first occurrence)
	const meta = await findTemplateJson(cwd);

	return { source: "url", sourceLocator: locator, tempDir: cwd, meta };
}

async function findTemplateJson(folder: string) {
	const entries = await fs.readdir(folder, { withFileTypes: true });
	for (const e of entries) {
		const p = path.join(folder, e.name);
		if (e.isFile() && e.name === "template.json")
			return JSON.parse(await fs.readFile(p, "utf8"));
		if (e.isDirectory()) {
			const found = await findTemplateJson(p);
			if (found) return found;
		}
	}
	return null;
}
