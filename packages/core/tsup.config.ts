import { defineConfig } from "tsup";

const isDev = process.env.npm_lifecycle_event === "dev";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"], // ESM only (best for AppInit)
	dts: true,
	minify: false, // preserve readable core output
	target: "es2022", // ✨ more accurate for ESM
	clean: true,
	sourcemap: isDev,
	splitting: false,
	outDir: "dist",
	shims: false,
	treeshake: true,
	skipNodeModulesBundle: true, // ✨ important for ESM monorepo
	external: ["fs-extra"], // ✨ required if using fs-extra
	onSuccess: isDev ? "node dist/index.js" : undefined,
});
