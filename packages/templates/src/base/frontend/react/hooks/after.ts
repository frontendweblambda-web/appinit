export async function after(ctx:any) {
  ctx.log.info("React JS template: after hook");

  if (ctx.answers?.automation?.installDependencies) {
    await ctx.run(ctx.packageManager, ["install"], { cwd: ctx.targetDir });
  }
}
