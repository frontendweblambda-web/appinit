import fg from "fast-glob";
import { rm } from "fs/promises";

async function cleanGenerated() {
	const patterns = [
		"packages/**/src/**/*.js",
		"packages/**/src/**/*.d.ts",
		"packages/**/src/**/*.js.map",
		"packages/**/src/**/*.tsbuildinfo",

		"apps/**/src/**/*.js",
		"apps/**/src/**/*.d.ts",
		"apps/**/src/**/*.js.map",
		"apps/**/src/**/*.tsbuildinfo",
	];

	const files = await fg(patterns, { dot: true });

	for (const file of files) {
		await rm(file, { force: true });
		console.log("🧹 Removed:", file);
	}
}

cleanGenerated();
