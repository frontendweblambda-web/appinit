import kleur from "kleur";

export function gradient(text: string): string {
	const colors = [kleur.magenta, kleur.blue, kleur.cyan];
	return text
		.split("")
		.map((char, i) => colors[i % colors.length](char))
		.join("");
}
