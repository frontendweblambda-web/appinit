// @appinit/utils/ui/header.ts
import { Flags } from "@appinit/types";
import { isCI, isInteractive, isTTY, termWidth } from "../env";
import { theme } from "../theme/index";
import { printAnimatedLogo } from "./logo";
import { center } from "./center";
import { gradient } from "../theme/gradient";
import { checkUpdate } from "../utils/update-check";

const APP_NAME = "AppInit OS";
const DEFAULT_SUBTITLE = "Developer Operating System";
let printedOnce = false;

interface HeaderOptions {
	flags?: Flags;
	version?: string;
	subtitle?: string;
	ascii?: boolean;
	force?: boolean;
	compact?: boolean; // manual override
}
export async function printHeader(options: HeaderOptions) {
	if (printedOnce || isCI() || !isTTY) return;
	printedOnce = true;

	console.log("");

	const showFull = (await isInteractive(options.flags!)) && termWidth >= 72;

	if (showFull) {
		await printAnimatedLogo();
		console.log("");
	}

	// Centered title block
	console.log("AppInit OS — Developer Operating System");
	console.log(theme.dim(`v${options.version}`));

	// Update check
	const latest = checkUpdate(options.version!);
	if (latest) {
		console.log("");
		console.log(
			theme.warning(
				`┌──────────────────────────────────────────────────────────────┐
│ Update available: ${options.version!} → ${latest}                     │
│ Run: npm i -g @appinit/cli                                   │
└──────────────────────────────────────────────────────────────┘`,
			),
		);
	}

	console.log("");
}
