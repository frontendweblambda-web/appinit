// @appinit/utils/theme/state.ts
import { palettes, ThemeName, ThemeShape } from "./palettes";

let currentTheme: ThemeName = "default";

export const setTheme = (name: ThemeName) => {
	if (palettes[name]) currentTheme = name;
};

export const theme = new Proxy({} as ThemeShape, {
	get(_, key: keyof ThemeShape) {
		return palettes[currentTheme][key];
	},
});
