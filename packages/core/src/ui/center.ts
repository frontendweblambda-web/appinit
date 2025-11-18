import { termWidth } from "../env";

export function center(text: string) {
	const width = termWidth || 80;
	return text
		.split("\n")
		.map((line) =>
			line.trim() ? line.padStart((width + line.length) / 2) : "",
		)
		.join("\n");
}
