import { log } from "@clack/prompts";
import { TempManager } from "../manager/temp";

export async function ScaffoldProject(options: { debug: boolean }) {
	const { debug } = options;

	const tempManager = new TempManager(debug);
	const tempDir = await tempManager.create();

	try {
		log.info(`⚙ Using temp directory: ${tempDir}`);

		// const template = await loadTemplate(options.template, tempDir);

		// const result = await renderTemplate(template, {
		// 	variables: options.variables,
		// 	dest: options.targetDir,
		// });
	} catch (error) {}
}
