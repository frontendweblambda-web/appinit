import { exec } from "node:child_process";
import { promisify } from "node:util";
const execAsync = promisify(exec);

let cachedLatest: string | null = null;

export async function checkUpdate(currentVersion: string) {
	if (cachedLatest !== null) return cachedLatest;

	execAsync("npm view @appinit/cli version")
		.then((res) => {
			const latest = res.stdout.trim();
			cachedLatest = latest !== currentVersion ? latest : null;
		})
		.catch(() => {
			cachedLatest = null;
		});

	return null; // don't block CLI startup
}
