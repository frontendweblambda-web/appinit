export type AppInitColor =
	| "brand"
	| "primary"
	| "success"
	| "danger"
	| "warning"
	| "info"
	| "dim"
	| "red"
	| "green"
	| "yellow"
	| "blue"
	| "cyan"
	| "magenta"
	| "gray";

export type ThemeName = "default" | "dark" | "neon" | "mono";

export interface SpinnerInstance {
	start(msg?: string): void;
	stop(msg?: string): void;
	success(msg?: string): void;
	error(msg?: string): void;
	message(msg: string): void;
	run?<T>(fn: () => Promise<T>): Promise<T>;
}

export interface AppInitSpinnerOptions {
	text: string;
	color?: AppInitColor | ((x: string) => string);
	indicator?: "dots" | "timer";
	quiet?: boolean;
}
