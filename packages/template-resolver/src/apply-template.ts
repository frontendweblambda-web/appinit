// packages/template-resolver/src/applyTemplate.ts
import path from "path";
import fs from "fs-extra";
import { mergeJson } from "@appinit/utils";

import type {
	ResolvedTemplate,
	TemplateContext,
	ResolveOptions,
	Language,
	Answers,
} from "@appinit/types";
import { isFrontend } from "@appinit/core";

/**
 * Apply the resolved template VFS to a target directory.
 */
export async function applyTemplate(
	template: ResolvedTemplate,
	targetDir: string,
	options: ResolveOptions,
) {
	const {
		language = template.language,
		mergeStrategy = "overwrite",
		inlineVariables = {},
		framework,
		ui,
	} = options;

	const files = template.files;
	const variables = template.variables ?? {};

	await fs.ensureDir(targetDir);

	// Construct TemplateContext for hooks
	const context: TemplateContext = {
		targetDir,
		projectName: options.projectName ?? "",
		language,
		answers: options.answers as Answers,
		variables,
		files,
		framework: isFrontend(options.answers!)
			? options.answers.framework
			: "react",
		ui,
		inlineVariables,
		tempDir: template.tempDir,
		templateDir: template.templateDir,
		meta: template.meta ?? undefined,
		fs,
		log: {
			info: (m: string) => console.log(m),
			warn: (m: string) => console.warn(m),
			error: (m: string) => console.error(m),
		},
	};

	// -----------------------------------------------------
	// HOOK: beforeWrite from template module
	// -----------------------------------------------------
	if (template.templateModule?.beforeWrite) {
		await template.templateModule.beforeWrite(context);
	}

	// -----------------------------------------------------
	// WRITE ALL FILES
	// -----------------------------------------------------
	for (const [rel, raw] of files.entries()) {
		// 1️⃣ Skip via filter()
		if (template.templateModule?.filter) {
			const ok = await template.templateModule.filter(context, rel);
			if (!ok) continue;
		}

		// 2️⃣ Apply variables (simple {{var}} replacement)
		const content = applyVariables(raw, variables);

		// 3️⃣ Convert TS → JS if JavaScript mode
		const finalPath = convertFileExtension(rel, language);
		const absPath = path.join(targetDir, finalPath);

		await fs.ensureDir(path.dirname(absPath));

		// 4️⃣ Handle merge strategies for package.json and JSON
		if (mergeStrategy !== "overwrite") {
			const shouldMerge =
				finalPath.endsWith(".json") ||
				finalPath.endsWith("package.json") ||
				finalPath.endsWith(".config.json");

			if (shouldMerge && (await fs.pathExists(absPath))) {
				const existing = JSON.parse(await fs.readFile(absPath, "utf8"));
				const patch = JSON.parse(content);

				const merged = mergeJson(existing, patch);
				await fs.writeFile(absPath, JSON.stringify(merged, null, 2));
				continue;
			}
		}

		// 5️⃣ Write file normally
		await fs.writeFile(absPath, content);
	}

	// -----------------------------------------------------
	// HOOK: afterWrite from template module
	// -----------------------------------------------------
	if (template.templateModule?.afterWrite) {
		await template.templateModule.afterWrite(context);
	}
}

function applyVariables(content: string, vars: Record<string, any>): string {
	return content.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
		return String(vars[key] ?? "");
	});
}
function convertFileExtension(rel: string, language: Language) {
	if (language === "javascript") {
		return rel.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js");
	}
	return rel;
}
