import ejs from "ejs";

/**
 * Very small fast EJS-based renderer
 */
export function renderTemplate(
	content: string,
	variables: Record<string, any>,
) {
	if (!content) return content;

	try {
		return ejs.render(content, variables, {
			async: false,
			rmWhitespace: false,
		});
	} catch (err) {
		console.error("❌ Template render error:", err);
		return content; // fail-safe
	}
}
