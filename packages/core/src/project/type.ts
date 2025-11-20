import { ProjectType } from "@appinit/types";

export const isFrontend = (p: ProjectType): boolean => p === "frontend";
export const isFullstack = (p: ProjectType): boolean => p === "fullstack";
export const isBackend = (p: ProjectType): boolean => p === "backend";
export const isLibrary = (p: ProjectType): boolean => p === "library";
export const isCli = (p: ProjectType): boolean => p === "cli";

// export const is = (a: Answers) =>
// 	isFrontend(a) && a.deploymentStrategy === "static";

// export const isServerlessBackend = (a: Answers) =>
// 	isBackend(a) && a.backendDeployTarget === "lambda";

export const isPluginProject = (input: { projectType?: string }): boolean =>
	input.projectType === "plugin";
