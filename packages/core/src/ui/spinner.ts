// @appinit/utils/ui/spinner.ts
import {
	AppInitColor,
	AppInitSpinnerOptions,
	SpinnerInstance,
} from "@appinit/types";
import { spinner as clackSpinner } from "@clack/prompts";
import { isCI, isTTY } from "../env";
import { appColor, theme } from "../theme";

/**
 * AppInit Wrapper Spinner
 * -----------------------
 * Consistent UX:
 *  - CI-safe
 *  - TTY-safe
 *  - Centralized styling
 *  - Theme-aware
 *  - Future-proof for step manager
 */
export function createSpinner(options: AppInitSpinnerOptions): SpinnerInstance {
	const { text, indicator = "dots", color = "brand", quiet } = options;

	const quietMode = options.quiet || isCI() || !isTTY;

	// normalize color function safely
	const colorize = (msg: string) => {
		if (typeof color === "function") return color(msg);

		// use theme if color exists there, otherwise fallback to appColor
		if ((theme as any)[color]) return (theme as any)[color](msg);

		if (appColor[color as AppInitColor]) {
			return appColor[color as AppInitColor](msg);
		}

		return msg; // fallback: no color
	};

	// -------------------------------------------------------------------------
	// QUIET MODE — CI, logs, piping, or non-TTY terminals
	// -------------------------------------------------------------------------
	if (quietMode) {
		console.log(theme.dim(`› ${text}`));

		return {
			start() {}, // noop
			stop(_msg?: string) {},

			success(msg?: string) {
				console.log(theme.success(`✔ ${msg ?? text}`));
			},

			error(msg?: string) {
				console.log(theme.danger(`✖ ${msg ?? text}`));
			},

			message(msg: string) {
				console.log(theme.dim(`› ${msg}`));
			},
		};
	}

	// -------------------------------------------------------------------------
	// INTERACTIVE MODE — Normal terminal with full spinner
	// -------------------------------------------------------------------------
	const spin = clackSpinner({ indicator });
	// spin.start(colorize(text));

	return {
		start(msg?: string) {
			spin.start(colorize(msg ?? text));
		},
		stop(msg?: string) {
			spin.stop(colorize(msg ?? text));
		},

		success(msg?: string) {
			spin.stop(theme.success(msg ?? text));
		},

		error(msg?: string) {
			spin.stop(theme.danger(msg ?? text));
		},

		message(msg: string) {
			spin.message(colorize(msg));
		},
		run: async <T>(fn: () => Promise<T>) => {
			try {
				const result = await fn();
				spin.stop(theme.success(text));
				return result;
			} catch (err) {
				spin.stop(theme.danger(text));
				throw err;
			}
		},
	};
}
