export async function projectPrompt() {
	return await inquirer.prompt([
		{
			type: "input",
			name: "projectName",
			message: "🧱 Project name:",
			default: defaultName || flags.projectName || "my-codex-app",
			validate: validateScaffoldName,
			when: !(defaultName || flags.projectName),
		},
		{
			type: "input",
			name: "description",
			message: "📝 Short description:",
			default: flags.description || "",
		},
		{
			type: "input",
			name: "author",
			message: "👤 Author (name/email):",
			default: flags.author || "",
		},
		{
			type: "list",
			name: "license",
			message: "📜 License:",
			choices: ["MIT", "Apache-2.0", "GPL-3.0", "Unlicense", "Other"],
			default: flags.license || "MIT",
		},
		{
			type: "input",
			name: "packageScope",
			message: "📦 Package scope (optional, without @):",
			default: flags.packageScope || "",
			filter: (v: string) => (v ? `@${v}` : null),
		},
	]);
}
