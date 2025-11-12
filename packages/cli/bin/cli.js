#!/usr/bin/env node

// This ensures the node environment runs the compiled JavaScript logic.
// The build process (npm run build) compiles src/index.ts to dist/index.js.
import("./dist/index.js");
