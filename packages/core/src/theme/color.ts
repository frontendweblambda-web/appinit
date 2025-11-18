// @appinit/utils/theme/color.ts
import kleur from "kleur";

// base unthemed color functions
export const color = {
	brand: kleur.cyan,
	primary: kleur.cyan,
	success: kleur.green,
	danger: kleur.red,
	warning: kleur.yellow,
	info: kleur.blue,
	dim: kleur.gray,

	bold: (txt: string) => kleur.bold(txt),
	italic: (txt: string) => kleur.italic(txt),
	underline: (txt: string) => kleur.underline(txt),

	// composition helper
	apply:
		(...fns: Array<(x: string) => string>) =>
		(text: string) =>
			fns.reduce((acc, fn) => fn(acc), text),
};
