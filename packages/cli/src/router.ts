export async function route(argv: string[]) {
	const [maybeCmd, ...rest] = argv;

	// support: `appinit new ` and appinit with no args -> help
	const cmd = maybeCmd ?? "help";

	// dispatch
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
		"AppInit CLI — usage: appinit <command> [options]\nCommands: new, init, doctor",
	);
}
