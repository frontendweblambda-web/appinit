export async function after(ctx:any) {
   ctx.log.info("✔ after hook running…");

  // Example: Auto install deps
  if (ctx.answers.autoInstall && ctx.run) {
    await ctx.run(ctx.packageManager, ["install"], { cwd: ctx.targetDir });
  }

  // Example: Initialize git
  // await ctx.run("git", ["init"], { cwd: ctx.targetDir });
}
