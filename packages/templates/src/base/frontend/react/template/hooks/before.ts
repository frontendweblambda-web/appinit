

export async function beforeHook(ctx) {
  ctx.logger.info("🔧 Initializing React + Vite + TypeScript template…");

  //
  // 1. Validate Node version (enterprise requirement)
  //
  const nodeMajor = parseInt(process.versions.node.split(".")[0], 10);
  if (nodeMajor < 18) {
    throw new Error("This template requires Node.js >= 18.");
  }

  //
  // 2. Validate projectName (simple example)
  //
  const name = ctx.variables.projectName.trim();
  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    throw new Error(
      `Invalid project name "${name}". Project name must be alphanumeric, dashes or underscores only.`
    );
  }

  // 3. Add useful runtime metadata into ctx without types
  ctx.set("timestamp", Date.now());

  // 4. Debug mode support without types
  if (ctx.flags?.debug) {
    ctx.logger.info("Template variables:", ctx.variables);
  }

}
