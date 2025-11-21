// @appinit/utils/theme/color.ts
import { AppInitColor } from "@appinit/types";
import kleur from "kleur";

// base unthemed color functions
export const appColor: Record<AppInitColor, (txt: string) => string> = {
	brand: kleur.cyan,
	primary: kleur.cyan,
	success: kleur.green,
	danger: kleur.red,
	warning: kleur.yellow,
	info: kleur.blue,
	dim: kleur.gray,

	red: kleur.red,
	green: kleur.green,
	yellow: kleur.yellow,
	blue: kleur.blue,
	cyan: kleur.cyan,
	magenta: kleur.magenta,
	gray: kleur.gray,

	// Bright colors
};

export const appBg = {
	bgRed: kleur.bgRed,
	bgGreen: kleur.bgGreen,
	bgYellow: kleur.bgYellow,
	bgBlue: kleur.bgBlue,
	bgMagenta: kleur.bgMagenta,
	bgCyan: kleur.bgCyan,
	bgWhite: kleur.bgWhite,
	bgBlack: kleur.bgBlack,
};

export const appStyle = {
	bold: (txt: string) => kleur.bold(txt),
	italic: (txt: string) => kleur.italic(txt),
	underline: (txt: string) => kleur.underline(txt),

	// composition helper
	apply:
		(...fns: Array<(x: string) => string>) =>
		(text: string) =>
			fns.reduce((acc, fn) => fn(acc), text),
};
