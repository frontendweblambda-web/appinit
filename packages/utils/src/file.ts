import fs from "fs-extra";
import path from "node:path";

export async function writeFileSafe(filePath: string, content: string) {
	await fs.outputFile(filePath, content);
}

export async function appendFileSafe(filePath: string, content: string) {
	await fs.appendFile(filePath, content);
}

export async function deleteFileSafe(filePath: string) {
	await fs.remove(filePath);
}

export function resolvePath(cwd: string, filePath: string) {
	return path.resolve(cwd, filePath);
}

export async function readFileUtf8(path: string) {
	return fs.readFile(path, "utf8");
}

export async function writeFileUtf8(filePath: string, data: string) {
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, data, "utf8");
}
