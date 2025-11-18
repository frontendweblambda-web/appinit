// @appinit/utils/theme/palettes.ts
import kleur from "kleur";

export const palettes = {
	default: {
		brand: (s: string) => kleur.cyan().bold(s),
		primary: (s: string) => kleur.cyan(s),
		success: (s: string) => kleur.green().bold(s),
		danger: (s: string) => kleur.red().bold(s),
		warning: (s: string) => kleur.yellow().bold(s),
		info: (s: string) => kleur.blue(s),
		dim: (s: string) => kleur.gray(s),
	},

	dark: {
		brand: (s: string) => kleur.magenta().bold(s),
		primary: (s: string) => kleur.white(s),
		success: (s: string) => kleur.green(s),
		danger: (s: string) => kleur.red(s),
		warning: (s: string) => kleur.yellow(s),
		info: (s: string) => kleur.cyan(s),
		dim: (s: string) => kleur.gray(s),
	},

	neon: {
		brand: (s: string) => kleur.magenta().bold().underline(s),
		primary: (s: string) => kleur.green().bold(s),
		success: (s: string) => kleur.cyan().bold(s),
		danger: (s: string) => kleur.red().bold(s),
		warning: (s: string) => kleur.yellow().bold().underline(s),
		info: (s: string) => kleur.blue().bold(s),
		dim: (s: string) => kleur.gray(s),
	},

	mono: {
		brand: (s: string) => s,
		primary: (s: string) => s,
		success: (s: string) => s,
		danger: (s: string) => s,
		warning: (s: string) => s,
		info: (s: string) => s,
		dim: (s: string) => s,
	},
} as const;

export type ThemeName = keyof typeof palettes;
export type ThemeShape = typeof palettes.default;
