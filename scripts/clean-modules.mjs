#!/usr/bin/env node
import { rm } from "node:fs/promises";
import path from "node:path";

async function cleanModules() {
	console.log("🧨 Cleaning all node_modules across monorepo...");
	// Match all node_modules in root + sub-packages

	const patterns = [
		"node_modules",
		"packages/*/node_modules",
		"apps/*/node_modules",
		"templates/*/node_modules",
		"plugins/*/node_modules",
		"packages/*/dist",
		"packages/*/build",
		"packages/*/lib",
		"apps/*/dist",
		"apps/*/build",
		"templates/*/dist",
		"plugins/*/dist",
	];

	const modules = [];
	for (const pattern of patterns) {
		for await (const match of import(pattern)) {
			console.log("match", m, match);
			modules.push(match);
		}
	}

	if (modules.length === 0) {
		console.log("✔ Nothing to remove.");
		return;
	}
	for (const dir of modules) {
		const full = path.resolve(dir);
		try {
			await rm(full, { recursive: true, force: true });
			console.log(`🗑️  Removed: ${full}`);
		} catch (err) {
			console.warn(`⚠️ Failed to remove ${full}`, err);
		}
	}

	console.log("🧨 Removed node_modules!");
}

cleanModules();
