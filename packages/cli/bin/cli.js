#!/usr/bin/env node
import("../dist/index.js").catch((err) => {
	console.error("Appinit CLI failed:", err);
	process.exit(1);
});
