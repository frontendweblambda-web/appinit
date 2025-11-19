import fs from "fs-extra";
import path from "node:path";

/**
 * Check whether a file or folder exists.
 */
export async function pathExists(filePath: string) {
	return await fs.pathExists(filePath);
}

/**
 * Write a file safely by creating missing directories.
 */
export async function writeFileSafe(filePath: string, content: string) {
	await fs.outputFile(filePath, content);
}

/**
 * Append to a file safely (creates file if missing).
 */
export async function appendFileSafe(filePath: string, content: string) {
	await fs.appendFile(filePath, content);
}

/**
 * Delete file or folder safely.
 */
export async function deleteFileSafe(filePath: string) {
	await fs.remove(filePath);
}

/**
 * Resolve absolute path from cwd.
 */
export function resolvePath(cwd: string, filePath: string) {
	return path.resolve(cwd, filePath);
}

/**
 * Read a JSON file without validation.
 */
export async function readJson<T = any>(filePath: string): Promise<T> {
	return await fs.readJson(filePath);
}

/**
 * Read UTF-8 text file.
 */
export async function readFileUtf8(filePath: string) {
	return await fs.readFile(filePath, "utf8");
}

export function readFileSync(filePath: string) {
	return fs.readFileSync(filePath, "utf8");
}

/**
 * Write UTF-8 file, creating parent directories automatically.
 */
export async function writeFileUtf8(filePath: string, data: string) {
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, data, "utf8");
}

/**
 * Copy a file or folder safely.
 */
export async function copySafe(
	src: string,
	dest: string,
	options?: fs.CopyOptions | undefined,
) {
	await fs.copy(src, dest, {
		overwrite: true,
		errorOnExist: false,
		...options,
	});
}

/**
 * Ensure a directory exists.
 */
export async function ensureDir(dirPath: string) {
	return await fs.ensureDir(dirPath);
}

/**
 * Remove a directory (safe).
 */
export async function removeDir(dirPath: string) {
	return await fs.remove(dirPath);
}

/**
 * Read directory (list files/folders).
 */
export async function readDir(dirPath: string) {
	return await fs.readdir(dirPath);
}

/**
 * Check if path is a directory.
 */
export async function isDirectory(pathStr: string) {
	try {
		const stats = await fs.stat(pathStr);
		return stats.isDirectory();
	} catch {
		return false;
	}
}

/**
 * Check if path is a file.
 */
export async function isFile(pathStr: string) {
	try {
		const stats = await fs.stat(pathStr);
		return stats.isFile();
	} catch {
		return false;
	}
}

export async function writeJson(
	CONFIG_FILE: string,
	data: Record<string, any>,
) {
	return fs.writeJSON(CONFIG_FILE, { lastCreate: data }, { spaces: 2 });
}
