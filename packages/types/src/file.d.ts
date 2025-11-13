export interface TemplateFile {
	path: string;
	contents: string | Buffer;
	overwrite?: boolean;
	encoding?: "utf8" | "binary" | string;
	mode?: "text" | "binary";
}
export interface TransformContext {
	file: TemplateFile;
	engine: import("./engine/context").EngineContext;
	answers: import("./answers").Answers;
}
