import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execa } from "execa";

import { Answers } from "@appinit/types";
import { copyTemplate } from "./common/copy.js";
import { mergePackageJson } from "./common/merge-package-json.js";

export async function generateBackend(answers: Answers) {
	console.log(
		chalk.cyan(`🧱 Generating backend (${answers.backendFramework})...`),
	);

	const { backendFramework, orm, database, apiStyle } = answers;
	const targetDir = path.resolve(process.cwd(), answers.projectName);

	// === Step 1: Base backend ===
	const baseTemplate = `backend/${backendFramework}/base`;
	await copyTemplate(baseTemplate, targetDir);

	// === Step 2: Database integration ===
	if (database && database !== "none") {
		await copyTemplate(`backend/db/${database}`, targetDir);
	}

	// === Step 3: ORM ===
	if (orm && orm !== "none") {
		await copyTemplate(`backend/orm/${orm}`, targetDir);
	}

	// === Step 4: API style (REST, GraphQL, etc.) ===
	if (apiStyle && apiStyle !== "none") {
		await copyTemplate(`backend/api/${apiStyle}`, targetDir);
	}

	// === Step 5: Merge package.json ===
	const pkgFragment = path.join(targetDir, "backend.pkg.json");
	if (await fs.pathExists(pkgFragment)) {
		await mergePackageJson(targetDir, pkgFragment);
		await fs.remove(pkgFragment);
	}

	// === Step 6: Install dependencies ===
	const pm = detectPackageManager();
	try {
		await execa(pm, ["install"], { cwd: targetDir, stdio: "inherit" });
		console.log(chalk.green("✅ Backend dependencies installed"));
	} catch (err: any) {
		console.log(
			chalk.red("⚠️ Backend dependency install failed:"),
			err.message,
		);
	}

	console.log(chalk.greenBright("✅ Backend setup complete!\n"));
}
