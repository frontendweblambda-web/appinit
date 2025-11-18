import util from "util";
import process from "node:process";
import kleur from "kleur";

// Available log levels in increasing severity
export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

const levelWeights: Record<LogLevel, number> = {
	debug: 10,
	info: 20,
	warn: 30,
	error: 40,
	silent: 100,
};

// safe JSON stringify to avoid circular refs
function safeJson(obj: any) {
	try {
		return JSON.stringify(obj);
	} catch {
		return util.inspect(obj, { colors: false, depth: 4 });
	}
}

const envLevel = (process.env.APPINIT_LOG_LEVEL as LogLevel) || "info";
const jsonMode = process.env.APPINIT_LOG === "json";
const colorEnabled = process.env.NO_COLOR !== "1";

// return whether a level should print
function canLog(level: LogLevel) {
	return levelWeights[level] >= levelWeights[envLevel];
}

// kleur color mapping per level
const levelColor: Record<LogLevel, (msg: string) => string> = {
	debug: kleur.blue,
	info: kleur.cyan,
	warn: kleur.yellow,
	error: kleur.red,
	silent: (msg) => msg, // unused
};

function format(level: LogLevel, message: string, meta?: any) {
	const ts = new Date().toISOString();

	// JSON structured logs for machines
	if (jsonMode) {
		return safeJson({ ts, level, message, meta });
	}

	// human-readable format
	const levelLabel = colorEnabled
		? levelColor[level](level.toUpperCase())
		: level.toUpperCase();

	const inspectedMeta = meta
		? " " + util.inspect(meta, { colors: colorEnabled, depth: 4 })
		: "";

	return `${kleur.gray(ts)} ${levelLabel} ${kleur.bold(
		message,
	)}${inspectedMeta}`;
}

export const logger = {
	debug: (msg: string, meta?: any) => {
		if (canLog("debug")) console.debug(format("debug", msg, meta));
	},
	info: (msg: string, meta?: any) => {
		if (canLog("info")) console.info(format("info", msg, meta));
	},
	warn: (msg: string, meta?: any) => {
		if (canLog("warn")) console.warn(format("warn", msg, meta));
	},
	error: (msg: string, meta?: any) => {
		if (canLog("error")) console.error(format("error", msg, meta));
	},

	// "step" marker, nicer visual clarity
	step: (msg: string) => {
		if (canLog("info"))
			console.info(format("info", `${kleur.bold("▶")} ${msg}`));
	},
};

export default logger;
