// --- src/engine/context.ts (Synchronized) ---

import { log } from "@clack/prompts";
import { Variables } from "../common";
import { Flags } from "../flags";
import { PackageManagerAPI } from "../package-manager";
import type { AppinitPlugin } from "../plugin";
import { PromptResult } from "../prompt";
import type { ResolvedTemplate } from "../template";

export interface EngineContext {
	targetDir: string;
	answers: PromptResult;
	template: ResolvedTemplate;
	pkg: PackageManagerAPI;
	plugins?: AppinitPlugin[];
	files?: Map<string, string>;
	variables?: Variables;
	run: (
		cmd: string,
		args: string[],
		opts?: {
			cwd?: string | undefined;
			env?: NodeJS.ProcessEnv | undefined;
		},
	) => Promise<unknown>;
}

export interface Engine {
	dryRun?: boolean;
	force?: boolean;
	logger: typeof log;
	answers: PromptResult;
}
export interface AppEngineContext {
	variables: Record<string, any>;
	answers: Record<string, any>;

	paths: {
		templateRoot: string;
		tempDir: string;
		targetRoot: string;
	};

	flags: Flags;

	logger: typeof log;

	// scratchpad storage for hooks
	set: (key: string, value: any) => void;
	get: (key: string) => any;
}
