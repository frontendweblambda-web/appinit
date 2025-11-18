// @appinit/utils/env/env.ts
import { isatty } from "node:tty";

/**
 * Check if terminal is TTY (interactive terminal)
 */
export const isTTY: boolean = Boolean(
	process.stdout && process.stdout.isTTY && isatty(1),
);
