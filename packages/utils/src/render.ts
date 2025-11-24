export function renderTemplate(
	content: string,
	vars: Record<string, any>,
): string {
	return content.replace(/%%\s*([a-zA-Z0-9_.-]+)\s*%%/g, (match, expr) => {
		const path = String(expr).trim();
		if (!path) return match;

		const parts = path.split(".");
		let current: any = vars;

		for (const part of parts) {
			if (
				current &&
				typeof current === "object" &&
				Object.prototype.hasOwnProperty.call(current, part)
			) {
				current = current[part];
			} else {
				current = undefined;
				break;
			}
		}

		if (current === undefined || current === null) {
			return "";
		}

		return String(current);
	});
}
