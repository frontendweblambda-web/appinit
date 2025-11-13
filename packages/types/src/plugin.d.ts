import { TemplateFile, TransformContext } from "./file.js";
export interface PluginContext {
	cwd: string;
	answers: import("./answers.js").Answers;
	engine: import("./engine/context.js").EngineContext;
	logger: Console;
}
export interface AppinitPlugin {
	id: string;
	version?: string;
	apply(ctx: PluginContext): void | Promise<void>;
	hooks?: Partial<{
		onPrompt(
			answers: Partial<import("./answers.js").Answers>,
		): void | Promise<void>;
		onTransform(ctx: TransformContext): void | Promise<void>;
		onFile(
			file: TemplateFile,
			ctx: TransformContext,
		): TemplateFile | void | Promise<TemplateFile | void>;
		onComplete(
			ctx: import("./engine/context.js").EngineContext,
		): void | Promise<void>;
	}>;
}
