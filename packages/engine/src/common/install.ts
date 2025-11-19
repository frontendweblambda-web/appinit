import { spinner } from "@clack/prompts";

import { detectPackageManager, runCommand } from "@appinit/core";

export const runInstaller = async (cwd: string) => {
	const manager = await detectPackageManager(cwd);

	const s = spinner();

	s.start(`Installing with ${manager}...`);
	try {
		const args = manager === "yarn" ? ["install"] : ["install"];
		await runCommand(manager, args, { cwd });
		s.message(`Dependencies installed with ${manager}`);
	} catch (err) {
		s.message("Install failed");
		throw err;
	} finally {
		s.stop();
	}
};
