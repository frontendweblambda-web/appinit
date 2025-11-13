import { logger } from "@appinit/utils";
import { runInit } from "./commands/init";
import { runNew } from "./commands/new";
import { runDoctor } from "./commands/doctor";

const args = process.argv.slice(2);
const cmd = args[0];

async function main() {
	switch (cmd) {
		case "init":
			await runInit();
			break;

		case "new":
			await runNew();
			break;

		case "doctor":
			await runDoctor();
			break;

		default:
			logger.error(`Unknown command: ${cmd}`);
			logger.info(`Available commands: init, new, doctor`);
	}
}

main();
