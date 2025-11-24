// template/appinit.template.ts

// Variables pipeline
import { defaults } from "./variables/defaults.ts";
import { schema } from "./variables/schema.ts";
import { transform } from "./variables/transform.ts";

// Template lifecycle hooks
import { afterHook } from "./hooks/after.ts";
import { beforeHook } from "./hooks/before.ts";

const config = {
	id: "react-vite-ts",
	version: "1.0.0",
	appinitSpec: "1.0",

	//
	// 1. VARIABLES
	//
	variables: {
		defaults,
		schema,
		transform,
	},

	//
	// 2. FILTERS — Must NOT use TS types
	//
	filters: {
filters: {
  // Always include TS/TSX files in this template
  "**/*.ts__tmpl": true,
  "**/*.tsx__tmpl": true,

  // Conditional feature example (optional)
  "src/App.tsx__tmpl": (ctx) => !!ctx?.variables?.features?.example ?? true,
},
	},

	//
	// 3. HOOKS — Pure, deterministic, no TS types inside hooks
	//
	hooks: {
		before: beforeHook,
		after: afterHook,
	},

	//
	// 4. INJECTION — Optional
	//
	inject: {
		// Example:
		// "src/App.tsx": {
		//   imports: ["import Banner from './Banner'"],
		//   append: ["<Banner />"],
		// },
	},

	//
	// 5. RESOLVERS — For special filename cases
	//
	resolvers: {
		rename: {
			_gitignore: ".gitignore",
		},
	},
};

export default config;
