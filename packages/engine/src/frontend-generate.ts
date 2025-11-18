import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

import { Answers } from "@appinit/types";
import { copyTemplate } from "./common/copy.js";
import { isFrontend, getPackageManager } from "@appinit/core";
import { mergeJson, pathExists } from "@appinit/utils";

export async function generateFrontend(answers: Answers) {
	if (!isFrontend(answers)) return; // skip if not backend

	const {
		framework,
		ui,
		routing,
		store,
		lintingTool,
		formattingTool,
		projectName,
		targetDir: targetDirOpt,
	} = answers;

	if (!framework || framework === "none") {
		console.log(
			chalk.red(
				"⚠️ No frontend framework selected! Skipping frontend generation.",
			),
		);
		return;
	}

	const targetDir = path.resolve(process.cwd(), targetDirOpt || projectName);

	console.log(
		chalk.cyan(`⚛️ Generating ${framework} frontend in: ${targetDir}`),
	);

	// === Step 1: Copy base framework template ===
	const baseTemplate = `frontend/${framework}/base`;
	console.log(chalk.cyan(`📦 Copying base framework template...`));
	await copyTemplate(baseTemplate, targetDir);

	// === Step 2: Apply UI library if selected ===
	if (ui && ui !== "none") {
		console.log(chalk.cyan(`🎨 Adding UI library: ${ui}`));
		await copyTemplate(`frontend/${framework}/ui/${ui}`, targetDir);

		const pkgFragment = path.join(targetDir, `${ui}.pkg.json`);
		if (await pathExists(pkgFragment)) {
			await mergeJson(targetDir, pkgFragment);
			await fs.remove(pkgFragment);
			console.log(chalk.gray(`🧩 Merged ${ui}.pkg.json`));
		}
	}

	// === Step 3: Routing setup ===
	if (routing && routing !== "none") {
		console.log(chalk.cyan(`🛣️ Adding routing: ${routing}`));
		await copyTemplate(`frontend/${framework}/routing/${routing}`, targetDir);
	}

	// === Step 4: State management / store ===
	if (store && store !== "none") {
		console.log(chalk.cyan(`🗄 Adding state management: ${store}`));
		await copyTemplate(`frontend/${framework}/store/${store}`, targetDir);
	}

	// === Step 5: Linting & formatting ===
	if (lintingTool && lintingTool !== "none") {
		console.log(chalk.cyan(`🧹 Applying linting: ${lintingTool}`));
		await copyTemplate(`common/lint/${lintingTool}`, targetDir);
	}
	if (formattingTool && formattingTool !== "none") {
		console.log(chalk.cyan(`🎨 Applying formatting: ${formattingTool}`));
		await copyTemplate(`common/format/${formattingTool}`, targetDir);
	}

	// === Step 6: Ensure package.json has type module ===
	const pkgPath = path.join(targetDir, "package.json");
	if (await fs.pathExists(pkgPath)) {
		const pkg = await fs.readJson(pkgPath);
		pkg.type = pkg.type || "module";
		await fs.writeJson(pkgPath, pkg, { spaces: 2 });
	}

	// === Step 7: Install TypeScript & type dependencies ===
	const pm = await getPackageManager();
	const deps = ["typescript", "@types/node"];
	const installArgs =
		pm.name === "npm"
			? ["install", "--save-dev", ...deps]
			: ["add", "-D", ...deps];

	try {
		console.log(
			chalk.cyan("📥 Installing TypeScript and type dependencies..."),
		);
		pm.install(installArgs);
		console.log(chalk.green("✅ Installed TypeScript types"));
	} catch (err: any) {
		console.log(chalk.red("⚠️ Failed to install types:"), err.message);
	}

	console.log(chalk.greenBright("✅ Frontend setup complete!\n"));
}
