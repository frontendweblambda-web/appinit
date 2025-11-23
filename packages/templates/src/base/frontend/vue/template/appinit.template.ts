// template/appinit.template.ts

// Variables pipeline
import { defaults } from "./variables/defaults";
import { schema } from "./variables/schema";
import { transform } from "./variables/transform";

// Template lifecycle hooks
import { beforeHook } from "./hooks/before";
import { afterHook } from "./hooks/after";

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
    // TS-only files
    "**/*.ts__tmpl": (ctx) =>
      ctx?.variables?.language === "ts",

    "**/*.tsx__tmpl": (ctx) =>
      ctx?.variables?.language === "ts",

    // Conditional feature
    "src/App.tsx__tmpl": (ctx) =>
      !!ctx?.variables?.features?.example,
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
      "_gitignore": ".gitignore",
    },
  },
};

export default config;
