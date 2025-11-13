import fg from "fast-glob";
import { rm } from "fs/promises";

async function cleanDist() {
	const patterns = ["packages/**/dist", "apps/**/dist"];
	const dirs = await fg(patterns, { onlyDirectories: true });

	for (const dir of dirs) {
		await rm(dir, { recursive: true, force: true });
		console.log("🗑️ Removed dist:", dir);
	}
}

cleanDist();
