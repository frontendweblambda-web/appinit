import { exec as childExec } from "node:child_process";
import { promisify } from "node:util";

const execPromise = promisify(childExec);

export async function exec(cmd: string, cwd?: string) {
	return execPromise(cmd, { shell: "true", cwd });
}
