export async function afterHook(ctx) {
  const projectName = ctx.variables?.projectName || "next-app";

  ctx.logger.info("");
  ctx.logger.info("🎉 Next.js App Router + TypeScript project created successfully!");
  ctx.logger.info("");
  ctx.logger.info(`📁 Location: ${ctx.paths?.targetRoot}`);
  ctx.logger.info("");
  ctx.logger.info("Next steps:");
  ctx.logger.info(`  1. cd ${projectName}`);
  ctx.logger.info("  2. npm install   # or pnpm / yarn");
  ctx.logger.info("  3. npm run dev   # start dev server");
  ctx.logger.info("");
  ctx.logger.info("ℹ️ Use `appinit add <plugin>` to install features like auth, ci/cd, db, testing, etc.");
  ctx.logger.info("");
  ctx.logger.success("Template generation completed.");
}
