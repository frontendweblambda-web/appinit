import { execSync } from "node:child_process";

export function checkUpdate(currentVersion: string) {
	try {
		const output = execSync("npm view @appinit/cli version", { stdio: "pipe" })
			.toString()
			.trim();

		return output && output !== currentVersion ? output : null;
	} catch {
		return null;
	}
}
