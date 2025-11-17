#!/usr/bin/env node
import { router } from "./router.js";

/**
 * Starting point
 */
async function main() {
	try {
		await router(process.argv);
	} catch (err) {
		console.error("Fatal CLI error:", err);
		process.exit(1);
	}
}

main();
