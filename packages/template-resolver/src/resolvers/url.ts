import tmp from "tmp";
import path from "node:path";
import { execa } from "execa";
import fs from "fs-extra";
import { resolveLocalTemplate } from "./local.js";

export async function resolveUrlTemplate(url: string) {
	const tmpDir = tmp.dirSync({ unsafeCleanup: true });
	const cwd = tmpDir.name;
	const filename = path.join(cwd, "archive");
	try {
		// download using curl/wget if available
		await execa("sh", ["-c", `curl -L "${url}" -o ${filename}`]);
		// try to extract
		await execa("sh", [
			"-c",
			`tar -xzf ${filename} -C ${cwd} || unzip ${filename} -d ${cwd}`,
		]);
		// find top-level folder (fallback to cwd)
		const entries = await fs.readdir(cwd);
		const folder = entries.length === 1 ? path.join(cwd, entries[0]) : cwd;
		return await resolveLocalTemplate(folder);
	} finally {
		// keep tmp for debugging
	}
}
