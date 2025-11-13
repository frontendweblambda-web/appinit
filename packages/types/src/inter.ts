import type { Answers } from "./answers";

export const isFrontend = (a: Answers) =>
	a.type === "frontend" || a.type === "fullstack";
export const isBackend = (a: Answers) =>
	a.type === "backend" || a.type === "fullstack";
export const isStaticFrontend = (a: Answers) =>
	isFrontend(a) && a.deploymentStrategy === "static";
export const isServerlessBackend = (a: Answers) =>
	isBackend(a) && a.backendDeployTarget === "lambda";

// FILE: src/index.ts
