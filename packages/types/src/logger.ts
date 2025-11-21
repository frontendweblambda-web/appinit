import { AppInitColor } from "./spinner";

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";
const levelWeights: Record<LogLevel, number> = {
	debug: 10,
	info: 20,
	warn: 30,
	error: 40,
	silent: 100,
};

export interface Logger {
	debug(msg: string, meta?: any, context?: string, color?: AppInitColor): void;
	info(msg: string, meta?: any, context?: string, color?: AppInitColor): void;
	warn(msg: string, meta?: any, context?: string, color?: AppInitColor): void;
	error(msg: string, meta?: any, context?: string, color?: AppInitColor): void;
	step(msg: string, context?: string, color?: AppInitColor): void;
	title(msg: string, context?: string, color?: AppInitColor): void;
	success(
		msg: string,
		meta?: any,
		context?: string,
		color?: AppInitColor,
	): void;
}

export interface LoggerOptions {
	level?: LogLevel;
	json?: boolean; // machine-readable output
	colors?: boolean; // enable/disable colors
	debug?: boolean; // force debug messages
}
