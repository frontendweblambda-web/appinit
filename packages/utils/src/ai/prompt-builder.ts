export function buildPrompt(
	sections: Array<{ title?: string; content: string }>,
) {
	return sections
		.map((s) => (s.title ? `${s.title}\n${s.content}` : s.content))
		.join("\n\n");
}
