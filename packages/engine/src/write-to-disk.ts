import { EngineContext } from "@appinit/types";
import path from "path";

export async function writeFilesToDisk(ctx: EngineContext) {
	for (const [rel, content] of ctx.template.files!) {
		const abs = path.join(ctx.targetDir, rel);
		await ctx.utils.ensureDir(path.dirname(abs));
		await ctx.utils.writeFileUtf8(abs, content);
	}
}
