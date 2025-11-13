import { promises as fs } from "fs";
import path from "path";

export async function writeFileUtf8(filePath: string, data: string) {
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, data, "utf8");
}
