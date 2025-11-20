import { logger, printHeader } from "@appinit/core";
import pkg from "../package.json" assert { type: "json" };
import { createProject } from "./commands/create.js";
import { parseFlags } from "./core/parse-flags.js";
import { printVersion } from "./utils/node.utils.js";
import { normalizeCommand } from "./utils/normalize-cmd";
import { printHelp } from "./utils/print-help";
/**
 * @appinit/cli
 * Rotuer
 * @param argv
 */
export async function router(argv: string[]) {
	const cmd = parseFlags(argv);

	// Always  show header only once per process
	await printHeader({ version: pkg.version ?? cmd.flags?.version! });

	logger.debug("Parsed command", cmd);

	// Normalize aliases
	const name = normalizeCommand(cmd.name);

	try {
		switch (name) {
			case "create":
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

			default:
				logger.warn(`Unknown command "${name}"`);
				printHelp();
		}
	} catch (err: any) {
		logger.error("CLI command failed", err);
		process.exitCode = 1;
	}
}
