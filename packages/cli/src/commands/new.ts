import { parseFlags } from "../flags.js";
import { logger } from "@appinit/utils";

/**
 * command:
 * appinit new
 * @param argv
 */
export async function cmdNew(argv: string[]) {
	const { args, flags } = parseFlags(argv);

	const projectArg = args[0] ?? null;

	// Load config file if provided
	let configFromFile: Record<string, any> | null = null;
}
