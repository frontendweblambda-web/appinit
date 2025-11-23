export async function afterHook(ctx) {
  const projectName = ctx.variables?.projectName || "your-app";

  ctx.logger.info("");
  ctx.logger.info("🎉 React + Vite + TypeScript project created successfully!");
  ctx.logger.info("");
  ctx.logger.info(`📁 Location: ${ctx.paths?.targetRoot}`);
  ctx.logger.info("");

  // 1. Next steps
  ctx.logger.info("Next steps:");
  ctx.logger.info(`  1. cd ${projectName}`);
  ctx.logger.info("  2. npm install   # or yarn / pnpm");
  ctx.logger.info("  3. npm run dev   # start the dev server");
  ctx.logger.info("");

  // 2. Plugin hints
  ctx.logger.info("ℹ️ Use `appinit add <plugin>` to install features like:");
  ctx.logger.info("    - auth");
  ctx.logger.info("    - ci/cd");
  ctx.logger.info("    - database");
  ctx.logger.info("    - testing");
  ctx.logger.info("");

  // 3. Final success message
  ctx.logger.success("Template generation completed.");
}
