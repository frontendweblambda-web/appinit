import { theme } from "@appinit/core";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Copies a template folder into the target directory.
 * Works for monorepo structure — supports running from src or dist.
 */
export const copyTemplate = async (templateName: string, targetDir: string) => {
	try {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);

		// Try multiple possible monorepo roots (dev + build)
		const possibleRoots = [
			path.resolve(__dirname, "../../../../"), // when running dist in packages/engine
			path.resolve(__dirname, "../../../"), // when running src in packages/engine
			path.resolve(process.cwd()), // fallback (for linked CLI)
		];

		let projectRoot: string | null = null;

		for (const root of possibleRoots) {
			if (await fs.pathExists(path.join(root, "templates"))) {
				projectRoot = root;
				break;
			}
		}

		if (!projectRoot) {
			throw new Error(
				"❌ Could not locate project root containing /templates folder.",
			);
		}

		const templatePath = path.join(projectRoot, "templates", templateName);

		if (!(await fs.pathExists(templatePath))) {
			throw new Error(`❌ Template not found: ${templatePath}`);
		}

		theme.info(`📂 Copying template from: ${templatePath}`);

		await fs.copy(templatePath, targetDir, {
			filter: (src) =>
				!src.includes("node_modules") &&
				!src.includes(".next") &&
				!src.includes(".git"),
		});

		theme.success(`✅ Template copied to ${targetDir}`);
	} catch (err: any) {
		console.error("❌ Failed to copy template:", err.message);
		process.exit(1);
	}
};
