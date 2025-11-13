import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execa } from "execa";
import {
	mergeJson,
	getPackageManager,
	pathExists,
	readJson,
} from "@appinit/utils";
import { copyTemplate } from "./common/copy";

/**
 * Generates a fully configured React template.
 * - Copies base + UI templates
 * - Merges package fragments
 * - Ensures correct type setup and dependencies
 */
export const generateReactTemplate = async (targetDir: string, ui: string) => {
	// console.log(chalk.cyan("🧱 Generating base React project..."));
	await copyTemplate("react/base", targetDir);

	// === Step 1: Apply UI template if selected ===
	if (ui && ui !== "none") {
		console.log(chalk.cyan(`🎨 Applying ${ui} UI configuration...`));
		await copyTemplate(`react/ui/${ui}`, targetDir);

		const pkgFragment = path.join(targetDir, `${ui}.pkg.json`);
		if (await pathExists(pkgFragment)) {
			mergeJson(targetDir, pkgFragment);
			await fs.remove(pkgFragment);
			// console.log(chalk.green(`✅ Merged ${ui}.pkg.json into package.json`));
		}
	}

	// === Step 2: Ensure "type": "module" in package.json ===
	const pkgPath = path.join(targetDir, "package.json");
	if (await pathExists(pkgPath)) {
		const pkg = await readJson(pkgPath);
		pkg.type = pkg.type || "module"; // ensure ESM mode
		await fs.writeJson(pkgPath, pkg, { spaces: 2 });
		// console.log(chalk.gray(`🧩 Ensured "type": "module" in package.json`));
	}

	// === Step 3: Ensure required type dependencies ===
	const pm = await getPackageManager(targetDir);
	const deps = ["@types/react", "@types/react-dom", "typescript"];

	// console.log(chalk.cyan(`📦 Ensuring required dev dependencies...`));
	try {
		await pm.install(deps);
		if (pm.name === "npm") await pm.runRaw(["audit", "fix", "--force"]);
		console.log(chalk.green(`✅ Installed React type packages successfully`));
	} catch (err: any) {
		console.log(chalk.red(`⚠️ Failed to auto-install types:`), err.message);
	}

	console.log(chalk.greenBright("✅ React template setup complete!\n"));
};
