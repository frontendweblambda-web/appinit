import type { AppinitConfig } from "@appinit/types";

export function defineConfig<T extends AppinitConfig>(config: T): T {
	return config;
}
