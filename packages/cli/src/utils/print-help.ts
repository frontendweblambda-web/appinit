export function printHelp(version?: string) {
	console.log(`AppInit OS — Developer Operating System`);
	if (version) console.log(`v${version}`);
	console.log("");
	console.log(`Usage:
  appinit create <project-name>   Create project (guided or fast)
  appinit add <capability>        Add AI, DB, auth, UI, etc.
  appinit doctor                  Analyze & validate project
  appinit deploy                  Deploy via supported targets
  appinit ai                      AI engineering helpers

Example:
  appinit create my-app
`);
}
