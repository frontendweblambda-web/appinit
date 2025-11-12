import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import chalk from "chalk";
export async function resolveTemplate(templateName: string): Promise<string> {
	// 1️⃣ Local templates (e.g., templates/react/base)
	const localTemplate = path.resolve(process.cwd(), "templates", templateName);

	if (await fs.pathExists(localTemplate)) {
		console.log(chalk.cyan(`📦 Using local template: ${templateName}`));
		return Promise.resolve(localTemplate);
	}

	// 2️⃣ NPM templates (e.g., @appinit/template-react)
	if (templateName.startsWith("@") || !templateName.includes("/")) {
		const tempDir = path.resolve(
			process.cwd(),
			".appinit-cache",
			templateName.replace("/", "_"),
		);
		console.log(chalk.cyan(`📦 Fetching from npm: ${templateName}`));
		await execa("pnpm", ["dlx", `${templateName}@latest`, tempDir]);
		return tempDir;
	}

	// 3️⃣ Git templates (e.g., github:user/repo#branch)
	if (templateName.startsWith("github:") || templateName.startsWith("git@")) {
		const repoUrl = templateName.replace("github:", "https://github.com/");
		const tempDir = path.resolve(
			process.cwd(),
			".appinit-cache",
			path.basename(repoUrl),
		);
		console.log(chalk.cyan(`📦 Cloning from Git: ${repoUrl}`));
		await execa("git", ["clone", repoUrl, tempDir]);
		return tempDir;
	}

	// 4️⃣ Marketplace (future)
	if (templateName.startsWith("appinit:")) {
		console.log(
			chalk.yellow(`🧠 Fetching from Appinit Registry: ${templateName}`),
		);
		// Placeholder for registry API call
		// const registryPath = await fetchTemplateFromRegistry(templateName);
		// return registryPath;
		throw new Error("Marketplace template support coming soon!");
	}

	throw new Error(`❌ Unknown template source: ${templateName}`);
}
