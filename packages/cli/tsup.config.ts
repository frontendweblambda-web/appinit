import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: false,
	splitting: false,
	sourcemap: false,
	clean: true,
	outDir: "dist",
	noExternal: [
		"@appinit/config",
		"@appinit/engine",
		"@appinit/prompt",
		"@appinit/template-resolver",
		"@appinit/utils",
		"@appinit/types",
	],
});
