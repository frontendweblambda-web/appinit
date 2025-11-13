import { promises as fs } from "fs";

export async function readFileUtf8(path: string) {
	return fs.readFile(path, "utf8");
}
