import { defineConfig } from "tsup";

const isDev = process.env.npm_lifecycle_event === "dev";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm", "cjs"], // keep if you need dual-format consumers
	dts: true,
	minify: false, // keep readable — core debugging matters
	target: "node18",
	clean: true,
	sourcemap: isDev,
	splitting: false, // true only if multiple entry points in the future
	outDir: "dist",
	shims: false,
	treeshake: true, // ensures better dead-code elimination
	onSuccess: isDev ? "node dist/index.js" : undefined,
});
