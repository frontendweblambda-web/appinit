import { EngineContext } from "@appinit/types";

export async function runPackageInstall(ctx: EngineContext) {
	// if (!ctx.answers.autoInstall) return;
	console.log("I AM RUning...");
	await ctx.pkg.install({ cwd: ctx.targetDir });
}
