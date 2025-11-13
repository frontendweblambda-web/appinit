// packages/@appinit/utils/shell.ts

import os from "node:os";
import process from "node:process";

/**
 * Detect the most appropriate shell on this machine.
 * Priority:
 * 1. User's defined shell (macOS/Linux)
 * 2. Windows COMSPEC (PowerShell/cmd)
 * 3. Fallback to /bin/sh or cmd.exe
 */
export function detectShell(): string {
	// 1. macOS / Linux user login shell
	if (process.env.SHELL) {
		return process.env.SHELL;
	}

	// 2. Windows user shell (PowerShell or CMD)
	if (process.env.COMSPEC) {
		return process.env.COMSPEC;
	}

	// 3. CI/CD fallback (safe)
	if (process.platform === "win32") {
		return "cmd.exe";
	}

	// 4. Universal POSIX fallback
	return "/bin/sh";
}

/**
 * Cached shell (prevents re-detection)
 */
export const DEFAULT_SHELL = detectShell();
