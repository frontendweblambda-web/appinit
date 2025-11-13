export interface SharedLibrary {
	id: string;
	name: string;
	version: string;
	type: "ui" | "utils" | "api" | "data-model";
	components?: string[];
}
