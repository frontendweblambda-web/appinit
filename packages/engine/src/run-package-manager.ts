import { EngineContext } from "@appinit/types";

export async function runPackageInstall(ctx: EngineContext) {
	if (!ctx.answers.autoInstall) return;
	await ctx.pkg.install({ cwd: ctx.targetDir });
}
