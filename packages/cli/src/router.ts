export async function route(argv: string[]) {
	const [maybeCmd, ...rest] = argv;

	// support: `appinit new` and plain `appinit` -> help
	const cmd = maybeCmd ?? "help";

	switch (cmd) {
		case "new":
			return cmdNew(rest);

		case "init":
			return cmdInit(rest);

		case "doctor":
			return cmdDoctor(rest);

		case "help":
		default:
			return showHelp();
	}
}

function showHelp() {
	console.log(
		[
			"AppInit CLI",
			"",
			"Usage:",
			"  appinit <command> [options]",
			"",
			"Commands:",
			"  new       Scaffold a new project",
			"  init      Convert existing project",
			"  doctor    Check environment",
			"  help      Show usage",
		].join("\n"),
	);
}
