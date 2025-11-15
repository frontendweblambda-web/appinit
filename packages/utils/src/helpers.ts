import { JsonObject, JsonArray, Answers } from "@appinit/types";
// ----------------------------------------------
// Helpers
// ----------------------------------------------
export function isObject(v: unknown): v is JsonObject {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function isArray(v: unknown): v is JsonArray {
	return Array.isArray(v);
}

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
