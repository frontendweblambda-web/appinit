// packages/utils/src/file.ts

import { existsSync, readFileSync as readFileSyncNative } from "node:fs";
import {
	appendFile,
	cp,
	lstat,
	mkdir,
	readdir,
	readFile,
	rename,
	rm,
	stat,
	writeFile,
} from "node:fs/promises";
import * as path from "node:path";

// ------------------- Basic FS Helpers -------------------

export const pathExists = async (p: string): Promise<boolean> => existsSync(p);

export const writeFileSafe = async (
	filePath: string,
	data: string | Buffer,
) => {
	await mkdir(path.dirname(filePath), { recursive: true });
	return writeFile(filePath, data);
};

export const appendFileSafe = appendFile;

export const deleteFileSafe = async (p: string) =>
	rm(p, { recursive: true, force: true });

export const ensureDir = async (dir: string) => mkdir(dir, { recursive: true });

export const removeDir = async (dir: string) =>
	rm(dir, { recursive: true, force: true });

export const readDir = readdir;

export const move = rename;

export const readFileUtf8 = (p: string): Promise<string> => readFile(p, "utf8");

export const readFileSync = (p: string): string =>
	readFileSyncNative(p, "utf8");

export async function writeFileUtf8(filePath: string, data: string) {
	await mkdir(path.dirname(filePath), { recursive: true });
	await writeFile(filePath, data, "utf8");
}

export async function readJson<T = unknown>(filePath: string): Promise<T> {
	const raw = await readFile(filePath, "utf8");
	return JSON.parse(raw) as T;
}

// ------------------- File & Directory Checks -------------------

export async function isFile(p: string): Promise<boolean> {
	try {
		return (await stat(p)).isFile();
	} catch {
		return false;
	}
}

export async function isDirectory(p: string): Promise<boolean> {
	try {
		return (await stat(p)).isDirectory();
	} catch {
		return false;
	}
}

// ------------------- Listing Files & Directories -------------------

export async function listFiles(dirPath: string): Promise<string[]> {
	const entries = await readdir(dirPath);
	const files: string[] = [];

	for (const entry of entries) {
		const abs = path.join(dirPath, entry);
		if (await isFile(abs)) files.push(entry);
	}

	return files;
}

export async function listDirectories(dirPath: string): Promise<string[]> {
	const entries = await readdir(dirPath);
	const dirs: string[] = [];

	for (const entry of entries) {
		const abs = path.join(dirPath, entry);
		if (await isDirectory(abs)) dirs.push(entry);
	}

	return dirs;
}

// ------------------- Recursive Directory Walk -------------------

export async function readDirRecursive(
	dir: string,
	prefix = "",
	ignore: string[] = [],
): Promise<string[]> {
	const result: string[] = [];
	const items = await readdir(dir);

	await Promise.all(
		items.map(async (item) => {
			const abs = path.join(dir, item);
			const rel = path.join(prefix, item).replace(/\\/g, "/");

			// No minimatch — simple ignore check
			if (ignore.some((pattern) => rel.includes(pattern))) return;

			const statItem = await lstat(abs);
			if (statItem.isSymbolicLink()) return; // skip symlinks

			if (statItem.isDirectory()) {
				const nested = await readDirRecursive(abs, rel, ignore);
				result.push(...nested);
			} else {
				result.push(rel);
			}
		}),
	);

	return result;
}

export async function walkFiles(
	dir: string,
	ignore: string[] = [],
): Promise<string[]> {
	return readDirRecursive(dir, "", ignore);
}

// ------------------- Copy with safety -------------------

export const copySafe = async (
	src: string,
	dest: string,
	options?: {
		overwrite?: boolean;
		errorOnExist?: boolean;
	},
): Promise<void> => {
	await mkdir(path.dirname(dest), { recursive: true });
	await cp(src, dest, {
		recursive: true,
		force: !(options?.errorOnExist ?? false),
	});
};

export async function copyDir(srcDir: string, destDir: string) {
	await mkdir(destDir, { recursive: true });

	const entries = await readdir(srcDir, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(srcDir, entry.name);
		const destPath = path.join(destDir, entry.name);

		if (entry.isDirectory()) {
			await copyDir(srcPath, destPath);
		} else if (entry.isFile()) {
			await copySafe(srcPath, destPath);
		}
	}
}
