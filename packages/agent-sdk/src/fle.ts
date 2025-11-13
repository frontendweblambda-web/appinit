import type { AgentAction } from "@appinit/types";
import { writeFileSafe, appendFileSafe, deleteFileSafe } from "@appinit/utils";

export const FileActions = {
	async writeFile(filePath: string, content: string): Promise<AgentAction> {
		await writeFileSafe(filePath, content);
		return {
			type: "file:write",
			success: true,
			message: `Wrote file ${filePath}`,
		};
	},

	async appendFile(filePath: string, content: string): Promise<AgentAction> {
		await appendFileSafe(filePath, content);
		return {
			type: "file:append",
			success: true,
			message: `Appended to file ${filePath}`,
		};
	},

	async deleteFile(filePath: string): Promise<AgentAction> {
		await deleteFileSafe(filePath);
		return {
			type: "file:delete",
			success: true,
			message: `Deleted file ${filePath}`,
		};
	},
};
