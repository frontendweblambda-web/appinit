import path from "node:path";
import { makeTempDir, readJson } from "../utils";
import { ResolvedTemplate } from "@appinit/types";
import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";

const exec = promisify(_exec);

/**
 * locator examples:
 * npm:@appinit/template-next
 * @appinit/template-next
 */
export async function resolveNpm(locator: string): Promise<ResolvedTemplate> {
	const packageName = locator.replace(/^npm:/, "");

	const temp = await makeTempDir();

	// use npm pack to download the tarball into temp
	// npm pack <pkg> --pack-destination <dir> is supported in npm@8+ but to be safe use npm pack and mv
	const cwd = temp;
	const { stdout } = await exec(`npm pack ${packageName}`, { cwd });
	// npm pack writes the tarball filename to stdout
	const tarball = stdout.trim().split("\n").pop();
	if (!tarball) throw new Error("npm pack failed to produce tarball");

	// extract tarball
	const tarballPath = path.join(cwd, tarball);
	// use tar (dependency) to extract
	const tar = await import("tar");
	await tar.x({ file: tarballPath, cwd });

	// npm pack creates package/ inside cwd
	const extractedDir = path.join(cwd, "package");

	const meta = await readJson(path.join(extractedDir, "template.json"));

	// move extractedDir contents into a clean tempDir2
	const finalTemp = await makeTempDir();
	await copyRecursive(extractedDir, finalTemp);

	// cleanup tarball and package dir
	await fs.rm(tarballPath, { force: true });
	await fs.rm(extractedDir, { recursive: true, force: true });

	return { source: "npm", sourceLocator: locator, tempDir: finalTemp, meta };
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
