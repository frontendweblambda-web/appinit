import { Architecture, Language, ProjectType } from "../common";

export interface AppInitSchema {
	projectName: string;
	projectType: ProjectType;
	language: Language;
	architecture?: Architecture;
	// ...other stable final keys
}
