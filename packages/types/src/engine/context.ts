// --- src/engine/context.ts (Synchronized) ---

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
	run: (
		cmd: string,
		args: string[],
		opts?: {
			cwd?: string | undefined;
			env?: NodeJS.ProcessEnv | undefined;
		},
	) => Promise<unknown>;
}
