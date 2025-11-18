export function supportsUnicode(): boolean {
	if (process.platform === "win32") return Boolean(process.env.TERM);
	return process.env.LC_ALL !== "C" && process.env.LC_ALL !== "POSIX";
}
