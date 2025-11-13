import { rm } from "fs/promises";

async function cleanCache() {
	const dirs = [".turbo", "node_modules/.pnpm-store"];

	for (const dir of dirs) {
		await rm(dir, { recursive: true, force: true }).catch(() => {});
		console.log("🧹 Removed cache:", dir);
	}
}

cleanCache();
