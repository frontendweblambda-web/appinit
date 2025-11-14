import { parseFlags } from "./core/flags.js";
import { createProject } from "./commands/create.js";

export async function router(argv: string[]) {
	const cmd = parseFlags(argv);

	switch (cmd.name) {
		case "create":
			await createProject(cmd);
			break;
		default:
			console.log(`Appinit CLI\n\nUsage:\n  appinit create <project-name>\n`);
	}
}
