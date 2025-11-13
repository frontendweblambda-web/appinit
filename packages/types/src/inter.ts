import type { Answers } from "./answers.js";

export const isFrontend = (a: Answers) =>
	a.type === "frontend" || a.type === "fullstack";
export const isBackend = (a: Answers) =>
	a.type === "backend" || a.type === "fullstack";
export const isStaticFrontend = (a: Answers) =>
	isFrontend(a) && a.deploymentStrategy === "static";
export const isServerlessBackend = (a: Answers) =>
	isBackend(a) && a.backendDeployTarget === "lambda";

// FILE: src/index.ts
export * from "./common.js";
export * from "./frontend.js";
export * from "./backend.js";
export * from "./auth.js";
export * from "./deploy.js";
export * from "./answers.js";
export * from "./engine";
export * from "./git";

export * from "./install.js";
export * from "./template.js";
export * from "./template/file.js";
export * from "./plugin.js";
export * from "./registry.js";
export * from "./marketplace.js";
export * from "./project.js";
export * from "./workspace.js";
export * from "./validation.js";
export * from "./errors.js";
export * from "./events.js";
export * from "./infer.js";
