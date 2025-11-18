export function shouldDisplayColor(): boolean {
	if ("NO_COLOR" in process.env) return false;
	if (process.env.TERM === "dumb") return false;
	return process.stdout.isTTY;
}
