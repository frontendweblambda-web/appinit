// template/appinit.template.ts

// Variables pipeline
import { defaults } from "./variables/defaults";
import { schema } from "./variables/schema";
import { transformVariables } from "./variables/transform";

// Hooks
import { beforeHook } from "./hooks/before";
import { afterHook } from "./hooks/after";

const config = {
  id: "next-app-router-ts",
  version: "1.0.0",
  appinitSpec: "1.0",

  //
  // 1. VARIABLES
  //
  variables: {
    defaults,
    schema,
    transform:transformVariables
  },

  //
  // 2. FILTERS – TS-only template
  //
  filters: {
    "**/*.ts__tmpl": (ctx) =>
      ctx?.variables?.language === "ts",
    "**/*.tsx__tmpl": (ctx) =>
      ctx?.variables?.language === "ts",

    // Example: only include README if feature enabled
    "README.md__tmpl": (ctx) =>
      ctx?.variables?.features?.readme !== false
  },

  //
  // 3. HOOKS
  //
  hooks: {
    before: beforeHook,
    after: afterHook,
  },

  //
  // 4. INJECTION (empty for base template)
  //
  inject: {},

  //
  // 5. RESOLVERS – rename _gitignore → .gitignore
  //
  resolvers: {
    rename: {
      "_gitignore": ".gitignore"
    }
  }
};

export default config;
