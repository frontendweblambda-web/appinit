// @appinit/core/logger/index.ts
import process from "node:process";
import util from "node:util";
import { appStyle, theme } from "../theme"; // ★ unified theme system

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

const levelWeights: Record<LogLevel, number> = {
	debug: 10,
	info: 20,
	warn: 30,
	error: 40,
	silent: 100,
};

const envLevel: LogLevel =
	(process.env.APPINIT_LOG_LEVEL as LogLevel) || "info";

const jsonMode = process.env.APPINIT_LOG === "json";
const colorEnabled = process.env.NO_COLOR !== "1";
const debugEnabled = process.env.APPINIT_DEBUG === "1";

function canLog(level: LogLevel) {
	return levelWeights[level] >= levelWeights[envLevel];
}

function safeMeta(meta: any) {
	if (!meta) return "";
	return util.inspect(meta, {
		colors: colorEnabled,
		depth: 4,
	});
}

function format(level: LogLevel, message: string, meta?: any) {
	const ts = new Date().toISOString();

	// JSON logging for marketplace or machine usage
	if (jsonMode) {
		return JSON.stringify({ ts, level, message, meta });
	}

	const lvl = colorEnabled
		? theme[
				level === "error"
					? "danger"
					: level === "warn"
						? "warning"
						: level === "debug"
							? "info"
							: "primary"
			](level.toUpperCase())
		: level.toUpperCase();

	const metaStr = meta ? " " + safeMeta(meta) : "";
	const tsStr = colorEnabled ? theme.dim(ts) : ts;

	return `${tsStr} ${lvl} ${appStyle.bold(message)}${metaStr}`;
}

export const logger = {
	debug(msg: string, meta?: any) {
		if (debugEnabled && canLog("debug"))
			console.debug(format("debug", msg, meta));
	},

	info(msg: string, meta?: any) {
		if (canLog("info")) console.info(format("info", msg, meta));
	},

	warn(msg: string, meta?: any) {
		if (canLog("warn")) console.warn(format("warn", msg, meta));
	},

	error(msg: string, meta?: any) {
		if (canLog("error")) console.error(format("error", msg, meta));
	},

	step(msg: string) {
		if (canLog("info"))
			console.info(format("info", `${theme.primary("▶")} ${msg}`));
	},

	title(msg: string) {
		console.log(
			"\n" + theme.brand(appStyle.bold(`🚀 ${msg.toUpperCase()}`)) + "\n",
		);
	},

	success(msg: string) {
		console.log("\n" + theme.success(appStyle.bold(`🚀 ${msg}`)) + "\n");
	},
};

export default logger;
