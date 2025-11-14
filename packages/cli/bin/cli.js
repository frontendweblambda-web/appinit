#!/usr/bin/env node
const dire = process.cwd();
console.log("HI ai am running", dire);
import("../dist/index.js").catch((err) => {
	console.error("Appinit CLI failed:", err);
	process.exit(1);
});
