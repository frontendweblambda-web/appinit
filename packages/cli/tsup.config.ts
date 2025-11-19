import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],

	// ESM ONLY — required for dynamic import + import.meta.url
	format: ["esm"],

	// CLI must NOT inline appinit workspace dependencies
	// because those must stay as external ESM modules
	external: [
		"@appinit/config",
		"@appinit/engine",
		"@appinit/prompt",
		"@appinit/template-resolver",
		"@appinit/utils",
		"@appinit/types",
		"@appinit/core",
		"@appinit/templates",
		"fs-extra",
		"minimatch",
	],

	// DO NOT bundle workspaces — very important
	noExternal: [], // leave empty or remove

	dts: false,
	splitting: false,
	sourcemap: false,
	clean: true,
	outDir: "dist",

	// CLI needs shebang preserved if present
	// banner: {
	// 	js: "#!/usr/bin/env node",
	// },

	// Prevent tsup from bundling imported JSON or assets incorrectly
	skipNodeModulesBundle: true,

	target: "node20",
	treeshake: true, // ensures better dead-code elimination
});
