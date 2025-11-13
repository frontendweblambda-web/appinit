import util from "util";

export type LogLevel = "debug" | "info" | "warn" | "error";

const enabled = process.env.APPINIT_LOG !== "silent";
const jsonMode = process.env.APPINIT_LOG === "json";

function format(level: LogLevel, message: string, meta?: any) {
	const ts = new Date().toISOString();
	if (jsonMode) return JSON.stringify({ ts, level, message, meta });
	return `[appinit] ${ts} ${level.toUpperCase()} - ${message}${meta ? " " + util.inspect(meta) : ""}`;
}

export const logger = {
	debug: (msg: string, meta?: any) =>
		enabled && console.debug(format("debug", msg, meta)),
	info: (msg: string, meta?: any) =>
		enabled && console.info(format("info", msg, meta)),
	warn: (msg: string, meta?: any) =>
		enabled && console.warn(format("warn", msg, meta)),
	error: (msg: string, meta?: any) =>
		enabled && console.error(format("error", msg, meta)),
	step: (msg: string) => enabled && console.info(format("info", `▶ ${msg}`)),
};

export default logger;
