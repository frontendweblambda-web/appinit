import { rm } from "fs/promises";

async function cleanModules() {
	await rm("node_modules", { recursive: true, force: true }).catch(() => {});
	console.log("🧨 Removed node_modules!");
}

cleanModules();
