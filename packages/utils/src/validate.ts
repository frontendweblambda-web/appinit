/**
 * Validate project name
 * @param name
 * @returns
 */
export function validateName(input: string): true | string {
	if (!input || typeof input !== "string") return "Name cannot be empty";
	const name = input.trim();
	if (!name.length) return "Name cannot be empty";
	if (/\s/.test(name)) return "Spaces are not allowed — use dash or underscore";
	if (/[A-Z]/.test(name))
		return "Use lowercase letters only (npm package rule)";
	if (/[~'!()*]/.test(name))
		return "Name contains forbidden characters ~ ' ! ( ) *";
	if (/[<>:\"\\|?*]/.test(name))
		return 'Name contains Windows-forbidden characters < > : " \\ | ? *';
	if (/[/.]$/.test(name)) return "Name cannot end with a dot or slash";
	if (name.startsWith("@")) {
		if (!/^@[a-z0-9\-_]+\/[a-z0-9\-_]+$/.test(name))
			return "Invalid scoped package. Use @scope/name";
	} else {
		if (!/^[a-z0-9\-_]+$/.test(name))
			return "Use only letters, numbers, dash (-), and underscore (_)";
	}
	const reserved = [
		"node_modules",
		"favicon",
		"core",
		"con",
		"aux",
		"nul",
		"prn",
	];
	if (reserved.includes(name.toLowerCase()))
		return `"${name}" is a reserved name`;
	return true;
}
