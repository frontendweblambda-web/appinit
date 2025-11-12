import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execa } from "execa";

import { Answers } from "@appinit/types";
import { copyTemplate } from "./common/copy.js";
import { mergePackageJson } from "./common/merge-package-json.js";

export async function generateFrontend(answers: Answers) {
	console.log(chalk.cyan(`⚛️ Generating ${answers.framework} frontend...`));

	const { framework, ui } = answers;
	const targetDir = path.resolve(process.cwd(), answers.projectName);

	// === Step 1: Base framework template ===
	const baseTemplate = `frontend/${framework}/base`;
	await copyTemplate(baseTemplate, targetDir);

	// === Step 2: Apply UI library ===
	if (ui && ui !== "none") {
		console.log(chalk.cyan(`🎨 Adding UI: ${ui}`));
		await copyTemplate(`frontend/${framework}/ui/${ui}`, targetDir);

		const pkgFragment = path.join(targetDir, `${ui}.pkg.json`);
		if (await fs.pathExists(pkgFragment)) {
			await mergePackageJson(targetDir, pkgFragment);
			await fs.remove(pkgFragment);
			console.log(chalk.gray(`🧩 merged ${ui}.pkg.json`));
		}
	}

	// === Step 3: Routing ===
	if (answers.routing && answers.routing !== "none") {
		await copyTemplate(
			`frontend/${framework}/routing/${answers.routing}`,
			targetDir,
		);
	}

	// === Step 4: State management ===
	if (answers.store && answers.store !== "none") {
		await copyTemplate(
			`frontend/${framework}/store/${answers.store}`,
			targetDir,
		);
	}

	// === Step 5: Linting & formatting ===
	if (answers.linting !== "none") {
		await copyTemplate(`common/lint/${answers.linting}`, targetDir);
	}
	if (answers.formatting !== "none") {
		await copyTemplate(`common/format/${answers.formatting}`, targetDir);
	}

	// === Step 6: Ensure “type”: “module” in package.json ===
	const pkgPath = path.join(targetDir, "package.json");
	if (await fs.pathExists(pkgPath)) {
		const pkg = await fs.readJson(pkgPath);
		pkg.type = pkg.type || "module";
		await fs.writeJson(pkgPath, pkg, { spaces: 2 });
	}

	// === Step 7: Install TypeScript & type dependencies ===
	const pm = detectPackageManager();
	const deps = ["typescript", "@types/node"];

	try {
		await execa(pm, ["add", "-D", ...deps], {
			cwd: targetDir,
			stdio: "inherit",
		});
		console.log(chalk.green("✅ Installed TypeScript types"));
	} catch (err: any) {
		console.log(chalk.red("⚠️ Failed to install types:"), err.message);
	}

	console.log(chalk.greenBright("✅ Frontend setup complete!\n"));
}
