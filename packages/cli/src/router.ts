import { logger, printHeader } from "@appinit/core";
import { createProject } from "./commands/create.js";
import { parseFlags } from "./core/parse-flags.js";
import { getCliVersion } from "./utils/cli-info.js";
import { formatError } from "./utils/format-error.js";
import { printVersion } from "./utils/node.utils.js";
import { normalizeCommand } from "./utils/normalize-cmd";
import { printHelp } from "./utils/print-help";
import { projectMetaValidation } from "./validation/project-meta.validation";

/**
 * @appinit/cli
 * Rotuer
 * @param argv
 */
export async function router(argv: string[]) {
	const cmd = parseFlags(argv);

	// Always  show header only once per process
	await printHeader({ version: getCliVersion() });

	// Normalize aliases
	const name = normalizeCommand(cmd.name);

	try {
		switch (name) {
			case "create":
				// project name validation
				const projectName = cmd.args[1];
				if (projectName) {
					const parsed = projectMetaValidation.safeParse({
						projectName: cmd.args[1],
						projectType: cmd.flags.projectType,
						template: cmd.flags.template,
					});
					if (!parsed.success) {
						logger.error(formatError(parsed.error));
						process.exit(1);
					}
				}

				await createProject(cmd);
				break;
			case "add":
				// await addCapability(cmd);
				break;
			case "doctor":
				// await runDoctor(cmd);
				break;
			case "deploy":
				// await runDeploy(cmd);
				break;
			case "ai":
				// await runAi(cmd);
				break;
			case "help":
				return printHelp();
			case "version":
				return printVersion();
			case "debug":
				console.log("Debug mode");
				break;
			default:
				logger.warn(`Unknown command "${name}"`);
				printHelp();
		}
	} catch (err: any) {
		logger.error("CLI command failed", err);
		process.exitCode = 1;
	}
}
