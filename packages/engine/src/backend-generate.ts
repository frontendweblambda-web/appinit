import path from "path";
import chalk from "chalk";

import { Answers } from "@appinit/types";
import { copyTemplate } from "./common/copy.js";

import { mergeJson, pathExists, removeDir, ensureDir } from "@appinit/utils";
import { isBackend, getPackageManager } from "@appinit/core";
export async function generateBackend(answers: Answers) {
	if (!isBackend(answers)) return; // skip if not backend

	const { backend, orm, database, api, projectName } = answers;
	const targetDir = path.resolve(process.cwd(), projectName);
	// === Step 1: Base backend ===backend

	await ensureDir(targetDir);
	const baseTemplate = `backend/${backend}/base`;
	await copyTemplate(baseTemplate, targetDir);

	console.log(
		chalk.cyan(`🧱 Generating backend (${backend}) in ${targetDir}...`),
	);

	// === Step 2: Database integration ===
	if (database && database !== "none") {
		await copyTemplate(`backend/db/${database}`, targetDir);
	}

	// === Step 3: ORM ===
	if (orm && orm !== "none") {
		await copyTemplate(`backend/orm/${orm}`, targetDir);
	}

	// === Step 4: API style (REST, GraphQL, etc.) ===
	if (api && api !== "none") {
		await copyTemplate(`backend/api/${api}`, targetDir);
	}
	// === Step 5: Merge package.json ===
	const pkgFragment = path.join(targetDir, "backend.pkg.json");
	if (await pathExists(pkgFragment)) {
		mergeJson(targetDir, pkgFragment);
		await removeDir(pkgFragment);
	}

	// === Step 6: Install dependencies ===
	const pm = await getPackageManager();
	try {
		await pm.install(["install"]);

		console.log(chalk.green("✅ Backend dependencies installed"));
	} catch (err: any) {
		console.log(
			chalk.red("⚠️ Backend dependency install failed:"),
			err.message,
		);
	}

	console.log(chalk.greenBright("✅ Backend setup complete!\n"));
}
