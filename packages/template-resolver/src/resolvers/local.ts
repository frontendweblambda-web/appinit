import path from "node:path";
import fs from "fs-extra";
import glob from "glob";
import { VFS } from "../vfs.js";

export async function resolveLocalTemplate(folder: string): Promise<VFS> {
	const vfs = new VFS();
	const root = path.resolve(folder);
	if (!(await fs.pathExists(root)))
		throw new Error(`Local template not found: ${root}`);

	const files = glob.sync("**/*", { cwd: root, dot: true, nodir: true });
	for (const f of files) {
		const full = path.join(root, f);
		const content = await fs.readFile(full, "utf8");
		vfs.write(f, content);
	}

	return vfs;
}
