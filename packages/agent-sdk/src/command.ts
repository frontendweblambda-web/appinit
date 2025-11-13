import { exec } from "@appinit/utils";
import type { AgentAction } from "@appinit/types";

export const CommandActions = {
	async run(command: string): Promise<AgentAction> {
		const { stdout, stderr } = await exec(command);
		return {
			type: "command:run",
			success: true,
			data: { stdout, stderr },
			message: `Executed: ${command}`,
		};
	},
};
