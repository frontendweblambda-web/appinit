import fs from "fs-extra";
import path from "node:path";
import { joinPath } from "./path";
import { minimatch } from "minimatch";

export const pathExists = fs.pathExists;
export const writeFileSafe = fs.outputFile;
export const appendFileSafe = fs.appendFile;
export const deleteFileSafe = fs.remove;

export const readFileUtf8 = (p: string) => fs.readFile(p, "utf8");
export const readFileSync = (p: string) => fs.readFileSync(p, "utf8");

export async function writeFileUtf8(filePath: string, data: string) {
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, data, "utf8");
}

export const copySafe = async (
	src: string,
	dest: string,
	opts?: fs.CopyOptions,
) => fs.copy(src, dest, { overwrite: true, errorOnExist: false, ...opts });

export async function isFile(pathStr: string) {
	try {
		return (await fs.stat(pathStr)).isFile();
	} catch {
		return false;
	}
}

export async function listFiles(dirPath: string): Promise<string[]> {
	const entries = await fs.readdir(dirPath);
	const files: string[] = [];

	for (const entry of entries) {
		const abs = joinPath(dirPath, entry);
		if (await isFile(abs)) files.push(entry);
	}

	return files;
}

export const ensureDir = fs.ensureDir;
export const removeDir = fs.remove;
export const readDir = fs.readdir;

export async function isDirectory(pathStr: string): Promise<boolean> {
	try {
		return (await fs.stat(pathStr)).isDirectory();
	} catch {
		return false;
	}
}

export async function listDirectories(dirPath: string): Promise<string[]> {
	const entries = await fs.readdir(dirPath);
	const dirs: string[] = [];

	for (const entry of entries) {
		const abs = joinPath(dirPath, entry);
		if (await isDirectory(abs)) dirs.push(entry);
	}

	return dirs;
}

export async function readDirRecursive(
	dir: string,
	prefix = "",
	ignore: string[] = [],
): Promise<string[]> {
	const result: string[] = [];
	const items = await fs.readdir(dir);
	await Promise.all(
		items.map(async (item) => {
			const abs = path.join(dir, item);
			const rel = path.join(prefix, item).replace(/\\/g, "/");
			if (ignore.some((pattern) => minimatch(rel, pattern))) return;
			const stat = await fs.lstat(abs);
			if (stat.isSymbolicLink()) return; // skip symlinks for safety (optionally allow)
			if (stat.isDirectory()) {
				const nested = await readDirRecursive(abs, rel, ignore);
				result.push(...nested);
			} else {
				result.push(rel);
			}
		}),
	);
	return result;
}
export async function walkFiles(dir: string, ignore: string[] = []) {
	return readDirRecursive(dir, "", ignore);
}

export const move = fs.move;
export async function readJson(filePath: string) {
	return fs.readJson(filePath);
}
