export * from "./define-config.js";
export * from "./load-config.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const configPaths = {
	react: path.join(__dirname, "..", "react"),
	next: path.join(__dirname, "..", "next"),
	vue: path.join(__dirname, "..", "vue"),
	shared: path.join(__dirname, "..", "shared"),
};
