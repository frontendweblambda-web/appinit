import { EngineContext } from "@appinit/types";

export async function renderTemplates(ctx: EngineContext) {
	for (const [file, content] of [...ctx.template.files!.entries()]) {
		const rendered = ctx.utils.renderTemplate(content, ctx.variables);
		ctx.template.files!.set(file, rendered);
	}
}
