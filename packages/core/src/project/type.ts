import { Answers } from "@appinit/types";

export const isFrontend = (a: Answers) =>
	a.projectType === "frontend" || a.projectType === "fullstack";

export const isBackend = (a: Answers) =>
	a.projectType === "backend" || a.projectType === "fullstack";

export const isStaticFrontend = (a: Answers) =>
	isFrontend(a) && a.deploymentStrategy === "static";

export const isServerlessBackend = (a: Answers) =>
	isBackend(a) && a.backendDeployTarget === "lambda";

export const isFullstack = (a: Answers) => a.projectType === "fullstack";
export const isLibrary = (a: Answers) => a.projectType === "library";

export const isCliProject = (input: { projectType?: string }): boolean =>
	input.projectType === "cli";

export const isPluginProject = (input: { projectType?: string }): boolean =>
	input.projectType === "plugin";
