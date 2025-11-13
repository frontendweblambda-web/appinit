import fs from "fs-extra";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const source = path.join(__dirname, "..", "bin", "cli.js");
const target = path.join(__dirname, "..", "dist", "cli.js");

async function copyCLI() {
	if (!fs.existsSync(source)) {
		console.error("❌ CLI entrypoint not found:", source);
		process.exit(1);
	}

	await fs.ensureDir(path.dirname(target));
	await fs.copyFile(source, target);

	// Make file executable on Unix-like systems
	try {
		await fs.chmod(target, 0o755);
	} catch {
		// ignore on windows
	}

	console.log("✔ CLI copied to dist:", target);
}

copyCLI();
