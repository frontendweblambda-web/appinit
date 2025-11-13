import { promises as fs } from "fs";
import path from "path";

export async function copyFile(src: string, dest: string) {
	await fs.mkdir(path.dirname(dest), { recursive: true });
	await fs.copyFile(src, dest);
}

export async function copyDir(srcDir: string, destDir: string) {
	const entries = await fs.readdir(srcDir, { withFileTypes: true });
	await fs.mkdir(destDir, { recursive: true });

	for (const entry of entries) {
		const srcPath = path.join(srcDir, entry.name);
		const destPath = path.join(destDir, entry.name);

		if (entry.isDirectory()) {
			await copyDir(srcPath, destPath);
		} else if (entry.isFile()) {
			await copyFile(srcPath, destPath);
		}
	}
}
