import { createSpinner } from "@appinit/core";
import type { AppinitConfig, CLICommand } from "@appinit/types";
import { joinPath } from "@appinit/utils";
import { log } from "@clack/prompts";
import os from "os";
import { getCliName, getCliVersion } from "../utils/cli-info.js";

/**
 * Appinit configuration
 * @param cmd
 * @returns
 */

export async function buildContext(cmd: CLICommand): Promise<AppinitConfig> {
	// const saved = await loadUserConfig(); // load existing configuration
	const cwd = process.cwd(); // user current directory
	const cacheDir = joinPath(os.homedir(), ".appinit/cache");
	const sp = createSpinner({
		color: "brand",
		text: `Running ${cmd.name}...`,
	});
	const ctx: AppinitConfig = {
		cliCommand: cmd ?? {},
		command: cmd.name,
		cwd,
		cacheDir: cacheDir,
		cliName: getCliName(),
		cliVersion: process.env.APPINIT_CLI_VERSION ?? getCliVersion(),
		runtime: "cli",
		outputMode: cmd.flags.json ? "json" : "text",
		skipDefaultPacks: cmd.flags.skipDefaultPacks,
		interactive: !cmd.flags.nonInteractive,
		sp: sp,
		log: log,
	};

	return ctx;
}
