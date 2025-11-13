import path from "path";
import { readFileUtf8 } from "../file";

export async function readPackageJson(folder: string) {
	const p = path.join(folder, "package.json");
	const raw = await readFileUtf8(p);
	return JSON.parse(raw);
}
